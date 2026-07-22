import { SceneRenderingManifest } from "./sceneRenderingManifest.ts";
import { SceneRenderingPlatformCapabilities } from "./sceneRenderingPlatformCapabilities.ts";
import { SceneRenderingPlatformCompatibility } from "./sceneRenderingPlatformCompatibility.ts";
import { SceneRenderingPlatformGuarantees } from "./sceneRenderingPlatformGuarantees.ts";
import { SceneRenderingPlatformInventory } from "./sceneRenderingPlatformInventory.ts";

export const SceneRenderingPlatformMetadata = Object.freeze({
  id: "EVE-2:6/SceneRenderingPlatform",
  name: "Scene Rendering Platform",
  version: "1.0.0",
  namespace: "nexora.eve.scene-rendering.platform",
  layer: "EVE",
  phase: "EVE-2:6",
  status: "ReadyForCertification",
  readiness: "ReadyForCertification",
  manifestReference: SceneRenderingManifest.metadata.id,
  composition: Object.freeze([
    ...SceneRenderingManifest.metadata.phaseComposition,
    Object.freeze({
      phase: "Platform",
      canonicalReference: "EVE-2:6/SceneRenderingPlatform",
      deterministicOrder: SceneRenderingManifest.metadata.phaseComposition.length + 1,
    }),
  ]),
  inventory: SceneRenderingPlatformInventory,
  capabilities: SceneRenderingPlatformCapabilities,
  guarantees: SceneRenderingPlatformGuarantees,
  compatibility: SceneRenderingPlatformCompatibility,
  readinessDeclaration: Object.freeze({
    status: "ReadyForCertification",
    manifestReady: SceneRenderingManifest.metadata.readiness === "ReadyForPlatform",
    certificationInputPublished: true,
    metadataOnly: true,
    immutable: true,
  }),
  ownership: Object.freeze({
    owns: Object.freeze([
      "Platform composition", "Platform capabilities", "Platform guarantees",
      "Platform compatibility", "Platform inventories", "Platform readiness",
      "Public architectural metadata",
    ] as const),
    renderingExecution: false,
    sceneExecution: false,
    frameGeneration: false,
  }),
  dependency: Object.freeze({
    sceneRenderingManifestOnly: true,
    directPreviousPhaseModule: "sceneRenderingManifest.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    directEveOneImport: false,
    externalDependencies: false,
  }),
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
