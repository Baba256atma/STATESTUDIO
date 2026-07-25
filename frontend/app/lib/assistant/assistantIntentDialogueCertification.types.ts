/** ASSISTANT-3:7 — Readonly metadata types for Intent & Dialogue Certification. */
export interface AssistantIntentDialogueCertificationCriterionMetadata {
  readonly criterionId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly status: "Certified";
  readonly validationTarget: "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform";
  readonly expectedResult: "Certified";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueCertificationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueCertificationResultMetadata {
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

export interface AssistantIntentDialogueCertificationIdentityMetadata {
  readonly id: "ASSISTANT-3:7/IntentDialogueUnderstandingCertification";
  readonly name: "Assistant Intent & Dialogue Understanding Certification";
  readonly phaseId: "ASSISTANT-3:7";
  readonly namespace: "nexora.assistant.intent-dialogue.certification";
  readonly version: "1.0.0";
  readonly status: "Certification";
  readonly readiness: "ReadyForFreeze";
  readonly sourcePlatform: "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}
