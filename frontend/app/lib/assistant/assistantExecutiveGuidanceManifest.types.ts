/** ASSISTANT-4:5 — Readonly metadata types for Executive Guidance Manifest. */
export interface AssistantExecutiveGuidanceManifestIdentityMetadata {
  readonly id: "ASSISTANT-4:5/ExecutiveGuidanceManifest";
  readonly name: "Assistant Executive Guidance Manifest";
  readonly phaseId: "ASSISTANT-4:5";
  readonly namespace: "nexora.assistant.executive-guidance.manifest";
  readonly version: "1.0.0";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly sourceValidation: "ASSISTANT-4:4/ExecutiveGuidanceValidation";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceCompatibilityMetadata {
  readonly platformCompatible: true;
  readonly certificationCompatible: true;
  readonly freezeCompatible: true;
  readonly publicIndexCompatible: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceManifestSummaryMetadata {
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
