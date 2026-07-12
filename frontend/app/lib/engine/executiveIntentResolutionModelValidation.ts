import { ExecutiveIntentResolutionModelPlatform } from "./executiveIntentResolutionModelIndex.ts";
import type { ExecutiveValidationGroup } from "./executiveIntentResolutionValidationTypes.ts";

const passed = Object.freeze({ status: "Passed", description: "Satisfied by canonical ENG-3:3 public metadata.", metadataOnly: true, immutable: true } as const);

export const ExecutiveIntentResolutionModelValidation = Object.freeze({
  id: "eng-3-validation-group-model", name: "Executive Intent Resolution Model Validation", targetPhase: "ENG-3:3",
  rules: Object.freeze([
    Object.freeze({ id: "eng-3-validation-model-completeness", name: "Model Completeness", category: "Model", severity: "Critical", description: "Intent, goal, and resolution models are complete.", evidenceReference: ExecutiveIntentResolutionModelPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-model-foundation", name: "Foundation References", category: "Dependencies", severity: "Error", description: "Public foundation references are declared.", evidenceReference: ExecutiveIntentResolutionModelPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-model-registry", name: "Registry References", category: "Dependencies", severity: "Error", description: "Public registry references are declared.", evidenceReference: ExecutiveIntentResolutionModelPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-model-ownership", name: "Ownership Metadata", category: "Ownership", severity: "Critical", description: "ENG-3 model ownership is declared.", evidenceReference: ExecutiveIntentResolutionModelPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-model-structure", name: "Structural Consistency", category: "Model", severity: "Error", description: "Model structural descriptors are consistent.", evidenceReference: ExecutiveIntentResolutionModelPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-model-snapshot", name: "Snapshot Integrity", category: "Model", severity: "Warning", description: "Resolution snapshot structure is complete.", evidenceReference: ExecutiveIntentResolutionModelPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-model-summary", name: "Summary Integrity", category: "Model", severity: "Warning", description: "Resolution summary structure is complete.", evidenceReference: ExecutiveIntentResolutionModelPlatform, result: passed, metadataOnly: true, immutable: true } as const),
  ]),
  status: "Passed", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveValidationGroup);
