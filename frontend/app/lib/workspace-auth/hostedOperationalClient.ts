/**
 * HOSTED-MVP:3B browser client. Responses hydrate the existing Decision,
 * Execution, and Saved Scene runtimes.
 */

import type { NexoraCanonicalDecisionRecord } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import type { NexoraCanonicalExecution } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import type { SceneOrgSavedScene } from "../scene-org/sceneOrgWorkspacePlacementContract.ts";
import type { HostedOperationalSnapshot } from "./hostedOperationalPersistence.ts";

async function readBody(response: Response): Promise<HostedOperationalSnapshot & { error?: string }> {
  return response.json().catch(() => ({})) as Promise<HostedOperationalSnapshot & { error?: string }>;
}

export async function loadHostedOperations(workspaceId: string): Promise<HostedOperationalSnapshot> {
  const response = await fetch(`/api/nexora/workspaces/${encodeURIComponent(workspaceId)}/operations`, {
    cache: "no-store",
  });
  const body = await readBody(response);
  if (!response.ok || !body.decisions || !body.executions || !body.scenes) {
    throw new Error(body.error ?? "data_store_unavailable");
  }
  return body;
}

export async function saveHostedOperations(
  workspaceId: string,
  patch: {
    decisions?: readonly NexoraCanonicalDecisionRecord[];
    executions?: readonly NexoraCanonicalExecution[];
    scenes?: readonly SceneOrgSavedScene[];
  },
): Promise<HostedOperationalSnapshot> {
  const response = await fetch(`/api/nexora/workspaces/${encodeURIComponent(workspaceId)}/operations`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patch),
  });
  const body = await readBody(response);
  if (!response.ok || !body.decisions || !body.executions || !body.scenes) {
    throw new Error(body.error ?? "data_store_unavailable");
  }
  return body;
}
