/** ASSISTANT-7:5 — Readonly metadata types for Executive Action Planning Manifest. */
export interface AssistantExecutiveActionPlanningManifestIdentityMetadata {
  readonly id: "ASSISTANT-7:5/ExecutiveActionPlanningManifest";
  readonly name: "Assistant Executive Action Planning Manifest";
  readonly phaseId: "ASSISTANT-7:5";
  readonly namespace: "nexora.assistant.executive-action-planning.manifest";
  readonly version: "1.0.0";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly sourceValidation:
    "ASSISTANT-7:4/ExecutiveActionPlanningValidation";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningCompatibilityMetadata {
  readonly platformCompatible: true;
  readonly certificationCompatible: true;
  readonly freezeCompatible: true;
  readonly publicIndexCompatible: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningManifestSummaryMetadata {
  readonly manifestId: string;
  readonly validationStatus: "Passed";
  readonly readiness: "ReadyForPlatform";
  readonly architectureCompleteness: "Complete";
  readonly inventoryCompleteness: "Complete";
  readonly validationCompleteness: "Complete";
  readonly consumerReadiness: "Ready";
  readonly platformEligibility: "Eligible";
  readonly canonicalInventoryCompliance: "Compliant";
  readonly publishedInventoryCount: number;
  readonly validationRuleCount: number;
  readonly validationGateCount: number;
  readonly canonicalInventoryRuleSatisfied: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
