/** ASSISTANT-8:6 — Canonical Executive Action Execution Platform aggregate. */
import { ExecutiveActionExecutionManifest } from "./executiveActionExecutionManifest.ts";
import { ExecutionPlatformCapabilities } from "./executionPlatformCapabilities.ts";
import { ExecutionPlatformCompatibility } from "./executionPlatformCompatibility.ts";
import { ExecutionPlatformExtensions } from "./executionPlatformExtensions.ts";
import { ExecutionPlatformGuarantees } from "./executionPlatformGuarantees.ts";
import { ExecutionPlatformInventory } from "./executionPlatformInventory.ts";
import {
  ExecutionPlatformReadiness,
  ExecutionPlatformStructuralMetadata,
  ExecutiveActionExecutionPlatformIdentity,
} from "./executionPlatformMetadata.ts";

export const ExecutiveActionExecutionPlatform = Object.freeze({
  identity: ExecutiveActionExecutionPlatformIdentity,
  manifest: ExecutiveActionExecutionManifest,
  metadata: ExecutionPlatformStructuralMetadata,
  capabilities: ExecutionPlatformCapabilities,
  guarantees: ExecutionPlatformGuarantees,
  extensions: ExecutionPlatformExtensions,
  compatibility: ExecutionPlatformCompatibility,
  inventory: ExecutionPlatformInventory,
  readiness: ExecutionPlatformReadiness,
  consumerMetadata: ExecutionPlatformStructuralMetadata.consumerMetadata,
  composition: Object.freeze({
    manifest: ExecutiveActionExecutionManifest,
    inventory: ExecutiveActionExecutionManifest.inventory,
    summary: ExecutiveActionExecutionManifest.summary,
    validation: ExecutiveActionExecutionManifest.validation,
    sourceManifest: ExecutiveActionExecutionManifest.identity,
    layers: Object.freeze([
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Manifest",
      "Platform",
    ]),
    metadataOnly: true,
    immutable: true,
  }),
  statistics: Object.freeze({
    platformCapabilityCount: ExecutionPlatformCapabilities.length,
    platformGuaranteeCount: ExecutionPlatformGuarantees.length,
    platformExtensionCount: ExecutionPlatformExtensions.length,
    compatibilityCount: ExecutionPlatformCompatibility.phases.length,
    publishedInventoryCount:
      ExecutiveActionExecutionManifest.summary.publishedInventoryCount,
    validationRuleCount:
      ExecutiveActionExecutionManifest.inventory.totals.validationRuleCount,
    validationGateCount:
      ExecutiveActionExecutionManifest.inventory.totals.validationGateCount,
    relationshipModelCount:
      ExecutiveActionExecutionManifest.inventory.totals
        .relationshipModelCount,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-8:5 Executive Action Execution Manifest",
  ]),
  publicApiSurface: Object.freeze([
    "ExecutiveActionExecutionPlatform",
  ]),
  status: "Platform",
  stage: "ReadyForCertification",
  readinessStatus: "ReadyForCertification",
  nextPhase: "ASSISTANT-8:7 — Executive Action Execution Certification",
  canonicalCompositionRuleSatisfied: true,
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
