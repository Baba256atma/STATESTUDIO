/**
 * W:1 — War Room Signal Aggregator.
 *
 * Converts existing DS and C:1 intelligence outputs into read-only War Room
 * signals. This layer only reads source intelligence; it does not recalculate,
 * mutate, route, render UI, or execute simulation.
 */

import type { KpiIntelligenceRegistry, KpiIntelligenceProfile } from "../kpi-intelligence/kpiIntelligenceContract.ts";
import type { ObjectIntelligenceProfile, ObjectIntelligenceRegistry } from "../object-intelligence/objectIntelligenceContract.ts";
import type {
  RelationshipIntelligenceProfile,
  RelationshipIntelligenceRegistry,
} from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import type { RiskIntelligenceProfile, RiskIntelligenceRegistry } from "../risk-intelligence/riskIntelligenceContract.ts";
import type { ScenarioComparisonResult } from "../scenario-authoring/ScenarioComparisonContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import {
  buildWarRoomSignal,
  type WarRoomSignal,
  type WarRoomSignalSeverity,
} from "./WarRoomContract.ts";

export const WAR_ROOM_AGGREGATOR_DIAGNOSTIC = "[WAR_ROOM_AGGREGATOR]" as const;

export const WAR_ROOM_AGGREGATOR_READY_DIAGNOSTIC = "[WAR_ROOM_AGGREGATOR_READY]" as const;

export const W1_SIGNAL_AGGREGATOR_COMPLETE_TAG = "[W1_SIGNAL_AGGREGATOR_COMPLETE]" as const;

export const WAR_ROOM_SIGNAL_AGGREGATOR_VERSION = "1.0.0" as const;

export type WarRoomSignalAggregatorInput = Readonly<{
  generatedAt: string;
  objectIntelligence?: ObjectIntelligenceRegistry;
  relationshipIntelligence?: RelationshipIntelligenceRegistry;
  kpiIntelligence?: KpiIntelligenceRegistry;
  riskIntelligence?: RiskIntelligenceRegistry;
  scenarioIntelligence?: ExecutiveScenarioSummary;
  compareResults?: readonly ScenarioComparisonResult[];
}>;

export type WarRoomSignalSet = Readonly<{
  version: typeof WAR_ROOM_SIGNAL_AGGREGATOR_VERSION;
  generatedAt: string;
  signals: readonly WarRoomSignal[];
  signalCount: number;
  objectSignalCount: number;
  relationshipSignalCount: number;
  kpiSignalCount: number;
  riskSignalCount: number;
  scenarioSignalCount: number;
  compareSignalCount: number;
  readOnly: true;
  recalculation: false;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof WAR_ROOM_AGGREGATOR_DIAGNOSTIC,
    typeof WAR_ROOM_AGGREGATOR_READY_DIAGNOSTIC,
  ];
}>;

export const WAR_ROOM_SIGNAL_AGGREGATOR_DIAGNOSTICS = Object.freeze([
  WAR_ROOM_AGGREGATOR_DIAGNOSTIC,
  WAR_ROOM_AGGREGATOR_READY_DIAGNOSTIC,
] as const);

export const EMPTY_WAR_ROOM_SIGNAL_SET: WarRoomSignalSet = Object.freeze({
  version: WAR_ROOM_SIGNAL_AGGREGATOR_VERSION,
  generatedAt: "",
  signals: Object.freeze([]),
  signalCount: 0,
  objectSignalCount: 0,
  relationshipSignalCount: 0,
  kpiSignalCount: 0,
  riskSignalCount: 0,
  scenarioSignalCount: 0,
  compareSignalCount: 0,
  readOnly: true,
  recalculation: false,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: WAR_ROOM_SIGNAL_AGGREGATOR_DIAGNOSTICS,
});

let latestWarRoomSignalSet: WarRoomSignalSet = EMPTY_WAR_ROOM_SIGNAL_SET;

function healthSeverity(value: number): WarRoomSignalSeverity {
  if (value < 35) return "critical";
  if (value < 55) return "warning";
  if (value < 75) return "watch";
  return "info";
}

function scoreSeverity(value: number): WarRoomSignalSeverity {
  if (value >= 85) return "critical";
  if (value >= 70) return "warning";
  if (value >= 50) return "watch";
  return "info";
}

function kpiSeverity(profile: KpiIntelligenceProfile): WarRoomSignalSeverity {
  if (profile.direction === "down" && profile.intelligenceScore < 45) return "critical";
  if (profile.direction === "down") return "warning";
  if (profile.direction === "neutral") return "watch";
  return "info";
}

function objectSignal(profile: ObjectIntelligenceProfile, generatedAt: string): WarRoomSignal {
  return buildWarRoomSignal({
    signalId: `war-room:object:${profile.objectId}`,
    source: "object",
    sourceId: profile.objectId,
    severity: profile.trend === "declining" ? "warning" : healthSeverity(profile.health),
    title: `${profile.label} object intelligence`,
    detail: `Health ${profile.health}, impact ${profile.impact}, trend ${profile.trend}.`,
    confidence: profile.confidence,
    timestamp: generatedAt,
  });
}

function relationshipSignal(profile: RelationshipIntelligenceProfile, generatedAt: string): WarRoomSignal {
  return buildWarRoomSignal({
    signalId: `war-room:relationship:${profile.relationshipId}`,
    source: "relationship",
    sourceId: profile.relationshipId,
    severity: scoreSeverity(profile.riskExposure),
    title: `${profile.relationshipType} relationship intelligence`,
    detail: `Dependency ${profile.dependency}, influence ${profile.influence}, risk exposure ${profile.riskExposure}.`,
    confidence: profile.confidence,
    timestamp: generatedAt,
  });
}

function kpiSignal(profile: KpiIntelligenceProfile, generatedAt: string): WarRoomSignal {
  return buildWarRoomSignal({
    signalId: `war-room:kpi:${profile.kpiId}`,
    source: "kpi",
    sourceId: profile.kpiId,
    severity: kpiSeverity(profile),
    title: `${profile.label} KPI intelligence`,
    detail: `${profile.category} score ${profile.intelligenceScore}, direction ${profile.direction}.`,
    confidence: profile.confidence,
    timestamp: generatedAt,
  });
}

function riskSignal(profile: RiskIntelligenceProfile, generatedAt: string): WarRoomSignal {
  return buildWarRoomSignal({
    signalId: `war-room:risk:${profile.riskId}`,
    source: "risk",
    sourceId: profile.riskId,
    severity: scoreSeverity(Math.max(profile.severity, profile.exposure)),
    title: `${profile.label} risk intelligence`,
    detail: `${profile.primaryCategoryLabel}, severity ${profile.severity}, exposure ${profile.exposure}, momentum ${profile.momentum}.`,
    confidence: profile.confidence,
    timestamp: generatedAt,
  });
}

function scenarioSignals(summary: ExecutiveScenarioSummary | undefined, generatedAt: string): readonly WarRoomSignal[] {
  if (!summary) return Object.freeze([]);
  return Object.freeze(
    summary.summaries.map((profile) =>
      buildWarRoomSignal({
        signalId: `war-room:scenario:${profile.scenarioId}`,
        source: "scenario",
        sourceId: profile.scenarioId,
        severity: scoreSeverity(profile.impactAggregation.compositeImpactScore),
        title: `${profile.label} scenario intelligence`,
        detail: `${profile.scenarioType} scenario composite impact ${profile.impactAggregation.compositeImpactScore}.`,
        confidence: profile.impactAggregation.compositeImpactScore,
        timestamp: generatedAt,
      })
    )
  );
}

function compareSignals(compareResults: readonly ScenarioComparisonResult[] | undefined, generatedAt: string): readonly WarRoomSignal[] {
  if (!compareResults) return Object.freeze([]);
  return Object.freeze(
    compareResults.flatMap((result) =>
      result.differences.map((difference) =>
        buildWarRoomSignal({
          signalId: `war-room:compare:${result.request.comparisonId}:${difference.differenceId}`,
          source: "executive",
          sourceId: difference.differenceId,
          severity: scoreSeverity(Math.abs(difference.overallImpactDelta) + Math.abs(difference.riskMovementDelta)),
          title: `Compare result ${difference.differenceId}`,
          detail: difference.summary,
          confidence: 100 - Math.abs(difference.confidenceDelta),
          timestamp: generatedAt,
        })
      )
    )
  );
}

export function aggregateWarRoomSignals(input: WarRoomSignalAggregatorInput): WarRoomSignalSet {
  const objectSignals = Object.freeze(
    (input.objectIntelligence?.profiles ?? []).map((profile) => objectSignal(profile, input.generatedAt))
  );
  const relationshipSignals = Object.freeze(
    (input.relationshipIntelligence?.profiles ?? []).map((profile) => relationshipSignal(profile, input.generatedAt))
  );
  const kpiSignals = Object.freeze(
    (input.kpiIntelligence?.profiles ?? []).map((profile) => kpiSignal(profile, input.generatedAt))
  );
  const riskSignals = Object.freeze(
    (input.riskIntelligence?.profiles ?? []).map((profile) => riskSignal(profile, input.generatedAt))
  );
  const scenarioSignalList = scenarioSignals(input.scenarioIntelligence, input.generatedAt);
  const compareSignalList = compareSignals(input.compareResults, input.generatedAt);
  const signals = Object.freeze([
    ...objectSignals,
    ...relationshipSignals,
    ...kpiSignals,
    ...riskSignals,
    ...scenarioSignalList,
    ...compareSignalList,
  ]);

  latestWarRoomSignalSet = Object.freeze({
    version: WAR_ROOM_SIGNAL_AGGREGATOR_VERSION,
    generatedAt: input.generatedAt,
    signals,
    signalCount: signals.length,
    objectSignalCount: objectSignals.length,
    relationshipSignalCount: relationshipSignals.length,
    kpiSignalCount: kpiSignals.length,
    riskSignalCount: riskSignals.length,
    scenarioSignalCount: scenarioSignalList.length,
    compareSignalCount: compareSignalList.length,
    readOnly: true as const,
    recalculation: false as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: WAR_ROOM_SIGNAL_AGGREGATOR_DIAGNOSTICS,
  });

  return latestWarRoomSignalSet;
}

export function getWarRoomSignalSet(): WarRoomSignalSet {
  return latestWarRoomSignalSet;
}

export function resetWarRoomSignalAggregatorForTests(): void {
  latestWarRoomSignalSet = EMPTY_WAR_ROOM_SIGNAL_SET;
}

export const WarRoomSignalAggregator = Object.freeze({
  aggregateWarRoomSignals,
  getWarRoomSignalSet,
  resetWarRoomSignalAggregatorForTests,
  diagnostics: WAR_ROOM_SIGNAL_AGGREGATOR_DIAGNOSTICS,
  emptySignalSet: EMPTY_WAR_ROOM_SIGNAL_SET,
});
