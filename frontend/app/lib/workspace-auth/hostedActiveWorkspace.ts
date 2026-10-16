/**
 * HOSTED-MVP:2 — presentation selection only.
 *
 * The selected id is not ownership. The server authorizes it again.
 */

import { readActiveDemoProfile, releaseDemoProfileForManagerWorkspace } from "@/app/lib/demo-profile/demoProfileStore.ts";
import { readLiveExecutiveDataWorkspaceId } from "@/app/lib/workspace/managerWorkspaceIdentity.ts";
import type { Workspace } from "@/app/lib/workspace/workspaceRegistryContract.ts";
import { adoptAuthorizedHostedWorkspace, getActiveWorkspaceId } from "@/app/lib/workspace/workspaceRegistryStore.ts";
import { isCustomerHostedWorkspaceId } from "./hostedWorkspaceId.ts";
import type { HostedWorkspaceProjection } from "./hostedWorkspaceRecord.ts";

const HOSTED_ACTIVE_WORKSPACE_KEY = "nexora.hosted.active-workspace.v1";

let selectedWorkspaceId: string | null = null;

export function rememberHostedWorkspaceSelection(workspaceId: string | null): void {
  selectedWorkspaceId = workspaceId;
  if (typeof sessionStorage === "undefined") return;
  if (workspaceId) sessionStorage.setItem(HOSTED_ACTIVE_WORKSPACE_KEY, workspaceId);
  else sessionStorage.removeItem(HOSTED_ACTIVE_WORKSPACE_KEY);
}

export function readStoredHostedWorkspaceSelection(): string | null {
  if (typeof sessionStorage === "undefined") return selectedWorkspaceId;
  const stored = sessionStorage.getItem(HOSTED_ACTIVE_WORKSPACE_KEY);
  return stored && stored.length > 0 ? stored : null;
}

/**
 * An explicit authorized hosted workspace exits demo presentation.
 * The id must already be in the server-authorized list. Browser ownership is ignored.
 */
export function selectAuthorizedHostedWorkspace(
  workspace: HostedWorkspaceProjection,
  authorized: readonly HostedWorkspaceProjection[],
): boolean {
  if (!isCustomerHostedWorkspaceId(workspace.workspaceId)) return false;
  const known = authorized.find((entry) => entry.workspaceId === workspace.workspaceId);
  if (!known || known.kind !== workspace.kind || known.name !== workspace.name) return false;
  const record: Workspace = Object.freeze({
    workspaceId: known.workspaceId,
    workspaceName: known.name,
    status: "active",
    createdAt: known.createdAt,
    updatedAt: known.updatedAt,
    lastOpenedAt: known.updatedAt,
    domain: null,
    objectCount: null,
    dataSourceCount: null,
    kind: known.kind,
  });
  if (!adoptAuthorizedHostedWorkspace(record)) return false;
  releaseDemoProfileForManagerWorkspace();
  rememberHostedWorkspaceSelection(known.workspaceId);
  return getActiveWorkspaceId() === known.workspaceId
    && readLiveExecutiveDataWorkspaceId() === known.workspaceId
    && readActiveDemoProfile() == null;
}

/** Demo exploration never becomes an authorized customer workspace. */
export function readHostedLlmWorkspaceId(): string | null {
  if (readActiveDemoProfile()) return null;
  return selectedWorkspaceId;
}
