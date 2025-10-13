import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      username?: string;
      createdAt?: string;
      lastLogin?: string;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string;
  }
}
