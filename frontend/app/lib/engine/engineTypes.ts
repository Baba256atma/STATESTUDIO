export type ExecutiveEngineResponsibility =
  | "request-interpretation"
  | "intent-coordination"
  | "reasoning-coordination"
  | "planning-coordination"
  | "orchestration-coordination"
  | "decision-coordination"
  | "platform-coordination"
  | "executive-awareness-coordination";

export type ExecutiveEnginePublicDependency = "CORE" | "CORE-TEN" | "BUS" | "OPS";

export interface ExecutiveEngineContractDescriptor {
  readonly id: string;
  readonly name: string;
  readonly responsibility: ExecutiveEngineResponsibility;
  readonly description: string;
  readonly status: "Defined";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveEngineRegistryDescriptor {
  readonly platformId: "ENG-1:1";
  readonly platformName: "Nexora Executive Engine";
  readonly platformNamespace: "nexora.engine.executive.foundation";
  readonly version: "1.0.0";
  readonly architecturalRole: "ExecutiveBrain";
  readonly releaseStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveEngineMetadataDescriptor {
  readonly identity: ExecutiveEngineRegistryDescriptor;
  readonly purpose: string;
  readonly responsibilities: readonly ExecutiveEngineResponsibility[];
  readonly publicDependencies: readonly ExecutiveEnginePublicDependency[];
  readonly boundaries: readonly string[];
  readonly publicApiSurface: readonly string[];
  readonly foundationStatus: "FoundationDefined";
  readonly releaseMetadata: Readonly<{ phase: "ENG-1:1"; stage: "Draft"; nextPhase: "ENG-1:2" }>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveEngineFoundationDescriptor {
  readonly contracts: readonly ExecutiveEngineContractDescriptor[];
  readonly registry: ExecutiveEngineRegistryDescriptor;
  readonly metadata: ExecutiveEngineMetadataDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
