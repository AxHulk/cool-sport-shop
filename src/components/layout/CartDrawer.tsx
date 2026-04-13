import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, totalPriceWithDiscount, appliedCombo } = useCart();

  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif">Корзина</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Корзина пуста
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 border-b pb-4">
                  <img
                    src={(item.product.colorImages?.[item.color.name]) || item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.color.name}, {item.size}</p>
                    <p className="text-sm font-semibold mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.size, item.color.name, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.size, item.color.name, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={() => removeItem(item.product.id, item.size, item.color.name)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Combo discount banner */}
            {appliedCombo && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">Комплект «{appliedCombo.comboName}»</p>
                  <p className="text-xs text-muted-foreground">Скидка {appliedCombo.discountPercent}% — экономия {formatPrice(appliedCombo.savings)}</p>
                </div>
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              {appliedCombo ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Без скидки</span>
                    <span className="line-through">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Итого</span>
                    <span>{formatPrice(totalPriceWithDiscount)}</span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between font-semibold">
                  <span>Итого</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              )}
              <Button className="w-full" asChild onClick={() => setIsCartOpen(false)}>
                <Link to="/checkout">Оформить заказ</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
