import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const reasonLabels: Record<string, string> = { wrong_size: 'Не подошёл размер', wrong_style: 'Не подошёл фасон', quality: 'Качество', other: 'Другое' };
const statusLabels: Record<string, string> = { pending: 'Ожидает', approved: 'Одобрен', completed: 'Завершён' };
const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#a3a3a3'];

const AdminReturns = () => {
  const [returns, setReturns] = useState<any[]>([]);
  const [reasonStats, setReasonStats] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => { loadReturns(); }, []);

  const loadReturns = async () => {
    const { data } = await supabase
      .from('returns')
      .select('*, orders(order_number, customer_name), order_items(product_name, size, color)')
      .order('created_at', { ascending: false });
    setReturns(data || []);

    // Compute reason stats
    const counts: Record<string, number> = {};
    (data || []).forEach(r => { counts[r.reason] = (counts[r.reason] || 0) + 1; });
    setReasonStats(Object.entries(counts).map(([k, v]) => ({ name: reasonLabels[k] || k, value: v })));
  };

  const changeStatus = async (id: string, newStatus: string) => {
    await supabase.from('returns').update({ status: newStatus as any }).eq('id', id);
    toast.success(`Статус возврата изменён`);
    loadReturns();
  };

  const fmt = (n: number) => Number(n).toLocaleString('ru-RU') + ' ₽';
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Возвраты</h1>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заказ</TableHead>
                <TableHead>Товар</TableHead>
                <TableHead>Причина</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Возвратов нет</TableCell></TableRow>
              ) : returns.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">#{r.orders?.order_number}</TableCell>
                  <TableCell>{r.order_items?.product_name || '—'}</TableCell>
                  <TableCell>{reasonLabels[r.reason]}</TableCell>
                  <TableCell>{fmt(r.refund_amount)}</TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={v => changeStatus(r.id, v)}>
                      <SelectTrigger className="w-[120px] h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{statusLabels.pending}</SelectItem>
                        <SelectItem value="approved">{statusLabels.approved}</SelectItem>
                        <SelectItem value="completed">{statusLabels.completed}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmtDate(r.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Причины возвратов</CardTitle></CardHeader>
          <CardContent>
            {reasonStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={reasonStats} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name">
                    {reasonStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReturns;
