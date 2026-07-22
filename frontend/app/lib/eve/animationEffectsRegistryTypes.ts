import type * as Foundation from "./animationEffectsFoundation.ts";

export type AnimationEffectsRegistryKey =
  | "AnimationTypes" | "AnimationSequenceTypes" | "AnimationStateTypes"
  | "TransitionTypes" | "TransitionTriggerTypes" | "AnimationTargetTypes"
  | "TimingTypes" | "EasingTypes" | "MotionTypes" | "VisualEffectTypes"
  | "HighlightTypes" | "FocusTypes" | "PulseTypes" | "FadeTypes"
  | "AnimationProfileTypes" | "AnimationPolicyTypes" | "ExtensionPointTypes"
  | "RegistryCategories";

type FoundationContract =
  typeof Foundation.AnimationEffectsFoundationPlatform.contracts[number];

export interface AnimationEffectsRegistryEntry {
  readonly id: `EVE-7:2/Registry/${AnimationEffectsRegistryKey}`;
  readonly key: AnimationEffectsRegistryKey;
  readonly canonicalKey: string;
  readonly displayName: string;
  readonly description: string;
  readonly registryCategory: string;
  readonly foundationContractReference: FoundationContract;
  readonly ownershipReference: unknown;
  readonly boundaryReference: readonly unknown[];
  readonly lifecycleApplicability: readonly unknown[];
  readonly capabilityApplicability: readonly unknown[];
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly extensionClassification: string;
  readonly deprecated: false;
  readonly deterministicOrder: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsRegistryCategory {
  readonly id: `EVE-7:2/Category/${string}`;
  readonly canonicalName: string;
  readonly description: string;
  readonly foundationReference: FoundationContract;
  readonly entries: readonly AnimationEffectsRegistryEntry[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
