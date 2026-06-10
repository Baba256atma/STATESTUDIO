/**
 * Phase 6:6 — Institutional Alignment logging.
 */

import type {
  InstitutionalAlignmentSnapshot,
  InstitutionalAlignmentSurfaceModel,
} from "./institutionalAlignmentContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportInstitutionalAlignment(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `institutional:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][InstitutionalAlignment]", detail);
}

export function reportInstitutionalHealth(
  health: InstitutionalAlignmentSnapshot["institutionalHealth"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `health:${health.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][InstitutionalHealth]", health);
}

export function reportGovernanceStatus(
  status: InstitutionalAlignmentSnapshot["governanceStatus"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `governance:${status.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GovernanceStatus]", status);
}

export function reportStrategicAlignmentStatus(
  status: InstitutionalAlignmentSnapshot["strategicAlignmentStatus"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `strategic:${status.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StrategicAlignmentStatus]", status);
}

export function reportPolicyStatus(status: InstitutionalAlignmentSnapshot["policyStatus"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `policy:${status.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][PolicyStatus]", status);
}

export function reportStakeholderStatus(
  status: InstitutionalAlignmentSnapshot["stakeholderStatus"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `stakeholder:${status.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderStatus]", status);
}

export function reportConsensusStatus(
  status: InstitutionalAlignmentSnapshot["consensusStatus"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `consensus:${status.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConsensusStatus]", status);
}

export function reportInstitutionalAttention(
  attention: InstitutionalAlignmentSnapshot["institutionalAttention"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `attention:${attention.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][InstitutionalAttention]", attention);
}

export function reportInstitutionalAlignmentSurface(
  model: InstitutionalAlignmentSurfaceModel
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.snapshot.institutionalHealth.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][InstitutionalAlignment]", {
    surfaceId: model.surfaceId,
    health: model.snapshot.institutionalHealth.level,
    attention: model.snapshot.institutionalAttention.level,
  });
}

export function resetInstitutionalAlignmentLoggingForTests(): void {
  loggedKeys.clear();
}
