import { AnimationEffectsModelInventory } from "./animationEffectsModelInventory.ts";
import { AnimationEffectsRegistryPlatform } from "./animationEffectsRegistry.ts";

const registry = AnimationEffectsRegistryPlatform;

export const AnimationEffectsModelIdentity = Object.freeze({
  id: "EVE-7:3/AnimationEffectsModel",
  name: "Animation & Effects Model",
  version: "1.0.0",
  namespace: "nexora.eve.animation-effects.model",
  layer: "EVE",
  phase: "EVE-7:3",
  status: "ReadyForValidation",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const AnimationEffectsModelReadiness = Object.freeze({
  status: "ReadyForValidation",
  registryStatus: registry.metadata.status,
  registryReference: registry.metadata.id,
  foundationReference: registry.foundation.metadata.id,
  upstreamPublicIndexReference:
    registry.foundation.upstreamPublicIndex.metadata.identity.id,
  upstreamLockReference: registry.foundation.upstreamPublicIndex.metadata.lockId,
  metadataOnly: true,
  immutable: true,
} as const);

export const AnimationEffectsModelMetadataRecord = Object.freeze({
  ...AnimationEffectsModelIdentity,
  registryReference: registry.metadata.id,
  registry,
  inventory: AnimationEffectsModelInventory,
  readiness: AnimationEffectsModelReadiness,
  ownership: Object.freeze({
    owns: Object.freeze(["Typed animation models", "Relationship descriptors",
      "Model identities", "Model metadata", "Model inventories"]),
    doesNotOwn: Object.freeze(["Animation execution", "Animation scheduler",
      "Transition execution", "Rendering", "Physics simulation",
      "Timeline playback", "UI implementation", "Director orchestration",
      "Executive reasoning", "Business Objects", "Networking", "Persistence"]),
  }),
  dependency: Object.freeze({
    animationEffectsRegistryOnly: true,
    directModule: "animationEffectsRegistry.ts",
    directFoundationImports: false,
    directSceneRenderingImports: false,
    directEveOneImports: false,
    directorImports: false,
    advisorImports: false,
    executiveEngineImports: false,
    dklImports: false,
  }),
  animationEngine: false,
  animationScheduler: false,
  transitionExecution: false,
  timingExecution: false,
  easingCalculation: false,
  rendering: false,
  frameGeneration: false,
  gpuExecution: false,
  physicsSimulation: false,
  timelinePlayback: false,
  ui: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  deterministic: true,
} as const);
