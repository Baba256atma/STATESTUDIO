/**
 * Phase 6:4 — Stakeholder Intelligence logging.
 */

import type {
  StakeholderIntelligenceSnapshot,
  StakeholderIntelligenceSurfaceModel,
} from "./stakeholderIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportStakeholderIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `stakeholder:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderIntelligence]", detail);
}

export function reportStakeholderImpactCard(
  impact: StakeholderIntelligenceSnapshot["stakeholderImpact"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `impact:${impact.impact}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderImpact]", impact);
}

export function reportStakeholderAlignmentCard(
  alignment: StakeholderIntelligenceSnapshot["stakeholderAlignment"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `alignment:${alignment.alignment}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderAlignment]", alignment);
}

export function reportStakeholderInfluence(
  influence: StakeholderIntelligenceSnapshot["stakeholderInfluence"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `influence:${influence.entries.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderInfluence]", influence);
}

export function reportStakeholderTension(tension: StakeholderIntelligenceSnapshot["stakeholderTension"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `tension:${tension.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderTension]", tension);
}

export function reportStakeholderSupport(support: StakeholderIntelligenceSnapshot["stakeholderSupport"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `support:${support.entries.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderSupport]", support);
}

export function reportStakeholderConfidence(
  confidence: StakeholderIntelligenceSnapshot["stakeholderConfidence"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${confidence.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderConfidence]", confidence);
}

export function reportStakeholderAttention(
  attention: StakeholderIntelligenceSnapshot["stakeholderAttention"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `attention:${attention.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderAttention]", attention);
}

export function reportStakeholderIntelligenceSurface(model: StakeholderIntelligenceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.snapshot.stakeholderImpact.impact}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StakeholderIntelligence]", {
    surfaceId: model.surfaceId,
    impact: model.snapshot.stakeholderImpact.impact,
    attention: model.snapshot.stakeholderAttention.level,
  });
}

export function resetStakeholderIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
