import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotifyPayload {
  type: 'order' | 'contact';
  data: Record<string, unknown>;
}

function formatOrderMessage(data: Record<string, unknown>): string {
  const items = (data.items as Array<{ product_name: string; size: string; color: string; quantity: number; price: number }>) || [];
  const itemsText = items
    .map((i, idx) => `  ${idx + 1}. ${i.product_name} (${i.size}, ${i.color}) ×${i.quantity} — ${Number(i.price).toLocaleString('ru-RU')} ₽`)
    .join('\n');

  return `🛒 <b>Новый заказ №${data.order_number}</b>\n\n👤 <b>Клиент:</b> ${data.customer_name}\n📞 ${data.customer_phone}\n📧 ${data.customer_email}\n\n📦 <b>Доставка:</b> ${data.delivery_method === 'courier' ? 'Курьер' : 'Пункт выдачи'}\n🏙 ${data.city}${data.address ? ', ' + data.address : ''}\n\n💳 <b>Оплата:</b> ${data.payment_method === 'card' ? 'Карта' : 'СБП'}\n\n<b>Товары:</b>\n${itemsText}\n\n${Number(data.discount_amount) > 0 ? `🏷 Скидка: -${Number(data.discount_amount).toLocaleString('ru-RU')} ₽\n` : ''}🚚 Доставка: ${Number(data.delivery_price) === 0 ? 'Бесплатно' : Number(data.delivery_price).toLocaleString('ru-RU') + ' ₽'}\n💰 <b>Итого: ${Number(data.total_price).toLocaleString('ru-RU')} ₽</b>`;
}

function formatContactMessage(data: Record<string, unknown>): string {
  return `📩 <b>Новая заявка</b>\n\n👤 ${data.name || 'Не указано'}\n📞 ${data.phone || 'Не указан'}\n📧 ${data.email || 'Не указан'}\n\n${data.message ? `💬 ${data.message}` : ''}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
    if (!TELEGRAM_API_KEY) throw new Error('TELEGRAM_API_KEY is not configured');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get all active subscribers
    const { data: subscribers, error: subErr } = await supabase
      .from('telegram_subscribers')
      .select('chat_id')
      .eq('is_active', true);

    if (subErr) throw subErr;
    if (!subscribers?.length) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No active subscribers' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: NotifyPayload = await req.json();
    const text = payload.type === 'order'
      ? formatOrderMessage(payload.data)
      : formatContactMessage(payload.data);

    // Send to all subscribers
    const results = await Promise.allSettled(
      subscribers.map(sub =>
        fetch(`${GATEWAY_URL}/sendMessage`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'X-Connection-Api-Key': TELEGRAM_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chat_id: sub.chat_id, text, parse_mode: 'HTML' }),
        })
      )
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    return new Response(JSON.stringify({ success: true, sent, total: subscribers.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Telegram notify error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
