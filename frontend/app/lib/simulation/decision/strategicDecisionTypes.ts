/**
 * D7:1:7 — Strategic decision consequence simulation contracts.
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { SimulationObjectGraph } from "../simulationPropagationGraph.ts";
import type { SimulationPropagationResult } from "../simulationEventPropagationEngine.ts";
import type { DecisionGuardResult } from "./decisionGuards.ts";

export type StrategicDecisionType =
  | "resource_reallocation"
  | "risk_mitigation"
  | "cost_reduction"
  | "expansion"
  | "stabilization"
  | "operational_pause"
  | "capacity_increase";

export interface StrategicDecisionInput {
  decisionId: string;
  type: StrategicDecisionType;
  targetObjectIds: readonly string[];
  createdAt: string;
  rationale?: string;
  expectedOutcome?: string;
  /** Normalized intervention strength 0–1 (deterministic scaling). */
  intensity?: number;
}

export interface DecisionConsequenceEffect {
  affectedObjectIds: readonly string[];
  operationalImpact?: number;
  fragilityImpact?: number;
  stabilizationImpact?: number;
  propagationImpact?: number;
  confidenceImpact?: number;
  summary?: string;
}

export interface DecisionConsequenceTradeoff {
  dimension: "speed" | "stability" | "efficiency" | "resilience" | "cost" | "risk_exposure";
  improvedAspect: string;
  worsenedAspect: string;
  summary: string;
}

export interface ExecutiveDecisionConsequenceNarrative {
  headline: string;
  summary: string;
  benefits: readonly string[];
  costs: readonly string[];
  bullets: readonly string[];
}

export interface DecisionConsequenceSnapshot {
  simulationId: string;
  decisionId: string;
  sourceTimelineId: string;
  projectedTimelineId: string;
  appliedAtTick: number;
  projectedTick: number;
  effects: readonly DecisionConsequenceEffect[];
  tradeoffs: readonly DecisionConsequenceTradeoff[];
  narrative: ExecutiveDecisionConsequenceNarrative;
  metricsBefore: Readonly<Record<string, number>>;
  metricsAfter: Readonly<Record<string, number>>;
  propagationEventCount: number;
  fingerprint: string;
}

/** Future war-room / executive action panel contract (no UI in D7:1:7). */
export interface WarRoomDecisionSimulationContract {
  simulationId: string;
  decisionId: string;
  decisionType: StrategicDecisionType;
  headline: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  fragilityDelta: number;
  recoveryDelta: number;
  targetObjectIds: readonly string[];
  tradeoffSummaries: readonly string[];
  replayFingerprint: string;
  viewHint: "consequence_timeline" | "intervention_heatmap" | "tradeoff_grid";
}

export interface SimulateStrategicDecisionInput {
  decision: StrategicDecisionInput;
  activeTimeline: OperationalTimeline;
  currentSnapshot?: SimulationStateSnapshot;
  objectGraph?: SimulationObjectGraph;
  resourceAvailability?: Readonly<Record<string, number>>;
  /** Prior simulation fingerprints — rejects duplicates for replay safety. */
  priorSimulationFingerprints?: readonly string[];
  /** Decision ids already applied in this chain — prevents recursive loops. */
  decisionChain?: readonly string[];
  simulationId?: string;
}

export interface DecisionSimulationOutcome {
  simulationId: string;
  decisionId: string;
  sourceTimelineId: string;
  projectedTimeline: OperationalTimeline;
  consequenceSnapshot: DecisionConsequenceSnapshot;
  propagationResults: readonly SimulationPropagationResult[];
  warRoomContract: WarRoomDecisionSimulationContract;
}

export type StrategicDecisionSimulationResult =
  | { ok: true; outcome: DecisionSimulationOutcome }
  | { ok: false; guard: DecisionGuardResult };
