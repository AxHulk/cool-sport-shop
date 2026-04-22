import { Link } from 'react-router-dom';
import heroAbout from '@/assets/hero_about.webp';
import fabricCloseup from '@/assets/fabric_closeup.webp';
import capsuleFlatlay from '@/assets/capsule_flatlay.webp';
import ctaSection from '@/assets/cta_section.webp';
import iconErgonomics from '@/assets/icon_ergonomics.png';
import iconFabricTech from '@/assets/icon_fabric_tech.png';
import iconCapsule from '@/assets/icon_capsule.png';
import iconEcoEthics from '@/assets/icon_eco_ethics.png';
import iconNoTransparency from '@/assets/icon_no_transparency.png';
import iconShapeRetention from '@/assets/icon_shape_retention.png';
import iconColorRetention from '@/assets/icon_color_retention.png';
import SEO from '@/components/SEO';
import { organizationLd } from '@/lib/seo';

const About = () => (
  <div className="bg-background">
    <SEO
      title="О бренде āsana — премиальная спортивная одежда"
      description="История бренда āsana: итальянские ткани, эргономичный крой, капсульные коллекции и эко-этика. Узнайте философию марки."
      jsonLd={organizationLd}
    />
    {/* Блок 1 — Hero */}
    <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden">
      <div className="container grid md:grid-cols-2 gap-0 items-center">
        <div className="py-16 md:py-24 pr-8">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">О бренде</p>
          <h1 className="text-3xl md:text-5xl font-serif leading-tight mb-6">
            Вдохните спокойствие.<br />Выдохните стресс.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Откройте для себя гармонию движения с āsana.
          </p>
        </div>
        <div className="hidden md:block h-full">
          <img
            src={heroAbout}
            alt="Девушка в спортивной одежде āsana в медитативной позе"
            className="w-full h-full object-cover object-right"
            loading="eager"
          />
        </div>
      </div>
    </section>

    {/* Вступительный текст */}
    <section className="container max-w-3xl mx-auto py-16 md:py-20 text-center">
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
        Современный ритм жизни диктует свои правила. Мы строим карьеру, заботимся о близких, покоряем новые высоты в зале
        и постоянно находимся в движении. В этой гонке истинная роскошь — возможность замедлиться, услышать своё тело
        и найти внутренний центр.
      </p>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-6">
        Бренд āsana родился из простой идеи: ваша одежда не должна отвлекать вас от главного.
        Она должна быть вашей невидимой поддержкой, вашей второй кожей. Мы создаём не просто функциональную
        спортивную одежду — мы конструируем состояние абсолютной уверенности и комфорта, которое остаётся с вами
        на коврике для медитации и за чашкой утреннего кофе после интенсивной тренировки.
      </p>
    </section>

    {/* Блок 2 — Инженерия комфорта */}
    <section className="bg-secondary/40">
      <div className="container grid md:grid-cols-2 gap-8 md:gap-12 items-center py-16 md:py-24">
        <div className="order-2 md:order-1">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Инженерия комфорта</p>
          <h2 className="text-2xl md:text-3xl font-serif mb-6">Технологии и материалы</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Каждый шов, каждый изгиб и каждый элемент нашей одежды спроектирован с одной целью:
            обеспечить идеальную эргономичную посадку. Мы категорически отказались от компромиссов
            между высокой эстетикой и спортивным удобством.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Опираясь на глубокое изучение анатомии женского тела в динамике, команда āsana разрабатывает
            лекала с эффектом деликатного моделирования. Наша одежда визуально корректирует линии фигуры,
            подчёркивая ваши естественные достоинства и обеспечивая надёжную компрессионную поддержку.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Высокотехнологичный матовый бифлекс мгновенно испаряет влагу во время интенсивного кардио,
            а шелковистые фактуры дарят ощущение невесомости на занятиях пилатесом, стретчингом или йогой.
          </p>
        </div>
        <div className="order-1 md:order-2">
          <img
            src={fabricCloseup}
            alt="Макро-фотография премиальной ткани āsana"
            className="w-full rounded-lg object-cover aspect-[4/3]"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    {/* Гарантии качества */}
    <section className="container py-16 md:py-20">
      <h2 className="text-2xl font-serif text-center mb-12">Гарантии качества</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {[
          {
            icon: iconNoTransparency,
            title: 'Не просвечивает',
            desc: 'Плотная вязка гарантирует 100% непрозрачность даже при глубоких приседаниях.',
          },
          {
            icon: iconShapeRetention,
            title: 'Сохраняет форму',
            desc: 'Анатомическая форма сохраняется после десятков циклов машинной стирки.',
          },
          {
            icon: iconColorRetention,
            title: 'Стойкий цвет',
            desc: 'Премиальные красители устойчивы к выцветанию и сохраняют глубину оттенка.',
          },
        ].map((item) => (
          <div key={item.title} className="text-center p-6">
            <img src={item.icon} alt={item.title} className="h-16 w-16 mx-auto mb-4" loading="lazy" />
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Блок 3 — Капсульный гардероб */}
    <section className="bg-secondary/40">
      <div className="container grid md:grid-cols-2 gap-8 md:gap-12 items-center py-16 md:py-24">
        <div>
          <img
            src={capsuleFlatlay}
            alt="Капсульная коллекция āsana — раскладка"
            className="w-full rounded-lg object-cover aspect-[4/3]"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Философия</p>
          <h2 className="text-2xl md:text-3xl font-serif mb-6">Умный капсульный гардероб</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Мы прекрасно понимаем раздражение от утренних сборов, когда спортивные вещи совершенно
            не сочетаются друг с другом. Именно поэтому āsana придерживается строгой философии капсульных коллекций.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Вся наша цветовая палитра и фасоны продуманы математически точно: любые элементы базового
            и акцентного кроя легко миксуются между собой. Приобретая всего несколько базовых вещей,
            вы получаете десятки стильных и функциональных образов. Ваш спортивный гардероб начинает работать на вас.
          </p>
        </div>
      </div>
    </section>

    {/* Блок 4 — Ценности бренда */}
    <section className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Наши ценности</p>
        <h2 className="text-2xl md:text-3xl font-serif mb-6">Что стоит за каждой вещью</h2>
        <p className="text-muted-foreground leading-relaxed">
          Само слово «Асана» переводится как устойчивое, осознанное положение тела.
          И это наше главное обещание: стабильное премиальное качество, прозрачное этичное
          производство и безупречный уровень клиентского сервиса.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {[
          {
            icon: iconErgonomics,
            title: 'Эргономика и посадка',
            desc: 'Анатомический крой, созданный с учётом женской физиологии в динамике.',
          },
          {
            icon: iconFabricTech,
            title: 'Технологичные ткани',
            desc: 'Дышащие, влагоотводящие материалы премиум-класса.',
          },
          {
            icon: iconCapsule,
            title: 'Умная капсула',
            desc: 'Все вещи идеально сочетаются между собой, экономя ваше время.',
          },
          {
            icon: iconEcoEthics,
            title: 'Экологичность',
            desc: 'Безопасное окрашивание и отказ от избыточного пластика в упаковке.',
          },
        ].map((item) => (
          <div key={item.title} className="text-center">
            <img src={item.icon} alt={item.title} className="h-14 w-14 mx-auto mb-4" loading="lazy" />
            <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mt-12">
        Ваш комфорт — наш абсолютный приоритет. Мы разработали интуитивно понятную размерную сетку,
        внедрили удобные системы оплаты и обеспечили быструю доставку по всей стране.
        Наша служба заботы о клиентах всегда готова помочь подобрать идеальный размер.
      </p>
    </section>

    {/* Блок 5 — CTA */}
    <section className="relative w-full min-h-[60vh] flex items-center justify-center">
      <img
        src={ctaSection}
        alt="Две девушки бегут по лесной тропе на рассвете"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {/* Лёгкая виньетка по центру, чтобы текст между фигурами был читаем, не перекрывая фон */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.55)_0%,_rgba(0,0,0,0.25)_45%,_rgba(0,0,0,0)_75%)]" />
      <div className="relative z-10 container text-center text-white py-24 max-w-2xl mx-auto px-6">
        <h2 className="text-2xl md:text-4xl font-serif mb-6 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          Ваш путь к внутреннему миру начинается здесь
        </h2>
        <p className="text-base md:text-lg font-light leading-relaxed mb-8 opacity-95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
          Ваше тело способно на потрясающие вещи, и оно заслуживает экипировки высшего класса.
          Ощутите истинную свободу через движение и бескомпромиссную эстетику.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/catalog"
            className="inline-block px-8 py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.22em] hover:bg-white/90 transition-colors"
          >
            Смотреть коллекцию
          </Link>
          <Link
            to="/catalog?category=leggings"
            className="inline-block px-8 py-3 border border-white text-white text-xs font-semibold uppercase tracking-[0.22em] hover:bg-white/10 transition-colors"
          >
            Подобрать леггинсы
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;
