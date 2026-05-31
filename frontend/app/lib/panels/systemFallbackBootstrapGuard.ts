/**
 * E2:75 — System fallback is bootstrap-only once workspace authority is stable.
 */

import { buildAuthorityStateSignature, type AuthorityStateInput } from "./authorityStateSignature";

export type SystemFallbackBootstrapInput = {
  view: string | null;
  panelId?: string | null;
  contextId?: string | null;
  selectedObjectId?: string | null;
  isOpen?: boolean;
  contractValid?: boolean;
  reason?: string | null;
  /** True when recovering from an invalid / missing route. */
  invalidRouteRecovery?: boolean;
};

export type SystemFallbackBootstrapDecision = {
  allow: boolean;
  rejectReason?: "workspace_initialized" | "stable_dashboard" | "stable_authority" | "stable_contract";
};

let workspaceInitialized = false;
let lastStableAuthoritySignature: string | null = null;
const completedBootstrapReasons = new Set<string>();

function isMissingPanelState(input: SystemFallbackBootstrapInput): boolean {
  return !input.view || String(input.view).trim().length === 0;
}

function isStableDashboardState(input: SystemFallbackBootstrapInput): boolean {
  return (
    input.view === "dashboard" &&
    (input.contextId ?? null) == null &&
    input.isOpen === true &&
    input.contractValid !== false
  );
}

export function markWorkspaceInitialized(authoritySignature?: string | null): void {
  workspaceInitialized = true;
  if (authoritySignature) {
    lastStableAuthoritySignature = authoritySignature;
  }
}

export function isWorkspaceAlreadyInitialized(): boolean {
  return workspaceInitialized;
}

export function markSystemFallbackBootstrapComplete(reason: string): void {
  completedBootstrapReasons.add(reason);
  workspaceInitialized = true;
}

export function hasCompletedBootstrapReason(reason: string): boolean {
  return completedBootstrapReasons.has(reason);
}

export function resetSystemFallbackBootstrapGuardForTests(): void {
  workspaceInitialized = false;
  lastStableAuthoritySignature = null;
  completedBootstrapReasons.clear();
}

export function evaluateSystemFallbackBootstrap(
  input: SystemFallbackBootstrapInput
): SystemFallbackBootstrapDecision {
  if (input.invalidRouteRecovery === true || isMissingPanelState(input)) {
    return { allow: true };
  }

  const authoritySignature = buildAuthorityStateSignature({
    view: input.view ?? null,
    panelId: input.panelId ?? input.view ?? null,
    contextId: input.contextId ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    authoritySource: "system_fallback",
    isOpen: input.isOpen,
  });

  if (isStableDashboardState(input)) {
    markWorkspaceInitialized(authoritySignature);
    return { allow: false, rejectReason: "stable_dashboard" };
  }

  if (workspaceInitialized && lastStableAuthoritySignature === authoritySignature && input.contractValid !== false) {
    return { allow: false, rejectReason: "stable_authority" };
  }

  if (workspaceInitialized && input.contractValid === true && input.isOpen === true && input.view) {
    return { allow: false, rejectReason: "stable_contract" };
  }

  if (workspaceInitialized && isStableDashboardState({ ...input, isOpen: true })) {
    return { allow: false, rejectReason: "workspace_initialized" };
  }

  return { allow: true };
}

export function shouldRejectSystemFallbackInStableState(
  prev: AuthorityStateInput,
  next: AuthorityStateInput,
  bootstrap: SystemFallbackBootstrapInput
): SystemFallbackBootstrapDecision {
  if (next.authoritySource !== "system_fallback") {
    return { allow: true };
  }
  return evaluateSystemFallbackBootstrap({
    view: next.view,
    panelId: next.panelId,
    contextId: next.contextId,
    selectedObjectId: next.selectedObjectId ?? prev.selectedObjectId ?? null,
    isOpen: next.isOpen,
    contractValid: bootstrap.contractValid,
    reason: bootstrap.reason ?? null,
    invalidRouteRecovery: bootstrap.invalidRouteRecovery,
  });
}
