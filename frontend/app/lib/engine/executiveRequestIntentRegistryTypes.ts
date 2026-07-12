export type RegistryEntryId = `eng-request-${string}`;
export type RegistryGroupId = "category" | "intent" | "priority" | "status" | "scope" | "source" | "classification" | "context";
export type RegistryNamespace = "nexora.engine.executive.request-intent.registry";
export type RegistryVersion = "1.0.0";

export interface RegistryMetadata {
  readonly id: RegistryEntryId;
  readonly groupId: RegistryGroupId;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly namespace: RegistryNamespace;
  readonly version: RegistryVersion;
  readonly status: "Approved";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface RegistrySummary {
  readonly registryCount: 8;
  readonly entryCount: number;
  readonly namespace: RegistryNamespace;
  readonly version: RegistryVersion;
  readonly phase: "ENG-2:2";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface RegistryCollection {
  readonly groupId: RegistryGroupId;
  readonly name: string;
  readonly entryCount: number;
  readonly entries: readonly RegistryMetadata[];
  readonly namespace: RegistryNamespace;
  readonly version: RegistryVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentRegistryManifestDescriptor {
  readonly metadata: Readonly<{
    id: "ENG-2:2";
    name: "Executive Request & Intent Registry";
    namespace: RegistryNamespace;
    version: RegistryVersion;
    releaseStatus: "Draft";
    metadataOnly: true;
    immutable: true;
    deterministic: true;
  }>;
  readonly inventory: readonly RegistryCollection[];
  readonly approvedNamespace: RegistryNamespace;
  readonly version: RegistryVersion;
  readonly summary: RegistrySummary;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
