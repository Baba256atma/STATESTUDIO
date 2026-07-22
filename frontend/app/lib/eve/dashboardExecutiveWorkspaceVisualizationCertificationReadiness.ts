import type { DashboardExecutiveWorkspaceCertificationGate } from "./dashboardExecutiveWorkspaceVisualizationCertificationTypes.ts";

const gateNames = Object.freeze([
  "Foundation Gate", "Registry Gate", "Model Gate", "Validation Gate",
  "Manifest Gate", "Platform Gate", "Inventory Gate", "Compatibility Gate",
  "Dependency Gate", "Public Surface Gate", "Metadata Gate",
  "ReadyForFreeze Gate",
] as const);

export const DashboardExecutiveWorkspaceVisualizationCertificationGates:
readonly DashboardExecutiveWorkspaceCertificationGate[] = Object.freeze(
  gateNames.map((name, index) => Object.freeze({
    id: `EVE-6:7/Gate/${index + 1}` as const,
    name,
    outcome: "Passed" as const,
    description: `Deterministic declarative certification gate: ${name}.`,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
