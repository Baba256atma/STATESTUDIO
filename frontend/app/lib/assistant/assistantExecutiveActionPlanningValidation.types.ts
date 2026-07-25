/** ASSISTANT-7:4 — Readonly metadata types for Executive Action Planning Validation. */
export type AssistantExecutiveActionPlanningValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export interface AssistantExecutiveActionPlanningValidationRuleMetadata {
  readonly ruleId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: AssistantExecutiveActionPlanningValidationSeverity;
  readonly validationTarget: string;
  readonly expectedResult: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningValidationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningValidationResultMetadata {
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

export interface AssistantExecutiveActionPlanningValidationIdentityMetadata {
  readonly id: "ASSISTANT-7:4/ExecutiveActionPlanningValidation";
  readonly name: "Assistant Executive Action Planning Validation";
  readonly phaseId: "ASSISTANT-7:4";
  readonly namespace: "nexora.assistant.executive-action-planning.validation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: "Validation";
  readonly readiness: "ReadyForManifest";
  readonly sourceModel: "ASSISTANT-7:3/ExecutiveActionPlanningModel";
  readonly metadataOnly: true;
  readonly immutable: true;
}
