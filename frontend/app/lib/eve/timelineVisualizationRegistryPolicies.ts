import type { TimelineVisualizationRegistryPolicy } from "./timelineVisualizationRegistryTypes.ts";

const policyNames = Object.freeze([
  "Stable identity policy", "Canonical naming policy", "Registry uniqueness policy",
  "Foundation reference preservation policy", "Category ownership policy",
  "Deterministic ordering policy", "Vocabulary immutability policy",
  "Extension classification policy", "Timeline-versus-animation separation policy",
  "Timeline-versus-scheduling separation policy",
  "Playback-intent-versus-execution separation policy", "Canonical Inventory Rule policy",
] as const);

export const TimelineVisualizationRegistryPolicies:
readonly TimelineVisualizationRegistryPolicy[] = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-4:2/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative registry policy: ${name}.`,
    deterministicOrder: index + 1,
    enforcement: "DescriptiveOnly",
    metadataOnly: true,
    immutable: true,
  })),
);
