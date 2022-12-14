import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  inLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {
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

    let authObs: Observable<AuthResponseData>;

    if (this.inLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs= this.authService.register(email, password);
    }

    authObs.subscribe({
      next: respData => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: error => {
        this.error = error.message;
        this.isLoading = false;
      }
    })

    authForm.reset();
  }
}
