export interface GameLink {
  id: number;
  name: string;
  description: string;
  link: string;
  subCategory: string;
  category: Category;
  clickCount: number;
  clicked?: boolean;
}

export type Category = 'geo' | 'word' | 'movies' | 'other' | 'video-games' | 'all';

export const CATEGORIES: Category[] = [
  'geo',
  'word',
  'movies',
  'other',
  'video-games',
  'all'
];

export type SubCategory =
  'map'
  | 'geography'
  | 'picture'
  | 'language'
  | 'puzzle'
  | 'movies'
  | 'quiz'
  | 'video'
  | 'flag';

export const SUB_CATEGORIES: SubCategory[] = [
  'map',
  'geography',
  'picture',
  'language',
  'puzzle',
  'movies',
  'quiz',
  'video',
  'flag'
];





