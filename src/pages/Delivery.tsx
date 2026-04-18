import { Truck, CreditCard, RefreshCw, MapPin } from 'lucide-react';
import SEO from '@/components/SEO';

const Delivery = () => (
  <div className="container py-12 max-w-3xl mx-auto">
    <SEO
      title="Доставка и оплата"
      description="Курьерская доставка по Москве за 1–2 дня и по России за 3–7 дней. Оплата картой, СБП. Бесплатная доставка от 5000 ₽."
    />
    <h1 className="text-4xl font-serif mb-8 text-center">Доставка и оплата</h1>

    <div className="space-y-8">
      <section className="flex gap-4">
        <Truck className="h-6 w-6 text-accent shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Курьерская доставка</h2>
          <p className="text-muted-foreground">По Москве — 1–2 дня (бесплатно от 5 000 ₽). По России — 3–7 дней (от 350 ₽).</p>
        </div>
      </section>

      <section className="flex gap-4">
        <MapPin className="h-6 w-6 text-accent shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Пункты выдачи</h2>
          <p className="text-muted-foreground">Более 15 000 пунктов выдачи по всей России. Бесплатно от 3 000 ₽.</p>
        </div>
      </section>

      <section className="flex gap-4">
        <CreditCard className="h-6 w-6 text-accent shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Оплата</h2>
          <p className="text-muted-foreground">Банковская карта, СБП, рассрочка от Т-Банк (0-0-4). Оплата при получении для курьерской доставки.</p>
        </div>
      </section>

      <section className="flex gap-4">
        <RefreshCw className="h-6 w-6 text-accent shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Возврат и обмен</h2>
          <p className="text-muted-foreground">Бесплатный возврат в течение 14 дней. Примерка при получении курьером. Обмен размера — бесплатно.</p>
        </div>
      </section>
    </div>
  </div>
);

export default Delivery;
