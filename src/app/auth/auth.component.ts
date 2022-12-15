import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  inLoginMode = true;
  isLoading = false;
  // error: string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;  // finds the first occurrence of PlaceholderDirective
  closeSub: Subscription;

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
        // this.error = error.message;
        this.showErrorAlert(error.message);
        this.isLoading = false;
      }
    })

    authForm.reset();
  }

  // onHandleError() {
  //   this.error = null;
  // }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(errorMessage: string) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const component = hostViewContainerRef.createComponent(AlertComponent);

    component.instance.message = errorMessage;
    this.closeSub = component.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }
}
