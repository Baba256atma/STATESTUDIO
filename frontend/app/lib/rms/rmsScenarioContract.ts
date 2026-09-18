/**
 * NPA-T RMS:7 — Scenario Library contracts.
 * A Scenario is world + conditions, not a correct Nexora answer.
 */

import type { RmsWorldKind } from "./rmsWorldContract.ts";
import type { RmsOperationalSourceFamily } from "./rmsOperatorContract.ts";
import type { RmsScheduledDisturbance } from "./rmsEventContract.ts";
import type { RmsManagerIntent, RmsManagerProfileId } from "./rmsManagerContract.ts";
import type { RmsStructuredGroundTruth } from "./rmsWorldContract.ts";

export const rmsScenarioLibraryIdentity = "NPA-T RMS:7/ScenarioLibrary" as const;

export const RMS_SCENARIO_CATEGORIES = Object.freeze([
  "MANUFACTURING",
  "PROJECT_DELIVERY",
  "LOGISTICS",
  "SERVICE",
] as const);
export type RmsScenarioCategory = (typeof RMS_SCENARIO_CATEGORIES)[number];

export const RMS_SCENARIO_COMPLEXITY = Object.freeze(["DEEP", "PARITY"] as const);
export type RmsScenarioComplexity = (typeof RMS_SCENARIO_COMPLEXITY)[number];

export const RMS_7_BOUNDARY = Object.freeze({
  identity: rmsScenarioLibraryIdentity,
  ownsScenarioDefinition: true as const,
  ownsRegistry: true as const,
  ownsValidation: true as const,
  ownsRunner: true as const,
  ownsWorldTemplates: true as const,
  ownsLibrary: true as const,
  ownsGroundTruthEngine: false as const,
  ownsOperatorEngine: false as const,
  ownsManagerEngine: false as const,
  ownsObserverEngine: false as const,
  ownsEventEngine: false as const,
  ownsNmi: false as const,
  ownsVai: false as const,
  ownsDataReality: false as const,
  ownsAdvisor: false as const,
  ownsProblems: false as const,
  ownsDecisions: false as const,
  encodesExpectedNexoraAnswer: false as const,
  injectsProblemObjects: false as const,
  startsRms8: false as const,
  forkCompatible: true as const,
  observationPolicy: "RMS_DEFAULT_OBSERVATION_POLICY" as const,
});

export type RmsScenarioCustomerMetadata = {
  readonly title: string;
  readonly shortDescription: string;
  readonly estimatedLength: string;
  readonly managementTopics: readonly string[];
  readonly dataSourcesInvolved: readonly string[];
  readonly whatUserMayLearn: readonly string[];
  readonly observationFocus: readonly string[];
  readonly disclosesHiddenEvents: false;
};

export type RmsScenarioDefinition = {
  readonly scenarioId: string;
  readonly version: string;
  readonly title: string;
  readonly description: string;
  readonly worldKind: RmsWorldKind;
  readonly category: RmsScenarioCategory;
  readonly complexity: RmsScenarioComplexity;
  readonly worldTemplateId: string;
  readonly instantiateWorld: () => RmsStructuredGroundTruth;
  readonly enabledSources: readonly RmsOperationalSourceFamily[];
  readonly observationPolicyId: "RMS_DEFAULT";
  readonly eventSchedule: readonly RmsScheduledDisturbance[];
  readonly managerProfileId: RmsManagerProfileId;
  readonly managerObjective: {
    readonly objectiveId: string;
    readonly statement: string;
    readonly hostKind: "BUSINESS" | "PROJECT";
    readonly agenda: readonly RmsManagerIntent[];
  };
  readonly managerVisibleContext: readonly string[];
  readonly durationTicks: number;
  readonly managerTurns: number;
  readonly tags: readonly string[];
  readonly requiredCapabilities: readonly string[];
  readonly customer: RmsScenarioCustomerMetadata;
  readonly forkCompatible: true;
};

export type RmsScenarioRunResult = {
  readonly scenarioId: string;
  readonly version: string;
  readonly simulationId: string;
  readonly runId: string;
  readonly startTick: number;
  readonly endTick: number;
  readonly eventTraceIds: readonly string[];
  readonly observationRecordIds: readonly string[];
  readonly managerTurnCount: number;
  readonly observerMeasurementCount: number;
  readonly observerFindingCount: number;
  readonly lifecycle: "completed";
  readonly forkCompatible: true;
  readonly sealedGroundTruthExposed: false;
};

export const RMS_SCENARIO_FORBIDDEN_KEYS = Object.freeze([
  "expectedProblem",
  "correctProblem",
  "expectedRecommendation",
  "correctDecision",
  "expectedNexoraAnswer",
  "winningScenario",
] as const);
