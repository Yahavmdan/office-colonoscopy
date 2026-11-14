import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';

type Phase = 'idle' | 'digest' | 'release';

/** Ms a load must last before the animation shows (avoids flashing on fast responses). */
const SHOW_DELAY = 150;
/** Length of the "release" animation; keep in sync with the CSS below. */
const RELEASE_MS = 900;

/**
 * App-wide loader: the colon icon "digests" while loading, then squeezes out a poop when done.
 * Projected content is shown only once the release animation has finished.
 *
 *   <app-poop-loader [loading]="loading">...content...</app-poop-loader>
 *   <app-poop-loader [loading]="navigating" overlay></app-poop-loader>
 */
@Component({
  selector: 'app-poop-loader',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="phase !== 'idle'" class="loader" [class.overlay]="isOverlay" [class.release]="phase === 'release'"
         role="status" [attr.aria-label]="phase === 'digest' ? 'Loading' : 'Done'">
      <div class="stage">
        <img class="gut" src="assets/images/app-icon.png" alt="">
        <!-- turd drawn in the icon's style: flat fill, lighter inner stripe, thick black outline -->
        <svg class="poop" viewBox="0 0 60 26" aria-hidden="true">
          <path d="M5 15 C3 9 10 6.5 17 8 C23 5 31 5.5 36 8.5 C42 6.5 49 8 52 11 C54 9 56.5 7 57 4.5 C58.5 9 56 14.5 51 17 C47 20.5 41 21 36 19.8 C30 22.5 22 22.5 17 20.3 C10 21.5 6 19 5 15 Z"
                fill="#8a5a3c" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
          <path d="M9 14.5 C9 12 11.5 10.5 15 10.8 M20 10 C24 8.3 29 8.5 33 10.2 M39 10.2 C43 9.6 46.5 10.5 48.5 12"
                fill="none" stroke="#b98058" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M17.5 8.2 C16 12 16 16.4 17 20.2 M36.2 8.6 C35 12.4 35 16 36 19.7"
                fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="caption">{{ phase === 'digest' ? 'Digesting…' : 'Ahh.' }}</div>
    </div>
    <div [style.display]="phase === 'idle' ? null : 'none'">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .loader {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; padding: 56px 0; color: var(--muted, #868686);
      font: 500 14px var(--font, sans-serif);
    }
    .loader.overlay {
      position: fixed; inset: 0; z-index: 1000; padding: 0;
      background: var(--paper, #fffdf7);
    }

    .stage { position: relative; width: 72px; height: 120px; }

    .gut {
      position: absolute; top: 0; left: 4px; width: 64px; height: 64px;
      transform-origin: 50% 85%;
      animation: digest 900ms ease-in-out infinite;
    }

    /* peristalsis: alternating squeeze/stretch with a little wobble */
    @keyframes digest {
      0%, 100% { transform: scale(1, 1) rotate(0deg); }
      20%      { transform: scale(1.08, .9) rotate(-3deg); }
      45%      { transform: scale(.92, 1.08) rotate(2deg); }
      70%      { transform: scale(1.05, .94) rotate(-1deg); }
    }

    .poop {
      position: absolute; left: 50%; top: 44px; width: 56px; height: 24px;
      transform: translateX(-50%) scale(0); opacity: 0;
    }

    /* release: one big push, then the poop drops out and bounces */
    .release .gut   { animation: push 900ms ease-in-out forwards; }
    .release .poop  { animation: drop 900ms cubic-bezier(.3, .7, .4, 1) forwards; }
    .release .caption { color: var(--ink, #1e1e1e); }

    @keyframes push {
      0%   { transform: scale(1, 1); }
      25%  { transform: scale(1.18, .78); }
      45%  { transform: scale(.9, 1.12); }
      65%, 100% { transform: scale(1, 1); }
    }
    @keyframes drop {
      0%, 25% { transform: translate(-50%, 0) scale(0); opacity: 0; }
      45%     { transform: translate(-50%, 18px) scale(1.1); opacity: 1; }
      62%     { transform: translate(-50%, 46px) scale(1, .8); }
      75%     { transform: translate(-50%, 36px) scale(1); }
      85%     { transform: translate(-50%, 46px) scale(1.05, .9); }
      100%    { transform: translate(-50%, 46px) scale(1); opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .gut, .release .gut, .release .poop { animation: none; }
      .release .poop { transform: translate(-50%, 46px); opacity: 1; }
    }
  `]
})
export class PoopLoaderComponent implements OnChanges, OnDestroy {
  @Input() loading: boolean = false;
  @Input('overlay') set overlayAttr(value: boolean | '') {
    this.isOverlay = value === '' || !!value;
  }

  public isOverlay: boolean = false;
  public phase: Phase = 'idle';
  private showTimer?: ReturnType<typeof setTimeout>;
  private releaseTimer?: ReturnType<typeof setTimeout>;

  ngOnChanges(): void {
    if (this.loading) {
      clearTimeout(this.releaseTimer);
      if (this.phase === 'release') {
        this.phase = 'digest';
      } else if (this.phase === 'idle') {
        clearTimeout(this.showTimer);
        this.showTimer = setTimeout(() => this.phase = 'digest', SHOW_DELAY);
      }
      return;
    }
    clearTimeout(this.showTimer);
    if (this.phase === 'digest') {
      this.phase = 'release';
      this.releaseTimer = setTimeout(() => this.phase = 'idle', RELEASE_MS);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.showTimer);
    clearTimeout(this.releaseTimer);
  }
}
