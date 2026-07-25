/** ASSISTANT-6:6 — Readonly metadata types for Object & Context Management Platform. */
export interface AssistantObjectContextManagementPlatformDeclaration {
  readonly id: string;
  readonly name: string;
  readonly state: "Published" | "Guaranteed" | "Compatible";
  readonly sourceManifest: "ASSISTANT-6:5/ObjectContextManagementManifest";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementPlatformIdentityMetadata {
  readonly id: "ASSISTANT-6:6/ObjectContextManagementPlatform";
  readonly name: "Assistant Object & Context Management Platform";
  readonly phaseId: "ASSISTANT-6:6";
  readonly namespace: "nexora.assistant.object-context-management.platform";
  readonly version: "1.0.0";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly sourceManifest: "ASSISTANT-6:5/ObjectContextManagementManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
}
