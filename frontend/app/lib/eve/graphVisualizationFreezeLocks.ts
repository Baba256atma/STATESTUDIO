import type { GraphVisualizationFreezeLock } from "./graphVisualizationFreezeTypes.ts";

const lockNames = Object.freeze([
  "Foundation Lock", "Registry Lock", "Model Lock", "Validation Lock",
  "Manifest Lock", "Platform Lock", "Certification Lock",
  "Canonical Composition Lock", "Canonical Inventory Lock", "Public Surface Lock",
  "Dependency Lock", "Metadata Integrity Lock",
] as const);

export const GraphVisualizationFreezeLocks:
readonly GraphVisualizationFreezeLock[] = Object.freeze(
  lockNames.map((name, index) => Object.freeze({
    id: `EVE-3:8/Lock/${name.replaceAll(" ", "")}`,
    name,
    lockIdentifier: "EVE-3-GRAPH-VISUALIZATION-LOCKED",
    status: "Locked",
    description: `Immutable declarative architectural lock: ${name}.`,
    deterministicOrder: index + 1,
    runtimeLocking: false,
    metadataOnly: true,
    immutable: true,
  })),
);
