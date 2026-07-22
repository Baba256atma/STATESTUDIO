import type * as Registry from "./animationEffectsRegistry.ts";

export type AnimationEffectsModelName =
  | "AnimationModel" | "AnimationSequenceModel" | "AnimationStateModel"
  | "AnimationTransitionModel" | "TransitionTriggerModel"
  | "AnimationTargetModel" | "TimingDescriptorModel"
  | "EasingDescriptorModel" | "MotionDescriptorModel"
  | "VisualEffectModel" | "HighlightEffectModel" | "FocusEffectModel"
  | "PulseEffectModel" | "FadeEffectModel" | "AnimationProfileModel"
  | "AnimationPolicyModel" | "ExtensionDescriptorModel"
  | "ModelMetadataModel";

type RegistryEntry =
  typeof Registry.AnimationEffectsRegistryPlatform.catalog[number];
type RegistryCategory =
  typeof Registry.AnimationEffectsRegistryPlatform.categories[number];

export interface AnimationEffectsModelDescriptor {
  readonly id: `EVE-7:3/Model/${AnimationEffectsModelName}`;
  readonly canonicalName: AnimationEffectsModelName;
  readonly modelKind: string;
  readonly namespace: `nexora.eve.animation-effects.model.${string}`;
  readonly registryReference: RegistryEntry;
  readonly categoryReference: RegistryCategory;
  readonly ownershipReference: unknown;
  readonly boundaryReference: readonly unknown[];
  readonly lifecycleApplicability: readonly unknown[];
  readonly capabilityApplicability: readonly unknown[];
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly extensionClassification: string;
  readonly structuralMetadata: readonly string[];
  readonly deterministicOrder: number;
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsModelRelationship {
  readonly id: `EVE-7:3/Relationship/${string}`;
  readonly sourceModel: AnimationEffectsModelName;
  readonly targetModel: AnimationEffectsModelName;
  readonly referenceField: string;
  readonly registryReference: "EVE-7:2/AnimationEffectsRegistry";
  readonly deterministicOrder: number;
  readonly traversalProvided: false;
  readonly resolutionProvided: false;
  readonly executionProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
