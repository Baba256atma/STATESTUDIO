/** ASSISTANT-2:7 — Readonly metadata types for Executive Memory Certification. */
export interface AssistantExecutiveMemoryCertificationCriterionMetadata {
  readonly criterionId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly status: "Certified";
  readonly validationTarget: "ASSISTANT-2:6/ExecutiveMemoryPlatform";
  readonly expectedResult: "Certified";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryCertificationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryCertificationResultMetadata {
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

export interface AssistantExecutiveMemoryCertificationIdentityMetadata {
  readonly id: "ASSISTANT-2:7/ExecutiveMemoryCertification";
  readonly name: "Assistant Executive Memory Certification";
  readonly phaseId: "ASSISTANT-2:7";
  readonly namespace: "nexora.assistant.executive-memory.certification";
  readonly version: "1.0.0";
  readonly status: "Certification";
  readonly readiness: "ReadyForFreeze";
  readonly sourcePlatform: "ASSISTANT-2:6/ExecutiveMemoryPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}
