export type ExecutiveContextRegistryOwner = "ENG-4";
export type ExecutiveContextRegistryVersion = "1.0.0";
export type ExecutiveContextRegistryPhase = "ENG-4:2";
export type ExecutiveContextRegistryNamespace = "nexora.engine.executive.context-assembly.registry";

export type ExecutiveContextRegistryGroup =
  | "ContextDomains"
  | "ContextSources"
  | "ContextCapabilities"
  | "LifecycleStages"
  | "ArchitecturalContracts"
  | "Ownership"
  | "PublicApis";

export type ExecutiveContextRegistryCategory =
  | "Domain"
  | "Source"
  | "Capability"
  | "Lifecycle"
  | "Contract"
  | "Ownership"
  | "PublicApi";

export type ExecutiveContextRegistryStatusLabel =
  | "Registry"
  | "MetadataOnly"
  | "Immutable"
  | "RuntimeFree"
  | "Deterministic";

export interface ExecutiveContextRegistryEntry {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextLifecycleRegistryEntry extends ExecutiveContextRegistryEntry {
  readonly order: number;
}

export interface ExecutiveContextOwnershipRegistryEntry {
  readonly id: string;
  readonly group: ExecutiveContextRegistryGroup;
  readonly category: ExecutiveContextRegistryCategory;
  readonly owner: ExecutiveContextRegistryOwner;
  readonly ownedArtifact: string;
  readonly description: string;
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextRegistryCollection<TEntry = ExecutiveContextRegistryEntry> {
  readonly id: string;
  readonly group: ExecutiveContextRegistryGroup;
  readonly category: ExecutiveContextRegistryCategory;
  readonly owner: ExecutiveContextRegistryOwner;
  readonly version: ExecutiveContextRegistryVersion;
  readonly namespace: ExecutiveContextRegistryNamespace;
  readonly entries: readonly TEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextRegistryDependency {
  readonly phase: "ENG-1" | "ENG-2" | "ENG-3" | "ENG-4:1";
  readonly publicIndex: string;
  readonly consumption: "PublicIndexOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextRegistryMetadata {
  readonly registryId: "ENG-4:2";
  readonly registryVersion: ExecutiveContextRegistryVersion;
  readonly registryName: "Executive Context Assembly Registry";
  readonly namespace: ExecutiveContextRegistryNamespace;
  readonly phase: ExecutiveContextRegistryPhase;
  readonly owner: ExecutiveContextRegistryOwner;
  readonly status: Readonly<{
    registry: "Registry";
    metadataOnly: "MetadataOnly";
    immutable: "Immutable";
    runtimeFree: "RuntimeFree";
    deterministic: "Deterministic";
  }>;
  readonly nextPhase: "ENG-4:3";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextAssemblyRegistryAggregate {
  readonly domains: ExecutiveContextRegistryCollection;
  readonly sources: ExecutiveContextRegistryCollection;
  readonly capabilities: ExecutiveContextRegistryCollection;
  readonly lifecycle: ExecutiveContextRegistryCollection<ExecutiveContextLifecycleRegistryEntry>;
  readonly ownership: ExecutiveContextRegistryCollection<ExecutiveContextOwnershipRegistryEntry>;
  readonly metadata: ExecutiveContextRegistryMetadata;
  readonly dependencies: readonly ExecutiveContextRegistryDependency[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextAssemblyRegistrySummary {
  readonly registryId: "ENG-4:2";
  readonly phase: ExecutiveContextRegistryPhase;
  readonly namespace: ExecutiveContextRegistryNamespace;
  readonly owner: ExecutiveContextRegistryOwner;
  readonly domainCount: number;
  readonly sourceCount: number;
  readonly capabilityCount: number;
  readonly lifecycleStageCount: number;
  readonly ownershipCount: number;
  readonly dependencyCount: number;
  readonly nextPhase: "ENG-4:3";
  readonly modelReady: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
