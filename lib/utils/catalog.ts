/**
 * Catalog display utilities — moved from lib/data.ts
 * Non-data helpers for formatting and category labels.
 * These are UI constants and don't belong in the database.
 */

export function formatPrice(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
}

export const styleCategories = [
  { id: 'PESHAWARI', label: 'Peshawari / Khussa', emoji: '🥿' },
  { id: 'OXFORD', label: 'Oxford / Formal', emoji: '👞' },
  { id: 'LOAFERS', label: 'Loafers', emoji: '🥾' },
  { id: 'MOCCASINS', label: 'Moccasins', emoji: '🪖' },
  { id: 'SANDALS', label: 'Sandals / Chappals', emoji: '🩴' },
  { id: 'SNEAKERS', label: 'Sneakers / Sports', emoji: '👟' },
  { id: 'SCHOOL', label: 'School', emoji: '🎒' },
] as const;

export const genderCategories = [
  { id: 'MEN', label: "Men's Collection", imageUrl: '/images/category-men.jpg' },
  { id: 'WOMEN', label: "Women's Collection", imageUrl: '/images/category-women.jpg' },
  { id: 'KIDS', label: "Kids' Collection", imageUrl: '/images/category-kids.jpg' },
] as const;

/** All known brands from the stocktaking catalogue (April 2026) */
export const knownBrands = [
  'SIL',
  'SSC',
  'Bata',
  'Xarasoft',
  'Starlet',
  'Borjan',
  'X-Way',
  'Vince Born',
  'Delux',
  'Hush Puppies',
  'Urban Sole',
  'WEJ',
  'Imported',
  'Others',
  'Executive',
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
    eu: ['29', '30', '31', '32', '33', '34'],
  },
  children: {
    label: 'Children',
    ageGroup: '3–6 yrs',
    uk: ['6', '7', '8', '9', '10'],
    eu: ['26', '27', '28', '29', '30'],
  },
};

