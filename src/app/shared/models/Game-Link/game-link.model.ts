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

export type Category = 'geo' | 'word' | 'movies' | 'other' | 'video-games';
export const CATEGORIES: Category[] = [
  'geo',
  'word',
  'movies',
  'other',
  'video-games'
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





