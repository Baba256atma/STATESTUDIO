/** ASSISTANT-7:7 — Readonly metadata types for Executive Action Planning Certification. */
export interface AssistantExecutiveActionPlanningCertificationCriterionMetadata {
  readonly criterionId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly validationTarget: "ASSISTANT-7:6/ExecutiveActionPlanningPlatform";
  readonly expectedResult: "Certified";
  readonly version: "1.0.0";
  readonly status: "Certified";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningCertificationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningCertificationResultMetadata {
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

export interface AssistantExecutiveActionPlanningCertificationIdentityMetadata {
  readonly id: "ASSISTANT-7:7/ExecutiveActionPlanningCertification";
  readonly name: "Assistant Executive Action Planning Certification";
  readonly phaseId: "ASSISTANT-7:7";
  readonly namespace:
    "nexora.assistant.executive-action-planning.certification";
  readonly version: "1.0.0";
  readonly status: "Certification";
  readonly readiness: "ReadyForFreeze";
  readonly sourcePlatform: "ASSISTANT-7:6/ExecutiveActionPlanningPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}
