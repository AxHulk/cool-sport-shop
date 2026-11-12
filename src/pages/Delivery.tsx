import { CreditCard, RefreshCw, MapPin } from 'lucide-react';
import SEO from '@/components/SEO';

const Delivery = () => (
  <div className="container py-12 max-w-3xl mx-auto">
    <SEO
      title="Доставка и оплата"
      description="Отправляем из Крыма службой СДЭК: до Москвы 4–7 дней, по России 5–12 дней. Оплата картой, СБП, Долями."
    />
    <h1 className="text-4xl font-serif mb-8 text-center">Доставка и оплата</h1>

    <div className="space-y-8">
      <section className="flex gap-4">
        <MapPin className="h-6 w-6 text-accent shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Доставка в пункты выдачи СДЭК</h2>
          <p className="text-muted-foreground">Отправляем из Крыма в пункты выдачи СДЭК по всей России в течение 1–2 рабочих дней после оплаты. Москва и Санкт-Петербург — 4–7 дней, остальная Россия — 5–12 дней с момента отправки. Стоимость рассчитывается при оформлении заказа.</p>
        </div>
      </section>

      <section className="flex gap-4">
        <CreditCard className="h-6 w-6 text-accent shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Оплата</h2>
          <p className="text-muted-foreground">Банковская карта, СБП, рассрочка от Т-Банк (0-0-4).</p>
        </div>
      </section>

      <section className="flex gap-4">
        <RefreshCw className="h-6 w-6 text-accent shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Возврат и обмен</h2>
          <p className="text-muted-foreground">Бесплатный возврат в течение 14 дней. Обмен размера — бесплатно.</p>
        </div>
      </section>
    </div>
  </div>
);

export default Delivery;
