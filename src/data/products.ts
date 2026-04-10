import catLeggings from '@/assets/cat-leggings.jpg';
import catTops from '@/assets/cat-tops.jpg';
import catRashguards from '@/assets/cat-rashguards.jpg';
import catBags from '@/assets/cat-bags.jpg';
import jacketFront from '@/assets/black_jacket_front.png';
import jacketBack from '@/assets/black_jacket_back.png';
import brownJacketFront from '@/assets/brown_jacket_front.png';
import brownJacketBack from '@/assets/brown_jacket_back.png';
import whiteJacketFront from '@/assets/white_jacket_front.png';
import whiteJacketBack from '@/assets/white_jacket_back.png';
import braFront from '@/assets/black_bra_3d_front.png';
import braBack from '@/assets/black_bra_3d_back.png';
import blueBraFront from '@/assets/blue_bra_3d_front.png';
import blueBraBack from '@/assets/blue_bra_3d_back.png';
import brownBraFront from '@/assets/brown_bra_3d_front.png';
import brownBraBack from '@/assets/brown_bra_3d_back.png';
import brownBraAngle from '@/assets/brown_bra_3d_angle.png';

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
  modelUrl?: string;
  spinImages?: string[];
  colorSpinImages?: Record<string, string[]>;
  colorImages?: Record<string, string>;
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
  {
    id: '9',
    name: 'Рашгард Stealth Pro',
    category: 'rashguards',
    price: 5490,
    images: [jacketFront, jacketBack],
    colors: [
      { name: 'Чёрный', hex: '#1a1a1a' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Премиальный рашгард с компрессионной посадкой. Быстросохнущая ткань с UV-защитой UPF 50+. Идеален для интенсивных тренировок и водных видов спорта.',
    specs: {
      'Состав': '85% полиэстер, 15% спандекс',
      'Крой': 'Облегающий',
      'Рукав': 'Длинный',
      'UV-защита': 'UPF 50+',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
    isBestseller: true,
  },
  {
    id: '10',
    name: 'Топ Power Bra 3D',
    category: 'tops',
    price: 3990,
    images: [braFront],
    spinImages: [braFront, braBack],
    colorSpinImages: {
      'Чёрный': [braFront, braBack],
      'Голубой': [blueBraFront, blueBraBack],
    },
    colorImages: {
      'Чёрный': braFront,
      'Голубой': blueBraFront,
    },
    colors: [
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Голубой', hex: '#8bb8e8' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Спортивный топ с высокой поддержкой. Дышащая ткань, анатомический крой. Доступен в 3D-просмотре.',
    specs: {
      'Состав': '80% нейлон, 20% эластан',
      'Поддержка': 'Высокая',
      'Чашки': 'Формованные',
      'Уход': 'Ручная стирка',
    },
    isNew: true,
  },
  {
    id: '11',
    name: 'Топ CrossBack Bra',
    category: 'tops',
    price: 4290,
    images: [brownBraFront],
    spinImages: [brownBraFront, brownBraAngle, brownBraBack],
    colors: [
      { name: 'Шоколад', hex: '#3e2723' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Спортивный топ с перекрёстными лямками на спине. Средняя поддержка, мягкая компрессионная ткань. Доступен в 3D-просмотре.',
    specs: {
      'Состав': '80% нейлон, 20% эластан',
      'Поддержка': 'Средняя',
      'Чашки': 'Вшитые',
      'Лямки': 'Перекрёстные',
      'Уход': 'Ручная стирка',
    },
    isNew: true,
  },
];
