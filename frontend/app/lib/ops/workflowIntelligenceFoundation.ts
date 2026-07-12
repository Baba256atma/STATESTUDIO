import { WorkflowIntelligenceContracts } from "./workflowIntelligenceContracts.ts";
import { WorkflowIntelligenceIdentity } from "./workflowIntelligenceIdentity.ts";
import { buildWorkflowIntelligenceManifest } from "./workflowIntelligenceManifest.ts";
import { WorkflowIntelligenceRegistry } from "./workflowIntelligenceRegistry.ts";
import { validateWorkflowIntelligenceFoundation } from "./workflowIntelligenceValidation.ts";

export const ExecutiveWorkflowIntelligenceFoundation = Object.freeze({
  identity: WorkflowIntelligenceIdentity,
  registry: WorkflowIntelligenceRegistry,
  contracts: WorkflowIntelligenceContracts,
  manifest: buildWorkflowIntelligenceManifest(),
  validation: validateWorkflowIntelligenceFoundation(),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
