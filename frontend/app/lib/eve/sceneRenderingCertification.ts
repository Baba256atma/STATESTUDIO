import { SceneRenderingPlatform } from "./sceneRenderingPlatform.ts";
import { SceneRenderingCertificationCompatibility } from "./sceneRenderingCertificationCompatibility.ts";
import { SceneRenderingCertificationCriteria } from "./sceneRenderingCertificationCriteria.ts";
import { SceneRenderingCertificationGates } from "./sceneRenderingCertificationGates.ts";
import { SceneRenderingCertificationInventory } from "./sceneRenderingCertificationInventory.ts";
import {
  SceneRenderingCertificationMetadata,
  SceneRenderingCertificationVerification,
} from "./sceneRenderingCertificationMetadata.ts";

export const SceneRenderingCertificationId = SceneRenderingCertificationMetadata.id;
export {
  SceneRenderingCertificationMetadata,
  SceneRenderingCertificationVerification,
  SceneRenderingCertificationInventory,
};

export const SceneRenderingCertification = Object.freeze({
  metadata: SceneRenderingCertificationMetadata,
  platform: SceneRenderingPlatform,
  criteria: SceneRenderingCertificationCriteria,
  gates: SceneRenderingCertificationGates,
  compatibility: SceneRenderingCertificationCompatibility,
  verification: SceneRenderingCertificationVerification,
  inventory: SceneRenderingCertificationInventory,
  certificationEngine: false,
  automaticCertificationExecution: false,
  validationEngine: false,
  execution: false,
  rendering: false,
  sceneExecution: false,
  frameGeneration: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getSceneRenderingCertificationSummary() {
  return SceneRenderingCertification.metadata;
}

export function getSceneRenderingCertificationCount() {
  return SceneRenderingCertification.inventory.criteriaCount;
}

export function getSceneRenderingCertificationReleaseMetadata() {
  return Object.freeze({
    id: SceneRenderingCertification.metadata.id,
    version: SceneRenderingCertification.metadata.version,
    status: SceneRenderingCertification.metadata.status,
    readiness: SceneRenderingCertification.metadata.readiness,
  });
}
