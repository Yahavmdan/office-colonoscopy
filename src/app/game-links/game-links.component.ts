import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {GameLink} from 'src/app/shared/models/game-link.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from 'src/app/login/login.component';
import {GameLinkService} from 'src/app/shared/services/game-link.service';
import {Categories} from 'src/app/shared/models/category.model';
import {Subscription} from 'rxjs';
import {AuthService} from 'src/app/shared/services/auth.service';
import {GameLinkFormComponent} from 'src/app/game-links/game-link-form/game-link-form.component';

@Component({
  selector: 'app-game-links',
  templateUrl: './game-links.component.html',
  styleUrls: ['./game-links.component.scss']
})
export class GameLinksComponent implements OnInit, OnDestroy {
  categories: Categories;
  form: FormGroup
  isAdminAuthenticated = false;
  isAdminSub : Subscription;
  moviesClicked = false;
  geosClicked = false;
  wordsClicked = false


  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private dialog: MatDialog, private gameLinkService: GameLinkService,
              private authService: AuthService, private renderer: Renderer2) {
  }



  ngOnInit() {
    this.categories = this.route.snapshot.data['categories'];
    this.isAdminSub = this.authService.isAdminAuthenticated
      .subscribe((isAdminAuthenticated: boolean) => {
        this.isAdminAuthenticated = isAdminAuthenticated;
      });

    this.authService.autoLogin();
    this.authService.autoLogout();
  }

  handleClick(element: HTMLDivElement, gameLink: GameLink): void {
    window.open(gameLink.link, '_blank');
    this.renderer.addClass(element, 'clicked');
        this.gameLinkService.increaseClickCount(gameLink.id).subscribe(isSuccess => {
          if (isSuccess) {
            const g = this.categories[gameLink.category].find(gl => gl.id === gameLink.id);
            if (g) {
              g.clickCount++;
            }
          }
        });
  }

  login() {
    this.dialog.open(LoginComponent, {
      width: '500px',
      height: '200px'
    });
  }

  logout() {
    this.authService.logout();
  }

  navigateAll(gameLinks: GameLink[], category: 'geo' | 'word' | 'movies') {
    gameLinks.forEach(gameLink => {
      window.open(gameLink.link, '_blank');
    });
    switch (category) {
      case 'movies':
        this.moviesClicked = true;
        break;
      case 'geo':
        this.geosClicked = true;
        break;
      case 'word':
        this.wordsClicked = true;
        break;
    }
    this.gameLinkService.increaseClickCountByCategory(category).subscribe(isSuccess => {
      if (isSuccess) {
        this.categories[category].forEach(gameLink => {
          gameLink.clickCount++;
        });
      }
    });
  }

  ngOnDestroy() {
    this.isAdminSub.unsubscribe();
  }

  edit(gameLink: GameLink) {
      this.dialog.open(GameLinkFormComponent, {
        width: '500px',
        height: '400px',
        data: {gameLink}
      }).afterClosed().subscribe(res => {
        if (res) {
          this.gameLinkService.getCategories().subscribe(categories => {
            this.categories = categories;
          })
        }
      });
  }

  delete(gameLinkId: number) {
    this.gameLinkService.delete(gameLinkId).subscribe(isDeleted => {
      if (isDeleted) {
        this.gameLinkService.getCategories().subscribe(categories => {
          this.categories = categories;
        })
      }
    })
  }

  add() {
    this.dialog.open(GameLinkFormComponent, {
      width: '500px',
      height: '400px'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.gameLinkService.getCategories().subscribe(categories => {
          this.categories = categories;
        })
      }
    });
  }
}
