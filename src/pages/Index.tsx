import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import { organizationLd, websiteLd } from '@/lib/seo';
import heroImg from '@/assets/hero_collage.webp';
import look1 from '@/assets/look1.webp';
import look2 from '@/assets/look2.webp';
import premiumFabrics from '@/assets/premium_fabrics.webp';
import seamlessTech from '@/assets/seamless_tech.webp';
import fastDelivery from '@/assets/fast_delivery.webp';
import fittingReturn from '@/assets/fitting_return.webp';

const Index = () => {
  const featured = products.filter(p => p.isBestseller || p.isNew).slice(0, 4);

  const advantages = [
    { image: premiumFabrics, title: 'Премиальные ткани', desc: 'Итальянский нейлон и японский спандекс' },
    { image: seamlessTech, title: 'Бесшовные технологии', desc: 'Комфорт без раздражения' },
    { image: fastDelivery, title: 'Быстрая доставка', desc: 'По всей России за 2–5 дней' },
    { image: fittingReturn, title: 'Примерка и возврат', desc: 'Бесплатный возврат в течение 14 дней' },
  ];

  return (
    <div>
      <SEO
        title="āsana — премиальная спортивная одежда для женщин"
        description="Стильные леггинсы, топы, рашгарды, лонгсливы и сумки из итальянских тканей. Бесшовные технологии, доставка по России за 2–5 дней."
        jsonLd={[organizationLd, websiteLd]}
      />
      {/* Hero */}
      <section className="bg-secondary">
        <div className="grid lg:grid-cols-[1fr_auto] items-stretch">
          <div className="relative">
            <img
              src={heroImg}
              alt="āsana — премиальная спортивная одежда"
              width={1920}
              height={1071}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover aspect-[16/9] lg:aspect-auto lg:max-h-[80vh]"
            />
          </div>
          <div className="flex flex-col justify-center items-center text-center px-6 py-12 lg:px-16 lg:py-0 lg:w-[420px]">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] tracking-[-0.01em] text-foreground">
              THE EARTH<br />SET
            </h1>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/70">
              Хиты сезона в шоколаде
            </p>
            <Button
              asChild
              className="mt-10 rounded-none h-12 px-8 text-xs font-semibold uppercase tracking-[0.22em]"
            >
              <Link to="/catalog">Смотреть коллекцию</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-[0.22em]">Хиты и новинки</h2>
          <Button variant="ghost" asChild>
            <Link to="/catalog" className="text-xs uppercase tracking-[0.22em]">Все товары <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-[0.22em] text-center mb-10">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Link key={cat.slug} to={`/catalog?category=${cat.slug}`} className="group relative aspect-square rounded-lg overflow-hidden">
              <img src={cat.image} alt={cat.name} width={600} height={600} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
              <span className="absolute bottom-4 left-4 text-background text-xs font-semibold uppercase tracking-[0.22em]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
      {/* Shop the Look */}
      <section className="container py-16">
        <h2 className="text-3xl font-serif text-center mb-10">Shop the Look</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[look1, look2].map((img, i) => (
            <Link key={i} to="/catalog" className="group relative aspect-[4/5] rounded-lg overflow-hidden">
              <img src={img} alt={`Образ ${i + 1}`} width={800} height={1000} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-background font-serif text-2xl mb-2">Образ {i + 1}</p>
                <Button variant="secondary" size="sm">Собрать комплект</Button>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
