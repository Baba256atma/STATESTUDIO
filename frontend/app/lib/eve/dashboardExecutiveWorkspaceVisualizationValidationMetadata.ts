import type { DashboardExecutiveWorkspaceValidationGate } from "./dashboardExecutiveWorkspaceVisualizationValidationTypes.ts";

const gateNames = Object.freeze([
  "Identity Passed", "Namespace Passed", "Registry References Passed",
  "Foundation References Passed", "EVE-5 References Passed",
  "Relationships Passed", "Composition Passed", "Ownership Passed",
  "Boundaries Passed", "Lifecycle Passed", "Capabilities Passed",
  "Compatibility Passed", "Inventories Passed", "Public Surface Passed",
  "Dependency Isolation Passed", "ReadyForManifest",
] as const);

export const DashboardExecutiveWorkspaceVisualizationValidationGates:
readonly DashboardExecutiveWorkspaceValidationGate[] = Object.freeze(gateNames.map(
  (name, index) => Object.freeze({
    id: `EVE-6:4/Gate/${index + 1}` as const,
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
  "Identity Ready", "References Ready", "Structure Ready", "Metadata Ready",
  "Inventory Ready", "Dependency Ready", "ReadyForManifest",
] as const);

export const DashboardExecutiveWorkspaceVisualizationValidationReadinessDeclarations =
  Object.freeze(readinessNames.map((name, index) => Object.freeze({
    id: `EVE-6:4/Readiness/${index + 1}` as const,
    name,
    declared: true,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })));
