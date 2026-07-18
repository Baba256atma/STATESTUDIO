import {
  ExecutiveDecisionCertificationPlatform,
} from "./executiveDecisionCertificationPlatform.ts";
import {
  ExecutiveDecisionFreezePlatform,
} from "./executiveDecisionFreezePlatform.ts";
import {
  ExecutiveDecisionManifestPlatform,
} from "./executiveDecisionManifestPlatform.ts";
import {
  ExecutiveDecisionModelPlatform,
} from "./executiveDecisionModelPlatform.ts";
import {
  ExecutiveDecisionPlatform,
} from "./executiveDecisionPlatform.ts";
import {
  ExecutiveDecisionFoundation,
} from "./executiveDecisionPublicApi.ts";
import {
  ExecutiveDecisionRegistryPlatform,
} from "./executiveDecisionRegistryPlatform.ts";
import {
  ExecutiveDecisionValidationPlatform,
} from "./executiveDecisionValidationPlatform.ts";

export const ExecutiveDecisionPublicIndexId = "ENG-7:9" as const;
export const ExecutiveDecisionPublicIndexVersion = "1.0.0" as const;
export const ExecutiveDecisionPublicIndexName = "Executive Decision Public Index" as const;
export const ExecutiveDecisionPublicIndexDescription =
  "Canonical immutable public release surface for the Nexora Executive Decision Engine." as const;
export const ExecutiveDecisionPublicIndexNamespace =
  "Nexora.Engine.ExecutiveDecision.Public" as const;

export const ExecutiveDecisionPublicIndexStatus = Object.freeze({
  status: "Released",
  released: "Released",
  certified: "Certified",
  frozen: "Frozen",
  stableAndFrozen: "StableAndFrozen",
  metadataOnly: "MetadataOnly",
  deeplyFrozen: "DeeplyFrozen",
  runtimeFree: "RuntimeFree",
  ownershipProtected: "OwnershipProtected",
  dependencySafe: "DependencySafe",
  compatibilityProtected: "CompatibilityProtected",
  antiDuplicationProtected: "AntiDuplicationProtected",
  readyForENG8: "ReadyForENG8",
  readyForAdvisor: "ReadyForAdvisor",
} as const);

type OwnerPhase =
  | "ENG-7:1"
  | "ENG-7:2"
  | "ENG-7:3"
  | "ENG-7:4"
  | "ENG-7:5"
  | "ENG-7:6"
  | "ENG-7:7"
  | "ENG-7:8"
  | "ENG-7:9";

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
  | "Metadata"
  | "Helper"
  | "Summary";

const sourceModules = Object.freeze({
  "ENG-7:1": "executiveDecisionPublicApi.ts",
  "ENG-7:2": "executiveDecisionRegistryPlatform.ts",
  "ENG-7:3": "executiveDecisionModelPlatform.ts",
  "ENG-7:4": "executiveDecisionValidationPlatform.ts",
  "ENG-7:5": "executiveDecisionManifestPlatform.ts",
  "ENG-7:6": "executiveDecisionPlatform.ts",
  "ENG-7:7": "executiveDecisionCertificationPlatform.ts",
  "ENG-7:8": "executiveDecisionFreezePlatform.ts",
  "ENG-7:9": "executiveDecisionPublicIndex.ts",
} as const);

const api = (
  exportName: string,
  owningPhase: OwnerPhase,
  category: ApiCategory,
) => Object.freeze({
  apiId: `${owningPhase}:${exportName}`,
  exportName,
  owningPhase,
  sourceModule: sourceModules[owningPhase],
  category,
  status: "Released",
  stability: "Stable",
  freezeState: "Frozen",
  metadataOnly: true,
  publicConsumer: true,
  replacementPolicy: "VersionedSuccessorOnly",
} as const);

const entries = (
  items: readonly (readonly [string, ApiCategory])[],
  phase: OwnerPhase,
) => Object.freeze(items.map(([name, category]) => api(name, phase, category)));

const foundationApis = Object.freeze([
  ["ExecutiveDecisionFoundation", "Foundation"],
  ["ExecutiveDecisionCapabilityRegistry", "Foundation"],
  ["ExecutiveDecisionDependencyMap", "Foundation"],
  ["ExecutiveDecisionOwnershipMap", "Foundation"],
  ["getExecutiveDecisionFoundation", "Helper"],
  ["getExecutiveDecisionMetadata", "Metadata"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const registryApis = Object.freeze([
  ["ExecutiveDecisionRegistryPlatform", "Registry"],
  ["ExecutiveDecisionDomainRegistry", "Registry"],
  ["ExecutiveDecisionTypeRegistry", "Registry"],
  ["ExecutiveDecisionCapabilityRegistryPlatform", "Registry"],
  ["ExecutiveDecisionOutputRegistry", "Registry"],
  ["ExecutiveDecisionLifecycleRegistry", "Registry"],
  ["ExecutiveDecisionRegistryMetadata", "Metadata"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const modelApis = Object.freeze([
  ["ExecutiveDecisionModelPlatform", "Model"],
  ["ExecutiveDecisionModelRegistry", "Model"],
  ["ExecutiveDecisionCoreModel", "Model"],
  ["ExecutiveDecisionAlternativeModels", "Model"],
  ["ExecutiveDecisionConfidenceRiskModels", "Model"],
  ["ExecutiveDecisionTradeoffImpactModels", "Model"],
  ["ExecutiveDecisionTraceModel", "Model"],
  ["ExecutiveDecisionRecommendationPublicationModels", "Model"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const validationApis = Object.freeze([
  ["ExecutiveDecisionValidationPlatform", "Validation"],
  ["ExecutiveDecisionValidationManifest", "Validation"],
  ["ExecutiveDecisionValidationRegistry", "Validation"],
  ["ExecutiveDecisionValidationMetadata", "Metadata"],
  ["ExecutiveDecisionValidationCategories", "Validation"],
  ["ExecutiveDecisionValidationSeverities", "Validation"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const manifestApis = Object.freeze([
  ["ExecutiveDecisionManifestPlatform", "Manifest"],
  ["ExecutiveDecisionPhaseManifest", "Manifest"],
  ["ExecutiveDecisionInventoryManifest", "Manifest"],
  ["ExecutiveDecisionDependencyOwnershipManifest", "Manifest"],
  ["ExecutiveDecisionPublicSurfaceManifest", "Manifest"],
  ["ExecutiveDecisionCompatibilityManifest", "Manifest"],
  ["ExecutiveDecisionGuaranteeManifest", "Manifest"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const platformApis = Object.freeze([
  ["ExecutiveDecisionPlatform", "Platform"],
  ["ExecutiveDecisionPlatformMetadata", "Metadata"],
  ["ExecutiveDecisionPlatformComponentRegistry", "Platform"],
  ["ExecutiveDecisionPlatformArchitecture", "Platform"],
  ["ExecutiveDecisionPlatformReadiness", "Platform"],
  ["ExecutiveDecisionPlatformSummary", "Summary"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const certificationApis = Object.freeze([
  ["ExecutiveDecisionCertificationPlatform", "Certification"],
  ["ExecutiveDecisionCertificationMetadata", "Metadata"],
  ["ExecutiveDecisionCertificationGateRegistry", "Certification"],
  ["ExecutiveDecisionCertificationEvidence", "Certification"],
  ["ExecutiveDecisionCertificationCompatibility", "Certification"],
  ["ExecutiveDecisionCertificationManifest", "Certification"],
  ["ExecutiveDecisionCertificationSummary", "Summary"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const freezeApis = Object.freeze([
  ["ExecutiveDecisionFreezePlatform", "Freeze"],
  ["ExecutiveDecisionFreezeMetadata", "Metadata"],
  ["ExecutiveDecisionFreezeRegistry", "Freeze"],
  ["ExecutiveDecisionFreezeCompatibility", "Freeze"],
  ["ExecutiveDecisionOwnershipLocks", "Freeze"],
  ["ExecutiveDecisionDependencyLocks", "Freeze"],
  ["ExecutiveDecisionExtensionLocks", "Freeze"],
  ["ExecutiveDecisionFreezeManifest", "Freeze"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

const publicIndexApis = Object.freeze([
  ["ExecutiveDecisionPlatformPublicFoundation", "PublicIndex"],
  ["ExecutiveDecisionPublicApiRegistry", "PublicIndex"],
  ["ExecutiveDecisionPublicIndexId", "PublicIndex"],
  ["ExecutiveDecisionPublicIndexVersion", "PublicIndex"],
  ["ExecutiveDecisionPublicIndexName", "PublicIndex"],
  ["ExecutiveDecisionPublicIndexDescription", "PublicIndex"],
  ["ExecutiveDecisionPublicIndexNamespace", "PublicIndex"],
  ["ExecutiveDecisionPublicIndexStatus", "PublicIndex"],
  ["getExecutiveDecisionPublicFoundation", "Helper"],
  ["getExecutiveDecisionPublicMetadata", "Metadata"],
  ["getExecutiveDecisionPublicApiRegistry", "Helper"],
  ["getExecutiveDecisionReleaseSummary", "Summary"],
] as const satisfies readonly (readonly [string, ApiCategory])[]);

/**
 * Declared public API registry for ENG-7:1 through ENG-7:9.
 * Totals are architectural constants: 55 prior + 12 public-index = 67.
 */
export const ExecutiveDecisionPublicApiRegistry = Object.freeze([
  ...entries(foundationApis, "ENG-7:1"),
  ...entries(registryApis, "ENG-7:2"),
  ...entries(modelApis, "ENG-7:3"),
  ...entries(validationApis, "ENG-7:4"),
  ...entries(manifestApis, "ENG-7:5"),
  ...entries(platformApis, "ENG-7:6"),
  ...entries(certificationApis, "ENG-7:7"),
  ...entries(freezeApis, "ENG-7:8"),
  ...entries(publicIndexApis, "ENG-7:9"),
] as const);

const publicMetadata = Object.freeze({
  id: ExecutiveDecisionPublicIndexId,
  version: ExecutiveDecisionPublicIndexVersion,
  name: ExecutiveDecisionPublicIndexName,
  description: ExecutiveDecisionPublicIndexDescription,
  namespace: ExecutiveDecisionPublicIndexNamespace,
  status: "Released",
  owner: "ENG-7",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  validationStatus: "ValidationCertified",
  manifestStatus: "ManifestComplete",
  platformStatus: "PlatformAssembled",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  publicApiStatus: "StableAndFrozen",
  releaseStatus: "Released",
  previousPhase: "ENG-7:8",
  currentPhase: "ENG-7:9",
  nextConsumer: "ENG-8",
  readyForOrchestration: true,
  readyForAdvisorConsumption: true,
  readyForSuiteAggregation: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const approvedConsumers = Object.freeze([
  "ENG-8 Executive Orchestration",
  "Advisor",
  "future Engine Suite Public Index",
  "architectural documentation",
  "metadata-only certification and compatibility consumers",
] as const);

const prohibitedUsage = Object.freeze([
  "direct runtime decision execution",
  "alternative selection",
  "confidence calculation",
  "risk calculation",
  "reasoning reconstruction",
  "workflow execution",
  "persistence",
  "database access",
  "network calls",
  "UI behavior",
  "Scene rendering",
  "EVE rendering",
] as const);

const compatibility = Object.freeze({
  eng6ReasoningOutput: "Compatible",
  eng8OrchestrationConsumer: "Compatible",
  advisorConsumer: "Compatible",
  stableNamespace: "Stable",
  stablePublicIdentifiers: "Stable",
  additiveOnlyExtension: "Compatible",
  frozenOwnership: "Frozen",
  frozenDependency: "Frozen",
  noInternalSurfaceExposure: "Protected",
  noBreakingReplacement: "Protected",
  status: "Compatible",
  stability: "Stable",
  freezeProtection: "Frozen",
  protection: "Protected",
  metadataOnly: true,
  immutable: true,
} as const);

const releaseSummary = Object.freeze({
  phase: "ENG-7:9",
  platform: "Executive Decision Engine",
  status: "Released",
  sections: 9,
  completedPhases: 9,
  priorCompletedPhases: 8,
  representedPriorFiles: 62,
  publicIndexFiles: 2,
  totalRepresentedFiles: 64,
  priorApprovedPublicApis: 55,
  publicIndexApprovedPublicApis: 12,
  totalApprovedPublicApis: 67,
  foundationCapabilities: 8,
  decisionDomains: 12,
  decisionTypes: 16,
  decisionCapabilities: 8,
  decisionOutputs: 8,
  lifecycleStates: 8,
  canonicalModels: 10,
  validationRules: 32,
  validationPassing: 32,
  validationFailing: 0,
  certificationGates: 15,
  certificationPassing: 15,
  regressionDeclarations: 10,
  regressionPassing: 10,
  frozenComponents: 7,
  compatibilityDeclarations: 10,
  extensionLocks: 6,
  blockingViolations: 0,
  validationCertified: true,
  manifestComplete: true,
  platformAssembled: true,
  certified: true,
  frozen: true,
  stable: true,
  released: true,
  readyForENG8: true,
  readyForAdvisor: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const publicIndexSection = Object.freeze({
  id: ExecutiveDecisionPublicIndexId,
  version: ExecutiveDecisionPublicIndexVersion,
  name: ExecutiveDecisionPublicIndexName,
  namespace: ExecutiveDecisionPublicIndexNamespace,
  description: ExecutiveDecisionPublicIndexDescription,
  releaseStatus: "Released",
  publicApiCount: 67,
  sectionCount: 9,
  owner: "ENG-7",
  previousPhase: "ENG-7:8",
  approvedConsumers,
  prohibitedUsage,
  compatibility,
  compatibilityStatus: "Compatible",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  publicApiStatus: "StableAndFrozen",
  metadata: publicMetadata,
  apiRegistry: ExecutiveDecisionPublicApiRegistry,
  releaseSummary,
  status: ExecutiveDecisionPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deeplyFrozen: true,
  runtimeFree: true,
} as const);

/**
 * Sole supported public entry point for the Executive Decision Engine.
 * Aggregates ENG-7:1 through ENG-7:8 without redefining prior architecture.
 */
export const ExecutiveDecisionPlatformPublicFoundation = Object.freeze({
  foundation: ExecutiveDecisionFoundation,
  registry: ExecutiveDecisionRegistryPlatform,
  model: ExecutiveDecisionModelPlatform,
  validation: ExecutiveDecisionValidationPlatform,
  manifest: ExecutiveDecisionManifestPlatform,
  platform: ExecutiveDecisionPlatform,
  certification: ExecutiveDecisionCertificationPlatform,
  freeze: ExecutiveDecisionFreezePlatform,
  publicIndex: publicIndexSection,
} as const);

export const getExecutiveDecisionPublicFoundation = () =>
  ExecutiveDecisionPlatformPublicFoundation;
export const getExecutiveDecisionPublicMetadata = () => publicMetadata;
export const getExecutiveDecisionPublicApiRegistry = () =>
  ExecutiveDecisionPublicApiRegistry;
export const getExecutiveDecisionReleaseSummary = () => releaseSummary;
