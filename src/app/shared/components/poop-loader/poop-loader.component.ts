import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { TurdComponent } from './turd.component';

type Phase = 'idle' | 'digest' | 'release';

/** Ms a load must last before the animation shows (avoids flashing on fast responses). */
const SHOW_DELAY = 150;
/** Length of the "release" animation; keep in sync with the CSS below. */
const RELEASE_MS = 1400;

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
  imports: [NgIf, TurdComponent],
  template: `
    <div *ngIf="phase !== 'idle'" class="loader" [class.overlay]="isOverlay" [class.release]="phase === 'release'"
         role="status" [attr.aria-label]="phase === 'digest' ? 'Loading' : 'Done'">
      <div class="stage">
        <img class="gut" src="assets/images/app-icon.png" alt="">
        <div class="chute"><app-turd class="poop"></app-turd></div>
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

    /*
     * The chute is a zero-size point at the rectum (52.5% across, 93% down the icon).
     * Everything above that line is clipped, so the turd appears to come out of the tube.
     */
    .chute {
      position: absolute; left: 37.6px; top: 59.5px; width: 0; height: 0;
      clip-path: polygon(-100px 0, 100px 0, 100px 100px, -100px 100px);
    }
    .poop {
      position: absolute; left: -17px; top: -7.5px; width: 34px; height: 15px;
      transform: translateY(-19px) rotate(-90deg);
    }

    /* release: two pushes slide the turd out vertically, then it tips over as it falls */
    .release .gut   { animation: push 1400ms ease-in-out forwards; }
    .release .poop  { animation: ooze 1400ms linear forwards; }
    .release .caption { color: var(--ink, #1e1e1e); }

    @keyframes push {
      0%        { transform: scale(1, 1); }
      18%       { transform: scale(1.12, .85); }
      30%       { transform: scale(.96, 1.05); }
      38%       { transform: scale(1, 1); }
      46%       { transform: scale(1.14, .84); }
      58%       { transform: scale(.95, 1.05); }
      66%, 100% { transform: scale(1, 1); }
    }
    @keyframes ooze {
      0%, 12% { transform: translateY(-19px) rotate(-90deg); animation-timing-function: ease-out; }
      32%     { transform: translateY(-3px) rotate(-90deg); }
      40%     { transform: translateY(-5px) rotate(-90deg); animation-timing-function: ease-out; }
      58%     { transform: translateY(18px) rotate(-90deg); animation-timing-function: ease-in; }
      64%     { transform: translateY(21px) rotate(-82deg); animation-timing-function: ease-in; }
      80%     { transform: translateY(40px) rotate(0deg) scale(1.12, .72); animation-timing-function: ease-out; }
      88%     { transform: translateY(37px) rotate(0deg) scale(.94, 1.06); }
      100%    { transform: translateY(40px) rotate(0deg) scale(1, 1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .gut, .release .gut, .release .poop { animation: none; }
      .release .poop { transform: translateY(40px); }
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
