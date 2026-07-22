import { AnimationEffectsModelDescriptors } from "./animationEffectsModelDescriptors.ts";
import { AnimationEffectsModelInventory } from "./animationEffectsModelInventory.ts";
import {
  AnimationEffectsModelIdentity,
  AnimationEffectsModelMetadataRecord,
  AnimationEffectsModelReadiness,
} from "./animationEffectsModelMetadata.ts";
import { AnimationEffectsModelPolicies } from "./animationEffectsModelPolicies.ts";
import { AnimationEffectsModelRelationships } from "./animationEffectsModelRelationships.ts";
import { AnimationEffectsRegistryPlatform } from "./animationEffectsRegistry.ts";

export const AnimationEffectsModelIdentityMetadata = AnimationEffectsModelIdentity;
export const AnimationEffectsModelReadinessMetadata = AnimationEffectsModelReadiness;
export const AnimationEffectsModelInventoryMetadata = AnimationEffectsModelInventory;
export const AnimationEffectsModelMetadata = AnimationEffectsModelMetadataRecord;

export const AnimationEffectsModelPlatform = Object.freeze({
  metadata: AnimationEffectsModelMetadata,
  identity: AnimationEffectsModelIdentityMetadata,
  inventory: AnimationEffectsModelInventoryMetadata,
  readiness: AnimationEffectsModelReadinessMetadata,
  registry: AnimationEffectsRegistryPlatform,
  descriptors: AnimationEffectsModelDescriptors,
  relationships: AnimationEffectsModelRelationships,
  policies: AnimationEffectsModelPolicies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const modelSummary = Object.freeze({
  identity: AnimationEffectsModelIdentityMetadata,
  status: AnimationEffectsModelIdentityMetadata.status,
  readiness: AnimationEffectsModelReadinessMetadata,
  inventory: AnimationEffectsModelInventoryMetadata,
  registryReference: AnimationEffectsRegistryPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getAnimationEffectsModelSummary = () => modelSummary;
export const getAnimationEffectsModelCount = () =>
  AnimationEffectsModelDescriptors.length;
export const getAnimationEffectsModelReleaseMetadata = () => Object.freeze({
  ...AnimationEffectsModelIdentityMetadata,
  readiness: AnimationEffectsModelReadinessMetadata.status,
  registryReference: AnimationEffectsRegistryPlatform.metadata.id,
});
