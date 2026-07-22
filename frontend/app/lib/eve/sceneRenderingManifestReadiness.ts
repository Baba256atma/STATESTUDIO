import { SceneRenderingValidation } from "./sceneRenderingValidation.ts";
import type { SceneRenderingManifestReadinessEntry } from "./sceneRenderingManifestTypes.ts";

const names = Object.freeze([
  "ReadyForPlatform", "ManifestComplete", "ValidationSatisfied",
  "DependencySatisfied", "CompatibilitySatisfied", "InventoryPublished",
  "GuaranteePublished",
] as const);

export const SceneRenderingManifestReadiness: readonly SceneRenderingManifestReadinessEntry[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:5/Readiness/${name}`,
    name,
    ready: true,
    evidenceReference: SceneRenderingValidation.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));
