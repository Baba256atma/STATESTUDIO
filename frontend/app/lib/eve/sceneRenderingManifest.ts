import { SceneRenderingValidation } from "./sceneRenderingValidation.ts";
import { SceneRenderingManifestCompatibility } from "./sceneRenderingManifestCompatibility.ts";
import { SceneRenderingManifestGuarantees } from "./sceneRenderingManifestGuarantees.ts";
import { SceneRenderingManifestInventory } from "./sceneRenderingManifestInventory.ts";
import { SceneRenderingManifestMetadata } from "./sceneRenderingManifestMetadata.ts";
import { SceneRenderingManifestReadiness } from "./sceneRenderingManifestReadiness.ts";

export const SceneRenderingManifestId = SceneRenderingManifestMetadata.id;
export { SceneRenderingManifestMetadata, SceneRenderingManifestInventory, SceneRenderingManifestReadiness };

export const SceneRenderingManifest = Object.freeze({
  metadata: SceneRenderingManifestMetadata,
  validation: SceneRenderingValidation,
  inventory: SceneRenderingManifestInventory,
  guarantees: SceneRenderingManifestGuarantees,
  readiness: SceneRenderingManifestReadiness,
  compatibility: SceneRenderingManifestCompatibility,
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

export function getSceneRenderingManifestSummary() {
  return SceneRenderingManifest.metadata;
}

export function getSceneRenderingManifestInventoryCount() {
  return SceneRenderingManifest.inventory.validationInventory.ruleCount;
}

export function getSceneRenderingManifestReleaseMetadata() {
  return SceneRenderingManifest.metadata.release;
}
