import type {
  ExecutiveOrchestrationPlatformRegistry as ExecutiveOrchestrationPlatformRegistryDescriptor,
  ExecutiveOrchestrationPlatformRegistryEntry,
  ExecutiveOrchestrationPlatformSectionId,
} from "./executiveOrchestrationPlatformTypes.ts";

const entry = (
  sectionId: ExecutiveOrchestrationPlatformSectionId,
  name: string,
  sourcePhase: string,
  publicSourceModule: string,
) => Object.freeze({
  sectionId,
  name,
  sourcePhase,
  publicSourceModule,
  status: "Assembled",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveOrchestrationPlatformRegistryEntry);

/**
 * Immutable platform registry describing aggregated ENG-8 sections.
 */
export const ExecutiveOrchestrationPlatformRegistry = Object.freeze({
  platformId: "ENG-8:6",
  namespace: "nexora.engine.executive.orchestration.platform",
  phase: "ENG-8:6",
  owner: "ENG-8",
  aggregatedSections: Object.freeze([
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
  ] as const),
  dependencySurfaces: Object.freeze([
    "executiveOrchestrationFoundation.ts",
    "executiveOrchestrationRegistryPlatform.ts",
    "executiveOrchestrationModelPlatform.ts",
    "executiveOrchestrationValidationRunner.ts",
    "executiveOrchestrationManifestPlatform.ts",
  ] as const),
  publicApiSurface: Object.freeze([
    "ExecutiveOrchestrationPlatform",
    "ExecutiveOrchestrationPlatformMetadata",
    "ExecutiveOrchestrationPlatformRegistry",
    "ExecutiveOrchestrationPlatformSummary",
    "getExecutiveOrchestrationPlatform",
    "getExecutiveOrchestrationPlatformSummary",
    "ExecutiveOrchestrationPlatformRunner",
  ] as const),
  releaseVisibility: "ReadyForCertification",
  entries: Object.freeze([
    entry("foundation", "Foundation", "ENG-8:1", "executiveOrchestrationFoundation.ts"),
    entry("registry", "Registry", "ENG-8:2", "executiveOrchestrationRegistryPlatform.ts"),
    entry("model", "Model", "ENG-8:3", "executiveOrchestrationModelPlatform.ts"),
    entry("validation", "Validation", "ENG-8:4", "executiveOrchestrationValidationRunner.ts"),
    entry("manifest", "Manifest", "ENG-8:5", "executiveOrchestrationManifestPlatform.ts"),
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationPlatformRegistryDescriptor);
