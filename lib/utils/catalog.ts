/**
 * Catalog display utilities — moved from lib/data.ts
 * Non-data helpers for formatting and category labels.
 * These are UI constants and don't belong in the database.
 */

export function formatPrice(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
}

export interface StyleCategoryItem {
  id: string;
  label: string;
  emoji: string;
  dbStyle: string;
}

export const stylesByCategory: Record<'MEN' | 'WOMEN' | 'KIDS', StyleCategoryItem[]> = {
  MEN: [
    { id: 'SPORTS',           label: 'Sports',             emoji: '⚽', dbStyle: 'SPORTS' },
    { id: 'SNEAKERS',         label: 'Sneaker',            emoji: '👟', dbStyle: 'SNEAKERS' },
    { id: 'SKECHERS',         label: 'Skechers',           emoji: '🏃', dbStyle: 'SKECHERS' },
    { id: 'FORMAL_MOCCASINS', label: 'Formal/ moccasins',  emoji: '👞', dbStyle: 'FORMAL_MOCCASINS' },
    { id: 'LOAFERS_MOZA',     label: 'Loafers/ moza',      emoji: '🥾', dbStyle: 'LOAFERS_MOZA' },
    { id: 'CHAPPAL',          label: 'Chappal',            emoji: '🩴', dbStyle: 'CHAPPAL' },
    { id: 'SANDALS',          label: 'Sandal',             emoji: '👡', dbStyle: 'SANDALS' },
    { id: 'PESHAWARI_KHUSSA', label: 'Peshawari/ khussa',  emoji: '🥿', dbStyle: 'PESHAWARI_KHUSSA' },
  ],
  WOMEN: [
    { id: 'SPORTS',           label: 'Sports',             emoji: '⚽', dbStyle: 'SPORTS' },
    { id: 'SNEAKERS',         label: 'Sneaker',            emoji: '👟', dbStyle: 'SNEAKERS' },
    { id: 'SKECHERS',         label: 'Skechers',           emoji: '🏃', dbStyle: 'SKECHERS' },
    { id: 'COURT_SHOES',      label: 'Court shoes',        emoji: '👠', dbStyle: 'COURT_SHOES' },
    { id: 'CASUAL_SHOES',     label: 'Casual shoes',       emoji: '🥿', dbStyle: 'CASUAL_SHOES' },
    { id: 'BUMPS',            label: 'Bumps',              emoji: '🩰', dbStyle: 'BUMPS' },
    { id: 'CHAPPAL',          label: 'Chappal',            emoji: '🩴', dbStyle: 'CHAPPAL' },
    { id: 'SANDALS',          label: 'Sandal',             emoji: '👡', dbStyle: 'SANDALS' },
  ],
  KIDS: [
    { id: 'SPORTS',           label: 'Sports',             emoji: '⚽', dbStyle: 'SPORTS' },
    { id: 'SCHOOL',           label: 'Schools',            emoji: '🎒', dbStyle: 'SCHOOL' },
    { id: 'SNEAKERS',         label: 'Sneaker',            emoji: '👟', dbStyle: 'SNEAKERS' },
    { id: 'SKECHERS',         label: 'Skechers',           emoji: '🏃', dbStyle: 'SKECHERS' },
    { id: 'FORMAL_MOCCASINS', label: 'Formal/ moccasins',  emoji: '👞', dbStyle: 'FORMAL_MOCCASINS' },
    { id: 'LOAFERS_MOZA',     label: 'Loafers/ moza',      emoji: '🥾', dbStyle: 'LOAFERS_MOZA' },
    { id: 'CHAPPAL',          label: 'Chappal',            emoji: '🩴', dbStyle: 'CHAPPAL' },
    { id: 'SANDALS',          label: 'Sandal',             emoji: '👡', dbStyle: 'SANDALS' },
    { id: 'PESHAWARI_KHUSSA', label: 'Peshawari/ khussa',  emoji: '🥿', dbStyle: 'PESHAWARI_KHUSSA' },
  ],
};

/** Combined unique list of all styles across categories */
export const styleCategories: StyleCategoryItem[] = [
  { id: 'SPORTS',           label: 'Sports',             emoji: '⚽', dbStyle: 'SPORTS' },
  { id: 'SNEAKERS',         label: 'Sneaker',            emoji: '👟', dbStyle: 'SNEAKERS' },
  { id: 'SKECHERS',         label: 'Skechers',           emoji: '🏃', dbStyle: 'SKECHERS' },
  { id: 'FORMAL_MOCCASINS', label: 'Formal/ moccasins',  emoji: '👞', dbStyle: 'FORMAL_MOCCASINS' },
  { id: 'LOAFERS_MOZA',     label: 'Loafers/ moza',      emoji: '🥾', dbStyle: 'LOAFERS_MOZA' },
  { id: 'COURT_SHOES',      label: 'Court shoes',        emoji: '👠', dbStyle: 'COURT_SHOES' },
  { id: 'CASUAL_SHOES',     label: 'Casual shoes',       emoji: '🥿', dbStyle: 'CASUAL_SHOES' },
  { id: 'BUMPS',            label: 'Bumps',              emoji: '🩰', dbStyle: 'BUMPS' },
  { id: 'CHAPPAL',          label: 'Chappal',            emoji: '🩴', dbStyle: 'CHAPPAL' },
  { id: 'SANDALS',          label: 'Sandal',             emoji: '👡', dbStyle: 'SANDALS' },
  { id: 'PESHAWARI_KHUSSA', label: 'Peshawari/ khussa',  emoji: '🥿', dbStyle: 'PESHAWARI_KHUSSA' },
  { id: 'SCHOOL',           label: 'Schools',            emoji: '🎒', dbStyle: 'SCHOOL' },
];

export function getStylesForCategory(category?: string | null): StyleCategoryItem[] {
  if (!category) return styleCategories;
  const upper = category.toUpperCase();
  if (upper === 'MEN' || upper === 'WOMEN' || upper === 'KIDS') {
    return stylesByCategory[upper];
  }
  return styleCategories;
}

export const styleLabelMap: Record<string, string> = {
  SPORTS: 'Sports',
  SNEAKERS: 'Sneaker',
  SKECHERS: 'Skechers',
  FORMAL_MOCCASINS: 'Formal/ moccasins',
  LOAFERS_MOZA: 'Loafers/ moza',
  CHAPPAL: 'Chappal',
  SANDALS: 'Sandal',
  PESHAWARI_KHUSSA: 'Peshawari/ khussa',
  COURT_SHOES: 'Court shoes',
  CASUAL_SHOES: 'Casual shoes',
  BUMPS: 'Bumps',
  SCHOOL: 'Schools',
  LOAFERS: 'Loafers/ moza',
  OXFORD: 'Formal/ moccasins',
  MOCCASINS: 'Formal/ moccasins',
  PESHAWARI: 'Peshawari/ khussa',
};

export function getStyleLabel(style: string): string {
  return styleLabelMap[style] || style;
}

/** Maps a styleCategories id back to the real DB Style enum value */
export function getDbStyle(styleCatId: string): string {
  const found = styleCategories.find((s) => s.id === styleCatId);
  return found?.dbStyle ?? styleCatId;
}

export const genderCategories = [
  { id: 'MEN',         label: "Men's Collection",          imageUrl: '/images/categories/formal.jpg' },
  { id: 'WOMEN',       label: "Women's Collection",        imageUrl: '/images/categories/khussas.jpg' },
  { id: 'KIDS',        label: "Kids' Collection",          imageUrl: '/images/categories/casual.jpg' },
  { id: 'ACCESSORIES', label: "Accessories & Shoe Care",   imageUrl: '/images/categories/accessories.jpg' },
] as const;

/** All known brands — clean list, no article numbers, no catch-alls */
export const knownBrands = [
  'Cele Gold',
  'Executive',
  'Urban Sole',
  'Hush Puppies',
  'Starlet',
  'Servis',
  'Cheetah',
  'Calza',
  'Bata',
  'Power',
  'B.First',
  'X.Way',
  'Deluxe',
  'Imported',
  'Super Shoes',
] as const;

export type KnownBrand = typeof knownBrands[number];

export const pakistanProvinces = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
  'Azad Kashmir', 'Gilgit-Baltistan', 'Islamabad Capital Territory',
] as const;

export const occasionLabels: Record<string, string> = {
  ETHNIC: 'Ethnic Wear', WEDDING: 'Wedding', SPORTS: 'Sports',
  FORMAL: 'Formal', CASUAL: 'Casual',
};

// ── Accurate Size Chart Specifications ──────────────────────────────────────

/** Men Collection: UK 6 to 14 | EU 39 to 47 */
export const menSizesUK = ['6', '7', '8', '9', '10', '11', '12', '13', '14'];
export const menSizesEU = ['39', '40', '41', '42', '43', '44', '45', '46', '47'];

/** Female / Women Collection: UK 3 to 9 | EU 36 to 42 */
export const womenSizesUK = ['3', '4', '5', '6', '7', '8', '9'];
export const womenSizesEU = ['36', '37', '38', '39', '40', '41', '42'];

/** Kids Collection Sub-Groups */
export const kidsSubGroups = {
  youth: {
    label: 'Youth',
    ageGroup: '11–15 yrs',
    uk: ['2', '3', '4', '5', '6'],
    eu: ['35', '36', '37', '38', '39'],
  },
  girls: {
    label: 'Girls',
    ageGroup: '7–11 yrs',
    uk: ['9', '10', '11', '12', '13', '1', '2'],
    eu: ['28', '29', '30', '31', '32', '33', '34'],
  },
  boys: {
    label: 'Boys',
    ageGroup: '7–11 yrs',
    uk: ['9', '10', '11', '12', '13', '1'],
    eu: ['27', '28', '29', '30', '31', '32', '33'],
  },
  children: {
    label: 'Children',
    ageGroup: '2–6 yrs',
    uk: ['1', '2', '3', '4', '5', '6'],
    eu: ['21', '22', '23', '24', '25', '26'],
  },
};

