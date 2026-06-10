/**
 * Phase 5:2 — Advisory Context Aggregation contracts.
 */

import type { ImpactDirection } from "../../dashboardVisualSignalContract.ts";
import type { ExecutiveAdvisoryAggregationInput } from "../executiveAdvisoryContract.ts";

export const ADVISORY_CONTEXT_AGGREGATION_VERSION = "5.2.0";

export const CANONICAL_ADVISORY_AGGREGATION_OWNER = "advisoryAggregationRuntime";

export type AdvisoryInputSource = "operational" | "risk" | "timeline" | "scenario" | "war_room";

export type AdvisoryInputPriority = "low" | "moderate" | "high" | "critical";

export type AdvisoryInputConfidence = "low" | "moderate" | "high";

export type AdvisoryInputImpact = "low" | "moderate" | "high" | "transformational";

export type StandardizedAdvisoryInput = Readonly<{
  source: AdvisoryInputSource;
  domain: string;
  label: string;
  priority: AdvisoryInputPriority;
  confidence: AdvisoryInputConfidence;
  impact: AdvisoryInputImpact;
  timestamp: string;
  explanation: string;
  trend: ImpactDirection;
  score: number;
}>;

export type ReasoningTraceContract = Readonly<{
  sourceChain: readonly string[];
  inputFactors: readonly string[];
  priorityFactors: readonly string[];
  confidenceFactors: readonly string[];
}>;

export type AggregationAuditEntry = Readonly<{
  step: string;
  source: AdvisoryInputSource | "aggregation";
  detail: string;
}>;

export type AggregationAuditTrail = Readonly<{
  chain: readonly AggregationAuditEntry[];
  summary: string;
}>;

export type AdvisoryContextMetadata = Readonly<{
  sourceSurface: string;
  timestamp: string;
  confidence: AdvisoryInputConfidence;
  priority: AdvisoryInputPriority;
  reasoningTrace: ReasoningTraceContract;
  auditTrail: AggregationAuditTrail;
}>;

export type OperationalAdvisoryInputs = Readonly<{
  health: StandardizedAdvisoryInput;
  pressure: StandardizedAdvisoryInput;
  signals: StandardizedAdvisoryInput;
  demandImpact: StandardizedAdvisoryInput;
}>;

export type RiskAdvisoryInputs = Readonly<{
  exposure: StandardizedAdvisoryInput;
  momentum: StandardizedAdvisoryInput;
  confidence: StandardizedAdvisoryInput;
  executiveAttention: StandardizedAdvisoryInput;
}>;

export type TimelineAdvisoryInputs = Readonly<{
  momentum: StandardizedAdvisoryInput;
  milestonePressure: StandardizedAdvisoryInput;
  scheduleDrift: StandardizedAdvisoryInput;
  decisionWindows: StandardizedAdvisoryInput;
}>;

export type ScenarioAdvisoryInputs = Readonly<{
  expectedImpact: StandardizedAdvisoryInput;
  confidence: StandardizedAdvisoryInput;
  tradeoffs: StandardizedAdvisoryInput;
  investigationPaths: StandardizedAdvisoryInput;
}>;

export type WarRoomAdvisoryInputs = Readonly<{
  situationOverview: StandardizedAdvisoryInput;
  criticalRisks: StandardizedAdvisoryInput;
  decisionFocus: StandardizedAdvisoryInput;
  scenarioComparison: StandardizedAdvisoryInput;
}>;

export type AdvisoryContext = Readonly<{
  operational: OperationalAdvisoryInputs;
  risk: RiskAdvisoryInputs;
  timeline: TimelineAdvisoryInputs;
  scenario: ScenarioAdvisoryInputs;
  warRoom: WarRoomAdvisoryInputs;
  metadata: AdvisoryContextMetadata;
  rankedInputs: readonly StandardizedAdvisoryInput[];
  topPriority: StandardizedAdvisoryInput | null;
}>;

export type AdvisoryContextAggregationInput = ExecutiveAdvisoryAggregationInput;
