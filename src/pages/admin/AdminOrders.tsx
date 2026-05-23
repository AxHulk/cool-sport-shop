import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Search, Eye } from 'lucide-react';

const statusLabels: Record<string, string> = { new: 'Новый', assembling: 'Сборка', shipped: 'Доставка', returned: 'Возврат' };
const statusColors: Record<string, string> = { new: 'bg-blue-100 text-blue-800', assembling: 'bg-yellow-100 text-yellow-800', shipped: 'bg-green-100 text-green-800', returned: 'bg-red-100 text-red-800' };
const statuses = ['all', 'new', 'assembling', 'shipped', 'returned'];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => { loadOrders(); }, [filter]);

  const loadOrders = async () => {
    let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter as any);
    const { data } = await q;
    setOrders(data || []);
  };

  const openOrder = async (order: any) => {
    setSelected(order);
    setTrackingNumber(order.tracking_number || '');
    const [itemsRes, histRes] = await Promise.all([
      supabase.from('order_items').select('*').eq('order_id', order.id),
      supabase.from('order_history').select('*').eq('order_id', order.id).order('changed_at', { ascending: false }),
    ]);
    setOrderItems(itemsRes.data || []);
    setHistory(histRes.data || []);
  };

  const changeStatus = async (orderId: string, oldStatus: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus as any }).eq('id', orderId);
    await supabase.from('order_history').insert({
      order_id: orderId,
      field_changed: 'status',
      old_value: oldStatus,
      new_value: newStatus,
      changed_by: 'admin',
    });
    toast.success(`Статус изменён на "${statusLabels[newStatus]}"`);
    loadOrders();
    if (selected?.id === orderId) {
      setSelected({ ...selected, status: newStatus });
      const { data } = await supabase.from('order_history').select('*').eq('order_id', orderId).order('changed_at', { ascending: false });
      setHistory(data || []);
    }
  };

  const saveTracking = async () => {
    if (!selected) return;
    await supabase.from('orders').update({ tracking_number: trackingNumber }).eq('id', selected.id);
    await supabase.from('order_history').insert({
      order_id: selected.id,
      field_changed: 'tracking_number',
      old_value: selected.tracking_number || '',
      new_value: trackingNumber,
      changed_by: 'admin',
    });
    toast.success('Трек-номер сохранён');
    setSelected({ ...selected, tracking_number: trackingNumber });
    loadOrders();
  };

  const fmt = (n: number) => Number(n).toLocaleString('ru-RU') + ' ₽';
  const fmtDate = (d: string) => new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

  const filtered = orders.filter(o =>
    o.order_number.includes(search) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone.includes(search)
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Заказы</h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по номеру, имени, телефону" className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {statuses.slice(1).map(s => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Заказов нет</TableCell></TableRow>
            ) : filtered.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">#{o.order_number}</TableCell>
                <TableCell>{o.customer_name}</TableCell>
                <TableCell>{o.customer_phone}</TableCell>
                <TableCell>{fmt(o.total_price)}</TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={v => changeStatus(o.id, o.status, v)}>
                    <SelectTrigger className="w-[130px] h-7 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>{statusLabels[o.status]}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.slice(1).map(s => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{fmtDate(o.created_at)}</TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => openOrder(o)}><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Заказ #{selected.order_number}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Клиент:</span> {selected.customer_name}</div>
                <div><span className="text-muted-foreground">Телефон:</span> {selected.customer_phone}</div>
                <div><span className="text-muted-foreground">Email:</span> {selected.customer_email}</div>
                <div><span className="text-muted-foreground">Город:</span> {selected.city}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Адрес:</span> {selected.address}</div>
                <div><span className="text-muted-foreground">Доставка:</span> {selected.delivery_method}</div>
                <div><span className="text-muted-foreground">Оплата:</span> {selected.payment_method}</div>
              </div>

              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">Трек-номер</Label>
                <div className="flex gap-2">
                  <Input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Введите трек-номер" />
                  <Button size="sm" onClick={saveTracking}>Сохранить</Button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Состав заказа</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Товар</TableHead>
                      <TableHead>Размер</TableHead>
                      <TableHead>Цвет</TableHead>
                      <TableHead>Кол-во</TableHead>
                      <TableHead>Цена</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{fmt(item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-2 text-sm">
                  <span className="text-muted-foreground mr-2">Доставка: {fmt(selected.delivery_price)}</span>
                  <span className="font-semibold">Итого: {fmt(Number(selected.total_price) + Number(selected.delivery_price))}</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">История изменений</h4>
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Нет записей</p>
                ) : (
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {history.map(h => (
                      <div key={h.id} className="text-xs text-muted-foreground flex justify-between border-b py-1">
                        <span><strong>{h.field_changed}</strong>: {h.old_value || '—'} → {h.new_value}</span>
                        <span>{h.changed_by}, {fmtDate(h.changed_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
