import type { User } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  export interface User {
    id: string;
    name: string;
    email: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    token: string;
  }
}
