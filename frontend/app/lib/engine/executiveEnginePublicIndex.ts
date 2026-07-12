import * as foundationApi from "./engineIndex.ts";
import * as registryApi from "./engineRegistryIndex.ts";
import * as modelApi from "./engineModelIndex.ts";
import * as validationApi from "./engineValidationIndex.ts";
import * as manifestApi from "./engineManifestIndex.ts";
import * as platformApi from "./enginePlatformIndex.ts";
import * as certificationApi from "./engineCertificationIndex.ts";
import * as freezeApi from "./engineFreezeIndex.ts";

export const ExecutiveEnginePublicIndexId = "ENG-1:9" as const;
export const ExecutiveEnginePublicIndexName = "Executive Engine Public Index" as const;
export const ExecutiveEnginePublicIndexVersion = "1.0.0" as const;
export const ExecutiveEnginePublicIndexDescription = "Final canonical public release surface for the Nexora Executive Engine Foundation." as const;
export const ExecutiveEnginePublicIndexNamespace = "nexora.engine.executive.public" as const;
export const ExecutiveEnginePublicIndexStatus = Object.freeze({
  releaseStatus: "Released",
  certificationStatus: certificationApi.ExecutiveEngineCertificationSummary.certificationStatus,
  freezeStatus: freezeApi.ExecutiveEngineFreezeSummary.freezeStatus,
  platformStatus: freezeApi.ExecutiveEngineFreezeSummary.readiness === "ReadyForPublicIndex" ? "ReadyForEngineExpansion" : "Blocked",
  metadataClassification: "MetadataOnly", runtimeClassification: "RuntimeFree",
  architecturalClassification: "ExecutiveEngineFoundationPublicPlatform",
  immutable: true, deterministic: true, publicApiStable: true,
} as const);

type PublicCategory = "Foundation" | "Registry" | "Model" | "Validation" | "Manifest" | "Platform" | "Certification" | "Freeze" | "PublicIndex";
const publicEntries = (api: object, sourcePhase: string, category: PublicCategory, offset: number) => Object.freeze(Object.keys(api).sort().map((exportName, index) => Object.freeze({
  artifactId: `ENG-PUBLIC-API-${String(offset + index + 1).padStart(3, "0")}`,
  exportName, sourcePhase, category, releaseStatus: "Released",
  publicStability: "Stable", metadataOnly: true, immutable: true,
})));
const foundation = publicEntries(foundationApi, "ENG-1:1", "Foundation", 0);
const registry = publicEntries(registryApi, "ENG-1:2", "Registry", foundation.length);
const model = publicEntries(modelApi, "ENG-1:3", "Model", foundation.length + registry.length);
const validation = publicEntries(validationApi, "ENG-1:4", "Validation", foundation.length + registry.length + model.length);
const manifest = publicEntries(manifestApi, "ENG-1:5", "Manifest", foundation.length + registry.length + model.length + validation.length);
const platform = publicEntries(platformApi, "ENG-1:6", "Platform", foundation.length + registry.length + model.length + validation.length + manifest.length);
const certification = publicEntries(certificationApi, "ENG-1:7", "Certification", foundation.length + registry.length + model.length + validation.length + manifest.length + platform.length);
const freeze = publicEntries(freezeApi, "ENG-1:8", "Freeze", foundation.length + registry.length + model.length + validation.length + manifest.length + platform.length + certification.length);
const priorPublicCount = foundation.length + registry.length + model.length + validation.length + manifest.length + platform.length + certification.length + freeze.length;
const publicIndexNames = Object.freeze([
  "ExecutiveEngineFoundationPublicPlatform", "ExecutiveEnginePublicApiRegistry",
  "ExecutiveEnginePublicIndexId", "ExecutiveEnginePublicIndexName", "ExecutiveEnginePublicIndexVersion",
  "ExecutiveEnginePublicIndexDescription", "ExecutiveEnginePublicIndexNamespace", "ExecutiveEnginePublicIndexStatus",
  "getExecutiveEngineFoundation", "getExecutiveEnginePublicMetadata",
  "getExecutiveEnginePublicApiRegistry", "getExecutiveEngineReleaseSummary",
]);
const publicIndexEntries = publicEntries(Object.fromEntries(publicIndexNames.map((name) => [name, true])), "ENG-1:9", "PublicIndex", priorPublicCount);

export const ExecutiveEnginePublicApiRegistry = Object.freeze({
  artifactId: "ENG-PUBLIC-REGISTRY-001",
  foundation, registry, model, validation, manifest, platform, certification, freeze,
  publicIndex: publicIndexEntries,
  all: Object.freeze([...foundation, ...registry, ...model, ...validation, ...manifest, ...platform, ...certification, ...freeze, ...publicIndexEntries]),
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  id: ExecutiveEnginePublicIndexId, name: ExecutiveEnginePublicIndexName,
  version: ExecutiveEnginePublicIndexVersion, description: ExecutiveEnginePublicIndexDescription,
  namespace: ExecutiveEnginePublicIndexNamespace, status: ExecutiveEnginePublicIndexStatus,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  releaseIdentifier: "ENG-RELEASE-001", foundationVersion: foundationApi.ExecutiveEngineRegistry.version,
  completedPhases: 8,
  architecturalSections: Object.freeze(["foundation", "registry", "model", "validation", "manifest", "platform", "certification", "freeze"]),
  capabilityCount: registryApi.ExecutiveEngineCapabilityRegistry.length,
  modelCount: modelApi.ExecutiveEngineModelRegistry.length,
  validationDomainCount: validationApi.ExecutiveEngineValidationManifest.validationDomains.length,
  certificationGateCount: certificationApi.ExecutiveEngineCertificationRegistry.length,
  compatibilityCount: freezeApi.ExecutiveEngineCompatibilityMatrix.length,
  extensionPointCount: freezeApi.ExecutiveEngineExtensionPolicy.futureExtensionPoints.length,
  publicApiCount: ExecutiveEnginePublicApiRegistry.all.length,
  releaseStatus: ExecutiveEnginePublicIndexStatus.releaseStatus,
  certificationStatus: ExecutiveEnginePublicIndexStatus.certificationStatus,
  freezeStatus: ExecutiveEnginePublicIndexStatus.freezeStatus,
  metadataOnlyStatus: true, runtimeFreeStatus: true,
  architecturalReadiness: ExecutiveEnginePublicIndexStatus.platformStatus,
  nextPhase: "ENG-2 — Executive Request Understanding",
  immutable: true, deterministic: true,
} as const);

const publicIndex = Object.freeze({ metadata: publicMetadata, registry: ExecutiveEnginePublicApiRegistry,
  releaseSummary, status: ExecutiveEnginePublicIndexStatus });

export const ExecutiveEngineFoundationPublicPlatform = Object.freeze({
  foundation: Object.freeze({ ...foundationApi }), registry: Object.freeze({ ...registryApi }),
  model: Object.freeze({ ...modelApi }), validation: Object.freeze({ ...validationApi }),
  manifest: Object.freeze({ ...manifestApi }), platform: Object.freeze({ ...platformApi }),
  certification: Object.freeze({ ...certificationApi }), freeze: Object.freeze({ ...freezeApi }),
  publicIndex,
} as const);

export const getExecutiveEngineFoundation = () => ExecutiveEngineFoundationPublicPlatform;
export const getExecutiveEnginePublicMetadata = () => publicMetadata;
export const getExecutiveEnginePublicApiRegistry = () => ExecutiveEnginePublicApiRegistry;
export const getExecutiveEngineReleaseSummary = () => releaseSummary;
