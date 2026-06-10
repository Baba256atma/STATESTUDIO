/**
 * Phase 6:5 — Consensus Intelligence logging.
 */

import type {
  ConsensusIntelligenceSnapshot,
  ConsensusIntelligenceSurfaceModel,
} from "./consensusIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportConsensusIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `consensus:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConsensusIntelligence]", detail);
}

export function reportConsensusLevel(level: ConsensusIntelligenceSnapshot["consensusLevel"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `level:${level.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConsensusLevel]", level);
}

export function reportAlignmentZone(zones: ConsensusIntelligenceSnapshot["alignmentZones"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `alignment:${zones.zones.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AlignmentZone]", zones);
}

export function reportDisagreementZone(zones: ConsensusIntelligenceSnapshot["disagreementZones"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `disagreement:${zones.zones.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DisagreementZone]", zones);
}

export function reportConvergence(convergence: ConsensusIntelligenceSnapshot["convergence"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `convergence:${convergence.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][Convergence]", convergence);
}

export function reportDivergence(divergence: ConsensusIntelligenceSnapshot["divergence"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `divergence:${divergence.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][Divergence]", divergence);
}

export function reportInstitutionalTension(
  tension: ConsensusIntelligenceSnapshot["institutionalTension"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `tension:${tension.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][InstitutionalTension]", tension);
}

export function reportConsensusConfidence(
  confidence: ConsensusIntelligenceSnapshot["consensusConfidence"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${confidence.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConsensusConfidence]", confidence);
}

export function reportConsensusAttention(
  attention: ConsensusIntelligenceSnapshot["consensusAttention"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `attention:${attention.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConsensusAttention]", attention);
}

export function reportConsensusIntelligenceSurface(model: ConsensusIntelligenceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.snapshot.consensusLevel.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConsensusIntelligence]", {
    surfaceId: model.surfaceId,
    level: model.snapshot.consensusLevel.level,
    attention: model.snapshot.consensusAttention.level,
  });
}

export function resetConsensusIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
