import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    const res = await adminApi<{ data: any[] }>('listCustomers');
    setCustomers(res.data || []);
  };

  const fmt = (n: number) => Number(n).toLocaleString('ru-RU') + ' ₽';
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('ru-RU') : '—';

  const isInactive = (d: string | null) => {
    if (!d) return false;
    return Date.now() - new Date(d).getTime() > 90 * 86400000;
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Клиенты</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени, email, телефону" className="pl-9" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Заказов</TableHead>
              <TableHead>Потрачено</TableHead>
              <TableHead>Последний заказ</TableHead>
              <TableHead>Сегмент</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Клиентов нет</TableCell></TableRow>
            ) : filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.total_orders}</TableCell>
                <TableCell>{fmt(c.total_spent)}</TableCell>
                <TableCell>{fmtDate(c.last_order_at)}</TableCell>
                <TableCell>
                  {isInactive(c.last_order_at) && <Badge variant="destructive" className="text-xs">Неактивный</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCustomers;
