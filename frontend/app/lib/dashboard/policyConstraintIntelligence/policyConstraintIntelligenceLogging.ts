/**
 * Phase 6:3 — Policy & Constraint Intelligence logging.
 */

import type {
  PolicyConstraintIntelligenceSnapshot,
  PolicyConstraintIntelligenceSurfaceModel,
} from "./policyConstraintIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportPolicyIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `policy:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][PolicyIntelligence]", detail);
}

export function reportPolicyAlignment(
  alignment: PolicyConstraintIntelligenceSnapshot["policyAlignment"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `alignment:${alignment.alignment}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][PolicyAlignment]", alignment);
}

export function reportPolicyImpact(impact: PolicyConstraintIntelligenceSnapshot["policyImpact"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `impact:${impact.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][PolicyImpact]", impact);
}

export function reportResourceConstraint(
  constraints: PolicyConstraintIntelligenceSnapshot["resourceConstraints"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `resource:${constraints.constraints.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ResourceConstraint]", constraints);
}

export function reportOperationalConstraint(
  constraints: PolicyConstraintIntelligenceSnapshot["operationalConstraints"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `operational:${constraints.constraints.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][OperationalConstraint]", constraints);
}

export function reportGovernanceConstraint(
  constraints: PolicyConstraintIntelligenceSnapshot["governanceConstraints"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `governance:${constraints.constraints.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GovernanceConstraint]", constraints);
}

export function reportConstraintSeverity(
  severity: PolicyConstraintIntelligenceSnapshot["constraintSeverity"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `severity:${severity.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConstraintSeverity]", severity);
}

export function reportPolicyAttention(
  attention: PolicyConstraintIntelligenceSnapshot["policyAttention"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `attention:${attention.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][PolicyAttention]", attention);
}

export function reportPolicyConstraintIntelligenceSurface(
  model: PolicyConstraintIntelligenceSurfaceModel
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.snapshot.policyAlignment.alignment}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][PolicyIntelligence]", {
    surfaceId: model.surfaceId,
    alignment: model.snapshot.policyAlignment.alignment,
    severity: model.snapshot.constraintSeverity.level,
  });
}

export function resetPolicyConstraintIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
