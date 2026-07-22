import { AnimationEffectsFoundationPlatform } from "./animationEffectsFoundation.ts";
import type {
  AnimationEffectsRegistryCategory,
  AnimationEffectsRegistryEntry,
  AnimationEffectsRegistryKey,
} from "./animationEffectsRegistryTypes.ts";

const catalogSeeds = Object.freeze([
  ["AnimationTypes", "Animation Types"],
  ["AnimationSequenceTypes", "Animation Sequence Types"],
  ["AnimationStateTypes", "Animation State Types"],
  ["TransitionTypes", "Transition Types"],
  ["TransitionTriggerTypes", "Transition Trigger Types"],
  ["AnimationTargetTypes", "Animation Target Types"],
  ["TimingTypes", "Timing Types"], ["EasingTypes", "Easing Types"],
  ["MotionTypes", "Motion Types"], ["VisualEffectTypes", "Visual Effect Types"],
  ["HighlightTypes", "Highlight Types"], ["FocusTypes", "Focus Types"],
  ["PulseTypes", "Pulse Types"], ["FadeTypes", "Fade Types"],
  ["AnimationProfileTypes", "Animation Profile Types"],
  ["AnimationPolicyTypes", "Animation Policy Types"],
  ["ExtensionPointTypes", "Extension Point Types"],
  ["RegistryCategories", "Registry Categories"],
] as const satisfies readonly [AnimationEffectsRegistryKey, string][]);

const foundation = AnimationEffectsFoundationPlatform;

export const AnimationEffectsRegistryCatalog:
readonly AnimationEffectsRegistryEntry[] = Object.freeze(catalogSeeds.map(
  ([key, displayName], index) => Object.freeze({
    id: `EVE-7:2/Registry/${key}` as const,
    key,
    canonicalKey: key,
    displayName,
    description: `Canonical metadata registry for ${displayName.toLowerCase()}.`,
    registryCategory: displayName,
    foundationContractReference: foundation.contracts[index]!,
    ownershipReference: foundation.ownership,
    boundaryReference: foundation.boundaries,
    lifecycleApplicability: foundation.lifecycle,
    capabilityApplicability: foundation.capabilities,
    stability: "Stable" as const,
    version: "1.0.0" as const,
    extensionClassification: `${key}Extension`,
    deprecated: false as const,
    deterministicOrder: index + 1,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

export const AnimationEffectsRegistryCategories:
readonly AnimationEffectsRegistryCategory[] = Object.freeze(
  AnimationEffectsRegistryCatalog.map((entry, index) => Object.freeze({
    id: `EVE-7:2/Category/${entry.key}` as const,
    canonicalName: entry.registryCategory,
    description: `Foundation-derived category for ${entry.displayName}.`,
    foundationReference: foundation.contracts[index]!,
    entries: Object.freeze([entry]),
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
