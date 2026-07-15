import type { ExecutivePlanningFreezeRegistryEntry } from "./executivePlanningFreezeTypes.ts";

const entry = (
  key: string,
  componentName: string,
  phase: ExecutivePlanningFreezeRegistryEntry["phase"],
  publicApiReference: string,
) => Object.freeze({
  id: `eng-5-freeze-entry-${key}`,
  componentName,
  phase,
  frozenVersion: "1.0.0",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  readiness: "ReadyForPublicIndex",
  publicApiReference,
  owner: "ENG-5",
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
} as const satisfies ExecutivePlanningFreezeRegistryEntry);

export const ExecutivePlanningFreezeRegistry = Object.freeze([
  entry("foundation", "Foundation", "ENG-5:1", "executivePlanningIndex.ts"),
  entry("registry", "Registry", "ENG-5:2", "executivePlanningRegistryIndex.ts"),
  entry("model", "Model", "ENG-5:3", "executivePlanningModelIndex.ts"),
  entry("validation", "Validation", "ENG-5:4", "executivePlanningValidationIndex.ts"),
  entry("manifest", "Manifest", "ENG-5:5", "executivePlanningManifestIndex.ts"),
  entry("platform", "Platform", "ENG-5:6", "executivePlanningPlatformIndex.ts"),
  entry("certification", "Certification", "ENG-5:7", "executivePlanningCertificationIndex.ts"),
] as const);

const entryIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningFreezeRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningFreezeRegistryEntry | undefined>
  >,
);

export const getExecutivePlanningFreezeRegistry = () => ExecutivePlanningFreezeRegistry;
export const getExecutivePlanningFreezeEntryById = (
  id: string,
): ExecutivePlanningFreezeRegistryEntry | undefined => entryIndex[id];
