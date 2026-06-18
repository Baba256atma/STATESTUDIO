import { buildRiskIntelligenceFeed } from "../../intelligence-integration/RiskIntelligenceFeed.ts";
import type { RiskIntelligenceFeedBuildInput } from "../../intelligence-integration/riskIntelligenceFeedContract.ts";
import type { RiskIntelligenceFeedView } from "../../intelligence-integration/riskIntelligenceFeedContract.ts";
import type {
  ExecutiveRiskAttention,
  RiskConfidenceLevel,
  RiskExposureLevel,
  RiskIntelligenceSurfaceModel,
  RiskMomentum,
} from "./riskIntelligenceContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type RiskIntelligenceFeedAttachInput = RiskIntelligenceFeedBuildInput;

export type RiskIntelligenceSurfaceModelWithFeed = RiskIntelligenceSurfaceModel &
  Readonly<{
    intelligenceFeed: RiskIntelligenceFeedView | null;
  }>;

function exposureLevelFromScore(score: number): RiskExposureLevel {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "moderate";
  return "low";
}

function exposureLabel(level: RiskExposureLevel): string {
  if (level === "critical") return "Critical Exposure";
  if (level === "high") return "High Exposure";
  if (level === "moderate") return "Moderate Exposure";
  return "Low Exposure";
}

function momentumFromScore(score: number): RiskMomentum {
  if (score >= 65) return "worsening";
  if (score <= 35) return "improving";
  return "stable";
}

function attentionFromVulnerabilities(count: number): ExecutiveRiskAttention {
  if (count >= 2) return "immediate_attention";
  if (count >= 1) return "investigate";
  return "monitor";
}

function trendFromMomentum(momentum: RiskMomentum): ImpactDirection {
  if (momentum === "worsening") return "deteriorating";
  if (momentum === "improving") return "improving";
  return "stable";
}

function confidenceFromProfiles(profileCount: number): RiskConfidenceLevel {
  if (profileCount >= 3) return "high";
  if (profileCount >= 1) return "moderate";
  return "low";
}

function enrichSnapshot(
  model: RiskIntelligenceSurfaceModel,
  feed: RiskIntelligenceFeedView
): RiskIntelligenceSurfaceModel["snapshot"] {
  const { riskIntelligence } = feed;
  const exposureLevel = exposureLevelFromScore(riskIntelligence.propagationScore);
  const momentum = momentumFromScore(riskIntelligence.propagationScore);

  return Object.freeze({
    activeRisks: Object.freeze({
      count: riskIntelligence.topRisks.length || riskIntelligence.profiles.length,
      summary: feed.topRisks.secondaryValue,
      topRisk: feed.topRisks.primaryValue,
      attentionStatus: feed.criticalVulnerabilities.primaryValue,
    }),
    exposure: Object.freeze({
      level: exposureLevel,
      label: exposureLabel(exposureLevel),
      trend: trendFromMomentum(momentum),
      confidence: confidenceFromProfiles(riskIntelligence.profiles.length),
    }),
    momentum: Object.freeze({
      momentum,
      label: feed.riskPropagation.primaryValue,
      trendPoints: model.snapshot.momentum.trendPoints,
      indicator: momentum === "worsening" ? "↑" : momentum === "improving" ? "↓" : "→",
    }),
    confidence: Object.freeze({
      level: confidenceFromProfiles(riskIntelligence.topRiskChains.length),
      trend: trendFromMomentum(momentum),
      summary: feed.riskChains.primaryValue,
    }),
    executiveAttention: Object.freeze({
      status: attentionFromVulnerabilities(riskIntelligence.topVulnerabilities.length),
      label: feed.criticalVulnerabilities.title,
      urgency:
        riskIntelligence.topVulnerabilities.length > 0 ? "Elevated vulnerability pressure" : "Routine monitoring",
      recommendation: feed.criticalVulnerabilities.secondaryValue,
    }),
  });
}

export function attachRiskIntelligenceFeed(
  model: RiskIntelligenceSurfaceModel,
  input: RiskIntelligenceFeedAttachInput = {}
): RiskIntelligenceSurfaceModelWithFeed {
  const feed = buildRiskIntelligenceFeed(input);

  if (feed.feedStatus !== "bound") {
    return Object.freeze({
      ...model,
      intelligenceFeed: null,
    });
  }

  return Object.freeze({
    ...model,
    snapshot: enrichSnapshot(model, feed),
    intelligenceFeed: feed,
  });
}
