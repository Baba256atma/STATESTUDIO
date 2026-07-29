import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
import { ExecutiveContextAssemblyFreeze } from "./executiveContextAssemblyFreeze.ts";
import { ExecutiveContextAssemblyManifest } from "./executiveContextAssemblyManifest.ts";
import { ExecutiveContextAssemblyModel } from "./executiveContextAssemblyModel.ts";
import { ExecutiveContextAssemblyPlatform } from "./executiveContextAssemblyPlatform.ts";
import { ExecutiveContextAssemblyRegistry } from "./executiveContextAssemblyRegistry.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";

export const ExecutiveContextAssemblyPublicIndexId = "ENG-4:9" as const;
export const ExecutiveContextAssemblyPublicIndexVersion = "1.0.0" as const;
export const ExecutiveContextAssemblyPublicIndexName = "Executive Context Assembly Public Index" as const;
export const ExecutiveContextAssemblyPublicIndexDescription =
  "Canonical immutable public release surface for the complete ENG-4 Executive Context Assembly Platform." as const;
export const ExecutiveContextAssemblyPublicIndexNamespace =
  "nexora.engine.executive.context-assembly.public" as const;

export const ExecutiveContextAssemblyPublicIndexStatus = Object.freeze({
  publicIndex: "PublicIndex",
  released: "Released",
  certified: "Certified",
  frozen: "Frozen",
  stable: "Stable",
  metadataOnly: "MetadataOnly",
  immutable: "Immutable",
  runtimeFree: "RuntimeFree",
  deterministic: "Deterministic",
  ownershipProtected: "OwnershipProtected",
  antiDuplicationProtected: "AntiDuplicationProtected",
  namespaceStable: "NamespaceStable",
  publicApiStable: "PublicApiStable",
} as const);

type OwnerPhase =
  | "ENG-4:1"
  | "ENG-4:2"
  | "ENG-4:3"
  | "ENG-4:4"
  | "ENG-4:5"
  | "ENG-4:6"
  | "ENG-4:7"
  | "ENG-4:8"
  | "ENG-4:9";

type ApiCategory = "Aggregate" | "Collection" | "Helper" | "Metadata" | "Lock" | "PublicIndex";

const categorize = (exportName: string, phase: OwnerPhase): ApiCategory => {
  if (phase === "ENG-4:9") return "PublicIndex";
  if (exportName.startsWith("get")) return "Helper";
  if (exportName.endsWith("Metadata") || exportName.endsWith("Status") || exportName.endsWith("Summary")) return "Metadata";
  if (exportName.includes("Lock") || exportName.includes("DependencyLock")) return "Lock";
  if (
    exportName === "ExecutiveContextAssemblyFoundation"
    || exportName === "ExecutiveContextAssemblyRegistry"
    || exportName === "ExecutiveContextAssemblyModel"
    || exportName === "ExecutiveContextAssemblyValidation"
    || exportName === "ExecutiveContextAssemblyManifest"
    || exportName === "ExecutiveContextAssemblyPlatform"
    || exportName === "ExecutiveContextAssemblyCertification"
    || exportName === "ExecutiveContextAssemblyFreeze"
  ) return "Aggregate";
  return "Collection";
};

const api = (exportName: string, ownerPhase: OwnerPhase, namespace: string) => {
  void namespace;
  const category = categorize(exportName, ownerPhase);
  return Object.freeze({
    apiId: `${ownerPhase}:${exportName}`,
    exportName,
    owningPhase: ownerPhase,
    category,
    description: `Approved public ${category.toLowerCase()} export from ${ownerPhase}.`,
    stability: "Stable",
    metadataOnly: true,
    runtimeFree: true,
    ownership: "ENG-4",
    publicStatus: "Public",
  } as const);
};

const entries = (names: readonly string[], phase: OwnerPhase, namespace: string) =>
  names.map((name) => api(name, phase, namespace));

const foundationApis = Object.freeze([
  "ExecutiveContextAssemblyBoundaries", "ExecutiveContextAssemblyCapabilities",
  "ExecutiveContextAssemblyContracts", "ExecutiveContextAssemblyDomains",
  "ExecutiveContextAssemblyFoundation", "ExecutiveContextAssemblyLifecycle",
  "ExecutiveContextAssemblyMetadata", "ExecutiveContextAssemblyOwnership",
  "getExecutiveContextAssemblyCapabilities", "getExecutiveContextAssemblyContracts",
  "getExecutiveContextAssemblyFoundation", "getExecutiveContextAssemblyLifecycle",
  "getExecutiveContextAssemblyMetadata", "getExecutiveContextAssemblySummary",
] as const);

const registryApis = Object.freeze([
  "ExecutiveContextAssemblyRegistry", "ExecutiveContextCapabilityRegistry",
  "ExecutiveContextDomainRegistry", "ExecutiveContextLifecycleRegistry",
  "ExecutiveContextOwnershipRegistry", "ExecutiveContextSourceRegistry",
  "getExecutiveContextAssemblyRegistry", "getExecutiveContextAssemblyRegistrySummary",
  "getExecutiveContextCapabilityRegistry", "getExecutiveContextDomainRegistry",
  "getExecutiveContextLifecycleRegistry", "getExecutiveContextOwnershipRegistry",
  "getExecutiveContextSourceRegistry",
] as const);

const modelApis = Object.freeze([
  "ExecutiveContextAssemblyModel", "ExecutiveContextCompositionModel",
  "ExecutiveContextDomainModel", "ExecutiveContextMetadataModel",
  "ExecutiveContextModel", "ExecutiveContextSnapshotModel",
  "getExecutiveContextAssemblyModel", "getExecutiveContextAssemblyModelSummary",
  "getExecutiveContextCompositionModel", "getExecutiveContextDomainModel",
  "getExecutiveContextMetadataModel", "getExecutiveContextModel",
  "getExecutiveContextSnapshotModel",
] as const);

const validationApis = Object.freeze([
  "ExecutiveContextAssemblyValidation", "ExecutiveContextFoundationValidation",
  "ExecutiveContextModelValidation", "ExecutiveContextOwnershipValidation",
  "ExecutiveContextPublicApiValidation", "ExecutiveContextRegistryValidation",
  "getExecutiveContextAssemblyValidation", "getExecutiveContextAssemblyValidationGate",
  "getExecutiveContextAssemblyValidationRules", "getExecutiveContextAssemblyValidationSummary",
  "getExecutiveContextFoundationValidation", "getExecutiveContextModelValidation",
  "getExecutiveContextOwnershipValidation", "getExecutiveContextPublicApiValidation",
  "getExecutiveContextRegistryValidation",
] as const);

const manifestApis = Object.freeze([
  "ExecutiveContextAssemblyCompatibilityManifest", "ExecutiveContextAssemblyComponentManifest",
  "ExecutiveContextAssemblyDependencyManifest", "ExecutiveContextAssemblyGuaranteeManifest",
  "ExecutiveContextAssemblyManifest", "ExecutiveContextAssemblyOwnershipManifest",
  "ExecutiveContextAssemblyPhaseManifest", "ExecutiveContextAssemblyReadinessManifest",
  "getExecutiveContextAssemblyComponentManifest", "getExecutiveContextAssemblyDependencyManifest",
  "getExecutiveContextAssemblyManifest", "getExecutiveContextAssemblyManifestComponentById",
  "getExecutiveContextAssemblyManifestMetadata", "getExecutiveContextAssemblyManifestPhaseById",
  "getExecutiveContextAssemblyManifestReadinessGateById", "getExecutiveContextAssemblyManifestSummary",
  "getExecutiveContextAssemblyOwnershipManifest", "getExecutiveContextAssemblyPhaseManifest",
  "getExecutiveContextAssemblyReadinessManifest",
] as const);

const platformApis = Object.freeze([
  "ExecutiveContextAssemblyPlatform", "ExecutiveContextAssemblyPlatformCompatibility",
  "ExecutiveContextAssemblyPlatformComponents", "ExecutiveContextAssemblyPlatformGuarantees",
  "ExecutiveContextAssemblyPlatformMetadata", "ExecutiveContextAssemblyPlatformReadiness",
  "getExecutiveContextAssemblyPlatform", "getExecutiveContextAssemblyPlatformCompatibility",
  "getExecutiveContextAssemblyPlatformCompatibilityById", "getExecutiveContextAssemblyPlatformComponentById",
  "getExecutiveContextAssemblyPlatformComponents", "getExecutiveContextAssemblyPlatformMetadata",
  "getExecutiveContextAssemblyPlatformReadiness", "getExecutiveContextAssemblyPlatformReadinessGateById",
  "getExecutiveContextAssemblyPlatformSummary",
] as const);

const certificationApis = Object.freeze([
  "ExecutiveContextAssemblyCertification", "ExecutiveContextAssemblyCertificationCompatibility",
  "ExecutiveContextAssemblyCertificationEvidence", "ExecutiveContextAssemblyCertificationGates",
  "ExecutiveContextAssemblyCertificationMetadata", "ExecutiveContextAssemblyCertificationRegression",
  "getExecutiveContextAssemblyCertification", "getExecutiveContextAssemblyCertificationCompatibility",
  "getExecutiveContextAssemblyCertificationCompatibilityById", "getExecutiveContextAssemblyCertificationEvidence",
  "getExecutiveContextAssemblyCertificationEvidenceById", "getExecutiveContextAssemblyCertificationGateById",
  "getExecutiveContextAssemblyCertificationGates", "getExecutiveContextAssemblyCertificationMetadata",
  "getExecutiveContextAssemblyCertificationRegression", "getExecutiveContextAssemblyCertificationRegressionById",
  "getExecutiveContextAssemblyCertificationSummary",
] as const);

const freezeApis = Object.freeze([
  "ExecutiveContextAssemblyFreeze", "ExecutiveContextAssemblyFreezeCompatibility",
  "ExecutiveContextAssemblyFreezeDependencies", "ExecutiveContextAssemblyFreezeDependencyLock",
  "ExecutiveContextAssemblyFreezeExtensions", "ExecutiveContextAssemblyFreezeMetadata",
  "ExecutiveContextAssemblyFreezeRegistry",
  "getExecutiveContextAssemblyFreeze", "getExecutiveContextAssemblyFreezeCompatibility",
  "getExecutiveContextAssemblyFreezeCompatibilityById", "getExecutiveContextAssemblyFreezeDependencies",
  "getExecutiveContextAssemblyFreezeEntryById", "getExecutiveContextAssemblyFreezeExtensionById",
  "getExecutiveContextAssemblyFreezeExtensions", "getExecutiveContextAssemblyFreezeMetadata",
  "getExecutiveContextAssemblyFreezeRegistry", "getExecutiveContextAssemblyFreezeSummary",
] as const);

const publicIndexApis = Object.freeze([
  "ExecutiveContextAssemblyPlatformPublicFoundation", "ExecutiveContextAssemblyPublicApiRegistry",
  "ExecutiveContextAssemblyPublicIndexId", "ExecutiveContextAssemblyPublicIndexVersion",
  "ExecutiveContextAssemblyPublicIndexName", "ExecutiveContextAssemblyPublicIndexDescription",
  "ExecutiveContextAssemblyPublicIndexNamespace", "ExecutiveContextAssemblyPublicIndexStatus",
  "getExecutiveContextAssemblyPublicFoundation", "getExecutiveContextAssemblyPublicMetadata",
  "getExecutiveContextAssemblyPublicApiRegistry", "getExecutiveContextAssemblyReleaseSummary",
] as const);

export const ExecutiveContextAssemblyPublicApiRegistry = Object.freeze([
  ...entries(foundationApis, "ENG-4:1", "nexora.engine.executive.context-assembly.foundation"),
  ...entries(registryApis, "ENG-4:2", "nexora.engine.executive.context-assembly.registry"),
  ...entries(modelApis, "ENG-4:3", "nexora.engine.executive.context-assembly.model"),
  ...entries(validationApis, "ENG-4:4", "nexora.engine.executive.context-assembly.validation"),
  ...entries(manifestApis, "ENG-4:5", "nexora.engine.executive.context-assembly.manifest"),
  ...entries(platformApis, "ENG-4:6", "nexora.engine.executive.context-assembly.platform"),
  ...entries(certificationApis, "ENG-4:7", "nexora.engine.executive.context-assembly.certification"),
  ...entries(freezeApis, "ENG-4:8", "nexora.engine.executive.context-assembly.freeze"),
  ...entries(publicIndexApis, "ENG-4:9", ExecutiveContextAssemblyPublicIndexNamespace),
]);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveContextAssemblyPublicIndexId,
  version: ExecutiveContextAssemblyPublicIndexVersion,
  name: ExecutiveContextAssemblyPublicIndexName,
  description: ExecutiveContextAssemblyPublicIndexDescription,
  namespace: ExecutiveContextAssemblyPublicIndexNamespace,
  phase: "PublicIndex",
  owner: "ENG-4",
  platformId: "ENG-4:6",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  publicApiStatus: "Stable",
  compatibilityStatus: "Preserved",
  ownershipStatus: "Protected",
  lockIdentifier: "ENG-4-LOCKED",
  status: ExecutiveContextAssemblyPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: "ENG-4:6",
  publicIndexId: ExecutiveContextAssemblyPublicIndexId,
  version: ExecutiveContextAssemblyPublicIndexVersion,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  lockIdentifier: "ENG-4-LOCKED",
  namespace: ExecutiveContextAssemblyPublicIndexNamespace,
  sectionCount: 9,
  publicApiCount: ExecutiveContextAssemblyPublicApiRegistry.length,
  completedPhaseCount: 8,
  ownershipStatus: "Protected",
  compatibilityStatus: "Preserved",
  runtimeStatus: "RuntimeFree",
  metadataStatus: "MetadataOnly",
  eng1RelocationClassification: "ApprovedCompatibility|OwnershipPreserved|PublicSurfaceStable|NoDuplication",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  metadata: publicMetadata,
  apiRegistry: ExecutiveContextAssemblyPublicApiRegistry,
  releaseSummary,
  status: ExecutiveContextAssemblyPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveContextAssemblyPlatformPublicFoundation = Object.freeze({
  foundation: ExecutiveContextAssemblyFoundation,
  registry: ExecutiveContextAssemblyRegistry,
  model: ExecutiveContextAssemblyModel,
  validation: ExecutiveContextAssemblyValidation,
  manifest: ExecutiveContextAssemblyManifest,
  platform: ExecutiveContextAssemblyPlatform,
  certification: ExecutiveContextAssemblyFreeze.certification,
  freeze: ExecutiveContextAssemblyFreeze,
  publicIndex,
} as const);

export const getExecutiveContextAssemblyPublicFoundation = () => ExecutiveContextAssemblyPlatformPublicFoundation;
export const getExecutiveContextAssemblyPublicMetadata = () => publicMetadata;
export const getExecutiveContextAssemblyPublicApiRegistry = () => ExecutiveContextAssemblyPublicApiRegistry;
export const getExecutiveContextAssemblyReleaseSummary = () => releaseSummary;
