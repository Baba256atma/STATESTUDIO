export type ExecutivePortfolioId = `portfolio-${string}`;

export type ExecutivePortfolioKey = `portfolio.${string}`;

export type ExecutivePortfolioCode = `PORT-${string}`;

export type ExecutivePortfolioName = string;

export type ExecutivePortfolioDescription = string;

export type ExecutiveTenantId = `tenant-${string}`;

export type ExecutivePortfolioOwnerId = string;

export type ExecutivePortfolioOwnerType = "Executive" | "BusinessUnit" | "ProgramOffice" | "Custom";

export type ExecutivePortfolioStatus = "Draft" | "Active" | "Archived" | "Frozen";

export type ExecutivePortfolioCategory =
  | "Strategy"
  | "Transformation"
  | "Operations"
  | "Technology"
  | "Finance"
  | "Innovation"
  | "Custom";

export type ExecutivePortfolioScope =
  | "SingleBusinessUnit"
  | "MultipleBusinessUnits"
  | "Enterprise"
  | "Custom";

export type ExecutiveWorkspaceReference = Readonly<{
  readonly workspaceId: string;
  readonly workspaceKey: string;
  readonly workspaceName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioMetadata = Readonly<{
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly version: "1.0.0";
  readonly tags: readonly string[];
  readonly notes: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioWorkspaceReferencePolicy = Readonly<{
  readonly policyId: "executive-portfolio-workspace-reference-policy";
  readonly portfolioMayContainManyWorkspaces: true;
  readonly workspaceMustBelongToExactlyOnePortfolioReferenceAtATime: true;
  readonly portfolioReferencesWorkspacesOnly: true;
  readonly workspaceEmbeddingAllowed: false;
  readonly crossTenantPortfolioAllowed: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioBoundary = Readonly<{
  readonly boundaryId: "executive-portfolio-boundary";
  readonly portfolioOwnsObjects: false;
  readonly portfolioOwnsRelationships: false;
  readonly portfolioOwnsKpi: false;
  readonly portfolioOwnsRisk: false;
  readonly portfolioOwnsScenario: false;
  readonly portfolioOwnsDataSources: false;
  readonly portfolioOwnsWorkspaceRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioDependency = Readonly<{
  readonly dependencyId: "BUS-26";
  readonly dependencyName: "Executive Strategy Platform Freeze";
  readonly consumptionMode: "public-api-only";
  readonly compatible: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolio = Readonly<{
  readonly id: ExecutivePortfolioId;
  readonly key: ExecutivePortfolioKey;
  readonly code: ExecutivePortfolioCode;
  readonly name: ExecutivePortfolioName;
  readonly description: ExecutivePortfolioDescription;
  readonly tenantId: ExecutiveTenantId;
  readonly ownerId: ExecutivePortfolioOwnerId;
  readonly ownerType: ExecutivePortfolioOwnerType;
  readonly status: ExecutivePortfolioStatus;
  readonly category: ExecutivePortfolioCategory;
  readonly scope: ExecutivePortfolioScope;
  readonly workspaceIds: readonly string[];
  readonly workspaceReferences: readonly ExecutiveWorkspaceReference[];
  readonly metadata: ExecutivePortfolioMetadata;
  readonly workspaceReferencePolicy: ExecutivePortfolioWorkspaceReferencePolicy;
  readonly boundary: ExecutivePortfolioBoundary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioRegistry = Readonly<{
  readonly registryId: "executive-portfolio-registry-contract";
  readonly version: "1.0.0";
  readonly portfolios: readonly ExecutivePortfolio[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioManifest = Readonly<{
  readonly platform: "Executive Portfolio Platform";
  readonly phase: "BUS-27:1";
  readonly version: "1.0.0";
  readonly contractVersion: "1.0.0";
  readonly dependency: ExecutivePortfolioDependency;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioValidationResult = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

