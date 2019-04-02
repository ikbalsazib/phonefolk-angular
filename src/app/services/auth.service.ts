import { Injectable } from '@angular/core';
import {UserModel} from '../admin/model/user.model';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

const AUTH_API_URL = environment.herokuNodeServerUrl + '/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuth = false;
  private authStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: number;
  // For Admin Visit Visit (Make New Header)..
  private messageSource = new BehaviorSubject('default');
  currentMessage = this.messageSource.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  // For Create User..
  userRegistration(name: string, email: string, password: string) {
    const userData: UserModel = {
      id: null,
      name: name,
      email: email,
      password: password
    };
    this.httpClient.put(AUTH_API_URL + 'signup', userData)
      .subscribe(response => {
        console.log(response);
        // Navigate..
        this.router.navigate(['pf-admin/dashboard']);
      }, error => {
        console.log(error);
      });
  }

  // For Login User..
  userLogin(email: string, password: string) {
    const userData: UserModel = {
      id: null,
      email: email,
      password: password,
      name: null
    };

    this.httpClient.post<{ token: string, expiredIn: number }>(AUTH_API_URL + 'signin', userData)
      .subscribe(response => {
        const getToken = response.token;
        this.token = getToken;
        // Make User Auth True..
        if (getToken) {
          this.isAuth = true;
          this.authStatusListener.next(true);
          // For Token Expired Time..
          const expiredInDuration = response.expiredIn;
          this.setAuthTimer(expiredInDuration);
          // Save Login Time & Expiration Time & Token to Local Storage..
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(getToken, expirationDate);
          this.saveAdminVisitKey();
          // Navigate..
          this.router.navigate(['pf-admin/dashboard']);
        }
      });
  }

  // That will Be Call First on Main App Component..
  autoAuthLoggedInUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expiredDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.authStatusListener.next(true);
      this.isAuth = true;
      this.setAuthTimer(expiresIn / 10000);
    }
  }

  // For Get Saved Visit Key for Admin Visit...
  autoLoggedInUserInfo() {
    const visitKey = this.getVisitKey();

    if (!visitKey) {
      return;
    }
    this.messageSource.next(visitKey);
  }

  // User LogOut..
  userLogOut() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    // Clear Token from Storage..
    this.clearAuthData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    this.messageSource.next('default');
    this.removeAdminVisitKey();
    // Navigate..
    this.router.navigate(['/']);
  }

  // For Set Time Duration in ms..
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.userLogOut();
    }, duration * 1000); // 1s = 1000ms
    console.log('Setting Time: ' + duration);
  }

  // For Save Token on Browser Storage..
  private saveAuthData(token: string, expiredDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiredDate.toISOString());
  }

  // For Clear Token on Browser Storage..
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  // Get Auth Data from Browser Storage..
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expiredDate: new Date(expirationDate)
    };
  }

  // For Get Login Token..
  getToken() {
    return this.token;
  }
  // For Get Auth status listener to Other..
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getAuthStatus() {
    return this.isAuth;
  }

  // For Admin Visit PhoneFolk..
  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  private saveAdminVisitKey() {
    localStorage.setItem('adminVisitKey', 'admin-visit');
  }

  private removeAdminVisitKey() {
    localStorage.removeItem('adminVisitKey');
  }

  private getVisitKey() {
    return localStorage.getItem('adminVisitKey');
  }


}
