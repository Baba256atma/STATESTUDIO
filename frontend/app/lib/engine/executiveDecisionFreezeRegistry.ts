import type {
  ExecutiveDecisionFreezeEntry,
  ExecutiveDecisionFreezeEntryId,
} from "./executiveDecisionFreezeTypes.ts";

const entry = (
  id: ExecutiveDecisionFreezeEntryId,
  name: string,
  owningPhase: ExecutiveDecisionFreezeEntry["owningPhase"],
  sourceModule: string,
  representedFileCount: number,
  approvedPublicExportCount: number,
) => Object.freeze({
  id,
  componentId: id,
  name,
  owningPhase,
  sourceModule,
  version: "1.0.0",
  freezeStatus: "Frozen",
  certificationStatus: "Certified",
  approvedPublicExportCount,
  representedFileCount,
  compatibilityLevel: "Frozen",
  ownershipLockStatus: "Locked",
  dependencyLockStatus: "Locked",
  extensionPolicy: "AdditiveOnlyControlled",
  replacementPolicy: "VersionedSuccessorOnly",
  metadataOnly: true,
  immutable: true,
  runtimeBehavior: "None",
} as const satisfies ExecutiveDecisionFreezeEntry);

/**
 * Canonical ENG-7:8 freeze registry.
 * Counts are declared architectural constants.
 */
export const ExecutiveDecisionFreezeRegistry = Object.freeze([
  entry("foundation", "Foundation", "ENG-7:1", "executiveDecisionPublicApi.ts", 7, 6),
  entry("registry", "Registry", "ENG-7:2", "executiveDecisionRegistryPlatform.ts", 8, 7),
  entry("model", "Model", "ENG-7:3", "executiveDecisionModelPlatform.ts", 9, 8),
  entry("validation", "Validation", "ENG-7:4", "executiveDecisionValidationPlatform.ts", 8, 6),
  entry("manifest", "Manifest", "ENG-7:5", "executiveDecisionManifestPlatform.ts", 8, 7),
  entry("platform", "Platform", "ENG-7:6", "executiveDecisionPlatform.ts", 7, 6),
  entry("certification", "Certification", "ENG-7:7", "executiveDecisionCertificationPlatform.ts", 7, 7),
] as const);

export const ExecutiveDecisionFreezeRegistryTotals = Object.freeze({
  frozenComponents: 7,
  completedPhases: 7,
  representedFiles: 54,
  approvedPublicExports: 47,
} as const);

const entryIndex = Object.freeze(
  Object.fromEntries(
    ExecutiveDecisionFreezeRegistry.map((item) => [item.id, item]),
  ) as Readonly<Record<string, ExecutiveDecisionFreezeEntry | undefined>>,
);

export const getExecutiveDecisionFreezeEntryById = (
  id: string,
): ExecutiveDecisionFreezeEntry | undefined => entryIndex[id];
