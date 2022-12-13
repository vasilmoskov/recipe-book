import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

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
        catchError(errorResp => {
          let errorMessage = 'An unknown error occurred!'

          if (errorResp.error && errorResp.error.error) {
            switch (errorResp.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'This email address is already taken!'
                break;
            }
          }

          return throwError(() => new Error(errorMessage));
        })
      )
  }

  login(email: string, password: string) {
    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCl_FzykStYAFT1IFNPCrKQuFyjvEQK5bI',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(errorResp => {
          let errorMessage = 'An unknown errorResp has occurred!'
          console.log(errorResp);

          if (errorResp.error && errorResp.error.error) {
            switch (errorResp.error.error.message) {
              case 'EMAIL_NOT_FOUND':
                errorMessage = `User with email ${email} is not found!`
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'Invalid password!'
                break;
            }
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
