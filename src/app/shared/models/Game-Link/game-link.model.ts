export interface GameLink {
  id: number;
  name: string;
  description: string;
  link: string;
  image: string;
  subCategory: string;
  category: Category;
  clickCount: number;
  clicked?: boolean;
}

export type Category = 'geo' | 'word' | 'movies' | 'other' | 'video-games' | 'music' | 'all';

export const CATEGORIES: Category[] = [
  'geo',
  'word',
  'movies',
  'other',
  'video-games',
  'music',
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





