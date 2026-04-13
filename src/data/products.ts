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
import blackTopFront from '@/assets/black_top_front.png';
import blackTopBack from '@/assets/black_top_back.png';
import whiteTopFront from '@/assets/white_top_front.png';
import whiteTopBack from '@/assets/white_top_back.png';
import leggingsBlackFront from '@/assets/leggings_black_front.png';
import leggingsBlackBack from '@/assets/leggings_black_back.png';
import leggingsBlueFront from '@/assets/leggings_blue_front.png';
import leggingsBlueBack from '@/assets/leggings_blue_back.png';
import brownLeggingsFront from '@/assets/brown_leggings_front.jpg';
import brownLeggingsBack from '@/assets/brown_leggings_back.jpg';
import brownLeggingsDetail1 from '@/assets/brown_leggings_detail1.jpg';
import brownLeggingsDetail2 from '@/assets/brown_leggings_detail2.jpg';
import brownLeggingsDetail3 from '@/assets/brown_leggings_detail3.jpg';
import brownLeggingsDetail4 from '@/assets/brown_leggings_detail4.jpg';
import brownLeggingsDetail5 from '@/assets/brown_leggings_detail5.jpg';
import leggingsWhiteFront from '@/assets/leggings_white_front.png';
import leggingsWhiteBack from '@/assets/leggings_white_back.png';
import bagBlueFront from '@/assets/bag_blue_front_v3.png';
import bagBlueBack from '@/assets/bag_blue_back_v3.png';
import bagBlackFront from '@/assets/bag_black_front_v3.png';
import bagBlackBack from '@/assets/bag_black_back_v3.png';

export type ProductCategory = 'leggings' | 'tops' | 'rashguards' | 'bags';
export type ProductSize = 'XS' | 'S' | 'M' | 'L';
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
  // --- РАШГАРДЫ ---
  {
    id: '9',
    name: 'Рашгард на молнии',
    category: 'rashguards',
    price: 7600,
    images: [jacketFront],
    spinImages: [jacketFront, jacketBack],
    colorSpinImages: {
      'Чёрный': [jacketFront, jacketBack],
      'Шоколад': [brownJacketFront, brownJacketBack],
      'Айвори': [whiteJacketFront, whiteJacketBack],
    },
    colorImages: {
      'Чёрный': jacketFront,
      'Шоколад': brownJacketFront,
      'Айвори': whiteJacketFront,
    },
    colors: [
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Шоколад', hex: '#3e2723' },
      { name: 'Айвори', hex: '#f0e6d3' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Приталенный силуэт с моделирующим эффектом. Карманы на молнии. Плотный эластичный материал.',
    specs: {
      'Силуэт': 'Приталенный',
      'Застёжка': 'Молния',
      'Карманы': 'На молнии',
      'Материал': 'Плотный эластичный',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
    isBestseller: true,
  },

  // --- ЛЕГГИНСЫ ---
  {
    id: '13',
    name: 'Леггинсы компрессионные',
    category: 'leggings',
    price: 6500,
    images: [leggingsBlackFront],
    spinImages: [leggingsBlackFront, leggingsBlackBack],
    colorSpinImages: {
      'Чёрный': [leggingsBlackFront, leggingsBlackBack],
      'Голубой': [leggingsBlueFront, leggingsBlueBack],
    },
    colorImages: {
      'Чёрный': leggingsBlackFront,
      'Голубой': leggingsBlueFront,
    },
    colors: [
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Голубой', hex: '#c7dcf7' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Облегающий силуэт с посадкой на талии. Компрессионный эффект с утягивающей вставкой в области живота. Потайной карман на поясе сзади. Плоские фигурные швы. Дышащий материал высокой эластичности. Непросвечивающая ткань.',
    specs: {
      'Силуэт': 'Облегающий',
      'Посадка': 'На талии',
      'Компрессия': 'С утягивающей вставкой',
      'Карман': 'Потайной на поясе',
      'Ткань': 'Дышащая, непросвечивающая',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
  },
  {
    id: '14',
    name: 'Леггинсы в шоколадном цвете',
    category: 'leggings',
    price: 6500,
    images: [brownLeggingsFront, brownLeggingsBack, brownLeggingsDetail1, brownLeggingsDetail2, brownLeggingsDetail3, brownLeggingsDetail4, brownLeggingsDetail5],
    modelUrl: '/models/brown_leggings.glb',
    spinImages: [brownLeggingsFront, brownLeggingsBack],
    colors: [
      { name: 'Шоколад', hex: '#5a3b32' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Облегающий силуэт с посадкой на талии. Компрессионный эффект с утягивающей вставкой в области живота. Потайной карман на поясе сзади. Плоские фигурные швы. Дышащий материал высокой эластичности. Непросвечивающая ткань.',
    specs: {
      'Силуэт': 'Облегающий',
      'Посадка': 'На талии',
      'Компрессия': 'С утягивающей вставкой',
      'Карман': 'Потайной на поясе',
      'Ткань': 'Дышащая, непросвечивающая',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
  },
  {
    id: '15',
    name: 'Леггинсы в цвете айвори',
    category: 'leggings',
    price: 6500,
    images: [leggingsWhiteFront],
    spinImages: [leggingsWhiteFront, leggingsWhiteBack],
    colors: [
      { name: 'Айвори', hex: '#f0ede4' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Облегающий силуэт с посадкой на талии. Компрессионный эффект с утягивающей вставкой в области живота. Потайной карман на поясе сзади. Плоские фигурные швы. Дышащий материал высокой эластичности. Непросвечивающая ткань.',
    specs: {
      'Силуэт': 'Облегающий',
      'Посадка': 'На талии',
      'Компрессия': 'С утягивающей вставкой',
      'Карман': 'Потайной на поясе',
      'Ткань': 'Дышащая, непросвечивающая',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
  },

  // --- ТОПЫ ---
  {
    id: '10',
    name: 'Топ спортивный',
    category: 'tops',
    price: 5500,
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
    description: 'Укороченный фасон с квадратным вырезом. Тонкие бретели, надёжная фиксация груди, съёмные чашки. Эластичный непросвечивающий материал. Силиконовый логотип на спинке.',
    specs: {
      'Фасон': 'Укороченный',
      'Вырез': 'Квадратный',
      'Бретели': 'Тонкие',
      'Чашки': 'Съёмные',
      'Материал': 'Эластичный, непросвечивающий',
      'Уход': 'Ручная стирка',
    },
    isNew: true,
  },
  {
    id: '11',
    name: 'Топ спортивный с перекрёстными бретелями',
    category: 'tops',
    price: 5500,
    images: [brownBraFront],
    spinImages: [brownBraFront, brownBraBack],
    colors: [
      { name: 'Шоколад', hex: '#3e2723' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Укороченный фасон с квадратным вырезом. Перекрёстные бретели на спине. Надёжная фиксация груди, съёмные чашки. Эластичный непросвечивающий материал. Силиконовый логотип на спинке.',
    specs: {
      'Фасон': 'Укороченный',
      'Вырез': 'Квадратный',
      'Бретели': 'Перекрёстные',
      'Чашки': 'Съёмные',
      'Материал': 'Эластичный, непросвечивающий',
      'Уход': 'Ручная стирка',
    },
    isNew: true,
  },
  {
    id: '12',
    name: 'Майка моделирующая на тонких бретелях',
    category: 'tops',
    price: 5500,
    images: [blackTopFront],
    spinImages: [blackTopFront, blackTopBack],
    colorSpinImages: {
      'Чёрный': [blackTopFront, blackTopBack],
      'Айвори': [whiteTopFront, whiteTopBack],
    },
    colorImages: {
      'Чёрный': blackTopFront,
      'Айвори': whiteTopFront,
    },
    colors: [
      { name: 'Чёрный', hex: '#1a1a1a' },
      { name: 'Айвори', hex: '#f0e6d3' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Удлинённый фасон с приталенным силуэтом. V-образный вырез, тонкие лямки с регулировкой. Быстросохнущий материал. Поддержка груди, съёмные чашки.',
    specs: {
      'Фасон': 'Удлинённый',
      'Вырез': 'V-образный',
      'Лямки': 'Тонкие, регулируемые',
      'Чашки': 'Съёмные',
      'Материал': 'Быстросохнущий',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
  },

  // --- СУМКИ ---
  {
    id: '16',
    name: 'Сумка спортивная',
    category: 'bags',
    price: 6900,
    images: [bagBlueFront],
    spinImages: [bagBlueFront, bagBlueBack],
    colorSpinImages: {
      'Голубой': [bagBlueFront, bagBlueBack],
      'Чёрный': [bagBlackFront, bagBlackBack],
    },
    colorImages: {
      'Голубой': bagBlueFront,
      'Чёрный': bagBlackFront,
    },
    colors: [
      { name: 'Голубой', hex: '#c7dcf7' },
      { name: 'Чёрный', hex: '#1a1a1a' },
    ],
    sizes: ['M', 'L'],
    description: 'Мягкая текстильная сумка с верхними ручками и съёмным плечевым ремнём. Подходит для города и тренировок.',
    specs: {
      'Материал': 'Плотный текстиль',
      'Формат': 'Средний',
      'Ремень': 'Съёмный, регулируемый',
      'Уход': 'Сухая чистка',
    },
    isNew: true,
  },
];
