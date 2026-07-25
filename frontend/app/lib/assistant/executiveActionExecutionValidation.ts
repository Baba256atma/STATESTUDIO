/** ASSISTANT-8:4 — Canonical Executive Action Execution Validation aggregate. */
import { ExecutiveActionExecutionModel } from "./executiveActionExecutionModel.ts";
import { ExecutionValidationCategories } from "./executionValidationCategories.ts";
import {
  ExecutionValidationGates,
  ExecutionValidationManifest,
} from "./executionValidationManifest.ts";
import {
  ExecutionValidationStructuralMetadata,
  ExecutiveActionExecutionValidationIdentity,
} from "./executionValidationMetadata.ts";
import { ExecutionValidationPlatform } from "./executionValidationPlatform.ts";
import { ExecutionValidationPolicies } from "./executionValidationPolicies.ts";
import { ExecutionValidationRules } from "./executionValidationRules.ts";

export const ExecutiveActionExecutionValidation = Object.freeze({
  identity: ExecutiveActionExecutionValidationIdentity,
  model: ExecutiveActionExecutionModel,
  metadata: ExecutionValidationStructuralMetadata,
  categories: ExecutionValidationCategories,
  rules: ExecutionValidationRules,
  gates: ExecutionValidationGates,
  policies: ExecutionValidationPolicies,
  manifest: ExecutionValidationManifest,
  platform: ExecutionValidationPlatform,
  results: ExecutionValidationManifest.results,
  statistics: Object.freeze({
    validationCategoryCount: ExecutionValidationCategories.length,
    validationRuleCount: ExecutionValidationRules.length,
    validationGateCount: ExecutionValidationGates.length,
    validationPolicyCount: ExecutionValidationPolicies.length,
    validationMetadataCount:
      ExecutionValidationStructuralMetadata.metadataFields.length,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-8:3 Executive Action Execution Model",
  ]),
  publicApiSurface: Object.freeze([
    "ExecutiveActionExecutionValidation",
  ]),
  status: "Validation",
  stage: "ReadyForManifest",
  readiness: "ReadyForManifest",
  nextPhase: "ASSISTANT-8:5 — Executive Action Execution Manifest",
  canonical: true,
  mutable: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableValidation: false,
  runtime: false,
  executionEngine: false,
  workflowExecution: false,
  scheduler: false,
  monitoringServices: false,
  automation: false,
  persistence: false,
  orchestration: false,
  apis: false,
  aiReasoning: false,
  ui: false,
} as const);
