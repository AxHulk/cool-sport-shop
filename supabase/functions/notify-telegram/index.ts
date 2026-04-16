const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CHAT_ID = '8156387469';

interface NotifyPayload {
  type: 'order' | 'contact';
  data: Record<string, unknown>;
}

function formatOrderMessage(data: Record<string, unknown>): string {
  const items = (data.items as Array<{ product_name: string; size: string; color: string; quantity: number; price: number }>) || [];
  const itemsText = items
    .map((i, idx) => `  ${idx + 1}. ${i.product_name} (${i.size}, ${i.color}) ×${i.quantity} — ${Number(i.price).toLocaleString('ru-RU')} ₽`)
    .join('\n');

  return `🛒 <b>Новый заказ №${data.order_number}</b>

👤 <b>Клиент:</b> ${data.customer_name}
📞 ${data.customer_phone}
📧 ${data.customer_email}

📦 <b>Доставка:</b> ${data.delivery_method === 'courier' ? 'Курьер' : 'Пункт выдачи'}
🏙 ${data.city}${data.address ? ', ' + data.address : ''}

💳 <b>Оплата:</b> ${data.payment_method === 'card' ? 'Карта' : 'СБП'}

<b>Товары:</b>
${itemsText}

${Number(data.discount_amount) > 0 ? `🏷 Скидка: -${Number(data.discount_amount).toLocaleString('ru-RU')} ₽\n` : ''}🚚 Доставка: ${Number(data.delivery_price) === 0 ? 'Бесплатно' : Number(data.delivery_price).toLocaleString('ru-RU') + ' ₽'}
💰 <b>Итого: ${Number(data.total_price).toLocaleString('ru-RU')} ₽</b>`;
}

function formatContactMessage(data: Record<string, unknown>): string {
  return `📩 <b>Новая заявка</b>

👤 ${data.name || 'Не указано'}
📞 ${data.phone || 'Не указан'}
📧 ${data.email || 'Не указан'}

${data.message ? `💬 ${data.message}` : ''}`;
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

    const payload: NotifyPayload = await req.json();
    
    const text = payload.type === 'order'
      ? formatOrderMessage(payload.data)
      : formatContactMessage(payload.data);

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Telegram API failed [${response.status}]: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
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
