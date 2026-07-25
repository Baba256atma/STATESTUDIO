/** ASSISTANT-4:7 — Readonly metadata types for Executive Guidance Certification. */
export interface AssistantExecutiveGuidanceCertificationCriterionMetadata {
  readonly criterionId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly status: "Certified";
  readonly validationTarget: "ASSISTANT-4:6/ExecutiveGuidancePlatform";
  readonly expectedResult: "Certified";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceCertificationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceCertificationResultMetadata {
  readonly certificationStatus: "Certified";
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly passed: number;
  readonly failed: 0;
  readonly warnings: 0;
  readonly readiness: "ReadyForFreeze";
  readonly freezeEligibility: "Eligible";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceCertificationIdentityMetadata {
  readonly id: "ASSISTANT-4:7/ExecutiveGuidanceCertification";
  readonly name: "Assistant Executive Guidance Certification";
  readonly phaseId: "ASSISTANT-4:7";
  readonly namespace: "nexora.assistant.executive-guidance.certification";
  readonly version: "1.0.0";
  readonly status: "Certification";
  readonly readiness: "ReadyForFreeze";
  readonly sourcePlatform: "ASSISTANT-4:6/ExecutiveGuidancePlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}
