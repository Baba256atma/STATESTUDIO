import {
  buildExecutivePortfolioCertificationReport,
  isExecutivePortfolioCertified,
  runExecutivePortfolioCertification,
  type ExecutivePortfolioCertificationReport,
  type ExecutivePortfolioCertificationResult,
} from "./executivePortfolioCertification.ts";
import {
  buildExecutivePortfolioManifest,
  type ExecutivePortfolioManifest,
} from "./executivePortfolioManifest.ts";
import {
  ExecutivePortfolioPlatform,
  getExecutivePortfolioPlatformRegistry,
} from "./executivePortfolioPlatform.ts";
import {
  EXECUTIVE_PORTFOLIO_CONTRACT_VERSION,
  EXECUTIVE_PORTFOLIO_DEPENDENCY,
  EXECUTIVE_PORTFOLIO_PHASE_REGISTRY,
  EXECUTIVE_PORTFOLIO_PLATFORM_ID,
} from "./executivePortfolioRegistry.ts";
import type { ExecutivePortfolioRegistry } from "./executivePortfolioContracts.ts";

export type ExecutivePortfolioFreezeState = Readonly<{
  readonly platformId: typeof EXECUTIVE_PORTFOLIO_PLATFORM_ID;
  readonly registryId: "executive-portfolio-registry-contract";
  readonly releaseState: "frozen";
  readonly freezeStatus: "released";
  readonly certified: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioFreezeManifest = Readonly<{
  readonly platformIdentity: Readonly<{
    readonly platformId: typeof EXECUTIVE_PORTFOLIO_PLATFORM_ID;
    readonly platformName: "Executive Portfolio Platform";
    readonly registryId: "executive-portfolio-registry-contract";
    readonly contractVersion: typeof EXECUTIVE_PORTFOLIO_CONTRACT_VERSION;
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly registryIdentity: ExecutivePortfolioRegistry;
  readonly contractVersion: typeof EXECUTIVE_PORTFOLIO_CONTRACT_VERSION;
  readonly phaseRegistry: typeof EXECUTIVE_PORTFOLIO_PHASE_REGISTRY;
  readonly dependency: typeof EXECUTIVE_PORTFOLIO_DEPENDENCY;
  readonly certificationResult: ExecutivePortfolioCertificationResult;
  readonly certificationReport: ExecutivePortfolioCertificationReport;
  readonly publicApiRegistry: readonly string[];
  readonly compatibilitySummary: Readonly<{
    readonly dependencyId: "BUS-26";
    readonly consumptionMode: "public-api-only";
    readonly compatible: true;
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly extensionPolicy: Readonly<{
    readonly policyId: "executive-portfolio-extension-policy";
    readonly publicApiExtensionsOnly: true;
    readonly privateModuleConsumptionAllowed: false;
    readonly runtimeExtensionsAllowed: false;
    readonly analyticsExtensionsAllowed: false;
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly releaseState: "frozen";
  readonly freezeStatus: "released";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioFreezeFacade = Readonly<{
  readonly platformId: typeof EXECUTIVE_PORTFOLIO_PLATFORM_ID;
  readonly manifest: ExecutivePortfolioFreezeManifest;
  readonly platform: typeof ExecutivePortfolioPlatform;
  readonly state: ExecutivePortfolioFreezeState;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

const EXECUTIVE_PORTFOLIO_PUBLIC_API_REGISTRY = Object.freeze([
  "createExecutivePortfolioMetadata",
  "createExecutiveWorkspaceReference",
  "createExecutivePortfolio",
  "createEmptyExecutivePortfolioRegistry",
  "isExecutivePortfolioStructurallyComplete",
  "normalizeExecutivePortfolioTags",
  "createDraftExecutivePortfolioExample",
  "validateExecutivePortfolio",
  "validateExecutivePortfolioRegistry",
  "validateExecutivePortfolioTenantBoundary",
  "validateExecutivePortfolioWorkspaceReferences",
  "buildExecutivePortfolioValidationResult",
  "buildExecutivePortfolioManifest",
  "isExecutivePortfolioManifestValid",
  "getExecutivePortfolioManifestSummary",
  "ExecutivePortfolioPlatform",
  "getExecutivePortfolioPlatformState",
  "getExecutivePortfolioPlatformManifest",
  "getExecutivePortfolioPlatformRegistry",
  "validateExecutivePortfolioPlatform",
  "runExecutivePortfolioCertification",
  "buildExecutivePortfolioCertificationReport",
  "isExecutivePortfolioCertified",
  "ExecutivePortfolioFreeze",
  "runExecutivePortfolioFreeze",
  "getExecutivePortfolioFreezeState",
  "buildExecutivePortfolioFreezeManifest",
  "isExecutivePortfolioFrozen",
] as const);

function createFreezeState(certified: boolean): ExecutivePortfolioFreezeState {
  return Object.freeze({
    platformId: EXECUTIVE_PORTFOLIO_PLATFORM_ID,
    registryId: "executive-portfolio-registry-contract",
    releaseState: "frozen",
    freezeStatus: "released",
    certified,
    metadataOnly: true,
    immutable: true,
  });
}

export function buildExecutivePortfolioFreezeManifest(): ExecutivePortfolioFreezeManifest {
  const registry = getExecutivePortfolioPlatformRegistry();
  const certificationResult = runExecutivePortfolioCertification();
  const certificationReport = buildExecutivePortfolioCertificationReport();
  const portfolioManifest: ExecutivePortfolioManifest = buildExecutivePortfolioManifest();

  return Object.freeze({
    platformIdentity: Object.freeze({
      platformId: EXECUTIVE_PORTFOLIO_PLATFORM_ID,
      platformName: "Executive Portfolio Platform",
      registryId: registry.registryId,
      contractVersion: EXECUTIVE_PORTFOLIO_CONTRACT_VERSION,
      metadataOnly: true,
      immutable: true,
    }),
    registryIdentity: registry,
    contractVersion: portfolioManifest.contractVersion,
    phaseRegistry: EXECUTIVE_PORTFOLIO_PHASE_REGISTRY,
    dependency: EXECUTIVE_PORTFOLIO_DEPENDENCY,
    certificationResult,
    certificationReport,
    publicApiRegistry: EXECUTIVE_PORTFOLIO_PUBLIC_API_REGISTRY,
    compatibilitySummary: Object.freeze({
      dependencyId: EXECUTIVE_PORTFOLIO_DEPENDENCY.dependencyId,
      consumptionMode: EXECUTIVE_PORTFOLIO_DEPENDENCY.consumptionMode,
      compatible: EXECUTIVE_PORTFOLIO_DEPENDENCY.compatible,
      metadataOnly: true,
      immutable: true,
    }),
    extensionPolicy: Object.freeze({
      policyId: "executive-portfolio-extension-policy",
      publicApiExtensionsOnly: true,
      privateModuleConsumptionAllowed: false,
      runtimeExtensionsAllowed: false,
      analyticsExtensionsAllowed: false,
      metadataOnly: true,
      immutable: true,
    }),
    releaseState: "frozen",
    freezeStatus: "released",
    metadataOnly: true,
    immutable: true,
  });
}

export function runExecutivePortfolioFreeze(): ExecutivePortfolioFreezeState {
  const certificationPassed = isExecutivePortfolioCertified();
  return createFreezeState(certificationPassed);
}

export function getExecutivePortfolioFreezeState(): ExecutivePortfolioFreezeState {
  return runExecutivePortfolioFreeze();
}

export function isExecutivePortfolioFrozen(): boolean {
  const state = getExecutivePortfolioFreezeState();
  return state.certified && state.releaseState === "frozen" && state.freezeStatus === "released";
}

export const ExecutivePortfolioFreeze: ExecutivePortfolioFreezeFacade = Object.freeze({
  platformId: EXECUTIVE_PORTFOLIO_PLATFORM_ID,
  manifest: buildExecutivePortfolioFreezeManifest(),
  platform: ExecutivePortfolioPlatform,
  state: getExecutivePortfolioFreezeState(),
  metadataOnly: true,
  immutable: true,
});
