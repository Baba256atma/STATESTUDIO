/**
 * NEX-EXP:5 — Scenario & Option Discovery contracts.
 * Discovery/projection over EI:4 and CC:9. Does not recommend, decide, or execute.
 */

export const nexoraScenarioDiscoveryExperienceIdentity =
  "NEX-EXP:5/ScenarioOptionDiscovery" as const;
export const nexoraScenarioDiscoveryExperienceVersion = "1.0.0" as const;
export const nexoraScenarioDiscoveryExperienceNamespace =
  "nexora.experience.scenario.option-discovery" as const;

export const NEXORA_SCENARIO_DISCOVERY_BOUNDARY = Object.freeze({
  identity: nexoraScenarioDiscoveryExperienceIdentity,
  startsNexExp6: false as const,
  createsMo7: false as const,
  parallelScenarioIntelligence: false as const,
  parallelOptionEngine: false as const,
  parallelCounterfactualRuntime: false as const,
  parallelTradeoffEngine: false as const,
  parallelRecommendationEngine: false as const,
  parallelDecisionRuntime: false as const,
  parallelExecutionRuntime: false as const,
  parallelObjectGraph: false as const,
  parallelAdvisor: false as const,
  newStageRuntime: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  stealsCenter: false as const,
  writesDataReality: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  changesExecution: false as const,
  inventsNumericEffects: false as const,
  inventsCost: false as const,
  inventsRoi: false as const,
  ei4Authority: "EI:4/ScenarioPriorityTradeoffIntelligence" as const,
  cc9Authority: "CC:9/ScenarioConversation" as const,
});

export const SCENARIO_DISCOVERY_STATES = Object.freeze([
  "NOT_STARTED",
  "ASSESSING_CONTEXT",
  "OPTIONS_NEEDED",
  "OPTIONS_FOUND",
  "CLARIFYING_OPTIONS",
  "SCENARIOS_FORMING",
  "SCENARIOS_PARTIAL",
  "SCENARIOS_SUFFICIENT",
  "SCENARIO_OBJECTS_READY",
  "SCENARIO_CONTEXT_ACTIVE",
  "READY_FOR_SCENARIO_COMPARISON",
] as const);

export type ScenarioDiscoveryState = (typeof SCENARIO_DISCOVERY_STATES)[number];

export type OptionFeasibility =
  | "UNKNOWN"
  | "POSSIBLE"
  | "CONSTRAINED"
  | "UNAVAILABLE"
  | "INVALID";

export type ScenarioStatus =
  | "DRAFT"
  | "POSSIBLE"
  | "CONSTRAINED"
  | "INVALID"
  | "READY_FOR_COMPARISON"
  | "UNKNOWN";

export type ScenarioEpistemic =
  | "KNOWN"
  | "INFERRED"
  | "UNKNOWN"
  | "PREDICTED";

export type ExecutiveScenarioAssumption = {
  readonly statement: string;
  readonly source: "MANAGER_STATED" | "CONTEXT" | "INFERRED";
  readonly epistemicStatus: "ASSUMED" | "KNOWN" | "UNKNOWN";
  readonly validated: boolean;
  readonly materiality: "MATERIAL" | "UNKNOWN";
};

export type ExecutiveOptionCandidate = {
  readonly optionId: string;
  readonly title: string;
  readonly description: string | null;
  readonly source: "MANAGER_STATED" | "OPPORTUNITY" | "CANONICAL" | "BASELINE" | "EVIDENCE";
  readonly sourceAuthority: string | null;
  readonly relatedGoalId: string | null;
  readonly relatedIssueIds: readonly string[];
  readonly relatedRealityIds: readonly string[];
  readonly requiredConditions: readonly string[];
  readonly constraints: readonly string[];
  readonly assumptions: readonly ExecutiveScenarioAssumption[];
  readonly evidence: readonly string[];
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly feasibility: OptionFeasibility;
  readonly validationStatus: OptionFeasibility;
  readonly managerStated: boolean;
  readonly existingCanonicalOption: boolean;
  readonly createsDecision: false;
  readonly startsExecution: false;
  readonly active: boolean;
};

export type ExecutiveScenarioObject = {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly source: ExecutiveOptionCandidate["source"];
  readonly relatedOptionId: string | null;
  readonly goalId: string | null;
  readonly issueIds: readonly string[];
  readonly realityIds: readonly string[];
  readonly assumptions: readonly ExecutiveScenarioAssumption[];
  readonly constraints: readonly string[];
  readonly expectedEffects: readonly string[];
  readonly risks: readonly string[];
  readonly opportunities: readonly string[];
  readonly unknowns: readonly string[];
  readonly timeHorizon: string | null;
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly epistemicStatus: ScenarioEpistemic;
  readonly scenarioStatus: ScenarioStatus;
  readonly managerConfirmed: boolean;
  readonly selected: false;
  readonly approved: false;
  readonly executing: false;
  readonly parentScenarioId: string | null;
  readonly reusedExisting: boolean;
  readonly letter: string;
};

export type NexoraScenarioComparisonHandoff = {
  readonly identityContext: unknown;
  readonly executiveContextObject: unknown;
  readonly activeGoal: unknown;
  readonly goalObject: unknown;
  readonly realityContext: unknown;
  readonly issueContext: unknown;
  readonly options: readonly ExecutiveOptionCandidate[];
  readonly scenarios: readonly ExecutiveScenarioObject[];
  readonly constraints: readonly string[];
  readonly assumptions: readonly ExecutiveScenarioAssumption[];
  readonly unknowns: readonly string[];
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly conversationContext: string;
  readonly comparisonStarted: false;
};

export type NexoraScenarioDiscoverySession = {
  readonly state: ScenarioDiscoveryState;
  readonly options: readonly ExecutiveOptionCandidate[];
  readonly scenarios: readonly ExecutiveScenarioObject[];
  readonly askedQuestionKeys: readonly string[];
  readonly introduced: boolean;
  readonly handoff: NexoraScenarioComparisonHandoff | null;
  readonly lastMutatedReality: null;
};

export function getNexoraScenarioDiscoveryExperienceIdentity() {
  return Object.freeze({
    id: nexoraScenarioDiscoveryExperienceIdentity,
    version: nexoraScenarioDiscoveryExperienceVersion,
    namespace: nexoraScenarioDiscoveryExperienceNamespace,
  });
}

export function verifyNexoraScenarioDiscoveryExperience(): { readonly ok: true } {
  if (
    getNexoraScenarioDiscoveryExperienceIdentity().id !==
    "NEX-EXP:5/ScenarioOptionDiscovery"
  ) {
    throw new Error("NEX-EXP:5 identity mismatch");
  }
  if (NEXORA_SCENARIO_DISCOVERY_BOUNDARY.startsNexExp6) {
    throw new Error("NEX-EXP:5 must not start NEX-EXP:6");
  }
  if (NEXORA_SCENARIO_DISCOVERY_BOUNDARY.commitsDecision) {
    throw new Error("NEX-EXP:5 must not commit decisions");
  }
  if (NEXORA_SCENARIO_DISCOVERY_BOUNDARY.writesDataReality) {
    throw new Error("NEX-EXP:5 must not write Data Reality");
  }
  return Object.freeze({ ok: true as const });
}
