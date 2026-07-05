export type BusinessPriorityLevel = "Critical" | "High" | "Medium" | "Future" | "Optional";
export type BusinessCertificationStageName = "Planned" | "Designed" | "Implemented" | "Validated" | "Certified" | "Frozen" | "Released";

export type BusinessRoadmapMetadata = Readonly<{
  readonly roadmapId: "BUS-ARCH-5";
  readonly architectureId: "BUS-ARCH";
  readonly roadmapVersion: "1.0.0";
  readonly purpose: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessImplementationWave = Readonly<{
  readonly waveId: string;
  readonly name: string;
  readonly order: number;
  readonly description: string;
  readonly targetPlatformIds: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessRoadmapMilestone = Readonly<{
  readonly milestoneId: string;
  readonly name: string;
  readonly implementationWaveId: string;
  readonly targetPlatformIds: readonly string[];
  readonly prerequisites: readonly string[];
  readonly expectedOutputs: readonly string[];
  readonly certificationRequirement: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessReleaseGroup = Readonly<{
  readonly releaseId: string;
  readonly includedPlatformIds: readonly string[];
  readonly dependencyRequirements: readonly string[];
  readonly certificationRequirements: readonly string[];
  readonly compatibilityRequirements: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessPlatformPriority = Readonly<{
  readonly priorityId: string;
  readonly platformId: string;
  readonly priority: BusinessPriorityLevel;
  readonly rationale: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessCertificationStage = Readonly<{
  readonly stageId: string;
  readonly stage: BusinessCertificationStageName;
  readonly order: number;
  readonly description: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessFutureExpansion = Readonly<{
  readonly expansionId: string;
  readonly name: string;
  readonly targetWaveId: string;
  readonly targetPlatformIds: readonly string[];
  readonly prerequisites: readonly string[];
  readonly strategy: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessSuiteRoadmapManifest = Readonly<{
  readonly architectureId: "BUS-ARCH";
  readonly roadmapVersion: "1.0.0";
  readonly implementationWaves: readonly BusinessImplementationWave[];
  readonly milestoneCatalog: readonly BusinessRoadmapMilestone[];
  readonly platformPriorityCatalog: readonly BusinessPlatformPriority[];
  readonly releaseGroups: readonly BusinessReleaseGroup[];
  readonly certificationStages: readonly BusinessCertificationStage[];
  readonly futureExpansionCatalog: readonly BusinessFutureExpansion[];
  readonly metadata: BusinessRoadmapMetadata;
  readonly deterministicFingerprint: string;
}>;

export type BusinessSuiteRoadmapValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;
