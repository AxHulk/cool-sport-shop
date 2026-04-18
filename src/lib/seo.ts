import { SITE_URL } from '@/components/SEO';

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'āsana',
  alternateName: 'Асана',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: 'Премиальная спортивная одежда для женщин: леггинсы, топы, рашгарды, лонгсливы и сумки.',
  email: 'asana.wear@yandex.ru',
  telephone: '+7-978-77-69-299',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Студенческая, д. 25',
    addressLocality: 'Симферополь',
    postalCode: '295001',
    addressCountry: 'RU',
  },
  sameAs: [],
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'āsana',
  url: SITE_URL,
  inLanguage: 'ru-RU',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/catalog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbLd = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  })),
});

export const productLd = (p: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.name,
  description: p.description,
  image: p.image.startsWith('http') ? p.image : `${SITE_URL}${p.image}`,
  sku: p.id,
  brand: { '@type': 'Brand', name: 'āsana' },
  category: p.category,
  offers: {
    '@type': 'Offer',
    url: `${SITE_URL}/product/${p.id}`,
    priceCurrency: 'RUB',
    price: p.price,
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
  },
});
