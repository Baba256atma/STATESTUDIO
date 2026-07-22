export type AnimationEffectsContractName =
  | "AnimationIdentity" | "AnimationReference" | "AnimationSequence"
  | "AnimationState" | "AnimationTransition" | "TransitionDescriptor"
  | "EffectDescriptor" | "EffectLayer" | "AnimationTarget"
  | "AnimationTrigger" | "AnimationProfile" | "AnimationPolicy"
  | "TimingDescriptor" | "EasingDescriptor" | "VisualEffectDescriptor"
  | "HighlightDescriptor" | "FocusDescriptor" | "PulseDescriptor"
  | "FadeDescriptor" | "MotionDescriptor" | "ExtensionPoint"
  | "FoundationMetadata";

export type AnimationEffectsLifecycleState =
  | "Declared" | "Registered" | "Modeled" | "Certified" | "Frozen";

export interface AnimationEffectsContractDeclaration {
  readonly id: `EVE-7:1/Contract/${AnimationEffectsContractName}`;
  readonly canonicalName: string;
  readonly namespace: `nexora.eve.animation-effects.foundation.contract.${string}`;
  readonly version: "1.0.0";
  readonly ownership: unknown;
  readonly lifecycle: unknown;
  readonly capabilityReferences: readonly unknown[];
  readonly boundaryReferences: readonly unknown[];
  readonly structuralMetadata: readonly string[];
  readonly compatibilityMetadata: Readonly<{ sceneRenderingCompatible: true }>;
  readonly extensionMetadata: Readonly<{ classification: string }>;
  readonly deterministicOrder: number;
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
