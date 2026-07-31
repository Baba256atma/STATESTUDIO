/**
 * EX-2:5 — closed Manifest vocabularies, reason definitions, and contracts.
 */

import type {
  ExecutiveJournalExperienceManifestCapabilitySupport,
  ExecutiveJournalExperienceManifestCompatibility,
  ExecutiveJournalExperienceManifestContract,
  ExecutiveJournalExperienceManifestEligibility,
  ExecutiveJournalExperienceManifestEntryKind,
  ExecutiveJournalExperienceManifestReasonCode,
  ExecutiveJournalExperienceManifestRequirementStatus,
} from "./executiveJournalExperienceManifestTypes.ts";

export const ExecutiveJournalExperienceManifestEligibilityValues =
  Object.freeze([
    "Eligible",
    "Ineligible",
  ] as const satisfies readonly ExecutiveJournalExperienceManifestEligibility[]);

export const ExecutiveJournalExperienceManifestCapabilitySupportValues =
  Object.freeze([
    "Declared",
    "NotDeclared",
    "Prohibited",
  ] as const satisfies readonly ExecutiveJournalExperienceManifestCapabilitySupport[]);

export const ExecutiveJournalExperienceManifestCompatibilityValues =
  Object.freeze([
    "Compatible",
    "Incompatible",
    "NotEvaluated",
  ] as const satisfies readonly ExecutiveJournalExperienceManifestCompatibility[]);

export const ExecutiveJournalExperienceManifestRequirementStatusValues =
  Object.freeze([
    "Satisfied",
    "Unsatisfied",
    "Pending",
  ] as const satisfies readonly ExecutiveJournalExperienceManifestRequirementStatus[]);

export const ExecutiveJournalExperienceManifestEntryKinds = Object.freeze([
  "Identity",
  "Capability",
  "Compatibility",
  "Requirement",
  "NonCapability",
  "DependencyBoundary",
  "EvidenceReference",
  "OpenIssue",
  "PendingGate",
  "PlatformPrerequisite",
  "Summary",
] as const satisfies readonly ExecutiveJournalExperienceManifestEntryKind[]);

export const ExecutiveJournalExperienceManifestReasonCodes = Object.freeze([
  "ValidationEvidenceMissing",
  "ValidationEvidenceInvalid",
  "ValidationEvidenceMalformed",
  "ValidationEvidenceCloned",
  "ValidationEvidenceStale",
  "ValidationEvidenceMismatched",
  "ValidationEvidenceUnknown",
  "UnsupportedCapability",
  "ProhibitedCapability",
  "DependencyBoundaryViolation",
  "ManifestEntryUnsealed",
  "PlatformAuthorizationMissing",
] as const satisfies readonly ExecutiveJournalExperienceManifestReasonCode[]);

export const ExecutiveJournalExperienceManifestReasonDefinitions =
  Object.freeze(
    ExecutiveJournalExperienceManifestReasonCodes.map((code, index) =>
      Object.freeze({
        code,
        order: index + 1,
        detail: Object.freeze({
          ValidationEvidenceMissing: "Required validation evidence is missing.",
          ValidationEvidenceInvalid: "Validation evidence is not Valid.",
          ValidationEvidenceMalformed: "Manifest input or validation evidence is malformed.",
          ValidationEvidenceCloned: "Validation evidence is not the exact canonical result reference.",
          ValidationEvidenceStale: "Validation evidence is not current.",
          ValidationEvidenceMismatched: "Validation or Model identity binding does not match.",
          ValidationEvidenceUnknown: "Validation evidence is unknown or noncanonical.",
          UnsupportedCapability: "Capability catalogue is incomplete or unsupported.",
          ProhibitedCapability: "A prohibited declaration conflict exists.",
          DependencyBoundaryViolation: "The canonical dependency boundary is not intact.",
          ManifestEntryUnsealed: "Manifest entries or required catalogues are incomplete or unsealed.",
          PlatformAuthorizationMissing: "Separate EX-2:6 authorization is not declared as required.",
        } as const)[code],
      }),
    ),
  );

export const ExecutiveJournalExperienceManifestContracts = Object.freeze(([
  { contractId: "EX-2:5/Contract/ManifestInput", subject: "Manifest input is unknown, read-only, and never normalized or repaired." },
  { contractId: "EX-2:5/Contract/ValidationBinding", subject: "Eligibility binds the exact EX-2:4 aggregate, Valid result, and validated Model references." },
  { contractId: "EX-2:5/Contract/CapabilityEntry", subject: "Capability entries are closed, declared metadata references with no behavior." },
  { contractId: "EX-2:5/Contract/NonCapabilityEntry", subject: "Every prohibited capability remains explicit and ordered." },
  { contractId: "EX-2:5/Contract/PlatformPrerequisite", subject: "Platform prerequisites are declarations and do not authorize EX-2:6." },
  { contractId: "EX-2:5/Contract/EligibilityResult", subject: "Eligibility is pure, deterministic, immutable, and fail-closed." },
  { contractId: "EX-2:5/Contract/ManifestReason", subject: "Reasons use closed codes and safe structural details without input echo." },
  { contractId: "EX-2:5/Contract/ManifestSummary", subject: "Summary contains safe counts and control metadata without payload content." },
] as const).map((contract, index) =>
  Object.freeze({
    ...contract,
    order: index + 1,
    metadataOnly: true as const,
    exactValidationBinding: true as const,
    repairsInput: false as const,
    mutatesInput: false as const,
    closedVocabularies: true as const,
    deterministicOrdering: true as const,
    safeDetailsOnly: true as const,
    authorityCreation: false as const,
    runtimeEffects: false as const,
    productionAuthorization: false as const,
    ex26SeparatelyAuthorized: true as const,
    immutable: true as const,
  } satisfies ExecutiveJournalExperienceManifestContract)
));

const isMember = <T extends string>(
  catalogue: readonly T[],
  value: unknown,
): value is T =>
  typeof value === "string"
  && catalogue.some((candidate) => candidate === value);

export const isExecutiveJournalExperienceManifestEligibility = (
  value: unknown,
): value is ExecutiveJournalExperienceManifestEligibility =>
  isMember(ExecutiveJournalExperienceManifestEligibilityValues, value);

export const isExecutiveJournalExperienceManifestCapabilitySupport = (
  value: unknown,
): value is ExecutiveJournalExperienceManifestCapabilitySupport =>
  isMember(ExecutiveJournalExperienceManifestCapabilitySupportValues, value);

export const isExecutiveJournalExperienceManifestCompatibility = (
  value: unknown,
): value is ExecutiveJournalExperienceManifestCompatibility =>
  isMember(ExecutiveJournalExperienceManifestCompatibilityValues, value);

export const isExecutiveJournalExperienceManifestRequirementStatus = (
  value: unknown,
): value is ExecutiveJournalExperienceManifestRequirementStatus =>
  isMember(ExecutiveJournalExperienceManifestRequirementStatusValues, value);

export const isExecutiveJournalExperienceManifestEntryKind = (
  value: unknown,
): value is ExecutiveJournalExperienceManifestEntryKind =>
  isMember(ExecutiveJournalExperienceManifestEntryKinds, value);

export const isExecutiveJournalExperienceManifestReasonCode = (
  value: unknown,
): value is ExecutiveJournalExperienceManifestReasonCode =>
  isMember(ExecutiveJournalExperienceManifestReasonCodes, value);

export const assertExecutiveJournalExperienceManifestReasonCode = (
  value: unknown,
): ExecutiveJournalExperienceManifestReasonCode => {
  if (!isExecutiveJournalExperienceManifestReasonCode(value)) {
    throw new Error("Unknown EX-2:5 Manifest reason code.");
  }
  return value;
};

export const assertExecutiveJournalExperienceManifestEntryKind = (
  value: unknown,
): ExecutiveJournalExperienceManifestEntryKind => {
  if (!isExecutiveJournalExperienceManifestEntryKind(value)) {
    throw new Error("Unknown EX-2:5 Manifest entry kind.");
  }
  return value;
};
