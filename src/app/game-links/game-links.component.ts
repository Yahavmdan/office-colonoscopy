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
  categories: Categories[];
  links: GameLink[] | null = null;
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

  public handleClick(category: Category): void {
    if (!this.links?.length) {
      this.getLinks(category);
      return;
    }
    if (this.links[0].category !== category) {
      this.links = null;
      this.getLinks(category);
    }
  }

  private getLinks(category: Category): void {
    this.gameLinkService.getLinksByCategory(category).subscribe((res: GameLink[]): void => {
      this.links = res;
    });
  }

  public playEmAll(links: GameLink[]): void {
    links!.forEach((link: GameLink): void => {
      window.open(link.link, '_blank');
    })
    void this.gameLinkService.increaseClickCountByCategory(links[0].category).subscribe();
  }

  public hasChange(event: { changed: boolean, category: Category }): void {
    if (event.changed) {
      this.getLinks(event.category);
    }
  }

  public clearLinks(): void {
    this.links = null;
  }

  public logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.isAdminSub.unsubscribe();
  }

}
