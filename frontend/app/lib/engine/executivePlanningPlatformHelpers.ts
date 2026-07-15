import { ExecutivePlanningPlatform } from "./executivePlanningPlatform.ts";
import { ExecutivePlanningPlatformMetadata } from "./executivePlanningPlatformMetadata.ts";
import { ExecutivePlanningPlatformRegistry } from "./executivePlanningPlatformRegistry.ts";
import { ExecutivePlanningPlatformSummary } from "./executivePlanningPlatformSummary.ts";
import type {
  ExecutivePlanningPlatformInventory,
  ExecutivePlanningPlatformSectionEntry,
} from "./executivePlanningPlatformTypes.ts";

const inventory = Object.freeze({
  foundationComponents: 6,
  registryEntries: 56,
  modelDefinitions: 38,
  validationRules: 44,
  manifestSections: 4,
  platformSectionCount: 5,
  ownership: "ENG-5",
  executionOwner: "OPS",
  readiness: "ReadyForCertification",
  nextPhase: "ENG-5:7",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningPlatformInventory);

const sectionIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningPlatformRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningPlatformSectionEntry | undefined>
  >,
);

export const getExecutivePlanningPlatform = () => ExecutivePlanningPlatform;
export const getExecutivePlanningPlatformMetadata = () => ExecutivePlanningPlatformMetadata;
export const getExecutivePlanningPlatformSummary = () => ExecutivePlanningPlatformSummary;
export const getExecutivePlanningPlatformRegistry = () => ExecutivePlanningPlatformRegistry;
export const getExecutivePlanningPlatformInventory = (
  id?: string,
): ExecutivePlanningPlatformInventory | ExecutivePlanningPlatformSectionEntry | undefined => {
  if (id === undefined) return inventory;
  return sectionIndex[id];
};
