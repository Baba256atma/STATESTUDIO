import type { AutomationPlatformDependencyEntry } from "./automationManifestTypes.ts";

const createEntry = (
  sourcePhaseId: string,
  targetPhaseId: string,
  relationship: string,
) =>
  Object.freeze({
    sourcePhaseId,
    targetPhaseId,
    dependencyType: "PublicApi",
    relationship,
    metadataOnly: true,
  } as const satisfies AutomationPlatformDependencyEntry);

export const AutomationPlatformDependencyMap = Object.freeze([
  createEntry("OPS-8:1", "OPS-8:1", "Foundation defines the canonical automation contracts."),
  createEntry("OPS-8:2", "OPS-8:1", "Registry consumes automation foundation public contracts."),
  createEntry("OPS-8:3", "OPS-8:1", "Model consumes automation foundation public contracts."),
  createEntry("OPS-8:3", "OPS-8:2", "Model consumes automation registry public catalogs."),
  createEntry("OPS-8:4", "OPS-8:1", "Validation consumes automation foundation public contracts."),
  createEntry("OPS-8:4", "OPS-8:2", "Validation consumes automation registry public catalogs."),
  createEntry("OPS-8:4", "OPS-8:3", "Validation consumes automation model public structures."),
  createEntry("OPS-8", "OPS-2", "Automation remains compatible with task intelligence metadata."),
  createEntry("OPS-8", "OPS-3", "Automation remains compatible with workflow intelligence metadata."),
  createEntry("OPS-8", "OPS-4", "Automation remains compatible with project execution metadata."),
  createEntry("OPS-8", "OPS-5", "Automation remains compatible with resource intelligence metadata."),
  createEntry("OPS-8", "OPS-6", "Automation remains compatible with scheduling intelligence metadata."),
  createEntry("OPS-8", "OPS-7", "Automation remains compatible with dependency intelligence metadata."),
] as const);

export const AutomationPlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops-8-5-automation-dependency-map",
  dependencyCount: AutomationPlatformDependencyMap.length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
