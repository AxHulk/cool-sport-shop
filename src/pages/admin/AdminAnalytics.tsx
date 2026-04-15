import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(0 0% 12%)', 'hsl(350 60% 72%)', 'hsl(30 20% 60%)', 'hsl(200 60% 50%)', 'hsl(120 40% 50%)'];

const AdminAnalytics = () => {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [revenueByDay, setRevenueByDay] = useState<any[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<any[]>([]);
  const [sizeBreakdown, setSizeBreakdown] = useState<any[]>([]);

  useEffect(() => { loadAnalytics(); }, []);

  const loadAnalytics = async () => {
    // Top products
    const { data: items } = await supabase.from('order_items').select('product_name, quantity');
    const productMap: Record<string, number> = {};
    (items || []).forEach(i => { productMap[i.product_name] = (productMap[i.product_name] || 0) + i.quantity; });
    const sorted = Object.entries(productMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    setTopProducts(sorted.map(([name, qty]) => ({ name, qty })));

    // Size breakdown
    const sizeMap: Record<string, number> = {};
    (items || []).forEach(i => { sizeMap[i.size] = (sizeMap[i.size] || 0) + i.quantity; });
    setSizeBreakdown(Object.entries(sizeMap).map(([name, value]) => ({ name, value })));

    // Revenue by day (last 30 days)
    const { data: orders } = await supabase.from('orders').select('total_price, created_at').gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString());
    const dayMap: Record<string, number> = {};
    (orders || []).forEach(o => {
      const day = new Date(o.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      dayMap[day] = (dayMap[day] || 0) + Number(o.total_price);
    });
    setRevenueByDay(Object.entries(dayMap).map(([date, revenue]) => ({ date, revenue })));

    // Status breakdown
    const { data: allOrders } = await supabase.from('orders').select('status');
    const stMap: Record<string, number> = {};
    const stLabels: Record<string, string> = { new: 'Новый', assembling: 'Сборка', shipped: 'Доставка', returned: 'Возврат' };
    (allOrders || []).forEach(o => { stMap[o.status] = (stMap[o.status] || 0) + 1; });
    setStatusBreakdown(Object.entries(stMap).map(([k, v]) => ({ name: stLabels[k] || k, value: v })));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Аналитика</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Выручка по дням (30 дн.)</CardTitle></CardHeader>
          <CardContent>
            {revenueByDay.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(v: number) => v.toLocaleString('ru-RU') + ' ₽'} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(0 0% 12%)" strokeWidth={2} name="Выручка" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Топ-5 товаров</CardTitle></CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topProducts} layout="vertical">
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={11} width={120} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(350 60% 72%)" name="Продано" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Заказы по статусам</CardTitle></CardHeader>
          <CardContent>
            {statusBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                    {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Продажи по размерам</CardTitle></CardHeader>
          <CardContent>
            {sizeBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sizeBreakdown}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(30 20% 60%)" name="Кол-во" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
