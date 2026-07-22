import { AnimationEffectsFoundationPlatform } from "./animationEffectsFoundation.ts";
import { AnimationEffectsRegistryInventory } from "./animationEffectsRegistryInventory.ts";

export const AnimationEffectsRegistryIdentity = Object.freeze({
  id: "EVE-7:2/AnimationEffectsRegistry",
  name: "Animation & Effects Registry",
  version: "1.0.0",
  namespace: "nexora.eve.animation-effects.registry",
  layer: "EVE",
  phase: "EVE-7:2",
  status: "ReadyForModel",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const AnimationEffectsRegistryReadiness = Object.freeze({
  status: "ReadyForModel",
  foundationStatus: AnimationEffectsFoundationPlatform.metadata.status,
  foundationReference: AnimationEffectsFoundationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const AnimationEffectsRegistryMetadataRecord = Object.freeze({
  ...AnimationEffectsRegistryIdentity,
  foundationReference: AnimationEffectsFoundationPlatform.metadata.id,
  foundation: AnimationEffectsFoundationPlatform,
  inventory: AnimationEffectsRegistryInventory,
  readiness: AnimationEffectsRegistryReadiness,
  ownership: Object.freeze({
    owns: Object.freeze([
      "Animation vocabularies", "Registry identities", "Registry categories",
      "Registry classifications", "Registry inventories", "Registry policies",
      "Extension classifications",
    ]),
    doesNotOwn: Object.freeze([
      "Animation execution", "Rendering", "Timing execution",
      "Physics simulation", "Scene execution", "GPU processing", "Playback",
      "UI implementation", "Director orchestration", "Executive reasoning",
      "Business Objects", "Networking", "Persistence",
    ]),
  }),
  dependency: Object.freeze({
    animationEffectsFoundationOnly: true,
    directModule: "animationEffectsFoundation.ts",
    directSceneRenderingImports: false,
    directEveOneImports: false,
    directorImports: false,
  }),
  animationEngine: false,
  animationScheduler: false,
  transitionExecution: false,
  timingExecution: false,
  easingCalculation: false,
  rendering: false,
  frameGeneration: false,
  gpuExecution: false,
  physicsEngine: false,
  timelinePlayback: false,
  ui: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  deterministic: true,
} as const);
