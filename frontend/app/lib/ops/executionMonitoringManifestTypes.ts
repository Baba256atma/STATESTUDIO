export interface ExecutionMonitoringManifestDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringManifestSummary {
  readonly phaseCount: number;
  readonly dependencyCount: number;
  readonly publicApiCount: number;
  readonly compatibilityStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringPhaseEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly phaseStatus: string;
  readonly description: string;
  readonly metadata: Readonly<{ metadataOnly: true; immutable: true; deterministic: true }>;
  readonly metadataOnly: true;
}

export interface ExecutionMonitoringPlatformDependencyEntry {
  readonly sourcePhaseId: string;
  readonly targetPhaseId: string;
  readonly dependencyType: "PublicApi";
  readonly relationship: string;
  readonly scope: "Internal" | "CrossPlatformCompatibility";
  readonly metadataOnly: true;
}

export interface ExecutionMonitoringPublicSurfaceEntry {
  readonly exportName: string;
  readonly phaseId: string;
  readonly exportKind: "Object" | "Function" | "Constant" | "TypeGroup";
  readonly stability: "Stable";
  readonly metadataOnly: true;
}
