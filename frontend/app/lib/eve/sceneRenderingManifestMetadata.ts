import { SceneRenderingValidation } from "./sceneRenderingValidation.ts";
import { SceneRenderingManifestCompatibility } from "./sceneRenderingManifestCompatibility.ts";
import { SceneRenderingManifestGuarantees } from "./sceneRenderingManifestGuarantees.ts";
import { SceneRenderingManifestInventory } from "./sceneRenderingManifestInventory.ts";
import { SceneRenderingManifestReadiness } from "./sceneRenderingManifestReadiness.ts";

const model = SceneRenderingValidation.model;
const registry = model.registry;
const foundation = registry.foundation;

export const SceneRenderingManifestMetadata = Object.freeze({
  id: "EVE-2:5/SceneRenderingManifest",
  name: "Scene Rendering Manifest",
  version: "1.0.0",
  namespace: "nexora.eve.scene-rendering.manifest",
  layer: "EVE",
  phase: "EVE-2:5",
  status: "ReadyForPlatform",
  readiness: "ReadyForPlatform",
  validationReference: SceneRenderingValidation.metadata.id,
  phaseComposition: Object.freeze([
    Object.freeze({ phase: "Foundation", canonicalReference: foundation.identity.id, deterministicOrder: 1 }),
    Object.freeze({ phase: "Registry", canonicalReference: registry.metadata.id, deterministicOrder: 2 }),
    Object.freeze({ phase: "Model", canonicalReference: model.metadata.id, deterministicOrder: 3 }),
    Object.freeze({ phase: "Validation", canonicalReference: SceneRenderingValidation.metadata.id, deterministicOrder: 4 }),
    Object.freeze({ phase: "Manifest", canonicalReference: "EVE-2:5/SceneRenderingManifest", deterministicOrder: 5 }),
  ]),
  inventory: SceneRenderingManifestInventory,
  validationSummary: SceneRenderingValidation.metadata,
  guarantees: SceneRenderingManifestGuarantees,
  readinessDeclaration: SceneRenderingManifestReadiness,
  compatibility: SceneRenderingManifestCompatibility,
  release: Object.freeze({ version: "1.0.0", status: "ReadyForPlatform" }),
  ownership: Object.freeze({
    owns: Object.freeze([
      "Manifest metadata", "Manifest guarantees", "Manifest inventories",
      "Readiness declarations", "Compatibility metadata", "Dependency metadata",
      "Release metadata",
    ] as const),
    renderingExecution: false,
    validationExecution: false,
    sceneExecution: false,
  }),
  dependency: Object.freeze({
    sceneRenderingValidationOnly: true,
    directPreviousPhaseModule: "sceneRenderingValidation.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directEveOneImport: false,
    externalDependencies: false,
  }),
  execution: false,
  validationEngine: false,
  rendering: false,
  sceneExecution: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
