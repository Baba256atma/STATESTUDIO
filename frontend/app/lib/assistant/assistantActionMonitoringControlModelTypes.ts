/** ASSISTANT-9:3 — Readonly metadata types for Monitoring & Control Model. */

export type AssistantActionMonitoringControlModelStatus = "Model";
export type AssistantActionMonitoringControlModelReadiness =
  "ReadyForValidation";

export interface AssistantActionMonitoringControlDomainModelMetadata {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly parentRegistryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly lifecycleReference: "ASSISTANT-9:3/Lifecycle";
  readonly compatibility: "ASSISTANT-9 Registry Compatible";
  readonly policyReference: string;
  readonly relationshipReferences: readonly string[];
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantActionMonitoringControlRelationshipMetadata {
  readonly id: string;
  readonly source: string;
  readonly relationshipType: string;
  readonly target: string;
  readonly description: string;
  readonly registryReference: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantActionMonitoringControlStateModelMetadata {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly parentRegistryReference: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
