import {
  ExecutiveWorkflowIntelligenceFoundation,
  buildWorkflowIntelligenceManifest,
  validateWorkflowIntelligenceFoundation,
} from "./workflowIntelligenceIndex.ts";
import type { WorkflowValidationEntry } from "./workflowValidationTypes.ts";

export const WorkflowFoundationValidation = Object.freeze([
  Object.freeze({
    id: "workflow-foundation-integrity",
    name: "Foundation Integrity",
    description: "Validates the OPS-3:1 workflow foundation public surface.",
    category: "Foundation",
    status:
      ExecutiveWorkflowIntelligenceFoundation.identity.platformId === "OPS-3:1" &&
      validateWorkflowIntelligenceFoundation().summary.status === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-foundation-manifest",
    name: "Foundation Manifest Generation",
    description: "Validates deterministic manifest generation for OPS-3:1.",
    category: "Manifest",
    status:
      Object.isFrozen(buildWorkflowIntelligenceManifest()) &&
      buildWorkflowIntelligenceManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-foundation-immutability",
    name: "Foundation Immutability",
    description: "Validates immutable workflow foundation exports.",
    category: "Immutability",
    status: Object.isFrozen(ExecutiveWorkflowIntelligenceFoundation) ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
] as const);
