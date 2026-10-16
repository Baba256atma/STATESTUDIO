/**
 * HOSTED-MVP:1 — exactly one NextAuth provider can create a session.
 *
 * Production uses GitHub OAuth through NextAuth.
 * Development may use a non-password allowlist sign-in.
 * A production https origin omits that provider.
 * A local http://127.0.0.1 or http://localhost origin may still use it.
 */

export type NexoraAuthProviderId = "github" | "nexora-dev" | "none";

export function productionAuthOriginReady(
  env: Readonly<Record<string, string | undefined>>,
  nodeEnv: string | undefined,
): boolean {
  if (nodeEnv !== "production") return true;
  const url = env.NEXTAUTH_URL?.trim() ?? "";
  if (!url.startsWith("https://")) return false;
  try {
    const host = new URL(url).hostname;
    return host !== "localhost" && host !== "127.0.0.1";
  } catch {
    return false;
  }
}

export function devSignInEnabled(
  env: Readonly<Record<string, string | undefined>>,
  nodeEnv: string | undefined,
): boolean {
  if (env.NEXORA_AUTH_DEV_SIGN_IN !== "true") return false;
  if (nodeEnv !== "production") return true;
  const url = env.NEXTAUTH_URL?.trim() ?? "";
  return url.startsWith("http://127.0.0.1") || url.startsWith("http://localhost");
}

export function devUserAllowed(
  userId: string,
  env: Readonly<Record<string, string | undefined>>,
): boolean {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,64}$/.test(userId) || userId.includes("@")) return false;
  const allowed = (env.NEXORA_AUTH_DEV_USER_IDS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  return allowed.includes(userId);
}

export function selectNexoraAuthProvider(
  env: Readonly<Record<string, string | undefined>>,
  nodeEnv: string | undefined,
): NexoraAuthProviderId {
  if (devSignInEnabled(env, nodeEnv)) return "nexora-dev";
  if (!productionAuthOriginReady(env, nodeEnv)) return "none";
  if (env.GITHUB_ID?.trim() && env.GITHUB_SECRET?.trim()) return "github";
  return "none";
}

export function stableProviderUserId(
  provider: NexoraAuthProviderId,
  rawId: string,
): string | null {
  if (provider === "github" && /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(rawId)) {
    return `github:${rawId}`;
  }
  if (provider === "nexora-dev" && /^[A-Za-z0-9][A-Za-z0-9._-]{0,64}$/.test(rawId)) {
    return `dev:${rawId}`;
  }
  return null;
}
