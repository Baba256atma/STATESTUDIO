import { getExecutiveDecisionValidationSummary } from "./executiveDecisionValidationPlatform.ts";
import type { ExecutiveDecisionManifestInventory } from "./executiveDecisionManifestTypes.ts";
import { ExecutiveDecisionPhaseManifestTotals } from "./executiveDecisionPhaseManifest.ts";

const validationSummary = getExecutiveDecisionValidationSummary();

/**
 * Immutable ENG-7 inventory. Counts are declared architectural metadata.
 */
export const ExecutiveDecisionInventoryManifest = Object.freeze({
  completedPhases: 4,
  filesRepresented: 32,
  approvedPublicExports: 27,
  foundationCapabilities: 8,
  decisionDomains: 12,
  decisionTypes: 16,
  registryCapabilities: 8,
  outputTypes: 8,
  lifecycleStates: 8,
  canonicalModels: 10,
  validationCategories: 8,
  validationSeverities: 4,
  validationRules: 32,
  passingValidationRules: 32,
  failingValidationRules: 0,
  architecturalAssets: Object.freeze([
    "foundation",
    "capability registry",
    "ownership map",
    "dependency map",
    "domain registry",
    "decision-type registry",
    "output registry",
    "lifecycle registry",
    "decision models",
    "decision trace model",
    "recommendation package model",
    "publication metadata model",
    "validation registry",
    "validation manifest",
    "validation summary",
  ] as const),
  validationAlignment: Object.freeze({
    declaredPassingRules: 32,
    declaredFailingRules: 0,
    summaryPassingRules: validationSummary.passedRules,
    summaryFailingRules: validationSummary.failureCount,
    summaryStatus: validationSummary.validationStatus,
  } as const),
  phaseTotals: ExecutiveDecisionPhaseManifestTotals,
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionManifestInventory & {
  readonly validationAlignment: Readonly<{
    declaredPassingRules: 32;
    declaredFailingRules: 0;
    summaryPassingRules: number;
    summaryFailingRules: number;
    summaryStatus: string;
  }>;
  readonly phaseTotals: typeof ExecutiveDecisionPhaseManifestTotals;
});
