/** ASSISTANT-9:2 — Readonly metadata types for Monitoring & Control Registry. */

export type AssistantActionMonitoringControlRegistryStatus = "Registry";
export type AssistantActionMonitoringControlRegistryReadiness =
  "ReadyForModel";

export interface AssistantActionMonitoringControlRegistryEntry {
  readonly id: string;
  readonly canonicalName: string;
  readonly displayName: string;
  readonly description: string;
  readonly registryGroup: string;
  readonly version: "1.0.0";
  readonly status: "Registered";
  readonly parentReference: string | null;
  readonly compatibility: "ASSISTANT-9 Foundation Compatible";
  readonly sourceFoundationReference: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantActionMonitoringControlRegistryRelationship {
  readonly id: string;
  readonly sourceGroup: string;
  readonly targetGroup: string;
  readonly relationshipType: "precedes";
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type AssistantActionMonitoringControlRegistryLookupMap =
  Readonly<Record<string, AssistantActionMonitoringControlRegistryEntry>>;
