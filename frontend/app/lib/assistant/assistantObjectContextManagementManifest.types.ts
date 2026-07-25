/** ASSISTANT-6:5 — Readonly metadata types for Object & Context Management Manifest. */
export interface AssistantObjectContextManagementManifestIdentityMetadata {
  readonly id: "ASSISTANT-6:5/ObjectContextManagementManifest";
  readonly name: "Assistant Object & Context Management Manifest";
  readonly phaseId: "ASSISTANT-6:5";
  readonly namespace: "nexora.assistant.object-context-management.manifest";
  readonly version: "1.0.0";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly sourceValidation:
    "ASSISTANT-6:4/ObjectContextManagementValidation";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementCompatibilityMetadata {
  readonly platformCompatible: true;
  readonly certificationCompatible: true;
  readonly freezeCompatible: true;
  readonly publicIndexCompatible: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementManifestSummaryMetadata {
  readonly manifestId: string;
  readonly validationStatus: "Passed";
  readonly readiness: "ReadyForPlatform";
  readonly architectureCompleteness: "Complete";
  readonly inventoryCompleteness: "Complete";
  readonly validationCompleteness: "Complete";
  readonly consumerReadiness: "Ready";
  readonly platformEligibility: "Eligible";
  readonly publishedInventoryCount: number;
  readonly validationRuleCount: number;
  readonly validationGateCount: number;
  readonly canonicalInventoryRuleSatisfied: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
