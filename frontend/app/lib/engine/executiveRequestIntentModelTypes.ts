export type ExecutiveRequestIntentModelNamespace = "nexora.engine.executive.request-intent.model";
export type ExecutiveRequestIntentModelVersion = "1.0.0";

export interface ExecutiveRequestIntentModelDescriptor {
  readonly id: `eng-2-model-${string}`;
  readonly name: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly namespace: ExecutiveRequestIntentModelNamespace;
  readonly version: ExecutiveRequestIntentModelVersion;
  readonly ownerPhase: "ENG-2:3";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentRequestModel extends ExecutiveRequestIntentModelDescriptor {
  readonly kind: "RequestModel";
  readonly registryReferences: readonly string[];
}

export interface ExecutiveRequestIntentIntentModel extends ExecutiveRequestIntentModelDescriptor {
  readonly kind: "IntentModel";
  readonly ownership: Readonly<{ genericConceptOwner: "ENG-1"; specializedModelOwner: "ENG-2" }>;
}

export interface ExecutiveRequestIntentClassificationModel extends ExecutiveRequestIntentModelDescriptor {
  readonly kind: "ClassificationModel";
  readonly dimensions: readonly string[];
}

export interface ExecutiveRequestIntentContextModel extends ExecutiveRequestIntentModelDescriptor {
  readonly kind: "ContextModel";
  readonly contextTypes: readonly string[];
}

export interface ExecutiveRequestIntentMetadataModel extends ExecutiveRequestIntentModelDescriptor {
  readonly kind: "MetadataModel";
  readonly architecturalStability: "Foundation";
  readonly releaseStatus: "Draft";
}

export interface ExecutiveRequestIntentLifecycleModel extends ExecutiveRequestIntentModelDescriptor {
  readonly kind: "LifecycleModel";
  readonly stages: readonly string[];
}

export interface ExecutiveRequestIntentRelationshipDescriptor {
  readonly id: `eng-2-relationship-${string}`;
  readonly source: "Request" | "Intent";
  readonly target: "Intent" | "Context" | "Classification" | "Metadata" | "Registry";
  readonly relationship: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentRelationshipModel extends ExecutiveRequestIntentModelDescriptor {
  readonly kind: "RelationshipModel";
  readonly relationships: readonly ExecutiveRequestIntentRelationshipDescriptor[];
}

export interface ExecutiveRequestIntentModelSummary {
  readonly modelCount: 7;
  readonly relationshipCount: 5;
  readonly dependencyCount: 2;
  readonly namespace: ExecutiveRequestIntentModelNamespace;
  readonly version: ExecutiveRequestIntentModelVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveRequestIntentModelManifest {
  readonly id: "ENG-2:3";
  readonly name: "Executive Request & Intent Model Manifest";
  readonly models: readonly ExecutiveRequestIntentModelDescriptor[];
  readonly namespace: ExecutiveRequestIntentModelNamespace;
  readonly version: ExecutiveRequestIntentModelVersion;
  readonly dependencyReferences: readonly Readonly<{ phase: "ENG-2:1" | "ENG-2:2"; publicIndex: string; reference: object }>[];
  readonly ownershipReferences: readonly string[];
  readonly architecturalSummary: ExecutiveRequestIntentModelSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
