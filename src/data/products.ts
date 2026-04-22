import catLongsleeves from '@/assets/longsleeve_ivory_1.webp';
import blackJacket1 from '@/assets/black_jacket_1.webp';
import blackJacket2 from '@/assets/black_jacket_2.webp';
import blackJacket3 from '@/assets/black_jacket_3.webp';
import brownJacket1 from '@/assets/brown_jacket_1.webp';
import brownJacket2 from '@/assets/brown_jacket_2.webp';
import brownJacket3 from '@/assets/brown_jacket_3.webp';
import ivoryJacket1 from '@/assets/ivory_jacket_1.webp';
import ivoryJacket2 from '@/assets/ivory_jacket_2.webp';
import ivoryJacket3 from '@/assets/ivory_jacket_3.webp';
import braFront from '@/assets/black_bra_1.webp';
import braBack from '@/assets/black_bra_2.webp';
import blueBraFront from '@/assets/blue_bra_1.webp';
import blueBraBack from '@/assets/blue_bra_2.webp';
import brownBraFront from '@/assets/brown_bra_1.webp';
import brownBraBack from '@/assets/brown_bra_2.webp';
import brownBraThird from '@/assets/brown_bra_3.webp';
import blackTopFront from '@/assets/black_top_1.webp';
import blackTopBack from '@/assets/black_top_2.webp';
import blackTopThird from '@/assets/black_top_3.webp';
import whiteTopFront from '@/assets/white_top_1.webp';
import whiteTopBack from '@/assets/white_top_2.webp';
import whiteTopThird from '@/assets/white_top_3.webp';
import blackLeggings1 from '@/assets/black_leggings_1.webp';
import blackLeggings2 from '@/assets/black_leggings_2.webp';
import blackLeggings3 from '@/assets/black_leggings_3.webp';
import blueLeggings1 from '@/assets/blue_leggings_1.webp';
import blueLeggings2 from '@/assets/blue_leggings_2.webp';
import blueLeggings3 from '@/assets/blue_leggings_3.webp';
import brownLeggings1 from '@/assets/brown_leggings_1.webp';
import brownLeggings2 from '@/assets/brown_leggings_2.webp';
import brownLeggings3 from '@/assets/brown_leggings_3.webp';
import ivoryLeggings1 from '@/assets/ivory_leggings_1.webp';
import ivoryLeggings2 from '@/assets/ivory_leggings_2.webp';
import ivoryLeggings3 from '@/assets/ivory_leggings_3.webp';
import ivoryLeggings4 from '@/assets/ivory_leggings_4.webp';
import bagBlueFront from '@/assets/bag_blue_1.webp';
import bagBlueBack from '@/assets/bag_blue_2.webp';
import bagBlueThird from '@/assets/bag_blue_3.webp';
import bagBlackFront from '@/assets/bag_black_1.webp';
import bagBlackBack from '@/assets/bag_black_2.webp';
import longsleeveJoy1 from '@/assets/longsleeve_ivory_1.webp';
import longsleeveJoy2 from '@/assets/longsleeve_ivory_2.webp';
import longsleeveJoy3 from '@/assets/longsleeve_ivory_3.webp';
import longsleeveEnergy1 from '@/assets/longsleeve_energy_1.webp';
import longsleeveEnergy2 from '@/assets/longsleeve_energy_2.webp';
import longsleeveEnergy3 from '@/assets/longsleeve_energy_3.webp';

export type ProductCategory = 'leggings' | 'tops' | 'tanks' | 'rashguards' | 'bags' | 'longsleeves';
export type ProductSize = 'XS-S' | 'M-L';
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
  colors: ProductColor[];
  sizes: ProductSize[];
  description: string;
  specs: Record<string, string>;
  isNew?: boolean;
  isBestseller?: boolean;
  tags?: string[];
  /** Identifies a group of color variants for the same base product */
  colorGroup?: string;
}

export const categories = [
  { slug: 'leggings' as const, name: 'Леггинсы', image: brownLeggings2 },
  { slug: 'tops' as const, name: 'Топы', image: braFront },
  { slug: 'tanks' as const, name: 'Майки', image: blackTopFront },
  { slug: 'rashguards' as const, name: 'Рашгарды', image: brownJacket1 },
  { slug: 'bags' as const, name: 'Сумки', image: bagBlueFront },
  { slug: 'longsleeves' as const, name: 'Лонгсливы', image: catLongsleeves },
];

// Shared specs/descriptions
const rashguardSpecs = {
  'Силуэт': 'Приталенный',
  'Застёжка': 'Молния',
  'Карманы': 'На молнии',
  'Материал': 'Плотный эластичный',
  'Уход': 'Машинная стирка при 30°C',
};
const rashguardDesc = 'Приталенный силуэт с моделирующим эффектом. Карманы на молнии. Плотный эластичный материал.';

const leggingsSpecs = {
  'Силуэт': 'Облегающий',
  'Посадка': 'На талии',
  'Компрессия': 'С утягивающей вставкой',
  'Карман': 'Потайной на поясе',
  'Ткань': 'Дышащая, непросвечивающая',
  'Уход': 'Машинная стирка при 30°C',
};
const leggingsDesc = 'Облегающий силуэт с посадкой на талии. Компрессионный эффект с утягивающей вставкой в области живота. Потайной карман на поясе сзади. Плоские фигурные швы. Дышащий материал высокой эластичности. Непросвечивающая ткань.';

const braSpecs = {
  'Фасон': 'Укороченный',
  'Вырез': 'Квадратный',
  'Бретели': 'Тонкие',
  'Чашки': 'Съёмные',
  'Материал': 'Эластичный, непросвечивающий',
  'Уход': 'Ручная стирка',
};
const braDesc = 'Укороченный фасон с квадратным вырезом. Тонкие бретели, надёжная фиксация груди, съёмные чашки. Эластичный непросвечивающий материал. Силиконовый логотип на спинке.';

const tankSpecs = {
  'Фасон': 'Удлинённый',
  'Вырез': 'V-образный',
  'Лямки': 'Тонкие, регулируемые',
  'Чашки': 'Съёмные',
  'Материал': 'Быстросохнущий',
  'Уход': 'Машинная стирка при 30°C',
};
const tankDesc = 'Удлинённый фасон с приталенным силуэтом. V-образный вырез, тонкие лямки с регулировкой. Быстросохнущий материал. Поддержка груди, съёмные чашки.';

const bagSpecs = {
  'Материал': 'Плотный текстиль',
  'Формат': 'Средний',
  'Ремень': 'Съёмный, регулируемый',
  'Уход': 'Сухая чистка',
};
const bagDesc = 'Мягкая текстильная сумка с верхними ручками и съёмным плечевым ремнём. Подходит для города и тренировок.';

const longsleeveSpecs = {
  'Крой': 'Свободный',
  'Вырез': 'Круглый',
  'Рукава': 'Длинные, с манжетами',
  'Материал': 'Хлопковый трикотаж',
  'Особенности': 'Надпись на предплечье',
  'Уход': 'Машинная стирка при 30°C',
};
const longsleeveDesc = 'Лонгслив свободного кроя из мягкого хлопкового трикотажа. Надпись-аффирмация на предплечье. Круглый вырез, длинные рукава с манжетами. Подходит для тренировок и повседневной носки.';

const allSizes: ProductSize[] = ['XS-S', 'M-L'];

export const products: Product[] = [
  // --- РАШГАРДЫ ---
  {
    id: '9-black',
    name: 'Рашгард на молнии',
    category: 'rashguards',
    price: 7600,
    images: [blackJacket1, blackJacket2, blackJacket3],
    spinImages: [blackJacket1, blackJacket2, blackJacket3],
    modelUrl: '/models/black_rashguard.glb',
    colors: [{ name: 'Чёрный', hex: '#1a1a1a' }],
    sizes: allSizes,
    description: rashguardDesc,
    specs: rashguardSpecs,
    isNew: true,
    isBestseller: true,
    colorGroup: 'rashguard-zip',
  },
  {
    id: '9-brown',
    name: 'Рашгард на молнии',
    category: 'rashguards',
    price: 7600,
    images: [brownJacket3, brownJacket2, brownJacket1],
    spinImages: [brownJacket3, brownJacket2, brownJacket1],
    modelUrl: '/models/brown_rashguard.glb',
    colors: [{ name: 'Шоколад', hex: '#3e2723' }],
    sizes: allSizes,
    description: rashguardDesc,
    specs: rashguardSpecs,
    isNew: true,
    colorGroup: 'rashguard-zip',
  },
  {
    id: '9-ivory',
    name: 'Рашгард на молнии',
    category: 'rashguards',
    price: 7600,
    images: [ivoryJacket1, ivoryJacket2, ivoryJacket3],
    spinImages: [ivoryJacket1, ivoryJacket2, ivoryJacket3],
    modelUrl: '/models/ivory_rashguard.glb',
    colors: [{ name: 'Айвори', hex: '#f0e6d3' }],
    sizes: allSizes,
    description: rashguardDesc,
    specs: rashguardSpecs,
    isNew: true,
    colorGroup: 'rashguard-zip',
  },

  // --- ЛЕГГИНСЫ ---
  {
    id: '13-black',
    name: 'Леггинсы компрессионные',
    category: 'leggings',
    price: 6500,
    images: [blackLeggings1, blackLeggings2, blackLeggings3],
    spinImages: [blackLeggings1, blackLeggings2, blackLeggings3],
    modelUrl: '/models/black_leggings.glb',
    colors: [{ name: 'Чёрный', hex: '#1a1a1a' }],
    sizes: allSizes,
    description: leggingsDesc,
    specs: leggingsSpecs,
    isNew: true,
    colorGroup: 'leggings-compression',
  },
  {
    id: '13-blue',
    name: 'Леггинсы компрессионные',
    category: 'leggings',
    price: 6500,
    images: [blueLeggings1, blueLeggings2, blueLeggings3],
    spinImages: [blueLeggings1, blueLeggings2, blueLeggings3],
    modelUrl: '/models/blue_leggings.glb',
    colors: [{ name: 'Голубой', hex: '#c7dcf7' }],
    sizes: allSizes,
    description: leggingsDesc,
    specs: leggingsSpecs,
    isNew: true,
    colorGroup: 'leggings-compression',
  },
  {
    id: '14',
    name: 'Леггинсы компрессионные',
    category: 'leggings',
    price: 6500,
    images: [brownLeggings3, brownLeggings2, brownLeggings1],
    spinImages: [brownLeggings3, brownLeggings2, brownLeggings1],
    modelUrl: '/models/brown_leggings.glb',
    colors: [{ name: 'Шоколад', hex: '#5a3b32' }],
    sizes: allSizes,
    description: leggingsDesc,
    specs: leggingsSpecs,
    isNew: true,
    colorGroup: 'leggings-compression',
  },
  {
    id: '15',
    name: 'Леггинсы компрессионные',
    category: 'leggings',
    price: 6500,
    images: [ivoryLeggings1, ivoryLeggings2, ivoryLeggings3, ivoryLeggings4],
    spinImages: [ivoryLeggings1, ivoryLeggings2, ivoryLeggings3, ivoryLeggings4],
    modelUrl: '/models/ivory_leggings.glb',
    colors: [{ name: 'Айвори', hex: '#f0ede4' }],
    sizes: allSizes,
    description: leggingsDesc,
    specs: leggingsSpecs,
    isNew: true,
    colorGroup: 'leggings-compression',
  },

  // --- ТОПЫ ---
  {
    id: '10-black',
    name: 'Топ спортивный',
    category: 'tops',
    price: 5500,
    images: [braFront, braBack],
    spinImages: [braFront, braBack],
    modelUrl: '/models/black_bra.glb',
    colors: [{ name: 'Чёрный', hex: '#1a1a1a' }],
    sizes: allSizes,
    description: braDesc,
    specs: braSpecs,
    isNew: true,
    colorGroup: 'top-basic',
  },
  {
    id: '10-blue',
    name: 'Топ спортивный',
    category: 'tops',
    price: 5500,
    images: [blueBraFront, blueBraBack],
    spinImages: [blueBraFront, blueBraBack],
    modelUrl: '/models/blue_bra.glb',
    colors: [{ name: 'Голубой', hex: '#8bb8e8' }],
    sizes: allSizes,
    description: braDesc,
    specs: braSpecs,
    isNew: true,
    colorGroup: 'top-basic',
  },
  {
    id: '11',
    name: 'Топ спортивный с перекрёстными бретелями',
    category: 'tops',
    price: 5500,
    images: [brownBraFront, brownBraBack, brownBraThird],
    spinImages: [brownBraFront, brownBraBack, brownBraThird],
    modelUrl: '/models/brown_bra.glb',
    colors: [{ name: 'Шоколад', hex: '#3e2723' }],
    sizes: allSizes,
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

  // --- МАЙКИ ---
  {
    id: '12-black',
    name: 'Майка моделирующая на тонких бретелях',
    category: 'tanks',
    price: 5500,
    images: [blackTopFront, blackTopBack, blackTopThird],
    spinImages: [blackTopFront, blackTopBack, blackTopThird],
    modelUrl: '/models/black_top.glb',
    colors: [{ name: 'Чёрный', hex: '#1a1a1a' }],
    sizes: allSizes,
    description: tankDesc,
    specs: tankSpecs,
    isNew: true,
    colorGroup: 'tank-basic',
  },
  {
    id: '12-ivory',
    name: 'Майка моделирующая на тонких бретелях',
    category: 'tanks',
    price: 5500,
    images: [whiteTopFront, whiteTopBack, whiteTopThird],
    spinImages: [whiteTopFront, whiteTopBack, whiteTopThird],
    modelUrl: '/models/ivory_top.glb',
    colors: [{ name: 'Айвори', hex: '#f0e6d3' }],
    sizes: allSizes,
    description: tankDesc,
    specs: tankSpecs,
    isNew: true,
    colorGroup: 'tank-basic',
  },

  // --- СУМКИ ---
  {
    id: '16-blue',
    name: 'Сумка спортивная',
    category: 'bags',
    price: 6900,
    images: [bagBlueFront, bagBlueBack, bagBlueThird],
    spinImages: [bagBlueFront, bagBlueBack, bagBlueThird],
    modelUrl: '/models/blue_bag.glb',
    colors: [{ name: 'Голубой', hex: '#c7dcf7' }],
    sizes: ['XS-S', 'M-L'],
    description: bagDesc,
    specs: bagSpecs,
    isNew: true,
    colorGroup: 'bag-basic',
  },
  {
    id: '16-black',
    name: 'Сумка спортивная',
    category: 'bags',
    price: 6900,
    images: [bagBlackBack, bagBlackFront],
    spinImages: [bagBlackBack, bagBlackFront],
    modelUrl: '/models/black_bag.glb',
    colors: [{ name: 'Чёрный', hex: '#1a1a1a' }],
    sizes: ['XS-S', 'M-L'],
    description: bagDesc,
    specs: bagSpecs,
    isNew: true,
    colorGroup: 'bag-basic',
  },

  // --- ЛОНГСЛИВЫ ---
  {
    id: '17',
    name: 'Лонгслив «Радость жизни»',
    category: 'longsleeves',
    price: 7600,
    images: [longsleeveJoy1, longsleeveJoy2, longsleeveJoy3],
    spinImages: [longsleeveJoy1, longsleeveJoy2, longsleeveJoy3],
    modelUrl: '/models/longsleeve.glb',
    colors: [{ name: 'Айвори', hex: '#f0e6d3' }],
    sizes: allSizes,
    description: longsleeveDesc,
    specs: longsleeveSpecs,
    isNew: true,
  },
  {
    id: '18',
    name: 'Лонгслив «Ты — энергия!»',
    category: 'longsleeves',
    price: 7600,
    images: [longsleeveEnergy1, longsleeveEnergy2, longsleeveEnergy3],
    spinImages: [longsleeveEnergy1, longsleeveEnergy2, longsleeveEnergy3],
    modelUrl: '/models/longsleeve.glb',
    colors: [{ name: 'Айвори', hex: '#f0e6d3' }],
    sizes: allSizes,
    description: longsleeveDesc,
    specs: longsleeveSpecs,
    isNew: true,
  },
];
