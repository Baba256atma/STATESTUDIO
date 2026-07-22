import { AnimationEffectsRegistryPlatform } from "./animationEffectsRegistry.ts";
import type {
  AnimationEffectsModelDescriptor,
  AnimationEffectsModelName,
} from "./animationEffectsModelTypes.ts";

const descriptorSeeds = Object.freeze([
  ["AnimationModel", "Animation", ["sequenceReference", "stateReferences", "targetReferences", "timingReference", "motionReference", "visualEffectReferences", "extensionReferences"]],
  ["AnimationSequenceModel", "Animation Sequence", ["sequenceIdentity", "animationReferences", "orderingIntent"]],
  ["AnimationStateModel", "Animation State", ["stateIdentity", "transitionReferences", "presentationIntent"]],
  ["AnimationTransitionModel", "Animation Transition", ["transitionIdentity", "sourceStateReference", "targetStateReference", "triggerReference"]],
  ["TransitionTriggerModel", "Transition Trigger", ["triggerIdentity", "triggerIntent"]],
  ["AnimationTargetModel", "Animation Target", ["targetIdentity", "targetClassification", "targetReference"]],
  ["TimingDescriptorModel", "Timing Descriptor", ["durationIntent", "delayIntent", "easingReference"]],
  ["EasingDescriptorModel", "Easing Descriptor", ["easingIdentity", "easingIntent"]],
  ["MotionDescriptorModel", "Motion Descriptor", ["motionIdentity", "motionIntent", "pathIntent"]],
  ["VisualEffectModel", "Visual Effect", ["effectIdentity", "highlightReference", "focusReference", "pulseReference", "fadeReference"]],
  ["HighlightEffectModel", "Highlight Effect", ["highlightIdentity", "highlightIntent"]],
  ["FocusEffectModel", "Focus Effect", ["focusIdentity", "focusIntent"]],
  ["PulseEffectModel", "Pulse Effect", ["pulseIdentity", "pulseIntent"]],
  ["FadeEffectModel", "Fade Effect", ["fadeIdentity", "fadeIntent"]],
  ["AnimationProfileModel", "Animation Profile", ["profileIdentity", "policyReferences", "compatibilityMetadata"]],
  ["AnimationPolicyModel", "Animation Policy", ["policyIdentity", "policyIntent", "scopeMetadata"]],
  ["ExtensionDescriptorModel", "Extension Descriptor", ["extensionIdentity", "extensionType", "compatibilityReference"]],
  ["ModelMetadataModel", "Model Metadata", ["modelIdentity", "registryReference", "readinessMetadata", "inventoryReference"]],
] as const satisfies readonly [AnimationEffectsModelName, string,
  readonly string[]][]);

const registry = AnimationEffectsRegistryPlatform;

export const AnimationEffectsModelDescriptors:
readonly AnimationEffectsModelDescriptor[] = Object.freeze(descriptorSeeds.map(
  ([canonicalName, modelKind, structuralMetadata], index) => {
    const registryReference = registry.catalog[index]!;
    return Object.freeze({
      id: `EVE-7:3/Model/${canonicalName}` as const,
      canonicalName,
      modelKind,
      namespace: `nexora.eve.animation-effects.model.${canonicalName.toLowerCase()}` as const,
      registryReference,
      categoryReference: registry.categories[index]!,
      ownershipReference: registryReference.ownershipReference,
      boundaryReference: registryReference.boundaryReference,
      lifecycleApplicability: registryReference.lifecycleApplicability,
      capabilityApplicability: registryReference.capabilityApplicability,
      stability: registryReference.stability,
      version: registryReference.version,
      extensionClassification: registryReference.extensionClassification,
      structuralMetadata: Object.freeze([...structuralMetadata]),
      deterministicOrder: index + 1,
      executableBehavior: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    });
  }),
);
