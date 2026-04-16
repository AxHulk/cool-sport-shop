import catLeggings from '@/assets/cat-leggings.webp';
import catTops from '@/assets/cat-tops.webp';
import catRashguards from '@/assets/cat-rashguards.webp';
import catBags from '@/assets/cat-bags.webp';
import blackJacket1 from '@/assets/black_jacket_1.webp';
import blackJacket2 from '@/assets/black_jacket_2.webp';
import blackJacket3 from '@/assets/black_jacket_3.webp';
import blackJacket4 from '@/assets/black_jacket_4.webp';
import blackJacket5 from '@/assets/black_jacket_5.webp';
import blackJacket6 from '@/assets/black_jacket_6.webp';
import brownJacket1 from '@/assets/brown_jacket_1.webp';
import brownJacket2 from '@/assets/brown_jacket_2.webp';
import brownJacket3 from '@/assets/brown_jacket_3.webp';
import ivoryJacket1 from '@/assets/ivory_jacket_1.webp';
import ivoryJacket2 from '@/assets/ivory_jacket_2.webp';
import braFront from '@/assets/black_bra_3d_front.webp';
import braBack from '@/assets/black_bra_3d_back.webp';
import braDetail1 from '@/assets/black_bra_detail1.webp';
import braDetail2 from '@/assets/black_bra_detail2.webp';
import blueBraDetail1 from '@/assets/blue_bra_detail1.webp';
import blueBraDetail2 from '@/assets/blue_bra_detail2.webp';
import blueBraDetail3 from '@/assets/blue_bra_detail3.webp';
import brownBraDetail1 from '@/assets/brown_bra_detail1.webp';
import brownBraDetail2 from '@/assets/brown_bra_detail2.webp';
import blueBraFront from '@/assets/blue_bra_3d_front.webp';
import blueBraBack from '@/assets/blue_bra_3d_back.webp';
import brownBraFront from '@/assets/brown_bra_3d_front.webp';
import brownBraBack from '@/assets/brown_bra_3d_back.webp';
import blackTopFront from '@/assets/black_top_front.webp';
import blackTopBack from '@/assets/black_top_back.webp';
import blackTopDetail1 from '@/assets/black_top_detail1.webp';
import blackTopDetail2 from '@/assets/black_top_detail2.webp';
import blackTopDetail3 from '@/assets/black_top_detail3.webp';
import whiteTopFront from '@/assets/white_top_front.webp';
import whiteTopBack from '@/assets/white_top_back.webp';
import whiteTopDetail1 from '@/assets/white_top_detail1.webp';
import whiteTopDetail2 from '@/assets/white_top_detail2.webp';
import whiteTopDetail3 from '@/assets/white_top_detail3.webp';
import blackLeggings1 from '@/assets/black_leggings_1.webp';
import blackLeggings2 from '@/assets/black_leggings_2.webp';
import blackLeggings3 from '@/assets/black_leggings_3.webp';
import blackLeggings4 from '@/assets/black_leggings_4.webp';
import blackLeggings5 from '@/assets/black_leggings_5.webp';
import blueLeggings1 from '@/assets/blue_leggings_1.webp';
import blueLeggings2 from '@/assets/blue_leggings_2.webp';
import blueLeggings3 from '@/assets/blue_leggings_3.webp';
import blueLeggings4 from '@/assets/blue_leggings_4.webp';
import blueLeggings5 from '@/assets/blue_leggings_5.webp';
import brownLeggingsFront from '@/assets/brown_leggings_front.webp';
import brownLeggingsBack from '@/assets/brown_leggings_back.webp';
import brownLeggingsDetail1 from '@/assets/brown_leggings_detail1.webp';
import brownLeggingsDetail2 from '@/assets/brown_leggings_detail2.webp';
import brownLeggingsDetail3 from '@/assets/brown_leggings_detail3.webp';
import brownLeggingsDetail4 from '@/assets/brown_leggings_detail4.webp';
import brownLeggingsDetail5 from '@/assets/brown_leggings_detail5.webp';
import ivoryLeggings1 from '@/assets/ivory_leggings_new_1.png';
import ivoryLeggings2 from '@/assets/ivory_leggings_new_2.png';
import bagBlueFront from '@/assets/bag_blue_front_v3.webp';
import bagBlueBack from '@/assets/bag_blue_back_v3.webp';
import bagBlueDetail1 from '@/assets/bag_blue_detail1.webp';
import bagBlueDetail2 from '@/assets/bag_blue_detail2.webp';
import bagBlackFront from '@/assets/bag_black_front_v3.webp';
import bagBlackBack from '@/assets/bag_black_back_v3.webp';
import bagBlackDetail1 from '@/assets/bag_black_detail1.webp';
import bagBlackDetail2 from '@/assets/bag_black_detail2.webp';

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
    spinImages: [blackJacket1, blackJacket2, blackJacket3, blackJacket4, blackJacket5, blackJacket6],
    colorSpinImages: {
      'Чёрный': [blackJacket1, blackJacket2, blackJacket3, blackJacket4, blackJacket5, blackJacket6],
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
    spinImages: [blackLeggings1, blackLeggings2, blackLeggings3, blackLeggings4, blackLeggings5],
    colorSpinImages: {
      'Чёрный': [blackLeggings1, blackLeggings2, blackLeggings3, blackLeggings4, blackLeggings5],
      'Голубой': [blueLeggings1, blueLeggings2, blueLeggings3, blueLeggings4, blueLeggings5],
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
    images: [brownLeggingsFront, brownLeggingsBack, brownLeggingsDetail1, brownLeggingsDetail2, brownLeggingsDetail3, brownLeggingsDetail4, brownLeggingsDetail5],
    modelUrl: '/models/brown_leggings.glb',
    spinImages: [brownLeggingsFront, brownLeggingsBack, brownLeggingsDetail1, brownLeggingsDetail2, brownLeggingsDetail3, brownLeggingsDetail4, brownLeggingsDetail5],
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
    spinImages: [braFront, braBack, braDetail1, braDetail2],
    colorSpinImages: {
      'Чёрный': [braFront, braBack, braDetail1, braDetail2],
      'Голубой': [blueBraFront, blueBraBack, blueBraDetail1, blueBraDetail2, blueBraDetail3],
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
    spinImages: [brownBraFront, brownBraBack, brownBraDetail1, brownBraDetail2],
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
    spinImages: [blackTopFront, blackTopBack, blackTopDetail1, blackTopDetail2, blackTopDetail3],
    colorSpinImages: {
      'Чёрный': [blackTopFront, blackTopBack, blackTopDetail1, blackTopDetail2, blackTopDetail3],
      'Айвори': [whiteTopFront, whiteTopBack, whiteTopDetail1, whiteTopDetail2, whiteTopDetail3],
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
    spinImages: [bagBlueFront, bagBlueBack, bagBlueDetail1, bagBlueDetail2],
    colorSpinImages: {
      'Голубой': [bagBlueFront, bagBlueBack, bagBlueDetail1, bagBlueDetail2],
      'Чёрный': [bagBlackFront, bagBlackBack, bagBlackDetail1, bagBlackDetail2],
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
