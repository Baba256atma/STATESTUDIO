import type { ChartMetricVisualizationCertificationGate } from "./chartMetricVisualizationCertificationTypes.ts";

const gateNames = Object.freeze([
  "Identity Certified", "Composition Certified", "References Certified",
  "Inventory Certified", "Capabilities Certified", "Guarantees Certified",
  "Compatibility Certified", "Public Surface Certified", "Dependencies Certified",
  "Metadata Certified", "Platform Certified", "ReadyForFreeze",
] as const);

export const ChartMetricVisualizationCertificationGates:
readonly ChartMetricVisualizationCertificationGate[] = Object.freeze(gateNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:7/Gate/${name.replaceAll(" ", "")}` as const,
    name,
    outcome: "Passed" as const,
    description: `Deterministic declarative certification gate: ${name}.`,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
