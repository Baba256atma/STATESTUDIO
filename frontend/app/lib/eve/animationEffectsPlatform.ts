import { AnimationEffectsManifestPlatform } from "./animationEffectsManifest.ts";
import { AnimationEffectsPlatformCapabilities } from "./animationEffectsPlatformCapabilities.ts";
import { AnimationEffectsPlatformCompatibility } from "./animationEffectsPlatformCompatibility.ts";
import { AnimationEffectsPlatformGuarantees } from "./animationEffectsPlatformGuarantees.ts";
import {
  AnimationEffectsPlatformComposition,
  AnimationEffectsPlatformInventory,
} from "./animationEffectsPlatformInventory.ts";
import {
  AnimationEffectsPlatformIdentity,
  AnimationEffectsPlatformMetadataRecord,
  AnimationEffectsPlatformReadiness,
} from "./animationEffectsPlatformMetadata.ts";

export const AnimationEffectsPlatformIdentityMetadata =
  AnimationEffectsPlatformIdentity;
export const AnimationEffectsPlatformReadinessMetadata =
  AnimationEffectsPlatformReadiness;
export const AnimationEffectsPlatformInventoryMetadata =
  AnimationEffectsPlatformInventory;
export const AnimationEffectsPlatformMetadata =
  AnimationEffectsPlatformMetadataRecord;

export const AnimationEffectsPlatform = Object.freeze({
  metadata: AnimationEffectsPlatformMetadata,
  identity: AnimationEffectsPlatformIdentityMetadata,
  inventory: AnimationEffectsPlatformInventoryMetadata,
  readiness: AnimationEffectsPlatformReadinessMetadata,
  manifest: AnimationEffectsManifestPlatform,
  composition: AnimationEffectsPlatformComposition,
  capabilities: AnimationEffectsPlatformCapabilities,
  guarantees: AnimationEffectsPlatformGuarantees,
  compatibility: AnimationEffectsPlatformCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const platformSummary = Object.freeze({
  identity: AnimationEffectsPlatformIdentityMetadata,
  status: AnimationEffectsPlatformIdentityMetadata.status,
  readiness: AnimationEffectsPlatformReadinessMetadata,
  inventory: AnimationEffectsPlatformInventoryMetadata,
  manifestReference: AnimationEffectsManifestPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getAnimationEffectsPlatformSummary = () => platformSummary;
export const getAnimationEffectsPlatformCount = () =>
  AnimationEffectsPlatformComposition.length;
export const getAnimationEffectsPlatformReleaseMetadata = () => Object.freeze({
  ...AnimationEffectsPlatformIdentityMetadata,
  readiness: AnimationEffectsPlatformReadinessMetadata.status,
  manifestReference: AnimationEffectsManifestPlatform.metadata.id,
});
