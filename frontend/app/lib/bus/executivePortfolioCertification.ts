import type { ExecutivePortfolioValidationResult } from "./executivePortfolioContracts.ts";
import {
  createDraftExecutivePortfolioExample,
  createEmptyExecutivePortfolioRegistry,
} from "./executivePortfolioModel.ts";
import {
  buildExecutivePortfolioManifest,
  getExecutivePortfolioManifestSummary,
  isExecutivePortfolioManifestValid,
} from "./executivePortfolioManifest.ts";
import {
  ExecutivePortfolioPlatform,
  getExecutivePortfolioPlatformManifest,
  getExecutivePortfolioPlatformRegistry,
  getExecutivePortfolioPlatformState,
  validateExecutivePortfolioPlatform,
} from "./executivePortfolioPlatform.ts";
import {
  EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY,
  EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY,
} from "./executivePortfolioRegistry.ts";
import {
  buildExecutivePortfolioValidationResult,
  validateExecutivePortfolio,
  validateExecutivePortfolioRegistry,
} from "./executivePortfolioValidation.ts";

export type ExecutivePortfolioCertificationGate = Readonly<{
  readonly gateId:
    | "contracts-exported"
    | "registry-immutable"
    | "model-immutable"
    | "validation-deterministic"
    | "manifest-valid"
    | "platform-facade-valid"
    | "tenant-boundary-exists"
    | "cross-tenant-forbidden"
    | "workspace-references-metadata-only"
    | "no-runtime-behavior"
    | "no-analytics"
    | "no-persistence"
    | "no-ui"
    | "release-state-draft";
  readonly passed: boolean;
  readonly detail: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioCertificationResult = Readonly<{
  readonly certified: boolean;
  readonly releaseState: "draft";
  readonly gateResults: readonly ExecutivePortfolioCertificationGate[];
  readonly validationResult: ExecutivePortfolioValidationResult;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePortfolioCertificationReport = Readonly<{
  readonly platformId: "BUS-27";
  readonly certified: boolean;
  readonly releaseState: "draft";
  readonly passedGateCount: number;
  readonly totalGateCount: number;
  readonly manifestSummary: ReturnType<typeof getExecutivePortfolioManifestSummary>;
  readonly gateResults: readonly ExecutivePortfolioCertificationGate[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

function createGate(
  gateId: ExecutivePortfolioCertificationGate["gateId"],
  passed: boolean,
  detail: string,
): ExecutivePortfolioCertificationGate {
  return Object.freeze({
    gateId,
    passed,
    detail,
    metadataOnly: true,
    immutable: true,
  });
}

export function runExecutivePortfolioCertification(): ExecutivePortfolioCertificationResult {
  const registry = getExecutivePortfolioPlatformRegistry();
  const manifest = getExecutivePortfolioPlatformManifest();
  const platformState = getExecutivePortfolioPlatformState();
  const draftExample = createDraftExecutivePortfolioExample();
  const emptyRegistry = createEmptyExecutivePortfolioRegistry();
  const registryValidation = validateExecutivePortfolioRegistry(registry);
  const repeatRegistryValidation = validateExecutivePortfolioRegistry(emptyRegistry);
  const platformValidation = validateExecutivePortfolioPlatform();
  const draftValidation = validateExecutivePortfolio(draftExample);
  const manifestValid = isExecutivePortfolioManifestValid(manifest);
  const rebuiltManifestValid = isExecutivePortfolioManifestValid(buildExecutivePortfolioManifest());

  const gateResults = Object.freeze([
    createGate(
      "contracts-exported",
      Boolean(draftExample.id && draftExample.key && draftExample.code && draftExample.name),
      "Portfolio contracts are consumable through the draft example metadata surface.",
    ),
    createGate(
      "registry-immutable",
      registry.metadataOnly &&
        registry.immutable &&
        Object.isFrozen(registry) &&
        Object.isFrozen(registry.portfolios),
      "Portfolio registry is immutable and metadata-only.",
    ),
    createGate(
      "model-immutable",
      draftExample.metadataOnly &&
        draftExample.immutable &&
        Object.isFrozen(draftExample) &&
        Object.isFrozen(draftExample.workspaceReferences) &&
        Object.isFrozen(draftExample.metadata),
      "Portfolio model outputs are immutable and metadata-only.",
    ),
    createGate(
      "validation-deterministic",
      registryValidation.valid === repeatRegistryValidation.valid &&
        registryValidation.errors.join("|") === repeatRegistryValidation.errors.join("|") &&
        registryValidation.warnings.join("|") === repeatRegistryValidation.warnings.join("|"),
      "Portfolio validation produces deterministic results for equivalent registry state.",
    ),
    createGate(
      "manifest-valid",
      manifestValid && rebuiltManifestValid,
      "Portfolio manifest is valid and reproducible.",
    ),
    createGate(
      "platform-facade-valid",
      ExecutivePortfolioPlatform.metadataOnly &&
        ExecutivePortfolioPlatform.immutable &&
        platformValidation.valid &&
        platformState.releaseState === "draft",
      "Portfolio platform facade is valid, immutable, and draft-scoped.",
    ),
    createGate(
      "tenant-boundary-exists",
      EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY.metadataOnly &&
        EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY.immutable,
      "Tenant boundary policy exists and is published as metadata.",
    ),
    createGate(
      "cross-tenant-forbidden",
      !EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY.crossTenantPortfolioAllowed,
      "Cross-tenant portfolio behavior is forbidden.",
    ),
    createGate(
      "workspace-references-metadata-only",
      draftExample.workspaceReferences.every(
        (reference) => reference.metadataOnly && reference.immutable,
      ) && draftValidation.valid,
      "Workspace references remain metadata-only and structurally valid.",
    ),
    createGate(
      "no-runtime-behavior",
      ExecutivePortfolioPlatform.metadataOnly && manifest.metadataOnly && registry.metadataOnly,
      "Portfolio foundation exposes metadata-only surfaces with no runtime behavior.",
    ),
    createGate(
      "no-analytics",
      !("analytics" in ExecutivePortfolioPlatform) && !("scoring" in ExecutivePortfolioPlatform),
      "Portfolio foundation exposes no analytics or scoring surface.",
    ),
    createGate(
      "no-persistence",
      !("persistence" in ExecutivePortfolioPlatform) && !("storage" in ExecutivePortfolioPlatform),
      "Portfolio foundation exposes no persistence or storage surface.",
    ),
    createGate(
      "no-ui",
      !("ui" in ExecutivePortfolioPlatform) && !("dashboard" in ExecutivePortfolioPlatform),
      "Portfolio foundation exposes no UI surface.",
    ),
    createGate(
      "release-state-draft",
      manifest.releaseState === "draft" && platformState.releaseState === "draft",
      "Portfolio foundation remains in draft release state.",
    ),
  ] as const);

  const failedGateDetails = gateResults.filter((gate) => !gate.passed).map((gate) => gate.detail);
  const warnings = registryValidation.warnings;
  const validationResult = buildExecutivePortfolioValidationResult(failedGateDetails, warnings);

  return Object.freeze({
    certified: gateResults.every((gate) => gate.passed),
    releaseState: "draft",
    gateResults,
    validationResult,
    metadataOnly: true,
    immutable: true,
  });
}

export function buildExecutivePortfolioCertificationReport(): ExecutivePortfolioCertificationReport {
  const certification = runExecutivePortfolioCertification();

  return Object.freeze({
    platformId: "BUS-27",
    certified: certification.certified,
    releaseState: certification.releaseState,
    passedGateCount: certification.gateResults.filter((gate) => gate.passed).length,
    totalGateCount: certification.gateResults.length,
    manifestSummary: getExecutivePortfolioManifestSummary(),
    gateResults: certification.gateResults,
    metadataOnly: true,
    immutable: true,
  });
}

export function isExecutivePortfolioCertified(): boolean {
  return runExecutivePortfolioCertification().certified;
}
