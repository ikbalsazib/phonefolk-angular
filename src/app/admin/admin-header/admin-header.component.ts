import {Component, OnInit} from '@angular/core';
import {faArrowCircleLeft, faCog, faEnvelope, faFileAlt} from '@fortawesome/free-solid-svg-icons';
import {faBlog} from '@fortawesome/free-solid-svg-icons/faBlog';
import {faComments} from '@fortawesome/free-solid-svg-icons/faComments';
import {faChartBar} from '@fortawesome/free-solid-svg-icons/faChartBar';
import {faAngry} from '@fortawesome/free-solid-svg-icons/faAngry';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  // Font awesome Icons..
  faArrowCircleLeft = faArrowCircleLeft;
  faBlog = faBlog;
  faComments = faComments;
  faChartBar = faChartBar;
  faFileAlt = faFileAlt;
  faEnvelope = faEnvelope;
  faCog = faCog;
  faAngry = faAngry;

  // Sidebar Toggle Click..
  sidebarCollapse = false;
  collapseIconRotate = 0;

  // Main BootStrap Menu..
  mobileMenuClick = false;

  // CheckAuth..
  isUserAuthenticate = false;


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isUserAuthenticate = this.authService.getAuthStatus();
  }

  onClickLogOut() {
    this.authService.userLogOut();
  }

  onNavSideBtnClick() {
    this.sidebarCollapse = ! this.sidebarCollapse;
    if (this.sidebarCollapse) {
      this.collapseIconRotate = 180;
    } else {
      this.collapseIconRotate = 0;
    }
  }


  adminVisit() {
    this.authService.changeMessage('admin-visit');
    this.router.navigate(['our-blog']);
  }

  onClickMenu() {
    this.mobileMenuClick = ! this.mobileMenuClick;
  }
}
