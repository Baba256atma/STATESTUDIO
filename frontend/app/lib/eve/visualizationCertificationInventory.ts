import { VisualizationPlatform } from "./visualizationPlatform.ts";
import { VisualizationCertificationCompatibility } from "./visualizationCertificationCompatibility.ts";
import { VisualizationCertificationCriteria } from "./visualizationCertificationCriteria.ts";
import { VisualizationCertificationGates } from "./visualizationCertificationGates.ts";

export const VisualizationCertificationInventory = Object.freeze({
  criteriaCount: VisualizationCertificationCriteria.length,
  gateCount: VisualizationCertificationGates.length,
  compatibilityVerificationCount: VisualizationCertificationCompatibility.length,
  platformInventory: VisualizationPlatform.inventory,
  platformCapabilityReference: VisualizationPlatform.capabilities,
  platformGuaranteeReference: VisualizationPlatform.guarantees,
  canonicalReferences: VisualizationPlatform.inventory.canonicalReferences,
  countsDerivedFromCanonicalCollections: true,
  platformInventoryPreservedByReference: true,
  recalculatesPlatformInventory: false,
  hardcodesInventoryCounts: false,
  duplicatesPlatformMetadata: false,
  reconstructsCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

