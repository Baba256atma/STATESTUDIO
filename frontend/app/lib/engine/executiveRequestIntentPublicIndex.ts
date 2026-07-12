import { ExecutiveRequestIntentFoundation } from "./executiveRequestIntentIndex.ts";
import { ExecutiveRequestIntentManifest } from "./executiveRequestIntentManifestIndex.ts";
import { ExecutiveRequestIntentModelManifest } from "./executiveRequestIntentModelIndex.ts";
import { ExecutiveRequestIntentPlatform } from "./executiveRequestIntentPlatformIndex.ts";
import { ExecutiveRequestIntentPlatformCertification } from "./executiveRequestIntentPlatformCertificationIndex.ts";
import { ExecutiveRequestIntentPlatformFreeze } from "./executiveRequestIntentPlatformFreezeIndex.ts";
import { ExecutiveRequestIntentRegistryManifest } from "./executiveRequestIntentRegistryIndex.ts";
import { ExecutiveRequestIntentValidationManifest } from "./executiveRequestIntentValidationIndex.ts";

export const ExecutiveRequestIntentPublicIndexId = "ENG-2:9" as const;
export const ExecutiveRequestIntentPublicIndexVersion = "1.0.0" as const;
export const ExecutiveRequestIntentPublicIndexName = "Executive Request & Intent Public Index" as const;
export const ExecutiveRequestIntentPublicIndexDescription = "Canonical immutable public release surface for the complete ENG-2 Executive Request & Intent Platform." as const;
export const ExecutiveRequestIntentPublicIndexNamespace = "nexora.engine.executive.request-intent.public" as const;
export const ExecutiveRequestIntentPublicIndexStatus = Object.freeze({
  releaseStatus: "Released", certificationStatus: "Certified", freezeStatus: "Frozen",
  publicApiStatus: "Stable", metadataOnly: true, immutable: true, deterministic: true,
} as const);

type OwnerPhase = "ENG-2:1" | "ENG-2:2" | "ENG-2:3" | "ENG-2:4" | "ENG-2:5" | "ENG-2:6" | "ENG-2:7" | "ENG-2:8" | "ENG-2:9";
const api = (exportName: string, ownerPhase: OwnerPhase, namespace: string) => Object.freeze({
  apiIdentifier: `${ownerPhase}:${exportName}`, exportName, ownerPhase, namespace, stability: "Stable",
  visibility: "Public", releaseStatus: "Released", metadataOnly: true, immutable: true,
} as const);
const entries = (names: readonly string[], phase: OwnerPhase, namespace: string) => names.map((name) => api(name, phase, namespace));

const foundationApis = Object.freeze([
  "ExecutiveRequestIntentFoundation", "ExecutiveRequestIntentContracts", "ExecutiveRequestIntentRegistry",
  "ExecutiveRequestIntentMetadata", "getExecutiveRequestIntentFoundation", "getExecutiveRequestIntentRegistry",
  "getExecutiveRequestIntentMetadata",
]);
const registryApis = Object.freeze([
  "ExecutiveRequestCategoryRegistry", "ExecutiveIntentRegistry", "ExecutiveRequestPriorityRegistry",
  "ExecutiveRequestStatusRegistry", "ExecutiveRequestScopeRegistry", "ExecutiveRequestSourceRegistry",
  "ExecutiveRequestClassificationRegistry", "ExecutiveRequestContextRegistry", "ExecutiveRequestIntentRegistryManifest",
  "getExecutiveRequestIntentRegistryManifest", "getExecutiveRequestRegistrySummary",
]);
const modelApis = Object.freeze([
  "ExecutiveRequestIntentRequestModel", "ExecutiveRequestIntentIntentModel", "ExecutiveRequestIntentClassificationModel",
  "ExecutiveRequestIntentContextModel", "ExecutiveRequestIntentMetadataModel", "ExecutiveRequestIntentLifecycleModel",
  "ExecutiveRequestIntentRelationshipModel", "ExecutiveRequestIntentModelManifest",
  "getExecutiveRequestIntentModelManifest", "getExecutiveRequestIntentModelSummary",
]);
const validationApis = Object.freeze([
  "ExecutiveRequestIntentFoundationValidation", "ExecutiveRequestIntentRegistryValidation",
  "ExecutiveRequestIntentModelValidation", "ExecutiveRequestIntentOwnershipValidation",
  "ExecutiveRequestIntentPublicApiValidation", "ExecutiveRequestIntentValidationManifest",
  "getExecutiveRequestIntentValidationManifest", "getExecutiveRequestIntentValidationSummary",
]);
const manifestApis = Object.freeze([
  "ExecutiveRequestIntentManifest", "ExecutiveRequestIntentPhaseRegistry", "ExecutiveRequestIntentDependencyMap",
  "ExecutiveRequestIntentPublicSurface", "getExecutiveRequestIntentManifest",
  "getExecutiveRequestIntentManifestSummary", "getExecutiveRequestIntentDependencySummary",
]);
const platformApis = Object.freeze([
  "ExecutiveRequestIntentPlatform", "ExecutiveRequestIntentPlatformRegistry", "ExecutiveRequestIntentPlatformMetadata",
  "getExecutiveRequestIntentPlatform", "getExecutiveRequestIntentPlatformRegistry",
  "getExecutiveRequestIntentPlatformMetadata", "getExecutiveRequestIntentPlatformSummary",
]);
const certificationApis = Object.freeze([
  "ExecutiveRequestIntentPlatformCertification", "ExecutiveRequestIntentCertificationRegistry",
  "ExecutiveRequestIntentCertificationCompatibility", "ExecutiveRequestIntentCertificationManifest",
  "getExecutiveRequestIntentPlatformCertification", "getExecutiveRequestIntentCertificationSummary",
  "getExecutiveRequestIntentCompatibilitySummary",
]);
const freezeApis = Object.freeze([
  "ExecutiveRequestIntentPlatformFreeze", "ExecutiveRequestIntentPlatformFreezeRegistry",
  "ExecutiveRequestIntentPlatformCompatibility", "ExecutiveRequestIntentPlatformFreezeManifest",
  "getExecutiveRequestIntentPlatformFreeze", "getExecutiveRequestIntentFreezeSummary",
  "getExecutiveRequestIntentCompatibilitySummary",
]);
const publicIndexApis = Object.freeze([
  "ExecutiveRequestIntentPlatformPublicFoundation", "ExecutiveRequestIntentPublicApiRegistry",
  "ExecutiveRequestIntentPublicIndexId", "ExecutiveRequestIntentPublicIndexVersion",
  "ExecutiveRequestIntentPublicIndexName", "ExecutiveRequestIntentPublicIndexDescription",
  "ExecutiveRequestIntentPublicIndexNamespace", "ExecutiveRequestIntentPublicIndexStatus",
  "getExecutiveRequestIntentPublicFoundation", "getExecutiveRequestIntentPublicMetadata",
  "getExecutiveRequestIntentPublicApiRegistry", "getExecutiveRequestIntentReleaseSummary",
]);

export const ExecutiveRequestIntentPublicApiRegistry = Object.freeze([
  ...entries(foundationApis, "ENG-2:1", "nexora.engine.executive.request-intent.foundation"),
  ...entries(registryApis, "ENG-2:2", "nexora.engine.executive.request-intent.registry"),
  ...entries(modelApis, "ENG-2:3", "nexora.engine.executive.request-intent.model"),
  ...entries(validationApis, "ENG-2:4", "nexora.engine.executive.request-intent.validation"),
  ...entries(manifestApis, "ENG-2:5", "nexora.engine.executive.request-intent.manifest"),
  ...entries(platformApis, "ENG-2:6", "nexora.engine.executive.request-intent.platform"),
  ...entries(certificationApis, "ENG-2:7", "nexora.engine.executive.request-intent.certification"),
  ...entries(freezeApis, "ENG-2:8", "nexora.engine.executive.request-intent.freeze"),
  ...entries(publicIndexApis, "ENG-2:9", ExecutiveRequestIntentPublicIndexNamespace),
]);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveRequestIntentPublicIndexId,
  version: ExecutiveRequestIntentPublicIndexVersion,
  name: ExecutiveRequestIntentPublicIndexName,
  namespace: ExecutiveRequestIntentPublicIndexNamespace,
  description: ExecutiveRequestIntentPublicIndexDescription,
  owner: "ENG-2", status: ExecutiveRequestIntentPublicIndexStatus,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  releaseId: "ENG-2-RELEASE-001", completedPhaseCount: 8, publicIndexPhase: "ENG-2:9",
  namespaceSectionCount: 9, priorPublicApiCount: 64, publicIndexApiCount: 12, totalPublicApiCount: 76,
  releaseStatus: "Released", certificationStatus: "Certified", freezeStatus: "Frozen",
  publicApiStatus: "Stable", ownershipStatus: "Protected", collisionStatus: "CollisionSafe",
  dependencyPolicy: "PublicIndicesOnly", metadataOnly: true, immutable: true, deterministic: true,
} as const);

const publicIndex = Object.freeze({
  metadata: publicMetadata, apiRegistry: ExecutiveRequestIntentPublicApiRegistry,
  releaseSummary, status: ExecutiveRequestIntentPublicIndexStatus,
} as const);

export const ExecutiveRequestIntentPlatformPublicFoundation = Object.freeze({
  foundation: ExecutiveRequestIntentFoundation,
  registry: ExecutiveRequestIntentRegistryManifest,
  model: ExecutiveRequestIntentModelManifest,
  validation: ExecutiveRequestIntentValidationManifest,
  manifest: ExecutiveRequestIntentManifest,
  platform: ExecutiveRequestIntentPlatform,
  certification: ExecutiveRequestIntentPlatformCertification,
  freeze: ExecutiveRequestIntentPlatformFreeze,
  publicIndex,
} as const);

export const getExecutiveRequestIntentPublicFoundation = () => ExecutiveRequestIntentPlatformPublicFoundation;
export const getExecutiveRequestIntentPublicMetadata = () => publicMetadata;
export const getExecutiveRequestIntentPublicApiRegistry = () => ExecutiveRequestIntentPublicApiRegistry;
export const getExecutiveRequestIntentReleaseSummary = () => releaseSummary;
