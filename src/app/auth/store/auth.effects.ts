import {HttpClient} from "@angular/common/http";

import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, of, switchMap, tap} from "rxjs";

import {environment} from "../../../environments/environment";
import * as AuthActions from "./auth.actions";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../user.model";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string
  expiresIn: string,
  localId: string,
  registered?: boolean
}

const handleAuthenticate = (email: string, localId: string, idToken: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  const user = new User(email, localId, idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthSuccess({
    email: email,
    id: localId,
    token: idToken,
    tokenExpirationDate: expirationDate
  })
}

const handleError = (errorResponse) => {
  let errorMessage = 'An unknown errorResp has occurred!'

  if (errorResponse.error && errorResponse.error.error) {
    switch (errorResponse.error.error.message) {
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

  return of(new AuthActions.AuthFail(errorMessage));
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
                return handleAuthenticate(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
              }
            ),
            catchError(errorResp => {
              return handleError(errorResp);
            })
          )
      })
    )
  );

  authRedirect = createEffect(() => this.actions$.pipe(
      ofType(AuthActions.AUTH_SUCCESS, AuthActions.LOGOUT),
      tap(() => {
        this.router.navigate(['/'])
      })
    ),
    {dispatch: false}
  );

  authLogout = createEffect(() => this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        localStorage.removeItem('userData');
      }),
    ),
    {dispatch: false}
  )

  authRegister = createEffect(() => this.actions$.pipe(
      ofType(AuthActions.REGISTER_START),
      switchMap((authData: AuthActions.RegisterStart) => {
          return this.http
            .post<AuthResponseData>(
              'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
              {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
              }
            )
            .pipe(
              map(respData => {
                return handleAuthenticate(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
              }),
              catchError(errorResp => {
                return handleError(errorResp);
              })
            )
        }
      )
    )
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {
  }
}
