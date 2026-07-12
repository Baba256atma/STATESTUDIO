export type ExecutiveFinancePlatformRegistry = Readonly<{
  readonly platformId: "BUS-28";
  readonly platformVersion: "1.0.0";
  readonly platformCode: "EXEC_FIN";
  readonly platformStage: "Foundation";
  readonly platformReleaseState: "Draft";
  readonly consumedPhases: readonly ["BUS-28:1", "BUS-28:2", "BUS-28:3", "BUS-28:4", "BUS-28:5"];
  readonly exportedApis: readonly string[];
  readonly dependencySummary: Readonly<{
    readonly dependencyCount: number;
    readonly status: "Compatible";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly compatibilitySummary: Readonly<{
    readonly compatibilityCount: number;
    readonly status: "Compatible";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly validationSummary: Readonly<{
    readonly validationCount: number;
    readonly passedCount: number;
    readonly failedCount: number;
    readonly status: "Ready" | "NotReady";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveFinancePlatformManifest = Readonly<{
  readonly platformIdentity: Readonly<{
    readonly platformId: "BUS-28";
    readonly platformName: "Executive Finance Platform";
    readonly platformVersion: "1.0.0";
    readonly platformCode: "EXEC_FIN";
    readonly platformStage: "Foundation";
    readonly platformReleaseState: "Draft";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly supportedPhases: readonly ["BUS-28:1", "BUS-28:2", "BUS-28:3", "BUS-28:4", "BUS-28:5", "BUS-28:6"];
  readonly compatibilityStatus: "Compatible";
  readonly dependencyStatus: "Compatible";
  readonly validationStatus: "Ready" | "NotReady";
  readonly manifestVersion: "1.0.0";
  readonly apiVersion: "1.0.0";
  readonly readinessState: "Ready" | "NotReady";
  readonly certificationReadiness: "Ready" | "NotReady";
  readonly freezeReadiness: "Ready" | "NotReady";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveFinancePlatformResult = Readonly<{
  readonly contracts: object;
  readonly registry: object;
  readonly model: object;
  readonly validation: object;
  readonly manifest: object;
  readonly platform: Readonly<{
    readonly registry: ExecutiveFinancePlatformRegistry;
    readonly manifest: ExecutiveFinancePlatformManifest;
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
