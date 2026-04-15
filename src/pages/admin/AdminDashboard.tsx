import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, DollarSign, RotateCcw, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ todayOrders: 0, weekRevenue: 0, monthRevenue: 0, returns: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 86400000).toISOString();
    const monthStart = new Date(now.getTime() - 30 * 86400000).toISOString();

    const [todayRes, weekRes, monthRes, returnsRes, recentRes, stockRes] = await Promise.all([
      supabase.from('orders').select('id', { count: 'exact' }).gte('created_at', todayStart),
      supabase.from('orders').select('total_price').gte('created_at', weekStart),
      supabase.from('orders').select('total_price').gte('created_at', monthStart),
      supabase.from('returns').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('products_inventory').select('*').lt('quantity', 3).order('quantity', { ascending: true }).limit(10),
    ]);

    setStats({
      todayOrders: todayRes.count || 0,
      weekRevenue: weekRes.data?.reduce((s, o) => s + Number(o.total_price), 0) || 0,
      monthRevenue: monthRes.data?.reduce((s, o) => s + Number(o.total_price), 0) || 0,
      returns: returnsRes.count || 0,
    });
    setRecentOrders(recentRes.data || []);
    setLowStock(stockRes.data || []);
  };

  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

  const statusLabels: Record<string, string> = { new: 'Новый', assembling: 'Сборка', shipped: 'Доставка', returned: 'Возврат' };
  const statusColors: Record<string, string> = { new: 'bg-blue-100 text-blue-800', assembling: 'bg-yellow-100 text-yellow-800', shipped: 'bg-green-100 text-green-800', returned: 'bg-red-100 text-red-800' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Дашборд</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Заказы сегодня</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.todayOrders}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Выручка за неделю</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{fmt(stats.weekRevenue)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Выручка за месяц</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{fmt(stats.monthRevenue)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Возвраты (ожидают)</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.returns}</p></CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Последние заказы</CardTitle></CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Заказов пока нет</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map(o => (
                  <Link key={o.id} to={`/admin/orders?id=${o.id}`} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                    <div>
                      <span className="font-medium text-sm">#{o.order_number}</span>
                      <span className="text-sm text-muted-foreground ml-2">{o.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[o.status] || ''}`}>{statusLabels[o.status]}</span>
                      <span className="text-sm font-medium">{fmt(Number(o.total_price))}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Низкий остаток</CardTitle></CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">Все в порядке</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                    <span className="text-sm">{s.product_id} — {s.color}, {s.size}</span>
                    <span className={`text-sm font-medium ${s.quantity === 0 ? 'text-destructive' : 'text-yellow-600'}`}>
                      {s.quantity} шт
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
