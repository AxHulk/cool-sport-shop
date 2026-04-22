import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import { organizationLd, websiteLd } from '@/lib/seo';
import heroImg from '@/assets/hero_collage.webp';
import shopTheLook from '@/assets/shop_the_look.webp';

// Простой детерминированный PRNG (mulberry32) — одинаковый сид → одинаковая последовательность
const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Index = () => {
  // Сид меняется каждые 7 дней (число полных 7-дневных интервалов от epoch)
  const weekSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const featured = seededShuffle(products, weekSeed).slice(0, 4);

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
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={shopTheLook}
            alt="Соберите образ āsana"
            width={1920}
            height={800}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover aspect-[21/9]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              asChild
              className="rounded-none h-12 px-8 text-xs font-semibold uppercase tracking-[0.22em]"
            >
              <Link to="/catalog">Собрать образ</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
