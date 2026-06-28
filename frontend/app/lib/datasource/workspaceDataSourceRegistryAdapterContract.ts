/**
 * PHASE-2 / DS1:2 — Workspace Data Source Registry Adapter contract.
 * Bridge architecture between EBDS (DS1:1) and certified runtime registries — library-only.
 */

import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_MINIMUM_OVERALL_SCORE,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES,
  EXECUTIVE_BUSINESS_DATA_SOURCE_LIFECYCLE_STATES,
} from "./executiveBusinessDataSourceContract.ts";
import type {
  ExecutiveBusinessDataSourceCategory,
  ExecutiveBusinessDataSourceLifecycleState,
} from "./executiveBusinessDataSourceTypes.ts";
import type {
  ExecutiveToGlobalMappingPlan,
  ExecutiveToWorkspaceMappingPlan,
  GlobalRegistryRuntimeStatusHint,
  WorkspaceRegistryAdapterLinkRecord,
  WorkspaceRegistryAdapterOwnershipContract,
  WorkspaceRegistryAdapterScoreDimensions,
  WorkspaceRegistryAdapterSecurityProfile,
  WorkspaceRegistryAdapterSyncProfile,
  WorkspaceRegistryAdapterValidationIssue,
  WorkspaceRegistryAdapterValidationResult,
  WorkspaceRegistryAdapterWorkspaceId,
  WorkspaceRegistryReferenceContract,
  WorkspaceRegistryRuntimeStatusHint,
} from "./workspaceDataSourceRegistryAdapterTypes.ts";

export const WORKSPACE_REGISTRY_ADAPTER_VERSION = "PHASE-2/DS1:2" as const;
export const WORKSPACE_REGISTRY_ADAPTER_SOURCE = "phase-2-workspace-registry-adapter" as const;
export const NEXORA_WORKSPACE_REGISTRY_ADAPTER_LOG_PREFIX = "[NexoraWorkspaceRegistryAdapter]" as const;

export const WORKSPACE_REGISTRY_ADAPTER_TAGS = Object.freeze([
  "[DS12_REGISTRY_ADAPTER]",
  "[WORKSPACE_REGISTRY_BRIDGE]",
  "[EBDS_RUNTIME_LINK]",
  "[DS13_READY]",
] as const);

export const WORKSPACE_REGISTRY_ADAPTER_FREEZE_TAGS = Object.freeze([
  "[DS1_2_CERTIFIED]",
  "[WORKSPACE_DATASOURCE_REGISTRY_ADAPTER_FROZEN]",
  "[PHASE2_DS1_2_COMPLETE]",
] as const);

export const WORKSPACE_REGISTRY_ADAPTER_LIFECYCLE_STATES = Object.freeze([
  "unlinked",
  "linking",
  "linked",
  "sync_pending",
  "synced",
  "drift_detected",
  "relinking",
] as const);

export const WORKSPACE_REGISTRY_ADAPTER_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "data-sources/",
  "dataSourceRegistryRuntime.ts",
  "workspaceRegistryStore",
  "workspace/workspaceDataSourceRegistry.ts",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "InputCenter",
  "BusinessKnowledge",
  "executiveBusinessDataSourceContract.ts",
  "executiveBusinessDataSourceCertification.ts",
] as const);

export const WORKSPACE_REGISTRY_ADAPTER_DEFAULT_SYNC_PROFILE = Object.freeze({
  allowLabelSync: true,
  allowEstimateSync: true,
  allowStatusMirror: false,
  allowGlobalRegistryMirror: false,
} satisfies WorkspaceRegistryAdapterSyncProfile);

export const WORKSPACE_REGISTRY_ADAPTER_FORBIDDEN_SYNC_FIELDS = Object.freeze([
  "csvText",
  "parsedRows",
  "schemaDefinition",
  "objectIds",
  "relationshipIds",
  "intelligenceOutputs",
  "fileContents",
] as const);

export const WORKSPACE_REGISTRY_ADAPTER_DEFAULT_SECURITY_PROFILE = Object.freeze({
  workspaceExclusive: true,
  globalRegistryRequiresAdapterContext: true,
  crossWorkspaceLinking: false,
} satisfies WorkspaceRegistryAdapterSecurityProfile);

export const WORKSPACE_REGISTRY_ADAPTER_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-2/DS1:2",
  title: "Workspace Data Source Registry Adapter",
  goal: "Library-only adapter contract linking EBDS semantic records to certified runtime registries.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/datasource/workspaceDataSourceRegistryAdapterTypes.ts",
    "frontend/app/lib/datasource/workspaceDataSourceRegistryAdapterContract.ts",
    "frontend/app/lib/datasource/workspaceDataSourceRegistryAdapterDiagnostics.ts",
    "frontend/app/lib/datasource/workspaceDataSourceRegistryAdapterCertification.ts",
    "frontend/app/lib/datasource/workspaceDataSourceRegistryAdapterCertification.test.ts",
    "docs/ds1-2-build-report.md",
    "docs/ds1-2-analysis-report.md",
    "docs/ds1-2-freeze-report.md",
  ]),
  forbiddenPatterns: WORKSPACE_REGISTRY_ADAPTER_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS1:1", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: WORKSPACE_REGISTRY_ADAPTER_TAGS,
} satisfies StageManifest);

export const WORKSPACE_REGISTRY_ADAPTER_MODULE_PATHS = Object.freeze(
  WORKSPACE_REGISTRY_ADAPTER_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const ADAPTER_STATE_SET = new Set<string>(WORKSPACE_REGISTRY_ADAPTER_LIFECYCLE_STATES);

const EBDS_TO_WORKSPACE_STATUS: Readonly<
  Record<ExecutiveBusinessDataSourceLifecycleState, WorkspaceRegistryRuntimeStatusHint | null>
> = Object.freeze({
  defined: "empty",
  registered: "empty",
  connected: "connected",
  validated: "connected",
  active: "connected",
  suspended: "connected",
  archived: "connected",
  removed: null,
});

const EBDS_TO_GLOBAL_STATUS: Readonly<
  Record<ExecutiveBusinessDataSourceLifecycleState, GlobalRegistryRuntimeStatusHint | null>
> = Object.freeze({
  defined: "registered",
  registered: "registered",
  connected: "registered",
  validated: "registered",
  active: "active",
  suspended: "inactive",
  archived: "inactive",
  removed: null,
});

const CATEGORY_WORKSPACE_TYPE_HINTS: Readonly<Record<ExecutiveBusinessDataSourceCategory, readonly string[]>> =
  Object.freeze({
    financial: Object.freeze(["excel", "database"]),
    operational: Object.freeze(["csv", "api"]),
    sales: Object.freeze(["csv", "api"]),
    marketing: Object.freeze(["csv", "api"]),
    manufacturing: Object.freeze(["csv", "database"]),
    human_resources: Object.freeze(["excel", "database"]),
    supply_chain: Object.freeze(["csv", "api"]),
    custom: Object.freeze(["csv"]),
  });

const CATEGORY_GLOBAL_TYPE_HINTS: Readonly<Record<ExecutiveBusinessDataSourceCategory, readonly string[]>> =
  Object.freeze({
    financial: Object.freeze(["excel", "json"]),
    operational: Object.freeze(["csv", "json"]),
    sales: Object.freeze(["csv"]),
    marketing: Object.freeze(["csv"]),
    manufacturing: Object.freeze(["csv"]),
    human_resources: Object.freeze(["excel"]),
    supply_chain: Object.freeze(["csv"]),
    custom: Object.freeze(["manual_entry"]),
  });

function issue(code: string, message: string): WorkspaceRegistryAdapterValidationIssue {
  return Object.freeze({ code, message });
}

export function computeWorkspaceRegistryAdapterOverallScore(
  dimensions: WorkspaceRegistryAdapterScoreDimensions
): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsWorkspaceRegistryAdapterMinimumScore(overall: number): boolean {
  return overall >= STAGE_MINIMUM_OVERALL_SCORE;
}

export function mapExecutiveLifecycleToWorkspaceStatus(
  lifecycleState: ExecutiveBusinessDataSourceLifecycleState
): WorkspaceRegistryRuntimeStatusHint | null {
  return EBDS_TO_WORKSPACE_STATUS[lifecycleState];
}

export function mapExecutiveLifecycleToGlobalStatus(
  lifecycleState: ExecutiveBusinessDataSourceLifecycleState
): GlobalRegistryRuntimeStatusHint | null {
  return EBDS_TO_GLOBAL_STATUS[lifecycleState];
}

export function resolveCategoryWorkspaceTypeHint(category: ExecutiveBusinessDataSourceCategory): string {
  return CATEGORY_WORKSPACE_TYPE_HINTS[category][0];
}

export function resolveCategoryGlobalTypeHint(category: ExecutiveBusinessDataSourceCategory): string {
  return CATEGORY_GLOBAL_TYPE_HINTS[category][0];
}

export function buildExecutiveToWorkspaceMappingPlan(input: {
  category: ExecutiveBusinessDataSourceCategory;
  lifecycleState: ExecutiveBusinessDataSourceLifecycleState;
}): ExecutiveToWorkspaceMappingPlan {
  return Object.freeze({
    category: input.category,
    lifecycleState: input.lifecycleState,
    workspaceStatusHint: mapExecutiveLifecycleToWorkspaceStatus(input.lifecycleState),
    workspaceTypeHint: resolveCategoryWorkspaceTypeHint(input.category),
  });
}

export function buildExecutiveToGlobalMappingPlan(input: {
  category: ExecutiveBusinessDataSourceCategory;
  lifecycleState: ExecutiveBusinessDataSourceLifecycleState;
}): ExecutiveToGlobalMappingPlan {
  return Object.freeze({
    category: input.category,
    lifecycleState: input.lifecycleState,
    globalStatusHint: mapExecutiveLifecycleToGlobalStatus(input.lifecycleState),
    globalTypeHint: resolveCategoryGlobalTypeHint(input.category),
  });
}

export function buildWorkspaceRegistryAdapterOwnershipContract(
  record: Pick<WorkspaceRegistryAdapterLinkRecord, "adapterLinkId" | "workspaceId" | "businessDataSourceId">
): WorkspaceRegistryAdapterOwnershipContract {
  return Object.freeze({
    adapterLinkId: record.adapterLinkId.trim(),
    workspaceId: record.workspaceId.trim(),
    businessDataSourceId: record.businessDataSourceId.trim(),
    isolationPolicy: "workspace-exclusive",
  });
}

export function buildWorkspaceRegistryReferenceContract(
  record: Pick<WorkspaceRegistryAdapterLinkRecord, "workspaceId" | "workspaceDataSourceId" | "registrySourceId">
): WorkspaceRegistryReferenceContract {
  return Object.freeze({
    workspaceId: record.workspaceId.trim(),
    workspaceDataSourceId: record.workspaceDataSourceId?.trim() ?? null,
    registrySourceId: record.registrySourceId?.trim() ?? null,
    globalRegistryWorkspaceContext: "adapter-link-only",
  });
}

export function validateWorkspaceRegistryAdapterOwnership(input: {
  record: Pick<WorkspaceRegistryAdapterLinkRecord, "adapterLinkId" | "workspaceId" | "businessDataSourceId">;
  expectedWorkspaceId?: WorkspaceRegistryAdapterWorkspaceId | null;
}): WorkspaceRegistryAdapterValidationResult {
  const issues: WorkspaceRegistryAdapterValidationIssue[] = [];
  const workspaceId = input.record.workspaceId?.trim() ?? "";
  const adapterLinkId = input.record.adapterLinkId?.trim() ?? "";
  const businessDataSourceId = input.record.businessDataSourceId?.trim() ?? "";
  if (!workspaceId) issues.push(issue("missing_workspace_id", "Adapter link requires workspaceId."));
  if (!adapterLinkId) issues.push(issue("missing_adapter_link_id", "Adapter link requires adapterLinkId."));
  if (!businessDataSourceId) issues.push(issue("missing_business_source_id", "Adapter link requires businessDataSourceId."));
  if (input.expectedWorkspaceId?.trim() && workspaceId && input.expectedWorkspaceId.trim() !== workspaceId) {
    issues.push(issue("workspace_mismatch", "Adapter workspaceId does not match expected workspace."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateWorkspaceRegistryReferenceContract(
  reference: WorkspaceRegistryReferenceContract
): WorkspaceRegistryAdapterValidationResult {
  const issues: WorkspaceRegistryAdapterValidationIssue[] = [];
  if (!reference.workspaceId.trim()) issues.push(issue("missing_workspace_id", "Registry reference requires workspaceId."));
  if (reference.globalRegistryWorkspaceContext !== "adapter-link-only") {
    issues.push(issue("invalid_global_context", "Global registry workspace context must remain adapter-link-only."));
  }
  if (reference.registrySourceId && !reference.workspaceId.trim()) {
    issues.push(issue("global_without_workspace", "Global registrySourceId requires adapter workspace context."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateWorkspaceRegistryAdapterSyncBoundary(
  profile: WorkspaceRegistryAdapterSyncProfile
): WorkspaceRegistryAdapterValidationResult {
  const issues: WorkspaceRegistryAdapterValidationIssue[] = [];
  if (profile.allowStatusMirror !== false) {
    issues.push(issue("invalid_status_mirror", "allowStatusMirror must remain false in DS1:2 contract."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateWorkspaceRegistryAdapterLinkRecord(
  input: Partial<WorkspaceRegistryAdapterLinkRecord>
): WorkspaceRegistryAdapterValidationResult {
  const issues = [
    ...validateWorkspaceRegistryAdapterOwnership({
      record: {
        adapterLinkId: input.adapterLinkId ?? "",
        workspaceId: input.workspaceId ?? "",
        businessDataSourceId: input.businessDataSourceId ?? "",
      },
    }).issues,
  ];
  if (input.adapterState && !ADAPTER_STATE_SET.has(input.adapterState)) {
    issues.push(issue("invalid_adapter_state", `Unsupported adapter state "${input.adapterState}".`));
  }
  if (input.syncProfile) issues.push(...validateWorkspaceRegistryAdapterSyncBoundary(input.syncProfile).issues);
  if (input.securityProfile?.crossWorkspaceLinking !== undefined && input.securityProfile.crossWorkspaceLinking !== false) {
    issues.push(issue("invalid_security", "crossWorkspaceLinking must remain false."));
  }
  if (input.securityProfile?.workspaceExclusive !== undefined && input.securityProfile.workspaceExclusive !== true) {
    issues.push(issue("invalid_security", "workspaceExclusive must remain true."));
  }
  if (input.source && input.source !== WORKSPACE_REGISTRY_ADAPTER_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-2-workspace-registry-adapter."));
  }
  if (input.createdAt && !Number.isFinite(Date.parse(input.createdAt))) {
    issues.push(issue("invalid_created_at", "createdAt must be an ISO timestamp."));
  }
  if (input.updatedAt && !Number.isFinite(Date.parse(input.updatedAt))) {
    issues.push(issue("invalid_updated_at", "updatedAt must be an ISO timestamp."));
  }
  if (input.workspaceDataSourceId || input.registrySourceId) {
    const reference = buildWorkspaceRegistryReferenceContract({
      workspaceId: input.workspaceId ?? "",
      workspaceDataSourceId: input.workspaceDataSourceId ?? null,
      registrySourceId: input.registrySourceId ?? null,
    });
    issues.push(...validateWorkspaceRegistryReferenceContract(reference).issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function resolveWorkspaceRegistryAdapterLinkExample(
  category: ExecutiveBusinessDataSourceCategory
): WorkspaceRegistryAdapterLinkRecord {
  const timestamp = "2026-06-22T00:00:00.000Z";
  const lifecycleState = EXECUTIVE_BUSINESS_DATA_SOURCE_LIFECYCLE_STATES[2];
  return Object.freeze({
    contractVersion: WORKSPACE_REGISTRY_ADAPTER_VERSION,
    adapterLinkId: `wra-example-${category}`,
    workspaceId: "workspace-example-001",
    businessDataSourceId: `ebds-example-${category}`,
    workspaceDataSourceId: `wsds-example-${category}`,
    registrySourceId: null,
    adapterState: "linked",
    syncProfile: WORKSPACE_REGISTRY_ADAPTER_DEFAULT_SYNC_PROFILE,
    securityProfile: WORKSPACE_REGISTRY_ADAPTER_DEFAULT_SECURITY_PROFILE,
    metadata: Object.freeze({
      connectorHint: resolveCategoryWorkspaceTypeHint(category),
      extension: Object.freeze({ syncProfileId: "default", connectorProfileId: null }),
    }),
    createdAt: timestamp,
    updatedAt: timestamp,
    source: WORKSPACE_REGISTRY_ADAPTER_SOURCE,
  });
}

export const WORKSPACE_REGISTRY_ADAPTER_MAPPING_COVERAGE = Object.freeze({
  categories: EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES.length,
  executiveLifecycleStates: EXECUTIVE_BUSINESS_DATA_SOURCE_LIFECYCLE_STATES.length,
  adapterLifecycleStates: WORKSPACE_REGISTRY_ADAPTER_LIFECYCLE_STATES.length,
});
