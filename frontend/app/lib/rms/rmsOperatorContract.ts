/**
 * NPA-T RMS:3 — Operator Agent & Observable Data contracts.
 * Observable operational data is not Nexora Knowledge and not Ground Truth.
 */

export const rmsOperatorObservableIdentity = "NPA-T RMS:3/OperatorObservableData" as const;

export const RMS_OPERATIONAL_SOURCE_FAMILIES = Object.freeze([
  "ERP",
  "CRM",
  "PRODUCTION",
  "INVENTORY",
  "MAINTENANCE",
  "HR",
  "FINANCE",
  "PMO",
  "PROJECT_CONTROL",
] as const);

export type RmsOperationalSourceFamily = (typeof RMS_OPERATIONAL_SOURCE_FAMILIES)[number];

export const RMS_OBSERVATION_STATUSES = Object.freeze([
  "AVAILABLE",
  "DELAYED",
  "MISSING",
  "STALE",
] as const);

export type RmsObservationStatus = (typeof RMS_OBSERVATION_STATUSES)[number];

export const RMS_3_BOUNDARY = Object.freeze({
  identity: rmsOperatorObservableIdentity,
  ownsOperatorBehavior: true as const,
  ownsObservationPolicy: true as const,
  ownsSimulatedSources: true as const,
  ownsObservableRecords: true as const,
  ownsSimulationPublicationAdapter: true as const,
  ownsDataReality: false as const,
  ownsSemanticConfirmation: false as const,
  ownsEvidence: false as const,
  ownsObjects: false as const,
  ownsNmi: false as const,
  ownsVai: false as const,
  ownsAdvisor: false as const,
  ownsStage: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  ownsManagerConversation: false as const,
  parallelDataReality: false as const,
  parallelSemanticAuthority: false as const,
  publishesGroundTruthDirectlyToNexora: false as const,
  simulationConfirmsSemantics: false as const,
  startsRms4: false as const,
  gateApi: "RDI:1/NexoraRealDataIntegrationFoundation",
  dataRealityAuthority: "P0:1/NexoraDataRealityFoundation",
});

export type RmsObservableRecord = {
  readonly recordId: string;
  readonly simulationId: string;
  readonly runId: string;
  readonly sourceFamily: RmsOperationalSourceFamily;
  readonly sourceSystemId: string;
  readonly domain: RmsOperationalSourceFamily;
  readonly tick: number;
  readonly simulatedAt: string;
  readonly field: string;
  readonly value: string | number | boolean | null;
  readonly unit: string | null;
  readonly relatedEntityId: string | null;
  readonly status: RmsObservationStatus;
  readonly semanticConfirmation: false;
  readonly confirmedMeaning: null;
  readonly hiddenGroundTruthKey: null;
  readonly causalClaim: false;
  readonly observationProvenance: string;
};

export type RmsOperatorPermittedView = {
  readonly actorKind: "OPERATOR_AGENT";
  readonly tick: number;
  readonly simulatedAt: string;
  readonly worldKind: string;
  readonly values: Readonly<Record<string, string | number | boolean>>;
  readonly hiddenCausalRelationships: false;
};

export type RmsOperatorPublicationAttempt = {
  readonly attemptId: string;
  readonly tick: number;
  readonly accepted: boolean;
  readonly snapshotId: string | null;
  readonly datasetId: string | null;
  readonly destinationAuthority: "P0:1/NexoraDataRealityFoundation" | null;
  readonly leakedGroundTruth: false;
};
