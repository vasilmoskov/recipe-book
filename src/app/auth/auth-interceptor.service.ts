import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {exhaustMap, map, Observable, take} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Store} from "@ngrx/store";

import * as fromApp from "../store/app.reducer";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      exhaustMap(
        user => {
          if (!user) {
            return next.handle(req);
          }

          const modifiedRequest = req.clone({
            params: req.params.append('auth', user.token)
          })

          return next.handle(modifiedRequest);
        }
      )
    )
  }
}
