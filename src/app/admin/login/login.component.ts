import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // For Spinner..
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmitLogin(form: NgForm) {
    this.isLoading = true;
    this.authService.userLogin(form.value.email, form.value.password);
  }
}
