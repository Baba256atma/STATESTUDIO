import type {
  ExecutivePortfolio,
  ExecutivePortfolioRegistry,
  ExecutivePortfolioValidationResult,
  ExecutiveWorkspaceReference,
} from "./executivePortfolioContracts.ts";
import { isExecutivePortfolioStructurallyComplete } from "./executivePortfolioModel.ts";
import {
  EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES,
  EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES,
  EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES,
} from "./executivePortfolioRegistry.ts";

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

function isSupportedStatus(status: ExecutivePortfolio["status"]): boolean {
  return EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES.includes(status);
}

function isSupportedCategory(category: ExecutivePortfolio["category"]): boolean {
  return EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES.includes(category);
}

function isSupportedScope(scope: ExecutivePortfolio["scope"]): boolean {
  return EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES.includes(scope);
}

function hasMetadataOnlyWorkspaceShape(reference: ExecutiveWorkspaceReference): boolean {
  const candidate = reference as ExecutiveWorkspaceReference & Record<string, unknown>;

  return (
    reference.metadataOnly &&
    reference.immutable &&
    hasValue(reference.workspaceId) &&
    hasValue(reference.workspaceKey) &&
    hasValue(reference.workspaceName) &&
    !("datasources" in candidate) &&
    !("dataSources" in candidate) &&
    !("objects" in candidate) &&
    !("kpis" in candidate) &&
    !("risks" in candidate) &&
    !("scenarios" in candidate)
  );
}

export function buildExecutivePortfolioValidationResult(
  errors: readonly string[] = [],
  warnings: readonly string[] = [],
): ExecutivePortfolioValidationResult {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([...warnings]),
    metadataOnly: true,
    immutable: true,
  });
}

export function validateExecutivePortfolioWorkspaceReferences(
  portfolio: ExecutivePortfolio,
): ExecutivePortfolioValidationResult {
  const errors: string[] = [];

  if (portfolio.workspaceIds.length !== portfolio.workspaceReferences.length) {
    errors.push("Portfolio workspaceIds and workspaceReferences must have matching lengths.");
  }

  portfolio.workspaceReferences.forEach((reference, index) => {
    if (!hasMetadataOnlyWorkspaceShape(reference)) {
      errors.push(`Workspace reference at index ${index} must remain metadata-only and immutable.`);
    }

    if (portfolio.workspaceIds[index] !== reference.workspaceId) {
      errors.push(`Workspace reference at index ${index} must match the corresponding workspaceId.`);
    }
  });

  return buildExecutivePortfolioValidationResult(errors);
}

export function validateExecutivePortfolioTenantBoundary(
  portfolio: ExecutivePortfolio,
): ExecutivePortfolioValidationResult {
  const errors: string[] = [];

  if (!hasValue(portfolio.tenantId)) {
    errors.push("Portfolio tenantId is required.");
  }

  if (portfolio.workspaceReferencePolicy.crossTenantPortfolioAllowed) {
    errors.push("Portfolio workspace reference policy must forbid cross-tenant portfolios.");
  }

  if (portfolio.boundary.portfolioOwnsDataSources) {
    errors.push("Portfolio boundary must not allow portfolio-owned data sources.");
  }

  if (portfolio.boundary.portfolioOwnsObjects) {
    errors.push("Portfolio boundary must not allow portfolio-owned objects.");
  }

  if (portfolio.boundary.portfolioOwnsKpi) {
    errors.push("Portfolio boundary must not allow portfolio-owned KPI.");
  }

  if (portfolio.boundary.portfolioOwnsRisk) {
    errors.push("Portfolio boundary must not allow portfolio-owned risks.");
  }

  if (portfolio.boundary.portfolioOwnsScenario) {
    errors.push("Portfolio boundary must not allow portfolio-owned scenarios.");
  }

  return buildExecutivePortfolioValidationResult(errors);
}

export function validateExecutivePortfolio(portfolio: ExecutivePortfolio): ExecutivePortfolioValidationResult {
  const errors: string[] = [];

  if (!hasValue(portfolio.id)) {
    errors.push("Portfolio id is required.");
  }

  if (!hasValue(portfolio.key)) {
    errors.push("Portfolio key is required.");
  }

  if (!hasValue(portfolio.code)) {
    errors.push("Portfolio code is required.");
  }

  if (!hasValue(portfolio.name)) {
    errors.push("Portfolio name is required.");
  }

  if (!hasValue(portfolio.tenantId)) {
    errors.push("Portfolio tenantId is required.");
  }

  if (!isSupportedStatus(portfolio.status)) {
    errors.push("Portfolio status must be supported.");
  }

  if (!isSupportedCategory(portfolio.category)) {
    errors.push("Portfolio category must be supported.");
  }

  if (!isSupportedScope(portfolio.scope)) {
    errors.push("Portfolio scope must be supported.");
  }

  if (!portfolio.metadataOnly || !portfolio.immutable) {
    errors.push("Portfolio must remain metadata-only and immutable.");
  }

  if (!isExecutivePortfolioStructurallyComplete(portfolio)) {
    errors.push("Portfolio structure is incomplete.");
  }

  const tenantBoundaryResult = validateExecutivePortfolioTenantBoundary(portfolio);
  const workspaceReferenceResult = validateExecutivePortfolioWorkspaceReferences(portfolio);

  return buildExecutivePortfolioValidationResult(
    Object.freeze([
      ...errors,
      ...tenantBoundaryResult.errors,
      ...workspaceReferenceResult.errors,
    ]),
    Object.freeze([
      ...tenantBoundaryResult.warnings,
      ...workspaceReferenceResult.warnings,
    ]),
  );
}

export function validateExecutivePortfolioRegistry(
  registry: ExecutivePortfolioRegistry,
): ExecutivePortfolioValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (registry.registryId !== "executive-portfolio-registry-contract") {
    errors.push("Portfolio registryId must match the contract registry identifier.");
  }

  if (registry.version !== "1.0.0") {
    errors.push("Portfolio registry version must be 1.0.0.");
  }

  if (!registry.metadataOnly || !registry.immutable) {
    errors.push("Portfolio registry must remain metadata-only and immutable.");
  }

  if (registry.portfolios.length === 0) {
    warnings.push("Portfolio registry contains no portfolio data unless explicitly provided.");
  }

  registry.portfolios.forEach((portfolio, index) => {
    const portfolioValidation = validateExecutivePortfolio(portfolio);

    portfolioValidation.errors.forEach((error) => {
      errors.push(`Registry portfolio at index ${index}: ${error}`);
    });
  });

  return buildExecutivePortfolioValidationResult(errors, warnings);
}
