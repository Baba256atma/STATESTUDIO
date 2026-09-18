/**
 * NPA-T RMS:10 — Experiment, Fork, and management-path comparison.
 * Simulation Outcome ≠ real-world prediction. No automatic winner.
 */

export const rmsExperimentIdentity = "NPA-T RMS:10/ExperimentForkComparison" as const;

export const RMS_EXPERIMENT_LIFECYCLES = Object.freeze(["PREPARING", "FORKED", "RUNNING", "COMPARING", "CLOSED"] as const);
export type RmsExperimentLifecycle = (typeof RMS_EXPERIMENT_LIFECYCLES)[number];

export const RMS_BRANCH_KINDS = Object.freeze(["BASELINE", "INTERVENTION"] as const);
export type RmsBranchKind = (typeof RMS_BRANCH_KINDS)[number];

export const RMS_SIMULATION_ACTION_STATUSES = Object.freeze(["SCHEDULED", "APPLIED", "EXPIRED", "UNSUPPORTED"] as const);
export type RmsSimulationActionStatus = (typeof RMS_SIMULATION_ACTION_STATUSES)[number];

export const RMS_10_MAX_BRANCHES = 3 as const;

export const RMS_10_BOUNDARY = Object.freeze({
  identity: rmsExperimentIdentity,
  interactionMode: "EXPERIMENT" as const,
  ownsExperimentLifecycle: true as const,
  ownsForkPoint: true as const,
  ownsBranchIdentity: true as const,
  ownsBranchIsolation: true as const,
  ownsSimulationActionMapping: true as const,
  ownsComparisonProjection: true as const,
  ownsGroundTruth: false as const,
  ownsOperator: false as const,
  ownsDataReality: false as const,
  ownsObserver: false as const,
  ownsEvents: false as const,
  ownsScenarioRegistry: false as const,
  ownsWatch: false as const,
  ownsTakeControl: false as const,
  ownsCc5: false as const,
  ownsNmi: false as const,
  ownsVai: false as const,
  ownsNps: false as const,
  ownsStage: false as const,
  ownsAdvisor: false as const,
  ownsDirector: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  writesCanonicalOutcome: false as const,
  writesDurableLearning: false as const,
  autoWinner: false as const,
  realWorldPrediction: false as const,
  inventsUnsupportedEffects: false as const,
  freeWorldEditing: false as const,
  parallelVai: false as const,
  parallelNps: false as const,
  parallelStage: false as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  decisionAuthority: "CC:10" as const,
  executionAuthority: "CC:11" as const,
  groundTruthTransitionAuthority: "RMS:2" as const,
  maxActiveBranches: RMS_10_MAX_BRANCHES,
  startsRms11: false as const,
});

export const RMS_SIMULATION_REAL_WORLD_NOTICE =
  "Simulation results reflect this modeled Scenario and its assumptions; they are not predictions of real-world outcomes." as const;

export type RmsForkPoint = {
  readonly forkPointId: string;
  readonly experimentId: string;
  readonly parentRunId: string;
  readonly parentWatchSessionId: string;
  readonly scenarioId: string;
  readonly version: string;
  readonly simulationId: string;
  readonly tick: number;
  readonly worldRef: string;
  readonly operatorRef: string;
  readonly dataRealityRef: string;
  readonly conversationRef: string;
  readonly stageRef: string;
  readonly eventLifecycleRef: string;
  readonly managerAuthority: "HUMAN_MANAGER";
  readonly observerTraceBoundary: string;
};

export type RmsExperiment = {
  readonly experimentId: string;
  readonly scenarioId: string;
  readonly version: string;
  readonly parentRunId: string;
  readonly parentWatchSessionId: string;
  readonly forkPointId: string;
  readonly forkTick: number;
  readonly createdAt: string;
  readonly createdBy: "HUMAN_MANAGER";
  readonly branchIds: readonly string[];
  readonly baselineBranchId: string;
  readonly lifecycle: RmsExperimentLifecycle;
  readonly selectedBranchId: string;
  readonly comparisonReady: boolean;
};

export type RmsSimulationAction = {
  readonly simulationActionId: string;
  readonly experimentId: string;
  readonly branchId: string;
  readonly sourceManagementActionRef: string;
  readonly actionType: string;
  readonly effectiveTick: number;
  readonly expireTick: number | null;
  readonly targetVariableId: string;
  readonly targetKey: string;
  readonly delta: number;
  readonly delayTicks: number;
  readonly durationTicks: number | null;
  readonly status: RmsSimulationActionStatus;
  readonly provenance: "management-action";
  readonly modeledAssumptions: readonly string[];
  readonly vaiProvenCausality: false;
  readonly realWorldPrediction: false;
};

export type RmsExperimentTraceEvent = {
  readonly eventId: string;
  readonly kind:
    | "FORK"
    | "BRANCH_CREATED"
    | "SAFE_BOUNDARY"
    | "SIMULATION_ACTION"
    | "UNSUPPORTED_ACTION"
    | "WORLD_TRANSITION"
    | "HUMAN_TURN"
    | "BRANCH_SWITCH"
    | "BRANCH_RESTART"
    | "COMPARISON";
  readonly atTick: number;
  readonly branchId: string | null;
  readonly ref: string;
};

export type RmsComparisonCell = {
  readonly experimentId: string;
  readonly branchId: string;
  readonly runId: string;
  readonly dimension: string;
  readonly value: string | number | boolean | null;
  readonly unit: string | null;
};

export type RmsExperimentComparison = {
  readonly experimentId: string;
  readonly forkTick: number;
  readonly notice: typeof RMS_SIMULATION_REAL_WORLD_NOTICE;
  readonly explanation: readonly string[];
  readonly assumptions: Readonly<Record<string, readonly string[]>>;
  readonly rows: readonly RmsComparisonCell[];
  readonly winner: null;
  readonly bestPath: null;
  readonly observerDiagnostics: false;
  readonly canonicalOutcome: false;
  readonly durableLearning: false;
};

export type RmsExperimentBranchView = {
  readonly branchId: string;
  readonly runId: string;
  readonly worldId: string;
  readonly label: string;
  readonly kind: RmsBranchKind;
  readonly tick: number;
  readonly paused: boolean;
  readonly inheritedTurnCount: number;
  readonly postForkHumanTurns: number;
  readonly simulationActions: readonly RmsSimulationAction[];
};

export type RmsExperimentView = {
  readonly experiment: RmsExperiment;
  readonly forkPoint: RmsForkPoint;
  readonly branches: readonly RmsExperimentBranchView[];
  readonly comparison: RmsExperimentComparison | null;
  readonly customerNotice: typeof RMS_SIMULATION_REAL_WORLD_NOTICE;
  readonly pausedAtFork: true;
};
