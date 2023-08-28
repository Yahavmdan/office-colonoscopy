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

export type Category = 'geo' | 'word' | 'movies' | 'other' | 'video-game';
