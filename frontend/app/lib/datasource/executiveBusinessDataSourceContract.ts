/**
 * PHASE-2 / DS1:1 — Executive Business Data Source contract.
 * Semantic layer above certified DS-1 registry — library-only, no runtime.
 */

import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_MINIMUM_OVERALL_SCORE,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  ExecutiveBusinessDataSourceCategory,
  ExecutiveBusinessDataSourceLifecycleState,
  ExecutiveBusinessDataSourceOwnershipContract,
  ExecutiveBusinessDataSourceRecord,
  ExecutiveBusinessDataSourceScoreDimensions,
  ExecutiveBusinessDataSourceValidationIssue,
  ExecutiveBusinessDataSourceValidationResult,
  ExecutiveBusinessDataSourceWorkspaceId,
} from "./executiveBusinessDataSourceTypes.ts";

export const EXECUTIVE_BUSINESS_DATA_SOURCE_VERSION = "PHASE-2/DS1:1" as const;
export const EXECUTIVE_BUSINESS_DATA_SOURCE_SOURCE = "phase-2-business-data-source" as const;
export const NEXORA_EXECUTIVE_BUSINESS_DATA_SOURCE_LOG_PREFIX =
  "[NexoraExecutiveBusinessDataSource]" as const;
export const EXECUTIVE_BUSINESS_DATA_SOURCE_TAGS = Object.freeze([
  "[DS11_BUSINESS_CONTRACT]",
  "[BUSINESS_DATA_SOURCE_DEFINED]",
  "[WORKSPACE_OWNED_SOURCE]",
  "[DS12_READY]",
] as const);

export const EXECUTIVE_BUSINESS_DATA_SOURCE_FREEZE_TAGS = Object.freeze([
  "[DS1_1_CERTIFIED]",
  "[EXECUTIVE_BUSINESS_DATASOURCE_CONTRACT_FROZEN]",
  "[PHASE2_DS1_1_COMPLETE]",
] as const);
export const EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES = Object.freeze([
  "financial",
  "operational",
  "sales",
  "marketing",
  "manufacturing",
  "human_resources",
  "supply_chain",
  "custom",
] as const satisfies readonly ExecutiveBusinessDataSourceCategory[]);
export const EXECUTIVE_BUSINESS_DATA_SOURCE_LIFECYCLE_STATES = Object.freeze([
  "defined",
  "registered",
  "connected",
  "validated",
  "active",
  "suspended",
  "archived",
  "removed",
] as const satisfies readonly ExecutiveBusinessDataSourceLifecycleState[]);
export const EXECUTIVE_BUSINESS_DATA_SOURCE_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "data-sources/",
  "workspaceRegistryStore",
  "workspaceDataSourceRegistry",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "RightPanelHost",
  "InputCenter",
  "BusinessKnowledge",
] as const);
export const EXECUTIVE_BUSINESS_DATA_SOURCE_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-2/DS1:1",
  title: "Business Data Source Contract",
  goal: "Library-only semantic contract for workspace-owned business data sources.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/datasource/executiveBusinessDataSourceTypes.ts",
    "frontend/app/lib/datasource/executiveBusinessDataSourceContract.ts",
    "frontend/app/lib/datasource/executiveBusinessDataSourceDiagnostics.ts",
    "frontend/app/lib/datasource/executiveBusinessDataSourceCertification.ts",
    "frontend/app/lib/datasource/executiveBusinessDataSourceCertification.test.ts",
    "docs/ds1-1-build-report.md",
    "docs/ds1-1-analysis-report.md",
    "docs/ds1-1-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_BUSINESS_DATA_SOURCE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_BUSINESS_DATA_SOURCE_TAGS,
} satisfies StageManifest);
export const EXECUTIVE_BUSINESS_DATA_SOURCE_MODULE_PATHS = Object.freeze(
  EXECUTIVE_BUSINESS_DATA_SOURCE_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const CATEGORY_SET = new Set<string>(EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES);
const LIFECYCLE_SET = new Set<string>(EXECUTIVE_BUSINESS_DATA_SOURCE_LIFECYCLE_STATES);
const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";
const EXAMPLE_SPECS = Object.freeze({
  financial: ["Financial Ledger Summary", "defined"],
  operational: ["Operational KPI Feed", "registered"],
  sales: ["Sales Pipeline Snapshot", "connected"],
  marketing: ["Marketing Campaign Metrics", "validated"],
  manufacturing: ["Manufacturing Output Index", "active"],
  human_resources: ["HR Capacity Register", "suspended"],
  supply_chain: ["Supply Chain Inventory View", "archived"],
  custom: ["Custom Executive Source", "defined"],
} as const satisfies Readonly<
  Record<ExecutiveBusinessDataSourceCategory, readonly [string, ExecutiveBusinessDataSourceLifecycleState]>
>);

function issue(code: string, message: string): ExecutiveBusinessDataSourceValidationIssue {
  return Object.freeze({ code, message });
}

export function computeExecutiveBusinessDataSourceOverallScore(
  dimensions: ExecutiveBusinessDataSourceScoreDimensions
): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveBusinessDataSourceMinimumScore(overall: number): boolean {
  return overall >= STAGE_MINIMUM_OVERALL_SCORE;
}

export function buildExecutiveBusinessDataSourceOwnershipContract(
  record: Pick<ExecutiveBusinessDataSourceRecord, "businessDataSourceId" | "workspaceId">
): ExecutiveBusinessDataSourceOwnershipContract {
  return Object.freeze({
    businessDataSourceId: record.businessDataSourceId.trim(),
    workspaceId: record.workspaceId.trim(),
    isolationPolicy: "workspace-exclusive",
  });
}

export function validateExecutiveBusinessDataSourceOwnership(input: {
  record: Pick<ExecutiveBusinessDataSourceRecord, "businessDataSourceId" | "workspaceId">;
  expectedWorkspaceId?: ExecutiveBusinessDataSourceWorkspaceId | null;
}): ExecutiveBusinessDataSourceValidationResult {
  const issues: ExecutiveBusinessDataSourceValidationIssue[] = [];
  const workspaceId = input.record.workspaceId?.trim() ?? "";
  const businessDataSourceId = input.record.businessDataSourceId?.trim() ?? "";
  if (!workspaceId) issues.push(issue("missing_workspace_id", "Business Data Source requires a workspaceId."));
  if (!businessDataSourceId) issues.push(issue("missing_source_id", "Business Data Source requires a businessDataSourceId."));
  if (input.expectedWorkspaceId?.trim() && workspaceId && input.expectedWorkspaceId.trim() !== workspaceId) {
    issues.push(issue("workspace_mismatch", "Business Data Source workspaceId does not match expected workspace."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveBusinessDataSourceRecord(
  input: Partial<ExecutiveBusinessDataSourceRecord>
): ExecutiveBusinessDataSourceValidationResult {
  const issues = [
    ...validateExecutiveBusinessDataSourceOwnership({
      record: { businessDataSourceId: input.businessDataSourceId ?? "", workspaceId: input.workspaceId ?? "" },
    }).issues,
  ];
  if (!input.displayName?.trim()) issues.push(issue("missing_display_name", "displayName is required."));
  if (input.category && !CATEGORY_SET.has(input.category)) issues.push(issue("invalid_category", `Unsupported category "${input.category}".`));
  if (input.lifecycleState && !LIFECYCLE_SET.has(input.lifecycleState)) issues.push(issue("invalid_lifecycle", `Unsupported lifecycle "${input.lifecycleState}".`));
  if (input.createdAt && !Number.isFinite(Date.parse(input.createdAt))) issues.push(issue("invalid_created_at", "createdAt must be an ISO timestamp."));
  if (input.updatedAt && !Number.isFinite(Date.parse(input.updatedAt))) issues.push(issue("invalid_updated_at", "updatedAt must be an ISO timestamp."));
  if (input.securityProfile?.crossWorkspaceAccess !== undefined && input.securityProfile.crossWorkspaceAccess !== false) {
    issues.push(issue("invalid_security", "crossWorkspaceAccess must remain false."));
  }
  if (input.source && input.source !== EXECUTIVE_BUSINESS_DATA_SOURCE_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-2-business-data-source."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function resolveExecutiveBusinessDataSourceExample(
  category: ExecutiveBusinessDataSourceCategory
): ExecutiveBusinessDataSourceRecord {
  const [displayName, lifecycleState] = EXAMPLE_SPECS[category];
  return Object.freeze({
    contractVersion: EXECUTIVE_BUSINESS_DATA_SOURCE_VERSION,
    businessDataSourceId: `ebds-example-${category}`,
    workspaceId: "workspace-example-001",
    displayName,
    description: `${displayName} semantic example.`,
    category,
    lifecycleState,
    metadata: Object.freeze({ businessDomain: category, tags: Object.freeze(["example", category]) }),
    securityProfile: Object.freeze({ classification: "internal", crossWorkspaceAccess: false }),
    createdAt: EXAMPLE_TS,
    updatedAt: EXAMPLE_TS,
    source: EXECUTIVE_BUSINESS_DATA_SOURCE_SOURCE,
  });
}
