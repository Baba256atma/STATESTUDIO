import { VisualizationValidation } from "./visualizationValidation.ts";
import { VisualizationManifestCompatibility } from "./visualizationManifestCompatibility.ts";
import { VisualizationManifestGuarantees } from "./visualizationManifestGuarantees.ts";
import { VisualizationManifestInventory } from "./visualizationManifestInventory.ts";
import { VisualizationManifestReadiness } from "./visualizationManifestReadiness.ts";

const model = VisualizationValidation.model;
const registry = model.registry;
const foundation = registry.foundation;

export const VisualizationManifestMetadata = Object.freeze({
  id: "EVE-1:5/VisualizationManifest",
  name: "Visualization Manifest",
  version: "1.0.0",
  namespace: "nexora.eve.visualization.manifest",
  layer: "Visualization Engine (EVE)",
  status: "Manifest",
  readiness: "ReadyForPlatform",
  phaseComposition: Object.freeze([
    Object.freeze({ phase: "Foundation", canonicalReference: foundation.identity.id, deterministicOrder: 1 }),
    Object.freeze({ phase: "Registry", canonicalReference: registry.metadata.id, deterministicOrder: 2 }),
    Object.freeze({ phase: "Model", canonicalReference: model.metadata.id, deterministicOrder: 3 }),
    Object.freeze({ phase: "Validation", canonicalReference: VisualizationValidation.metadata.id, deterministicOrder: 4 }),
    Object.freeze({ phase: "Manifest", canonicalReference: "EVE-1:5/VisualizationManifest", deterministicOrder: 5 }),
  ]),
  inventory: VisualizationManifestInventory,
  validationSummary: VisualizationValidation.metadata,
  guarantees: VisualizationManifestGuarantees,
  readinessDeclaration: VisualizationManifestReadiness,
  compatibility: VisualizationManifestCompatibility,
  dependency: Object.freeze({
    visualizationValidationOnly: true,
    directPreviousPhaseModule: "visualizationValidation.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    otherEvePhases: false,
    externalDependencies: false,
  }),
  execution: false,
  validationEngine: false,
  orchestration: false,
  rendering: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

