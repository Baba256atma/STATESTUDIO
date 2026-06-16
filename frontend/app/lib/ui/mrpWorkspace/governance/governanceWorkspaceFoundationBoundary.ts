/**
 * MRP:5B:1 — Governance workspace foundation boundary.
 *
 * Governance does NOT generate forecasts, create scenarios, execute decisions,
 * replace Advisory, or replace War Room.
 */

import { GOVERNANCE_FOUNDATION_TAG } from "./governanceWorkspaceContract.ts";

export type GovernanceFoundationForbiddenAction =
  | "generate_forecast"
  | "create_scenario"
  | "execute_decision"
  | "replace_advisory"
  | "replace_war_room"
  | "scene_write"
  | "object_mutation";

export type GovernanceFoundationBoundaryResult = Readonly<{
  allowed: boolean;
  tag: typeof GOVERNANCE_FOUNDATION_TAG;
  reason: string;
  action: GovernanceFoundationForbiddenAction;
}>;

const loggedKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function guardGovernanceFoundationForbiddenAction(input: {
  action: GovernanceFoundationForbiddenAction;
  source?: string | null;
}): GovernanceFoundationBoundaryResult {
  const result = Object.freeze({
    allowed: false,
    tag: GOVERNANCE_FOUNDATION_TAG,
    reason:
      input.action === "replace_advisory"
        ? "Governance reviews compliance — Advisory owns recommendations."
        : input.action === "replace_war_room"
          ? "Governance reviews compliance — War Room owns commitment."
          : input.action === "generate_forecast"
            ? "Governance does not generate forecasts."
            : input.action === "create_scenario"
              ? "Governance does not create scenarios."
              : input.action === "execute_decision"
                ? "Governance does not execute decisions."
                : input.action === "scene_write"
                  ? "Governance foundation forbids scene writes."
                  : "Governance foundation forbids object mutation.",
    action: input.action,
  });

  if (isDev()) {
    const key = `${input.action}:${input.source ?? "unknown"}`;
    if (!loggedKeys.has(key)) {
      loggedKeys.add(key);
      globalThis.console?.debug?.(GOVERNANCE_FOUNDATION_TAG, {
        action: "governance_foundation_boundary_blocked",
        governanceAction: input.action,
        source: input.source ?? null,
      });
    }
  }

  return result;
}

export function traceGovernanceFoundationBoundaryOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  const key = `boundary:${mountKey ?? "default"}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_FOUNDATION_TAG, {
    action: "governance_foundation_boundary_active",
    mountKey: mountKey ?? null,
    ownsGovernanceReviewOnly: true,
  });
}

export function resetGovernanceWorkspaceFoundationBoundaryForTests(): void {
  loggedKeys.clear();
}
