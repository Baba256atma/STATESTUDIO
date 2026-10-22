/**
 * HOSTED-MVP:1 — NextAuth session configuration.
 *
 * The browser session lives here. FastAPI does not authenticate it.
 * FastAPI remains untrusted until HOSTED-MVP:2 closes or unmounts it.
 * No credential hash store, no session-token database, no adapter.
 */

import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

import {
  devUserAllowed,
  selectNexoraAuthProvider,
  stableProviderUserId,
} from "./nexoraAuthProviders.ts";
import {
  safePrincipalEmail,
  safePrincipalImage,
  safePrincipalName,
} from "./nexoraPrincipal.ts";

function activeProvider() {
  const selected = selectNexoraAuthProvider(process.env, process.env.NODE_ENV);
  if (selected === "github") {
    return GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    });
  }
  if (selected === "nexora-dev") {
    return Credentials({
      id: "nexora-dev",
      name: "Nexora development",
      credentials: {
        userId: { label: "Development user", type: "text" },
      },
      async authorize(credentials) {
        const userId = credentials?.userId;
        if (typeof userId !== "string" || !devUserAllowed(userId, process.env)) return null;
        return { id: userId, name: "Signed in" };
      },
    });
  }
  return Credentials({
    id: "nexora-closed",
    name: "Unavailable",
    credentials: {},
    async authorize() {
      return null;
    },
  });
}

export const nexoraAuthOptions: NextAuthOptions = {
  providers: [activeProvider()],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  pages: { error: "/executive" },
  logger: {
    error(code) {
      console.error(`nexora_auth_error code=${code}`);
    },
    warn(code) {
      console.warn(`nexora_auth_warn code=${code}`);
    },
    debug() {
      // Provider metadata can contain tokens. Do not log it.
    },
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      const provider = account?.provider === "github" || account?.provider === "nexora-dev"
        ? account.provider
        : null;
      const profileRecord = profile && typeof profile === "object"
        ? profile as { name?: unknown; email?: unknown; avatar_url?: unknown }
        : {};
      const rawId = provider === "github"
        ? account?.providerAccountId
        : provider === "nexora-dev"
          ? user?.id
          : null;
      const stable = provider && typeof rawId === "string"
        ? stableProviderUserId(provider, rawId)
        : null;
      if (stable && account) {
        token.sub = stable;
        const name = safePrincipalName(user?.name ?? profileRecord.name);
        const email = safePrincipalEmail(user?.email ?? profileRecord.email);
        const image = safePrincipalImage(user?.image ?? profileRecord.avatar_url);
        if (name) token.nexoraName = name;
        else delete token.nexoraName;
        if (email) token.nexoraEmail = email;
        else delete token.nexoraEmail;
        if (image) token.nexoraImage = image;
        else delete token.nexoraImage;
      }
      delete token.email;
      delete token.name;
      delete token.picture;
      delete token.accessToken;
      delete token.refreshToken;
      return token;
    },
    async session({ session, token }) {
      const userId = typeof token.sub === "string" ? token.sub : "";
      return {
        ...session,
        user: {
          id: userId,
          name: typeof token.nexoraName === "string" ? token.nexoraName : null,
          email: typeof token.nexoraEmail === "string" ? token.nexoraEmail : null,
          image: typeof token.nexoraImage === "string" ? token.nexoraImage : null,
        },
      };
    },
  },
};
