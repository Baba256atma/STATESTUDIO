/** ASSISTANT-2:4 — Readonly metadata types for Executive Memory Validation. */
export type AssistantExecutiveMemoryValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export interface AssistantExecutiveMemoryValidationRuleMetadata {
  readonly ruleId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: AssistantExecutiveMemoryValidationSeverity;
  readonly validationTarget: string;
  readonly expectedResult: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryValidationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryValidationResultMetadata {
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

export interface AssistantExecutiveMemoryValidationIdentityMetadata {
  readonly id: "ASSISTANT-2:4/ExecutiveMemoryValidation";
  readonly name: "Assistant Executive Memory Validation";
  readonly phaseId: "ASSISTANT-2:4";
  readonly namespace: "nexora.assistant.executive-memory.validation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: "Validation";
  readonly readiness: "ReadyForManifest";
  readonly sourceModel: "ASSISTANT-2:3/ExecutiveMemoryModel";
  readonly metadataOnly: true;
  readonly immutable: true;
}
