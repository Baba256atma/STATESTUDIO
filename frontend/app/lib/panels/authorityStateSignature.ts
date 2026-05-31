/**
 * E2:75 — Stable authority commit signatures (excludes timestamp / volatile fields).
 */

export type AuthorityStateInput = {
  view: string | null;
  panelId?: string | null;
  contextId?: string | null;
  selectedObjectId?: string | null;
  mode?: string | null;
  authoritySource: string;
  isOpen?: boolean;
};

export function buildAuthorityStateSignature(input: AuthorityStateInput): string {
  return JSON.stringify({
    view: input.view ?? null,
    panelId: input.panelId ?? input.view ?? null,
    contextId: input.contextId ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    mode: input.mode ?? null,
    authoritySource: input.authoritySource ?? "system_fallback",
    isOpen: input.isOpen ?? true,
  });
}

export function areAuthorityStateSignaturesEqual(prev: AuthorityStateInput, next: AuthorityStateInput): boolean {
  return buildAuthorityStateSignature(prev) === buildAuthorityStateSignature(next);
}

export function shouldCommitAuthorityState(prev: AuthorityStateInput, next: AuthorityStateInput): boolean {
  return !areAuthorityStateSignaturesEqual(prev, next);
}

export function isDashboardAuthorityNoOp(prev: AuthorityStateInput, next: AuthorityStateInput): boolean {
  return (
    prev.view === "dashboard" &&
    next.view === "dashboard" &&
    (prev.panelId ?? prev.view) === (next.panelId ?? next.view) &&
    (prev.contextId ?? null) === (next.contextId ?? null) &&
    (prev.selectedObjectId ?? null) === (next.selectedObjectId ?? null) &&
    (prev.isOpen ?? true) === (next.isOpen ?? true)
  );
}
