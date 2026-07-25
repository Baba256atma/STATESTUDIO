/** ASSISTANT-8:5 — Manifest identity and structural metadata. */
import { ExecutiveActionExecutionValidation } from "./executiveActionExecutionValidation.ts";

export const ExecutiveActionExecutionManifestIdentity = Object.freeze({
  id: "ASSISTANT-8:5/ExecutiveActionExecutionManifest",
  name: "Assistant Executive Action Execution Manifest",
  phaseId: "ASSISTANT-8:5",
  namespace: "nexora.assistant.executive-action-execution.manifest",
  version: "1.0.0",
  owner: "Nexora Assistant",
  status: "Manifest",
  stage: "ReadyForPlatform",
  readiness: "ReadyForPlatform",
  releaseStatus: "Manifest",
  lifecycle: "ASSISTANT-8 Manifest",
  canonical: true,
  mutable: false,
  sourceValidation: "ASSISTANT-8:4/ExecutiveActionExecutionValidation",
  dependencyChain: Object.freeze([
    "ASSISTANT-8:1 Executive Action Execution Foundation",
    "ASSISTANT-8:2 Executive Action Execution Registry",
    "ASSISTANT-8:3 Executive Action Execution Model",
    "ASSISTANT-8:4 Executive Action Execution Validation",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutionManifestStructuralMetadata = Object.freeze({
  identity: ExecutiveActionExecutionManifestIdentity,
  canonicalId: ExecutiveActionExecutionManifestIdentity.id,
  namespace: ExecutiveActionExecutionManifestIdentity.namespace,
  version: ExecutiveActionExecutionManifestIdentity.version,
  owner: ExecutiveActionExecutionManifestIdentity.owner,
  releaseStatus: ExecutiveActionExecutionManifestIdentity.releaseStatus,
  lifecycle: ExecutiveActionExecutionManifestIdentity.lifecycle,
  readiness: ExecutiveActionExecutionManifestIdentity.readiness,
  dependencyChain: ExecutiveActionExecutionManifestIdentity.dependencyChain,
  sourceValidation: ExecutiveActionExecutionValidation.identity,
  validationPlatform: ExecutiveActionExecutionValidation.platform,
  validationManifest: ExecutiveActionExecutionValidation.manifest,
  validationMetadata: ExecutiveActionExecutionValidation.metadata,
  canonicalInventoryRule: "Validation References Only",
  metadataOnly: true,
  immutable: true,
} as const);
