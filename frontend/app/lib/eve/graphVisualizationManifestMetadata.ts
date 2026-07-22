import { GraphVisualizationValidation } from "./graphVisualizationValidation.ts";
import {
  GraphVisualizationManifestComposition,
  GraphVisualizationManifestReadiness,
} from "./graphVisualizationManifestComposition.ts";
import { GraphVisualizationManifestCompatibility } from "./graphVisualizationManifestCompatibility.ts";
import { GraphVisualizationManifestGuarantees } from "./graphVisualizationManifestGuarantees.ts";
import { GraphVisualizationManifestInventory } from "./graphVisualizationManifestInventory.ts";

export const GraphVisualizationManifestMetadata = Object.freeze({
  id: "EVE-3:5/GraphVisualizationManifest",
  name: "Graph Visualization Manifest",
  version: "1.0.0",
  namespace: "nexora.eve.graph-visualization.manifest",
  layer: "EVE",
  phase: "EVE-3:5",
  status: "ReadyForPlatform",
  readiness: "ReadyForPlatform",
  validationReference: GraphVisualizationValidation.metadata.id,
  phaseComposition: GraphVisualizationManifestComposition,
  inventory: GraphVisualizationManifestInventory,
  guarantees: GraphVisualizationManifestGuarantees,
  compatibility: GraphVisualizationManifestCompatibility,
  readinessDeclarations: GraphVisualizationManifestReadiness,
  validationMetadata: GraphVisualizationValidation.metadata,
  dependency: Object.freeze({
    graphVisualizationValidationOnly: true,
    directPreviousPhaseModule: "graphVisualizationValidation.ts",
    directModelImport: false,
    directRegistryImport: false,
    directFoundationImport: false,
    directEveTwoImport: false,
    directEveOneImport: false,
    otherPhaseDependencies: false,
  }),
  validationExecution: false,
  analyticsExecution: false,
  traversal: false,
  pathfinding: false,
  layoutExecution: false,
  rendering: false,
  runtimeInteraction: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
