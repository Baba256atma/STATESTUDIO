import type {
  ExecutivePortfolioBoundary,
  ExecutivePortfolioCategory,
  ExecutivePortfolioDependency,
  ExecutivePortfolioRegistry,
  ExecutivePortfolioScope,
  ExecutivePortfolioStatus,
  ExecutivePortfolioWorkspaceReferencePolicy,
} from "./executivePortfolioContracts.ts";

export const EXECUTIVE_PORTFOLIO_PLATFORM_ID = "BUS-27" as const;

export const EXECUTIVE_PORTFOLIO_REGISTRY_ID = "executive-portfolio-registry" as const;

export const EXECUTIVE_PORTFOLIO_CONTRACT_VERSION = "1.0.0" as const;

export const EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES: readonly ExecutivePortfolioStatus[] = Object.freeze([
  "Draft",
  "Active",
  "Archived",
  "Frozen",
] as const);

export const EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES: readonly ExecutivePortfolioCategory[] = Object.freeze([
  "Strategy",
  "Transformation",
  "Operations",
  "Technology",
  "Finance",
  "Innovation",
  "Custom",
] as const);

export const EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES: readonly ExecutivePortfolioScope[] = Object.freeze([
  "SingleBusinessUnit",
  "MultipleBusinessUnits",
  "Enterprise",
  "Custom",
] as const);

export const EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY: ExecutivePortfolioWorkspaceReferencePolicy = Object.freeze({
  policyId: "executive-portfolio-workspace-reference-policy",
  portfolioMayContainManyWorkspaces: true,
  workspaceMustBelongToExactlyOnePortfolioReferenceAtATime: true,
  portfolioReferencesWorkspacesOnly: true,
  workspaceEmbeddingAllowed: false,
  crossTenantPortfolioAllowed: false,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY: ExecutivePortfolioBoundary = Object.freeze({
  boundaryId: "executive-portfolio-boundary",
  portfolioOwnsObjects: false,
  portfolioOwnsRelationships: false,
  portfolioOwnsKpi: false,
  portfolioOwnsRisk: false,
  portfolioOwnsScenario: false,
  portfolioOwnsDataSources: false,
  portfolioOwnsWorkspaceRuntime: false,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_PORTFOLIO_DEPENDENCY: ExecutivePortfolioDependency = Object.freeze({
  dependencyId: "BUS-26",
  dependencyName: "Executive Strategy Platform Freeze",
  consumptionMode: "public-api-only",
  compatible: true,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_PORTFOLIO_PHASE_REGISTRY = Object.freeze([
  Object.freeze({
    phaseId: "BUS-27:1",
    phaseName: "Executive Portfolio Platform Foundation: Portfolio Contracts",
    contractOnly: true,
    registryEnabled: false,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "BUS-27:2",
    phaseName: "Executive Portfolio Registry Foundation",
    contractOnly: false,
    registryEnabled: true,
    metadataOnly: true,
    immutable: true,
  }),
] as const);

const EXECUTIVE_PORTFOLIO_REGISTRY: ExecutivePortfolioRegistry = Object.freeze({
  registryId: "executive-portfolio-registry-contract",
  version: "1.0.0",
  portfolios: Object.freeze([]),
  metadataOnly: true,
  immutable: true,
});

export function buildExecutivePortfolioRegistry(): ExecutivePortfolioRegistry {
  return EXECUTIVE_PORTFOLIO_REGISTRY;
}

