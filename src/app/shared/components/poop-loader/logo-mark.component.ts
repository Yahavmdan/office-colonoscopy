import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { TurdComponent } from './turd.component';

type Phase = 'idle' | 'digest' | 'release';

const FIRST_DELAY_MS = 6000;
const MIN_GAP_MS = 25000;
const MAX_GAP_MS = 50000;
const DIGEST_MS = 1800;   // two digest cycles
const RELEASE_MS = 1500;  // push + drop + fade; keep in sync with CSS below

/**
 * The header logo. Every so often it digests for a moment and drops a turd,
 * echoing the page loader. Skipped for users who prefer reduced motion.
 */
@Component({
  selector: 'app-logo-mark',
  standalone: true,
  imports: [NgIf, TurdComponent],
  template: `
    <span class="mark" [class.digest]="phase === 'digest'" [class.release]="phase === 'release'">
      <img class="gut" src="assets/images/app-icon.png" alt="">
      <app-turd *ngIf="phase === 'release'" class="poop"></app-turd>
    </span>
  `,
  styles: [`
    :host { display: inline-block; width: 32px; height: 32px; }
    .mark { position: relative; display: block; width: 100%; height: 100%; }
    .gut { display: block; width: 100%; height: 100%; transform-origin: 50% 85%; }

    .digest .gut  { animation: digest 900ms ease-in-out 2; }
    .release .gut { animation: push 900ms ease-in-out forwards; }

    .poop {
      position: absolute; left: 50%; top: 20px; width: 26px; height: 11px;
      transform: translate(-50%, 0) scale(0); opacity: 0; pointer-events: none;
      animation: drop 1500ms cubic-bezier(.3, .7, .4, 1) forwards;
    }

    @keyframes digest {
      0%, 100% { transform: scale(1, 1) rotate(0deg); }
      20%      { transform: scale(1.08, .9) rotate(-3deg); }
      45%      { transform: scale(.92, 1.08) rotate(2deg); }
      70%      { transform: scale(1.05, .94) rotate(-1deg); }
    }
    @keyframes push {
      0%   { transform: scale(1, 1); }
      25%  { transform: scale(1.18, .78); }
      45%  { transform: scale(.9, 1.12); }
      65%, 100% { transform: scale(1, 1); }
    }
    @keyframes drop {
      0%, 15% { transform: translate(-50%, 0) scale(0); opacity: 0; }
      28%     { transform: translate(-50%, 8px) scale(1.1); opacity: 1; }
      38%     { transform: translate(-50%, 18px) scale(1, .8); }
      46%     { transform: translate(-50%, 14px) scale(1); }
      54%     { transform: translate(-50%, 18px) scale(1.05, .9); }
      80%     { transform: translate(-50%, 18px) scale(1); opacity: 1; }
      100%    { transform: translate(-50%, 18px) scale(1); opacity: 0; }
    }
  `]
})
export class LogoMarkComponent implements OnInit, OnDestroy {
  public phase: Phase = 'idle';
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private zone: NgZone) {
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
      this.timer = setTimeout(() => {
        this.phase = 'idle';
        this.schedule(MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS));
      }, RELEASE_MS);
    }, DIGEST_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
