import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/User/auth.service';
import { CATEGORIES, Category, GameLink } from "../shared/models/Game-Link/game-link.model";
import { GameLinkFormComponent } from "./game-link-form/game-link-form.component";
import { GameLinkService } from "../shared/services/Game-Link/game-link.service";
import { Categories } from "../shared/models/Game-Link/category.model";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig, environment } from "../../environments/environment.prod";
import { markPlayed, playedToday, unmarkPlayed } from "../shared/played";

const CATEGORY_IMAGES: Category[] = ['all', 'geo', 'word', 'movies', 'music', 'video-games'];

@Component({
  selector: 'app-game-links',
  templateUrl: './game-links.component.html',
  styleUrls: ['./game-links.component.scss']
})
export class GameLinksComponent implements OnInit, OnDestroy {
  public categories: Categories[] = [];
  public links: GameLink[] = [];
  public isAdmin: boolean = false;
  public currentCategory: Category | null = null;
  public search: string = '';
  public loading: boolean = false;
  private isAdminSub: Subscription;
  private paramSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private dialog: MatDialog,
              private authService: AuthService,
              private gameLinkService: GameLinkService) {
  }

  ngOnInit(): void {
    this.initializeAnalytics();
    this.categories = this.route.snapshot.data['categories'];
    // /games/:category drives the view; '/' (no param) shows the category picker
    this.paramSub = this.route.paramMap.subscribe((params: ParamMap) => this.select(params.get('category') as Category | null));
    this.isAdminSub = this.authService.isAdminAuthenticated
      .subscribe((isAdminAuthenticated: boolean): void => {
        this.isAdmin = isAdminAuthenticated;
      });

    this.authService.autoLogin();
    this.authService.autoLogout();
  }

  /**
   * Some embedded sites call focus()/autofocus on load, which makes the browser scroll
   * this page to their preview. Previews are never meant to have focus (clicks go to the
   * card link), so whenever one grabs it: take focus back and undo the jump.
   */
  private lastScrollY: number = 0;

  @HostListener('window:scroll')
  @HostListener('window:blur')
  public guardPreviewFocus(): void {
    const active = document.activeElement;
    if (active instanceof HTMLIFrameElement && active.classList.contains('site-preview')) {
      active.blur();
      window.scrollTo({top: this.lastScrollY, behavior: 'instant' as ScrollBehavior});
      return;
    }
    this.lastScrollY = window.scrollY;
  }

  private initializeAnalytics(): void {
    environment.production
      ? getAnalytics(initializeApp(firebaseConfig))
      : null;
  }

  get filteredLinks(): GameLink[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.links;
    return this.links.filter(l => (l.name + ' ' + l.description).toLowerCase().includes(term));
  }

  get playedCount(): number {
    return this.links.filter(l => l.clicked).length;
  }

  public categoryImage(category: Category): string | null {
    return CATEGORY_IMAGES.includes(category) ? `url(/assets/images/categories/${category}.png)` : null;
  }

  /** 'video-games' -> 'Video games' */
  public label(category: string): string {
    const text = category.replace(/-/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  public add(): void {
    this.dialog.open(GameLinkFormComponent, {
      width: '560px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {category: this.currentCategory}
    }).afterClosed()
      .subscribe(res => res ? this.onLinkChanged() : null);
  }

  /** Reload current list + category counters after an inline edit/delete. */
  public onLinkChanged(): void {
    this.gameLinkService.getCategories()
      .subscribe((categories: any): void => this.categories = categories);
    if (this.currentCategory) {
      this.getLinks(this.currentCategory);
    }
  }

  private select(category: Category | null): void {
    if (!category) {
      this.currentCategory = null;
      this.links = [];
      this.search = '';
      return;
    }
    if (!CATEGORIES.includes(category)) {
      void this.router.navigate(['/']);
      return;
    }
    if (this.currentCategory === category) return;
    this.currentCategory = category;
    this.search = '';
    this.title.setTitle(`${category === 'all' ? 'All games' : this.label(category)} · Office Colonoscopy`);
    this.getLinks(category);
    window.scrollTo({top: 0});
  }

  /** Mark every game in the current list as not played. */
  public resetPlayed(): void {
    unmarkPlayed(this.links.map(l => l.id));
    this.links.forEach(l => l.clicked = false);
  }

  private getLinks(category: Category): void {
    this.loading = true;
    this.gameLinkService.getLinksByCategory(category).subscribe({
      next: (res: GameLink[]): void => {
        const played = playedToday();
        res.forEach(l => l.clicked = played.has(l.id));
        this.links = res;
        this.loading = false;
      },
      error: (): void => {
        this.loading = false;
      }
    });
  }

  public playEmAll(): void {
    const links = this.filteredLinks;
    if (!links.length) return;
    links.forEach(link => {
      link.clicked = true;
      window.open(link.link, '_blank');
    });
    markPlayed(links.map(l => l.id));
    // the API only supports bumping a whole category
    if (this.currentCategory && this.currentCategory !== 'all' && !this.search) {
      this.gameLinkService.increaseClickCountToCategory(this.currentCategory)
        .subscribe((): void => {
          links.forEach(l => l.clickCount++);
          this.categories.forEach((c: Categories): void => {
            if (c.category === this.currentCategory || c.category === 'all') {
              c.totalClicks += links.length;
            }
          });
        });
    }
  }

  public trackById(_: number, link: GameLink): number {
    return link.id;
  }

  public logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.isAdminSub.unsubscribe();
    this.paramSub.unsubscribe();
  }
}
