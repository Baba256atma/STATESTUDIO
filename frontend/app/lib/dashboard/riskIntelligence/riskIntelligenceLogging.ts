/**
 * Phase 4:3 — Risk Intelligence logging.
 */

import type {
  ActiveRisksCard,
  ExecutiveAttentionRequiredCard,
  RiskConfidenceCard,
  RiskExposureCard,
  RiskIntelligenceSurfaceModel,
  RiskMomentumCard,
} from "./riskIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportRiskIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `risk:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][RiskIntelligence]", detail);
}

export function reportActiveRisk(card: ActiveRisksCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `active:${card.count}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ActiveRisk]", card);
}

export function reportRiskExposure(exposure: RiskExposureCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `exposure:${exposure.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][RiskExposure]", exposure);
}

export function reportRiskMomentum(momentum: RiskMomentumCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `momentum:${momentum.momentum}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][RiskMomentum]", momentum);
}

export function reportRiskConfidence(confidence: RiskConfidenceCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${confidence.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][RiskConfidence]", confidence);
}

export function reportExecutiveAttentionRequired(attention: ExecutiveAttentionRequiredCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `attention:${attention.status}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExecutiveAttentionRequired]", attention);
}

export function reportRiskIntelligenceSurface(model: RiskIntelligenceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][RiskIntelligence]", {
    surfaceId: model.surfaceId,
    owner: model.owner,
    activeRisks: model.snapshot.activeRisks.count,
    exposure: model.snapshot.exposure.level,
    momentum: model.snapshot.momentum.momentum,
    executiveAttention: model.snapshot.executiveAttention.status,
  });
}

export function resetRiskIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
