/** ASSISTANT-6:7 — Readonly metadata types for Object & Context Management Certification. */
export interface AssistantObjectContextManagementCertificationCriterionMetadata {
  readonly criterionId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly status: "Certified";
  readonly validationTarget: "ASSISTANT-6:6/ObjectContextManagementPlatform";
  readonly expectedResult: "Certified";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementCertificationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementCertificationResultMetadata {
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

export interface AssistantObjectContextManagementCertificationIdentityMetadata {
  readonly id: "ASSISTANT-6:7/ObjectContextManagementCertification";
  readonly name: "Assistant Object & Context Management Certification";
  readonly phaseId: "ASSISTANT-6:7";
  readonly namespace:
    "nexora.assistant.object-context-management.certification";
  readonly version: "1.0.0";
  readonly status: "Certification";
  readonly readiness: "ReadyForFreeze";
  readonly sourcePlatform: "ASSISTANT-6:6/ObjectContextManagementPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}
