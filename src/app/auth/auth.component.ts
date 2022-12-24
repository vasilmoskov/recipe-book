import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";
import {Store} from "@ngrx/store";

import * as AuthActions from "./store/auth.actions";
import * as fromApp from "../store/app.reducer";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  inLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;  // finds the first occurrence of PlaceholderDirective
  closeSub: Subscription;
  private storeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authData => {
      this.isLoading = authData.isLoading;
      this.error = authData.authError;

      if (this.error) {
        this.showErrorAlert(this.error);
      }
    })
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
      this.store.dispatch(new AuthActions.LoginStart({email, password}));
    } else {
      this.store.dispatch(new AuthActions.RegisterStart({email, password}));
    }

    authForm.reset();
  }

  onHandleError() {
    // this.error = null;
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

    if (this.storeSub) {
      this.storeSub.unsubscribe();
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
