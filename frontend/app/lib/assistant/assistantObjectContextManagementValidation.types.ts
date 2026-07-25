/** ASSISTANT-6:4 — Readonly metadata types for Object & Context Management Validation. */
export type AssistantObjectContextManagementValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export interface AssistantObjectContextManagementValidationRuleMetadata {
  readonly ruleId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: AssistantObjectContextManagementValidationSeverity;
  readonly validationTarget: string;
  readonly expectedResult: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementValidationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementValidationResultMetadata {
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

export interface AssistantObjectContextManagementValidationIdentityMetadata {
  readonly id: "ASSISTANT-6:4/ObjectContextManagementValidation";
  readonly name: "Assistant Object & Context Management Validation";
  readonly phaseId: "ASSISTANT-6:4";
  readonly namespace: "nexora.assistant.object-context-management.validation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: "Validation";
  readonly readiness: "ReadyForManifest";
  readonly sourceModel: "ASSISTANT-6:3/ObjectContextManagementModel";
  readonly metadataOnly: true;
  readonly immutable: true;
}
