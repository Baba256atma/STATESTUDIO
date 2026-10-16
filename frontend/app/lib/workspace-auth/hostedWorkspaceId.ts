/**
 * HOSTED-MVP:2 — server-issued workspace id shape.
 *
 * A matching id is still not ownership. Authorization is separate.
 */

import { DEMO_WORKSPACE_ID, isLegacyWorkflowWorkspaceIdentifier } from "@/app/lib/workspace/workspaceRegistryContract.ts";

const HOSTED_WORKSPACE_ID = /^ws_[A-Za-z0-9_-]{16,32}$/;

export function isCustomerHostedWorkspaceId(workspaceId: string): boolean {
  return HOSTED_WORKSPACE_ID.test(workspaceId)
    && workspaceId !== DEMO_WORKSPACE_ID
    && !isLegacyWorkflowWorkspaceIdentifier(workspaceId);
}
