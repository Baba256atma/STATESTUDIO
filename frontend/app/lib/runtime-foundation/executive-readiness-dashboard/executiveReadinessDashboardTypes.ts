/** D10:4 - Executive readiness dashboard and runtime health surface contracts. */

import type {
  ExecutiveReadinessSnapshot,
  RuntimeReadinessRegistry,
} from "../strategic-readiness/index.ts";
import type { ExecutiveReliabilitySnapshot } from "../executive-reliability/index.ts";
import type { ExecutiveInteractionStabilityRuntimeSnapshot } from "../interaction-stability/index.ts";

export type ExecutiveDashboardHealthStatus = "healthy" | "warning" | "degraded" | "critical";

export type ExecutiveDashboardClassificationSeverity = "informational" | "caution" | "warning" | "critical";

export type StrategicLaunchAssessment =
  | "not_ready"
  | "preparation_required"
  | "pilot_ready"
  | "demo_ready"
  | "production_candidate";

export type ReadinessGapSeverity = "minor" | "moderate" | "major" | "critical";

export type ExecutiveReadinessIndicator = {
  indicatorId: string;
  label: string;
  score: number;
  explanation: string;
};

export type RuntimeHealthSurface = {
  status: ExecutiveDashboardHealthStatus;
  explanation: string;
  derivedFrom: readonly string[];
  confidence: number;
};

export type ExecutiveReadinessGap = {
  gapId: string;
  description: string;
  severity: ReadinessGapSeverity;
  rationale: string;
  recommendedNextAction: string;
};

export type RuntimeHealthClassification = {
  classificationId: string;
  severity: ExecutiveDashboardClassificationSeverity;
  explanation: string;
  affectedArea: string;
  confidence: number;
  recommendedFollowUp: string;
};

export type ExecutiveReadinessSummary = {
  isNexoraReady: boolean;
  biggestRisk: string | null;
  blockingReadiness: readonly string[];
  healthySignals: readonly string[];
  shouldHappenNext: readonly string[];
  headline: string;
};

export type DashboardTrendPoint = {
  generatedAt: number;
  readinessScore: number;
  trustScore: number;
  stabilityScore: number;
  validationCoverage: number;
};

export type DashboardTrendSummary = {
  readinessProgression: "improving" | "declining" | "flat";
  trustProgression: "improving" | "declining" | "flat";
  stabilityProgression: "improving" | "declining" | "flat";
  validationProgression: "improving" | "declining" | "flat";
  points: readonly DashboardTrendPoint[];
};

export type ExecutiveReadinessDashboardModel = {
  dashboardId: string;
  organizationId: string;
  generatedAt: number;
  mvpReadiness: StrategicLaunchAssessment;
  deploymentReadiness: StrategicLaunchAssessment;
  operationalReadiness: ExecutiveDashboardHealthStatus;
  executiveReadiness: StrategicLaunchAssessment;
  runtimeTrust: ExecutiveDashboardHealthStatus;
  interactionStability: ExecutiveDashboardHealthStatus;
  validationStatus: ExecutiveDashboardHealthStatus;
  healthSurface: RuntimeHealthSurface;
  indicators: readonly ExecutiveReadinessIndicator[];
  gaps: readonly ExecutiveReadinessGap[];
  classifications: readonly RuntimeHealthClassification[];
  launchAssessment: StrategicLaunchAssessment;
  executiveSummary: ExecutiveReadinessSummary;
  trend: DashboardTrendSummary;
  sourceSignatures: readonly string[];
  signature: string;
};

export type ExecutiveReadinessDashboardInput = {
  organizationId?: string;
  readinessRegistry?: RuntimeReadinessRegistry | null;
  readinessSnapshot?: ExecutiveReadinessSnapshot | null;
  reliabilitySnapshot?: ExecutiveReliabilitySnapshot | null;
  interactionSnapshot?: ExecutiveInteractionStabilityRuntimeSnapshot | null;
  previousDashboards?: readonly ExecutiveReadinessDashboardModel[];
  now?: number;
};

