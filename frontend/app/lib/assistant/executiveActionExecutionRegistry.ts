/** ASSISTANT-8:2 — Canonical Executive Action Execution Registry aggregate. */
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";
import { ExecutionCapabilityRegistry } from "./executionCapabilityRegistry.ts";
import { ExecutionContractRegistry } from "./executionContractRegistry.ts";
import {
  ExecutionExceptionRegistry,
  ExecutionFeedbackRegistry,
  ExecutionLifecycleRegistry,
  ExecutionProgressRegistry,
} from "./executionLifecycleRegistry.ts";
import {
  ExecutionMetadataRegistry,
  ExecutiveActionExecutionRegistryIdentity,
} from "./executionMetadataRegistry.ts";
import { ExecutionPolicyRegistry } from "./executionPolicyRegistry.ts";
import { ExecutionStateRegistry } from "./executionStateRegistry.ts";

const collections = Object.freeze({
  contracts: ExecutionContractRegistry,
  capabilities: ExecutionCapabilityRegistry,
  lifecycle: ExecutionLifecycleRegistry,
  executionStates: ExecutionStateRegistry,
  progressTypes: ExecutionProgressRegistry,
  exceptionTypes: ExecutionExceptionRegistry,
  feedbackTypes: ExecutionFeedbackRegistry,
  policies: ExecutionPolicyRegistry,
  metadataDefinitions: ExecutionMetadataRegistry.definitions,
});

const allEntries = Object.freeze([
  ...collections.contracts,
  ...collections.capabilities,
  ...collections.lifecycle,
  ...collections.executionStates,
  ...collections.progressTypes,
  ...collections.exceptionTypes,
  ...collections.feedbackTypes,
  ...collections.policies,
  ...collections.metadataDefinitions,
]);

export const ExecutiveActionExecutionRegistry = Object.freeze({
  identity: ExecutiveActionExecutionRegistryIdentity,
  foundation: ExecutiveActionExecutionFoundation,
  metadata: ExecutionMetadataRegistry,
  contracts: ExecutionContractRegistry,
  capabilities: ExecutionCapabilityRegistry,
  lifecycle: ExecutionLifecycleRegistry,
  executionStates: ExecutionStateRegistry,
  progressTypes: ExecutionProgressRegistry,
  exceptionTypes: ExecutionExceptionRegistry,
  feedbackTypes: ExecutionFeedbackRegistry,
  policies: ExecutionPolicyRegistry,
  entries: allEntries,
  collections,
  statistics: Object.freeze({
    collectionCount: Object.keys(collections).length,
    entryCount: allEntries.length,
    contractCount: collections.contracts.length,
    capabilityCount: collections.capabilities.length,
    lifecycleCount: collections.lifecycle.length,
    executionStateCount: collections.executionStates.length,
    progressTypeCount: collections.progressTypes.length,
    exceptionTypeCount: collections.exceptionTypes.length,
    feedbackTypeCount: collections.feedbackTypes.length,
    policyCount: collections.policies.length,
    metadataDefinitionCount: collections.metadataDefinitions.length,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-8:1 Executive Action Execution Foundation",
  ]),
  publicApiSurface: Object.freeze([
    "ExecutiveActionExecutionRegistry",
  ]),
  status: "Registry",
  stage: "ReadyForModel",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-8:3 — Executive Action Execution Model",
  canonical: true,
  mutable: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  executionEngine: false,
  scheduler: false,
  workflowRuntime: false,
  monitoringServices: false,
  automation: false,
  persistence: false,
  orchestration: false,
  apis: false,
  aiLogic: false,
  ui: false,
} as const);
