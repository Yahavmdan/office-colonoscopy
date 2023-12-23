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
  isMobile: boolean = false;
  private currentCategory: Category;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private authService: AuthService,
              private gameLinkService: GameLinkService) {
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
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
    }).afterClosed()
      .subscribe(res => res
        ? this.getLinks(res.category)
        : null
      );
  }

  public handleClick(category: Category, card: HTMLDivElement): void {
    if (!this.links?.length) {
      this.getLinks(category, card);
      return;
    }
    if (this.currentCategory !== category) {
      this.getLinks(category, card);
    }
    this.currentCategory = category;
  }

  private getLinks(category: Category, card?: HTMLDivElement): void {
    this.deskTopAnimation();
    this.gameLinkService.getLinksByCategory(category).subscribe((res: GameLink[]): void => {
      card ? card.classList.add('shrink-card') : null;
      this.links = res;
    });
  }

  private deskTopAnimation(): void {
    !this.isMobile ? this.links = [] : null;
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
