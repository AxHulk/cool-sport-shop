import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Minus, Plus, Trash2, ChevronLeft } from 'lucide-react';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import DolyamiBadge, { isDolyamiEligible, dolyamiPart } from '@/components/DolyamiBadge';
import CdekDelivery, { type CdekSelection } from '@/components/checkout/CdekDelivery';

const steps = ['Контакты', 'Доставка', 'Оплата'];

interface FormData {
  name: string;
  phone: string;
  email: string;
  deliveryMethod: 'courier' | 'pickup' | '';
  city: string;
  address: string;
  paymentMethod: 'card' | 'sbp' | 'dolyami' | '';
  promoCode: string;
}

const Checkout = () => {
  const { items, totalPrice, totalPriceWithDiscount, appliedCombo, totalItems, clearCart, removeItem, updateQuantity } = useCart();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [cdek, setCdek] = useState<CdekSelection | null>(null);
  const [cdekError, setCdekError] = useState('');
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

  // Handle return from T-Kassa payment page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const order = params.get('order');
    if (payment === 'success' && order) {
      setOrderNumber(order);
      setDone(true);
      clearCart();
      // Clean URL
      window.history.replaceState({}, '', '/checkout');
    } else if (payment === 'fail' && order) {
      toast.error('Оплата не прошла', {
        description: `Заказ №${order}. Попробуйте ещё раз или выберите другой способ оплаты.`,
      });
      window.history.replaceState({}, '', '/checkout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (!consent) {
        setConsentError('Необходимо согласие на обработку персональных данных');
      } else {
        setConsentError('');
      }
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
    const hasFieldErrors = Object.keys(newErrors).length > 0;
    const hasConsentError = s === 0 && !consent;
    return !hasFieldErrors && !hasConsentError;
  };

  if (items.length === 0 && !done) {
    return (
      <div className="container py-20 text-center">
        <SEO title="Корзина" description="Оформление заказа в āsana." noindex />
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

  const priceAfterCombo = totalPriceWithDiscount;
  const deliveryPrice = priceAfterCombo >= 10000 ? 0 : 490;
  const finalPrice = priceAfterCombo + deliveryPrice;

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    if (step < 2) { setStep(step + 1); return; }

    setSubmitting(true);
    const num = Math.floor(Math.random() * 90000 + 10000).toString();

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/save-order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({
            order_number: num,
            customer_name: form.name,
            customer_phone: form.phone,
            customer_email: form.email,
            city: form.city,
            address: form.address,
            delivery_method: form.deliveryMethod,
            payment_method: form.paymentMethod,
            total_price: priceAfterCombo,
            delivery_price: deliveryPrice,
            discount_amount: appliedCombo?.savings || 0,
            promo_code: form.promoCode || null,
            items: items.map(i => ({
              product_id: i.product.id,
              product_name: i.product.name,
              size: i.size,
              color: i.color.name,
              quantity: i.quantity,
              price: i.product.price * i.quantity,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      setOrderNumber(num);

      // Для любого метода (card / sbp / dolyami) — создаём платёж в Т-Кассе и редиректим на форму
      if (form.paymentMethod === 'card' || form.paymentMethod === 'sbp' || form.paymentMethod === 'dolyami') {
        try {
          const initRes = await fetch(
            `https://${projectId}.supabase.co/functions/v1/tinkoff-init`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
              body: JSON.stringify({
                order_number: num,
                amount: finalPrice,
                customer_email: form.email,
                customer_phone: form.phone,
                payment_method: form.paymentMethod,
                // Не передаём SuccessURL — Т-Банк покажет свой финальный экран "Оплачено / В магазин"
                fail_url: `${window.location.origin}/checkout?order=${num}&payment=fail`,
                items: items.map(i => ({
                  name: i.product.name,
                  quantity: i.quantity,
                  amount: i.product.price * i.quantity,
                })),
              }),
            }
          );
          const initData = await initRes.json();
          if (!initRes.ok || !initData.payment_url) {
            throw new Error(initData.error || 'Не удалось создать платёж');
          }
          clearCart();
          window.location.href = initData.payment_url;
          return;
        } catch (payErr) {
          console.error('Tinkoff init error:', payErr);
          toast.error('Не удалось перейти к оплате', {
            description: (payErr as Error).message,
          });
          setSubmitting(false);
          return;
        }
      }

      clearCart();
      setDone(true);
      toast.success('Заказ оформлен!', { description: `Номер заказа: ${num}` });

      // Send order confirmation email (fire-and-forget)
      supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'order-confirmation',
          recipientEmail: form.email,
          idempotencyKey: `order-confirm-${num}`,
          templateData: {
            orderNumber: num,
            customerName: form.name,
            items: items.map(i => ({
              name: i.product.name,
              size: i.size,
              color: i.color.name,
              quantity: i.quantity,
              price: i.product.price * i.quantity,
            })),
            totalPrice: priceAfterCombo,
            deliveryPrice,
            deliveryMethod: form.deliveryMethod,
            city: form.city,
            address: form.address,
            paymentMethod: form.paymentMethod,
            discountAmount: appliedCombo?.savings || 0,
          },
        },
      }).catch(err => console.error('Email send error:', err));
    } catch (error) {
      console.error('Order save error:', error);
      // Still complete the order even if DB save fails
      setOrderNumber(num);
      clearCart();
      setDone(true);
      toast.success('Заказ оформлен!', { description: `Номер заказа: ${num}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-4 w-4 mr-1" /> Назад
      </Button>
      <SEO title="Оформление заказа" description="Оформление заказа в āsana." noindex />
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
              <ConsentCheckbox
                id="checkout-consent"
                checked={consent}
                onCheckedChange={(v) => { setConsent(v); setConsentError(''); }}
                error={consentError}
              />
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
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={form.paymentMethod === 'card' ? 'default' : 'outline'}
                    className="h-16"
                    onClick={() => updateField('paymentMethod', 'card')}
                  >💳 Карта</Button>
                  <Button
                    variant={form.paymentMethod === 'sbp' ? 'default' : 'outline'}
                    className="h-16"
                    onClick={() => updateField('paymentMethod', 'sbp')}
                  >📱 СБП</Button>
                </div>
                {isDolyamiEligible(finalPrice) && (
                  <button
                    type="button"
                    onClick={() => updateField('paymentMethod', 'dolyami')}
                    className={cn(
                      'mt-3 w-full flex items-center justify-between gap-3 px-4 py-3 border transition-colors text-left',
                      form.paymentMethod === 'dolyami'
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border hover:bg-secondary/40',
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-[0.18em] opacity-80">
                        Долями — 4 платежа без переплат
                      </span>
                      <span className="text-base font-semibold mt-0.5">
                        4 × {formatPrice(dolyamiPart(finalPrice))}
                      </span>
                    </div>
                    <span className="text-sm font-semibold lowercase tracking-tight">долями</span>
                  </button>
                )}
                {errors.paymentMethod && <p className="text-xs text-destructive mt-1">{errors.paymentMethod}</p>}
              </div>
            </div>
          )}


          <div className="flex gap-3 mt-8">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Назад</Button>}
            <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? 'Оформление...'
                : step < 2
                ? 'Далее'
                : form.paymentMethod === 'dolyami'
                ? `Оплатить Долями · 4 × ${formatPrice(dolyamiPart(finalPrice))}`
                : `Оплатить ${formatPrice(finalPrice)}`}
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
                  src={item.product.images[0]}
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
                <span>Скидка по сету «{appliedCombo.comboName}» (-{appliedCombo.discountPercent}%)</span>
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
            <div className="pt-1">
              <DolyamiBadge price={finalPrice} variant="block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
