import { ExecutiveOperationsSuiteRegistryManifest } from "./executiveOperationsSuiteRegistryIndex.ts";
import { ExecutiveOperationsSuiteValidationCategories, ExecutiveOperationsSuiteValidationMetadata, ExecutiveOperationsSuiteValidationRegistry, ExecutiveOperationsSuiteValidationSeverities } from "./executiveOperationsSuiteValidationRegistry.ts";
import type { ExecutiveOperationsSuiteValidationManifest as ManifestShape } from "./executiveOperationsSuiteValidationTypes.ts";

export const ExecutiveOperationsSuiteValidationManifest = Object.freeze({
  validationMetadata: ExecutiveOperationsSuiteValidationMetadata,
  validationRegistry: ExecutiveOperationsSuiteValidationRegistry,
  categoryInventory: ExecutiveOperationsSuiteValidationCategories,
  severityInventory: ExecutiveOperationsSuiteValidationSeverities,
  totalValidationCount: ExecutiveOperationsSuiteValidationRegistry.length,
  architectureSummary: Object.freeze({ metadataOnly: true, descriptiveRulesOnly: true, runtimeValidationAllowed: false, certificationIncluded: false }),
  registryCoverage: Object.freeze({ sourcePhase: "OPS-10:2", platformCount: ExecutiveOperationsSuiteRegistryManifest.platformCount, phaseCount: ExecutiveOperationsSuiteRegistryManifest.phaseCount, registryCovered: true }),
  publicApiCoverage: Object.freeze({ stableExports: true, publicIndexOnly: true, mutationApisExposed: false }),
  validationPolicy: Object.freeze({ enforcement: "None", ruleStatus: "Defined", missingLookup: "Undefined", exactMatching: true }),
  deterministicPolicy: Object.freeze({ deterministicLookups: true, caseSensitive: true, aliasesAllowed: false, fuzzyMatchingAllowed: false }),
  immutablePolicy: Object.freeze({ frozenRegistry: true, frozenEntries: true, frozenManifest: true, readonlyResults: true }),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ManifestShape);
