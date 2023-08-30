import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Categories } from 'src/app/shared/models/Game-Link/category.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/User/auth.service';
import { GameCategoryListComponent } from "./game-category-list/game-category-list.component";
import { Category, GameLink } from "../shared/models/Game-Link/game-link.model";
import { GameLinkFormComponent } from "./game-link-form/game-link-form.component";
import { GameLinkService } from "../shared/services/Game-Link/game-link.service";

@Component({
  selector: 'app-game-links',
  templateUrl: './game-links.component.html',
  styleUrls: ['./game-links.component.scss']
})
export class GameLinksComponent implements OnInit, OnDestroy {
  categories: Categories;
  categoryKeys: Category[];
  form: FormGroup
  isAdminSub: Subscription;
  isAdminAuthenticated: boolean = false;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private authService: AuthService,
              private gameLinkService: GameLinkService) {
  }

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categories'];
    this.categoryKeys = Object.keys(this.categories) as Category[];
    this.categoryKeys.forEach(key => this.getSumClicks(key))
    this.isAdminSub = this.authService.isAdminAuthenticated
      .subscribe((isAdminAuthenticated: boolean) => {
        this.isAdminAuthenticated = isAdminAuthenticated;
      });

    this.authService.autoLogin();
    this.authService.autoLogout();
  }

  public getSumClicks(key: Category, updated?: number): number {
    return this.categories[key].reduce((sum: number, link: GameLink) => sum + link.clickCount, 0) + (updated ?? 0);
  }

  public add(): void {
    this.dialog.open(GameLinkFormComponent, {
      width: '500px',
      height: '600px'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.gameLinkService.getCategories().subscribe(categories => {
          this.categories = categories;
        })
      }
    });
  }

  public logout(): void {
    this.authService.logout();
  }

  public handleClick(key: Category): void {
    this.dialog.open(GameCategoryListComponent, {
      data: {categories: this.categories[key], isAdmin: this.isAdminAuthenticated},
      width: '80%',
      height: '80%',
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.gameLinkService.getCategories().subscribe(categories => {
          this.categories = categories;
        })
      }
    })
  }

  ngOnDestroy() {
    this.isAdminSub.unsubscribe();
  }

}
