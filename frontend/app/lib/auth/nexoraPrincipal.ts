/**
 * HOSTED-MVP:1 — authenticated principal.
 *
 * userId is the only identity field. It is not an email, company id,
 * workspace id, entrance session, or caller-supplied request user_id.
 */

export const nexoraPrincipalIdentity = "HOSTED-MVP:1/NexoraPrincipal" as const;

export type NexoraPrincipalProvider = "github" | "nexora-dev";

/**
 * userId is the ownership identity. name, email, and image are display-only.
 * provider is derived from the userId prefix, never from a client claim.
 */
export type NexoraPrincipal = Readonly<{
  userId: string;
  provider?: NexoraPrincipalProvider;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}>;

export type NexoraClientSessionProjection = Readonly<{
  authenticated: boolean;
  userId: string | null;
  displayLabel: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  provider: NexoraPrincipalProvider | null;
}>;

export const ANONYMOUS_NEXORA_SESSION: NexoraClientSessionProjection = Object.freeze({
  authenticated: false,
  userId: null,
  displayLabel: null,
  name: null,
  email: null,
  image: null,
  provider: null,
});

/** Fields that must not be treated as the authenticated principal. */
export const NON_AUTHORITATIVE_IDENTITY_FIELDS = Object.freeze([
  "fastapi.request.user_id",
  "localStorage:nexora.company_id",
  "NEXT_PUBLIC_COMPANY_ID",
  "sessionStorage:nexora.entrance.identity.session.v1",
  "workspaceId",
  "organizationId",
  "tenantId",
] as const);

const STABLE_USER_ID = /^(github|dev):[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export function safePrincipalName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 120 || /[\u0000-\u001f]/.test(trimmed)) return null;
  return trimmed;
}

export function safePrincipalEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  return trimmed;
}

/** Avatar URLs are display-only and must be https with no embedded credentials. */
export function safePrincipalImage(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 500) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

function providerFromUserId(userId: string): NexoraPrincipalProvider | null {
  if (userId.startsWith("github:")) return "github";
  if (userId.startsWith("dev:")) return "nexora-dev";
  return null;
}

export function projectNexoraPrincipal(
  session: unknown,
  now = Date.now(),
): NexoraPrincipal | null {
  if (!session || typeof session !== "object") return null;
  const record = session as { expires?: unknown; user?: unknown };
  if (typeof record.expires === "string") {
    const expiresAt = Date.parse(record.expires);
    if (!Number.isFinite(expiresAt) || expiresAt <= now) return null;
  }
  if (!record.user || typeof record.user !== "object") return null;
  const user = record.user as { id?: unknown; name?: unknown; email?: unknown; image?: unknown };
  const userId = user.id;
  if (typeof userId !== "string" || !STABLE_USER_ID.test(userId) || userId.includes("@")) {
    return null;
  }
  const provider = providerFromUserId(userId);
  if (!provider) return null;
  return Object.freeze({
    userId,
    provider,
    name: safePrincipalName(user.name),
    email: safePrincipalEmail(user.email),
    image: safePrincipalImage(user.image),
  });
}

export function projectNexoraClientSession(
  principal: NexoraPrincipal | null,
): NexoraClientSessionProjection {
  if (!principal) return ANONYMOUS_NEXORA_SESSION;
  const name = principal.name ?? null;
  const email = principal.email ?? null;
  return Object.freeze({
    authenticated: true,
    userId: principal.userId,
    displayLabel: name ?? email ?? "Signed in",
    name,
    email,
    image: principal.image ?? null,
    provider: principal.provider ?? providerFromUserId(principal.userId),
  });
}
