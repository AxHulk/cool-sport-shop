import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import { organizationLd, websiteLd } from '@/lib/seo';
import heroImg from '@/assets/hero_collage.jpg';
import { comboSets, getDefaultProductForCategory, calculateComboPrice } from '@/data/comboSets';

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
            <h1 style={{ fontFamily: "'Basic', sans-serif" }} className="text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] tracking-[-0.01em] text-foreground">
              BALANCE
            </h1>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/70">
              soul — body — mind
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
          <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-[0.05em]">Бестселлеры</h2>
          <Button variant="ghost" asChild>
            <Link to="/catalog" className="text-xs uppercase tracking-[0.22em] inline-flex items-center">
              <span className="hidden md:inline">Смотреть товары</span>
              <ArrowRight className="md:ml-1 h-4 w-4" />
            </Link>
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
      {/* Готовые сеты */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60 mb-2">Соберите образ</p>
            <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-[0.05em]">Готовые сеты</h2>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/catalog" className="text-xs uppercase tracking-[0.22em] inline-flex items-center">
              <span className="hidden md:inline">Все товары</span>
              <ArrowRight className="md:ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comboSets.map((combo) => {
            const items = combo.categorySlots
              .map((slot) => getDefaultProductForCategory(slot.category))
              .filter(Boolean) as NonNullable<ReturnType<typeof getDefaultProductForCategory>>[];
            const { fullPrice, discountedPrice, savings } = calculateComboPrice(items, combo.discountPercent);
            const target = items[0] ? `/product/${items[0].id}` : '/catalog';
            return (
              <Link
                key={combo.id}
                to={target}
                className="group relative flex flex-col bg-secondary overflow-hidden border border-transparent hover:border-foreground/20 transition-colors"
              >
                <div className="absolute top-4 left-4 z-10 bg-foreground text-background text-[10px] font-semibold uppercase tracking-[0.22em] px-2.5 py-1">
                  −{combo.discountPercent}%
                </div>
                <div className={`grid ${items.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-px bg-foreground/5 h-[320px] md:h-[360px]`}>
                  {items.map((item) => (
                    <div key={item.id} className="overflow-hidden bg-background">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="text-base font-semibold uppercase tracking-[0.1em]">Сет «{combo.name}»</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/60">{combo.description}</p>
                  </div>
                  <div className="flex items-baseline gap-3 mt-auto">
                    <span className="text-lg font-semibold">{discountedPrice.toLocaleString('ru-RU')} ₽</span>
                    <span className="text-sm text-foreground/50 line-through">{fullPrice.toLocaleString('ru-RU')} ₽</span>
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
                      −{savings.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.22em] text-foreground group-hover:gap-2 gap-1 transition-all">
                    Собрать сет <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Index;
