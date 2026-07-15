import { ExecutiveReasoningCompatibility } from "./executiveReasoningCompatibility.ts";
import { ExecutiveReasoningDependencyMap } from "./executiveReasoningDependencyMap.ts";
import { ExecutiveReasoningManifest } from "./executiveReasoningManifest.ts";
import { ExecutiveReasoningManifestMetadata } from "./executiveReasoningManifestMetadata.ts";
import { ExecutiveReasoningManifestSummary } from "./executiveReasoningManifestSummary.ts";
import { ExecutiveReasoningOwnershipMap } from "./executiveReasoningOwnershipMap.ts";

export const ExecutiveReasoningManifestPlatform = Object.freeze({
  metadata: ExecutiveReasoningManifestMetadata,
  manifest: ExecutiveReasoningManifest,
  dependencyMap: ExecutiveReasoningDependencyMap,
  ownershipMap: ExecutiveReasoningOwnershipMap,
  compatibility: ExecutiveReasoningCompatibility,
  summary: ExecutiveReasoningManifestSummary,
  ownership: Object.freeze({
    owner: "ENG-6",
    owns: Object.freeze([
      "architectural metadata",
      "manifest sections",
      "dependency metadata",
      "ownership metadata",
      "compatibility metadata",
      "public API inventory",
      "release metadata",
    ] as const),
    neverOwns: Object.freeze([
      "reasoning execution",
      "inference",
      "confidence calculation",
      "evidence processing",
      "planning",
      "orchestration",
      "decision making",
      "runtime behavior",
      "business logic",
    ] as const),
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const getExecutiveReasoningManifest = () => ExecutiveReasoningManifest;
export const getExecutiveReasoningManifestMetadata = () => ExecutiveReasoningManifestMetadata;
export const getExecutiveReasoningManifestSummary = () => ExecutiveReasoningManifestSummary;

export {
  ExecutiveReasoningCompatibility,
  ExecutiveReasoningDependencyMap,
  ExecutiveReasoningManifest,
  ExecutiveReasoningOwnershipMap,
};
