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
  error: string = null;

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
        .subscribe({
            next: respData => {
              console.log(respData);
              this.isLoading = false;
            },
            error: error => {
              this.error = error.message;
              this.isLoading = false;
            }
          }
        );
    }

    authForm.reset();
  }
}
