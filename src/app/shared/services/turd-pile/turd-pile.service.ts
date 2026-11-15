import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { TURD_SVG } from '../../components/poop-loader/turd.component';

const W = 34;          // landed turd size (px)
const H = 15;
const OVERLAP = 12;    // how far neighbours may overlap sideways
const SINK = 7;        // how far a turd sinks into the one below
const STEP = W * .35;  // sideways distance of one tumble down the pile
const PROBE = W * .75; // how far to each side the slope is measured
const MAX_DROP = H * .75; // higher than this above a neighbour and a turd slides off
const FLY_THRESHOLD = 3; // flies show up once the pile has more turds than this
const MAX_FLIES = 6;

interface Fly {
  el: HTMLDivElement;
  target: Turd;
  x: number;
  y: number;
  angle: number;
  speed: number;   // rad/s, sign = direction
  rx: number;      // orbit radii (px)
  ry: number;
  wobble: number;  // phase offset for the vertical bob
}

interface Turd {
  el: HTMLDivElement;
  x: number;       // centre x (px)
  bottom: number;  // distance from viewport bottom (px)
  tilt: number;    // resting rotation (deg)
}

/**
 * Turds dropped by the header logo fall to the bottom of the screen and pile up.
 * Grab one to drag it; a recycle bin appears and swallows anything dropped on it.
 * Once the pile gets big enough, flies start buzzing around it.
 * Built with plain DOM outside Angular so the pile survives route changes and
 * never triggers change detection.
 */
@Injectable({ providedIn: 'root' })
export class TurdPileService implements OnDestroy {
  private layer?: HTMLDivElement;
  private bin?: HTMLDivElement;
  private turds: Turd[] = [];
  private flies: Fly[] = [];
  private frame?: number;
  private lastTime = 0;
  private onResize = () => this.restack(false);

  constructor(private zone: NgZone) {
  }

  /** Drop a turd whose centre is at viewport (x, y), currently rotated `rot` degrees and scaled `scale`. */
  drop(x: number, y: number, rot = 0, scale = 1): void {
    this.zone.runOutsideAngular(() => {
      this.ensureLayer();
      const el = document.createElement('div');
      el.className = 'tp-turd';
      el.innerHTML = `<div class="tp-body">${TURD_SVG}</div>`;
      el.addEventListener('pointerdown', e => this.grab(e, turd));
      this.layer!.appendChild(el);
      const turd: Turd = { el, x: 0, bottom: 0, tilt: 0 };
      this.fall(turd, x, y, rot, scale);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    this.layer?.remove();
  }

  // --- pile ---

  /** Land `turd` on the pile under x, animating from its current centre (x, y). */
  private fall(turd: Turd, x: number, y: number, rot: number, scale: number): void {
    // a little sideways scatter so drops from the same spot don't line up
    const impactX = this.clampX(x + (Math.random() - .5) * 14);
    const others = this.turds;
    const impactBottom = this.landingBottom(impactX, others);
    const path = this.settle(impactX, others);
    const rest = path[path.length - 1];
    turd.x = rest.x;
    turd.bottom = rest.bottom;
    turd.tilt = this.slopeTilt(turd.x, others);
    this.turds.push(turd);
    this.updateFlies();
    this.place(turd, false);

    const toY = (bottom: number) => window.innerHeight - bottom - H / 2;
    const finalY = toY(turd.bottom);
    const fallDy = toY(impactBottom) - y;
    const fallMs = Math.min(1100, Math.max(320, Math.sqrt(Math.abs(fallDy)) * 30));
    const rollMs = (path.length - 1) * 130;
    const total = fallMs + rollMs;

    // fall onto the top of the pile, then tumble down its side one step at a time
    const frames: Keyframe[] = [
      { offset: 0, transform: `translate(${x - turd.x}px, ${y - finalY}px) rotate(${rot}deg) scale(${scale})`, easing: 'cubic-bezier(.45, 0, 1, .7)' },
      { offset: fallMs / total, transform: `translate(${impactX - turd.x}px, ${toY(impactBottom) - finalY}px) rotate(${turd.tilt * .3}deg) scale(1)`, easing: 'ease-in' }
    ];
    let spin = turd.tilt * .3;
    path.slice(1).forEach((p, i) => {
      spin += (p.x > path[i].x ? 1 : -1) * 70;
      const last = i === path.length - 2;
      frames.push({
        offset: (fallMs + (i + 1) * 130) / total,
        transform: `translate(${p.x - turd.x}px, ${toY(p.bottom) - finalY}px) rotate(${last ? turd.tilt : spin}deg) scale(1)`,
        easing: 'ease-in'
      });
    });
    if (frames.length === 2) {
      // no tumbling: land straight into the resting pose
      frames[1] = { offset: 1, transform: `translate(0, 0) rotate(${turd.tilt}deg) scale(1)` };
    }
    turd.el.animate(frames, { duration: total });
    (turd.el.firstElementChild as HTMLElement).animate([
      { transform: 'scale(1, 1)' },
      { transform: 'scale(1.18, .7)', offset: .4 },
      { transform: 'scale(.94, 1.06)', offset: .75 },
      { transform: 'scale(1, 1)' }
    ], { duration: 260, delay: fallMs, easing: 'ease-out' });
  }

  /** Where a turd centred at x comes to rest, given the turds already on the pile. */
  private landingBottom(x: number, pile: Turd[]): number {
    let base = 0;
    for (const t of pile) {
      if (Math.abs(t.x - x) < W - OVERLAP) {
        base = Math.max(base, t.bottom + H - SINK);
      }
    }
    return base;
  }

  /**
   * Starting at x, slide downhill while the pile is too steep to hold a turd,
   * so drops spread into a mound instead of stacking into a column.
   * Returns every resting point along the way (first = impact point).
   */
  private settle(x: number, pile: Turd[]): { x: number; bottom: number }[] {
    const path = [{ x, bottom: this.landingBottom(x, pile) }];
    for (let i = 0; i < 40; i++) {
      const cur = path[path.length - 1];
      const lp = this.clampX(cur.x - PROBE);
      const rp = this.clampX(cur.x + PROBE);
      const lb = lp < cur.x ? this.landingBottom(lp, pile) : Infinity;
      const rb = rp > cur.x ? this.landingBottom(rp, pile) : Infinity;
      if (cur.bottom - Math.min(lb, rb) <= MAX_DROP) {
        break;
      }
      const goLeft = lb < rb || (lb === rb && Math.random() < .5);
      const nx = this.clampX(cur.x + (goLeft ? -STEP : STEP));
      if (nx === cur.x) {
        break;
      }
      path.push({ x: nx, bottom: this.landingBottom(nx, pile) });
    }
    return path;
  }

  /** Resting tilt that follows the local slope of the pile, plus a little jitter. */
  private slopeTilt(x: number, pile: Turd[]): number {
    const span = W * .7;
    const hl = this.landingBottom(x - span / 2, pile);
    const hr = this.landingBottom(x + span / 2, pile);
    const slope = Math.atan2(hl - hr, span) * 180 / Math.PI;
    return Math.round(Math.max(-35, Math.min(35, slope)) + (Math.random() - .5) * 10);
  }

  /** Re-settle every turd (after one is removed or the window resizes). */
  private restack(animate: boolean): void {
    const settled: Turd[] = [];
    for (const t of this.turds) {
      const path = this.settle(this.clampX(t.x), settled);
      const rest = path[path.length - 1];
      const moved = rest.x !== t.x || rest.bottom !== t.bottom;
      t.x = rest.x;
      t.bottom = rest.bottom;
      if (moved) {
        t.tilt = this.slopeTilt(t.x, settled);
      }
      settled.push(t);
      this.place(t, animate);
    }
  }

  private place(t: Turd, animate: boolean): void {
    t.el.style.transition = animate
      ? 'bottom 300ms cubic-bezier(.45, 0, 1, .7), left 300ms ease-out, transform 300ms ease-out'
      : '';
    t.el.style.left = `${t.x - W / 2}px`;
    t.el.style.bottom = `${t.bottom}px`;
    t.el.style.transform = `rotate(${t.tilt}deg)`;
  }

  private clampX(x: number): number {
    return Math.min(window.innerWidth - W / 2, Math.max(W / 2, x));
  }

  // --- dragging ---

  private grab(e: PointerEvent, turd: Turd): void {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();
    const el = turd.el;
    el.setPointerCapture(e.pointerId);
    el.getAnimations({ subtree: true }).forEach(a => a.cancel());

    this.turds = this.turds.filter(t => t !== turd);
    this.restack(true);
    this.updateFlies();

    const r = el.getBoundingClientRect();
    const offX = e.clientX - (r.left + r.width / 2);
    const offY = e.clientY - (r.top + r.height / 2);
    let cx = e.clientX - offX;
    let cy = e.clientY - offY;
    let hot = false;

    el.classList.add('tp-held');
    el.style.transition = '';
    this.showBin(true);

    const move = (ev: PointerEvent) => {
      cx = ev.clientX - offX;
      cy = ev.clientY - offY;
      el.style.left = `${cx - W / 2}px`;
      el.style.bottom = `${window.innerHeight - cy - H / 2}px`;
      el.style.transform = 'rotate(0deg)';
      hot = this.overBin(ev.clientX, ev.clientY);
      this.bin!.classList.toggle('tp-hot', hot);
    };
    const release = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', release);
      el.removeEventListener('pointercancel', release);
      el.classList.remove('tp-held');
      this.bin!.classList.remove('tp-hot');
      if (hot) {
        this.recycle(el);
      } else {
        this.showBin(false);
        this.fall(turd, cx, cy, 0, 1);
      }
    };
    move(e);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  }

  private overBin(x: number, y: number): boolean {
    const r = this.bin!.getBoundingClientRect();
    const pad = 16;
    return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
  }

  private recycle(el: HTMLDivElement): void {
    const r = this.bin!.getBoundingClientRect();
    const t = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - (t.left + t.width / 2);
    const dy = r.top + r.height * .35 - (t.top + t.height / 2);
    this.bin!.classList.add('tp-open');
    el.animate([
      { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
      { transform: `translate(${dx}px, ${dy - 30}px) rotate(-120deg) scale(.8)`, offset: .55 },
      { transform: `translate(${dx}px, ${dy + 10}px) rotate(-200deg) scale(.3)`, opacity: 0 }
    ], { duration: 420, easing: 'ease-in', fill: 'forwards' }).finished.then(() => {
      el.remove();
      this.bin!.classList.remove('tp-open');
      this.bin!.animate([
        { transform: 'translateY(0) scale(1, 1)' },
        { transform: 'translateY(0) scale(1.1, .9)' },
        { transform: 'translateY(0) scale(1, 1)' }
      ], { duration: 220, easing: 'ease-out' }).finished.then(() => this.showBin(false));
    });
  }

  private showBin(show: boolean): void {
    this.bin!.classList.toggle('tp-shown', show);
  }

  // --- flies ---

  /** Match the number of flies to the pile size and point strays at turds still on the pile. */
  private updateFlies(): void {
    const n = this.turds.length;
    const want = n > FLY_THRESHOLD ? Math.min(MAX_FLIES, n - FLY_THRESHOLD + 1) : 0;
    while (this.flies.length > want) {
      this.flies.pop()!.el.remove();
    }
    for (const f of this.flies) {
      if (!this.turds.includes(f.target)) {
        f.target = this.randomTurd();
      }
    }
    while (this.flies.length < want) {
      const target = this.randomTurd();
      const el = document.createElement('div');
      el.className = 'tp-fly';
      el.innerHTML = FLY_SVG;
      this.layer!.appendChild(el);
      const c = this.centre(target);
      this.flies.push({
        el, target,
        x: c.x + (Math.random() - .5) * 120,
        y: c.y - 60 - Math.random() * 60,
        angle: Math.random() * Math.PI * 2,
        speed: (2.5 + Math.random() * 2.5) * (Math.random() < .5 ? -1 : 1),
        rx: 16 + Math.random() * 14,
        ry: 8 + Math.random() * 8,
        wobble: Math.random() * 10
      });
    }
    if (this.flies.length && !this.frame) {
      this.lastTime = performance.now();
      this.frame = requestAnimationFrame(t => this.tick(t));
    }
  }

  private tick(now: number): void {
    const dt = Math.min(.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    for (const f of this.flies) {
      // now and then wander off to another turd
      if (Math.random() < dt * .15) {
        f.target = this.randomTurd();
      }
      f.angle += f.speed * dt;
      const c = this.centre(f.target);
      const tx = c.x + Math.cos(f.angle) * f.rx + Math.sin(now / 90 + f.wobble) * 3;
      const ty = c.y - 14 + Math.sin(f.angle * 1.7) * f.ry + Math.cos(now / 70 + f.wobble) * 3;
      const k = 1 - Math.exp(-dt * 6);
      const vx = (tx - f.x) * k;
      const vy = (ty - f.y) * k;
      f.x += vx;
      f.y += vy;
      const flip = vx < 0 ? -1 : 1;
      f.el.style.transform = `translate(${f.x - 2.5}px, ${f.y - 2.5}px) scaleX(${flip})`;
    }
    this.frame = this.flies.length ? requestAnimationFrame(t => this.tick(t)) : undefined;
  }

  private randomTurd(): Turd {
    return this.turds[Math.floor(Math.random() * this.turds.length)];
  }

  private centre(t: Turd): { x: number; y: number } {
    return { x: t.x, y: window.innerHeight - t.bottom - H / 2 };
  }

  // --- setup ---

  private ensureLayer(): void {
    if (this.layer) {
      return;
    }
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    this.layer = document.createElement('div');
    this.layer.className = 'tp-layer';
    this.bin = document.createElement('div');
    this.bin.className = 'tp-bin';
    this.bin.innerHTML = BIN_SVG;
    this.layer.appendChild(this.bin);
    document.body.appendChild(this.layer);
    window.addEventListener('resize', this.onResize);
  }
}

const FLY_SVG = `
  <svg viewBox="0 0 10 10" aria-hidden="true">
    <ellipse class="tp-wing" cx="4" cy="3" rx="2.6" ry="1.6" fill="rgba(200, 225, 255, .75)" stroke="#000" stroke-width=".6"/>
    <ellipse cx="5" cy="6" rx="3.2" ry="2" fill="#1b1b1b"/>
    <circle cx="8" cy="5.6" r="1.3" fill="#6b1d1d"/>
  </svg>`;

const BIN_SVG = `
  <svg viewBox="0 0 64 80" aria-hidden="true">
    <g class="tp-lid">
      <rect x="25" y="3" width="14" height="6" rx="2" fill="#4fae7c" stroke="#000" stroke-width="3"/>
      <rect x="6" y="9" width="52" height="9" rx="3" fill="#4fae7c" stroke="#000" stroke-width="3"/>
    </g>
    <path d="M10 22 H54 L49 75 H15 Z" fill="#6cc59a" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
    <path d="M23 30 L25 67 M32 30 V67 M41 30 L39 67" stroke="#3d8f63" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(32 48)" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-3 -11 L3 -11 L8 -2"/><path d="M5 -4 L8 -2 L10 -6"/>
      <path d="M10 3 L7 9 L-2 9"/><path d="M0 6 L-2 9 L0 12"/>
      <path d="M-7 6 L-10 1 L-6 -7"/><path d="M-9 -5 L-6 -7 L-3 -5"/>
    </g>
  </svg>`;

const STYLES = `
  .tp-layer { position: fixed; inset: 0; pointer-events: none; z-index: 1000; overflow: hidden; }
  .tp-turd {
    position: absolute; width: ${W}px; height: ${H}px;
    pointer-events: auto; cursor: grab; touch-action: none; user-select: none;
  }
  .tp-turd:hover { filter: drop-shadow(0 0 3px rgba(0, 0, 0, .35)); }
  .tp-body { width: 100%; height: 100%; transform-origin: 50% 100%; }
  .tp-turd.tp-held {
    cursor: grabbing; z-index: 2;
    filter: drop-shadow(4px 6px 0 rgba(0, 0, 0, .25));
  }
  .tp-turd.tp-held .tp-body { transform: scale(1.25); transform-origin: 50% 50%; }

  .tp-bin {
    position: absolute; right: 24px; bottom: 24px; width: 64px; height: 80px;
    transform: translateY(160%); transition: transform 220ms cubic-bezier(.3, 1.4, .6, 1);
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .2));
  }
  .tp-bin.tp-shown { transform: translateY(0); }
  .tp-bin svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .tp-lid { transform-box: fill-box; transform-origin: 100% 100%; transition: transform 160ms ease-out; }
  .tp-bin.tp-hot .tp-lid, .tp-bin.tp-open .tp-lid { transform: rotate(35deg) translateY(-4px); }
  .tp-bin.tp-hot { transform: translateY(0) scale(1.12); }

  .tp-fly { position: absolute; left: 0; top: 0; width: 5px; height: 5px; z-index: 3; will-change: transform; }
  .tp-fly svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .tp-wing { transform-box: fill-box; transform-origin: 50% 100%; animation: tp-buzz 60ms linear infinite alternate; }
  @keyframes tp-buzz { from { transform: scaleY(1); } to { transform: scaleY(.3); } }
`;
