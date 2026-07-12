export interface ExecutiveRequestIntentManifestMetadata {
  readonly id: "ENG-2:5";
  readonly version: "1.0.0";
  readonly namespace: "nexora.engine.executive.request-intent.manifest";
  readonly phase: "Manifest";
  readonly owner: "ENG-2";
  readonly description: string;
  readonly releaseStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentPhase {
  readonly phaseId: "ENG-2:1" | "ENG-2:2" | "ENG-2:3" | "ENG-2:4" | "ENG-2:5";
  readonly name: string;
  readonly namespace: string;
  readonly version: "1.0.0";
  readonly status: "Complete" | "Active";
  readonly ownership: "ENG-2";
  readonly publicIndexReference: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentDependency {
  readonly id: `eng-2-dependency-${string}`;
  readonly source: string;
  readonly target: string;
  readonly dependencyType: "ApprovedPublicIndex" | "FutureArchitecturalReference";
  readonly publicIndexReference: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentPublicSurface {
  readonly namespace: "nexora.engine.executive.request-intent.public";
  readonly apiInventory: readonly Readonly<{ phase: "ENG-2:1" | "ENG-2:2" | "ENG-2:3" | "ENG-2:4"; publicIndex: string; exports: readonly string[] }>[];
  readonly apiOwnership: "ENG-2";
  readonly apiStability: "StableDraft";
  readonly exportPolicy: "ExplicitOnly";
  readonly collisionPolicy: "ExecutiveRequestIntentPrefix";
  readonly antiDuplicationPolicy: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentSummary {
  readonly phaseCount: 5;
  readonly completedPhaseCount: 4;
  readonly dependencyCount: 4;
  readonly futureReferenceCount: 4;
  readonly publicApiCount: 36;
  readonly validationGroupCount: 5;
  readonly validationRuleCount: 41;
  readonly releaseStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveRequestIntentManifest {
  readonly metadata: ExecutiveRequestIntentManifestMetadata;
  readonly foundation: object;
  readonly registry: object;
  readonly model: object;
  readonly validation: object;
  readonly phaseRegistry: readonly ExecutiveRequestIntentPhase[];
  readonly dependencyMap: Readonly<{ approvedDependencies: readonly ExecutiveRequestIntentDependency[]; futureReferences: readonly ExecutiveRequestIntentDependency[] }>;
  readonly publicSurface: ExecutiveRequestIntentPublicSurface;
  readonly dependencySummary: Readonly<{ approvedDependencyCount: 4; futureReferenceCount: 4; policy: "PublicIndicesOnly" }>;
  readonly phaseSummary: Readonly<{ phaseCount: 5; completedPhaseCount: 4; activePhase: "ENG-2:5" }>;
  readonly publicApiSummary: Readonly<{ apiCount: 36; exportPolicy: "ExplicitOnly" }>;
  readonly validationSummary: Readonly<{ groupCount: 5; ruleCount: 41; status: "Defined" }>;
  readonly ownershipSummary: Readonly<{ owner: "ENG-2"; collisionSafe: true; previousPhasesUnchanged: true; phaseOverwriteProhibited: true }>;
  readonly summary: ExecutiveRequestIntentSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
