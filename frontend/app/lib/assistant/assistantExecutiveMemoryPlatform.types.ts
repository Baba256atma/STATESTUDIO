/** ASSISTANT-2:6 — Readonly metadata types for Executive Memory Platform. */
export interface AssistantExecutiveMemoryPlatformDeclaration {
  readonly id: string;
  readonly name: string;
  readonly state: "Published" | "Guaranteed" | "Compatible";
  readonly sourceManifest: "ASSISTANT-2:5/ExecutiveMemoryManifest";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryPlatformIdentityMetadata {
  readonly id: "ASSISTANT-2:6/ExecutiveMemoryPlatform";
  readonly name: "Assistant Executive Memory Platform";
  readonly phaseId: "ASSISTANT-2:6";
  readonly namespace: "nexora.assistant.executive-memory.platform";
  readonly version: "1.0.0";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly sourceManifest: "ASSISTANT-2:5/ExecutiveMemoryManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
}
