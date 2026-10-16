/**
 * HOSTED-MVP:1 — My Workspace authentication gate.
 *
 * Opening the gate does not create a hosted workspace and does not
 * authorize legacy browser workspace records.
 */

import type { NexoraDeploymentMode } from "./nexoraDeploymentMode.ts";
import type { NexoraPrincipal } from "./nexoraPrincipal.ts";

export type HostedMyWorkspaceAccess =
  | Readonly<{ access: "local-certification" }>
  | Readonly<{ access: "authentication-required" }>
  | Readonly<{
      access: "authenticated-account";
      userId: string;
      accountWorkspaceStore: "unavailable";
    }>;

export function assessHostedMyWorkspaceAccess(input: {
  readonly deploymentMode: NexoraDeploymentMode;
  readonly principal: NexoraPrincipal | null;
}): HostedMyWorkspaceAccess {
  if (input.deploymentMode !== "hosted") {
    return Object.freeze({ access: "local-certification" });
  }
  if (!input.principal) {
    return Object.freeze({ access: "authentication-required" });
  }
  return Object.freeze({
    access: "authenticated-account",
    userId: input.principal.userId,
    accountWorkspaceStore: "unavailable",
  });
}
