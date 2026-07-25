/** ASSISTANT-1:4 — Readonly metadata types for Conversation Validation. */
export type AssistantConversationValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export interface AssistantConversationValidationRuleMetadata {
  readonly ruleId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: AssistantConversationValidationSeverity;
  readonly validationTarget: string;
  readonly expectedResult: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationValidationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationValidationResultMetadata {
  readonly validationStatus: "Passed";
  readonly ruleCount: number;
  readonly gateCount: number;
  readonly passed: number;
  readonly failed: 0;
  readonly warnings: 0;
  readonly readiness: "ReadyForManifest";
  readonly certificationEligibility: "Eligible";
  readonly metadataOnly: true;
  readonly immutable: true;
}
