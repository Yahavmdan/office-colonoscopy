export interface GameLink {
  id: number;
  name: string;
  description: string;
  link: string;
  "sub-category": string;
  category: Category;
  clickCount: number;
}

export type Category = 'geo' | 'word' | 'movies' | 'other' | 'video-game';
