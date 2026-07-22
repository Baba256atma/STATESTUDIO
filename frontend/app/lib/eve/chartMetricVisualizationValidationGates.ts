import type { ChartMetricVisualizationValidationGate } from "./chartMetricVisualizationValidationTypes.ts";

const gateNames = Object.freeze([
  "Identity Verified", "Registry Verified", "Ownership Verified", "Lifecycle Verified",
  "Capabilities Verified", "Boundaries Verified", "Structure Verified",
  "Relationships Verified", "Metrics Verified", "Charts Verified", "Outputs Verified",
  "Compatibility Verified", "Inventory Verified", "Public Surface Verified",
  "Dependency Verified", "ReadyForManifest",
] as const);

export const ChartMetricVisualizationValidationGates:
readonly ChartMetricVisualizationValidationGate[] = Object.freeze(gateNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:4/Gate/${name.replaceAll(" ", "")}` as const,
    name,
    status: "Verified" as const,
    description: `Deterministic declarative validation gate: ${name}.`,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

const readinessNames = Object.freeze([
  "ValidationComplete", "RulesVerified", "GatesVerified", "InventoryVerified",
  "DependenciesVerified", "MetadataVerified", "ReadyForManifest",
] as const);

export const ChartMetricVisualizationValidationReadinessDeclarations = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-5:4/Readiness/${name}` as const,
    name,
    declared: true,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })),
);
