import { UserDocument } from "../../data/User";

declare global {
  namespace Express {
    export interface User extends UserDocument {}
  }
}
