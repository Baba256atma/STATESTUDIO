/**
 * NPA-T RMS:5 — Observer measurement contracts.
 * Observer inspects and measures. It does not own Nexora, Data Reality, VAI, Evidence, or repair.
 */

export const rmsObserverIntelligenceIdentity = "NPA-T RMS:5/ObserverIntelligence" as const;

export const RMS_OBSERVER_LAYERS = Object.freeze(["GROUND_TRUTH", "OBSERVABLE", "NEXORA", "MANAGER"] as const);
export type RmsObserverLayer = (typeof RMS_OBSERVER_LAYERS)[number];

export const RMS_OBSERVER_TAXONOMY = Object.freeze([
  "OPERATOR_ERROR",
  "DATA_ERROR",
  "NEXORA_ERROR",
  "CONVERSATION_ERROR",
  "MANAGER_ERROR",
  "SIMULATION_ERROR",
  "RUNTIME_ERROR",
  "NO_ERROR",
] as const);
export type RmsObserverTaxonomy = (typeof RMS_OBSERVER_TAXONOMY)[number];

export const RMS_OBSERVER_SUBTYPES = Object.freeze([
  "OBSERVATION_GAP",
  "PUBLICATION_GAP",
  "INTERPRETATION_ERROR",
  "CAUSAL_OVERCLAIM",
  "REFERENT_ERROR",
  "KNOWLEDGE_LEAK",
  "FIREWALL_VIOLATION",
  "UNAUTHORIZED_MUTATION",
  "MISSING_TRACE",
  "EXCEPTION",
  "NONE",
] as const);
export type RmsObserverSubtype = (typeof RMS_OBSERVER_SUBTYPES)[number];

export const RMS_OBSERVER_SEVERITIES = Object.freeze(["INFO", "WARNING", "FAILURE", "CRITICAL_CONTRACT_FAILURE"] as const);
export type RmsObserverSeverity = (typeof RMS_OBSERVER_SEVERITIES)[number];

export const RMS_OBSERVER_STATUSES = Object.freeze(["MATCH", "DIVERGENT", "UNCERTAIN", "GAP", "VIOLATION"] as const);
export type RmsObserverStatus = (typeof RMS_OBSERVER_STATUSES)[number];

export const RMS_EXPECTATION_KINDS = Object.freeze(["GROUND_TRUTH_EXPECTED", "INFORMATION_BOUNDED"] as const);
export type RmsExpectationKind = (typeof RMS_EXPECTATION_KINDS)[number];

export const RMS_5_BOUNDARY = Object.freeze({
  identity: rmsObserverIntelligenceIdentity,
  ownsMeasurementContracts: true as const,
  ownsTaxonomy: true as const,
  ownsDivergenceRecords: true as const,
  ownsTraceLinkage: true as const,
  ownsFindings: true as const,
  ownsErrorOwnershipClassification: true as const,
  ownsGroundTruth: false as const,
  ownsDataReality: false as const,
  ownsEvidence: false as const,
  ownsNmi: false as const,
  ownsVai: false as const,
  ownsObjects: false as const,
  ownsStage: false as const,
  ownsAdvisor: false as const,
  ownsConversationInterpretation: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  ownsRepair: false as const,
  parallelEvidence: false as const,
  parallelDataReality: false as const,
  parallelVai: false as const,
  parallelNmi: false as const,
  parallelAdvisor: false as const,
  leaksGroundTruthToManager: false as const,
  leaksGroundTruthToNexora: false as const,
  hiddenTruthIsNexoraDuty: false as const,
  silentlyRepairs: false as const,
  numericalScoring: false as const,
  startsRms6: false as const,
  causalSafetyOwner: "VAI:3 / CORE-INT:3" as const,
  evidenceOwner: "CC:8" as const,
});

export type RmsObserverMeasurement = {
  readonly measurementId: string;
  readonly simulationId: string;
  readonly runId: string;
  readonly tick: number;
  readonly simulatedAt: string;
  readonly actorOrSubsystem: string;
  readonly category: RmsObserverLayer | "TRACE" | "RUNTIME" | "SIMULATION";
  readonly expectationKind: RmsExpectationKind;
  readonly expected: string | null;
  readonly observed: string | null;
  readonly status: RmsObserverStatus;
  readonly taxonomy: RmsObserverTaxonomy;
  readonly subtype: RmsObserverSubtype;
  readonly traceRefs: readonly string[];
  readonly confidence: "high" | "medium" | "low" | null;
  readonly classification: string;
  readonly notes: string;
  readonly repaired: false;
};

export type RmsObserverFinding = {
  readonly findingId: string;
  readonly taxonomy: RmsObserverTaxonomy;
  readonly subtype: RmsObserverSubtype;
  readonly severity: RmsObserverSeverity;
  readonly tick: number;
  readonly measurementIds: readonly string[];
  readonly primaryOwnership: RmsObserverTaxonomy;
  readonly downstreamEffects: readonly string[];
  readonly explanation: string;
  readonly repaired: false;
};

export type RmsObserverTraceLink = {
  readonly traceId: string;
  readonly groundTruthRef: string | null;
  readonly observationRef: string | null;
  readonly publicationRef: string | null;
  readonly nexoraDataRef: string | null;
  readonly managerTurnRef: string | null;
  readonly nexoraResponseRef: string | null;
};

export type RmsLayerSnapshot = {
  readonly layer: RmsObserverLayer;
  readonly refs: readonly string[];
};
