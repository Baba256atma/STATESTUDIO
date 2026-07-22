import {
  AnimationEffectsRegistryCatalog,
  AnimationEffectsRegistryCategories,
} from "./animationEffectsRegistryCatalog.ts";
import { AnimationEffectsRegistryExtensions } from "./animationEffectsRegistryExtensions.ts";
import { AnimationEffectsFoundationPlatform } from "./animationEffectsFoundation.ts";
import { AnimationEffectsRegistryInventory } from "./animationEffectsRegistryInventory.ts";
import {
  AnimationEffectsRegistryIdentity,
  AnimationEffectsRegistryMetadataRecord,
  AnimationEffectsRegistryReadiness,
} from "./animationEffectsRegistryMetadata.ts";
import { AnimationEffectsRegistryPolicies } from "./animationEffectsRegistryPolicies.ts";

export const AnimationEffectsRegistryIdentityMetadata =
  AnimationEffectsRegistryIdentity;

export const AnimationEffectsRegistryReadinessMetadata =
  AnimationEffectsRegistryReadiness;

export const AnimationEffectsRegistryInventoryMetadata =
  AnimationEffectsRegistryInventory;

export const AnimationEffectsRegistryMetadata =
  AnimationEffectsRegistryMetadataRecord;

export const AnimationEffectsRegistryPlatform = Object.freeze({
  metadata: AnimationEffectsRegistryMetadata,
  identity: AnimationEffectsRegistryIdentityMetadata,
  inventory: AnimationEffectsRegistryInventoryMetadata,
  readiness: AnimationEffectsRegistryReadinessMetadata,
  foundation: AnimationEffectsFoundationPlatform,
  catalog: AnimationEffectsRegistryCatalog,
  categories: AnimationEffectsRegistryCategories,
  extensions: AnimationEffectsRegistryExtensions,
  policies: AnimationEffectsRegistryPolicies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const summary = Object.freeze({
  identity: AnimationEffectsRegistryIdentityMetadata,
  status: AnimationEffectsRegistryIdentityMetadata.status,
  readiness: AnimationEffectsRegistryReadinessMetadata,
  inventory: AnimationEffectsRegistryInventoryMetadata,
  foundationReference: AnimationEffectsFoundationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getAnimationEffectsRegistrySummary = () => summary;

export const getAnimationEffectsRegistryCount = () =>
  AnimationEffectsRegistryCatalog.length;

export const getAnimationEffectsRegistryReleaseMetadata = () => Object.freeze({
  ...AnimationEffectsRegistryIdentityMetadata,
  readiness: AnimationEffectsRegistryReadinessMetadata.status,
  foundationReference: AnimationEffectsFoundationPlatform.metadata.id,
});
