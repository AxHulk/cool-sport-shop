import catLeggings from '@/assets/cat-leggings.webp';
import catTops from '@/assets/cat-tops.webp';
import catRashguards from '@/assets/cat-rashguards.webp';
import catBags from '@/assets/cat-bags.webp';
import catLongsleeves from '@/assets/longsleeve_ivory_1.webp';
import blackJacket1 from '@/assets/black_jacket_new_1.webp';
import blackJacket2 from '@/assets/black_jacket_new_2.webp';
import brownJacket1 from '@/assets/brown_jacket_new_1.webp';
import brownJacket2 from '@/assets/brown_jacket_new_2.webp';
import brownJacket3 from '@/assets/brown_jacket_new_3.webp';
import ivoryJacket1 from '@/assets/ivory_jacket_new_1.webp';
import ivoryJacket2 from '@/assets/ivory_jacket_new_2.webp';
import braFront from '@/assets/black_bra_new_1.webp';
import braBack from '@/assets/black_bra_new_2.webp';
import blueBraFront from '@/assets/blue_bra_new_1.webp';
import blueBraBack from '@/assets/blue_bra_new_2.webp';
import brownBraFront from '@/assets/brown_bra_new_1.webp';
import brownBraBack from '@/assets/brown_bra_new_2.webp';
import blackTopFront from '@/assets/black_top_new_1.webp';
import blackTopBack from '@/assets/black_top_new_2.webp';
import whiteTopFront from '@/assets/white_top_new_1.webp';
import whiteTopBack from '@/assets/white_top_new_2.webp';
import blackLeggings1 from '@/assets/black_leggings_new_1.webp';
import blackLeggings2 from '@/assets/black_leggings_new_2.webp';
import blueLeggings1 from '@/assets/blue_leggings_new_1.webp';
import blueLeggings2 from '@/assets/blue_leggings_new_2.webp';
import brownLeggings1 from '@/assets/brown_leggings_new_1.webp';
import brownLeggings2 from '@/assets/brown_leggings_new_2.webp';
import ivoryLeggings1 from '@/assets/ivory_leggings_new_1.webp';
import ivoryLeggings2 from '@/assets/ivory_leggings_new_2.webp';
import bagBlueFront from '@/assets/bag_blue_new_1.webp';
import bagBlueBack from '@/assets/bag_blue_new_2.webp';
import bagBlackFront from '@/assets/bag_black_new_1.webp';
import longsleeveJoy1 from '@/assets/longsleeve_ivory_1.webp';
import longsleeveJoy2 from '@/assets/longsleeve_ivory_2.webp';
import longsleeveEnergy1 from '@/assets/longsleeve_energy_1.webp';
import longsleeveEnergy2 from '@/assets/longsleeve_energy_2.webp';

export type ProductCategory = 'leggings' | 'tops' | 'rashguards' | 'bags' | 'longsleeves';
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
  colorModelUrls?: Record<string, string>;
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
  { slug: 'longsleeves' as const, name: 'Лонгсливы', image: catLongsleeves },
];

export const products: Product[] = [
  // --- РАШГАРДЫ ---
  {
    id: '9',
    name: 'Рашгард на молнии',
    category: 'rashguards',
    price: 7600,
    images: [blackJacket1],
    modelUrl: '/models/black_rashguard.glb',
    colorModelUrls: {
      'Чёрный': '/models/black_rashguard.glb',
      'Шоколад': '/models/brown_rashguard.glb',
      'Айвори': '/models/ivory_rashguard.glb',
    },
    spinImages: [blackJacket1, blackJacket2],
    colorSpinImages: {
      'Чёрный': [blackJacket1, blackJacket2],
      'Шоколад': [brownJacket1, brownJacket2, brownJacket3],
      'Айвори': [ivoryJacket1, ivoryJacket2],
    },
    colorImages: {
      'Чёрный': blackJacket1,
      'Шоколад': brownJacket1,
      'Айвори': ivoryJacket1,
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
    images: [blackLeggings1],
    modelUrl: '/models/black_leggings.glb',
    colorModelUrls: {
      'Чёрный': '/models/black_leggings.glb',
      'Голубой': '/models/blue_leggings.glb',
    },
    spinImages: [blackLeggings1, blackLeggings2],
    colorSpinImages: {
      'Чёрный': [blackLeggings1, blackLeggings2],
      'Голубой': [blueLeggings1, blueLeggings2],
    },
    colorImages: {
      'Чёрный': blackLeggings1,
      'Голубой': blueLeggings1,
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
    images: [brownLeggings1, brownLeggings2],
    modelUrl: '/models/brown_leggings.glb',
    spinImages: [brownLeggings1, brownLeggings2],
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
    images: [ivoryLeggings1, ivoryLeggings2],
    modelUrl: '/models/ivory_leggings.glb',
    spinImages: [ivoryLeggings1, ivoryLeggings2],
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
    modelUrl: '/models/black_bra.glb',
    colorModelUrls: {
      'Чёрный': '/models/black_bra.glb',
      'Голубой': '/models/blue_bra.glb',
    },
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
    modelUrl: '/models/brown_bra.glb',
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
    modelUrl: '/models/black_top.glb',
    colorModelUrls: {
      'Чёрный': '/models/black_top.glb',
      'Айвори': '/models/ivory_top.glb',
    },
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
    modelUrl: '/models/blue_bag.glb',
    colorModelUrls: {
      'Голубой': '/models/blue_bag.glb',
      'Чёрный': '/models/black_bag.glb',
    },
    spinImages: [bagBlueFront, bagBlueBack],
    colorSpinImages: {
      'Голубой': [bagBlueFront, bagBlueBack],
      'Чёрный': [bagBlackFront],
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

  // --- ЛОНГСЛИВЫ ---
  {
    id: '17',
    name: 'Лонгслив «Радость жизни»',
    category: 'longsleeves',
    price: 7600,
    images: [longsleeveJoy1],
    modelUrl: '/models/longsleeve.glb',
    spinImages: [longsleeveJoy1, longsleeveJoy2],
    colors: [
      { name: 'Айвори', hex: '#f0e6d3' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Лонгслив свободного кроя из мягкого хлопкового трикотажа. Надпись-аффирмация на предплечье. Круглый вырез, длинные рукава с манжетами. Подходит для тренировок и повседневной носки.',
    specs: {
      'Крой': 'Свободный',
      'Вырез': 'Круглый',
      'Рукава': 'Длинные, с манжетами',
      'Материал': 'Хлопковый трикотаж',
      'Особенности': 'Надпись на предплечье',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
  },
  {
    id: '18',
    name: 'Лонгслив «Ты — энергия!»',
    category: 'longsleeves',
    price: 7600,
    images: [longsleeveEnergy1],
    modelUrl: '/models/longsleeve.glb',
    spinImages: [longsleeveEnergy1, longsleeveEnergy2],
    colors: [
      { name: 'Айвори', hex: '#f0e6d3' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Лонгслив свободного кроя из мягкого хлопкового трикотажа. Надпись-аффирмация на предплечье. Круглый вырез, длинные рукава с манжетами. Подходит для тренировок и повседневной носки.',
    specs: {
      'Крой': 'Свободный',
      'Вырез': 'Круглый',
      'Рукава': 'Длинные, с манжетами',
      'Материал': 'Хлопковый трикотаж',
      'Особенности': 'Надпись на предплечье',
      'Уход': 'Машинная стирка при 30°C',
    },
    isNew: true,
  },
];
