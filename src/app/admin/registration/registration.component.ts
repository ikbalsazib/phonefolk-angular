import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  // For Spinner..
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmitRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.userRegistration(form.value.name, form.value.email, form.value.password);
    // console.log(form.value);
  }
}
