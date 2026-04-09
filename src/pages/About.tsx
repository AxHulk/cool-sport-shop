import { Sparkles, Droplets, Leaf } from 'lucide-react';

const About = () => (
  <div className="container py-12 max-w-3xl mx-auto">
    <h1 className="text-4xl font-serif mb-8 text-center">О бренде</h1>
    <p className="text-lg text-muted-foreground mb-8 text-center">
      FORMA — это премиальная спортивная одежда для женщин, которые ценят стиль, комфорт и осознанный подход к спорту.
    </p>

    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-serif mb-4">Наша философия</h2>
        <p className="text-muted-foreground">
          Мы верим, что спортивная одежда может быть одновременно функциональной и элегантной.
          Каждая вещь FORMA создана, чтобы вы чувствовали себя уверенно — на тренировке и за её пределами.
          Мы не гонимся за трендами, а создаём вневременные вещи с безупречной посадкой.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-serif mb-4">Технологии тканей</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: 'SilkTouch™', desc: 'Ультрамягкий нейлон из Италии с шелковистым финишем. Не скатывается после стирок.' },
            { icon: Droplets, title: 'DryFlow™', desc: 'Технология отведения влаги. Ткань высыхает в 3 раза быстрее обычного полиэстера.' },
            { icon: Leaf, title: 'EcoStretch™', desc: 'Переработанный спандекс без потери эластичности. 40% меньше углеродного следа.' },
          ].map(t => (
            <div key={t.title} className="text-center p-6 bg-secondary rounded-lg">
              <t.icon className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-sans font-semibold mb-2">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default About;
