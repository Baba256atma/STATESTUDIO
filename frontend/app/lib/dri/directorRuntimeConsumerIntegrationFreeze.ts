/**
 * DRI-8:8 — Director Runtime Consumer Integration Certification & Freeze.
 *
 * Final release-gate certification and freeze of the complete DRI-8 Consumer
 * Integration platform. No new runtime capability.
 *
 * DRI-8:7 answers: Is the adapter valid and compatible?
 * DRI-8:8 answers: Can the certified adapter be frozen as a stable contract?
 *
 * Lifecycle after successful freeze:
 * Certified · Compatible · Frozen · Locked · Stable · ReadyForPublicIndex
 *
 * Does NOT declare Released / ReadyForConsumer / SoleConsumerEntryPoint
 * (those belong to DRI-8:9).
 */

import {
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  certifyDirectorRuntimeConsumerAdapter,
  directorRuntimeConsumerAdapterCertification,
  directorRuntimeConsumerAdapterCertificationApiNames,
  directorRuntimeConsumerAdapterCertificationIdentity,
  directorRuntimeConsumerAdapterCertificationRegistry,
  verifyDirectorRuntimeConsumerAdapterCertification,
  type DirectorRuntimeConsumerAdapterCertification,
} from "@/app/lib/dri/directorRuntimeConsumerAdapterCertification";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerIntegrationFreezeIdentity =
  "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze" as const;
export const directorRuntimeConsumerIntegrationFreezeVersion = "8.8.0" as const;
export const directorRuntimeConsumerIntegrationFreezeNamespace =
  "nexora.dri.consumer-integration.freeze" as const;
export const directorRuntimeConsumerIntegrationFreezeUpstream =
  directorRuntimeConsumerAdapterCertificationIdentity;

export const directorRuntimeConsumerIntegrationFreezeCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeConsumerIntegrationFreezeIdentity,
    version: directorRuntimeConsumerIntegrationFreezeVersion,
    namespace: directorRuntimeConsumerIntegrationFreezeNamespace,
    upstream: directorRuntimeConsumerIntegrationFreezeUpstream,
  });

// ─── Lock ───────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK =
  "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED" as const;

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK_STATUS =
  "locked" as const;

// ─── Status vocabularies ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_STATUSES =
  Object.freeze(["frozen", "not-frozen"] as const);
export type DirectorRuntimeConsumerIntegrationFreezeStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_STATUSES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_LOCK_STATUSES = Object.freeze([
  "locked",
  "unlocked",
] as const);
export type DirectorRuntimeConsumerIntegrationLockStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_LOCK_STATUSES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_STABILITY_STATUSES =
  Object.freeze(["stable", "unstable"] as const);
export type DirectorRuntimeConsumerIntegrationStabilityStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_STABILITY_STATUSES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_READINESS =
  Object.freeze([
    "ReadyForPublicIndex",
    "NotReadyForPublicIndex",
  ] as const);
export type DirectorRuntimeConsumerIntegrationPublicIndexReadiness =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_READINESS)[number];

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANT_IDS =
  Object.freeze([
    "DRI-8-FREEZE-INVARIANT-001",
    "DRI-8-FREEZE-INVARIANT-002",
    "DRI-8-FREEZE-INVARIANT-003",
    "DRI-8-FREEZE-INVARIANT-004",
    "DRI-8-FREEZE-INVARIANT-005",
    "DRI-8-FREEZE-INVARIANT-006",
    "DRI-8-FREEZE-INVARIANT-007",
    "DRI-8-FREEZE-INVARIANT-008",
    "DRI-8-FREEZE-INVARIANT-009",
    "DRI-8-FREEZE-INVARIANT-010",
    "DRI-8-FREEZE-INVARIANT-011",
    "DRI-8-FREEZE-INVARIANT-012",
    "DRI-8-FREEZE-INVARIANT-013",
    "DRI-8-FREEZE-INVARIANT-014",
    "DRI-8-FREEZE-INVARIANT-015",
    "DRI-8-FREEZE-INVARIANT-016",
    "DRI-8-FREEZE-INVARIANT-017",
    "DRI-8-FREEZE-INVARIANT-018",
    "DRI-8-FREEZE-INVARIANT-019",
    "DRI-8-FREEZE-INVARIANT-020",
    "DRI-8-FREEZE-INVARIANT-021",
    "DRI-8-FREEZE-INVARIANT-022",
  ] as const);
export type DirectorRuntimeConsumerIntegrationFreezeInvariantId =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANT_IDS)[number];

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-001",
      category: "dependency",
      statement: "linear dependency chain DRI-8:1→8:7 remains intact",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-002",
      category: "surfaces",
      statement: "six canonical experience surfaces preserved in order",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-003",
      category: "boundary",
      statement: "semantic-only consumer boundary frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-004",
      category: "context-binding",
      statement: "context-binding contract frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-005",
      category: "surface-binding",
      statement: "surface-binding contract frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-006",
      category: "state-projection",
      statement: "state-projection contract frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-007",
      category: "interaction-bridge",
      statement: "interaction-bridge contract and vocabulary frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-008",
      category: "coordination",
      statement: "coordination contract frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-009",
      category: "semantic-integrity",
      statement: "selection/focus distinction frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-010",
      category: "semantic-integrity",
      statement: "subject identity preservation frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-011",
      category: "coordination",
      statement: "minimal fan-out behavior frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-012",
      category: "coordination",
      statement: "unaffected-surface preservation frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-013",
      category: "boundary",
      statement: "browser-event isolation frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-014",
      category: "framework-independence",
      statement: "framework independence frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-015",
      category: "boundary",
      statement: "rendering isolation frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-016",
      category: "runtime-safety",
      statement: "Runtime non-mutation frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-017",
      category: "ownership",
      statement: "DRI-4 interaction orchestration non-duplication frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-018",
      category: "ownership",
      statement: "DRI-6 attention non-duplication frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-019",
      category: "ownership",
      statement: "DRI-7 guidance non-duplication frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-020",
      category: "business-isolation",
      statement: "KPI/KOI/business-logic isolation frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-021",
      category: "determinism",
      statement: "determinism frozen",
    }),
    Object.freeze({
      id: "DRI-8-FREEZE-INVARIANT-022",
      category: "immutability",
      statement: "immutability frozen",
    }),
  ] as const);

export type DirectorRuntimeConsumerIntegrationFreezeInvariant =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS)[number];

// ─── Export categories ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FROZEN_EXPORT_CATEGORIES =
  Object.freeze([
    "identity",
    "public-types",
    "consumer-context-apis",
    "surface-binding-apis",
    "state-projection-apis",
    "interaction-bridge-apis",
    "coordination-apis",
    "validation-verifier-apis",
    "certification-information",
    "freeze-information",
    "registry-information",
  ] as const);
export type DirectorRuntimeConsumerIntegrationFrozenExportCategory =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FROZEN_EXPORT_CATEGORIES)[number];

export interface DirectorRuntimeConsumerIntegrationFrozenExport {
  readonly exportName: string;
  readonly category: DirectorRuntimeConsumerIntegrationFrozenExportCategory;
  readonly sourceIdentity: string;
  readonly approvalStatus: "approved";
}

function frozenExport(
  exportName: string,
  category: DirectorRuntimeConsumerIntegrationFrozenExportCategory,
  sourceIdentity: string,
): DirectorRuntimeConsumerIntegrationFrozenExport {
  return Object.freeze({
    exportName,
    category,
    sourceIdentity,
    approvalStatus: "approved" as const,
  });
}

const ID_8_1 = "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation";
const ID_8_2 = "DRI-8:2/DirectorRuntimeConsumerContextBinding";
const ID_8_3 = "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding";
const ID_8_4 = "DRI-8:4/DirectorRuntimeExperienceStateProjection";
const ID_8_5 = "DRI-8:5/DirectorRuntimeConsumerInteractionBridge";
const ID_8_6 = "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform";
const ID_8_7 = "DRI-8:7/DirectorRuntimeConsumerAdapterCertification";
const ID_8_8 = "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze";

/**
 * Approved frozen consumer surface for DRI-8:9.
 * Names only — no wrappers; DRI-8:9 re-exports upstream implementations.
 */
export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS =
  Object.freeze([
    // Identity
    frozenExport(
      "getDirectorRuntimeConsumerIntegrationFoundationIdentity",
      "identity",
      ID_8_1,
    ),
    frozenExport(
      "getDirectorRuntimeConsumerContextBindingIdentity",
      "identity",
      ID_8_2,
    ),
    frozenExport(
      "getDirectorRuntimeExperienceSurfaceBindingIdentity",
      "identity",
      ID_8_3,
    ),
    frozenExport(
      "getDirectorRuntimeExperienceStateProjectionIdentity",
      "identity",
      ID_8_4,
    ),
    frozenExport(
      "getDirectorRuntimeConsumerInteractionBridgeIdentity",
      "identity",
      ID_8_5,
    ),
    frozenExport(
      "getDirectorRuntimeExperienceCoordinationPlatformIdentity",
      "identity",
      ID_8_6,
    ),
    frozenExport(
      "getDirectorRuntimeConsumerAdapterCertificationIdentity",
      "identity",
      ID_8_7,
    ),
    frozenExport(
      "getDirectorRuntimeConsumerIntegrationFreezeIdentity",
      "identity",
      ID_8_8,
    ),
    // Public types / vocabulary lists
    frozenExport(
      "listDirectorRuntimeExperienceSurfaces",
      "public-types",
      ID_8_1,
    ),
    frozenExport(
      "listDirectorRuntimeConsumerInteractionKinds",
      "public-types",
      ID_8_5,
    ),
    frozenExport(
      "listDirectorRuntimeExperiencePresentationStates",
      "public-types",
      ID_8_4,
    ),
    frozenExport(
      "listDirectorRuntimeExperienceCoordinationStatuses",
      "public-types",
      ID_8_6,
    ),
    frozenExport(
      "listDirectorRuntimeExperienceSurfaceRoles",
      "public-types",
      ID_8_6,
    ),
    frozenExport(
      "DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES",
      "public-types",
      ID_8_7,
    ),
    frozenExport(
      "DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS",
      "public-types",
      ID_8_7,
    ),
    frozenExport(
      "DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES",
      "public-types",
      ID_8_7,
    ),
    // Consumer context APIs
    frozenExport(
      "bindDirectorRuntimeConsumerContext",
      "consumer-context-apis",
      ID_8_2,
    ),
    frozenExport(
      "resolveDirectorRuntimeConsumerContext",
      "consumer-context-apis",
      ID_8_2,
    ),
    frozenExport(
      "validateDirectorRuntimeConsumerContext",
      "consumer-context-apis",
      ID_8_2,
    ),
    // Surface binding APIs
    frozenExport(
      "bindDirectorRuntimeExperienceSurfaces",
      "surface-binding-apis",
      ID_8_3,
    ),
    frozenExport(
      "resolveDirectorRuntimeExperienceSurfaceBinding",
      "surface-binding-apis",
      ID_8_3,
    ),
    frozenExport(
      "validateDirectorRuntimeExperienceSurfaceBinding",
      "surface-binding-apis",
      ID_8_3,
    ),
    frozenExport(
      "getDirectorRuntimeExperienceSurfaceCapabilities",
      "surface-binding-apis",
      ID_8_3,
    ),
    // State projection APIs
    frozenExport(
      "projectDirectorRuntimeExperienceState",
      "state-projection-apis",
      ID_8_4,
    ),
    frozenExport(
      "resolveDirectorRuntimeExperienceStateProjection",
      "state-projection-apis",
      ID_8_4,
    ),
    frozenExport(
      "validateDirectorRuntimeExperienceStateProjection",
      "state-projection-apis",
      ID_8_4,
    ),
    // Interaction bridge APIs
    frozenExport(
      "bridgeDirectorRuntimeConsumerInteraction",
      "interaction-bridge-apis",
      ID_8_5,
    ),
    frozenExport(
      "resolveDirectorRuntimeConsumerInteractionIntent",
      "interaction-bridge-apis",
      ID_8_5,
    ),
    frozenExport(
      "validateDirectorRuntimeConsumerInteraction",
      "interaction-bridge-apis",
      ID_8_5,
    ),
    frozenExport(
      "isDirectorRuntimeConsumerInteractionSupported",
      "interaction-bridge-apis",
      ID_8_5,
    ),
    frozenExport(
      "getDirectorRuntimeSurfaceInteractionCapabilities",
      "interaction-bridge-apis",
      ID_8_5,
    ),
    // Coordination APIs
    frozenExport(
      "coordinateDirectorRuntimeExperience",
      "coordination-apis",
      ID_8_6,
    ),
    frozenExport(
      "resolveDirectorRuntimeExperienceCoordination",
      "coordination-apis",
      ID_8_6,
    ),
    frozenExport(
      "validateDirectorRuntimeExperienceCoordination",
      "coordination-apis",
      ID_8_6,
    ),
    frozenExport(
      "getDirectorRuntimeExperienceCoordinationRules",
      "coordination-apis",
      ID_8_6,
    ),
    // Validation / verifier APIs
    frozenExport(
      "verifyDirectorRuntimeConsumerIntegrationFoundation",
      "validation-verifier-apis",
      ID_8_1,
    ),
    frozenExport(
      "verifyDirectorRuntimeConsumerContextBinding",
      "validation-verifier-apis",
      ID_8_2,
    ),
    frozenExport(
      "verifyDirectorRuntimeExperienceSurfaceBinding",
      "validation-verifier-apis",
      ID_8_3,
    ),
    frozenExport(
      "verifyDirectorRuntimeExperienceStateProjection",
      "validation-verifier-apis",
      ID_8_4,
    ),
    frozenExport(
      "verifyDirectorRuntimeConsumerInteractionBridge",
      "validation-verifier-apis",
      ID_8_5,
    ),
    frozenExport(
      "verifyDirectorRuntimeExperienceCoordinationPlatform",
      "validation-verifier-apis",
      ID_8_6,
    ),
    // Certification information
    frozenExport(
      "certifyDirectorRuntimeConsumerAdapter",
      "certification-information",
      ID_8_7,
    ),
    frozenExport(
      "getDirectorRuntimeConsumerAdapterCompatibility",
      "certification-information",
      ID_8_7,
    ),
    frozenExport(
      "verifyDirectorRuntimeConsumerAdapterCertification",
      "certification-information",
      ID_8_7,
    ),
    frozenExport(
      "listDirectorRuntimeConsumerAdapterCertificationDomains",
      "certification-information",
      ID_8_7,
    ),
    frozenExport(
      "listDirectorRuntimeConsumerAdapterCertificationChecks",
      "certification-information",
      ID_8_7,
    ),
    // Freeze information
    frozenExport(
      "getDirectorRuntimeConsumerIntegrationPlatformLock",
      "freeze-information",
      ID_8_8,
    ),
    frozenExport(
      "listDirectorRuntimeConsumerIntegrationFreezeInvariants",
      "freeze-information",
      ID_8_8,
    ),
    frozenExport(
      "getDirectorRuntimeConsumerIntegrationApprovedFrozenExports",
      "freeze-information",
      ID_8_8,
    ),
    frozenExport(
      "freezeDirectorRuntimeConsumerIntegration",
      "freeze-information",
      ID_8_8,
    ),
    frozenExport(
      "verifyDirectorRuntimeConsumerIntegrationFreeze",
      "freeze-information",
      ID_8_8,
    ),
    frozenExport(
      "DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK",
      "freeze-information",
      ID_8_8,
    ),
    // Registry information
    frozenExport(
      "directorRuntimeConsumerAdapterCertificationRegistry",
      "registry-information",
      ID_8_7,
    ),
    frozenExport(
      "directorRuntimeConsumerIntegrationFreezeRegistry",
      "registry-information",
      ID_8_8,
    ),
    frozenExport(
      "DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN",
      "registry-information",
      ID_8_7,
    ),
  ] as const);

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES =
  Object.freeze([
    "certified",
    "compatible",
    "frozen",
    "locked",
    "stable",
    "semantic-only",
    "framework-independent",
    "surface-decoupled",
    "selection-focus-distinct",
    "identity-preserving",
    "minimal-fan-out",
    "preserve-unaffected-surfaces",
    "browser-event-independent",
    "rendering-independent",
    "business-logic-independent",
    "Runtime-non-mutating",
    "deterministic",
    "immutable",
    "ReadyForPublicIndex",
  ] as const);
export type DirectorRuntimeConsumerIntegrationFreezeGuarantee =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerIntegrationFreezeInvariantResult {
  readonly id: DirectorRuntimeConsumerIntegrationFreezeInvariantId;
  readonly category: string;
  readonly statement: string;
  readonly status: "passed" | "failed";
}

export interface DirectorRuntimeConsumerIntegrationFreezeProvenance {
  readonly sourceCertificationIdentity: string;
  readonly freezeIdentity: string;
  readonly certifiedPlatformIdentity: string;
  readonly lockedPlatformIdentity: string;
}

export interface DirectorRuntimeConsumerIntegrationFreezeResult {
  readonly certificationStatus: "certified" | "not-certified";
  readonly compatibilityStatus: "compatible" | "incompatible";
  readonly freezeStatus: DirectorRuntimeConsumerIntegrationFreezeStatus;
  readonly lockStatus: DirectorRuntimeConsumerIntegrationLockStatus;
  readonly stability: DirectorRuntimeConsumerIntegrationStabilityStatus;
  readonly readiness: DirectorRuntimeConsumerIntegrationPublicIndexReadiness;
  readonly lock: typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK | "none";
  readonly invariants: ReadonlyArray<
    DirectorRuntimeConsumerIntegrationFreezeInvariantResult
  >;
  readonly invariantCount: number;
  readonly passedInvariantCount: number;
  readonly failedInvariantCount: number;
  readonly approvedExportCount: number;
  readonly approvedFrozenExports: ReadonlyArray<
    DirectorRuntimeConsumerIntegrationFrozenExport
  >;
  readonly guarantees: ReadonlyArray<
    DirectorRuntimeConsumerIntegrationFreezeGuarantee
  >;
  readonly releasedDeclared: false;
  readonly readyForConsumerDeclared: false;
  readonly soleConsumerEntryPointDeclared: false;
  readonly provenance: DirectorRuntimeConsumerIntegrationFreezeProvenance;
}

export interface DirectorRuntimeConsumerIntegrationFreezeInput {
  readonly forceNotCertified?: boolean;
  readonly forceIncompatible?: boolean;
  readonly forceFailedInvariantId?:
    | DirectorRuntimeConsumerIntegrationFreezeInvariantId
    | string;
  readonly certificationOverride?: DirectorRuntimeConsumerAdapterCertification;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function certCheckPassed(
  certification: DirectorRuntimeConsumerAdapterCertification,
  checkId: string,
): boolean {
  const entry = certification.checks.find((check) => check.id === checkId);
  return entry?.status === "passed";
}

function evaluateExportManifestIntegrity(): boolean {
  const exports = DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS;
  const names = exports.map((entry) => entry.exportName);
  if (!unique(names)) return false;
  const categories = new Set<string>(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FROZEN_EXPORT_CATEGORIES,
  );
  const sources = new Set<string>([
    ...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN.map((entry) => entry.identity),
    ID_8_7,
    ID_8_8,
  ]);
  for (const entry of exports) {
    if (!categories.has(entry.category)) return false;
    if (!sources.has(entry.sourceIdentity)) return false;
    if (entry.approvalStatus !== "approved") return false;
  }
  return true;
}

function evaluateInvariants(
  certification: DirectorRuntimeConsumerAdapterCertification,
  verificationOk: boolean,
  forceFailedInvariantId?: string,
): ReadonlyArray<DirectorRuntimeConsumerIntegrationFreezeInvariantResult> {
  const certOk =
    certification.certificationStatus === "certified" &&
    certification.compatibilityStatus === "compatible" &&
    certification.summary.failedCheckCount === 0 &&
    verificationOk;

  const surfacesOk = exactOrder(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES],
    ["stage", "advisor", "insight", "live-lens", "timeline", "explorer"],
  ) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES]) &&
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES.length === 6;

  const interactionOk = exactOrder(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS],
    ["select", "focus", "activate", "hover", "navigate", "inspect", "dismiss"],
  );

  const presentationOk = exactOrder(
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES],
    ["minimum", "report", "operation"],
  );

  const chainOk =
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN.length === 6 &&
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN[0]?.identity === ID_8_1 &&
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN[5]?.identity === ID_8_6 &&
    certCheckPassed(certification, "DRI-8-CERT-DEPENDENCY-001") &&
    certCheckPassed(certification, "DRI-8-CERT-DEPENDENCY-002");

  const results: DirectorRuntimeConsumerIntegrationFreezeInvariantResult[] = [
    {
      id: "DRI-8-FREEZE-INVARIANT-001",
      category: "dependency",
      statement: "linear dependency chain DRI-8:1→8:7 remains intact",
      status: chainOk && certOk ? "passed" : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-002",
      category: "surfaces",
      statement: "six canonical experience surfaces preserved in order",
      status:
        surfacesOk &&
          certCheckPassed(certification, "DRI-8-CERT-FOUNDATION-001")
          ? "passed"
          : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-003",
      category: "boundary",
      statement: "semantic-only consumer boundary frozen",
      status:
        certOk &&
          DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES.includes(
            "semantic-only",
          )
          ? "passed"
          : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-004",
      category: "context-binding",
      statement: "context-binding contract frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-CONTEXT-001")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-005",
      category: "surface-binding",
      statement: "surface-binding contract frozen",
      status:
        certCheckPassed(certification, "DRI-8-CERT-SURFACE-001") &&
          certCheckPassed(certification, "DRI-8-CERT-SURFACE-002")
          ? "passed"
          : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-006",
      category: "state-projection",
      statement: "state-projection contract frozen",
      status:
        presentationOk &&
          certCheckPassed(certification, "DRI-8-CERT-PROJECTION-001")
          ? "passed"
          : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-007",
      category: "interaction-bridge",
      statement: "interaction-bridge contract and vocabulary frozen",
      status:
        interactionOk &&
          certCheckPassed(certification, "DRI-8-CERT-BRIDGE-001")
          ? "passed"
          : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-008",
      category: "coordination",
      statement: "coordination contract frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-COORD-001")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-009",
      category: "semantic-integrity",
      statement: "selection/focus distinction frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-SEMANTIC-001")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-010",
      category: "semantic-integrity",
      statement: "subject identity preservation frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-SEMANTIC-002")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-011",
      category: "coordination",
      statement: "minimal fan-out behavior frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-COORD-003")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-012",
      category: "coordination",
      statement: "unaffected-surface preservation frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-E2E-002")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-013",
      category: "boundary",
      statement: "browser-event isolation frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-BRIDGE-002")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-014",
      category: "framework-independence",
      statement: "framework independence frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-FRAMEWORK-001")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-015",
      category: "boundary",
      statement: "rendering isolation frozen",
      status:
        certCheckPassed(certification, "DRI-8-CERT-BOUNDARY-001") &&
          certCheckPassed(certification, "DRI-8-CERT-PROJECTION-002")
          ? "passed"
          : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-016",
      category: "runtime-safety",
      statement: "Runtime non-mutation frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-RUNTIME-001")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-017",
      category: "ownership",
      statement: "DRI-4 interaction orchestration non-duplication frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-BOUNDARY-002")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-018",
      category: "ownership",
      statement: "DRI-6 attention non-duplication frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-BOUNDARY-003")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-019",
      category: "ownership",
      statement: "DRI-7 guidance non-duplication frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-BOUNDARY-003")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-020",
      category: "business-isolation",
      statement: "KPI/KOI/business-logic isolation frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-RUNTIME-002")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-021",
      category: "determinism",
      statement: "determinism frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-DETERMINISM-001")
        ? "passed"
        : "failed",
    },
    {
      id: "DRI-8-FREEZE-INVARIANT-022",
      category: "immutability",
      statement: "immutability frozen",
      status: certCheckPassed(certification, "DRI-8-CERT-IMMUTABILITY-001")
        ? "passed"
        : "failed",
    },
  ];

  return Object.freeze(
    results.map((entry) => {
      const forced =
        forceFailedInvariantId != null &&
        entry.id === forceFailedInvariantId;
      return Object.freeze({
        ...entry,
        status: forced ? ("failed" as const) : entry.status,
      });
    }),
  );
}

function activeGuarantees(
  freezeSucceeded: boolean,
): ReadonlyArray<DirectorRuntimeConsumerIntegrationFreezeGuarantee> {
  if (!freezeSucceeded) {
    return Object.freeze(
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES.filter(
        (guarantee) =>
          guarantee !== "certified" &&
          guarantee !== "compatible" &&
          guarantee !== "frozen" &&
          guarantee !== "locked" &&
          guarantee !== "stable" &&
          guarantee !== "ReadyForPublicIndex",
      ),
    );
  }
  return DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES;
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function getDirectorRuntimeConsumerIntegrationFreezeIdentity():
  typeof directorRuntimeConsumerIntegrationFreezeCanonicalIdentity {
  return directorRuntimeConsumerIntegrationFreezeCanonicalIdentity;
}

export function getDirectorRuntimeConsumerIntegrationPlatformLock():
  typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK {
  return DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK;
}

export function listDirectorRuntimeConsumerIntegrationFreezeInvariants():
  ReadonlyArray<DirectorRuntimeConsumerIntegrationFreezeInvariant> {
  return DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS;
}

export function getDirectorRuntimeConsumerIntegrationApprovedFrozenExports():
  ReadonlyArray<DirectorRuntimeConsumerIntegrationFrozenExport> {
  return DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS;
}

export function freezeDirectorRuntimeConsumerIntegration(
  input: DirectorRuntimeConsumerIntegrationFreezeInput = {},
): DirectorRuntimeConsumerIntegrationFreezeResult {
  const liveCertification = certifyDirectorRuntimeConsumerAdapter();
  const liveVerification = verifyDirectorRuntimeConsumerAdapterCertification();

  const certification = input.certificationOverride ?? liveCertification;

  const certificationStatus: "certified" | "not-certified" =
    input.forceNotCertified
      ? "not-certified"
      : certification.certificationStatus === "certified" &&
          certification.summary.failedCheckCount === 0
      ? "certified"
      : "not-certified";

  const compatibilityStatus: "compatible" | "incompatible" =
    input.forceIncompatible
      ? "incompatible"
      : certification.compatibilityStatus === "compatible" &&
          certificationStatus === "certified"
      ? "compatible"
      : "incompatible";

  const verificationOk =
    !input.forceNotCertified &&
    !input.forceIncompatible &&
    input.certificationOverride == null
      ? liveVerification.ok
      : certificationStatus === "certified" &&
        compatibilityStatus === "compatible";

  const preconditionsOk =
    certificationStatus === "certified" &&
    compatibilityStatus === "compatible" &&
    verificationOk;

  const invariants = evaluateInvariants(
    certification,
    preconditionsOk,
    input.forceFailedInvariantId,
  );

  const exportIntegrityOk = evaluateExportManifestIntegrity();
  const failedInvariantCount = invariants.filter(
    (entry) => entry.status === "failed",
  ).length;
  const passedInvariantCount = invariants.length - failedInvariantCount;

  const freezeSucceededFinal =
    preconditionsOk &&
    failedInvariantCount === 0 &&
    exportIntegrityOk &&
    exactOrder(
      [...DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANT_IDS],
      invariants.map((entry) => entry.id),
    ) &&
    directorRuntimeConsumerAdapterCertification.declaresFreeze === false &&
    (input.certificationOverride == null
      ? liveCertification.readiness === "ready-for-freeze"
      : true);

  const freezeStatus: DirectorRuntimeConsumerIntegrationFreezeStatus =
    freezeSucceededFinal ? "frozen" : "not-frozen";
  const lockStatus: DirectorRuntimeConsumerIntegrationLockStatus =
    freezeSucceededFinal ? "locked" : "unlocked";
  const stability: DirectorRuntimeConsumerIntegrationStabilityStatus =
    freezeSucceededFinal ? "stable" : "unstable";
  const readiness: DirectorRuntimeConsumerIntegrationPublicIndexReadiness =
    freezeSucceededFinal
      ? "ReadyForPublicIndex"
      : "NotReadyForPublicIndex";

  return Object.freeze({
    certificationStatus,
    compatibilityStatus,
    freezeStatus,
    lockStatus,
    stability,
    readiness,
    lock: freezeSucceededFinal
      ? DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK
      : ("none" as const),
    invariants,
    invariantCount: invariants.length,
    passedInvariantCount,
    failedInvariantCount,
    approvedExportCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.length,
    approvedFrozenExports:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
    guarantees: activeGuarantees(freezeSucceededFinal),
    releasedDeclared: false,
    readyForConsumerDeclared: false,
    soleConsumerEntryPointDeclared: false,
    provenance: Object.freeze({
      sourceCertificationIdentity:
        directorRuntimeConsumerAdapterCertificationIdentity,
      freezeIdentity: directorRuntimeConsumerIntegrationFreezeIdentity,
      certifiedPlatformIdentity:
        "DRI-8/DirectorRuntimeConsumerIntegration",
      lockedPlatformIdentity: freezeSucceededFinal
        ? DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK
        : "none",
    }),
  });
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const directorRuntimeConsumerIntegrationFreezeApiNames = Object.freeze([
  "getDirectorRuntimeConsumerIntegrationFreezeIdentity",
  "getDirectorRuntimeConsumerIntegrationPlatformLock",
  "listDirectorRuntimeConsumerIntegrationFreezeInvariants",
  "getDirectorRuntimeConsumerIntegrationApprovedFrozenExports",
  "freezeDirectorRuntimeConsumerIntegration",
  "verifyDirectorRuntimeConsumerIntegrationFreeze",
] as const);

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "dependency",
    "certification",
    "compatibility",
    "freeze",
    "lock",
    "stability",
    "readiness",
    "invariants",
    "approved-frozen-surface",
    "guarantees",
    "provenance",
    "consumer-information",
  ] as const);

export const directorRuntimeConsumerIntegrationFreezeRegistry = Object.freeze({
  identity: directorRuntimeConsumerIntegrationFreezeIdentity,
  version: directorRuntimeConsumerIntegrationFreezeVersion,
  namespace: directorRuntimeConsumerIntegrationFreezeNamespace,
  dependency: directorRuntimeConsumerIntegrationFreezeUpstream,
  certificationStatuses: Object.freeze(["certified", "not-certified"] as const),
  compatibilityStatuses: Object.freeze(["compatible", "incompatible"] as const),
  freezeStatuses: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_STATUSES,
  freezeStatusCount:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_STATUSES.length,
  lockStatuses: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_LOCK_STATUSES,
  lockStatusCount: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_LOCK_STATUSES.length,
  stabilityStatuses: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_STABILITY_STATUSES,
  stabilityStatusCount:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_STABILITY_STATUSES.length,
  readinessStatuses:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_READINESS,
  readinessStatusCount:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_READINESS.length,
  platformLock: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK,
  invariants: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS.length,
  invariantIds: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANT_IDS,
  approvedFrozenExports:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
  approvedExportCount:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.length,
  exportCategories:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FROZEN_EXPORT_CATEGORIES,
  exportCategoryCount:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FROZEN_EXPORT_CATEGORIES.length,
  surfaces: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  surfaceCount: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES.length,
  interactionKinds: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  interactionKindCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS.length,
  presentationStates:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  presentationStateCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES.length,
  guarantees: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES,
  guaranteeCount: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES.length,
  chain: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN,
  chainStageCount: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN.length,
  certificationDomains: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS,
  certificationCheckIds:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS,
  certificationApiNames: directorRuntimeConsumerAdapterCertificationApiNames,
  certificationRegistry: directorRuntimeConsumerAdapterCertificationRegistry,
  registrySections:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_REGISTRY_SECTIONS,
  registrySectionCount:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_REGISTRY_SECTIONS.length,
  publicApis: directorRuntimeConsumerIntegrationFreezeApiNames,
  publicApiCount: directorRuntimeConsumerIntegrationFreezeApiNames.length,
});

export const directorRuntimeConsumerIntegrationFreeze = Object.freeze({
  phase: "DRI-8:8" as const,
  name: "DirectorRuntimeConsumerIntegrationFreeze" as const,
  identity: directorRuntimeConsumerIntegrationFreezeIdentity,
  namespace: directorRuntimeConsumerIntegrationFreezeNamespace,
  version: directorRuntimeConsumerIntegrationFreezeVersion,
  layer: "DirectorRuntimeConsumerIntegration" as const,
  role: "CertificationAndFreeze" as const,
  stage: "CertificationAndFreeze" as const,
  status: "FrozenReadyForPublicIndex" as const,
  upstreamDependency: directorRuntimeConsumerIntegrationFreezeUpstream,
  lock: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK,
  lockStatus: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK_STATUS,
  deterministic: true as const,
  frameworkIndependent: true as const,
  mutatesRuntimeState: false as const,
  introducesConsumerBehavior: false as const,
  certifiesAndFreezesOnly: true as const,
  noPublicIndex: true as const,
  noSoleConsumerEntryPoint: true as const,
  noRelease: true as const,
  readiness: "ReadyForPublicIndex" as const,
  philosophy:
    "freeze-certified-consumer-integration-without-new-behavior" as const,
  invariants: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS,
  approvedFrozenExports:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
  guarantees: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES,
  publicApiSurface: directorRuntimeConsumerIntegrationFreezeApiNames,
  registry: directorRuntimeConsumerIntegrationFreezeRegistry,
  adapterCertificationBoundary:
    "DRI-8:7-consumer-adapter-certification-only" as const,
  architecturalStatus:
    "Consumer Integration Frozen · Certified · Compatible · Locked · Stable · ReadyForPublicIndex · NotReleased" as const,
});

// Canonical successful freeze artifact (module load).
export const directorRuntimeConsumerIntegrationFreezeResult =
  freezeDirectorRuntimeConsumerIntegration();

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerIntegrationFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeConsumerIntegrationFreezeIdentity;
  readonly version: typeof directorRuntimeConsumerIntegrationFreezeVersion;
  readonly namespace: typeof directorRuntimeConsumerIntegrationFreezeNamespace;
  readonly dependency: typeof directorRuntimeConsumerIntegrationFreezeUpstream;
  readonly certificationStatus: "certified" | "not-certified";
  readonly compatibilityStatus: "compatible" | "incompatible";
  readonly freezeStatus: DirectorRuntimeConsumerIntegrationFreezeStatus;
  readonly lock: typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK | "none";
  readonly lockStatus: DirectorRuntimeConsumerIntegrationLockStatus;
  readonly stability: DirectorRuntimeConsumerIntegrationStabilityStatus;
  readonly readiness: DirectorRuntimeConsumerIntegrationPublicIndexReadiness;
  readonly invariantCount: number;
  readonly passedInvariantCount: number;
  readonly failedInvariantCount: number;
  readonly approvedExportCount: number;
  readonly frozen: boolean;
  readonly dri87BoundaryIntact: boolean;
  readonly noPrematurePublicIndex: boolean;
  readonly noPrematureRelease: boolean;
  readonly countsConsistent: boolean;
}

export function verifyDirectorRuntimeConsumerIntegrationFreeze():
  DirectorRuntimeConsumerIntegrationFreezeVerification {
  const result = freezeDirectorRuntimeConsumerIntegration();
  const moduleSurface = directorRuntimeConsumerIntegrationFreeze;
  const registry = directorRuntimeConsumerIntegrationFreezeRegistry;

  const identityOk =
    moduleSurface.identity ===
      "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze" &&
    moduleSurface.version === "8.8.0" &&
    moduleSurface.namespace === "nexora.dri.consumer-integration.freeze" &&
    moduleSurface.role === "CertificationAndFreeze" &&
    moduleSurface.upstreamDependency ===
      "DRI-8:7/DirectorRuntimeConsumerAdapterCertification";

  const lockOk =
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK ===
      "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED" &&
    result.lock === DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK &&
    result.lockStatus === "locked" &&
    result.freezeStatus === "frozen" &&
    result.stability === "stable" &&
    result.readiness === "ReadyForPublicIndex";

  const certificationOk =
    result.certificationStatus === "certified" &&
    result.compatibilityStatus === "compatible" &&
    verifyDirectorRuntimeConsumerAdapterCertification().ok;

  const invariantOk =
    result.failedInvariantCount === 0 &&
    result.passedInvariantCount === result.invariantCount &&
    result.invariantCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS.length &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANT_IDS]) &&
    evaluateExportManifestIntegrity();

  const countsConsistent =
    registry.invariantCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS.length &&
    registry.approvedExportCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.length &&
    registry.guaranteeCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES.length &&
    registry.publicApiCount ===
      directorRuntimeConsumerIntegrationFreezeApiNames.length &&
    registry.registrySectionCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_REGISTRY_SECTIONS.length &&
    registry.surfaceCount === 6 &&
    registry.interactionKindCount === 7 &&
    result.approvedExportCount === registry.approvedExportCount;

  const dri87BoundaryIntact =
    moduleSurface.adapterCertificationBoundary ===
      "DRI-8:7-consumer-adapter-certification-only" &&
    moduleSurface.upstreamDependency ===
      directorRuntimeConsumerAdapterCertificationIdentity;

  const noPrematurePublicIndex =
    moduleSurface.noPublicIndex === true &&
    moduleSurface.noSoleConsumerEntryPoint === true &&
    result.soleConsumerEntryPointDeclared === false;

  const noPrematureRelease =
    moduleSurface.noRelease === true &&
    result.releasedDeclared === false &&
    result.readyForConsumerDeclared === false;

  const frozen =
    Object.isFrozen(moduleSurface) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(result) &&
    Object.isFrozen(result.invariants) &&
    Object.isFrozen(
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
    ) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_INVARIANTS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK);

  const ok =
    identityOk &&
    lockOk &&
    certificationOk &&
    invariantOk &&
    countsConsistent &&
    dri87BoundaryIntact &&
    noPrematurePublicIndex &&
    noPrematureRelease &&
    frozen &&
    moduleSurface.introducesConsumerBehavior === false;

  return Object.freeze({
    ok,
    identity: directorRuntimeConsumerIntegrationFreezeIdentity,
    version: directorRuntimeConsumerIntegrationFreezeVersion,
    namespace: directorRuntimeConsumerIntegrationFreezeNamespace,
    dependency: directorRuntimeConsumerIntegrationFreezeUpstream,
    certificationStatus: result.certificationStatus,
    compatibilityStatus: result.compatibilityStatus,
    freezeStatus: result.freezeStatus,
    lock: result.lock,
    lockStatus: result.lockStatus,
    stability: result.stability,
    readiness: result.readiness,
    invariantCount: result.invariantCount,
    passedInvariantCount: result.passedInvariantCount,
    failedInvariantCount: result.failedInvariantCount,
    approvedExportCount: result.approvedExportCount,
    frozen,
    dri87BoundaryIntact,
    noPrematurePublicIndex,
    noPrematureRelease,
    countsConsistent,
  });
}

// ─── Approved publication surface (for DRI-8:9 Public Index) ────────────────
// Direct re-exports of approved frozen exports. No wrappers. Lifecycle logic
// still depends solely on DRI-8:7; these paths only publish the frozen contract.

export {
  getDirectorRuntimeConsumerIntegrationFoundationIdentity,
  listDirectorRuntimeExperienceSurfaces,
  verifyDirectorRuntimeConsumerIntegrationFoundation,
} from "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation";

export {
  getDirectorRuntimeConsumerContextBindingIdentity,
  bindDirectorRuntimeConsumerContext,
  resolveDirectorRuntimeConsumerContext,
  validateDirectorRuntimeConsumerContext,
  verifyDirectorRuntimeConsumerContextBinding,
} from "@/app/lib/dri/directorRuntimeConsumerContextBinding";

export type {
  DirectorRuntimeConsumerContext,
  DirectorRuntimeConsumerSubject,
} from "@/app/lib/dri/directorRuntimeConsumerContextBinding";

export {
  getDirectorRuntimeExperienceSurfaceBindingIdentity,
  bindDirectorRuntimeExperienceSurfaces,
  resolveDirectorRuntimeExperienceSurfaceBinding,
  validateDirectorRuntimeExperienceSurfaceBinding,
  getDirectorRuntimeExperienceSurfaceCapabilities,
  verifyDirectorRuntimeExperienceSurfaceBinding,
} from "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding";

export type {
  DirectorRuntimeExperienceSurfaceBinding,
  DirectorRuntimeExperienceSurfaceBindingResult,
} from "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding";

export {
  getDirectorRuntimeExperienceStateProjectionIdentity,
  listDirectorRuntimeExperiencePresentationStates,
  projectDirectorRuntimeExperienceState,
  resolveDirectorRuntimeExperienceStateProjection,
  validateDirectorRuntimeExperienceStateProjection,
  verifyDirectorRuntimeExperienceStateProjection,
} from "@/app/lib/dri/directorRuntimeExperienceStateProjection";

export type {
  DirectorRuntimeExperienceStateProjection,
  DirectorRuntimeExperienceStateProjectionResult,
} from "@/app/lib/dri/directorRuntimeExperienceStateProjection";

export {
  getDirectorRuntimeConsumerInteractionBridgeIdentity,
  listDirectorRuntimeConsumerInteractionKinds,
  bridgeDirectorRuntimeConsumerInteraction,
  resolveDirectorRuntimeConsumerInteractionIntent,
  validateDirectorRuntimeConsumerInteraction,
  isDirectorRuntimeConsumerInteractionSupported,
  getDirectorRuntimeSurfaceInteractionCapabilities,
  verifyDirectorRuntimeConsumerInteractionBridge,
} from "@/app/lib/dri/directorRuntimeConsumerInteractionBridge";

export type {
  DirectorRuntimeConsumerInteraction,
  DirectorRuntimeConsumerInteractionBridgeResult,
  DirectorRuntimeConsumerInteractionIntent,
} from "@/app/lib/dri/directorRuntimeConsumerInteractionBridge";

export {
  getDirectorRuntimeExperienceCoordinationPlatformIdentity,
  listDirectorRuntimeExperienceCoordinationStatuses,
  listDirectorRuntimeExperienceSurfaceRoles,
  coordinateDirectorRuntimeExperience,
  resolveDirectorRuntimeExperienceCoordination,
  validateDirectorRuntimeExperienceCoordination,
  getDirectorRuntimeExperienceCoordinationRules,
  verifyDirectorRuntimeExperienceCoordinationPlatform,
} from "@/app/lib/dri/directorRuntimeExperienceCoordinationPlatform";

export type {
  DirectorRuntimeExperienceCoordinationInput,
  DirectorRuntimeExperienceCoordinationPlan,
  DirectorRuntimeExperienceCoordinationResult,
  DirectorRuntimeExperienceSurfaceCoordinationOutcome,
} from "@/app/lib/dri/directorRuntimeExperienceCoordinationPlatform";

export {
  getDirectorRuntimeConsumerAdapterCertificationIdentity,
  certifyDirectorRuntimeConsumerAdapter,
  getDirectorRuntimeConsumerAdapterCompatibility,
  verifyDirectorRuntimeConsumerAdapterCertification,
  listDirectorRuntimeConsumerAdapterCertificationDomains,
  listDirectorRuntimeConsumerAdapterCertificationChecks,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  directorRuntimeConsumerAdapterCertificationRegistry,
} from "@/app/lib/dri/directorRuntimeConsumerAdapterCertification";

export type {
  DirectorRuntimeConsumerAdapterCertification,
} from "@/app/lib/dri/directorRuntimeConsumerAdapterCertification";
