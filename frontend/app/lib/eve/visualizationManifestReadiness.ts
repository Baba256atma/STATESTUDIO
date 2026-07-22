import { VisualizationValidation } from "./visualizationValidation.ts";
import type { VisualizationManifestReadinessEntry } from "./visualizationManifestTypes.ts";

const names = Object.freeze([
  "ReadyForPlatform", "ManifestCompleteness", "DependencySatisfaction",
  "ValidationSatisfaction", "InventoryPublication",
  "CompatibilityPublication", "GuaranteePublication",
] as const);

export const VisualizationManifestReadiness: readonly VisualizationManifestReadinessEntry[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-1:5/Readiness/${name}`,
    name,
    ready: true,
    evidenceReference: VisualizationValidation.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

