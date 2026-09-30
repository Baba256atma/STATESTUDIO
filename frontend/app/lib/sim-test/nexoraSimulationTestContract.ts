/**
 * NPA-T SIM-TEST:1 — contracts for testing real Nexora with certified RMS v1.
 * Test orchestration only: no product, simulation, Agent, Observer, or Stage authority.
 */

import type { RmsManagerProfileId } from "../rms/rmsManagerContract.ts";
import type { SimulationCsvFileVersion, SimulationCsvIngestionState, SimulationIngestionTrace } from "./nexoraSimulationCsvIngestion.ts";

export const nexoraSimulationTestHarnessIdentity =
  "NPA-T SIM-TEST:1/NexoraSimulationTestHarness" as const;

export const SIM_TEST_1_BOUNDARY = Object.freeze({
  identity: nexoraSimulationTestHarnessIdentity,
  rmsAuthority: "NPA-T RMS:1-10 + FINAL" as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  observerAuthority: "NPA-T RMS:5/ObserverIntelligence" as const,
  dataPath: "RMS Operator -> RDI -> Data Reality" as const,
  ownsScenarioSelection: false as const,
  ownsManagementIntelligence: false as const,
  ownsGroundTruth: false as const,
  ownsOperator: false as const,
  ownsManager: false as const,
  ownsObserver: false as const,
  ownsDataReality: false as const,
  ownsNmi: false as const,
  ownsMlevel: false as const,
  ownsStage: false as const,
  ownsConversation: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcomeLearning: false as const,
  answersManagerQuestions: false as const,
  mutatesGroundTruth: false as const,
  writesDataRealityDirectly: false as const,
  mutatesMlevel: false as const,
  mutatesStage: false as const,
  autoRepairs: false as const,
  createsRms11: false as const,
  ingestionImplemented: false as const,
});

export const SIM_TEST_MODES = Object.freeze(["FAST", "INGESTION"] as const);
export type NexoraSimulationTestMode = (typeof SIM_TEST_MODES)[number];

export const SIM_TEST_CHECKPOINT_KINDS = Object.freeze([
  "DATA_VISIBLE",
  "MANAGER_TURN_COMPLETED",
  "NEXORA_TURN_COMPLETED",
  "SUBJECT_SELECTED",
  "MLEVEL_STATE",
  "STAGE_STATE",
  "PROBLEM_AVAILABLE",
  "SCENARIO_AVAILABLE",
  "DECISION_STATE",
  "EXECUTION_STATE",
] as const);
export type NexoraSimulationTestCheckpointKind = (typeof SIM_TEST_CHECKPOINT_KINDS)[number];

export const SIM_TEST_FAILURE_OWNERS = Object.freeze([
  "RMS", "MANAGER_AGENT", "OPERATOR", "DATA_INGESTION", "DATA_REALITY", "NMI", "MLEVEL", "VAI", "NPS",
  "CC5_CONVERSATION", "REFERENT", "STAGE", "OVS", "DTH", "ADVISOR", "DECISION",
  "CC10_DECISION", "CC11_EXECUTION", "CORE_OUT", "OUTCOME", "LEARNING", "RDI_GATE",
  "DIRECTOR", "EXECUTION", "OUTCOME_LEARNING", "OBSERVER", "HARNESS", "TEST_HARNESS", "UNKNOWN",
  "CSV_PROJECTION", "CSV_FORMAT", "GATE", "SEMANTIC_MAPPING", "RDI", "NEXORA_CONSUMER",
] as const);
export type NexoraSimulationTestFailureOwner = (typeof SIM_TEST_FAILURE_OWNERS)[number];

export const SIM_TEST_SEVERITIES = Object.freeze(["S0", "S1", "S2", "S3"] as const);
export type NexoraSimulationTestSeverity = (typeof SIM_TEST_SEVERITIES)[number];

export const SIM_TEST_FORBIDDEN_JOURNEY_KEYS = Object.freeze([
  "expectedAnswer", "expectedReply", "correctAnswer", "correctProblem", "correctRisk",
  "preferredScenario", "winningDecision", "expectedRecommendation",
] as const);

export const SIM_TEST_MANAGER_JOURNEY_INTENTS = Object.freeze([
  "ORIENT", "INVESTIGATE", "FOCUS_PROBLEM", "REQUEST_EVIDENCE", "ASK_CAUSE",
  "CHALLENGE", "ASK_VARIABLES", "EXPLORE_OPTIONS", "CHANGE_CONTEXT", "FOLLOW_UP",
  "COMPARE", "RETURN_TO_SUBJECT", "CHECK_CHANGE", "REQUEST_PARENT", "REASSESS",
  "REQUEST_EXECUTION_BEFORE_COMMIT", "COMMIT_DECISION", "REQUEST_EXECUTION",
  "ASK_OUTCOME", "ASK_COUNTERFACTUAL", "REVERSE_DECISION", "UNSUPPORTED_ACTION",
  "ASK_LEARNING",
] as const);
export type NexoraSimulationManagerJourneyIntent = (typeof SIM_TEST_MANAGER_JOURNEY_INTENTS)[number];

export const SIM_TEST_3_BOUNDARY = Object.freeze({
  identity: "NPA-T SIM-TEST:3/RealManagerJourney" as const,
  managerAuthority: "NPA-T RMS:4/ManagerAgentConversation" as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  observerAuthority: "NPA-T RMS:5/ObserverIntelligence" as const,
  createsJourneyManager: false as const,
  createsConversationEngine: false as const,
  managerReadsGroundTruth: false as const,
  managerReadsObserver: false as const,
  suppliesHiddenReferent: false as const,
  createsEvidenceAuthority: false as const,
  bypassesDecision: false as const,
  autoRepairs: false as const,
  startsSimTest4: false as const,
});

export const SIM_TEST_4_BOUNDARY = Object.freeze({
  identity: "NPA-T SIM-TEST:4/MlevelStageJourneyStress" as const,
  managerAuthority: "NPA-T RMS:4/ManagerAgentConversation" as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  observerAuthority: "NPA-T RMS:5/ObserverIntelligence" as const,
  mlevelAuthority: "NPA-T MLEVEL:1/ManagementLevelPath" as const,
  stageInteraction: "selectNexoraMVPInteractionSubject" as const,
  createsNavigationAgent: false as const,
  createsStageAgent: false as const,
  createsMlevelAgent: false as const,
  redesignsMlevel: false as const,
  redesignsStage: false as const,
  simTestStageSync: false as const,
  managerReadsGroundTruth: false as const,
  suppliesHiddenReferent: false as const,
  autoRepairs: false as const,
  startsSimTest5: false as const,
});

export const SIM_TEST_5_BOUNDARY = Object.freeze({
  identity: "NPA-T SIM-TEST:5/DecisionExecutionOutcome" as const,
  managerAuthority: "NPA-T RMS:4/ManagerAgentConversation" as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  decisionAuthority: "CC:10" as const,
  executionAuthority: "CC:11" as const,
  outcomeAuthority: "CORE-OUT / NPS:8" as const,
  observerAuthority: "NPA-T RMS:5/ObserverIntelligence" as const,
  createsDecisionAgent: false as const,
  createsExecutionAgent: false as const,
  createsOutcomeAgent: false as const,
  createsLearningAgent: false as const,
  commitDecisionBackdoor: false as const,
  startExecutionBackdoor: false as const,
  writeOutcomeBackdoor: false as const,
  managerReadsGroundTruth: false as const,
  operatorWritesDecision: false as const,
  observerRepairs: false as const,
  autoRepairs: false as const,
  startsSimTest6: false as const,
});

export const SIM_TEST_6_BOUNDARY = Object.freeze({
  identity: "NPA-T SIM-TEST:6/LongSessionFailureDiscovery" as const,
  managerAuthority: "NPA-T RMS:4/ManagerAgentConversation" as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  decisionAuthority: "CC:10" as const,
  executionAuthority: "CC:11" as const,
  outcomeAuthority: "CORE-OUT / NPS:8" as const,
  observerAuthority: "NPA-T RMS:5/ObserverIntelligence" as const,
  createsLongSessionAgent: false as const,
  createsMemoryAgent: false as const,
  createsStressAgent: false as const,
  commitDecisionBackdoor: false as const,
  startExecutionBackdoor: false as const,
  managerReadsGroundTruth: false as const,
  observerRepairs: false as const,
  autoRepairs: false as const,
  startsSimTest6Fix: false as const,
  startsSimTestFinal: false as const,
});

export const SIM_TEST_7_BOUNDARY = Object.freeze({
  identity: "NPA-T SIM-TEST:7/RealManagerSimulationExpansion" as const,
  baseline: "NPA-T SIM-TEST:6 post-FIX18 FINAL" as const,
  managerAuthority: "NPA-T RMS:4/ManagerAgentConversation" as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  observerAuthority: "NPA-T RMS:5/ObserverIntelligence" as const,
  createsManagerRuntime: false as const,
  createsConversationEngine: false as const,
  createsGroundTruth: false as const,
  createsDataReality: false as const,
  createsRoadmap: false as const,
  createsStage: false as const,
  createsAdvisor: false as const,
  managerReadsGroundTruth: false as const,
  managerReadsObserver: false as const,
  observerRepairs: false as const,
  autoRepairs: false as const,
  startsFix: false as const,
});

export const SIM_TEST_8_ADAPTIVE_FAMILIES = Object.freeze([
  "CHANGE_BEFORE_QUESTION",
  "CHANGE_BETWEEN_TURNS",
  "CHANGE_DURING_INVESTIGATION",
  "CHANGE_DURING_SCENARIO",
  "CHANGE_AFTER_DECISION",
  "CHANGE_DURING_EXECUTION",
  "RECOVERY",
  "HIDDEN_CHANGE",
  "DELAYED_OBSERVATION",
  "COMPETING_CHANGES",
] as const);
export type NexoraSimulationAdaptiveFamily = (typeof SIM_TEST_8_ADAPTIVE_FAMILIES)[number];

export const SIM_TEST_8_BOUNDARY = Object.freeze({
  identity: "NPA-T SIM-TEST:8/AdaptiveRealManagerSimulation" as const,
  baseline: "NPA-T SIM-TEST:7 CERTIFIED" as const,
  managerAuthority: "NPA-T RMS:4/ManagerAgentConversation" as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  observerAuthority: "NPA-T RMS:5/ObserverIntelligence" as const,
  eventAuthority: "NPA-T RMS:6/EventsDisturbances" as const,
  createsEventEngine: false as const,
  createsWorld: false as const,
  createsManagerRuntime: false as const,
  createsConversationEngine: false as const,
  createsGroundTruth: false as const,
  createsDataReality: false as const,
  createsRoadmap: false as const,
  createsStage: false as const,
  createsAdvisor: false as const,
  managerReadsGroundTruth: false as const,
  managerReadsObserver: false as const,
  observerRepairs: false as const,
  autoRepairs: false as const,
  startsFix: false as const,
});

export const SIM_TEST_JOURNEY_FINDING_TYPES = Object.freeze([
  "SUBJECT_LOSS",
  "STALE_REFERENT",
  "WRONG_REFERENT",
  "CONTEXT_OVERRIDE",
  "STALE_DATA_USE",
  "UNSUPPORTED_CAUSAL_CLAIM",
  "UNSUPPORTED_FACT",
  "FALSE_CERTAINTY",
  "FAILURE_TO_HANDLE_AMBIGUITY",
  "STALE_EVIDENCE",
  "CURRENT_STATE_IGNORED",
  "TEMPORAL_CONFUSION",
  "MLEVEL_DIVERGENCE",
  "STAGE_DIVERGENCE",
  "ADVISOR_DIVERGENCE",
  "REPEATED_CLARIFICATION",
  "CONVERSATION_LOOP",
  "CROSS_SUBJECT_CONTAMINATION",
  "EVIDENCE_MISMATCH",
  "STALE_L1",
  "STALE_PARENT",
  "STALE_GRANDPARENT",
  "STAGE_SUBJECT_DIVERGENCE",
  "STALE_STAGE_FOCUS",
  "REFERENT_DIVERGENCE",
  "CROSS_BRANCH_ANCESTOR_LEAK",
  "IDENTITY_DRIFT",
  "INTERACTION_DESYNC",
  "DATA_SNAPSHOT_RESTORE",
  "CONTEXT_OSCILLATION",
  "CROSS_RUN_LEAK",
  "PREMATURE_DECISION",
  "MISSING_DECISION",
  "DUPLICATE_DECISION",
  "DECISION_IDENTITY_DRIFT",
  "PREMATURE_EXECUTION",
  "MISSING_EXECUTION",
  "DUPLICATE_EXECUTION",
  "WRONG_EXECUTION_REFERENT",
  "GROUND_TRUTH_LEAK",
  "PREMATURE_OUTCOME",
  "STALE_OUTCOME",
  "UNSUPPORTED_OUTCOME",
  "OUTCOME_IDENTITY_DRIFT",
  "PREMATURE_LEARNING",
  "SIMULATION_LEARNING_LEAK",
  "DUPLICATE_LEARNING",
  "DATA_EXECUTION_DESYNC",
  "LIFECYCLE_ORDER_VIOLATION",
  "ADVISOR_LIFECYCLE_DIVERGENCE",
] as const);
export type NexoraSimulationJourneyFindingType = (typeof SIM_TEST_JOURNEY_FINDING_TYPES)[number];

export const SIM_TEST_CONTINUITY_STATUSES = Object.freeze(["PASS", "FAIL", "NOT-EXERCISED"] as const);
export type NexoraSimulationContinuityStatus = (typeof SIM_TEST_CONTINUITY_STATUSES)[number];

export type NexoraSimulationJourneyTurnObservation = Readonly<{
  turn: number;
  tick: number;
  intent: NexoraSimulationManagerJourneyIntent | null;
  utterance: string;
  deictic: boolean;
  intendedSubject: string | null;
  response: string;
  conversationSubjectId: string | null;
  canonicalSubjectId: string | null;
  focusedSubjectLabel: string | null;
  nmiCanonicalId: string | null;
  advisorReferentId: string | null;
  advisorReferentName: string | null;
  mlevelL1: string | null;
  mlevelL2: string | null;
  mlevelL3: string | null;
  mlevelVisibleDepth: number;
  ancestorApplicable: "CANONICAL" | "NOT_APPLICABLE";
  stageActiveSubjectId: string | null;
  stageSelectedObjectId: string | null;
  sceneIntent: string | null;
  clarificationRequired: boolean;
  decisionStatus: string | null;
  npsState: string | null;
  npsProblemLabel: string | null;
  vaiFocalObjectId: string | null;
  vaiRoleSummaries: readonly string[];
  dataPublicationIds: readonly string[];
  csvVersions: readonly { readonly sourceType: string; readonly version: number; readonly tick: number }[];
  visibleNumbers: Readonly<Record<string, number>>;
  observerHiddenNumbers?: Readonly<Record<string, number>>;
  problemId?: string | null;
  scenarioId?: string | null;
  decisionId?: string | null;
  decisionCount?: number;
  executionId?: string | null;
  executionCount?: number;
  executionStatus?: string | null;
  npsOutcomeStatus?: string | null;
  npsResolutionStatus?: string | null;
  npsLearningStatus?: string | null;
  npsLearningDurable?: boolean;
  nxa3OutcomeState?: string | null;
  worldAdvancedUnpublished?: boolean;
  epistemicMarks: readonly string[];
}>;

export type NexoraSimulationFreshnessRecord = Readonly<{
  turn: number;
  tick: number;
  latestIngestionTick: number | null;
  dataRealityRefs: readonly string[];
  csvVersions: readonly { readonly sourceType: string; readonly version: number }[];
}>;

export type NexoraSimulationContinuitySummary = Readonly<{
  conversationContinuity: NexoraSimulationContinuityStatus;
  referentContinuity: NexoraSimulationContinuityStatus;
  nmiIdentityContinuity: NexoraSimulationContinuityStatus;
  mlevelContinuity: NexoraSimulationContinuityStatus;
  stageContinuity: NexoraSimulationContinuityStatus;
  advisorContinuity: NexoraSimulationContinuityStatus;
  ancestorContinuity: NexoraSimulationContinuityStatus;
  interactionContinuity: NexoraSimulationContinuityStatus;
  historicalReturnContinuity: NexoraSimulationContinuityStatus;
  identityPreservation: NexoraSimulationContinuityStatus;
  dataFreshness: NexoraSimulationContinuityStatus;
  evidenceSafety: NexoraSimulationContinuityStatus;
  causalSafety: NexoraSimulationContinuityStatus;
  decisionDeferredLegitimately: boolean;
}>;

export type NexoraSimulationManagerFirewall = Readonly<{
  groundTruthAccess: false;
  observerKnowledge: false;
  sealedGroundTruth: false;
}>;

export type NexoraSimulationTestJourneyStep = Readonly<
  | { kind: "PUBLISH_OBSERVABLE_DATA"; atTick: number }
  | { kind: "ADVANCE_WORLD"; atTick: number }
  | {
      kind: "MANAGER_TURN";
      utterance?: string;
      managementIntent?: NexoraSimulationManagerJourneyIntent;
      intendedSubject?: string;
      deictic?: boolean;
    }
  | { kind: "CAPTURE"; checkpoints: readonly NexoraSimulationTestCheckpointKind[] }
  | {
      kind: "INTERACT_VISIBLE";
      surface: "STAGE_FOCUSED" | "STAGE_VISIBLE_OTHER" | "MLEVEL_L2" | "MLEVEL_L3";
    }
>;

export type NexoraSimulationTestJourney = Readonly<{
  journeyId: string;
  version: string;
  title: string;
  scenarioId: string;
  scenarioVersion: string;
  managerProfileId: RmsManagerProfileId;
  behaviorSeed?: number;
  conversationLength?: "short" | "medium" | "long";
  adaptiveFamily?: NexoraSimulationAdaptiveFamily;
  adaptiveEventPack?: "SCENARIO" | "MACHINE_RECOVERY";
  startingMode: "WATCH";
  mode: NexoraSimulationTestMode;
  boundedDurationTicks: number;
  turnBudget: number;
  maxRepeatedClarificationAttempts?: number;
  maxUnresolvedLoops?: number;
  maxNavigationCycles?: number;
  disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE";
  requiredCheckpoints: readonly NexoraSimulationTestCheckpointKind[];
  targetSurfaces: readonly string[];
  stopConditions: readonly ("TURN_BUDGET" | "TICK_BUDGET" | "S0" | "RUNTIME_ERROR" | "JOURNEY_COMPLETE")[];
  steps: readonly NexoraSimulationTestJourneyStep[];
}>;

export type NexoraSimulationTestCheckpoint = Readonly<{
  checkpointId: string;
  kind: NexoraSimulationTestCheckpointKind;
  tick: number;
  managerTurn: number;
  operatorRecordIds: readonly string[];
  dataRealityPublicationIds: readonly string[];
  managerUtterance: string | null;
  nexoraResponse: string | null;
  canonicalSubjectId: string | null;
  conversationSubjectId: string | null;
  clarificationRequired: boolean | null;
  mlevel: Readonly<{
    l1ActiveId: string | null;
    l2ParentId: string | null;
    l3GrandparentId: string | null;
    visibleDepth: number;
    authority: "NPA-T MLEVEL:1/ManagementLevelPath";
  }>;
  stage: Readonly<{
    activeSubjectId: string | null;
    selectedObjectId: string | null;
    workspace: string | null;
    sceneIntent: string | null;
    visibleObjectIds: readonly string[];
  }>;
  decisionStatus: string | null;
  executionCount: number;
  problemAvailable: boolean;
  scenarioAvailable: boolean;
  outcomeState: string | null;
  learningState: string | null;
  writeAttempted: false;
}>;

export type NexoraSimulationTestFinding = Readonly<{
  findingId: string;
  testRunId: string;
  journeyId: string;
  scenarioId: string;
  scenarioVersion: string;
  rmsRunId: string;
  tick: number;
  managerTurn: number;
  visibleDataRefs: readonly string[];
  activeCanonicalSubjectId: string | null;
  mlevelActiveId: string | null;
  stageActiveSubjectId: string | null;
  observedBehavior: string;
  expectedInvariant: string;
  classification: string;
  severity: NexoraSimulationTestSeverity;
  likelyOwner: NexoraSimulationTestFailureOwner;
  traceReferences: readonly string[];
  repaired: false;
}>;

export type NexoraSimulationTestRunIdentity = Readonly<{
  simulationTestRunId: string;
  journeyId: string;
  journeyVersion: string;
  scenarioId: string;
  scenarioVersion: string;
  rmsSimulationId: string;
  rmsRunId: string;
  managerProfileId: RmsManagerProfileId;
  mode: NexoraSimulationTestMode;
  startedAt: string;
  endedAt: string;
  observerReportRef: string;
  finalStatus: "COMPLETED" | "STOPPED" | "ERROR";
}>;

export type NexoraSimulationTestRunReport = Readonly<{
  identity: NexoraSimulationTestRunIdentity;
  harnessStatus: "PASS" | "FAIL";
  productStatus: "PASS" | "FAIL";
  stopReason: "TURN_BUDGET" | "TICK_BUDGET" | "S0" | "RUNTIME_ERROR" | "JOURNEY_COMPLETE";
  turns: number;
  ticks: number;
  checkpoints: readonly NexoraSimulationTestCheckpoint[];
  findings: readonly NexoraSimulationTestFinding[];
  findingCounts: Readonly<Record<NexoraSimulationTestSeverity, number>>;
  deterministicSignature: string;
  autoRepairAttempted: false;
  ingestionActivated: boolean;
  ingestion: Readonly<{
    files: readonly SimulationCsvFileVersion[];
    states: readonly SimulationCsvIngestionState[];
    traces: readonly SimulationIngestionTrace[];
  }> | null;
  journeyObservations: readonly NexoraSimulationJourneyTurnObservation[];
  journeyFindings: readonly NexoraSimulationTestFinding[];
  continuity: NexoraSimulationContinuitySummary;
  freshness: readonly NexoraSimulationFreshnessRecord[];
  managerFirewall: NexoraSimulationManagerFirewall | null;
  adaptiveTrace: Readonly<{
    worldAdvances: number;
    publications: number;
    unpublishedAsks: number;
    eventTraces: number;
    hiddenFromNexora: true;
    hiddenFromManager: true;
    writeAttempted: false;
  }> | null;
  error: string | null;
}>;

export type NexoraSimulationTestAggregateReport = Readonly<{
  suiteId: string;
  journeysRun: number;
  domainsExercised: readonly string[];
  turns: number;
  simulationTicks: number;
  findingsBySeverity: Readonly<Record<NexoraSimulationTestSeverity, number>>;
  findingsByOwner: Readonly<Partial<Record<NexoraSimulationTestFailureOwner, number>>>;
  reproducible: boolean;
  harnessFailures: number;
  productFailures: number;
  crossRunIsolation: "PASS" | "FAIL";
  reports: readonly NexoraSimulationTestRunReport[];
}>;
