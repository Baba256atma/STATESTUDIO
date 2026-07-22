import type { TimelineVisualizationValidationGate } from "./timelineVisualizationValidationTypes.ts";

const gateNames = Object.freeze([
  "Identity Passed", "Namespace Passed", "Registry Passed", "Foundation Passed",
  "Structure Passed", "Relationships Passed", "Ownership Passed", "Lifecycle Passed",
  "Compatibility Passed", "Metadata Passed", "Inventory Passed", "Public Surface Passed",
  "Canonical Inventory Rule Passed", "ReadyForManifest",
] as const);

export const TimelineVisualizationValidationGates:
readonly TimelineVisualizationValidationGate[] = Object.freeze(
  gateNames.map((name, index) => Object.freeze({
    id: `EVE-4:4/Gate/${name.replaceAll(" ", "")}`,
    name,
    status: "Passed",
    description: `Deterministic declarative validation gate: ${name}.`,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const readinessNames = Object.freeze([
  "ValidationComplete", "IdentityVerified", "StructureVerified",
  "CompatibilityVerified", "InventoryVerified", "MetadataVerified", "ReadyForManifest",
] as const);

export const TimelineVisualizationValidationReadinessDeclarations = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-4:4/Readiness/${name}`,
    name,
    declared: true,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })),
);
