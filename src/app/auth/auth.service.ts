import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Store} from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {
  }

  register(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(respData => this.handleAuthentication(respData))
      )
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(respData => this.handleAuthentication(respData))
      );
  }

  logout() {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this.store.dispatch(new AuthActions.Login({
        email: loadedUser.email,
        id: loadedUser.id,
        token: loadedUser.token,
        tokenExpirationDate: new Date(userData._tokenExpirationDate)
      }))
      this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

  private handleError(errorResp) {
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

    return throwError(() => new Error(errorMessage));
  }

  private handleAuthentication(respData) {
    const expirationDate = new Date(new Date().getTime() + +respData.expiresIn * 1000);
    const user = new User(respData.email, respData.localId, respData.idToken, expirationDate);
    // this.user.next(user);
    this.store.dispatch(new AuthActions.Login({
      email: respData.email,
      id: respData.localId,
      token: respData.idToken,
      tokenExpirationDate: expirationDate
    }));
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(+respData.expiresIn * 1000);
  }
}
