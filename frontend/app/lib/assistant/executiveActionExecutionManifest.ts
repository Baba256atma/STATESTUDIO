/** ASSISTANT-8:5 — Canonical Executive Action Execution Manifest aggregate. */
import { ExecutiveActionExecutionValidation } from "./executiveActionExecutionValidation.ts";
import { ExecutionManifestCompatibility } from "./executionManifestCompatibility.ts";
import { ExecutionManifestExports } from "./executionManifestExports.ts";
import { ExecutionManifestInventory } from "./executionManifestInventory.ts";
import {
  ExecutionManifestStructuralMetadata,
  ExecutiveActionExecutionManifestIdentity,
} from "./executionManifestMetadata.ts";
import { ExecutionManifestReadiness } from "./executionManifestReadiness.ts";
import { ExecutionManifestSummary } from "./executionManifestSummary.ts";

const publishedInventoryCount = Object.keys(ExecutionManifestInventory)
  .filter((key) => key.endsWith("Inventory")).length;

export const ExecutiveActionExecutionManifest = Object.freeze({
  identity: ExecutiveActionExecutionManifestIdentity,
  validation: ExecutiveActionExecutionValidation,
  metadata: ExecutionManifestStructuralMetadata,
  inventory: ExecutionManifestInventory,
  summary: ExecutionManifestSummary,
  compatibility: ExecutionManifestCompatibility,
  readiness: ExecutionManifestReadiness,
  exports: ExecutionManifestExports,
  statistics: Object.freeze({
    publishedInventoryCount,
    validationRuleCount:
      ExecutionManifestInventory.totals.validationRuleCount,
    validationGateCount:
      ExecutionManifestInventory.totals.validationGateCount,
    validationCategoryCount:
      ExecutionManifestInventory.totals.validationCategoryCount,
    domainModelCount: ExecutionManifestInventory.totals.domainModelCount,
    relationshipModelCount:
      ExecutionManifestInventory.totals.relationshipModelCount,
    compatibilityCount: ExecutionManifestCompatibility.phases.length,
    readinessStatus: ExecutionManifestReadiness.readiness,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-8:4 Executive Action Execution Validation",
  ]),
  publicApiSurface: Object.freeze([
    "ExecutiveActionExecutionManifest",
  ]),
  status: "Manifest",
  stage: "ReadyForPlatform",
  readinessStatus: "ReadyForPlatform",
  nextPhase: "ASSISTANT-8:6 — Executive Action Execution Platform",
  canonicalInventoryRuleSatisfied: true,
  canonical: true,
  mutable: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  executionEngine: false,
  workflowRuntime: false,
  scheduler: false,
  monitoringServices: false,
  automation: false,
  persistence: false,
  orchestration: false,
  apis: false,
  aiReasoning: false,
  ui: false,
} as const);
