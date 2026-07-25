/** ASSISTANT-4:4 — Readonly metadata types for Executive Guidance Validation. */
export type AssistantExecutiveGuidanceValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export interface AssistantExecutiveGuidanceValidationRuleMetadata {
  readonly ruleId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: AssistantExecutiveGuidanceValidationSeverity;
  readonly validationTarget: string;
  readonly expectedResult: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceValidationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceValidationResultMetadata {
  readonly validationStatus: "Passed";
  readonly ruleCount: number;
  readonly gateCount: number;
  readonly passed: number;
  readonly failed: 0;
  readonly warnings: 0;
  readonly readiness: "ReadyForManifest";
  readonly manifestEligibility: "Eligible";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceValidationIdentityMetadata {
  readonly id: "ASSISTANT-4:4/ExecutiveGuidanceValidation";
  readonly name: "Assistant Executive Guidance Validation";
  readonly phaseId: "ASSISTANT-4:4";
  readonly namespace: "nexora.assistant.executive-guidance.validation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: "Validation";
  readonly readiness: "ReadyForManifest";
  readonly sourceModel: "ASSISTANT-4:3/ExecutiveGuidanceModel";
  readonly metadataOnly: true;
  readonly immutable: true;
}
