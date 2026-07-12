import {
  buildExecutivePortfolioManifest,
  type ExecutivePortfolioManifest,
} from "./executivePortfolioManifest.ts";
import { createEmptyExecutivePortfolioRegistry } from "./executivePortfolioModel.ts";
import {
  EXECUTIVE_PORTFOLIO_PLATFORM_ID,
  EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES,
  EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES,
  EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES,
  EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY,
  EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY,
} from "./executivePortfolioRegistry.ts";
import {
  buildExecutivePortfolioValidationResult,
  validateExecutivePortfolioRegistry,
} from "./executivePortfolioValidation.ts";
import type { ExecutivePortfolioRegistry, ExecutivePortfolioValidationResult } from "./executivePortfolioContracts.ts";

export type ExecutivePortfolioPlatformState = Readonly<{
  readonly platformId: typeof EXECUTIVE_PORTFOLIO_PLATFORM_ID;
  readonly releaseState: "draft";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioPlatformFacade = Readonly<{
  readonly platformId: typeof EXECUTIVE_PORTFOLIO_PLATFORM_ID;
  readonly registry: ExecutivePortfolioRegistry;
  readonly manifest: ExecutivePortfolioManifest;
  readonly validationResult: ExecutivePortfolioValidationResult;
  readonly supportedStatuses: typeof EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES;
  readonly supportedCategories: typeof EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES;
  readonly supportedScopes: typeof EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES;
  readonly workspaceReferencePolicy: typeof EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY;
  readonly tenantBoundaryPolicy: typeof EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY;
  readonly releaseState: "draft";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

const EXECUTIVE_PORTFOLIO_PLATFORM_REGISTRY = createEmptyExecutivePortfolioRegistry();
const EXECUTIVE_PORTFOLIO_PLATFORM_MANIFEST = buildExecutivePortfolioManifest();
const EXECUTIVE_PORTFOLIO_PLATFORM_VALIDATION = validateExecutivePortfolioRegistry(
  EXECUTIVE_PORTFOLIO_PLATFORM_REGISTRY,
);

export const ExecutivePortfolioPlatform: ExecutivePortfolioPlatformFacade = Object.freeze({
  platformId: EXECUTIVE_PORTFOLIO_PLATFORM_ID,
  registry: EXECUTIVE_PORTFOLIO_PLATFORM_REGISTRY,
  manifest: EXECUTIVE_PORTFOLIO_PLATFORM_MANIFEST,
  validationResult: EXECUTIVE_PORTFOLIO_PLATFORM_VALIDATION,
  supportedStatuses: EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES,
  supportedCategories: EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES,
  supportedScopes: EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES,
  workspaceReferencePolicy: EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY,
  tenantBoundaryPolicy: EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY,
  releaseState: "draft",
  metadataOnly: true,
  immutable: true,
});

export function getExecutivePortfolioPlatformState(): ExecutivePortfolioPlatformState {
  return Object.freeze({
    platformId: EXECUTIVE_PORTFOLIO_PLATFORM_ID,
    releaseState: "draft",
    metadataOnly: true,
    immutable: true,
  });
}

export function getExecutivePortfolioPlatformManifest(): ExecutivePortfolioManifest {
  return EXECUTIVE_PORTFOLIO_PLATFORM_MANIFEST;
}

export function getExecutivePortfolioPlatformRegistry(): ExecutivePortfolioRegistry {
  return EXECUTIVE_PORTFOLIO_PLATFORM_REGISTRY;
}

export function validateExecutivePortfolioPlatform(): ExecutivePortfolioValidationResult {
  const validation = validateExecutivePortfolioRegistry(EXECUTIVE_PORTFOLIO_PLATFORM_REGISTRY);
  const manifestStateValid =
    EXECUTIVE_PORTFOLIO_PLATFORM_MANIFEST.metadataOnly &&
    EXECUTIVE_PORTFOLIO_PLATFORM_MANIFEST.immutable &&
    EXECUTIVE_PORTFOLIO_PLATFORM_MANIFEST.releaseState === "draft";

  if (manifestStateValid) {
    return validation;
  }

  return buildExecutivePortfolioValidationResult(
    Object.freeze([
      ...validation.errors,
      "Executive Portfolio Platform manifest must remain immutable, metadata-only, and in draft release state.",
    ]),
    validation.warnings,
  );
}
