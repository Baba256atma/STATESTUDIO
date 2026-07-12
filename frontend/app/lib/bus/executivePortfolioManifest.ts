import type { ExecutivePortfolioValidationResult } from "./executivePortfolioContracts.ts";
import { createEmptyExecutivePortfolioRegistry } from "./executivePortfolioModel.ts";
import {
  EXECUTIVE_PORTFOLIO_CONTRACT_VERSION,
  EXECUTIVE_PORTFOLIO_DEPENDENCY,
  EXECUTIVE_PORTFOLIO_PHASE_REGISTRY,
  EXECUTIVE_PORTFOLIO_PLATFORM_ID,
  EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES,
  EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES,
  EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES,
  EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY,
  EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY,
} from "./executivePortfolioRegistry.ts";
import { validateExecutivePortfolioRegistry } from "./executivePortfolioValidation.ts";

export type ExecutivePortfolioManifest = Readonly<{
  readonly platformId: typeof EXECUTIVE_PORTFOLIO_PLATFORM_ID;
  readonly phaseId: "BUS-27:5";
  readonly contractVersion: typeof EXECUTIVE_PORTFOLIO_CONTRACT_VERSION;
  readonly registryId: "executive-portfolio-registry-contract";
  readonly dependency: typeof EXECUTIVE_PORTFOLIO_DEPENDENCY;
  readonly phaseRegistry: typeof EXECUTIVE_PORTFOLIO_PHASE_REGISTRY;
  readonly supportedStatuses: typeof EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES;
  readonly supportedCategories: typeof EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES;
  readonly supportedScopes: typeof EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES;
  readonly workspaceReferencePolicy: typeof EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY;
  readonly tenantBoundaryPolicy: typeof EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY;
  readonly validationSummary: Readonly<{
    readonly valid: boolean;
    readonly errorCount: number;
    readonly warningCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly releaseState: "draft";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioManifestSummary = Readonly<{
  readonly platformId: typeof EXECUTIVE_PORTFOLIO_PLATFORM_ID;
  readonly phaseId: "BUS-27:5";
  readonly registryId: "executive-portfolio-registry-contract";
  readonly releaseState: "draft";
  readonly dependencyId: "BUS-26";
  readonly supportedStatusCount: number;
  readonly supportedCategoryCount: number;
  readonly supportedScopeCount: number;
  readonly validationValid: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

function buildValidationSummary(
  validationResult: ExecutivePortfolioValidationResult,
): ExecutivePortfolioManifest["validationSummary"] {
  return Object.freeze({
    valid: validationResult.valid,
    errorCount: validationResult.errors.length,
    warningCount: validationResult.warnings.length,
    metadataOnly: true,
    immutable: true,
  });
}

export function buildExecutivePortfolioManifest(): ExecutivePortfolioManifest {
  const registry = createEmptyExecutivePortfolioRegistry();
  const validationResult = validateExecutivePortfolioRegistry(registry);

  return Object.freeze({
    platformId: EXECUTIVE_PORTFOLIO_PLATFORM_ID,
    phaseId: "BUS-27:5",
    contractVersion: EXECUTIVE_PORTFOLIO_CONTRACT_VERSION,
    registryId: registry.registryId,
    dependency: EXECUTIVE_PORTFOLIO_DEPENDENCY,
    phaseRegistry: EXECUTIVE_PORTFOLIO_PHASE_REGISTRY,
    supportedStatuses: EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES,
    supportedCategories: EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES,
    supportedScopes: EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES,
    workspaceReferencePolicy: EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY,
    tenantBoundaryPolicy: EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY,
    validationSummary: buildValidationSummary(validationResult),
    releaseState: "draft",
    metadataOnly: true,
    immutable: true,
  });
}

export function isExecutivePortfolioManifestValid(manifest: ExecutivePortfolioManifest): boolean {
  return (
    manifest.metadataOnly &&
    manifest.immutable &&
    manifest.platformId === EXECUTIVE_PORTFOLIO_PLATFORM_ID &&
    manifest.phaseId === "BUS-27:5" &&
    manifest.contractVersion === EXECUTIVE_PORTFOLIO_CONTRACT_VERSION &&
    manifest.registryId === "executive-portfolio-registry-contract" &&
    manifest.dependency.compatible &&
    manifest.dependency.consumptionMode === "public-api-only" &&
    manifest.phaseRegistry.length >= 2 &&
    manifest.workspaceReferencePolicy.portfolioReferencesWorkspacesOnly &&
    !manifest.workspaceReferencePolicy.crossTenantPortfolioAllowed &&
    !manifest.tenantBoundaryPolicy.portfolioOwnsDataSources &&
    !manifest.tenantBoundaryPolicy.portfolioOwnsKpi &&
    !manifest.tenantBoundaryPolicy.portfolioOwnsObjects &&
    manifest.releaseState === "draft"
  );
}

export function getExecutivePortfolioManifestSummary(): ExecutivePortfolioManifestSummary {
  const manifest = buildExecutivePortfolioManifest();

  return Object.freeze({
    platformId: manifest.platformId,
    phaseId: manifest.phaseId,
    registryId: manifest.registryId,
    releaseState: manifest.releaseState,
    dependencyId: manifest.dependency.dependencyId,
    supportedStatusCount: manifest.supportedStatuses.length,
    supportedCategoryCount: manifest.supportedCategories.length,
    supportedScopeCount: manifest.supportedScopes.length,
    validationValid: manifest.validationSummary.valid,
    metadataOnly: true,
    immutable: true,
  });
}
