import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, Subject, tap, throwError} from "rxjs";
import {User} from "./user.model";

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

  constructor(private http: HttpClient) {
  }

  register(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCl_FzykStYAFT1IFNPCrKQuFyjvEQK5bI',
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
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCl_FzykStYAFT1IFNPCrKQuFyjvEQK5bI',
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
    this.user.next(user);
  }
}