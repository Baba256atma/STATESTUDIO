export interface WorkflowPlatformPhaseEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly phaseStatus: string;
  readonly publicEntryPoint: string;
  readonly metadataOnly: true;
}

export interface WorkflowPlatformDependencyEntry {
  readonly sourcePhaseId: string;
  readonly targetPhaseId: string;
  readonly dependencyType: "PublicApi";
  readonly relationship: string;
  readonly metadataOnly: true;
}

export interface WorkflowPlatformPublicSurfaceEntry {
  readonly exportName: string;
  readonly phaseId: string;
  readonly exportKind: "Object" | "Function" | "Constant" | "TypeGroup";
  readonly stability: "Stable";
  readonly metadataOnly: true;
}

export interface WorkflowPlatformManifestDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly releaseReadiness: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
