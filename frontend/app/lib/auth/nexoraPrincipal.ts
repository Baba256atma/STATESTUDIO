/**
 * HOSTED-MVP:1 — authenticated principal.
 *
 * userId is the only identity field. It is not an email, company id,
 * workspace id, entrance session, or caller-supplied request user_id.
 */

export const nexoraPrincipalIdentity = "HOSTED-MVP:1/NexoraPrincipal" as const;

export type NexoraPrincipal = Readonly<{
  userId: string;
}>;

export type NexoraClientSessionProjection = Readonly<{
  authenticated: boolean;
  userId: string | null;
  displayLabel: string | null;
}>;

export const ANONYMOUS_NEXORA_SESSION: NexoraClientSessionProjection = Object.freeze({
  authenticated: false,
  userId: null,
  displayLabel: null,
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
  const userId = (record.user as { id?: unknown }).id;
  if (typeof userId !== "string" || !STABLE_USER_ID.test(userId) || userId.includes("@")) {
    return null;
  }
  return Object.freeze({ userId });
}

export function projectNexoraClientSession(
  principal: NexoraPrincipal | null,
): NexoraClientSessionProjection {
  if (!principal) return ANONYMOUS_NEXORA_SESSION;
  return Object.freeze({
    authenticated: true,
    userId: principal.userId,
    displayLabel: "Signed in",
  });
}
