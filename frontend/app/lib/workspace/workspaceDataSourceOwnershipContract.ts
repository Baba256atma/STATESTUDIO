import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_DATA_SOURCE_OWNERSHIP_VERSION = "NW-B:9-4" as const;

export const WORKSPACE_DATA_SOURCE_OWNERSHIP_TAGS = Object.freeze([
  "NWB94",
  "DATA_SOURCE_OWNERSHIP",
  "WORKSPACE_DATA_ISOLATION",
] as const);

export type WorkspaceDataSourceOwnershipRecord = Readonly<{
  workspaceId: WorkspaceId;
  dataSourceId: string;
}>;

export type WorkspaceDataSourceOwnershipAction = "read" | "update" | "delete" | "bind" | "import";

export type WorkspaceDataSourceOwnershipVerification = Readonly<{
  valid: boolean;
  owned: boolean;
  workspaceId: WorkspaceId | null;
  dataSourceId: string | null;
  action: WorkspaceDataSourceOwnershipAction;
  reason: string;
}>;

export type WorkspaceDataSourceOwnershipContract = Readonly<{
  contractVersion: typeof WORKSPACE_DATA_SOURCE_OWNERSHIP_VERSION;
  requiredFields: readonly ["workspaceId", "dataSourceId"];
  supportedActions: readonly WorkspaceDataSourceOwnershipAction[];
}>;

export const WORKSPACE_DATA_SOURCE_OWNERSHIP_CONTRACT: WorkspaceDataSourceOwnershipContract =
  Object.freeze({
    contractVersion: WORKSPACE_DATA_SOURCE_OWNERSHIP_VERSION,
    requiredFields: Object.freeze(["workspaceId", "dataSourceId"] as const),
    supportedActions: Object.freeze([
      "read",
      "update",
      "delete",
      "bind",
      "import",
    ] as const),
  });

export function workspaceDataSourceHasRequiredOwnership(
  dataSource: WorkspaceDataSourceOwnershipRecord | null | undefined
): dataSource is WorkspaceDataSourceOwnershipRecord {
  if (!dataSource || typeof dataSource !== "object") return false;
  return (
    typeof dataSource.workspaceId === "string" &&
    dataSource.workspaceId.trim().length > 0 &&
    typeof dataSource.dataSourceId === "string" &&
    dataSource.dataSourceId.trim().length > 0
  );
}

export function verifyWorkspaceDataSourceOwnership(input: {
  action: WorkspaceDataSourceOwnershipAction;
  expectedWorkspaceId: WorkspaceId | null | undefined;
  dataSource?: WorkspaceDataSourceOwnershipRecord | null;
  dataSourceId?: string | null;
}): WorkspaceDataSourceOwnershipVerification {
  const expectedWorkspaceId = input.expectedWorkspaceId?.trim() ?? null;
  const dataSourceId =
    input.dataSource?.dataSourceId?.trim() ?? input.dataSourceId?.trim() ?? null;

  if (!expectedWorkspaceId) {
    return Object.freeze({
      valid: false,
      owned: false,
      workspaceId: expectedWorkspaceId,
      dataSourceId,
      action: input.action,
      reason: "missing_workspace_id",
    });
  }

  if (!input.dataSource) {
    if (input.action === "read" && !dataSourceId) {
      return Object.freeze({
        valid: true,
        owned: true,
        workspaceId: expectedWorkspaceId,
        dataSourceId: null,
        action: input.action,
        reason: "workspace_read_scope_valid",
      });
    }
    if (input.action === "import") {
      return Object.freeze({
        valid: true,
        owned: true,
        workspaceId: expectedWorkspaceId,
        dataSourceId,
        action: input.action,
        reason: "workspace_import_scope_valid",
      });
    }
    return Object.freeze({
      valid: false,
      owned: false,
      workspaceId: expectedWorkspaceId,
      dataSourceId,
      action: input.action,
      reason: "data_source_not_found",
    });
  }

  if (!workspaceDataSourceHasRequiredOwnership(input.dataSource)) {
    return Object.freeze({
      valid: false,
      owned: false,
      workspaceId: expectedWorkspaceId,
      dataSourceId,
      action: input.action,
      reason: "missing_required_ownership_fields",
    });
  }

  if (input.dataSource.workspaceId !== expectedWorkspaceId) {
    return Object.freeze({
      valid: false,
      owned: false,
      workspaceId: expectedWorkspaceId,
      dataSourceId: input.dataSource.dataSourceId,
      action: input.action,
      reason: "cross_workspace_access_denied",
    });
  }

  return Object.freeze({
    valid: true,
    owned: true,
    workspaceId: expectedWorkspaceId,
    dataSourceId: input.dataSource.dataSourceId,
    action: input.action,
    reason: "ownership_verified",
  });
}

export function assertWorkspaceDataSourceOwnership(
  dataSource: WorkspaceDataSourceOwnershipRecord | null | undefined,
  expectedWorkspaceId: WorkspaceId
): dataSource is WorkspaceDataSourceOwnershipRecord {
  return verifyWorkspaceDataSourceOwnership({
    action: "read",
    expectedWorkspaceId,
    dataSource,
  }).owned;
}
