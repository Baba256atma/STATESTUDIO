export type ExecutiveEngineLifecycleStatus = "planned" | "active" | "certified" | "frozen" | "released";
export type ExecutiveEnginePublicDependencyId = "CORE" | "CORE-TEN" | "BUS" | "OPS";

export interface ExecutiveEngineCapabilityRegistryEntry {
  readonly id: string; readonly name: string; readonly description: string;
  readonly ownership: "ExecutiveEngine"; readonly status: "Architectural";
  readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveEngineComponentRegistryEntry {
  readonly id: string; readonly name: string; readonly description: string;
  readonly ownership: "ExecutiveEngine"; readonly lifecycleStatus: ExecutiveEngineLifecycleStatus;
  readonly publicVisibility: true; readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveEngineDependencyRegistryEntry {
  readonly id: ExecutiveEnginePublicDependencyId; readonly name: string;
  readonly dependencyType: "PublicApi"; readonly ownership: "ExternalPublicLayer";
  readonly circularDependencyAllowed: false; readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveEngineLifecycleRegistryEntry {
  readonly id: ExecutiveEngineLifecycleStatus; readonly name: string;
  readonly order: number; readonly description: string; readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveEngineRegistryManifestDescriptor {
  readonly registryId: "ENG-1:2";
  readonly capabilityRegistry: readonly ExecutiveEngineCapabilityRegistryEntry[];
  readonly componentRegistry: readonly ExecutiveEngineComponentRegistryEntry[];
  readonly dependencyRegistry: readonly ExecutiveEngineDependencyRegistryEntry[];
  readonly lifecycleRegistry: readonly ExecutiveEngineLifecycleRegistryEntry[];
  readonly currentLifecycle: Readonly<{ phaseId: "ENG-1:2"; status: "active"; metadataOnly: true }>;
  readonly metadata: object;
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
