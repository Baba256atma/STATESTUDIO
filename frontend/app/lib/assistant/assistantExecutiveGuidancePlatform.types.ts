/** ASSISTANT-4:6 — Readonly metadata types for Executive Guidance Platform. */
export interface AssistantExecutiveGuidancePlatformDeclaration {
  readonly id: string;
  readonly name: string;
  readonly state: "Published" | "Guaranteed" | "Compatible";
  readonly sourceManifest: "ASSISTANT-4:5/ExecutiveGuidanceManifest";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidancePlatformIdentityMetadata {
  readonly id: "ASSISTANT-4:6/ExecutiveGuidancePlatform";
  readonly name: "Assistant Executive Guidance Platform";
  readonly phaseId: "ASSISTANT-4:6";
  readonly namespace: "nexora.assistant.executive-guidance.platform";
  readonly version: "1.0.0";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly sourceManifest: "ASSISTANT-4:5/ExecutiveGuidanceManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
}
