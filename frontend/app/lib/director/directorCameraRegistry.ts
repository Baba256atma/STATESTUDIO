import type { DirectorRegistryEntry } from "./directorRegistryTypes.ts";

const entries = <const Names extends readonly string[]>(
  category: "CameraFocusType" | "CameraTargetType",
  names: Names,
): readonly DirectorRegistryEntry[] => Object.freeze(names.map((name, index) =>
  Object.freeze({
    id: `DIRECTOR-1:2/${category}/${name}`,
    name,
    description: `Canonical Director ${category} classification for ${name}.`,
    category,
    version: "1.0.0" as const,
    namespace: `nexora.director.registry.${category.toLowerCase()}` as const,
    stability: "Stable" as const,
    deterministicOrder: index + 1,
  }),
));

export const DirectorCameraFocusTypeRegistry = entries("CameraFocusType", [
  "Object", "Group", "Process", "Organization", "Department", "Timeline",
  "Scenario", "Risk", "Opportunity", "ExecutiveOverview",
] as const);

export const DirectorCameraTargetTypeRegistry = entries("CameraTargetType", [
  "SingleObject", "MultipleObjects", "Organization", "ProcessFlow",
  "Timeline", "ExecutiveScene",
] as const);

export const DirectorCameraRegistry = Object.freeze({
  focusTypes: DirectorCameraFocusTypeRegistry,
  targetTypes: DirectorCameraTargetTypeRegistry,
  metadataOnly: true,
  immutable: true,
} as const);

