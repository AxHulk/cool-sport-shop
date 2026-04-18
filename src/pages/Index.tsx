import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import { organizationLd, websiteLd } from '@/lib/seo';
import heroImg from '@/assets/hero.webp';
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
      <section className="relative h-[80vh] min-h-[500px] overflow-hidden">
        <img
          src={heroImg}
          alt="āsana спортивная одежда"
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-foreground/20" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-serif text-background max-w-lg leading-tight">
            Двигайся в своём стиле
          </h1>
          <p className="text-background/80 mt-4 max-w-md text-lg">
            Премиальная спортивная одежда, которая подчёркивает силу и женственность
          </p>
          <Button size="lg" className="mt-6 w-fit" asChild>
            <Link to="/catalog">Смотреть коллекцию <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <h2 className="text-3xl font-serif text-center mb-10">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Link key={cat.slug} to={`/catalog?category=${cat.slug}`} className="group relative aspect-square rounded-lg overflow-hidden">
              <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
              <span className="absolute bottom-4 left-4 text-background font-serif text-xl font-semibold">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-serif">Хиты и новинки</h2>
          <Button variant="ghost" asChild>
            <Link to="/catalog">Все товары <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-secondary py-16">
        <div className="container">
          <h2 className="text-3xl font-serif text-center mb-10">Почему āsana</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {advantages.map(a => (
              <div key={a.title} className="text-center">
                <img src={a.image} alt={a.title} className="h-16 w-auto mx-auto mb-3 object-contain" />
                <h3 className="font-sans font-semibold text-sm mb-1">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop the Look */}
      <section className="container py-16">
        <h2 className="text-3xl font-serif text-center mb-10">Shop the Look</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[look1, look2].map((img, i) => (
            <Link key={i} to="/catalog" className="group relative aspect-[4/5] rounded-lg overflow-hidden">
              <img src={img} alt={`Образ ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
