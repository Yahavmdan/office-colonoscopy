import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { GameLinkService } from '../shared/services/Game-Link/game-link.service';
import { AuthService } from '../shared/services/User/auth.service';
import { Category, GameLink, LINK_CATEGORIES } from '../shared/models/Game-Link/game-link.model';
import { GameLinkFormComponent, GameLinkFormData } from '../game-links/game-link-form/game-link-form.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

type SortKey = 'clicks' | 'name' | 'newest' | 'category';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public links: GameLink[] = [];
  public filtered: GameLink[] = [];
  public categories: Category[] = LINK_CATEGORIES;
  public counts: Record<string, number> = {};
  public search: string = '';
  public category: Category = 'all';
  public sort: SortKey = 'clicks';
  public selected = new Set<number>();
  public loading: boolean = true;

  constructor(private gameLinkService: GameLinkService,
              private authService: AuthService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.autoLogout();
    this.load();
  }

  /** "/" focuses search, "n" opens the add form (when not typing in a field). */
  @HostListener('document:keydown', ['$event'])
  public onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || this.dialog.openDialogs.length) {
      return;
    }
    if (event.key === '/') {
      event.preventDefault();
      document.getElementById('admin-search')?.focus();
    } else if (event.key === 'n') {
      event.preventDefault();
      this.add();
    }
  }

  public load(): void {
    this.loading = true;
    this.gameLinkService.getLinksByCategory('all').subscribe({
      next: (links: GameLink[]): void => {
        this.links = links;
        this.counts = links.reduce((acc: Record<string, number>, l) => {
          acc[l.category] = (acc[l.category] || 0) + 1;
          return acc;
        }, {});
        // drop selections of rows that no longer exist
        this.selected.forEach(id => links.some(l => l.id === id) ? null : this.selected.delete(id));
        this.applyFilters();
        this.loading = false;
      },
      error: (): void => {
        this.loading = false;
        this.snackBar.open('Could not load games', 'Retry', {duration: 5000})
          .onAction().subscribe(() => this.load());
      }
    });
  }

  public applyFilters(): void {
    const term = this.search.trim().toLowerCase();
    this.filtered = this.links
      .filter(l => this.category === 'all' || l.category === this.category)
      .filter(l => !term || [l.name, l.description, l.link, l.image]
        .some(v => (v || '').toLowerCase().includes(term)))
      .sort((a, b) => {
        switch (this.sort) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'newest':
            return b.id - a.id;
          case 'category':
            return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
          default:
            return b.clickCount - a.clickCount;
        }
      });
  }

  public clearFilters(): void {
    this.search = '';
    this.category = 'all';
    this.applyFilters();
  }

  public add(): void {
    this.openForm({category: this.category});
  }

  public edit(link: GameLink): void {
    this.openForm({link});
  }

  public duplicate(link: GameLink): void {
    this.openForm({link, duplicate: true});
  }

  private openForm(data: GameLinkFormData): void {
    this.dialog.open(GameLinkFormComponent, {width: '560px', maxWidth: '95vw', autoFocus: 'first-tabbable', data})
      .afterClosed()
      .subscribe(res => res?.changed ? this.load() : null);
  }

  public remove(link: GameLink): void {
    ConfirmDialogComponent.open(this.dialog, `Delete "${link.name}"?`).subscribe(yes => {
      if (!yes) return;
      this.gameLinkService.delete(link.id).subscribe({
        next: (): void => {
          this.snackBar.open(`"${link.name}" deleted`, '', {duration: 2500});
          this.load();
        },
        error: (err): void => this.handleError(err)
      });
    });
  }

  public removeSelected(): void {
    const ids = [...this.selected];
    ConfirmDialogComponent.open(this.dialog, `Delete ${ids.length} selected game${ids.length > 1 ? 's' : ''}?`)
      .subscribe(yes => {
        if (!yes) return;
        forkJoin(ids.map(id => this.gameLinkService.delete(id))).subscribe({
          next: (): void => {
            this.snackBar.open(`${ids.length} deleted`, '', {duration: 2500});
            this.selected.clear();
            this.load();
          },
          error: (err): void => {
            this.handleError(err);
            this.load();
          }
        });
      });
  }

  public toggle(id: number): void {
    this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id);
  }

  public get allVisibleSelected(): boolean {
    return this.filtered.length > 0 && this.filtered.every(l => this.selected.has(l.id));
  }

  public toggleAllVisible(): void {
    const select = !this.allVisibleSelected;
    this.filtered.forEach(l => select ? this.selected.add(l.id) : this.selected.delete(l.id));
  }

  public imageSrc(link: GameLink): string {
    return 'assets/images/game-pic/' + (link.image ? link.image : 'null.png');
  }

  public onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('null.png')) {
      img.src = 'assets/images/game-pic/null.png';
    }
  }

  public trackById(_: number, link: GameLink): number {
    return link.id;
  }

  public logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }

  private handleError(err: any): void {
    if (err?.status === 403) {
      this.snackBar.open('Session expired, please log in again', 'OK', {duration: 5000});
      this.authService.logout();
      void this.router.navigate(['/login']);
      return;
    }
    this.snackBar.open('Action failed', 'OK', {duration: 5000});
  }
}
