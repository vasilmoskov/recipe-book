import {User} from "../user.model";

import * as AuthActions from "./auth.actions";

export interface State {
  user: User;
  isLoading: boolean
  authError: string
}

const initialState: State = {
  user: null,
  isLoading: false,
  authError: null
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        authError: null
      }

    case AuthActions.AUTH_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.id,
        action.payload.token,
        action.payload.tokenExpirationDate
      );

      return {
        ...state,
        isLoading: false,
        authError: null,
        user: user
      };

    case AuthActions.AUTH_FAIL:
      return {
        ...state,
        isLoading: false,
        user: null,
        authError: action.payload
      }

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };

    default:
      return state
  }
}
