/**
 * Phase 4:3 — Risk Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";

export const RISK_INTELLIGENCE_SURFACE_VERSION = "4.3.0";

export const CANONICAL_RISK_INTELLIGENCE_OWNER = "riskIntelligenceRuntime";

export const CANONICAL_RISK_INTELLIGENCE_SURFACE_ID = "risk" as const;

export type RiskExposureLevel = "low" | "moderate" | "high" | "critical";

export type RiskMomentum = "improving" | "stable" | "worsening";

export type RiskConfidenceLevel = "low" | "moderate" | "high";

export type ExecutiveRiskAttention = "monitor" | "review" | "investigate" | "immediate_attention";

export type RiskContextSource =
  | "operational"
  | "object"
  | "timeline"
  | "dashboard";

export type ActiveRisksCard = Readonly<{
  count: number;
  summary: string;
  topRisk: string;
  attentionStatus: string;
}>;

export type RiskExposureCard = Readonly<{
  level: RiskExposureLevel;
  label: string;
  trend: ImpactDirection;
  confidence: RiskConfidenceLevel;
}>;

export type RiskMomentumCard = Readonly<{
  momentum: RiskMomentum;
  label: string;
  trendPoints: readonly number[];
  indicator: string;
}>;

export type RiskConfidenceCard = Readonly<{
  level: RiskConfidenceLevel;
  trend: ImpactDirection;
  summary: string;
}>;

export type ExecutiveAttentionRequiredCard = Readonly<{
  status: ExecutiveRiskAttention;
  label: string;
  urgency: string;
  recommendation: string;
}>;

export type RiskIntelligenceSnapshot = Readonly<{
  activeRisks: ActiveRisksCard;
  exposure: RiskExposureCard;
  momentum: RiskMomentumCard;
  confidence: RiskConfidenceCard;
  executiveAttention: ExecutiveAttentionRequiredCard;
}>;

export type RiskIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type RiskIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_RISK_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_RISK_INTELLIGENCE_OWNER;
  headline: string;
  snapshot: RiskIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
  contextSources: readonly RiskContextSource[];
}>;
