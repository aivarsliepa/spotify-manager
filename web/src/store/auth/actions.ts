import { AuthActionTypes, LOG_OUT, LOG_IN } from "./types";

export const logIn = (jwt: string): AuthActionTypes => ({
  type: LOG_IN,
  payload: jwt
});

export const logout = (): AuthActionTypes => ({ type: LOG_OUT });
