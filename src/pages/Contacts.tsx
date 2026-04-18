import { Phone, Mail } from 'lucide-react';
import SEO from '@/components/SEO';
import { organizationLd } from '@/lib/seo';

const Contacts = () => (
  <div className="container py-12 max-w-3xl mx-auto">
    <SEO
      title="Контакты āsana"
      description="Телефон +7 (978) 77-69-299, email asana.wear@yandex.ru. Симферополь, ул. Студенческая, 25. Ежедневно с 9:00 до 21:00."
      jsonLd={organizationLd}
    />
    <h1 className="text-4xl font-serif mb-8 text-center">Контакты</h1>
    <p className="text-center text-muted-foreground mb-10">Мы всегда на связи и рады помочь!</p>

    <div className="grid md:grid-cols-2 gap-6 mb-10">
      <div className="flex gap-4 p-6 bg-secondary rounded-lg">
        <Phone className="h-6 w-6 text-accent shrink-0" />
        <div>
          <h3 className="font-semibold">Телефон</h3>
          <p className="text-sm font-medium">+7 (978) 77-69-299</p>
          <p className="text-xs text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
        </div>
      </div>
      <div className="flex gap-4 p-6 bg-secondary rounded-lg">
        <Mail className="h-6 w-6 text-accent shrink-0" />
        <div>
          <h3 className="font-semibold">Email</h3>
          <p className="text-sm font-medium">asana.wear@yandex.ru</p>
          <p className="text-xs text-muted-foreground">Ответим в течение 2 часов</p>
        </div>
      </div>
    </div>

    <div className="bg-secondary rounded-lg p-6 space-y-3 text-sm">
      <h3 className="font-semibold text-base mb-4">Реквизиты</h3>
      <div className="grid gap-2">
        {[
          ['', 'Индивидуальный предприниматель Стрельникова Анастасия Сергеевна'],
          ['ИНН', '910224027786'],
          ['ОГРНИП', '324911200048002'],
          ['Юридический адрес', '295001, Россия, Респ. Крым, г. Симферополь, ул. Студенческая, д. 25'],
          ['Расчётный счёт', '40802810000006279207'],
          ['Банк', 'АО «Тинькофф Банк»'],
          ['БИК', '044525974'],
          ['Корреспондентский счёт', '30101810145250000974'],
        ].map(([label, value]) => (
          <div key={value} className={label ? 'flex flex-col sm:flex-row sm:gap-2' : ''}>
            {label ? (
              <>
                <span className="text-muted-foreground shrink-0 sm:w-48">{label}</span>
                <span className="font-medium">{value}</span>
              </>
            ) : (
              <p className="font-medium">{value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Contacts;
