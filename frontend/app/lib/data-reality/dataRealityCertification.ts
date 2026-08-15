/**
 * P0:6 — Nexora Data Reality End-to-End Certification.
 *
 * Verification + certification of the P0 vertical slice.
 * Does not redesign Stage, add business rules, or expand P0 scope.
 *
 * Certified chain:
 *   Dataset → Facts → Objects → KPIs → Executive Meaning
 *     → Runtime Projection → Stage Presentation
 */

export const dataRealityCertificationIdentity =
  "P0:6/NexoraDataRealityEndToEndCertification" as const;

export const dataRealityCertificationVersion = "1.0.0" as const;

export const dataRealityCertificationNamespace =
  "nexora.data-reality.end-to-end-certification" as const;

export const dataRealityCertificationPhase =
  "EndToEndDataRealityVerification" as const;

export const dataRealityCertificationArchitecturalRole =
  "DataRealityVerticalSliceCertification" as const;

export type NexoraDataRealityCertificationStatus =
  | "Unverified"
  | "Verified"
  | "Certified"
  | "Stable"
  | "ReadyForMVP";

export const NEXORA_DATA_REALITY_CERTIFIED_INVARIANTS = Object.freeze([
  "DatasetDriven",
  "Deterministic",
  "ObjectBound",
  "KPIComputed",
  "ExecutiveStateResolved",
  "StageProjected",
  "IdentityStable",
  "StageIndependentBusinessLogic",
  "NoFabricatedMeaning",
  "InteractionIndependent",
  "WorkspaceIndependent",
  "PartialOwnership",
] as const);

export type NexoraDataRealityCertifiedInvariant =
  (typeof NEXORA_DATA_REALITY_CERTIFIED_INVARIANTS)[number];

/**
 * Known limitations that do not block P0 certification.
 */
export const NEXORA_DATA_REALITY_KNOWN_LIMITATIONS = Object.freeze([
  Object.freeze({
    id: "mvp-runtime-vocabulary",
    title: "MVP Runtime Vocabulary",
    detail:
      "Stage currently consumes local NEX-MVP status/attention through a compatibility bridge rather than direct REX/DRI Public Index semantics.",
  }),
  Object.freeze({
    id: "semantic-object-mapping",
    title: "Semantic Object Mapping",
    detail:
      "Production→Capacity, Warehouse→Inventory, Shipping→Delivery are explicit MVP compatibility adapters, not identity equivalence.",
  }),
  Object.freeze({
    id: "partial-object-coverage",
    title: "Partial Object Coverage",
    detail:
      "P0 Data Reality does not own Budget, Risk, or Demand. Cost has no meaningful KPI/state/Stage projection.",
  }),
  Object.freeze({
    id: "advisor-not-data-reality-aware",
    title: "Advisor",
    detail:
      "Advisor narrative is not yet Data-Reality-aware and may continue emphasizing Risk when P0-controlled objects become critical.",
  }),
  Object.freeze({
    id: "visual-language",
    title: "Visual Language",
    detail:
      "Current status-color/attention/scale/emissive presentation proves propagation but is not the final Nexora executive visual language.",
  }),
] as const);

/**
 * Manual browser visual evidence recorded during P0:5/P0:6 verification.
 */
export const NEXORA_DATA_REALITY_MANUAL_VISUAL_EVIDENCE = Object.freeze({
  baseline: Object.freeze({
    route: "/executive?dataset=baseline",
    observations: Object.freeze([
      "Revenue = normal presentation",
      "Capacity = attention presentation",
      "Inventory = attention presentation",
      "Delivery = attention presentation",
      "Customer = attention presentation",
      "Budget remains unaffected",
      "Risk retains existing critical Stage state",
    ]),
  }),
  operationalPressure: Object.freeze({
    route: "/executive?dataset=operational-pressure",
    observations: Object.freeze([
      "Revenue becomes attention",
      "Capacity becomes critical",
      "Inventory becomes critical",
      "Delivery becomes critical",
      "Customer becomes critical",
      "Budget remains unaffected",
      "Risk retains existing critical Stage state",
    ]),
  }),
  conclusion:
    "Different business data is visibly reaching the Stage without manual Stage status edits.",
} as const);

export const NEXORA_DATA_REALITY_CERTIFIED_PIPELINE = Object.freeze([
  "NexoraDataset",
  "normalizeDatasetToBusinessFacts",
  "bindBusinessFactsToNexoraObjects",
  "computeNexoraKPIs",
  "resolveObjectExecutiveStates",
  "NexoraDataRealitySnapshot",
  "projectDataRealityToExecutiveRuntime",
  "applyDataRealityProjectionsToStageCatalog",
  "deriveNexoraMVPStageInteractionPresentation",
] as const);

export type NexoraDataRealityCertificationCheck = {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
};

export type NexoraDataRealityCertificationResult = {
  readonly identity: typeof dataRealityCertificationIdentity;
  readonly version: typeof dataRealityCertificationVersion;
  readonly status: NexoraDataRealityCertificationStatus;
  readonly readiness: "ReadyForMVP" | "NotReady";
  readonly invariants: readonly NexoraDataRealityCertifiedInvariant[];
  readonly knownLimitations: typeof NEXORA_DATA_REALITY_KNOWN_LIMITATIONS;
  readonly pipeline: typeof NEXORA_DATA_REALITY_CERTIFIED_PIPELINE;
  readonly checks: readonly NexoraDataRealityCertificationCheck[];
  readonly certifiedAtContext: "deterministic-test-context";
};

const IDENTITY = Object.freeze({
  id: dataRealityCertificationIdentity,
  version: dataRealityCertificationVersion,
  namespace: dataRealityCertificationNamespace,
  phase: dataRealityCertificationPhase,
  architecturalRole: dataRealityCertificationArchitecturalRole,
});

export function getDataRealityCertificationIdentity() {
  return IDENTITY;
}

export function createDataRealityCertificationResult(
  checks: readonly NexoraDataRealityCertificationCheck[],
): NexoraDataRealityCertificationResult {
  const ok = checks.every((check) => check.ok);
  const status: NexoraDataRealityCertificationStatus = ok
    ? "ReadyForMVP"
    : "Unverified";

  return Object.freeze({
    identity: dataRealityCertificationIdentity,
    version: dataRealityCertificationVersion,
    // When all checks pass: Verified · Certified · Stable · ReadyForMVP
    status: ok ? "ReadyForMVP" : status,
    readiness: ok ? "ReadyForMVP" : "NotReady",
    invariants: NEXORA_DATA_REALITY_CERTIFIED_INVARIANTS,
    knownLimitations: NEXORA_DATA_REALITY_KNOWN_LIMITATIONS,
    pipeline: NEXORA_DATA_REALITY_CERTIFIED_PIPELINE,
    checks: Object.freeze([...checks]),
    certifiedAtContext: "deterministic-test-context",
  });
}

/** Multi-status label used in reports when certification passes. */
export const NEXORA_DATA_REALITY_P0_STATUS_LABEL =
  "Verified · Certified · Stable · ReadyForMVP" as const;
