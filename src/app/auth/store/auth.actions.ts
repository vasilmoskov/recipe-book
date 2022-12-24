import {Action} from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const REGISTER_START = '[Auth] Register Start';
export const AUTH_SUCCESS = '[Auth] Success';
export const AUTH_FAIL = '[Auth] Fail';
export const LOGOUT = '[Auth] Logout';

export class AuthSuccess implements Action {
  readonly type = AUTH_SUCCESS;

  constructor(public payload: {
    email: string,
    id: string,
    token: string,
    tokenExpirationDate: Date
  }) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {email: string, password: string}) {
  }
}

export class AuthFail implements Action {
  readonly type = AUTH_FAIL;

  constructor(public payload: string) {
  }
}

export class RegisterStart implements Action {
  readonly type = REGISTER_START;

  constructor(public payload: {email: string, password: string}) {
  }
}


export type AuthActions = AuthSuccess | Logout | LoginStart | AuthFail | RegisterStart;
