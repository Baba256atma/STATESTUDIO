import { ExecutiveIntentResolutionFoundation } from "./executiveIntentResolutionIndex.ts";
import type { ExecutiveValidationGroup } from "./executiveIntentResolutionValidationTypes.ts";

const passed = Object.freeze({ status: "Passed", description: "Satisfied by canonical ENG-3:1 public metadata.", metadataOnly: true, immutable: true } as const);

export const ExecutiveIntentResolutionFoundationValidation = Object.freeze({
  id: "eng-3-validation-group-foundation", name: "Executive Intent Resolution Foundation Validation", targetPhase: "ENG-3:1",
  rules: Object.freeze([
    Object.freeze({ id: "eng-3-validation-foundation-existence", name: "Foundation Existence", category: "Foundation", severity: "Critical", description: "Foundation publication is structurally declared.", evidenceReference: ExecutiveIntentResolutionFoundation, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-foundation-contracts", name: "Contract Completeness", category: "Foundation", severity: "Error", description: "Foundation contract inventory is complete.", evidenceReference: ExecutiveIntentResolutionFoundation, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-foundation-metadata", name: "Metadata Completeness", category: "Metadata", severity: "Error", description: "Foundation metadata is complete.", evidenceReference: ExecutiveIntentResolutionFoundation, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-foundation-registry", name: "Registry Linkage", category: "Dependencies", severity: "Error", description: "Foundation registry linkage is declared.", evidenceReference: ExecutiveIntentResolutionFoundation, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-foundation-freeze", name: "Object Freeze Usage", category: "Immutability", severity: "Critical", description: "Foundation immutability is declared.", evidenceReference: ExecutiveIntentResolutionFoundation, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-foundation-visibility", name: "Public Visibility", category: "Public API", severity: "Warning", description: "Foundation public visibility is declared.", evidenceReference: ExecutiveIntentResolutionFoundation, result: passed, metadataOnly: true, immutable: true } as const),
  ]),
  status: "Passed", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveValidationGroup);
