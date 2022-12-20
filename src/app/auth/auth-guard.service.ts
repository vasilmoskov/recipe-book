import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {map, Observable, take, tap} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Store} from "@ngrx/store";

import * as fromApp from "../store/app.reducer";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    // private authService: AuthService,
              private store: Store<fromApp.AppState>,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      map(user => {
        let isAuthenticated = !!user;

        if (isAuthenticated) {
          return true;
        } else {
          return this.router.createUrlTree(['/auth']);
        }
      }),
      // tap(isAuthenticated => {
      //   if (!isAuthenticated) {
      //     return this.router.navigate(['/auth']);
      //   }
      // })
    )
  }
}
