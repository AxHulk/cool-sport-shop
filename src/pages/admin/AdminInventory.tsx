import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, Save } from 'lucide-react';
import { products } from '@/data/products';

const productNameMap: Record<string, string> = {};
products.forEach(p => { productNameMap[p.id] = p.name; });

const AdminInventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [edits, setEdits] = useState<Record<string, number>>({});

  useEffect(() => { loadInventory(); }, []);

  const loadInventory = async () => {
    try {
      const { data } = await adminApi<{ data: any[] }>('listInventory');
      setInventory(data || []);
      setEdits({});
    } catch (e: any) {
      toast.error(e?.message || 'Не удалось загрузить остатки');
    }
  };

  const updateQty = (id: string, val: string) => {
    setEdits(prev => ({ ...prev, [id]: Math.max(0, parseInt(val) || 0) }));
  };

  const saveItem = async (item: any) => {
    const qty = edits[item.id];
    if (qty === undefined) return;
    try {
      await adminApi('updateInventoryQty', { id: item.id, quantity: qty });
      toast.success('Остаток обновлён');
      loadInventory();
    } catch (e: any) {
      toast.error(e?.message || 'Не удалось сохранить');
    }
  };

  const addItem = async () => {
    const productId = prompt('Product ID:');
    const size = prompt('Размер (XS/S/M/L):');
    const color = prompt('Цвет:');
    if (!productId || !size || !color) return;
    const quantity = parseInt(prompt('Количество:') || '0');
    try {
      await adminApi('addInventory', { productId, size, color, quantity });
      toast.success('SKU добавлен');
      loadInventory();
    } catch (e: any) {
      if (e?.context?.status === 409) toast.error('Такой SKU уже существует');
      else toast.error(e?.message || 'Ошибка');
    }
  };

  const filtered = inventory.filter(i => {
    const name = (productNameMap[i.product_id] || i.product_id).toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || i.color.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Складской учёт</h1>
        <Button onClick={addItem}>+ Добавить SKU</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по товару, цвету" className="pl-9" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Товар</TableHead>
              <TableHead>Размер</TableHead>
              <TableHead>Цвет</TableHead>
              <TableHead>Остаток</TableHead>
              <TableHead>Бронь</TableHead>
              <TableHead>Доступно</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Нет данных. Добавьте SKU.</TableCell></TableRow>
            ) : filtered.map(item => {
              const available = item.quantity - item.reserved;
              return (
                <TableRow key={item.id} className={available <= 0 ? 'bg-destructive/5' : ''}>
                  <TableCell className="font-medium">{productNameMap[item.product_id] || item.product_id}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="w-20 h-8"
                      value={edits[item.id] !== undefined ? edits[item.id] : item.quantity}
                      onChange={e => updateQty(item.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>{item.reserved}</TableCell>
                  <TableCell className={available <= 0 ? 'text-destructive font-medium' : ''}>{available}</TableCell>
                  <TableCell>
                    {edits[item.id] !== undefined && (
                      <Button variant="ghost" size="icon" onClick={() => saveItem(item)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminInventory;
