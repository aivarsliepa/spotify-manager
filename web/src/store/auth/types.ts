export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";

export interface AuthState {
  jwt: string;
  loggedIn: boolean;
}

interface LogInAction {
  type: typeof LOG_IN;
  payload: string;
}

interface LogOutAction {
  type: typeof LOG_OUT;
}

export type AuthActionTypes = LogInAction | LogOutAction;
