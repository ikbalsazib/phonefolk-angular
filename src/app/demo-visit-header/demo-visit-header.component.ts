import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-demo-visit-header',
  templateUrl: './demo-visit-header.component.html',
  styleUrls: ['./demo-visit-header.component.scss']
})
export class DemoVisitHeaderComponent implements OnInit {
  isNavClick = true;
  isMobileScreen = false;
  mobileMenuClick = false;
  message: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (window.innerWidth < 1356) {
      this.isMobileScreen = true;
    }

    if (window.innerWidth > 1356) {
      this.isNavClick = false;
    }

    this.authService.currentMessage.subscribe(message => this.message = message);

  }

  onNavBtnClick() {
    if (window.innerWidth < 1356) {
      this.isNavClick = !this.isNavClick;
      this.mobileMenuClick = !this.mobileMenuClick;
    }
  }

}
