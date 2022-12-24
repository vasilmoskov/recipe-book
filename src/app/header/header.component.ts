import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {DataStorageService} from "../shared/data-storage.service";
import {map, Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {Store} from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageSerice: DataStorageService, private authService: AuthService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
      .pipe(
        map(authState => authState.user)
      )
      .subscribe(user => this.isAuthenticated = !!user);
    // this.userSub = this.authService.user.subscribe(user => this.isAuthenticated = !!user);
  }

  onSaveData() {
    this.dataStorageSerice.storeRecipes();
  }

  onFetchData() {
    this.dataStorageSerice.fetchRecipes().subscribe();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
    // this.authService.logout();
  }
}
