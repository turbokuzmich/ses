import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema, signUpSchema } from "../schemas";
import * as api from "../api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        type: {},
        login: {},
        nickname: {},
        password: {},
      },
      authorize(credentials) {
        if (credentials.type === "signin") {
          const result = signInSchema.safeParse(credentials);

          if (result.success) {
            return api.signIn(result.data);
          }
        }
        if (credentials.type === "signup") {
          const result = signUpSchema.safeParse(credentials);

          if (result.success) {
            return api.signUp(result.data);
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "signIn") {
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub ?? "0";
      session.user.token = token.token;

      return session;
    },
  },
});
