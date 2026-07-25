/** ASSISTANT-8:5 — Immutable Manifest export metadata surface. */
import { ExecutionManifestCompatibility } from "./executionManifestCompatibility.ts";
import { ExecutionManifestInventory } from "./executionManifestInventory.ts";
import {
  ExecutionManifestStructuralMetadata,
  ExecutiveActionExecutionManifestIdentity,
} from "./executionManifestMetadata.ts";
import { ExecutionManifestReadiness } from "./executionManifestReadiness.ts";
import { ExecutionManifestSummary } from "./executionManifestSummary.ts";

export const ExecutionManifestExports = Object.freeze({
  identity: ExecutiveActionExecutionManifestIdentity,
  inventoryTotals: ExecutionManifestInventory.totals,
  validationTotals: Object.freeze({
    categoryCount:
      ExecutionManifestInventory.totals.validationCategoryCount,
    ruleCount: ExecutionManifestInventory.totals.validationRuleCount,
    gateCount: ExecutionManifestInventory.totals.validationGateCount,
  }),
  readiness: ExecutionManifestReadiness,
  compatibility: ExecutionManifestCompatibility,
  canonicalStatus: Object.freeze({
    canonical: ExecutiveActionExecutionManifestIdentity.canonical,
    mutable: ExecutiveActionExecutionManifestIdentity.mutable,
    status: ExecutiveActionExecutionManifestIdentity.status,
    stage: ExecutiveActionExecutionManifestIdentity.stage,
  }),
  summary: ExecutionManifestSummary,
  metadata: ExecutionManifestStructuralMetadata,
  publicExports: Object.freeze([
    "ExecutiveActionExecutionManifest",
  ]),
  runtimeExports: false,
  metadataOnly: true,
  immutable: true,
} as const);
