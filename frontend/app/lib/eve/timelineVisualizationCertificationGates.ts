import type { TimelineVisualizationCertificationGate } from "./timelineVisualizationCertificationTypes.ts";

const gateNames = Object.freeze([
  "Identity Passed", "Platform Passed", "Dependencies Passed", "References Passed",
  "Inventories Passed", "Compatibility Passed", "Boundaries Passed",
  "Public Surface Passed", "Metadata Passed", "Canonical Inventory Rule Passed",
  "Certification Complete", "ReadyForFreeze",
] as const);

export const TimelineVisualizationCertificationGates:
readonly TimelineVisualizationCertificationGate[] = Object.freeze(
  gateNames.map((name, index) => Object.freeze({
    id: `EVE-4:7/Gate/${name.replaceAll(" ", "")}`,
    name,
    status: "Passed",
    description: `Deterministic declarative certification gate: ${name}.`,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
