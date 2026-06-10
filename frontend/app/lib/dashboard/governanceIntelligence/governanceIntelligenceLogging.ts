/**
 * Phase 6:1 — Governance Intelligence logging.
 */

import type {
  GovernanceIntelligenceSnapshot,
  GovernanceIntelligenceSurfaceModel,
} from "./governanceIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportGovernanceIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `governance:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GovernanceIntelligence]", detail);
}

export function reportGovernanceAlignment(
  alignment: GovernanceIntelligenceSnapshot["governanceAlignment"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `alignment:${alignment.alignment}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GovernanceAlignment]", alignment);
}

export function reportPolicyAwareness(policy: GovernanceIntelligenceSnapshot["policyAwareness"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `policy:${policy.reviewStatus}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][PolicyAwareness]", policy);
}

export function reportConstraintAwareness(
  constraints: GovernanceIntelligenceSnapshot["constraintAwareness"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `constraint:${constraints.constraints.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConstraintAwareness]", constraints);
}

export function reportStakeholderImpact(
  stakeholders: GovernanceIntelligenceSnapshot["stakeholderImpact"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `stakeholder:${stakeholders.stakeholders.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderImpact]", stakeholders);
}

export function reportAccountabilityContext(
  accountability: GovernanceIntelligenceSnapshot["accountabilityContext"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `accountability:${accountability.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AccountabilityContext]", accountability);
}

export function reportGovernanceAttention(
  attention: GovernanceIntelligenceSnapshot["governanceAttention"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `attention:${attention.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GovernanceAttention]", attention);
}

export function reportGovernanceIntelligenceSurface(model: GovernanceIntelligenceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.snapshot.governanceAlignment.alignment}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GovernanceIntelligence]", {
    surfaceId: model.surfaceId,
    alignment: model.snapshot.governanceAlignment.alignment,
    attention: model.snapshot.governanceAttention.level,
  });
}

export function resetGovernanceIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
