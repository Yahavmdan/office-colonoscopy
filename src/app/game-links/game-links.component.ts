import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/User/auth.service';
import { Category, GameLink } from "../shared/models/Game-Link/game-link.model";
import { GameLinkFormComponent } from "./game-link-form/game-link-form.component";
import { GameLinkService } from "../shared/services/Game-Link/game-link.service";
import { Categories } from "../shared/models/Game-Link/category.model";
import { slideLeftRight } from "../shared/animations/animations";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

interface SavedItem {
  name: string;
  index: number;
  id: number
}

@Component({
  selector: 'app-game-links',
  templateUrl: './game-links.component.html',
  styleUrls: ['./game-links.component.scss'],
  animations: [slideLeftRight]
})

export class GameLinksComponent implements OnInit, OnDestroy {
  dragging: boolean = false;
  categories: Categories[];
  links: GameLink[] = [];
  form: FormGroup
  isAdminSub: Subscription;
  isAdmin: boolean = false;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private authService: AuthService,
              private gameLinkService: GameLinkService) {
  }

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categories'];
    this.isAdminSub = this.authService.isAdminAuthenticated
      .subscribe((isAdminAuthenticated: boolean): void => {
        this.isAdmin = isAdminAuthenticated;
      });

    this.authService.autoLogin();
    this.authService.autoLogout();
  }

  public add(): void {
    this.dialog.open(GameLinkFormComponent, {
      width: '500px',
      height: '600px',
      autoFocus: false
    })
  }

  public handleClick(category: Category, card: HTMLDivElement): void {
    if (!this.links?.length) {
      this.getLinks(category, card);
      return;
    }
    if (this.links[0].category !== category) {
      this.getLinks(category, card);
    }
  }

  private getLinks(category: Category, card?: HTMLDivElement): void {
    this.gameLinkService.getLinksByCategory(category).subscribe((res: GameLink[]): void => {
      card ? card.classList.add('shrink-card') : null;
      this.links = [];
      this.links = res;
      this.getLayout(category);
    });
  }

  public playEmAll(links: GameLink[]): void {
    links!.forEach(link => {
      link.clicked = true;
      window.open(link.link, '_blank');
    });
    this.gameLinkService.increaseClickCountToCategory(links[0].category)
      .subscribe((res: boolean): void => {
        if (res) {
          this.categories.forEach((category: Categories): void => {
            if (category.category === links[0].category) {
              category.totalClicks += links.length;
            }
          })
        }
      });
  }

  public hasChange(event: { changed: boolean, category: Category }): void {
    if (event.changed) {
      this.getLinks(event.category);
    }
  }

  public rearrangeLayout(event: CdkDragDrop<{ item: GameLink, index: number }>): void {
    this.links![event.previousContainer.data.index] = event.container.data.item;
    this.links![event.container.data.index] = event.previousContainer.data.item;
    this.setLayout(this.links);
  }

  private rearrangeArrayByIndex(links: GameLink[], order: SavedItem[]): GameLink[] {
    let result: GameLink[] = [];
    if (!order) {
      return [];
    }
    order.forEach((item: SavedItem): void => {
      if (links.find((obj: GameLink): boolean => obj.name === item.name)) {
        result[item.index] = <GameLink>links.find((obj: GameLink): boolean => obj.name === item.name);
      }
    });

    return result as GameLink[];
  }

  private getLayout(category: Category): void {
    if (localStorage.getItem(category)) {
      let savedLinks: GameLink[] = this.clearDuplicates(this.links);
      savedLinks = this.rearrangeArrayByIndex(savedLinks, JSON.parse(localStorage.getItem(category) ?? ''));
      savedLinks = this.addMissingItemsToSavedLinks(savedLinks);
      if (savedLinks) {
        this.links = savedLinks;
      }
    }
  }

  private clearDuplicates(savedLinks: GameLink[]): GameLink[] {
    const uniqueLinks: GameLink[] = [];
    const seenIds: Set<number> = new Set<number>();
    savedLinks.forEach((link: GameLink): void => {
      if (!seenIds.has(link.id)) {
        seenIds.add(link.id);
        uniqueLinks.push(link);
      }
    })
    return uniqueLinks as GameLink[];
  }

  private addMissingItemsToSavedLinks(savedLinks: GameLink[]): GameLink[] {
    const savedLinksIds: Set<number> = new Set(savedLinks.map((link: GameLink) => link.id));
    this.links.forEach((link: GameLink): void => {
      if (!savedLinksIds.has(link.id)) {
        savedLinks.push(link);
        this.setLayout(savedLinks);
      }
    })
    return savedLinks as GameLink[];
  }

  private setLayout(links: GameLink[]): void {
    const order: SavedItem[] = links?.map((link: GameLink, i: number): SavedItem => {
      return {name: link.name, index: i, id: link.id};
    });
    localStorage.setItem(links[0].category, JSON.stringify(order ?? null));
  }

  public isDragging(event: boolean): void {
    this.dragging = event;
  }

  public clearLinks(card: HTMLDivElement): void {
    card.classList.remove('shrink-card');
    this.links = [];
  }

  public logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.isAdminSub.unsubscribe();
  }

}
