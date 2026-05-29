// СДЭК интеграция: auth-токен, поиск городов, ПВЗ, расчёт стоимости.
// Один endpoint с параметром ?action=...
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const CDEK_BASE = Deno.env.get('CDEK_USE_TEST') === 'true'
  ? 'https://api.edu.cdek.ru/v2'
  : 'https://api.cdek.ru/v2';

const ACCOUNT = Deno.env.get('CDEK_ACCOUNT') ?? '';
const SECURE_PASSWORD = Deno.env.get('CDEK_SECURE_PASSWORD') ?? '';
const SENDER_CITY_CODE = parseInt(Deno.env.get('CDEK_SENDER_CITY_CODE') ?? '428', 10);

// Кеш токена в памяти инстанса
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: ACCOUNT,
    client_secret: SECURE_PASSWORD,
  });
  const res = await fetch(`${CDEK_BASE}/oauth/token?parameters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    console.error('CDEK auth failed', res.status, data);
    throw new Error(`CDEK auth failed: ${JSON.stringify(data)}`);
  }
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

async function cdekFetch(path: string, init: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${CDEK_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    console.error(`CDEK ${path} error`, res.status, data);
    throw new Error(`CDEK API ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// Габариты для расчёта: на единицу товара
const DEFAULT_ITEM = { weight: 400, length: 25, width: 20, height: 5 }; // граммы, см

function buildPackages(quantity: number) {
  // Объединяем всё в одну посылку, вес суммируем, размеры берём базовые с учётом высоты.
  const totalWeight = Math.max(500, quantity * DEFAULT_ITEM.weight);
  const height = Math.min(40, Math.max(5, quantity * DEFAULT_ITEM.height));
  return [{
    weight: totalWeight,
    length: DEFAULT_ITEM.length,
    width: DEFAULT_ITEM.width,
    height,
  }];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!ACCOUNT || !SECURE_PASSWORD) {
      throw new Error('CDEK credentials not configured');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};

    // 1. Поиск городов (автокомплит)
    if (action === 'cities') {
      const q = (body.q || url.searchParams.get('q') || '').toString().trim();
      if (q.length < 2) return json({ cities: [] });
      const data = await cdekFetch(
        `/location/suggest/cities?name=${encodeURIComponent(q)}&country_code=RU`,
      );
      const cities = (Array.isArray(data) ? data : []).slice(0, 10).map((c: any) => ({
        code: c.code,
        city: c.city,
        region: c.region,
        full: c.full_name,
      }));
      return json({ cities });
    }

    // 2. ПВЗ в городе
    if (action === 'pickup-points') {
      const cityCode = body.city_code ?? url.searchParams.get('city_code');
      if (!cityCode) throw new Error('city_code required');
      const data = await cdekFetch(
        `/deliverypoints?city_code=${cityCode}&type=PVZ&country_code=RU`,
      );
      const points = (Array.isArray(data) ? data : []).map((p: any) => ({
        code: p.code,
        name: p.name,
        address: p.location?.address_full || p.location?.address,
        latitude: p.location?.latitude,
        longitude: p.location?.longitude,
        work_time: p.work_time,
        phones: (p.phones || []).map((ph: any) => ph.number),
        is_dressing_room: p.is_dressing_room,
        have_cashless: p.have_cashless,
        type: p.type, // PVZ / POSTAMAT
        nearest_metro_station: p.nearest_metro_station,
      }));
      return json({ points });
    }

    // 3. Расчёт стоимости
    // body: { city_code, mode: 'pickup' | 'courier_fitting', quantity, to_pvz_code? }
    if (action === 'calculate') {
      const cityCode = Number(body.city_code);
      const mode = body.mode as 'pickup' | 'courier_fitting';
      const quantity = Math.max(1, Number(body.quantity) || 1);
      if (!cityCode) throw new Error('city_code required');

      const tariffCode = mode === 'pickup' ? 136 : 137;
      const services = mode === 'courier_fitting'
        ? [{ code: 'TRYING_ON', parameter: '1' }]
        : [];

      const payload = {
        type: 1, // интернет-магазин
        tariff_code: tariffCode,
        from_location: { code: SENDER_CITY_CODE },
        to_location: { code: cityCode },
        packages: buildPackages(quantity),
        services,
      };
      const data = await cdekFetch('/calculator/tariff', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return json({
        price: Math.round(Number(data.delivery_sum) || 0),
        period_min: data.period_min,
        period_max: data.period_max,
        currency: data.currency,
      });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('cdek function error:', msg);
    return json({ error: msg }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
