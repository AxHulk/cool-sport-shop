import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface OrderPayload {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  city: string;
  address: string;
  delivery_method: string;
  payment_method: string;
  total_price: number;
  delivery_price: number;
  discount_amount: number;
  promo_code?: string;
  items: OrderItem[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const payload: OrderPayload = await req.json();

    // Validate required fields
    if (!payload.order_number || !payload.customer_name || !payload.customer_email || !payload.items?.length) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: payload.order_number,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_email: payload.customer_email,
        city: payload.city,
        address: payload.address,
        delivery_method: payload.delivery_method,
        payment_method: payload.payment_method,
        total_price: payload.total_price,
        delivery_price: payload.delivery_price,
        discount_amount: payload.discount_amount,
        promo_code: payload.promo_code || null,
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = payload.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    // 3. Reserve inventory
    for (const item of payload.items) {
      // Upsert inventory record, then increment reserved
      const { data: inv } = await supabase
        .from("products_inventory")
        .select("id, reserved")
        .eq("product_id", item.product_id)
        .eq("size", item.size)
        .eq("color", item.color)
        .maybeSingle();

      if (inv) {
        await supabase
          .from("products_inventory")
          .update({ reserved: inv.reserved + item.quantity })
          .eq("id", inv.id);
      }
    }

    // 4. Upsert customer
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, total_orders, total_spent")
      .eq("email", payload.customer_email)
      .maybeSingle();

    if (existingCustomer) {
      await supabase
        .from("customers")
        .update({
          name: payload.customer_name,
          phone: payload.customer_phone,
          total_orders: existingCustomer.total_orders + 1,
          total_spent: Number(existingCustomer.total_spent) + payload.total_price,
          last_order_at: new Date().toISOString(),
        })
        .eq("id", existingCustomer.id);
    } else {
      await supabase.from("customers").insert({
        email: payload.customer_email,
        name: payload.customer_name,
        phone: payload.customer_phone,
        total_orders: 1,
        total_spent: payload.total_price,
        last_order_at: new Date().toISOString(),
      });
    }

    // 5. Add history entry
    await supabase.from("order_history").insert({
      order_id: order.id,
      field_changed: "status",
      old_value: null,
      new_value: "new",
      changed_by: "system",
    });

    // 6. Send Telegram notification (fire-and-forget)
    try {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
      if (LOVABLE_API_KEY && TELEGRAM_API_KEY) {
        const items = payload.items.map(i => ({
          product_name: i.product_name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
        }));
        const tgText = `🛒 <b>Новый заказ №${payload.order_number}</b>\n\n👤 <b>Клиент:</b> ${payload.customer_name}\n📞 ${payload.customer_phone}\n📧 ${payload.customer_email}\n\n📦 <b>Доставка:</b> ${payload.delivery_method === 'courier' ? 'Курьер' : 'Пункт выдачи'}\n🏙 ${payload.city}${payload.address ? ', ' + payload.address : ''}\n\n💳 <b>Оплата:</b> ${payload.payment_method === 'card' ? 'Карта' : 'СБП'}\n\n<b>Товары:</b>\n${items.map((i, idx) => `  ${idx + 1}. ${i.product_name} (${i.size}, ${i.color}) ×${i.quantity} — ${i.price} ₽`).join('\n')}\n\n${payload.discount_amount > 0 ? `🏷 Скидка: -${payload.discount_amount} ₽\n` : ''}🚚 Доставка: ${payload.delivery_price === 0 ? 'Бесплатно' : payload.delivery_price + ' ₽'}\n💰 <b>Итого: ${payload.total_price} ₽</b>`;

        await fetch('https://connector-gateway.lovable.dev/telegram/sendMessage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'X-Connection-Api-Key': TELEGRAM_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chat_id: '8156387469', text: tgText, parse_mode: 'HTML' }),
        });
      }
    } catch (tgErr) {
      console.error('Telegram notification error:', tgErr);
    }

    return new Response(JSON.stringify({ success: true, order_id: order.id, order_number: payload.order_number }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
