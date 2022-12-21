import {HttpClient} from "@angular/common/http";

import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, of, switchMap, tap} from "rxjs";

import {environment} from "../../../environments/environment";
import * as AuthActions from "./auth.actions";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthEffects {
  authLogin = createEffect(() => this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(respData => {
                const expirationDate = new Date(new Date().getTime() + +respData.expiresIn * 1000);

                return new AuthActions.Login({
                  email: respData.email,
                  id: respData.localId,
                  token: respData.idToken,
                  tokenExpirationDate: expirationDate
                })
              }
            ),
            catchError(errorResp => {
              let errorMessage = 'An unknown errorResp has occurred!'

              if (errorResp.error && errorResp.error.error) {
                switch (errorResp.error.error.message) {
                  case 'EMAIL_EXISTS':
                    errorMessage = 'This email address is already taken!'
                    break;
                  case 'EMAIL_NOT_FOUND':
                    errorMessage = 'Email not found!'
                    break;
                  case 'INVALID_PASSWORD':
                    errorMessage = 'Invalid password!'
                    break;
                }
              }

              return of(new AuthActions.LoginFail(errorMessage));
            })
          )
      })
    )
  );

  authSuccess = createEffect(() => this.actions$.pipe(
      ofType(AuthActions.LOGIN),
      tap(() => {
        this.router.navigate(['/'])
      })
    ),
    {dispatch: false}
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {
  }
}
