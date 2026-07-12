export type FinanceManifestPhaseId =
  | "BUS-28:1"
  | "BUS-28:2"
  | "BUS-28:3"
  | "BUS-28:4"
  | "BUS-28:5";

export type FinanceReleaseStatus = "Draft";

export type FinanceCompatibilityStatus = "Compatible";

export type FinancePhaseRegistryEntry = Readonly<{
  readonly phaseId: FinanceManifestPhaseId;
  readonly name: string;
  readonly version: "1.0.0";
  readonly status: "Foundation" | "Registry" | "Model" | "Validation" | "Manifest";
  readonly dependencies: readonly FinanceManifestPhaseId[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceCompatibilityEntry = Readonly<{
  readonly source: Exclude<FinanceManifestPhaseId, "BUS-28:5">;
  readonly target: Exclude<FinanceManifestPhaseId, "BUS-28:5">;
  readonly status: FinanceCompatibilityStatus;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceCompatibilityMatrix = Readonly<{
  readonly matrixId: "finance-compatibility-matrix";
  readonly entries: readonly FinanceCompatibilityEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceDependencyMatrixEntry = Readonly<{
  readonly consumedPhase: Exclude<FinanceManifestPhaseId, "BUS-28:5">;
  readonly provider: string;
  readonly dependencyType: "public-api";
  readonly publicApiBoundary: string;
  readonly compatibilityStatus: FinanceCompatibilityStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceDependencyMatrix = Readonly<{
  readonly matrixId: "finance-dependency-matrix";
  readonly entries: readonly FinanceDependencyMatrixEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceExtensionPolicy = Readonly<{
  readonly policyId: "finance-extension-policy";
  readonly allowedExtensions: readonly [
    "Financial Platform",
    "Financial Certification",
    "Financial Freeze",
    "Financial Public Index",
  ];
  readonly prohibitedModifications: readonly string[];
  readonly publicApiStability: "stable";
  readonly backwardCompatibilityPolicy: "required";
  readonly semanticVersionExpectations: "semantic-versioning";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceManifestSummary = Readonly<{
  readonly entityCount: number;
  readonly registryCount: number;
  readonly relationshipCount: number;
  readonly validationCount: number;
  readonly publicApiCount: number;
  readonly dependencyCount: number;
  readonly compatibilityStatus: FinanceCompatibilityStatus;
  readonly certificationReadiness: "Ready" | "NotReady";
  readonly freezeReadiness: "Ready" | "NotReady";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceManifest = Readonly<{
  readonly platformIdentity: Readonly<{
    readonly platformId: "BUS-28";
    readonly platformName: "Executive Finance Platform";
    readonly platformVersion: "1.0.0";
    readonly platformCode: "EXEC_FIN";
    readonly architectureStage: "Foundation";
    readonly releaseStatus: FinanceReleaseStatus;
    readonly supportedArchitecture: "Nexora Executive Platform";
    readonly architectureLayer: "BUS";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly consumedPhases: readonly ["BUS-28:1", "BUS-28:2", "BUS-28:3", "BUS-28:4"];
  readonly exportedPhases: readonly ["BUS-28:5"];
  readonly supportedConsumers: readonly string[];
  readonly certificationReadiness: "Ready" | "NotReady";
  readonly validationReadiness: "Ready" | "NotReady";
  readonly phaseRegistry: readonly FinancePhaseRegistryEntry[];
  readonly compatibility: FinanceCompatibilityMatrix;
  readonly dependencyMatrix: FinanceDependencyMatrix;
  readonly extensionPolicy: FinanceExtensionPolicy;
  readonly summary: FinanceManifestSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
