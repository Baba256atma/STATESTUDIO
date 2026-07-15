export type ExecutiveContextModelOwner = "ENG-4";
export type ExecutiveContextModelVersion = "1.0.0";
export type ExecutiveContextModelPhase = "ENG-4:3";
export type ExecutiveContextModelNamespace = "nexora.engine.executive.context-assembly.model";

export interface ExecutiveContextStructuralFieldModel {
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextModelDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly owner: ExecutiveContextModelOwner;
  readonly phase: ExecutiveContextModelPhase;
  readonly namespace: ExecutiveContextModelNamespace;
  readonly version: ExecutiveContextModelVersion;
  readonly status: Readonly<{
    model: "Model";
    metadataOnly: "MetadataOnly";
    immutable: "Immutable";
    runtimeFree: "RuntimeFree";
    deterministic: "Deterministic";
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextCanonicalModel extends ExecutiveContextModelDescriptor {
  readonly id: "eng-4-model-executive-context";
  readonly structuralModels: Readonly<{
    source: ExecutiveContextStructuralFieldModel;
    scope: ExecutiveContextStructuralFieldModel;
    version: ExecutiveContextStructuralFieldModel;
    summary: ExecutiveContextStructuralFieldModel;
    reference: ExecutiveContextStructuralFieldModel;
  }>;
  readonly registryReferences: Readonly<{
    domains: object;
    sources: object;
    lifecycle: object;
  }>;
}

export interface ExecutiveContextDomainModelDescriptor extends ExecutiveContextModelDescriptor {
  readonly id: "eng-4-model-context-domain";
  readonly domainFields: Readonly<{
    domainId: "domainId";
    domainName: "domainName";
    category: "category";
    owner: "owner";
    description: "description";
    visibility: "visibility";
  }>;
  readonly registryReference: object;
}

export interface ExecutiveContextSnapshotModelDescriptor extends ExecutiveContextModelDescriptor {
  readonly id: "eng-4-model-context-snapshot";
  readonly snapshotFields: Readonly<{
    snapshotId: "snapshotId";
    timestampMetadata: "timestampMetadata";
    includedDomains: "includedDomains";
    includedSources: "includedSources";
    snapshotVersion: "snapshotVersion";
    snapshotStatus: "snapshotStatus";
  }>;
  readonly storesData: false;
}

export interface ExecutiveContextCompositionModelDescriptor extends ExecutiveContextModelDescriptor {
  readonly id: "eng-4-model-context-composition";
  readonly compositionFields: Readonly<{
    compositionId: "compositionId";
    domains: "domains";
    sources: "sources";
    scope: "scope";
    relationships: "relationships";
    metadata: "metadata";
  }>;
  readonly relationships: readonly Readonly<{
    id: string;
    name: string;
    description: string;
    metadataOnly: true;
    immutable: true;
  }>[];
}

export interface ExecutiveContextMetadataModelDescriptor extends ExecutiveContextModelDescriptor {
  readonly id: "eng-4-model-context-metadata";
  readonly modelVersion: ExecutiveContextModelVersion;
  readonly modelNamespace: ExecutiveContextModelNamespace;
  readonly modelOwner: ExecutiveContextModelOwner;
  readonly dependencies: readonly ExecutiveContextModelDependency[];
  readonly releaseMetadata: Readonly<{
    phase: ExecutiveContextModelPhase;
    releaseStatus: "Draft";
    nextPhase: "ENG-4:4";
    certificationState: "Uncertified";
    publicationState: "Published";
  }>;
}

export interface ExecutiveContextModelDependency {
  readonly phase: "ENG-1" | "ENG-2" | "ENG-3" | "ENG-4:1" | "ENG-4:2";
  readonly publicIndex: string;
  readonly consumption: "PublicIndexOnly";
  readonly artifact?: object;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextModelRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly model: ExecutiveContextModelDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextAssemblyModelAggregate {
  readonly executiveContext: ExecutiveContextCanonicalModel;
  readonly domain: ExecutiveContextDomainModelDescriptor;
  readonly snapshot: ExecutiveContextSnapshotModelDescriptor;
  readonly composition: ExecutiveContextCompositionModelDescriptor;
  readonly metadata: ExecutiveContextMetadataModelDescriptor;
  readonly modelRegistry: readonly ExecutiveContextModelRegistryEntry[];
  readonly dependencies: readonly ExecutiveContextModelDependency[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextAssemblyModelSummary {
  readonly modelId: "ENG-4:3";
  readonly phase: ExecutiveContextModelPhase;
  readonly namespace: ExecutiveContextModelNamespace;
  readonly owner: ExecutiveContextModelOwner;
  readonly modelCount: number;
  readonly dependencyCount: number;
  readonly structuralModelCount: number;
  readonly nextPhase: "ENG-4:4";
  readonly validationReady: true;
  readonly status: Readonly<{
    model: "Model";
    metadataOnly: "MetadataOnly";
    immutable: "Immutable";
    runtimeFree: "RuntimeFree";
    deterministic: "Deterministic";
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
