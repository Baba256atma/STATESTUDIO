import { TimelineVisualizationValidationPlatform } from "./timelineVisualizationValidation.ts";
import {
  TimelineVisualizationManifestComposition,
  TimelineVisualizationManifestReadiness,
} from "./timelineVisualizationManifestComposition.ts";
import { TimelineVisualizationManifestCompatibility } from "./timelineVisualizationManifestCompatibility.ts";
import { TimelineVisualizationManifestGuarantees } from "./timelineVisualizationManifestGuarantees.ts";

export const TimelineVisualizationManifestInventory = Object.freeze({
  phaseComposition: TimelineVisualizationManifestComposition,
  validationInventory: TimelineVisualizationValidationPlatform.inventory,
  validationRules: TimelineVisualizationValidationPlatform.rules,
  validationGates: TimelineVisualizationValidationPlatform.gates,
  validationOutcomes: TimelineVisualizationValidationPlatform.outcomes,
  validationDiagnostics: TimelineVisualizationValidationPlatform.diagnostics,
  guarantees: TimelineVisualizationManifestGuarantees,
  compatibility: TimelineVisualizationManifestCompatibility,
  readiness: TimelineVisualizationManifestReadiness,
  publicManifestSurface: Object.freeze([
    "Manifest platform", "Manifest ID", "Manifest version", "Manifest namespace",
    "Manifest metadata", "Manifest summary", "Manifest count", "Manifest release metadata",
  ] as const),
  counts: Object.freeze({
    phaseCount: TimelineVisualizationManifestComposition.length,
    validationRuleCount: TimelineVisualizationValidationPlatform.rules.length,
    validationGateCount: TimelineVisualizationValidationPlatform.gates.length,
    validationOutcomeCount: TimelineVisualizationValidationPlatform.outcomes.length,
    validationDiagnosticCount: TimelineVisualizationValidationPlatform.diagnostics.length,
    guaranteeCount: TimelineVisualizationManifestGuarantees.length,
    compatibilityCount: TimelineVisualizationManifestCompatibility.length,
    readinessCount: TimelineVisualizationManifestReadiness.length,
  }),
  validationCollectionsPreservedByReference: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodesAggregateTotals: false,
  reconstructsUpstreamCollections: false,
  duplicatesValidationMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
