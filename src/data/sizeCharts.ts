import type { Product, ProductCategory } from './products';

export interface SizeRow {
  size: string;
  values: string[];
  note?: string;
}

export interface SizeChart {
  columns: string[];
  rows: SizeRow[];
  footnote?: string;
}

const rashguardChart: SizeChart = {
  columns: ['Размер', 'Длина переда, см', 'Длина по спине, см', 'Обхват груди, см', 'Длина рукава, см', 'Рост, см'],
  rows: [
    { size: 'XS-S', values: ['55', '57', '82–90', '60', '160–175'] },
    { size: 'M-L', values: ['57', '59', '94–100', '61,5', '175–182'] },
  ],
  footnote: 'Для более точного подбора вы можете обратиться к менеджеру в чат.',
};

const leggingsChart: SizeChart = {
  columns: ['Размер', 'Обхват талии, см', 'Обхват бёдер, см', 'Длина изделия, см', 'Рост, см'],
  rows: [
    { size: 'XS-S', values: ['56–64', '75–92', '84', '160–175'] },
    { size: 'M-L', values: ['65–70', '93–110', '85,5', '175–182'] },
  ],
};

const tankChart: SizeChart = {
  columns: ['Размер', 'Обхват груди, см', 'Длина изделия, см', 'Рекомендуемый размер белья'],
  rows: [
    { size: 'XS-S', values: ['73–84', '40', '70 A–B, 75 A–B'] },
    { size: 'M-L', values: ['84–96', '41,5', '75 B–C, 80 B–C'] },
  ],
  footnote: 'Для более точного подбора вы можете обратиться к менеджеру в чат.',
};

const topChartShort: SizeChart = {
  // Чёрный и шоколадный — укороченный
  columns: ['Размер', 'Обхват груди, см', 'Обхват под грудью, см', 'Длина изделия, см', 'Рекомендуемый размер белья'],
  rows: [
    { size: 'XS-S', values: ['73–84', '58–65', '19,5', '70 A–B, 75 A–B'] },
    { size: 'M-L', values: ['84–96', '65–72', '20,5', '75 B–C, 80 B–C'] },
  ],
  footnote: 'Для более точного подбора вы можете обратиться к менеджеру в чат.',
};

const topChartSky: SizeChart = {
  columns: ['Размер', 'Обхват груди, см', 'Обхват под грудью, см', 'Длина изделия, см', 'Рекомендуемый размер белья'],
  rows: [
    { size: 'XS-S', values: ['73–84', '58–65', '25,5', '70 A–B, 75 A–B'] },
    { size: 'M-L', values: ['84–96', '65–72', '26,5', '75 B–C, 80 B–C'] },
  ],
  footnote: 'Для более точного подбора вы можете обратиться к менеджеру в чат.',
};

const longsleeveChart: SizeChart = {
  columns: ['Размер', 'Обхват груди, см', 'Рост, см'],
  rows: [
    { size: 'XS-S', values: ['82–90', '160–175'] },
    { size: 'M-L', values: ['94–100', '175–182'] },
  ],
};

const bagChart: SizeChart = {
  columns: ['Параметр', 'Значение'],
  rows: [
    { size: 'Ширина', values: ['45 см'] },
    { size: 'Высота', values: ['28 см'] },
    { size: 'Глубина', values: ['22 см'] },
    { size: 'Ремень', values: ['регулируемый, съёмный'] },
  ],
};

const byCategory: Record<ProductCategory, SizeChart> = {
  rashguards: rashguardChart,
  leggings: leggingsChart,
  tanks: tankChart,
  tops: topChartShort,
  longsleeves: longsleeveChart,
  bags: bagChart,
};

export function getSizeChart(product: Product): SizeChart {
  if (product.id === '10-blue') return topChartSky;
  return byCategory[product.category];
}
