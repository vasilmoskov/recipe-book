import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  inLoginMode = true;
  isLoading = false;

  constructor(private authService: AuthService) {
  }

  onSwitchMode() {
    this.inLoginMode = !this.inLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;

    this.isLoading = true;

    if (this.inLoginMode) {

    } else {
      this.authService.register(email, password)
        .subscribe(
          respData => {
            console.log(respData);
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            console.log(error)
          }
        );
    }

    authForm.reset();
  }
}
