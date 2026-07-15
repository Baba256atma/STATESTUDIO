import type { ExecutivePlanningPlatformMetadataDescriptor } from "./executivePlanningPlatformTypes.ts";

export const ExecutivePlanningPlatformMetadata = Object.freeze({
  platformId: "ENG-5:6",
  version: "1.0.0",
  namespace: "nexora.engine.executive.planning.platform",
  name: "Executive Planning Platform",
  description:
    "Canonical immutable metadata-only aggregate platform for the complete ENG-5:1 through ENG-5:5 Executive Planning architecture.",
  phase: "ENG-5:6",
  owner: "ENG-5",
  architectureStatus: "Complete",
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  immutable: true,
  ownershipDeclaration: "ENG-5",
  executionOwner: "OPS",
  dependencyDeclaration: Object.freeze([
    "executivePlanningIndex.ts",
    "executivePlanningRegistryIndex.ts",
    "executivePlanningModelIndex.ts",
    "executivePlanningValidationIndex.ts",
    "executivePlanningManifestIndex.ts",
  ] as const),
  readiness: "ReadyForCertification",
  status: Object.freeze({
    platform: "Platform",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
    readyForCertification: "ReadyForCertification",
  } as const),
  nextPhase: "ENG-5:7",
} as const satisfies ExecutivePlanningPlatformMetadataDescriptor);
