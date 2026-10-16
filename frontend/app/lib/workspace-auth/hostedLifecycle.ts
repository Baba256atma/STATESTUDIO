/**
 * HOSTED-MVP:4 — owner-authorized removal of hosted customer data.
 * The browser workspace id is not permission to delete.
 */

import type { NexoraPrincipal } from "@/app/lib/auth/nexoraPrincipal.ts";

import { authorizeNexoraWorkspace, type WorkspaceAuthorization } from "./authorizeNexoraWorkspace.ts";
import { hostedWorkspaceDatabase, HostedWorkspaceUnavailable } from "./hostedWorkspaceStore.ts";
import { listHostedWorkspaces } from "./hostedWorkspaceStore.ts";

export type HostedLifecycleResult =
  | Readonly<{ ok: true; deletedWorkspaces: number }>
  | Readonly<{ ok: false; outcome: Exclude<WorkspaceAuthorization["outcome"], "AUTHORIZED"> }>;

let failMidTransactionForTests = false;

export function failHostedDeletionMidTransactionForTests(fail: boolean): void {
  failMidTransactionForTests = fail;
}

type HostedDeletionTransaction = Parameters<
  Parameters<Awaited<ReturnType<typeof hostedWorkspaceDatabase>>["transaction"]>[0]
>[0];

async function deleteWorkspaceGraph(tx: HostedDeletionTransaction, workspaceId: string): Promise<void> {
  await tx.query(`DELETE FROM hosted_execution WHERE workspace_id = $1`, [workspaceId]);
  if (failMidTransactionForTests) throw new HostedWorkspaceUnavailable();
  await tx.query(`DELETE FROM hosted_decision WHERE workspace_id = $1`, [workspaceId]);
  await tx.query(`DELETE FROM hosted_saved_scene WHERE workspace_id = $1`, [workspaceId]);
  await tx.query(`DELETE FROM hosted_observation WHERE workspace_id = $1`, [workspaceId]);
  await tx.query(`DELETE FROM hosted_pending_csv WHERE workspace_id = $1`, [workspaceId]);
  await tx.query(`DELETE FROM hosted_data_source WHERE workspace_id = $1`, [workspaceId]);
  await tx.query(`DELETE FROM hosted_workspace WHERE workspace_id = $1`, [workspaceId]);
}

export async function deleteOwnedHostedWorkspace(input: {
  readonly principal: NexoraPrincipal | null;
  readonly workspaceId: string;
}): Promise<HostedLifecycleResult> {
  const authorization = await authorizeNexoraWorkspace(input);
  if (authorization.outcome !== "AUTHORIZED") return Object.freeze({ ok: false, outcome: authorization.outcome });
  try {
    const db = await hostedWorkspaceDatabase();
    await db.transaction(async (tx) => {
      await deleteWorkspaceGraph(tx, authorization.workspace.workspaceId);
    });
    return Object.freeze({ ok: true, deletedWorkspaces: 1 });
  } catch {
    return Object.freeze({ ok: false, outcome: "UNAVAILABLE" });
  }
}

export async function deleteOwnedHostedAccountData(
  principal: NexoraPrincipal | null,
): Promise<HostedLifecycleResult> {
  if (!principal?.userId) return Object.freeze({ ok: false, outcome: "NOT_AUTHENTICATED" });
  try {
    const owned = await listHostedWorkspaces(principal.userId);
    const db = await hostedWorkspaceDatabase();
    await db.transaction(async (tx) => {
      for (const workspace of owned) {
        await deleteWorkspaceGraph(tx, workspace.workspaceId);
      }
    });
    return Object.freeze({ ok: true, deletedWorkspaces: owned.length });
  } catch {
    return Object.freeze({ ok: false, outcome: "UNAVAILABLE" });
  }
}

export async function countHostedCustomerRows(workspaceId: string): Promise<{
  workspace: number;
  pending: number;
  sources: number;
  observations: number;
  decisions: number;
  executions: number;
  scenes: number;
}> {
  const db = await hostedWorkspaceDatabase();
  const count = async (sql: string) => {
    const result = await db.query<{ n: number }>(sql, [workspaceId]);
    return Number(result.rows[0]?.n ?? 0);
  };
  return {
    workspace: await count(`SELECT count(*)::int AS n FROM hosted_workspace WHERE workspace_id = $1`),
    pending: await count(`SELECT count(*)::int AS n FROM hosted_pending_csv WHERE workspace_id = $1`),
    sources: await count(`SELECT count(*)::int AS n FROM hosted_data_source WHERE workspace_id = $1`),
    observations: await count(`SELECT count(*)::int AS n FROM hosted_observation WHERE workspace_id = $1`),
    decisions: await count(`SELECT count(*)::int AS n FROM hosted_decision WHERE workspace_id = $1`),
    executions: await count(`SELECT count(*)::int AS n FROM hosted_execution WHERE workspace_id = $1`),
    scenes: await count(`SELECT count(*)::int AS n FROM hosted_saved_scene WHERE workspace_id = $1`),
  };
}
