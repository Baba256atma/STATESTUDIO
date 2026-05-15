/**
 * Decision Intelligence — canonical read models for Type-C / D4 (contracts only).
 *
 * Purpose: single vocabulary for signals → insights → recommendations → outcomes.
 * Future role: AI adapters, scenario engines, and persistence layers map into these shapes.
 * Boundaries: readonly data; no scoring, no orchestration side effects, no UI.
 */

import type {
  DecisionActionKind,
  DecisionConfidenceBand,
  DecisionMetadataEntry,
  DecisionPriority,
  DecisionProvenanceRef,
  DecisionRecommendationLifecycleStatus,
  DecisionRiskSeverityLabel,
  DecisionSignalKind,
  DecisionSourceRef,
  DecisionTimeHorizon,
} from "./decisionTypes.ts";
import type { DecisionReasoningNode } from "./decisionReasoning.ts";

/** Aggregate confidence for an insight or recommendation (machine + human calibration). */
export type DecisionConfidence = Readonly<{
  readonly score01: number;
  readonly label: DecisionConfidenceBand;
  readonly calibrationVersion?: string;
  readonly provenance?: readonly DecisionProvenanceRef[];
}>;

export type DecisionSignal = Readonly<{
  readonly id: string;
  readonly kind: DecisionSignalKind;
  readonly label: string;
  readonly value: number | string | boolean | null;
  readonly unit?: string;
  readonly detectedAt: string;
  readonly sourceRef: DecisionSourceRef;
  /** Optional weight when fusing signals (0–1). */
  readonly confidenceWeight01?: number;
}>;

export type DecisionEvidence = Readonly<{
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly sourceRef: DecisionSourceRef;
  /** Strength of this evidence slice for ranking / overlays (0–1). */
  readonly strength01: number;
  readonly linkedSignalIds: readonly string[];
  /** Optional ISO-8601 timestamp for freshness (caller/connector supplied). */
  readonly recordedAt?: string;
  /** Optional explicit source trust hint (0–1); otherwise inferred from `sourceRef`. */
  readonly sourceTrust01?: number;
}>;

export type DecisionTradeoff = Readonly<{
  readonly id: string;
  readonly dimension: string;
  readonly optionA: string;
  readonly optionB: string;
  /** 0 = favor B, 1 = favor A (deterministic executive comparison axis). */
  readonly favorAWeight01: number;
  readonly notes: string;
}>;

export type DecisionRiskAssessment = Readonly<{
  readonly id: string;
  readonly severityLabel: DecisionRiskSeverityLabel;
  readonly likelihood01: number;
  readonly impact01: number;
  readonly mitigationSummary?: string;
  readonly linkedSignalIds: readonly string[];
}>;

export type DecisionAction = Readonly<{
  readonly id: string;
  readonly kind: DecisionActionKind;
  readonly label: string;
  readonly description: string;
  readonly reversible: boolean;
  readonly requiresConfirmation: boolean;
  /** When kind === "custom", stable id for adapter-specific actions. */
  readonly customKindId?: string;
}>;

export type DecisionOutcomeProjection = Readonly<{
  readonly id: string;
  readonly horizonLabel: string;
  readonly expectedDelta01: number;
  readonly uncertainty01: number;
  readonly narrative: string;
}>;

export type DecisionContext = Readonly<{
  readonly id: string;
  readonly sessionId?: string;
  readonly scenarioIds: readonly string[];
  readonly decisionGateIds: readonly string[];
  readonly constraints: readonly string[];
  readonly horizon: DecisionTimeHorizon;
  readonly locale?: string;
  readonly metadataEntries: readonly DecisionMetadataEntry[];
}>;

export type DecisionInsight = Readonly<{
  readonly id: string;
  readonly title: string;
  readonly narrative: string;
  readonly priority: DecisionPriority;
  readonly signals: readonly DecisionSignal[];
  readonly confidence: DecisionConfidence;
  readonly createdAt: string;
  /** Optional pointer when reasoning is materialized as a tree. */
  readonly reasoningRoot?: DecisionReasoningNode;
}>;

export type DecisionRecommendation = Readonly<{
  readonly id: string;
  readonly title: string;
  readonly rationale: string;
  readonly status: DecisionRecommendationLifecycleStatus;
  readonly priority: DecisionPriority;
  readonly confidence: DecisionConfidence;
  readonly tradeoffs: readonly DecisionTradeoff[];
  readonly evidence: readonly DecisionEvidence[];
  readonly reasoningRoot?: DecisionReasoningNode;
  readonly projectedOutcomes: readonly DecisionOutcomeProjection[];
  readonly actions: readonly DecisionAction[];
  readonly risks?: readonly DecisionRiskAssessment[];
  readonly contextRefs?: readonly DecisionProvenanceRef[];
  readonly createdAt: string;
  readonly updatedAt: string;
}>;
