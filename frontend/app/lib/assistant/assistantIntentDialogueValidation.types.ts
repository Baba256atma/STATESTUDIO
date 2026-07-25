/** ASSISTANT-3:4 — Readonly metadata types for Intent & Dialogue Validation. */
export type AssistantIntentDialogueValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export interface AssistantIntentDialogueValidationRuleMetadata {
  readonly ruleId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: AssistantIntentDialogueValidationSeverity;
  readonly validationTarget: string;
  readonly expectedResult: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueValidationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueValidationResultMetadata {
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

export interface AssistantIntentDialogueValidationIdentityMetadata {
  readonly id: "ASSISTANT-3:4/IntentDialogueUnderstandingValidation";
  readonly name: "Assistant Intent & Dialogue Understanding Validation";
  readonly phaseId: "ASSISTANT-3:4";
  readonly namespace: "nexora.assistant.intent-dialogue.validation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: "Validation";
  readonly readiness: "ReadyForManifest";
  readonly sourceModel: "ASSISTANT-3:3/IntentDialogueUnderstandingModel";
  readonly metadataOnly: true;
  readonly immutable: true;
}
