import catLeggings from '@/assets/cat-leggings.jpg';
import catTops from '@/assets/cat-tops.jpg';
import catRashguards from '@/assets/cat-rashguards.jpg';
import catBags from '@/assets/cat-bags.jpg';
import jacketFront from '@/assets/black_jacket_front.png';
import jacketBack from '@/assets/black_jacket_back.png';

export type ProductCategory = 'leggings' | 'tops' | 'rashguards' | 'bags';
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type ProductColor = { name: string; hex: string };

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  description: string;
  specs: Record<string, string>;
  isNew?: boolean;
  isBestseller?: boolean;
  tags?: string[];
}

export const categories = [
  { slug: 'leggings' as const, name: 'Леггинсы', image: catLeggings },
  { slug: 'tops' as const, name: 'Топы', image: catTops },
  { slug: 'rashguards' as const, name: 'Рашгарды', image: catRashguards },
  { slug: 'bags' as const, name: 'Сумки', image: catBags },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Леггинсы Cloud High-Rise',
    category: 'leggings',
    price: 5990,
    images: [catLeggings],
    colors: [
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Графит', hex: '#4a4a4a' },
      { name: 'Пудра', hex: '#d4a0a0' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Леггинсы с высокой посадкой из премиальной компрессионной ткани. Бесшовная технология для максимального комфорта.',
    specs: {
      'Состав': '78% нейлон, 22% спандекс',
      'Посадка': 'Высокая',
      'Пуш-ап': 'Да',
      'Особенности': 'Бесшовная технология, карман для телефона',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
    isBestseller: true,
  },
  {
    id: '2',
    name: 'Топ Essential Bra',
    category: 'tops',
    price: 3490,
    oldPrice: 4290,
    images: [catTops],
    colors: [
      { name: 'Терракота', hex: '#d4856a' },
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Лаванда', hex: '#b8a9d4' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Спортивный топ средней поддержки с перекрёстными лямками. Мягкие вшитые чашки.',
    specs: {
      'Состав': '80% нейлон, 20% эластан',
      'Поддержка': 'Средняя',
      'Чашки': 'Вшитые, съёмные',
      'Уход': 'Ручная стирка',
    },
    isBestseller: true,
  },
  {
    id: '3',
    name: 'Рашгард Aero Long Sleeve',
    category: 'rashguards',
    price: 4790,
    images: [catRashguards],
    colors: [
      { name: 'Коралловый', hex: '#ff6347' },
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Олива', hex: '#6b7c4e' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Рашгард с длинным рукавом из быстросохнущей ткани с UV-защитой. Облегающий крой.',
    specs: {
      'Состав': '85% полиэстер, 15% спандекс',
      'Крой': 'Облегающий',
      'Рукав': 'Длинный',
      'UV-защита': 'UPF 50+',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
  },
  {
    id: '4',
    name: 'Сумка Studio Duffel',
    category: 'bags',
    price: 6990,
    images: [catBags],
    colors: [
      { name: 'Бежевый', hex: '#c4b59d' },
      { name: 'Чёрный', hex: '#1a1a1a' },
    ],
    sizes: ['M' as ProductSize],
    description: 'Вместительная спортивная сумка с отделением для обуви и карманом для мокрых вещей.',
    specs: {
      'Материал': 'Нейлон с водоотталкивающей пропиткой',
      'Объём': '35 л',
      'Отделения': 'Основное, для обуви, для мокрых вещей',
      'Ремень': 'Съёмный, регулируемый',
    },
  },
  {
    id: '5',
    name: 'Леггинсы Sculpt Mid-Rise',
    category: 'leggings',
    price: 4990,
    images: [catLeggings],
    colors: [
      { name: 'Тёмно-синий', hex: '#1a2744' },
      { name: 'Бордо', hex: '#722f37' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Моделирующие леггинсы со средней посадкой. Ткань с эффектом скульптурирования.',
    specs: {
      'Состав': '75% нейлон, 25% спандекс',
      'Посадка': 'Средняя',
      'Пуш-ап': 'Нет',
      'Уход': 'Машинная стирка при 30°C',
    },
  },
  {
    id: '6',
    name: 'Топ Power Crop',
    category: 'tops',
    price: 2990,
    images: [catTops],
    colors: [
      { name: 'Белый', hex: '#f5f5f5' },
      { name: 'Мятный', hex: '#98d4b4' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Укороченный топ для тренировок высокой интенсивности. Высокая поддержка.',
    specs: {
      'Состав': '82% нейлон, 18% эластан',
      'Поддержка': 'Высокая',
      'Чашки': 'Формованные',
      'Уход': 'Ручная стирка',
    },
    isNew: true,
  },
  {
    id: '7',
    name: 'Рашгард Zen Short Sleeve',
    category: 'rashguards',
    price: 3990,
    images: [catRashguards],
    colors: [
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Пыльная роза', hex: '#c9a0a0' },
    ],
    sizes: ['S', 'M', 'L'],
    description: 'Рашгард с коротким рукавом. Дышащая ткань, идеальна для йоги и пилатеса.',
    specs: {
      'Состав': '88% полиэстер, 12% спандекс',
      'Крой': 'Свободный',
      'Рукав': 'Короткий',
      'Уход': 'Машинная стирка при 30°C',
    },
  },
  {
    id: '8',
    name: 'Сумка Mini Crossbody',
    category: 'bags',
    price: 2490,
    images: [catBags],
    colors: [
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Сливочный', hex: '#f0e6d3' },
    ],
    sizes: ['S' as ProductSize],
    description: 'Компактная сумка через плечо для тренировок. Вмещает телефон, ключи и карту.',
    specs: {
      'Материал': 'Эко-кожа',
      'Объём': '2 л',
      'Отделения': '2 кармана на молнии',
      'Ремень': 'Регулируемый',
    },
    isNew: true,
  },
];
