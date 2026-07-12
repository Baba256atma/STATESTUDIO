import type {
  ExecutivePortfolio,
  ExecutivePortfolioCategory,
  ExecutivePortfolioId,
  ExecutivePortfolioKey,
  ExecutivePortfolioCode,
  ExecutivePortfolioMetadata,
  ExecutivePortfolioName,
  ExecutivePortfolioDescription,
  ExecutivePortfolioOwnerId,
  ExecutivePortfolioOwnerType,
  ExecutivePortfolioRegistry,
  ExecutivePortfolioScope,
  ExecutivePortfolioStatus,
  ExecutiveTenantId,
  ExecutiveWorkspaceReference,
} from "./executivePortfolioContracts.ts";
import {
  EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES,
  EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES,
  EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES,
  EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY,
  EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY,
} from "./executivePortfolioRegistry.ts";

type ExecutivePortfolioMetadataInput = Readonly<{
  readonly createdAt: string;
  readonly updatedAt?: string;
  readonly createdBy: string;
  readonly version?: "1.0.0";
  readonly tags?: readonly string[];
  readonly notes?: readonly string[];
}>;

type ExecutiveWorkspaceReferenceInput = Readonly<{
  readonly workspaceId: string;
  readonly workspaceKey: string;
  readonly workspaceName: string;
}>;

type ExecutivePortfolioInput = Readonly<{
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
  readonly workspaceReferences?: readonly ExecutiveWorkspaceReference[];
  readonly metadata: ExecutivePortfolioMetadata;
}>;

const DEFAULT_METADATA_VERSION = "1.0.0" as const;
const EMPTY_NOTES = Object.freeze([] as const);
const EMPTY_WORKSPACE_REFERENCES = Object.freeze([] as const);
const EMPTY_WORKSPACE_IDS = Object.freeze([] as const);

function dedupeSortedStrings(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.map((value) => value.trim()).filter(Boolean))].sort());
}

function isSupportedPortfolioStatus(status: string): status is ExecutivePortfolioStatus {
  return EXECUTIVE_PORTFOLIO_SUPPORTED_STATUSES.includes(status as ExecutivePortfolioStatus);
}

function isSupportedPortfolioCategory(category: string): category is ExecutivePortfolioCategory {
  return EXECUTIVE_PORTFOLIO_SUPPORTED_CATEGORIES.includes(category as ExecutivePortfolioCategory);
}

function isSupportedPortfolioScope(scope: string): scope is ExecutivePortfolioScope {
  return EXECUTIVE_PORTFOLIO_SUPPORTED_SCOPES.includes(scope as ExecutivePortfolioScope);
}

export function normalizeExecutivePortfolioTags(tags: readonly string[]): readonly string[] {
  return dedupeSortedStrings(tags);
}

export function createExecutivePortfolioMetadata(
  input: ExecutivePortfolioMetadataInput,
): ExecutivePortfolioMetadata {
  return Object.freeze({
    createdAt: input.createdAt,
    updatedAt: input.updatedAt ?? input.createdAt,
    createdBy: input.createdBy,
    version: input.version ?? DEFAULT_METADATA_VERSION,
    tags: normalizeExecutivePortfolioTags(input.tags ?? EMPTY_NOTES),
    notes: dedupeSortedStrings(input.notes ?? EMPTY_NOTES),
    metadataOnly: true,
    immutable: true,
  });
}

export function createExecutiveWorkspaceReference(
  input: ExecutiveWorkspaceReferenceInput,
): ExecutiveWorkspaceReference {
  return Object.freeze({
    workspaceId: input.workspaceId,
    workspaceKey: input.workspaceKey,
    workspaceName: input.workspaceName,
    metadataOnly: true,
    immutable: true,
  });
}

export function createExecutivePortfolio(input: ExecutivePortfolioInput): ExecutivePortfolio {
  const workspaceReferences = Object.freeze(
    (input.workspaceReferences ?? EMPTY_WORKSPACE_REFERENCES).map((reference) =>
      createExecutiveWorkspaceReference(reference),
    ),
  );

  const workspaceIds = Object.freeze(workspaceReferences.map((reference) => reference.workspaceId));

  return Object.freeze({
    id: input.id,
    key: input.key,
    code: input.code,
    name: input.name,
    description: input.description,
    tenantId: input.tenantId,
    ownerId: input.ownerId,
    ownerType: input.ownerType,
    status: input.status,
    category: input.category,
    scope: input.scope,
    workspaceIds: workspaceReferences.length > 0 ? workspaceIds : EMPTY_WORKSPACE_IDS,
    workspaceReferences,
    metadata: createExecutivePortfolioMetadata(input.metadata),
    workspaceReferencePolicy: EXECUTIVE_PORTFOLIO_WORKSPACE_REFERENCE_POLICY,
    boundary: EXECUTIVE_PORTFOLIO_TENANT_BOUNDARY_POLICY,
    metadataOnly: true,
    immutable: true,
  });
}

export function createEmptyExecutivePortfolioRegistry(): ExecutivePortfolioRegistry {
  return Object.freeze({
    registryId: "executive-portfolio-registry-contract",
    version: DEFAULT_METADATA_VERSION,
    portfolios: Object.freeze([]),
    metadataOnly: true,
    immutable: true,
  });
}

export function isExecutivePortfolioStructurallyComplete(portfolio: ExecutivePortfolio): boolean {
  const hasWorkspaceCoverage =
    portfolio.workspaceIds.length === portfolio.workspaceReferences.length &&
    portfolio.workspaceReferences.every(
      (reference, index) =>
        reference.workspaceId === portfolio.workspaceIds[index] &&
        Boolean(reference.workspaceKey) &&
        Boolean(reference.workspaceName),
    );

  return (
    portfolio.metadataOnly &&
    portfolio.immutable &&
    Boolean(portfolio.id) &&
    Boolean(portfolio.key) &&
    Boolean(portfolio.code) &&
    Boolean(portfolio.name) &&
    Boolean(portfolio.tenantId) &&
    Boolean(portfolio.ownerId) &&
    Boolean(portfolio.ownerType) &&
    isSupportedPortfolioStatus(portfolio.status) &&
    isSupportedPortfolioCategory(portfolio.category) &&
    isSupportedPortfolioScope(portfolio.scope) &&
    portfolio.workspaceReferencePolicy.portfolioReferencesWorkspacesOnly &&
    !portfolio.boundary.portfolioOwnsDataSources &&
    !portfolio.boundary.portfolioOwnsKpi &&
    !portfolio.boundary.portfolioOwnsObjects &&
    hasWorkspaceCoverage &&
    portfolio.metadata.metadataOnly &&
    portfolio.metadata.immutable
  );
}

export function createDraftExecutivePortfolioExample(): ExecutivePortfolio {
  return createExecutivePortfolio({
    id: "portfolio-example",
    key: "portfolio.executive-example",
    code: "PORT-EXAMPLE",
    name: "Executive Portfolio Example",
    description: "Deterministic draft portfolio metadata for contract testing only.",
    tenantId: "tenant-example",
    ownerId: "owner-example",
    ownerType: "Executive",
    status: "Draft",
    category: "Strategy",
    scope: "Enterprise",
    workspaceReferences: Object.freeze([
      createExecutiveWorkspaceReference({
        workspaceId: "workspace-example",
        workspaceKey: "workspace.executive-example",
        workspaceName: "Executive Workspace Example",
      }),
    ]),
    metadata: createExecutivePortfolioMetadata({
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
      createdBy: "system.bus-27-3",
      tags: Object.freeze(["draft", "example", "portfolio"]),
      notes: Object.freeze(["contract-testing-only"]),
    }),
  });
}
