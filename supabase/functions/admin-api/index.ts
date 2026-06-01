// Admin API: server-side proxy for admin panel. All sensitive PII reads/writes go through here.
// Auth: caller must send header `x-admin-password` matching the ADMIN_PASSWORD secret.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders as baseCorsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const corsHeaders = {
  ...baseCorsHeaders,
  'Access-Control-Allow-Headers':
    (baseCorsHeaders as any)['Access-Control-Allow-Headers'] ||
    'authorization, x-client-info, apikey, content-type, x-admin-password',
};
// Ensure x-admin-password is allowed
if (!corsHeaders['Access-Control-Allow-Headers'].includes('x-admin-password')) {
  corsHeaders['Access-Control-Allow-Headers'] += ', x-admin-password';
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD') ?? '';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } }
);

type Op =
  | 'login'
  | 'listOrders'
  | 'getOrderDetails'
  | 'updateOrderStatus'
  | 'updateOrderTracking'
  | 'listCustomers'
  | 'listReturns'
  | 'updateReturnStatus'
  | 'analytics'
  | 'dashboard'
  | 'listInventory'
  | 'updateInventoryQty'
  | 'addInventory';

interface Body {
  op: Op;
  status?: string;
  id?: string;
  orderId?: string;
  newStatus?: string;
  oldStatus?: string;
  trackingNumber?: string;
  quantity?: number;
  productId?: string;
  size?: string;
  color?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  if (!ADMIN_PASSWORD) return json({ error: 'Server not configured' }, 500);

  const pwd = req.headers.get('x-admin-password') ?? '';
  if (pwd !== ADMIN_PASSWORD) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  try {
    switch (body.op) {
      case 'login':
        return json({ ok: true });

      case 'listOrders': {
        let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (body.status && body.status !== 'all') q = q.eq('status', body.status as any);
        const { data, error } = await q;
        if (error) throw error;
        return json({ data });
      }

      case 'getOrderDetails': {
        if (!body.orderId) return json({ error: 'orderId required' }, 400);
        const [itemsRes, histRes] = await Promise.all([
          supabase.from('order_items').select('*').eq('order_id', body.orderId),
          supabase
            .from('order_history')
            .select('*')
            .eq('order_id', body.orderId)
            .order('changed_at', { ascending: false }),
        ]);
        if (itemsRes.error) throw itemsRes.error;
        if (histRes.error) throw histRes.error;
        return json({ items: itemsRes.data, history: histRes.data });
      }

      case 'updateOrderStatus': {
        if (!body.orderId || !body.newStatus) return json({ error: 'orderId and newStatus required' }, 400);
        const { error: uErr } = await supabase
          .from('orders')
          .update({ status: body.newStatus as any })
          .eq('id', body.orderId);
        if (uErr) throw uErr;
        const { error: hErr } = await supabase.from('order_history').insert({
          order_id: body.orderId,
          field_changed: 'status',
          old_value: body.oldStatus ?? '',
          new_value: body.newStatus,
          changed_by: 'admin',
        });
        if (hErr) throw hErr;
        return json({ ok: true });
      }

      case 'updateOrderTracking': {
        if (!body.orderId || typeof body.trackingNumber !== 'string')
          return json({ error: 'orderId and trackingNumber required' }, 400);
        const { data: cur, error: gErr } = await supabase
          .from('orders')
          .select('tracking_number')
          .eq('id', body.orderId)
          .maybeSingle();
        if (gErr) throw gErr;
        const { error: uErr } = await supabase
          .from('orders')
          .update({ tracking_number: body.trackingNumber })
          .eq('id', body.orderId);
        if (uErr) throw uErr;
        await supabase.from('order_history').insert({
          order_id: body.orderId,
          field_changed: 'tracking_number',
          old_value: cur?.tracking_number ?? '',
          new_value: body.trackingNumber,
          changed_by: 'admin',
        });
        return json({ ok: true });
      }

      case 'listCustomers': {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('last_order_at', { ascending: false });
        if (error) throw error;
        return json({ data });
      }

      case 'listReturns': {
        const { data, error } = await supabase
          .from('returns')
          .select('*, orders(order_number, customer_name), order_items(product_name, size, color)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return json({ data });
      }

      case 'updateReturnStatus': {
        if (!body.id || !body.newStatus) return json({ error: 'id and newStatus required' }, 400);
        const { error } = await supabase
          .from('returns')
          .update({ status: body.newStatus as any })
          .eq('id', body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      case 'analytics': {
        const since = new Date(Date.now() - 30 * 86400000).toISOString();
        const [itemsRes, recentRes, allRes] = await Promise.all([
          supabase.from('order_items').select('product_name, quantity, size'),
          supabase.from('orders').select('total_price, created_at').gte('created_at', since),
          supabase.from('orders').select('status'),
        ]);
        if (itemsRes.error) throw itemsRes.error;
        if (recentRes.error) throw recentRes.error;
        if (allRes.error) throw allRes.error;
        return json({
          items: itemsRes.data,
          recentOrders: recentRes.data,
          allOrders: allRes.data,
        });
      }

      case 'dashboard': {
        const now = Date.now();
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        const weekStart = new Date(now - 7 * 86400000).toISOString();
        const monthStart = new Date(now - 30 * 86400000).toISOString();
        const [todayRes, weekRes, monthRes, pendingReturnsRes, recentRes] = await Promise.all([
          supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
          supabase.from('orders').select('total_price').gte('created_at', weekStart),
          supabase.from('orders').select('total_price').gte('created_at', monthStart),
          supabase.from('returns').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        ]);
        return json({
          todayCount: todayRes.count ?? 0,
          weekRevenue: (weekRes.data ?? []).reduce((s, o: any) => s + Number(o.total_price || 0), 0),
          monthRevenue: (monthRes.data ?? []).reduce((s, o: any) => s + Number(o.total_price || 0), 0),
          pendingReturns: pendingReturnsRes.count ?? 0,
          recentOrders: recentRes.data ?? [],
        });
      }

      default:
        return json({ error: 'Unknown op' }, 400);
    }
  } catch (e) {
    console.error('admin-api error', e);
    return json({ error: (e as Error).message || 'Internal error' }, 500);
  }
});
