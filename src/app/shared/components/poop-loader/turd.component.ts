import { Component } from '@angular/core';

/** Hand-drawn turd in the app icon's style: flat fill, lighter inner stripe, black outline. */
@Component({
  selector: 'app-turd',
  standalone: true,
  template: `
    <svg viewBox="0 0 60 26" aria-hidden="true">
      <path d="M5 15 C3 9 10 6.5 17 8 C23 5 31 5.5 36 8.5 C42 6.5 49 8 52 11 C54 9 56.5 7 57 4.5 C58.5 9 56 14.5 51 17 C47 20.5 41 21 36 19.8 C30 22.5 22 22.5 17 20.3 C10 21.5 6 19 5 15 Z"
            fill="#8a5a3c" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
      <path d="M9 14.5 C9 12 11.5 10.5 15 10.8 M20 10 C24 8.3 29 8.5 33 10.2 M39 10.2 C43 9.6 46.5 10.5 48.5 12"
            fill="none" stroke="#b98058" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M17.5 8.2 C16 12 16 16.4 17 20.2 M36.2 8.6 C35 12.4 35 16 36 19.7"
            fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`,
  styles: [`
    :host { display: block; }
    svg { display: block; width: 100%; height: 100%; }
  `]
})
export class TurdComponent {
}
