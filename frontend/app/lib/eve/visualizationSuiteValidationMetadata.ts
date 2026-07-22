import type { VisualizationSuiteValidationGate } from "./visualizationSuiteValidationTypes.ts";

const gateNames = Object.freeze([
  "Identity Verified", "Registry Verified", "Composition Verified",
  "Public Indexes Verified", "Relationships Verified", "Ownership Verified",
  "Boundaries Verified", "Lifecycle Verified", "Capabilities Verified",
  "Compatibility Verified", "Namespace Verified", "Inventory Verified",
  "Dependencies Verified", "Ready For Manifest",
] as const);

export const VisualizationSuiteValidationGates:
readonly VisualizationSuiteValidationGate[] = Object.freeze(gateNames.map(
  (name, index) => Object.freeze({
    id: `EVE-9:4/Gate/${index + 1}` as const,
    name,
    outcome: "Passed" as const,
    description: `Deterministic declarative validation gate: ${name}.`,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

const readinessNames = Object.freeze([
  "Identity Ready", "Registry Ready", "Composition Ready",
  "Public Indexes Ready", "Relationships Ready", "Inventory Ready",
  "ReadyForManifest",
] as const);

export const VisualizationSuiteValidationReadinessDeclarations = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-9:4/Readiness/${index + 1}` as const,
    name,
    declared: true,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })),
);
