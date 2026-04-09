import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const steps = ['Контакты', 'Доставка', 'Оплата'];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

  if (items.length === 0 && !done) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">Корзина пуста</p>
        <Button asChild><Link to="/catalog">К покупкам</Link></Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <h1 className="text-3xl font-serif mb-4">Спасибо за заказ!</h1>
        <p className="text-muted-foreground mb-2">Заказ №{Math.floor(Math.random() * 90000 + 10000)}</p>
        <p className="text-muted-foreground mb-6">Мы свяжемся с вами для подтверждения</p>
        <Button asChild><Link to="/">На главную</Link></Button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (step < 2) { setStep(step + 1); return; }
    clearCart();
    setDone(true);
  };

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Оформление заказа</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              {i + 1}
            </div>
            <span className={cn("text-sm", i <= step ? 'font-medium' : 'text-muted-foreground')}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div><Label>Имя</Label><Input placeholder="Анна" /></div>
          <div><Label>Телефон</Label><Input placeholder="+7 (999) 123-45-67" /></div>
          <div><Label>Email</Label><Input placeholder="anna@example.com" type="email" /></div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-16">🚚 Курьер</Button>
            <Button variant="outline" className="flex-1 h-16">📦 Пункт выдачи</Button>
          </div>
          <div><Label>Город</Label><Input placeholder="Москва" /></div>
          <div><Label>Адрес</Label><Input placeholder="ул. Примерная, д. 1" /></div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-16">💳 Карта</Button>
            <Button variant="outline" className="flex-1 h-16">📱 СБП</Button>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Товары ({items.length})</span>
              <span className="font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm text-muted-foreground">
              <span>Доставка</span><span>Бесплатно</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Итого</span><span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Назад</Button>}
        <Button className="flex-1" onClick={handleSubmit}>
          {step < 2 ? 'Далее' : 'Оплатить'}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
