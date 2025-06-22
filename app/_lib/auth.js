import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createCustomer, getCustomer } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getCustomer(user.email);

        if (!existingGuest)
          await createCustomer({ email: user.email, fullName: user.name });

        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      const customer = await getCustomer(session.user.email);
      session.user.customerId = customer.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
