import { AnimationEffectsManifestCompatibility } from "./animationEffectsManifestCompatibility.ts";
import { AnimationEffectsManifestGuarantees } from "./animationEffectsManifestGuarantees.ts";
import { AnimationEffectsManifestInventory } from "./animationEffectsManifestInventory.ts";
import {
  AnimationEffectsManifestIdentity,
  AnimationEffectsManifestMetadataRecord,
  AnimationEffectsManifestReadinessMetadataRecord,
} from "./animationEffectsManifestMetadata.ts";
import {
  AnimationEffectsManifestComposition,
  AnimationEffectsManifestReadiness,
} from "./animationEffectsManifestReadiness.ts";
import { AnimationEffectsValidationPlatform } from "./animationEffectsValidation.ts";

export const AnimationEffectsManifestIdentityMetadata =
  AnimationEffectsManifestIdentity;
export const AnimationEffectsManifestReadinessMetadata =
  AnimationEffectsManifestReadinessMetadataRecord;
export const AnimationEffectsManifestInventoryMetadata =
  AnimationEffectsManifestInventory;
export const AnimationEffectsManifestMetadata =
  AnimationEffectsManifestMetadataRecord;

export const AnimationEffectsManifestPlatform = Object.freeze({
  metadata: AnimationEffectsManifestMetadata,
  identity: AnimationEffectsManifestIdentityMetadata,
  inventory: AnimationEffectsManifestInventoryMetadata,
  readiness: AnimationEffectsManifestReadinessMetadata,
  validation: AnimationEffectsValidationPlatform,
  composition: AnimationEffectsManifestComposition,
  guarantees: AnimationEffectsManifestGuarantees,
  compatibility: AnimationEffectsManifestCompatibility,
  readinessDeclarations: AnimationEffectsManifestReadiness,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const manifestSummary = Object.freeze({
  identity: AnimationEffectsManifestIdentityMetadata,
  status: AnimationEffectsManifestIdentityMetadata.status,
  readiness: AnimationEffectsManifestReadinessMetadata,
  inventory: AnimationEffectsManifestInventoryMetadata,
  validationReference: AnimationEffectsValidationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getAnimationEffectsManifestSummary = () => manifestSummary;
export const getAnimationEffectsManifestCount = () =>
  AnimationEffectsManifestComposition.length;
export const getAnimationEffectsManifestReleaseMetadata = () => Object.freeze({
  ...AnimationEffectsManifestIdentityMetadata,
  readiness: AnimationEffectsManifestReadinessMetadata.status,
  validationReference: AnimationEffectsValidationPlatform.metadata.id,
});
