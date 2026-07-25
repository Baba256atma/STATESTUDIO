/** ASSISTANT-2:5 — Readonly metadata types for Executive Memory Manifest. */
export interface AssistantExecutiveMemoryManifestIdentityMetadata {
  readonly id: "ASSISTANT-2:5/ExecutiveMemoryManifest";
  readonly name: "Assistant Executive Memory Manifest";
  readonly phaseId: "ASSISTANT-2:5";
  readonly namespace: "nexora.assistant.executive-memory.manifest";
  readonly version: "1.0.0";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly sourceValidation: "ASSISTANT-2:4/ExecutiveMemoryValidation";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryCompatibilityMetadata {
  readonly platformCompatible: true;
  readonly certificationCompatible: true;
  readonly freezeCompatible: true;
  readonly publicIndexCompatible: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryManifestSummaryMetadata {
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
