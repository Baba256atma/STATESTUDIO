/**
 * HOSTED-MVP:2 — authorized LLM dispatch.
 *
 * The browser workspace id is checked against server ownership
 * before any provider call.
 */

import { apiBase } from "@/app/lib/apiBase.ts";
import type { NexoraPrincipal } from "@/app/lib/auth/nexoraPrincipal.ts";

import { authorizeNexoraWorkspace, logWorkspaceAuthorization } from "./authorizeNexoraWorkspace.ts";

export function hostedLlmUsageScope(userId: string, workspaceId: string): string {
  return `hosted:${userId}:${workspaceId}`;
}

export async function dispatchAuthorizedHostedLlm(input: {
  readonly principal: NexoraPrincipal | null;
  readonly workspaceId: unknown;
  readonly contextWorkspaceId: unknown;
  readonly payload: unknown;
  readonly preparePayload?: (workspaceId: string) => Promise<unknown>;
  readonly fetchImpl?: typeof fetch;
  readonly apiBaseUrl?: string;
}): Promise<Readonly<{ forwarded: boolean; status: number; body: unknown }>> {
  const workspaceId = typeof input.workspaceId === "string" ? input.workspaceId : "";
  if (!input.principal?.userId) {
    logWorkspaceAuthorization({
      route: "llm",
      outcome: "NOT_AUTHENTICATED",
      userId: null,
      workspaceId: workspaceId || null,
    });
    return Object.freeze({
      forwarded: false,
      status: 401,
      body: { status: "skipped", contribution: null, policy: { reason: "authentication_required" } },
    });
  }
  if (
    typeof input.contextWorkspaceId === "string"
    && input.contextWorkspaceId.length > 0
    && input.contextWorkspaceId !== workspaceId
  ) {
    logWorkspaceAuthorization({
      route: "llm",
      outcome: "NOT_AUTHORIZED",
      userId: input.principal?.userId ?? null,
      workspaceId,
    });
    return Object.freeze({
      forwarded: false,
      status: 404,
      body: { status: "skipped", contribution: null, policy: { reason: "workspace_not_found" } },
    });
  }
  const authorization = await authorizeNexoraWorkspace({
    principal: input.principal,
    workspaceId,
  });
  logWorkspaceAuthorization({
    route: "llm",
    outcome: authorization.outcome,
    userId: input.principal?.userId ?? null,
    workspaceId: workspaceId || null,
  });
  if (authorization.outcome !== "AUTHORIZED" || !input.principal) {
    const status = authorization.outcome === "NOT_AUTHENTICATED"
      ? 401
      : authorization.outcome === "UNAVAILABLE"
        ? 503
        : 404;
    return Object.freeze({
      forwarded: false,
      status,
      body: {
        status: "skipped",
        contribution: null,
        policy: {
          reason: authorization.outcome === "UNAVAILABLE" ? "workspace_unavailable" : "workspace_not_found",
        },
      },
    });
  }
  let payload = input.payload;
  if (input.preparePayload) {
    try {
      payload = await input.preparePayload(authorization.workspace.workspaceId);
    } catch {
      return Object.freeze({
        forwarded: false,
        status: 503,
        body: { status: "skipped", contribution: null, policy: { reason: "workspace_unavailable" } },
      });
    }
  }
  const secret = process.env.NEXORA_LLM_GATEWAY_SECRET?.trim() ?? "";
  if (!secret) {
    return Object.freeze({
      forwarded: false,
      status: 503,
      body: { status: "skipped", contribution: null, policy: { reason: "workspace_unavailable" } },
    });
  }
  const base = (input.apiBaseUrl ?? process.env.NEXORA_PRIVATE_API_BASE ?? apiBase()).replace(/\/$/, "");
  const fetchImpl = input.fetchImpl ?? fetch;
  const response = await fetchImpl(`${base}/nexora/llm/runtime`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Nexora-Gateway-Secret": secret,
      "X-Nexora-Usage-Scope": hostedLlmUsageScope(input.principal.userId, authorization.workspace.workspaceId),
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  return Object.freeze({ forwarded: true, status: response.status, body });
}
