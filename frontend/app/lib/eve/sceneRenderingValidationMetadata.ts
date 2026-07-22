import { SceneRenderingModel } from "./sceneRenderingModel.ts";
import { SceneRenderingValidationInventory } from "./sceneRenderingValidationInventory.ts";

export const SceneRenderingValidationMetadata = Object.freeze({
  id: "EVE-2:4/SceneRenderingValidation",
  name: "Scene Rendering Validation",
  version: "1.0.0",
  namespace: "nexora.eve.scene-rendering.validation",
  layer: "EVE",
  phase: "EVE-2:4",
  status: "ReadyForManifest",
  readiness: "ReadyForManifest",
  modelReference: SceneRenderingModel.metadata.id,
  inventory: SceneRenderingValidationInventory,
  ownership: Object.freeze({
    owns: Object.freeze([
      "Validation metadata", "Validation rules", "Validation gates", "Diagnostics",
      "Validation policies", "Validation inventories", "Readiness metadata",
    ] as const),
    renderingExecution: false,
    runtimeValidation: false,
    sceneExecution: false,
  }),
  dependency: Object.freeze({
    sceneRenderingModelOnly: true,
    directPreviousPhaseModule: "sceneRenderingModel.ts",
    directRegistryImport: false,
    directFoundationImport: false,
    directEveOneImport: false,
    externalDependencies: false,
  }),
  validationEngine: false,
  automaticRuleExecution: false,
  runtimeDiagnostics: false,
  rendering: false,
  sceneExecution: false,
  gpuProcessing: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
