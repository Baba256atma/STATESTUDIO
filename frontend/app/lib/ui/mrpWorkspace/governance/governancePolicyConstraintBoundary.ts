/**
 * MRP:5B:3 — Policy & Constraint intelligence boundary.
 *
 * Governance intelligence is read-only — no Timeline or Scenario writes.
 */

import {
  GOVERNANCE_POLICY_INTELLIGENCE_TAG,
  type GovernancePolicyConstraintBoundaryResult,
  type GovernancePolicyConstraintForbiddenAction,
} from "./governancePolicyConstraintIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function guardGovernancePolicyConstraintForbiddenAction(input: {
  action: GovernancePolicyConstraintForbiddenAction;
  source?: string | null;
}): GovernancePolicyConstraintBoundaryResult {
  const result = Object.freeze({
    allowed: false,
    tag: GOVERNANCE_POLICY_INTELLIGENCE_TAG,
    reason:
      input.action === "write_timeline"
        ? "Governance policy intelligence does not write to Timeline."
        : input.action === "write_scenario"
          ? "Governance constraint intelligence does not write to Scenario."
          : "Governance intelligence has no execution authority.",
    action: input.action,
  });

  if (isDev()) {
    const key = `${input.action}:${input.source ?? "unknown"}`;
    if (!loggedKeys.has(key)) {
      loggedKeys.add(key);
      globalThis.console?.debug?.(GOVERNANCE_POLICY_INTELLIGENCE_TAG, {
        action: "governance_policy_constraint_boundary_blocked",
        governanceAction: input.action,
        source: input.source ?? null,
      });
    }
  }

  return result;
}

export function resetGovernancePolicyConstraintBoundaryForTests(): void {
  loggedKeys.clear();
}
