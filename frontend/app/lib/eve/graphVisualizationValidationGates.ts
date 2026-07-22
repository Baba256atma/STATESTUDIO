import { GraphVisualizationModel } from "./graphVisualizationModel.ts";
import type { GraphVisualizationValidationGate } from "./graphVisualizationValidationTypes.ts";

const gateNames = Object.freeze([
  "IdentityVerified", "RegistryVerified", "OwnershipVerified", "LifecycleVerified",
  "CapabilitiesVerified", "BoundariesVerified", "StructureVerified",
  "RelationshipsVerified", "CompatibilityVerified", "InventoryVerified",
  "PublicSurfaceVerified", "DependencyVerified", "ImmutabilityVerified",
  "ReadyForManifest",
] as const);

export const GraphVisualizationValidationGates: readonly GraphVisualizationValidationGate[] =
  Object.freeze(gateNames.map((name, index) => Object.freeze({
    id: `EVE-3:4/Gate/${name}`,
    name,
    outcome: "Passed",
    status: "Declared",
    modelReference: GraphVisualizationModel.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));

const readinessNames = Object.freeze([
  "ValidationComplete", "RulesVerified", "GatesVerified", "InventoryVerified",
  "DependenciesVerified", "MetadataVerified", "ReadyForManifest",
] as const);

export const GraphVisualizationValidationReadinessDeclarations = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-3:4/Readiness/${name}`,
    name,
    ready: true,
    modelReference: GraphVisualizationModel.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
