/** ASSISTANT-8:5 — Immutable Manifest summary metadata. */
import { ExecutiveActionExecutionValidation } from "./executiveActionExecutionValidation.ts";
import { ExecutionManifestCompatibility } from "./executionManifestCompatibility.ts";
import { ExecutionManifestInventory } from "./executionManifestInventory.ts";
import { ExecutiveActionExecutionManifestIdentity } from "./executionManifestMetadata.ts";
import { ExecutionManifestReadiness } from "./executionManifestReadiness.ts";

const validation = ExecutiveActionExecutionValidation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

export const ExecutionManifestSummary = Object.freeze({
  foundationStatus: foundation.status,
  registryStatus: registry.status,
  modelStatus: model.status,
  validationStatus: validation.status,
  manifestStatus: ExecutiveActionExecutionManifestIdentity.status,
  readiness: ExecutionManifestReadiness.readiness,
  compatibility: ExecutionManifestCompatibility,
  canonicalIdentity: ExecutiveActionExecutionManifestIdentity.id,
  architectureCompleteness: "Complete",
  inventoryCompleteness: "Complete",
  validationCompleteness: "Complete",
  consumerReadiness: "Ready",
  platformEligibility: ExecutionManifestReadiness.platformEligibility,
  canonicalInventoryCompliance: "Compliant",
  publishedInventoryCount: Object.keys(ExecutionManifestInventory)
    .filter((key) => key.endsWith("Inventory")).length,
  inventoryTotals: ExecutionManifestInventory.totals,
  validationRuleCount:
    ExecutionManifestInventory.totals.validationRuleCount,
  validationGateCount:
    ExecutionManifestInventory.totals.validationGateCount,
  metadataOnly: true,
  immutable: true,
} as const);
