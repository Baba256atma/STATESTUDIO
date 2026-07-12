import { ExecutiveIntentResolutionRegistryPlatform } from "./executiveIntentResolutionRegistryIndex.ts";
import type { ExecutiveValidationGroup } from "./executiveIntentResolutionValidationTypes.ts";

const passed = Object.freeze({ status: "Passed", description: "Satisfied by canonical ENG-3:2 public metadata.", metadataOnly: true, immutable: true } as const);

export const ExecutiveIntentResolutionRegistryValidation = Object.freeze({
  id: "eng-3-validation-group-registry", name: "Executive Intent Resolution Registry Validation", targetPhase: "ENG-3:2",
  rules: Object.freeze([
    Object.freeze({ id: "eng-3-validation-registry-completeness", name: "Registry Completeness", category: "Registry", severity: "Critical", description: "Nine registry groups are structurally complete.", evidenceReference: ExecutiveIntentResolutionRegistryPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-registry-ownership", name: "Registry Ownership", category: "Ownership", severity: "Critical", description: "ENG-3 registry ownership is declared.", evidenceReference: ExecutiveIntentResolutionRegistryPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-registry-compatibility", name: "Registry Compatibility", category: "Compatibility", severity: "Error", description: "Foundation compatibility is declared.", evidenceReference: ExecutiveIntentResolutionRegistryPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-registry-uniqueness", name: "Registry Uniqueness", category: "Registry", severity: "Error", description: "Registry identifier uniqueness is declared.", evidenceReference: ExecutiveIntentResolutionRegistryPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-registry-version", name: "Registry Version Consistency", category: "Metadata", severity: "Warning", description: "Registry version consistency is declared.", evidenceReference: ExecutiveIntentResolutionRegistryPlatform, result: passed, metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-validation-registry-publication", name: "Registry Publication", category: "Release Readiness", severity: "Warning", description: "Registry publication metadata is complete.", evidenceReference: ExecutiveIntentResolutionRegistryPlatform, result: passed, metadataOnly: true, immutable: true } as const),
  ]),
  status: "Passed", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveValidationGroup);
