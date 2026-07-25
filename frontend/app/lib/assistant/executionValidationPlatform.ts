/** ASSISTANT-8:4 — Validation platform summary metadata. */
import { ExecutiveActionExecutionModel } from "./executiveActionExecutionModel.ts";
import { ExecutionValidationCategories } from "./executionValidationCategories.ts";
import { ExecutionValidationManifest } from "./executionValidationManifest.ts";
import {
  ExecutionValidationStructuralMetadata,
  ExecutiveActionExecutionValidationIdentity,
} from "./executionValidationMetadata.ts";
import { ExecutionValidationPolicies } from "./executionValidationPolicies.ts";
import { ExecutionValidationRules } from "./executionValidationRules.ts";

export const ExecutionValidationPlatform = Object.freeze({
  identity: ExecutiveActionExecutionValidationIdentity,
  sourceModel: ExecutiveActionExecutionModel.identity,
  validationCategoryCount: ExecutionValidationCategories.length,
  validationRuleCount: ExecutionValidationRules.length,
  validationGateCount: ExecutionValidationManifest.gates.length,
  validationPolicyCount: ExecutionValidationPolicies.length,
  validationReadiness: "ReadyForManifest",
  compatibilityStatus: ExecutionValidationStructuralMetadata.compatibility,
  statistics: Object.freeze({
    categoryCount: ExecutionValidationCategories.length,
    ruleCount: ExecutionValidationRules.length,
    gateCount: ExecutionValidationManifest.gates.length,
    policyCount: ExecutionValidationPolicies.length,
    metadataFieldCount:
      ExecutionValidationStructuralMetadata.metadataFields.length,
  }),
  manifestEligibility:
    ExecutionValidationManifest.results.manifestEligibility,
  metadataOnly: true,
  immutable: true,
} as const);
