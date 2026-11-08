// Shared: notify admin (Telegram + email) about final payment status.
// deno-lint-ignore no-explicit-any
export async function notifyPaymentStatus(supabase: any, order: {
  order_number: string; customer_name: string; customer_email: string;
  total_price: number | string; delivery_price: number | string | null;
}, result: "paid" | "cancelled", tinkoffStatus: string) {
  const finalTotal = Number(order.total_price) + Number(order.delivery_price || 0);
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    if (LOVABLE_API_KEY && TELEGRAM_API_KEY) {
      const tgText = result === "paid"
        ? `✅ <b>Оплачен заказ №${order.order_number}</b>\n\n👤 ${order.customer_name}\n📧 ${order.customer_email}\n💰 <b>${finalTotal.toLocaleString("ru-RU")} ₽</b>\n\n<i>Статус T-Kassa: ${tinkoffStatus}</i>`
        : `❌ <b>Заказ №${order.order_number} не оплачен</b>\n\n👤 ${order.customer_name}\n📧 ${order.customer_email}\n💰 ${finalTotal.toLocaleString("ru-RU")} ₽\n\n<i>Статус T-Kassa: ${tinkoffStatus}</i>`;
      const { data: subs } = await supabase.from("telegram_subscribers").select("chat_id").eq("is_active", true);
      const chatIds = subs && subs.length > 0 ? subs.map((s: { chat_id: string }) => s.chat_id) : ["8156387469"];
      await Promise.allSettled(chatIds.map((chat_id: string) =>
        fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": TELEGRAM_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chat_id, text: tgText, parse_mode: "HTML" }),
        })
      ));
    }
  } catch (e) {
    console.error("Telegram notify error:", e);
  }
  try {
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "admin-order-notification",
        recipientEmail: "asana.wear@yandex.ru",
        idempotencyKey: `admin-order-${order.order_number}-${result}`,
        templateData: {
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          totalPrice: Number(order.total_price),
          deliveryPrice: Number(order.delivery_price || 0),
          paymentStatus: result,
        },
      },
    });
  } catch (e) {
    console.error("Admin email notify error:", e);
  }
  if (result === "paid" && order.customer_email) {
    await sendCustomerPaidEmail(supabase, order.order_number, false);
  }
}

// Sends "order paid" email to customer once per order (unless force=true).
// deno-lint-ignore no-explicit-any
export async function sendCustomerPaidEmail(supabase: any, orderNumber: string, force: boolean): Promise<{ sent: boolean; reason?: string }> {
  try {
    const { data: full } = await supabase.from("orders").select("*")
      .eq("order_number", orderNumber).maybeSingle();
    if (!full?.customer_email) return { sent: false, reason: "no_email" };
    if (!force) {
      const { data: prev } = await supabase.from("email_send_log").select("id")
        .eq("template_name", "order-confirmation").eq("recipient_email", full.customer_email)
        .in("status", ["pending", "sent"]).gte("created_at", full.created_at).limit(1);
      if (prev && prev.length > 0) return { sent: false, reason: "already_sent" };
    }
    const { data: its } = await supabase.from("order_items")
      .select("product_name,size,color,quantity,price").eq("order_id", full.id);
    const items = (its || []).map((i: { product_name: string; size: string; color: string; quantity: number; price: number }) => ({
      name: i.product_name, size: i.size, color: i.color, quantity: i.quantity, price: Number(i.price) * i.quantity,
    }));
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "order-confirmation",
        recipientEmail: full.customer_email,
        idempotencyKey: `order-paid-${orderNumber}${force ? "-" + Date.now() : ""}`,
        templateData: {
          orderNumber,
          customerName: full.customer_name,
          items,
          totalPrice: Number(full.total_price),
          deliveryPrice: Number(full.delivery_price || 0),
          deliveryMethod: full.delivery_method || "",
          city: full.city || "",
          address: full.address || "",
          paymentMethod: full.payment_method || "",
          discountAmount: Number(full.discount_amount || 0),
          paid: true,
        },
      },
    });
    return { sent: true };
  } catch (e) {
    console.error("Customer email notify error:", e);
    return { sent: false, reason: "error" };
  }
}

export function mapPaymentResult(s: string): "paid" | "cancelled" | null {
  if (s === "CONFIRMED") return "paid";
  if (["REJECTED", "DEADLINE_EXPIRED", "CANCELED", "REVERSED", "REFUNDED", "PARTIAL_REFUNDED", "AUTH_FAIL"].includes(s)) return "cancelled";
  return null;
}
