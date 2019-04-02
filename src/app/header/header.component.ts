import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isNavClick = true;
  isMobileScreen = false;
  mobileMenuClick = false;
  // User Auth..
  isUserAuthenticate = false;
  private subscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (window.innerWidth < 1356) {
      this.isMobileScreen = true;
    }

    if (window.innerWidth > 1356) {
      this.isNavClick = false;
    }

    // Main Auth System..
    this.isUserAuthenticate = this.authService.getAuthStatus();
    this.subscription = this.authService.getAuthStatusListener()
      .subscribe(isAuth => {
        this.isUserAuthenticate = isAuth;
      });
  }

  onNavBtnClick() {
    if (window.innerWidth < 1356) {
      this.isNavClick = !this.isNavClick;
      this.mobileMenuClick = !this.mobileMenuClick;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
