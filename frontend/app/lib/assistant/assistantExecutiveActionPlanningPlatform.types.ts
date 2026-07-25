/** ASSISTANT-7:6 — Readonly metadata types for Executive Action Planning Platform. */
export interface AssistantExecutiveActionPlanningPlatformCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly architecturalResponsibility: string;
  readonly sourceManifest: "ASSISTANT-7:5/ExecutiveActionPlanningManifest";
  readonly version: "1.0.0";
  readonly status: "Published";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningPlatformDeclaration {
  readonly id: string;
  readonly name: string;
  readonly state: "Guaranteed" | "Compatible";
  readonly sourceManifest: "ASSISTANT-7:5/ExecutiveActionPlanningManifest";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningPlatformIdentityMetadata {
  readonly id: "ASSISTANT-7:6/ExecutiveActionPlanningPlatform";
  readonly name: "Assistant Executive Action Planning Platform";
  readonly phaseId: "ASSISTANT-7:6";
  readonly namespace: "nexora.assistant.executive-action-planning.platform";
  readonly version: "1.0.0";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly sourceManifest: "ASSISTANT-7:5/ExecutiveActionPlanningManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
}
