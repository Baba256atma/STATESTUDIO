import { GraphVisualizationValidation } from "./graphVisualizationValidation.ts";
import {
  GraphVisualizationManifestComposition,
  GraphVisualizationManifestReadiness,
} from "./graphVisualizationManifestComposition.ts";
import { GraphVisualizationManifestCompatibility } from "./graphVisualizationManifestCompatibility.ts";
import { GraphVisualizationManifestGuarantees } from "./graphVisualizationManifestGuarantees.ts";

export const GraphVisualizationManifestInventory = Object.freeze({
  phaseComposition: GraphVisualizationManifestComposition,
  validationInventory: GraphVisualizationValidation.inventory,
  validationRules: GraphVisualizationValidation.rules,
  validationGates: GraphVisualizationValidation.gates,
  validationOutcomes: GraphVisualizationValidation.outcomes,
  validationDiagnostics: GraphVisualizationValidation.diagnostics,
  validationCategories: GraphVisualizationValidation.categories,
  validationPolicies: GraphVisualizationValidation.policies,
  guarantees: GraphVisualizationManifestGuarantees,
  compatibility: GraphVisualizationManifestCompatibility,
  readiness: GraphVisualizationManifestReadiness,
  counts: Object.freeze({
    phaseCount: GraphVisualizationManifestComposition.length,
    validationRuleCount: GraphVisualizationValidation.rules.length,
    validationGateCount: GraphVisualizationValidation.gates.length,
    validationOutcomeCount: GraphVisualizationValidation.outcomes.length,
    validationDiagnosticCount: GraphVisualizationValidation.diagnostics.length,
    guaranteeCount: GraphVisualizationManifestGuarantees.length,
    compatibilityCount: GraphVisualizationManifestCompatibility.length,
    readinessCount: GraphVisualizationManifestReadiness.length,
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
