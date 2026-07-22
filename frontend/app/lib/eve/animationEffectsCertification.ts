import { AnimationEffectsCertificationCompatibility } from "./animationEffectsCertificationCompatibility.ts";
import { AnimationEffectsCertificationCriteria } from "./animationEffectsCertificationCriteria.ts";
import { AnimationEffectsCertificationGates } from "./animationEffectsCertificationGates.ts";
import { AnimationEffectsCertificationInventory } from "./animationEffectsCertificationInventory.ts";
import {
  AnimationEffectsCertificationIdentity,
  AnimationEffectsCertificationMetadataRecord,
  AnimationEffectsCertificationReadiness,
} from "./animationEffectsCertificationMetadata.ts";
import { AnimationEffectsPlatform } from "./animationEffectsPlatform.ts";

export const AnimationEffectsCertificationIdentityMetadata =
  AnimationEffectsCertificationIdentity;
export const AnimationEffectsCertificationReadinessMetadata =
  AnimationEffectsCertificationReadiness;
export const AnimationEffectsCertificationInventoryMetadata =
  AnimationEffectsCertificationInventory;
export const AnimationEffectsCertificationMetadata =
  AnimationEffectsCertificationMetadataRecord;

export const AnimationEffectsCertificationPlatform = Object.freeze({
  metadata: AnimationEffectsCertificationMetadata,
  identity: AnimationEffectsCertificationIdentityMetadata,
  inventory: AnimationEffectsCertificationInventoryMetadata,
  readiness: AnimationEffectsCertificationReadinessMetadata,
  platform: AnimationEffectsPlatform,
  criteria: AnimationEffectsCertificationCriteria,
  gates: AnimationEffectsCertificationGates,
  compatibility: AnimationEffectsCertificationCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const certificationSummary = Object.freeze({
  identity: AnimationEffectsCertificationIdentityMetadata,
  status: AnimationEffectsCertificationIdentityMetadata.status,
  readiness: AnimationEffectsCertificationReadinessMetadata,
  inventory: AnimationEffectsCertificationInventoryMetadata,
  platformReference: AnimationEffectsPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getAnimationEffectsCertificationSummary = () =>
  certificationSummary;
export const getAnimationEffectsCertificationCount = () =>
  AnimationEffectsCertificationCriteria.length;
export const getAnimationEffectsCertificationReleaseMetadata = () =>
  Object.freeze({
    ...AnimationEffectsCertificationIdentityMetadata,
    readiness: AnimationEffectsCertificationReadinessMetadata.readiness,
    platformReference: AnimationEffectsPlatform.metadata.id,
  });
