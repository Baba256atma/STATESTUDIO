export interface ResourcePlatformPhaseEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly phaseStatus: string;
  readonly publicEntryPoint: string;
  readonly metadataOnly: true;
}

export interface ResourcePlatformDependencyEntry {
  readonly sourcePhaseId: string;
  readonly targetPhaseId: string;
  readonly dependencyType: "PublicApi";
  readonly relationship: string;
  readonly metadataOnly: true;
}

export interface ResourcePlatformPublicSurfaceEntry {
  readonly exportName: string;
  readonly phaseId: string;
  readonly exportKind: "Object" | "Function" | "Constant" | "TypeGroup";
  readonly stability: "Stable";
  readonly metadataOnly: true;
}

export interface ResourcePlatformManifestDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly releaseReadiness: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
