import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Minus, Plus, Trash2, ChevronLeft } from 'lucide-react';

const steps = ['Контакты', 'Доставка', 'Оплата'];

interface FormData {
  name: string;
  phone: string;
  email: string;
  deliveryMethod: 'courier' | 'pickup' | '';
  city: string;
  address: string;
  paymentMethod: 'card' | 'sbp' | '';
  promoCode: string;
}

const Checkout = () => {
  const { items, totalPrice, totalPriceWithDiscount, appliedCombo, totalItems, clearCart, removeItem, updateQuantity } = useCart();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    deliveryMethod: '',
    city: '',
    address: '',
    paymentMethod: '',
    promoCode: '',
  });
  const navigate = useNavigate();

  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (s === 0) {
      if (!form.name.trim()) newErrors.name = 'Введите имя';
      if (!form.phone.trim()) newErrors.phone = 'Введите телефон';
      if (!form.email.trim()) newErrors.email = 'Введите email';
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Некорректный email';
    }

    if (s === 1) {
      if (!form.deliveryMethod) newErrors.deliveryMethod = 'Выберите способ доставки';
      if (!form.city.trim()) newErrors.city = 'Введите город';
      if (form.deliveryMethod === 'courier' && !form.address.trim()) newErrors.address = 'Введите адрес';
    }

    if (s === 2) {
      if (!form.paymentMethod) newErrors.paymentMethod = 'Выберите способ оплаты';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
        <h1 className="text-3xl font-serif mb-4">Спасибо за заказ!</h1>
        <p className="text-muted-foreground mb-2">Заказ №{orderNumber}</p>
        <p className="text-muted-foreground mb-6">Мы свяжемся с вами для подтверждения по {form.email}</p>
        <Button asChild><Link to="/">На главную</Link></Button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!validateStep(step)) return;
    if (step < 2) { setStep(step + 1); return; }
    const num = Math.floor(Math.random() * 90000 + 10000).toString();
    setOrderNumber(num);
    clearCart();
    setDone(true);
    toast.success('Заказ оформлен!', { description: `Номер заказа: ${num}` });
  };

  const priceAfterCombo = totalPriceWithDiscount;
  const deliveryPrice = priceAfterCombo >= 10000 ? 0 : 490;
  const finalPrice = priceAfterCombo + deliveryPrice;

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-4 w-4 mr-1" /> Назад
      </Button>
      <h1 className="text-3xl font-serif mb-8">Оформление заказа</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              i < step ? 'bg-green-600 text-white' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={cn("text-sm hidden sm:inline", i <= step ? 'font-medium' : 'text-muted-foreground')}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        {/* Left: Form steps */}
        <div>
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <Label>Имя *</Label>
                <Input value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="Анна" className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label>Телефон *</Label>
                <Input value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+7 (999) 123-45-67" className={errors.phone ? 'border-destructive' : ''} />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label>Email *</Label>
                <Input value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="anna@example.com" type="email" className={errors.email ? 'border-destructive' : ''} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Способ доставки *</Label>
                <div className="flex gap-3">
                  <Button
                    variant={form.deliveryMethod === 'courier' ? 'default' : 'outline'}
                    className="flex-1 h-16"
                    onClick={() => updateField('deliveryMethod', 'courier')}
                  >🚚 Курьер</Button>
                  <Button
                    variant={form.deliveryMethod === 'pickup' ? 'default' : 'outline'}
                    className="flex-1 h-16"
                    onClick={() => updateField('deliveryMethod', 'pickup')}
                  >📦 Пункт выдачи</Button>
                </div>
                {errors.deliveryMethod && <p className="text-xs text-destructive mt-1">{errors.deliveryMethod}</p>}
              </div>
              <div>
                <Label>Город *</Label>
                <Input value={form.city} onChange={e => updateField('city', e.target.value)} placeholder="Москва" className={errors.city ? 'border-destructive' : ''} />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
              </div>
              {form.deliveryMethod === 'courier' && (
                <div>
                  <Label>Адрес *</Label>
                  <Input value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="ул. Примерная, д. 1, кв. 10" className={errors.address ? 'border-destructive' : ''} />
                  {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                </div>
              )}
              {deliveryPrice > 0 && (
                <p className="text-sm text-muted-foreground">Бесплатная доставка от {formatPrice(10000)}</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Способ оплаты *</Label>
                <div className="flex gap-3">
                  <Button
                    variant={form.paymentMethod === 'card' ? 'default' : 'outline'}
                    className="flex-1 h-16"
                    onClick={() => updateField('paymentMethod', 'card')}
                  >💳 Карта</Button>
                  <Button
                    variant={form.paymentMethod === 'sbp' ? 'default' : 'outline'}
                    className="flex-1 h-16"
                    onClick={() => updateField('paymentMethod', 'sbp')}
                  >📱 СБП</Button>
                </div>
                {errors.paymentMethod && <p className="text-xs text-destructive mt-1">{errors.paymentMethod}</p>}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Назад</Button>}
            <Button className="flex-1" onClick={handleSubmit}>
              {step < 2 ? 'Далее' : `Оплатить ${formatPrice(finalPrice)}`}
            </Button>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="border rounded-lg p-5 h-fit space-y-4">
          <h3 className="font-semibold">Ваш заказ ({totalItems})</h3>
          <div className="space-y-3 max-h-[320px] overflow-y-auto">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <img
                  src={item.product.colorImages?.[item.color.name] || item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">{item.color.name}, {item.size}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.size, item.color.name, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs w-5 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.size, item.color.name, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium ml-auto">{formatPrice(item.product.price * item.quantity)}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.product.id, item.size, item.color.name)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Товары ({totalItems})</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            {appliedCombo && (
              <div className="flex justify-between text-accent">
                <span>Скидка «{appliedCombo.comboName}» (-{appliedCombo.discountPercent}%)</span>
                <span>-{formatPrice(appliedCombo.savings)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Доставка</span>
              <span>{deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t pt-2">
              <span>Итого</span>
              <span>{formatPrice(finalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
