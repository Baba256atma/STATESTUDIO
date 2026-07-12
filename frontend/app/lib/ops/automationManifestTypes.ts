export interface AutomationManifestDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly releaseReadiness: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationManifestSummary {
  readonly phaseCount: number;
  readonly dependencyCount: number;
  readonly publicApiCount: number;
  readonly compatibilityStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationPhaseEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly phaseStatus: string;
  readonly description: string;
  readonly metadataOnly: true;
}

export interface AutomationPlatformDependencyEntry {
  readonly sourcePhaseId: string;
  readonly targetPhaseId: string;
  readonly dependencyType: "PublicApi";
  readonly relationship: string;
  readonly metadataOnly: true;
}

export interface AutomationPublicSurfaceEntry {
  readonly exportName: string;
  readonly phaseId: string;
  readonly exportKind: "Object" | "Function" | "Constant" | "TypeGroup";
  readonly stability: "Stable";
  readonly metadataOnly: true;
}
