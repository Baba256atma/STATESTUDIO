import { AnimationEffectsBoundaries } from "./animationEffectsBoundaries.ts";
import { AnimationEffectsCapabilities } from "./animationEffectsCapabilities.ts";
import type {
  AnimationEffectsContractDeclaration,
  AnimationEffectsContractName,
} from "./animationEffectsFoundationTypes.ts";
import { AnimationEffectsLifecycle } from "./animationEffectsLifecycle.ts";
import { AnimationEffectsOwnership } from "./animationEffectsOwnership.ts";

const contractSeeds = Object.freeze([
  ["AnimationIdentity", ["stableId", "canonicalName", "ownerReference"]],
  ["AnimationReference", ["animationIdentityReference", "targetReference"]],
  ["AnimationSequence", ["sequenceIdentity", "stateReferences", "orderingIntent"]],
  ["AnimationState", ["stateIdentity", "animationReference", "visualIntent"]],
  ["AnimationTransition", ["sourceState", "targetState", "descriptorReference"]],
  ["TransitionDescriptor", ["transitionIdentity", "timingReference", "easingReference"]],
  ["EffectDescriptor", ["effectIdentity", "effectLayerReference", "targetReference"]],
  ["EffectLayer", ["layerIdentity", "orderingIntent", "compositionIntent"]],
  ["AnimationTarget", ["targetIdentity", "sceneReference", "visualPropertyIntent"]],
  ["AnimationTrigger", ["triggerIdentity", "triggerIntent", "animationReference"]],
  ["AnimationProfile", ["profileIdentity", "sequenceReferences", "policyReference"]],
  ["AnimationPolicy", ["policyIdentity", "constraintIntent", "compatibilityReference"]],
  ["TimingDescriptor", ["timingIdentity", "durationIntent", "delayIntent"]],
  ["EasingDescriptor", ["easingIdentity", "curveIntent", "compatibilityReference"]],
  ["VisualEffectDescriptor", ["visualEffectIdentity", "effectReference", "layerReference"]],
  ["HighlightDescriptor", ["highlightIdentity", "targetReference", "emphasisIntent"]],
  ["FocusDescriptor", ["focusIdentity", "targetReference", "focusIntent"]],
  ["PulseDescriptor", ["pulseIdentity", "targetReference", "pulseIntent"]],
  ["FadeDescriptor", ["fadeIdentity", "targetReference", "opacityIntent"]],
  ["MotionDescriptor", ["motionIdentity", "targetReference", "movementIntent"]],
  ["ExtensionPoint", ["extensionIdentity", "extensionIntent", "compatibilityReference"]],
  ["FoundationMetadata", ["foundationIdentity", "inventoryReference", "readinessReference"]],
] as const satisfies readonly [AnimationEffectsContractName, readonly string[]][]);

export const AnimationEffectsContracts:
readonly AnimationEffectsContractDeclaration[] = Object.freeze(contractSeeds.map(
  ([name, structuralMetadata], index) => Object.freeze({
    id: `EVE-7:1/Contract/${name}` as const,
    canonicalName: name.replace(/([a-z])([A-Z])/g, "$1 $2"),
    namespace:
      `nexora.eve.animation-effects.foundation.contract.${name.toLowerCase()}` as const,
    version: "1.0.0" as const,
    ownership: AnimationEffectsOwnership,
    lifecycle: AnimationEffectsLifecycle,
    capabilityReferences: AnimationEffectsCapabilities,
    boundaryReferences: AnimationEffectsBoundaries,
    structuralMetadata: Object.freeze([...structuralMetadata]),
    compatibilityMetadata: Object.freeze({
      sceneRenderingCompatible: true as const,
    }),
    extensionMetadata: Object.freeze({ classification: `${name}Extension` }),
    deterministicOrder: index + 1,
    executableBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
