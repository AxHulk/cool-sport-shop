import catLeggings from '@/assets/cat-leggings.jpg';
import catTops from '@/assets/cat-tops.jpg';
import catRashguards from '@/assets/cat-rashguards.jpg';
import catBags from '@/assets/cat-bags.jpg';
import blackJacket1 from '@/assets/black_jacket_1.jpg';
import blackJacket2 from '@/assets/black_jacket_2.jpg';
import blackJacket3 from '@/assets/black_jacket_3.jpg';
import blackJacket4 from '@/assets/black_jacket_4.jpg';
import blackJacket5 from '@/assets/black_jacket_5.jpg';
import blackJacket6 from '@/assets/black_jacket_6.jpg';
import brownJacket1 from '@/assets/brown_jacket_1.jpg';
import brownJacket2 from '@/assets/brown_jacket_2.jpg';
import brownJacket3 from '@/assets/brown_jacket_3.jpg';
import brownJacket4 from '@/assets/brown_jacket_4.jpg';
import brownJacket5 from '@/assets/brown_jacket_5.jpg';
import ivoryJacket1 from '@/assets/ivory_jacket_1.jpg';
import ivoryJacket2 from '@/assets/ivory_jacket_2.jpg';
import ivoryJacket3 from '@/assets/ivory_jacket_3.jpg';
import ivoryJacket4 from '@/assets/ivory_jacket_4.jpg';
import ivoryJacket5 from '@/assets/ivory_jacket_5.jpg';
import braFront from '@/assets/black_bra_3d_front.png';
import braBack from '@/assets/black_bra_3d_back.png';
import braDetail1 from '@/assets/black_bra_detail1.jpg';
import braDetail2 from '@/assets/black_bra_detail2.jpg';
import blueBraDetail1 from '@/assets/blue_bra_detail1.jpg';
import blueBraDetail2 from '@/assets/blue_bra_detail2.jpg';
import blueBraDetail3 from '@/assets/blue_bra_detail3.jpg';
import brownBraDetail1 from '@/assets/brown_bra_detail1.jpg';
import brownBraDetail2 from '@/assets/brown_bra_detail2.jpg';
import blueBraFront from '@/assets/blue_bra_3d_front.png';
import blueBraBack from '@/assets/blue_bra_3d_back.png';
import brownBraFront from '@/assets/brown_bra_3d_front.png';
import brownBraBack from '@/assets/brown_bra_3d_back.png';
import blackTopFront from '@/assets/black_top_front.png';
import blackTopBack from '@/assets/black_top_back.png';
import blackTopDetail1 from '@/assets/black_top_detail1.jpg';
import blackTopDetail2 from '@/assets/black_top_detail2.jpg';
import blackTopDetail3 from '@/assets/black_top_detail3.jpg';
import whiteTopFront from '@/assets/white_top_front.png';
import whiteTopBack from '@/assets/white_top_back.png';
import whiteTopDetail1 from '@/assets/white_top_detail1.jpg';
import whiteTopDetail2 from '@/assets/white_top_detail2.jpg';
import whiteTopDetail3 from '@/assets/white_top_detail3.jpg';
import blackLeggings1 from '@/assets/black_leggings_1.jpg';
import blackLeggings2 from '@/assets/black_leggings_2.jpg';
import blackLeggings3 from '@/assets/black_leggings_3.jpg';
import blackLeggings4 from '@/assets/black_leggings_4.jpg';
import blackLeggings5 from '@/assets/black_leggings_5.jpg';
import blueLeggings1 from '@/assets/blue_leggings_1.jpg';
import blueLeggings2 from '@/assets/blue_leggings_2.jpg';
import blueLeggings3 from '@/assets/blue_leggings_3.jpg';
import blueLeggings4 from '@/assets/blue_leggings_4.jpg';
import blueLeggings5 from '@/assets/blue_leggings_5.jpg';
import brownLeggingsFront from '@/assets/brown_leggings_front.jpg';
import brownLeggingsBack from '@/assets/brown_leggings_back.jpg';
import brownLeggingsDetail1 from '@/assets/brown_leggings_detail1.jpg';
import brownLeggingsDetail2 from '@/assets/brown_leggings_detail2.jpg';
import brownLeggingsDetail3 from '@/assets/brown_leggings_detail3.jpg';
import brownLeggingsDetail4 from '@/assets/brown_leggings_detail4.jpg';
import brownLeggingsDetail5 from '@/assets/brown_leggings_detail5.jpg';
import ivoryLeggings1 from '@/assets/ivory_leggings_1.jpg';
import ivoryLeggings2 from '@/assets/ivory_leggings_2.jpg';
import ivoryLeggings3 from '@/assets/ivory_leggings_3.jpg';
import ivoryLeggings4 from '@/assets/ivory_leggings_4.jpg';
import ivoryLeggings5 from '@/assets/ivory_leggings_5.jpg';
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
      'Шоколад': [brownJacket1, brownJacket2, brownJacket3, brownJacket4, brownJacket5],
      'Айвори': [ivoryJacket1, ivoryJacket2, ivoryJacket3, ivoryJacket4, ivoryJacket5],
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
    images: [ivoryLeggings1],
    modelUrl: '/models/ivory_leggings.glb',
    spinImages: [ivoryLeggings1, ivoryLeggings2, ivoryLeggings3, ivoryLeggings4, ivoryLeggings5],
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
