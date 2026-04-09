import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

const Contacts = () => (
  <div className="container py-12 max-w-3xl mx-auto">
    <h1 className="text-4xl font-serif mb-8 text-center">Контакты</h1>
    <p className="text-center text-muted-foreground mb-10">Мы всегда на связи и рады помочь!</p>

    <div className="grid md:grid-cols-2 gap-6">
      {[
        { icon: Phone, title: 'Телефон', value: '+7 (800) 123-45-67', desc: 'Ежедневно с 9:00 до 21:00' },
        { icon: Mail, title: 'Email', value: 'hello@forma-sport.ru', desc: 'Ответим в течение 2 часов' },
        { icon: MessageCircle, title: 'Telegram', value: '@forma_support', desc: 'Самый быстрый способ связи' },
        { icon: MapPin, title: 'Шоурум', value: 'Москва, ул. Покровка, 10', desc: 'Пн–Вс 10:00–21:00' },
      ].map(c => (
        <div key={c.title} className="flex gap-4 p-6 bg-secondary rounded-lg">
          <c.icon className="h-6 w-6 text-accent shrink-0" />
          <div>
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm font-medium">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Contacts;
