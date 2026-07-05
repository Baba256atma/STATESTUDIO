export type BusinessArchitectureVersion = Readonly<{
  readonly versionId: "BUS-ARCH-1";
  readonly version: "1.0.0";
  readonly releaseState: "Architecture Foundation";
  readonly deterministic: boolean;
}>;

export type BusinessPlatformCategory =
  | "Strategic"
  | "Operational"
  | "Financial"
  | "Commercial"
  | "Human Capital"
  | "Manufacturing"
  | "Supply Chain"
  | "Customer"
  | "Innovation"
  | "Governance"
  | "Analytics"
  | "Executive"
  | "Support"
  | "Infrastructure"
  | "Future";

export type BusinessArchitectureLayer = Readonly<{
  readonly layerId: string;
  readonly layerName: string;
  readonly order: number;
  readonly description: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessPlatformDefinition = Readonly<{
  readonly platformId: string;
  readonly platformName: string;
  readonly category: BusinessPlatformCategory;
  readonly description: string;
  readonly architectureLayerId: string;
  readonly futurePlatform: boolean;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessArchitecturePrinciple = Readonly<{
  readonly principleId: string;
  readonly principleName: string;
  readonly description: string;
  readonly required: boolean;
  readonly metadataOnly: boolean;
}>;

export type BusinessArchitectureRule = Readonly<{
  readonly ruleId: string;
  readonly ruleName: string;
  readonly ruleType: "Must" | "Must Not";
  readonly description: string;
  readonly metadataOnly: boolean;
}>;

export type BusinessArchitectureMetadata = Readonly<{
  readonly architectureId: "BUS-ARCH";
  readonly architectureName: "Business Suite Master Architecture";
  readonly purpose: string;
  readonly certificationState: "Ready for BUS-ARCH-2";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessSuiteArchitecture = Readonly<{
  readonly metadata: BusinessArchitectureMetadata;
  readonly version: BusinessArchitectureVersion;
  readonly platforms: readonly BusinessPlatformDefinition[];
  readonly layers: readonly BusinessArchitectureLayer[];
  readonly categories: readonly BusinessPlatformCategory[];
  readonly principles: readonly BusinessArchitecturePrinciple[];
  readonly rules: readonly BusinessArchitectureRule[];
  readonly namingConventions: readonly string[];
  readonly deterministicFingerprint: string;
}>;

export type BusinessSuiteArchitectureValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;
