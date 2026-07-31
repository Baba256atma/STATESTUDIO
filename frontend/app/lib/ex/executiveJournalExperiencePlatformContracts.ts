import type {
  ExecutiveJournalExperiencePlatformAccessClassification,
  ExecutiveJournalExperiencePlatformAvailability,
  ExecutiveJournalExperiencePlatformBindingKind,
  ExecutiveJournalExperiencePlatformBindingStatus,
  ExecutiveJournalExperiencePlatformContract,
  ExecutiveJournalExperiencePlatformEligibility,
  ExecutiveJournalExperiencePlatformExposureStatus,
  ExecutiveJournalExperiencePlatformIntegrityStatus,
  ExecutiveJournalExperiencePlatformIsolation,
  ExecutiveJournalExperiencePlatformProviderMode,
  ExecutiveJournalExperiencePlatformReasonCode,
  ExecutiveJournalExperiencePlatformSourceClassification,
} from "./executiveJournalExperiencePlatformTypes.ts";

export const ExecutiveJournalExperiencePlatformEligibilityValues = Object.freeze(["Eligible", "Ineligible"] as const satisfies readonly ExecutiveJournalExperiencePlatformEligibility[]);
export const ExecutiveJournalExperiencePlatformBindingStatusValues = Object.freeze(["Bound", "Unbound", "Rejected"] as const satisfies readonly ExecutiveJournalExperiencePlatformBindingStatus[]);
export const ExecutiveJournalExperiencePlatformExposureStatusValues = Object.freeze(["Exposed", "NotExposed", "Prohibited"] as const satisfies readonly ExecutiveJournalExperiencePlatformExposureStatus[]);
export const ExecutiveJournalExperiencePlatformAvailabilityValues = Object.freeze(["Available", "Unavailable", "Degraded", "NotEvaluated"] as const satisfies readonly ExecutiveJournalExperiencePlatformAvailability[]);
export const ExecutiveJournalExperiencePlatformIsolationValues = Object.freeze(["MetadataOnlyIsolated", "NotIsolated"] as const satisfies readonly ExecutiveJournalExperiencePlatformIsolation[]);
export const ExecutiveJournalExperiencePlatformProviderModeValues = Object.freeze(["NoProvider", "SyntheticProviderReferenceOnly", "ProductionProviderProhibited"] as const satisfies readonly ExecutiveJournalExperiencePlatformProviderMode[]);
export const ExecutiveJournalExperiencePlatformAccessClassificationValues = Object.freeze(["NoAccess", "MetadataOnlyAccess", "ProductionAccessProhibited"] as const satisfies readonly ExecutiveJournalExperiencePlatformAccessClassification[]);
export const ExecutiveJournalExperiencePlatformSourceClassificationValues = Object.freeze(["NoSource", "SyntheticEvidenceReferenceOnly", "RealRtc2SourceProhibited", "ProductionSourceProhibited"] as const satisfies readonly ExecutiveJournalExperiencePlatformSourceClassification[]);
export const ExecutiveJournalExperiencePlatformIntegrityStatusValues = Object.freeze(["Intact", "Compromised", "NotEvaluated"] as const satisfies readonly ExecutiveJournalExperiencePlatformIntegrityStatus[]);
export const ExecutiveJournalExperiencePlatformReasonCodes = Object.freeze([
  "ManifestMissing", "ManifestIneligible", "ManifestMalformed", "ManifestCloned", "ManifestStale",
  "ManifestIdentityMismatch", "ManifestReadinessMismatch", "CapabilityCatalogueMismatch",
  "NonCapabilityCatalogueMismatch", "PrerequisiteCatalogueMismatch", "UpstreamReferenceMismatch",
  "PlatformAuthorizationMissing", "PlatformContractUnsealed",
] as const satisfies readonly ExecutiveJournalExperiencePlatformReasonCode[]);
export const ExecutiveJournalExperiencePlatformBindingKinds = Object.freeze([
  "ManifestBinding", "ConsumerBinding", "CapabilityExposure", "NonCapabilityEnforcement",
  "PlatformCompatibility", "AccessClassification", "DataSourceClassification",
  "ProviderModeClassification", "IsolationMode", "AvailabilityClassification",
  "IntegrityClassification", "FailureClassification", "CertificationEvidence",
  "DependencyBoundary", "GovernanceCarryForward", "PlatformSummary",
] as const satisfies readonly ExecutiveJournalExperiencePlatformBindingKind[]);

const detailByCode: Readonly<Record<ExecutiveJournalExperiencePlatformReasonCode, string>> = Object.freeze({
  ManifestMissing: "The canonical Manifest is missing.",
  ManifestIneligible: "The Manifest eligibility result is not Eligible.",
  ManifestMalformed: "The Platform input or Manifest is malformed.",
  ManifestCloned: "The Manifest is not the exact canonical aggregate reference.",
  ManifestStale: "The Manifest evidence is not current.",
  ManifestIdentityMismatch: "The Manifest identity does not match.",
  ManifestReadinessMismatch: "The Manifest readiness is not ReadyForPlatform.",
  CapabilityCatalogueMismatch: "The capability catalogue does not match.",
  NonCapabilityCatalogueMismatch: "The non-capability catalogue does not match.",
  PrerequisiteCatalogueMismatch: "The prerequisite catalogue does not match.",
  UpstreamReferenceMismatch: "The canonical upstream references do not match.",
  PlatformAuthorizationMissing: "AD-EX2-14 implementation authorization is missing.",
  PlatformContractUnsealed: "The Platform contracts are not sealed.",
});

export const ExecutiveJournalExperiencePlatformReasonDefinitions = Object.freeze(
  ExecutiveJournalExperiencePlatformReasonCodes.map((code, index) =>
    Object.freeze({ code, order: index + 1, detail: detailByCode[code] })),
);

export const ExecutiveJournalExperiencePlatformContracts = Object.freeze(([
  ["PlatformInput", "Platform input remains unknown, read-only, and unrepaired."],
  ["ManifestBinding", "Eligibility requires the exact canonical eligible EX-2:5 Manifest."],
  ["CapabilityBinding", "Each Manifest capability has exactly one metadata exposure binding."],
  ["NonCapabilityEnforcement", "Each Manifest non-capability remains prohibited."],
  ["ConsumerBinding", "The closed ten-field consumer boundary fails closed."],
  ["ProviderSourceBoundary", "Providers, production sources, and real RTC-2 remain prohibited."],
  ["ReadinessCondition", "All readiness conditions remain ordered metadata declarations."],
  ["EligibilityResult", "Eligibility is pure, deterministic, immutable, and fail-closed."],
  ["PlatformReason", "Reasons use safe closed structural details."],
  ["PlatformSummary", "The summary contains safe counts and authority metadata only."],
] as const).map(([name, subject], index) => Object.freeze({
  contractId: `EX-2:6/Contract/${name}`,
  order: index + 1,
  subject,
  metadataOnly: true,
  exactManifestBinding: true,
  repairsInput: false,
  mutatesInput: false,
  closedVocabularies: true,
  deterministicOrdering: true,
  providerExecution: false,
  authorityCreation: false,
  runtimeEffects: false,
  productionAuthorization: false,
  ex27SeparatelyAuthorized: true,
  immutable: true,
} satisfies ExecutiveJournalExperiencePlatformContract)));

const isMember = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === "string" && values.some((candidate) => candidate === value);

export const isExecutiveJournalExperiencePlatformReasonCode = (value: unknown): value is ExecutiveJournalExperiencePlatformReasonCode => isMember(ExecutiveJournalExperiencePlatformReasonCodes, value);
export const isExecutiveJournalExperiencePlatformBindingKind = (value: unknown): value is ExecutiveJournalExperiencePlatformBindingKind => isMember(ExecutiveJournalExperiencePlatformBindingKinds, value);
export const isExecutiveJournalExperiencePlatformProviderMode = (value: unknown): value is ExecutiveJournalExperiencePlatformProviderMode => isMember(ExecutiveJournalExperiencePlatformProviderModeValues, value);
export const isExecutiveJournalExperiencePlatformAccessClassification = (value: unknown): value is ExecutiveJournalExperiencePlatformAccessClassification => isMember(ExecutiveJournalExperiencePlatformAccessClassificationValues, value);
export const isExecutiveJournalExperiencePlatformSourceClassification = (value: unknown): value is ExecutiveJournalExperiencePlatformSourceClassification => isMember(ExecutiveJournalExperiencePlatformSourceClassificationValues, value);
