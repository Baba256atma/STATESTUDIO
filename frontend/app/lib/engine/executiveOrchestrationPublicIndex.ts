import {
  ExecutiveOrchestrationFreezePlatform,
} from "./executiveOrchestrationFreezePlatform.ts";

export const ExecutiveOrchestrationPublicIndexId = "ENG-8:9" as const;
export const ExecutiveOrchestrationPublicIndexVersion = "1.0.0" as const;
export const ExecutiveOrchestrationPublicIndexName =
  "Executive Orchestration Public Index" as const;
export const ExecutiveOrchestrationPublicIndexNamespace =
  "nexora.engine.executive.orchestration" as const;

export const ExecutiveOrchestrationPublicIndexStatus = Object.freeze({
  status: "Released",
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "Stable",
  architectureMode: "MetadataOnly",
  runtimeBehavior: "None",
  immutability: "DeeplyFrozen",
  publicApiStatus: "StableAndFrozen",
  certified: "Certified",
  frozen: "Frozen",
  stable: "Stable",
  metadataOnly: "MetadataOnly",
  runtimeFree: "RuntimeFree",
  deeplyFrozen: "DeeplyFrozen",
  stableAndFrozen: "StableAndFrozen",
  released: "Released",
} as const);

export const ExecutiveOrchestrationPublicIndexReadiness =
  "ReadyForConsumer" as const;

type OwnerPhase =
  | "ENG-8:1"
  | "ENG-8:2"
  | "ENG-8:3"
  | "ENG-8:4"
  | "ENG-8:5"
  | "ENG-8:6"
  | "ENG-8:7"
  | "ENG-8:8"
  | "ENG-8:9";

type ApiSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform"
  | "certification"
  | "freeze"
  | "publicIndex";

type ApiCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Certification"
  | "Freeze"
  | "PublicIndex"
  | "Helper"
  | "Metadata"
  | "Summary"
  | "Runner";

const phaseSection = Object.freeze({
  "ENG-8:1": "foundation",
  "ENG-8:2": "registry",
  "ENG-8:3": "model",
  "ENG-8:4": "validation",
  "ENG-8:5": "manifest",
  "ENG-8:6": "platform",
  "ENG-8:7": "certification",
  "ENG-8:8": "freeze",
  "ENG-8:9": "publicIndex",
} as const satisfies Readonly<Record<OwnerPhase, ApiSection>>);

const api = (
  name: string,
  phase: OwnerPhase,
  category: ApiCategory,
) => Object.freeze({
  id: `${phase}:${name}`,
  name,
  phase,
  section: phaseSection[phase],
  category,
  status: phase === "ENG-8:9" ? "Released" : "Stable",
  stability: "Stable",
  visibility: "Public",
  metadataOnly: true,
  runtimeFree: true,
  frozen: phase !== "ENG-8:9",
  deprecated: false,
} as const);

const entries = (
  items: readonly (readonly [string, ApiCategory])[],
  phase: OwnerPhase,
) => Object.freeze(items.map(([name, category]) => api(name, phase, category)));

const foundationApis = Object.freeze([
  ["ExecutiveOrchestrationFoundation", "Foundation"],
  ["getExecutiveOrchestrationFoundation", "Helper"],
  ["ExecutiveOrchestrationCapabilityContract", "Foundation"],
  ["ExecutiveOrchestrationDependencyContract", "Foundation"],
  ["ExecutiveOrchestrationLifecycleContract", "Foundation"],
  ["ExecutiveOrchestrationResponsibilityContract", "Foundation"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const registryApis = Object.freeze([
  ["ExecutiveOrchestrationRegistryPlatform", "Registry"],
  ["getExecutiveOrchestrationRegistryPlatform", "Helper"],
  ["getExecutiveOrchestrationRegistryEntryById", "Helper"],
  ["ExecutiveOrchestrationCapabilityRegistry", "Registry"],
  ["ExecutiveOrchestrationComponentRegistry", "Registry"],
  ["ExecutiveOrchestrationCoordinationRegistry", "Registry"],
  ["ExecutiveOrchestrationDependencyRegistry", "Registry"],
  ["ExecutiveOrchestrationLifecycleRegistry", "Registry"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const modelApis = Object.freeze([
  ["ExecutiveOrchestrationModelPlatform", "Model"],
  ["getExecutiveOrchestrationModelPlatform", "Helper"],
  ["getExecutiveOrchestrationModelById", "Helper"],
  ["ExecutiveOrchestrationRequestModel", "Model"],
  ["ExecutiveOrchestrationPlanModel", "Model"],
  ["ExecutiveExecutionStageModel", "Model"],
  ["ExecutiveCoordinationRouteModel", "Model"],
  ["ExecutiveDependencyChainModel", "Model"],
  ["ExecutiveExecutionGroupModel", "Model"],
  ["ExecutiveAdvisorHandoffModel", "Model"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const validationApis = Object.freeze([
  ["ExecutiveOrchestrationValidationRunner", "Validation"],
  ["runExecutiveOrchestrationValidation", "Runner"],
  ["getExecutiveOrchestrationValidationSummary", "Helper"],
  ["ExecutiveOrchestrationFoundationValidation", "Validation"],
  ["ExecutiveOrchestrationRegistryValidation", "Validation"],
  ["ExecutiveOrchestrationModelValidation", "Validation"],
  ["ExecutiveOrchestrationOwnershipValidation", "Validation"],
  ["ExecutiveOrchestrationValidationManifest", "Validation"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const manifestApis = Object.freeze([
  ["ExecutiveOrchestrationManifestPlatform", "Manifest"],
  ["getExecutiveOrchestrationManifestPlatform", "Helper"],
  ["getExecutiveOrchestrationManifestSummary", "Helper"],
  ["ExecutiveOrchestrationFoundationManifest", "Manifest"],
  ["ExecutiveOrchestrationRegistryManifest", "Manifest"],
  ["ExecutiveOrchestrationModelManifest", "Manifest"],
  ["ExecutiveOrchestrationValidationManifestSummary", "Manifest"],
  ["ExecutiveOrchestrationDependencyManifest", "Manifest"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const platformApis = Object.freeze([
  ["ExecutiveOrchestrationPlatform", "Platform"],
  ["ExecutiveOrchestrationPlatformMetadata", "Metadata"],
  ["ExecutiveOrchestrationPlatformRegistry", "Platform"],
  ["ExecutiveOrchestrationPlatformSummary", "Summary"],
  ["getExecutiveOrchestrationPlatform", "Helper"],
  ["getExecutiveOrchestrationPlatformSummary", "Helper"],
  ["ExecutiveOrchestrationPlatformRunner", "Runner"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const certificationApis = Object.freeze([
  ["ExecutiveOrchestrationCertificationPlatform", "Certification"],
  ["ExecutiveOrchestrationCertificationRegistry", "Certification"],
  ["ExecutiveOrchestrationCertificationManifest", "Certification"],
  ["ExecutiveOrchestrationCertificationSummary", "Summary"],
  ["runExecutiveOrchestrationCertification", "Runner"],
  ["getExecutiveOrchestrationCertificationSummary", "Helper"],
  ["ExecutiveOrchestrationCertificationRunner", "Runner"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const freezeApis = Object.freeze([
  ["ExecutiveOrchestrationFreezePlatform", "Freeze"],
  ["ExecutiveOrchestrationFreezeRegistry", "Freeze"],
  ["ExecutiveOrchestrationFreezeCompatibility", "Freeze"],
  ["ExecutiveOrchestrationFreezeLocks", "Freeze"],
  ["ExecutiveOrchestrationFreezeManifest", "Freeze"],
  ["runExecutiveOrchestrationFreeze", "Runner"],
  ["getExecutiveOrchestrationFreezeSummary", "Helper"],
  ["ExecutiveOrchestrationFreezeRunner", "Runner"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const publicIndexApis = Object.freeze([
  ["ExecutiveOrchestrationPlatformPublicFoundation", "PublicIndex"],
  ["ExecutiveOrchestrationPublicApiRegistry", "PublicIndex"],
  ["ExecutiveOrchestrationPublicIndexId", "PublicIndex"],
  ["ExecutiveOrchestrationPublicIndexVersion", "PublicIndex"],
  ["ExecutiveOrchestrationPublicIndexName", "PublicIndex"],
  ["ExecutiveOrchestrationPublicIndexNamespace", "PublicIndex"],
  ["ExecutiveOrchestrationPublicIndexStatus", "PublicIndex"],
  ["ExecutiveOrchestrationPublicIndexReadiness", "PublicIndex"],
  ["getExecutiveOrchestrationPublicFoundation", "Helper"],
  ["getExecutiveOrchestrationPublicApiRegistry", "Helper"],
  ["getExecutiveOrchestrationPublicIndexSummary", "Helper"],
  ["getExecutiveOrchestrationPublicApiById", "Helper"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

/**
 * Declared public API registry for ENG-8:1 through ENG-8:9.
 * Totals are architectural constants: 62 prior + 12 public-index = 74.
 */
export const ExecutiveOrchestrationPublicApiRegistry = Object.freeze([
  ...entries(foundationApis, "ENG-8:1"),
  ...entries(registryApis, "ENG-8:2"),
  ...entries(modelApis, "ENG-8:3"),
  ...entries(validationApis, "ENG-8:4"),
  ...entries(manifestApis, "ENG-8:5"),
  ...entries(platformApis, "ENG-8:6"),
  ...entries(certificationApis, "ENG-8:7"),
  ...entries(freezeApis, "ENG-8:8"),
  ...entries(publicIndexApis, "ENG-8:9"),
] as const);

const apiIndex = Object.freeze(
  Object.fromEntries(
    ExecutiveOrchestrationPublicApiRegistry.map((entry) => [entry.id, entry]),
  ) as Readonly<
    Record<string, (typeof ExecutiveOrchestrationPublicApiRegistry)[number] | undefined>
  >,
);

const consumerImportPolicy = Object.freeze({
  requiredEntryPoint: "executiveOrchestrationPublicIndex.ts",
  statement:
    "Future consumers must import Executive Orchestration only from executiveOrchestrationPublicIndex.ts.",
  prohibitedDirectImports: Object.freeze([
    "executiveOrchestrationFoundation.ts",
    "executiveOrchestrationRegistryPlatform.ts",
    "executiveOrchestrationModelPlatform.ts",
    "executiveOrchestrationValidationRunner.ts",
    "executiveOrchestrationManifestPlatform.ts",
    "executiveOrchestrationPlatform.ts",
    "executiveOrchestrationCertificationPlatform.ts",
    "executiveOrchestrationFreezePlatform.ts",
  ] as const),
  metadataOnly: true,
  immutable: true,
} as const);

const ownership = Object.freeze({
  foundation: "ENG-8:1",
  registry: "ENG-8:2",
  model: "ENG-8:3",
  validation: "ENG-8:4",
  manifest: "ENG-8:5",
  platform: "ENG-8:6",
  certification: "ENG-8:7",
  freeze: "ENG-8:8",
  publicIndex: "ENG-8:9",
  antiDuplication: Object.freeze({
    eng8OwnsCoordinationOnly: true,
    busOwnsBusinessDomainIntelligence: true,
    opsOwnsOperationalExecutionArchitecture: true,
    advisorOwnsConversationalPresentation: true,
    noDualPhaseApiOwnership: true,
    noArchitecturalResponsibilityDuplication: true,
  } as const),
  metadataOnly: true,
  immutable: true,
} as const);

const publicIndexSummary = Object.freeze({
  phaseCount: 9,
  sectionCount: 9,
  publicApiCount: 74,
  releasedApiCount: 12,
  frozenApiCount: 62,
  certifiedApiCount: 74,
  runtimeApiCount: 0,
  deprecatedApiCount: 0,
  releaseStatus: "Released",
  freezeStatus: "Frozen",
  certificationStatus: "Certified",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  architectureMode: "MetadataOnly",
  runtimeBehavior: "None",
  immutability: "DeeplyFrozen",
  publicApiStatus: "StableAndFrozen",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const freeze = ExecutiveOrchestrationFreezePlatform;
const certification = freeze.certifiedPlatform;
const platform = certification.certifiedPlatform;

const publicIndexSection = Object.freeze({
  id: ExecutiveOrchestrationPublicIndexId,
  name: ExecutiveOrchestrationPublicIndexName,
  version: ExecutiveOrchestrationPublicIndexVersion,
  namespace: ExecutiveOrchestrationPublicIndexNamespace,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "Stable",
  architectureMode: "MetadataOnly",
  runtimeBehavior: "None",
  immutability: "DeeplyFrozen",
  publicApiStatus: "StableAndFrozen",
  sectionCount: 9,
  publicApiCount: 74,
  owner: "ENG-8:9",
  previousPhase: "ENG-8:8",
  consumerImportPolicy,
  nextConsumer: "ReadyForNextEngineConsumer",
  ownership,
  status: ExecutiveOrchestrationPublicIndexStatus,
  readiness: ExecutiveOrchestrationPublicIndexReadiness,
  apiRegistry: ExecutiveOrchestrationPublicApiRegistry,
  summary: publicIndexSummary,
  consumedSurfaces: Object.freeze({
    freeze: "executiveOrchestrationFreezePlatform.ts",
  } as const),
  metadataOnly: true,
  immutable: true,
  deeplyFrozen: true,
  runtimeFree: true,
  released: true,
  certified: true,
} as const);

/**
 * Sole supported public entry point for the Executive Orchestration Platform.
 * Derives ENG-8:1 through ENG-8:8 exclusively through the ENG-8:8 freeze surface.
 */
export const ExecutiveOrchestrationPlatformPublicFoundation = Object.freeze({
  foundation: platform.foundation,
  registry: platform.registry,
  model: platform.model,
  validation: platform.validation,
  manifest: platform.manifest,
  platform,
  certification,
  freeze,
  publicIndex: publicIndexSection,
} as const);

export const getExecutiveOrchestrationPublicFoundation = () =>
  ExecutiveOrchestrationPlatformPublicFoundation;

export const getExecutiveOrchestrationPublicApiRegistry = () =>
  ExecutiveOrchestrationPublicApiRegistry;

export const getExecutiveOrchestrationPublicIndexSummary = () =>
  publicIndexSummary;

export const getExecutiveOrchestrationPublicApiById = (
  id: string,
): (typeof ExecutiveOrchestrationPublicApiRegistry)[number] | undefined =>
  apiIndex[id];
