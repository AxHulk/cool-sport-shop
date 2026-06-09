// Edge function: receives payment status notifications from T-Kassa.
// Verifies Token, updates order.payment_status and order.status accordingly.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { createHash } from "node:crypto";

const PASSWORD = Deno.env.get("TINKOFF_PASSWORD")!;

function verifyToken(payload: Record<string, unknown>): boolean {
  const { Token, ...rest } = payload as { Token?: string };
  if (!Token) return false;
  const entries: [string, string][] = [];
  for (const [k, v] of Object.entries(rest)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "object") continue;
    // Tinkoff sends booleans as 'true'/'false' strings in token calc
    entries.push([k, typeof v === "boolean" ? String(v) : String(v)]);
  }
  entries.push(["Password", PASSWORD]);
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  const concat = entries.map((e) => e[1]).join("");
  const expected = createHash("sha256").update(concat).digest("hex");
  return expected === Token;
}

/** Map T-Kassa payment status → internal order status */
function mapOrderStatus(tinkoffStatus: string): string | null {
  switch (tinkoffStatus) {
    case "CONFIRMED":
    case "AUTHORIZED":
      return "paid";
    case "REJECTED":
    case "DEADLINE_EXPIRED":
    case "CANCELED":
    case "REVERSED":
    case "REFUNDED":
    case "PARTIAL_REFUNDED":
      return "cancelled";
    default:
      return null; // NEW/FORM_SHOWED/AUTHORIZING etc. — keep current
  }
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    console.log("Tinkoff webhook:", JSON.stringify(body));

    if (!verifyToken(body)) {
      console.error("Token verification failed");
      return new Response("BAD_TOKEN", { status: 400 });
    }

    const orderId: string = body.OrderId;
    const paymentId: string = String(body.PaymentId ?? "");
    const status: string = body.Status;

    if (!orderId) return new Response("OK");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const update: Record<string, unknown> = {
      payment_status: status,
      payment_id: paymentId || undefined,
    };
    const mapped = mapOrderStatus(status);
    if (mapped) update.status = mapped;

    const { data: existing } = await supabase
      .from("orders")
      .select("id, status, order_number, customer_name, customer_email, total_price, delivery_price")
      .eq("order_number", orderId)
      .maybeSingle();

    if (existing) {
      await supabase.from("orders").update(update).eq("id", existing.id);
      if (mapped && existing.status !== mapped) {
        await supabase.from("order_history").insert({
          order_id: existing.id,
          field_changed: "status",
          old_value: existing.status,
          new_value: mapped,
          changed_by: "tinkoff",
        });

        // Send admin Telegram notification about payment status change
        try {
          const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
          const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
          if (LOVABLE_API_KEY && TELEGRAM_API_KEY) {
            const finalTotal = Number(existing.total_price) + Number(existing.delivery_price || 0);
            const tgText = mapped === 'paid'
              ? `✅ <b>Оплачен заказ №${existing.order_number}</b>\n\n👤 ${existing.customer_name}\n📧 ${existing.customer_email}\n💰 <b>${finalTotal.toLocaleString('ru-RU')} ₽</b>\n\n<i>Статус T-Kassa: ${status}</i>`
              : `❌ <b>Заказ №${existing.order_number} не оплачен</b>\n\n👤 ${existing.customer_name}\n📧 ${existing.customer_email}\n💰 ${finalTotal.toLocaleString('ru-RU')} ₽\n\n<i>Статус T-Kassa: ${status}</i>`;

            // Send to all active subscribers
            const { data: subs } = await supabase
              .from('telegram_subscribers')
              .select('chat_id')
              .eq('is_active', true);

            const chatIds = (subs && subs.length > 0)
              ? subs.map((s: { chat_id: string }) => s.chat_id)
              : ['8156387469'];

            await Promise.allSettled(chatIds.map((chat_id) =>
              fetch('https://connector-gateway.lovable.dev/telegram/sendMessage', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                  'X-Connection-Api-Key': TELEGRAM_API_KEY,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chat_id, text: tgText, parse_mode: 'HTML' }),
              })
            ));
          }
        } catch (tgErr) {
          console.error('Telegram payment status notify error:', tgErr);
        }

        // Send admin email about payment status change
        try {
          await supabase.functions.invoke('send-transactional-email', {
            body: {
              templateName: 'admin-order-notification',
              recipientEmail: 'asana.wear@yandex.ru',
              idempotencyKey: `admin-order-${existing.order_number}-${mapped}`,
              templateData: {
                orderNumber: existing.order_number,
                customerName: existing.customer_name,
                customerEmail: existing.customer_email,
                totalPrice: Number(existing.total_price),
                deliveryPrice: Number(existing.delivery_price || 0),
                paymentStatus: mapped,
              },
            },
          });
        } catch (emailErr) {
          console.error('Admin payment status email error:', emailErr);
        }
      }
    }

    // T-Kassa expects literal "OK"
    return new Response("OK");
  } catch (e) {
    console.error("tinkoff-webhook error:", e);
    return new Response("ERROR", { status: 500 });
  }
});
