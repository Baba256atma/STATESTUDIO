import type { SceneRenderingRegistryPolicy } from "./sceneRenderingRegistryTypes.ts";

const names = Object.freeze([
  "Stable Identity Policy", "Canonical Naming Policy", "Registry Uniqueness Policy",
  "Foundation Reference Policy", "Category Ownership Policy",
  "Deterministic Ordering Policy", "Extension Classification Policy",
  "Immutability Policy", "Compatibility Policy", "Canonical Inventory Rule Policy",
] as const);

export const SceneRenderingRegistryPolicies: readonly SceneRenderingRegistryPolicy[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:2/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive Scene Rendering Registry policy for ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));

