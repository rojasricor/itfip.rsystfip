import * as bcryptHelper from "@/helpers/bcrypt.helper";
import type { IUser } from "@/interfaces";
import { UserService } from "@/services/backend";
import { authSchema } from "@/validation/schemas";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      id: "rsystfip-credentials",
      name: "RSystfip Credentials",
      type: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Put your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Put your password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Bad credentials");
        }

        const { username, password } = credentials;

        const { error, value } = authSchema.validate({ username, password });
        if (error) {
          throw new Error(error.message);
        }

        const domain = "@itfip.edu.co";

        const userFound = await UserService.getUser(
          undefined,
          value.username.includes(domain)
            ? value.username
            : `${value.username}${domain}`
        );
        if (!userFound) {
          throw new Error("Bad credentials");
        }

        const passwordVerified = await bcryptHelper.verifyPassword(
          value.password,
          userFound.password!
        );
        if (!passwordVerified) {
          throw new Error("Bad credentials");
        }

        return {
          id: `${userFound.id}`,
          first_name: userFound.first_name,
          last_name: userFound.last_name,
          gender: userFound.gender,
          email: userFound.email,
          role_name: userFound.role_name,
          permissions: userFound.permissions,
        };
      },
    }),
  ],
  theme: {
    colorScheme: "dark",
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    session({ session, token }) {
      if (token.user) {
        session.user = token.user as IUser;
      }

      return session;
    },
  },
};

export default authOptions;
