/**
 * HOSTED-MVP:1 — hosted provider gate in front of the existing LLM HTTP seam.
 *
 * Local certification keeps the current provider path.
 * Hosted mode never treats authentication as workspace authorization.
 */

import { isCustomerHostedWorkspaceId } from "@/app/lib/workspace-auth/hostedWorkspaceId.ts";

import type { NexoraDeploymentMode } from "./nexoraDeploymentMode.ts";
import type { NexoraPrincipal } from "./nexoraPrincipal.ts";

export type HostedLlmProviderGate =
  | Readonly<{ allowed: true }>
  | Readonly<{
      allowed: false;
      reason: "authentication_required" | "workspace_authorization_required";
    }>;

export function evaluateHostedLlmProviderGate(input: {
  readonly deploymentMode: NexoraDeploymentMode;
  readonly principal: NexoraPrincipal | null;
  readonly workspaceId?: string | null;
}): HostedLlmProviderGate {
  if (input.deploymentMode !== "hosted") return Object.freeze({ allowed: true });
  if (!input.principal) {
    return Object.freeze({ allowed: false, reason: "authentication_required" });
  }
  if (!input.workspaceId || !isCustomerHostedWorkspaceId(input.workspaceId)) {
    return Object.freeze({ allowed: false, reason: "workspace_authorization_required" });
  }
  return Object.freeze({ allowed: true });
}
