/** ASSISTANT-8:3 — Model identity, attributes, categories, and structural metadata. */
import { ExecutiveActionExecutionRegistry } from "./executiveActionExecutionRegistry.ts";
import type { ExecutiveActionExecutionModelIdentityMetadata } from "./executionModelTypes.ts";
import {
  EXECUTION_MODEL_NAMESPACE,
  registerCatalogEntries,
} from "./executionModelUtilities.ts";

export const ExecutiveActionExecutionModelIdentity:
ExecutiveActionExecutionModelIdentityMetadata = Object.freeze({
  id: "ASSISTANT-8:3/ExecutiveActionExecutionModel",
  name: "Assistant Executive Action Execution Model",
  phaseId: "ASSISTANT-8:3",
  namespace: EXECUTION_MODEL_NAMESPACE,
  version: "1.0.0",
  status: "Model",
  stage: "ReadyForValidation",
  readiness: "ReadyForValidation",
  canonical: true,
  mutable: false,
  sourceRegistry: "ASSISTANT-8:2/ExecutiveActionExecutionRegistry",
  ownership: "Nexora Assistant",
  metadataOnly: true,
  immutable: true,
});

export const ExecutionModelAttributes = registerCatalogEntries(
  "ExecutionAttribute",
  [
    "Identifier",
    "Name",
    "Description",
    "Owner",
    "Priority",
    "Status",
    "Progress",
    "Health",
    "Checkpoint Count",
    "Completion",
    "Risk Level",
    "Confidence",
    "Created Version",
  ],
);

export const ExecutionModelCategories = registerCatalogEntries(
  "ExecutionModelCategory",
  [
    "Execution",
    "Planning",
    "Monitoring",
    "Progress",
    "Feedback",
    "Exception",
    "Health",
    "Summary",
    "Governance",
    "Ownership",
  ],
);

export const ExecutionModelStructuralMetadata = Object.freeze({
  identity: ExecutiveActionExecutionModelIdentity,
  sourceRegistry: ExecutiveActionExecutionRegistry.identity,
  attributes: ExecutionModelAttributes,
  categories: ExecutionModelCategories,
  metadataFields: Object.freeze([
    "canonical identity",
    "version",
    "ownership",
    "namespace",
    "lifecycle",
    "compatibility",
    "readiness",
    "source registry",
  ]),
  rules: Object.freeze([
    "Immutable Identity",
    "Deterministic Structure",
    "Registry Entries Only",
    "No Circular Dependencies",
    "Stable Metadata",
    "Implementation Free",
  ]),
  responsibilities: Object.freeze([
    "actions",
    "plans",
    "execution",
    "progress",
    "monitoring",
    "health",
    "checkpoints",
    "exceptions",
    "feedback",
    "completion",
  ]),
  compatibility: Object.freeze({
    registryCompatible: true,
    foundationCompatible: true,
    validationCompatible: true,
    freezeCompatible: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);
