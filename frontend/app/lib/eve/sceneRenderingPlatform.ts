import { SceneRenderingManifest } from "./sceneRenderingManifest.ts";
import { SceneRenderingPlatformCapabilities } from "./sceneRenderingPlatformCapabilities.ts";
import { SceneRenderingPlatformCompatibility } from "./sceneRenderingPlatformCompatibility.ts";
import { SceneRenderingPlatformGuarantees } from "./sceneRenderingPlatformGuarantees.ts";
import { SceneRenderingPlatformInventory } from "./sceneRenderingPlatformInventory.ts";
import { SceneRenderingPlatformMetadata } from "./sceneRenderingPlatformMetadata.ts";

export const SceneRenderingPlatformId = SceneRenderingPlatformMetadata.id;
export { SceneRenderingPlatformMetadata, SceneRenderingPlatformInventory };

export const SceneRenderingPlatform = Object.freeze({
  metadata: SceneRenderingPlatformMetadata,
  manifest: SceneRenderingManifest,
  capabilities: SceneRenderingPlatformCapabilities,
  guarantees: SceneRenderingPlatformGuarantees,
  compatibility: SceneRenderingPlatformCompatibility,
  inventory: SceneRenderingPlatformInventory,
  execution: false,
  rendering: false,
  sceneExecution: false,
  frameGeneration: false,
  runtimeValidation: false,
  runtimeCertification: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getSceneRenderingPlatformSummary() {
  return SceneRenderingPlatform.metadata;
}

export function getSceneRenderingPlatformInventoryCount() {
  return SceneRenderingPlatform.inventory.counts.capabilityCount;
}

export function getSceneRenderingPlatformReadiness() {
  return SceneRenderingPlatform.metadata.readinessDeclaration;
}

export function getSceneRenderingPlatformReleaseMetadata() {
  return Object.freeze({
    id: SceneRenderingPlatform.metadata.id,
    version: SceneRenderingPlatform.metadata.version,
    status: SceneRenderingPlatform.metadata.status,
  });
}
