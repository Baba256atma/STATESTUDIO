export type ExecutiveIntentRegistryId = `eng-3-registry-${string}`;
export type ExecutiveRegistryGroup = "IntentTypes" | "Goals" | "BusinessDomains" | "Capabilities" | "OutputExpectations" | "LifecycleStages" | "Priorities" | "ConfidenceLevels" | "Statuses";
export type ExecutiveRegistryOwner = "ENG-3";
export type ExecutiveRegistryCategory = "Intent" | "Goal" | "Domain" | "Capability" | "Output" | "Lifecycle" | "Priority" | "Confidence" | "Status";
export type ExecutiveRegistryVersion = "1.0.0";
export type ExecutiveRegistryStatus = "Published";

export interface ExecutiveRegistryEntry {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly status: "Approved";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRegistryCompatibility {
  readonly foundation: "ENG-3:1";
  readonly engineLayer: "Compatible";
  readonly ownershipSafe: true;
  readonly collisionSafe: true;
  readonly publicApiOnly: true;
}

export interface ExecutiveRegistryCollection {
  readonly id: ExecutiveIntentRegistryId;
  readonly group: ExecutiveRegistryGroup;
  readonly category: ExecutiveRegistryCategory;
  readonly owner: ExecutiveRegistryOwner;
  readonly version: ExecutiveRegistryVersion;
  readonly entries: readonly ExecutiveRegistryEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRegistryMetadata {
  readonly platformId: "ENG-3:2";
  readonly name: "Executive Intent Resolution Registry Platform";
  readonly namespace: "nexora.engine.executive.intent-resolution.registry";
  readonly owner: ExecutiveRegistryOwner;
  readonly version: ExecutiveRegistryVersion;
  readonly status: ExecutiveRegistryStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveRegistryManifest {
  readonly ownership: ExecutiveRegistryOwner;
  readonly registryGroups: readonly ExecutiveRegistryCollection[];
  readonly dependencies: readonly string[];
  readonly visibility: "Public";
  readonly compatibility: ExecutiveRegistryCompatibility;
  readonly version: ExecutiveRegistryVersion;
  readonly certificationState: "Uncertified";
  readonly stability: "Draft";
  readonly publicationState: ExecutiveRegistryStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveRegistryPlatform {
  readonly intentRegistry: ExecutiveRegistryCollection;
  readonly domainRegistry: ExecutiveRegistryCollection;
  readonly capabilityRegistry: ExecutiveRegistryCollection;
  readonly manifest: ExecutiveRegistryManifest;
  readonly metadata: ExecutiveRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
