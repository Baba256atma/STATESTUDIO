/**
 * HOSTED-MVP:2 — the only workspace authorization authority.
 *
 * A caller-supplied workspace id is not ownership.
 */

import type { NexoraPrincipal } from "@/app/lib/auth/nexoraPrincipal.ts";

import type { HostedWorkspace } from "./hostedWorkspaceRecord.ts";
import { isCustomerHostedWorkspaceId } from "./hostedWorkspaceId.ts";
import { HostedWorkspaceUnavailable, readHostedWorkspaceRow } from "./hostedWorkspaceStore.ts";

export type WorkspaceAuthorization =
  | Readonly<{ outcome: "AUTHORIZED"; workspace: HostedWorkspace }>
  | Readonly<{ outcome: "NOT_AUTHENTICATED" }>
  | Readonly<{ outcome: "NOT_AUTHORIZED" }>
  | Readonly<{ outcome: "WORKSPACE_NOT_FOUND" }>
  | Readonly<{ outcome: "UNAVAILABLE" }>;

export async function authorizeNexoraWorkspace(input: {
  readonly principal: NexoraPrincipal | null;
  readonly workspaceId: string;
}): Promise<WorkspaceAuthorization> {
  if (!input.principal?.userId) return Object.freeze({ outcome: "NOT_AUTHENTICATED" });
  if (!isCustomerHostedWorkspaceId(input.workspaceId)) {
    return Object.freeze({ outcome: "WORKSPACE_NOT_FOUND" });
  }
  try {
    const workspace = await readHostedWorkspaceRow(input.workspaceId);
    if (!workspace) return Object.freeze({ outcome: "WORKSPACE_NOT_FOUND" });
    if (workspace.ownerUserId !== input.principal.userId) {
      return Object.freeze({ outcome: "NOT_AUTHORIZED" });
    }
    return Object.freeze({ outcome: "AUTHORIZED", workspace });
  } catch (error) {
    if (error instanceof HostedWorkspaceUnavailable) return Object.freeze({ outcome: "UNAVAILABLE" });
    return Object.freeze({ outcome: "UNAVAILABLE" });
  }
}

export function logWorkspaceAuthorization(input: {
  readonly route: string;
  readonly outcome: WorkspaceAuthorization["outcome"] | "INVALID";
  readonly userId: string | null;
  readonly workspaceId: string | null;
}): void {
  console.info(
    `nexora_workspace_auth route=${input.route} outcome=${input.outcome} user=${input.userId ?? "anonymous"} workspace=${input.workspaceId ?? "none"}`,
  );
}
