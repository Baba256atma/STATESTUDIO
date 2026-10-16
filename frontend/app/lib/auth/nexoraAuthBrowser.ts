/**
 * HOSTED-MVP:1 — browser sign-in and sign-out through NextAuth's CSRF cookie.
 * Tokens and the session cookie stay on the HTTP response.
 */

export type NexoraSignInProvider = "github" | "nexora-dev";

async function csrfToken(): Promise<string | null> {
  const response = await fetch("/api/auth/csrf", { credentials: "same-origin" });
  if (!response.ok) return null;
  const body = (await response.json()) as { csrfToken?: unknown };
  return typeof body.csrfToken === "string" && body.csrfToken.length > 0 ? body.csrfToken : null;
}

export async function beginNexoraSignIn(input: {
  readonly provider: NexoraSignInProvider;
  readonly userId?: string;
}): Promise<{ ok: true } | { ok: false; reason: "failed" }> {
  const token = await csrfToken();
  if (!token || typeof window === "undefined") return { ok: false, reason: "failed" };
  const callbackUrl = "/executive";
  const endpoint = input.provider === "github"
    ? "/api/auth/signin/github"
    : "/api/auth/callback/nexora-dev";
  const body = new URLSearchParams({ csrfToken: token, callbackUrl, json: "true" });
  if (input.provider === "nexora-dev") body.set("userId", input.userId ?? "");
  const response = await fetch(endpoint, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = (await response.json().catch(() => null)) as { url?: unknown } | null;
  const destination = response.ok && typeof payload?.url === "string"
    ? safeAuthRedirect(payload.url, input.provider)
    : null;
  if (!destination) return { ok: false, reason: "failed" };
  window.location.assign(destination);
  return { ok: true };
}

function safeAuthRedirect(url: string, provider: NexoraSignInProvider): string | null {
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const parsed = new URL(url);
    if (typeof window !== "undefined" && parsed.origin === window.location.origin) return parsed.href;
    if (
      provider === "github" &&
      parsed.protocol === "https:" &&
      (parsed.hostname === "github.com" || parsed.hostname.endsWith(".github.com"))
    ) {
      return parsed.href;
    }
  } catch {
    return null;
  }
  return null;
}

export async function endNexoraSession(): Promise<void> {
  const token = await csrfToken();
  if (token) {
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken: token, callbackUrl: "/executive", json: "true" }),
    });
  }
  if (typeof window !== "undefined") window.location.assign("/executive");
}
