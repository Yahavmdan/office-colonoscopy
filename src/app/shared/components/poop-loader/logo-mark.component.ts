import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { TurdComponent } from './turd.component';
import { TurdPileService } from '../../services/turd-pile/turd-pile.service';

type Phase = 'idle' | 'digest' | 'release';

const FIRST_DELAY_MS = 6000;
const MIN_GAP_MS = 25000;
const MAX_GAP_MS = 50000;
const DIGEST_MS = 1800;   // two digest cycles
const RELEASE_MS = 1400;  // length of the push animation; keep in sync with CSS below
const HANDOFF_MS = 812;   // 58% of the ooze: turd is fully out of the tube
const HANDOFF_DROP = 9;   // turd centre below the rectum at that moment (px)

/**
 * The header logo. Every so often it digests for a moment and drops a turd,
 * echoing the page loader. Once the turd is out it is handed to the turd pile,
 * which drops it to the bottom of the screen. Skipped for users who prefer reduced motion.
 */
@Component({
  selector: 'app-logo-mark',
  standalone: true,
  imports: [NgIf, TurdComponent],
  template: `
    <span class="logo" [class.digest]="phase === 'digest'" [class.release]="phase === 'release'">
      <img class="gut" src="assets/images/app-icon.png" alt="">
      <span *ngIf="phase === 'release' && !handedOff" #chute class="chute"><app-turd class="poop"></app-turd></span>
    </span>
  `,
  styles: [`
    :host { display: inline-block; width: 32px; height: 32px; }
    .logo { position: relative; display: block; width: 100%; height: 100%; }
    .gut { display: block; width: 100%; height: 100%; transform-origin: 50% 85%; }

    .digest .gut  { animation: digest 900ms ease-in-out 2; }
    .release .gut { animation: push 1400ms ease-in-out forwards; }

    /* zero-size point at the rectum; anything above it is clipped so the turd emerges from the tube */
    .chute {
      position: absolute; left: 16.8px; top: 29.8px; width: 0; height: 0; pointer-events: none;
      clip-path: polygon(-60px 0, 60px 0, 60px 60px, -60px 60px);
    }
    .poop {
      position: absolute; left: -8.5px; top: -3.75px; width: 17px; height: 7.5px;
      transform: translateY(-10px) rotate(-90deg);
      animation: ooze 1400ms linear forwards;
    }

    @keyframes digest {
      0%, 100% { transform: scale(1, 1) rotate(0deg); }
      20%      { transform: scale(1.08, .9) rotate(-3deg); }
      45%      { transform: scale(.92, 1.08) rotate(2deg); }
      70%      { transform: scale(1.05, .94) rotate(-1deg); }
    }
    @keyframes push {
      0%        { transform: scale(1, 1); }
      18%       { transform: scale(1.12, .85); }
      30%       { transform: scale(.96, 1.05); }
      38%       { transform: scale(1, 1); }
      46%       { transform: scale(1.14, .84); }
      58%       { transform: scale(.95, 1.05); }
      66%, 100% { transform: scale(1, 1); }
    }
    /* same motion as the page loader, at half scale */
    @keyframes ooze {
      0%, 12% { transform: translateY(-10px) rotate(-90deg); animation-timing-function: ease-out; }
      32%     { transform: translateY(-1.5px) rotate(-90deg); }
      40%     { transform: translateY(-2.5px) rotate(-90deg); animation-timing-function: ease-out; }
      58%     { transform: translateY(9px) rotate(-90deg); animation-timing-function: ease-in; }
      64%     { transform: translateY(10.5px) rotate(-82deg); animation-timing-function: ease-in; }
      80%     { transform: translateY(18px) rotate(0deg) scale(1.12, .72); animation-timing-function: ease-out; }
      88%     { transform: translateY(16.5px) rotate(0deg) scale(.94, 1.06); }
      100%    { transform: translateY(18px) rotate(0deg) scale(1, 1); }
    }
  `]
})
export class LogoMarkComponent implements OnInit, OnDestroy {
  public phase: Phase = 'idle';
  public handedOff = false;
  @ViewChild('chute') private chute?: ElementRef<HTMLElement>;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private zone: NgZone, private pile: TurdPileService) {
  }

  ngOnInit(): void {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    this.schedule(FIRST_DELAY_MS);
  }

  private schedule(delay: number): void {
    // wait outside Angular so idle timers don't trigger change detection
    this.zone.runOutsideAngular(() => {
      this.timer = setTimeout(() => this.zone.run(() => this.play()), delay);
    });
  }

  private play(): void {
    // don't perform to an empty room
    if (document.hidden) {
      this.schedule(MIN_GAP_MS);
      return;
    }
    this.phase = 'digest';
    this.timer = setTimeout(() => {
      this.phase = 'release';
      this.handedOff = false;
      this.timer = setTimeout(() => {
        const r = this.chute?.nativeElement.getBoundingClientRect();
        if (r) {
          // logo turd is 17px wide, pile turds 34px: hand off at half scale, still upright
          this.pile.drop(r.left, r.top + HANDOFF_DROP, -90, .5);
        }
        this.handedOff = true;
        this.timer = setTimeout(() => {
          this.phase = 'idle';
          this.schedule(MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS));
        }, RELEASE_MS - HANDOFF_MS);
      }, HANDOFF_MS);
    }, DIGEST_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
