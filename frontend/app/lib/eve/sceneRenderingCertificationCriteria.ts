import { SceneRenderingPlatform } from "./sceneRenderingPlatform.ts";
import type { SceneRenderingCertificationCriterion } from "./sceneRenderingCertificationTypes.ts";

const names = Object.freeze([
  "Platform Identity Integrity", "Canonical Phase Composition Integrity",
  "Manifest Preservation", "Validation Preservation", "Registry Preservation",
  "Foundation Preservation", "Dependency Integrity", "Canonical Reference Integrity",
  "Inventory Consistency", "Capability Consistency", "Guarantee Consistency",
  "Compatibility Consistency", "Namespace Integrity", "Public Export Consistency",
  "Canonical Inventory Rule Compliance", "Architectural Boundary Compliance",
] as const);

export const SceneRenderingCertificationCriteria: readonly SceneRenderingCertificationCriterion[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:7/Criterion/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative Scene Rendering certification criterion for ${name}.`,
    platformReference: SceneRenderingPlatform.metadata.id,
    expectedOutcome: "Certified",
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly",
    metadataOnly: true,
    immutable: true,
  })));
