/** ASSISTANT-3:5 — Readonly metadata types for Intent & Dialogue Manifest. */
export interface AssistantIntentDialogueManifestIdentityMetadata {
  readonly id: "ASSISTANT-3:5/IntentDialogueUnderstandingManifest";
  readonly name: "Assistant Intent & Dialogue Understanding Manifest";
  readonly phaseId: "ASSISTANT-3:5";
  readonly namespace: "nexora.assistant.intent-dialogue.manifest";
  readonly version: "1.0.0";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly sourceValidation: "ASSISTANT-3:4/IntentDialogueUnderstandingValidation";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueCompatibilityMetadata {
  readonly platformCompatible: true;
  readonly certificationCompatible: true;
  readonly freezeCompatible: true;
  readonly publicIndexCompatible: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueManifestSummaryMetadata {
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
