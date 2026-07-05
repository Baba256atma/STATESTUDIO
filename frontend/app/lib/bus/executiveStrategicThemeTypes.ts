import type {
  ExecutiveStrategyCategory,
  ExecutiveStrategyLifecycle,
  ExecutiveStrategyMetadata,
  ExecutiveStrategyOwner,
  ExecutiveStrategyPriority,
  ExecutiveStrategicKpiReference,
  ExecutiveStrategicOkrReference,
  ExecutiveStrategicRiskReference,
  ExecutiveStrategyStakeholder,
  ExecutiveStrategyStatus,
} from "./executiveStrategyIndex.ts";
import type { ExecutiveStrategyVersion } from "./executiveStrategyDefinitionIndex.ts";

export type ExecutiveStrategicThemeIdentity = Readonly<{
  readonly themeId: string;
  readonly themeKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicThemeName = Readonly<{
  readonly shortName: string;
  readonly displayName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicThemePurpose = Readonly<{
  readonly purposeId: string;
  readonly purposeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicThemeScope = Readonly<{
  readonly scopeId: string;
  readonly scopeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicThemeSuccessCriteria = Readonly<{
  readonly criteriaId: string;
  readonly criteriaStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicThemeRelationshipType =
  | "StrategyToTheme"
  | "ThemeToStrategy"
  | "ParentThemeToChildTheme"
  | "ThemeToKpiReference"
  | "ThemeToOkrReference";

export type ExecutiveStrategicThemeRelationship = Readonly<{
  readonly relationshipId: string;
  readonly relationshipType: ExecutiveStrategicThemeRelationshipType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicTheme = Readonly<{
  readonly identity: ExecutiveStrategicThemeIdentity;
  readonly name: ExecutiveStrategicThemeName;
  readonly description: string;
  readonly purpose: ExecutiveStrategicThemePurpose;
  readonly scope: ExecutiveStrategicThemeScope;
  readonly category: ExecutiveStrategyCategory;
  readonly priority: ExecutiveStrategyPriority;
  readonly status: ExecutiveStrategyStatus;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly owner: ExecutiveStrategyOwner;
  readonly sponsor: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly parentThemeId: string | null;
  readonly childThemeIds: readonly string[];
  readonly strategyReferenceIds: readonly string[];
  readonly kpiReferences: readonly ExecutiveStrategicKpiReference[];
  readonly okrReferences: readonly ExecutiveStrategicOkrReference[];
  readonly assumptions: readonly string[];
  readonly constraints: readonly string[];
  readonly riskReferences: readonly ExecutiveStrategicRiskReference[];
  readonly successCriteria: readonly ExecutiveStrategicThemeSuccessCriteria[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly version: ExecutiveStrategyVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicThemeDependency = Readonly<{
  readonly dependencyId:
    | "BUS-17 Executive Strategy Foundation"
    | "BUS-18 Executive Strategy Definition Platform"
    | "Executive KPI Platform Freeze"
    | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategicThemeExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategic-theme-extension-policy";
  readonly extensionMode: "additive-only";
  readonly themeMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly objectiveManagementAllowed: false;
  readonly initiativeManagementAllowed: false;
  readonly roadmapGenerationAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveStrategicThemeManifest = Readonly<{
  readonly platformId: "BUS-19";
  readonly platformName: "Executive Strategic Themes Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themeCount: number;
  readonly categoryCount: number;
  readonly statusCount: number;
  readonly priorityCount: number;
  readonly lifecycleCount: number;
  readonly ownerCount: number;
  readonly versionCount: number;
  readonly relationshipCount: number;
  readonly publicApis: readonly string[];
  readonly strategyFoundationAvailable: boolean;
  readonly strategyDefinitionsAvailable: boolean;
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly certificationStatus: "Strategic Themes Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategicThemeRegistry = Readonly<{
  readonly platformId: "BUS-19";
  readonly platformName: "Executive Strategic Themes Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly kpiFreezeDependency: "BUS-12";
  readonly okrFreezeDependency: "BUS-16";
  readonly themes: readonly ExecutiveStrategicTheme[];
  readonly categories: readonly ExecutiveStrategyCategory[];
  readonly statuses: readonly ExecutiveStrategyStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly owners: readonly ExecutiveStrategyOwner[];
  readonly versions: readonly ExecutiveStrategyVersion[];
  readonly relationships: readonly ExecutiveStrategicThemeRelationship[];
  readonly publicApis: readonly string[];
  readonly extensionPolicy: ExecutiveStrategicThemeExtensionPolicy;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicThemeValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategicThemesPlatform = Readonly<{
  readonly registry: ExecutiveStrategicThemeRegistry;
  readonly manifest: ExecutiveStrategicThemeManifest;
  readonly validation: ExecutiveStrategicThemeValidation;
}>;
