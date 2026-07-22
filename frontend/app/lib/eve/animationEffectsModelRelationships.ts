import { AnimationEffectsRegistryPlatform } from "./animationEffectsRegistry.ts";
import type {
  AnimationEffectsModelName,
  AnimationEffectsModelRelationship,
} from "./animationEffectsModelTypes.ts";

const relationshipSeeds = Object.freeze([
  ["AnimationModel", "AnimationSequenceModel", "sequenceReference"],
  ["AnimationModel", "AnimationStateModel", "stateReferences"],
  ["AnimationStateModel", "AnimationTransitionModel", "transitionReferences"],
  ["AnimationTransitionModel", "TransitionTriggerModel", "triggerReference"],
  ["AnimationModel", "AnimationTargetModel", "targetReferences"],
  ["AnimationModel", "TimingDescriptorModel", "timingReference"],
  ["TimingDescriptorModel", "EasingDescriptorModel", "easingReference"],
  ["AnimationModel", "MotionDescriptorModel", "motionReference"],
  ["AnimationModel", "VisualEffectModel", "visualEffectReferences"],
  ["VisualEffectModel", "HighlightEffectModel", "highlightReference"],
  ["VisualEffectModel", "FocusEffectModel", "focusReference"],
  ["VisualEffectModel", "PulseEffectModel", "pulseReference"],
  ["VisualEffectModel", "FadeEffectModel", "fadeReference"],
  ["AnimationProfileModel", "AnimationPolicyModel", "policyReferences"],
  ["AnimationModel", "ExtensionDescriptorModel", "extensionReferences"],
] as const satisfies readonly [AnimationEffectsModelName,
  AnimationEffectsModelName, string][]);

export const AnimationEffectsModelRelationships:
readonly AnimationEffectsModelRelationship[] = Object.freeze(
  relationshipSeeds.map(([sourceModel, targetModel, referenceField], index) =>
    Object.freeze({
      id: `EVE-7:3/Relationship/${sourceModel}-${targetModel}` as const,
      sourceModel,
      targetModel,
      referenceField,
      registryReference: AnimationEffectsRegistryPlatform.metadata.id,
      deterministicOrder: index + 1,
      traversalProvided: false as const,
      resolutionProvided: false as const,
      executionProvided: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    })),
);
