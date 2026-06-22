import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  WORKSPACE_DATA_SOURCE_OWNERSHIP_TAGS,
  verifyWorkspaceDataSourceOwnership,
  type WorkspaceDataSourceOwnershipAction,
  type WorkspaceDataSourceOwnershipRecord,
  type WorkspaceDataSourceOwnershipVerification,
} from "./workspaceDataSourceOwnershipContract.ts";

export type WorkspaceDataSourceIsolationGuardResult = Readonly<{
  allowed: boolean;
  action: WorkspaceDataSourceOwnershipAction;
  workspaceId: WorkspaceId | null;
  dataSourceId: string | null;
  reason: string;
  verification: WorkspaceDataSourceOwnershipVerification;
}>;

const emittedGuardKeys = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function emitOwnershipDiagnostic(
  message: "Ownership Verified" | "Access Denied" | "Isolation Guard Triggered",
  payload?: Record<string, unknown>
): void {
  if (!isDev()) return;
  devDiagnosticLog("dataSourceOwnership", `[DataSourceOwnership] ${message}`, {
    ...payload,
    tags: WORKSPACE_DATA_SOURCE_OWNERSHIP_TAGS,
  });
}

function logGuardResult(result: WorkspaceDataSourceIsolationGuardResult): void {
  const key = [
    result.action,
    result.workspaceId ?? "none",
    result.dataSourceId ?? "none",
    result.allowed ? "allow" : "deny",
    result.reason,
  ].join(":");

  if (result.allowed) {
    if (!emittedGuardKeys.has(`verified:${key}`)) {
      emittedGuardKeys.add(`verified:${key}`);
      emitOwnershipDiagnostic("Ownership Verified", {
        action: result.action,
        workspaceId: result.workspaceId,
        dataSourceId: result.dataSourceId,
        reason: result.reason,
      });
    }
    return;
  }

  emitOwnershipDiagnostic("Access Denied", {
    action: result.action,
    workspaceId: result.workspaceId,
    dataSourceId: result.dataSourceId,
    reason: result.reason,
  });
  emitOwnershipDiagnostic("Isolation Guard Triggered", {
    action: result.action,
    workspaceId: result.workspaceId,
    dataSourceId: result.dataSourceId,
    reason: result.reason,
  });
}

export function guardWorkspaceDataSourceAccess(input: {
  action: WorkspaceDataSourceOwnershipAction;
  workspaceId: WorkspaceId | null | undefined;
  dataSource?: WorkspaceDataSourceOwnershipRecord | null;
  dataSourceId?: string | null;
}): WorkspaceDataSourceIsolationGuardResult {
  const verification = verifyWorkspaceDataSourceOwnership({
    action: input.action,
    expectedWorkspaceId: input.workspaceId,
    dataSource: input.dataSource,
    dataSourceId: input.dataSourceId,
  });

  const result = Object.freeze({
    allowed: verification.valid && verification.owned,
    action: input.action,
    workspaceId: verification.workspaceId,
    dataSourceId: verification.dataSourceId,
    reason: verification.reason,
    verification,
  });

  logGuardResult(result);
  return result;
}

export function resetWorkspaceDataSourceIsolationGuardForTests(): void {
  emittedGuardKeys.clear();
}
