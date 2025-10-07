import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { ObjectId } from "mongodb";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("crypto-investment");

        const user = await db.collection("users").findOne({ email: credentials?.email });
        console.log("Fetched user from DB:", user);

        if (!user) throw new Error("No user found with this email");

        const isValid = await compare(credentials!.password, user.passwordHash);
        if (!isValid) throw new Error("Invalid password");

        // Update lastLogin timestamp
        await db.collection("users").updateOne(
          { _id: user._id },
          { $set: { lastLogin: new Date() } }
        );

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      },
    }),
  ],

  callbacks: {
    // 🔹 Prevent redirect loops
    async redirect({ url, baseUrl }) {
      try {
        // Prevent looping to /auth/login again
        if (url.includes("/auth/login")) {
          return `${baseUrl}/user-dashboard/dashboard`;
        }

        // Allow only internal redirects or fully qualified URLs
        if (url.startsWith(baseUrl) || url.startsWith("/")) {
          return url.startsWith("/") ? `${baseUrl}${url}` : url;
        }

        // Default fallback
        return baseUrl;
      } catch (err) {
        console.error("Redirect error:", err);
        return baseUrl;
      }
    },

    // 🔹 Persist ID and role in JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        (token as any).role = (user as any).role;
      }
      return token;
    },

    // 🔹 Enrich session from DB
    async session({ session, token }) {
      if (token) {
        try {
          const client = await clientPromise;
          const db = client.db("crypto-investment");
          const dbUser = await db
            .collection("users")
            .findOne({ _id: new ObjectId(token.id as string) });

          session.user = {
            ...session.user,
            id: token.id as string,
            role: (token as any).role as string,
            name: dbUser?.name ?? session.user?.name,
            email: dbUser?.email ?? session.user?.email,
            username: dbUser?.username || undefined,
            createdAt: dbUser?.createdAt
              ? new Date(dbUser.createdAt).toISOString()
              : undefined,
            lastLogin: dbUser?.lastLogin
              ? new Date(dbUser.lastLogin).toISOString()
              : undefined,
            avatar: dbUser?.avatar || undefined,
          } as any;
        } catch (e) {
          console.error("Session enrichment failed:", e);
          session.user = {
            ...session.user,
            id: token.id as string,
            role: (token as any).role as string,
          } as any;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
