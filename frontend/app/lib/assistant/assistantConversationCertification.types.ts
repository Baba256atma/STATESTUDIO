/** ASSISTANT-1:7 — Readonly metadata types for Conversation Certification. */
export interface AssistantConversationCertificationCriterionMetadata {
  readonly criterionId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly status: "Certified";
  readonly target: "ASSISTANT-1:6/ConversationPlatform";
  readonly expectedResult: "Certified";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationCertificationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationCertificationResultMetadata {
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

export interface AssistantConversationCertificationIdentityMetadata {
  readonly id: "ASSISTANT-1:7/ConversationCertification";
  readonly name: "Assistant Conversation Certification";
  readonly phaseId: "ASSISTANT-1:7";
  readonly namespace: "nexora.assistant.conversation.certification";
  readonly version: "1.0.0";
  readonly status: "Certification";
  readonly readiness: "ReadyForFreeze";
  readonly sourcePlatform: "ASSISTANT-1:6/ConversationPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}
