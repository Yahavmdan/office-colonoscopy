export interface GameLink {
  id: number;
  name: string;
  link: string;
  category: 'geo' | 'word' | 'movies';
  clickCount: number;
}
