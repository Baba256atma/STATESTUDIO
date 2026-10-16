/**
 * HOSTED-MVP:3B — server authority for the existing Decision, Execution,
 * and Saved Scene records. The browser does not own these rows.
 */

import type { NexoraCanonicalDecisionRecord } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import type { NexoraCanonicalExecution } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { NEXORA_EXECUTION_STATUSES } from "../conversational-control/executiveExecutionPolicy.ts";
import {
  createSceneOrgSavedScene,
  type SceneOrgSavedScene,
} from "../scene-org/sceneOrgWorkspacePlacementContract.ts";
import { HostedWorkspaceUnavailable, hostedWorkspaceDatabase } from "./hostedWorkspaceStore.ts";
import { isCustomerHostedWorkspaceId } from "./hostedWorkspaceId.ts";

export type HostedOperationalErrorCode =
  | "invalid_record"
  | "workspace_not_found"
  | "data_store_unavailable";

export class HostedOperationalError extends Error {
  readonly code: HostedOperationalErrorCode;

  constructor(code: HostedOperationalErrorCode) {
    super(code);
    this.code = code;
  }
}

export type HostedOperationalSnapshot = Readonly<{
  workspaceId: string;
  decisions: readonly NexoraCanonicalDecisionRecord[];
  executions: readonly NexoraCanonicalExecution[];
  scenes: readonly SceneOrgSavedScene[];
}>;

const DECISION_STATUSES = new Set(["Draft", "Under Review", "Approved", "Rejected", "Archived"]);

function storeFailure(error: unknown): never {
  if (error instanceof HostedOperationalError) throw error;
  if (error instanceof HostedWorkspaceUnavailable) throw new HostedOperationalError("data_store_unavailable");
  throw new HostedOperationalError("data_store_unavailable");
}

function requireCustomerWorkspace(workspaceId: string): void {
  if (!isCustomerHostedWorkspaceId(workspaceId)) throw new HostedOperationalError("workspace_not_found");
}

function decisionRecord(workspaceId: string, value: unknown): NexoraCanonicalDecisionRecord {
  if (!value || typeof value !== "object") throw new HostedOperationalError("invalid_record");
  const record = value as Partial<NexoraCanonicalDecisionRecord>;
  if (
    typeof record.decisionId !== "string" ||
    record.decisionId.trim().length === 0 ||
    typeof record.title !== "string" ||
    typeof record.status !== "string" ||
    !DECISION_STATUSES.has(record.status) ||
    typeof record.locked !== "boolean" ||
    !Array.isArray(record.subjectIds) ||
    !Array.isArray(record.evidenceRefs) ||
    !Array.isArray(record.uncertaintyRefs) ||
    record.workspaceId !== workspaceId
  ) {
    throw new HostedOperationalError("invalid_record");
  }
  return Object.freeze({ ...record, workspaceId }) as NexoraCanonicalDecisionRecord;
}

function executionRecord(
  workspaceId: string,
  value: unknown,
  decisionIds: ReadonlySet<string>,
): NexoraCanonicalExecution {
  if (!value || typeof value !== "object") throw new HostedOperationalError("invalid_record");
  const record = value as Partial<NexoraCanonicalExecution>;
  if (
    typeof record.executionId !== "string" ||
    record.executionId.trim().length === 0 ||
    typeof record.decisionId !== "string" ||
    !decisionIds.has(record.decisionId) ||
    typeof record.title !== "string" ||
    typeof record.status !== "string" ||
    !NEXORA_EXECUTION_STATUSES.includes(record.status) ||
    record.createdFromDecision !== true ||
    record.workspaceId !== workspaceId ||
    !Array.isArray(record.ownerIds) ||
    !Array.isArray(record.blockers) ||
    !Array.isArray(record.risks) ||
    !Array.isArray(record.milestones)
  ) {
    throw new HostedOperationalError("invalid_record");
  }
  return Object.freeze({ ...record, workspaceId }) as NexoraCanonicalExecution;
}

function sceneRecord(workspaceId: string, value: unknown): SceneOrgSavedScene {
  if (!value || typeof value !== "object") throw new HostedOperationalError("invalid_record");
  const record = value as SceneOrgSavedScene;
  if (record.managerWorkspaceId !== workspaceId) throw new HostedOperationalError("invalid_record");
  try {
    return createSceneOrgSavedScene(record);
  } catch {
    throw new HostedOperationalError("invalid_record");
  }
}

function uniqueIds(ids: readonly string[]): void {
  if (new Set(ids).size !== ids.length) throw new HostedOperationalError("invalid_record");
}

export async function replaceHostedDecisions(
  workspaceId: string,
  decisions: readonly unknown[],
  now = new Date(),
): Promise<readonly NexoraCanonicalDecisionRecord[]> {
  try {
    requireCustomerWorkspace(workspaceId);
    const records = decisions.map((decision) => decisionRecord(workspaceId, decision));
    uniqueIds(records.map((record) => record.decisionId));
    const db = await hostedWorkspaceDatabase();
    const updatedAt = now.toISOString();
    const ids = records.map((record) => record.decisionId);
    await db.transaction(async (tx) => {
      for (const record of records) {
        await tx.query(
          `INSERT INTO hosted_decision (workspace_id, decision_id, record_json, updated_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (workspace_id, decision_id)
           DO UPDATE SET record_json = EXCLUDED.record_json, updated_at = EXCLUDED.updated_at`,
          [workspaceId, record.decisionId, JSON.stringify(record), updatedAt],
        );
      }
      if (ids.length === 0) {
        await tx.query(`DELETE FROM hosted_decision WHERE workspace_id = $1`, [workspaceId]);
      } else {
        await tx.query(
          `DELETE FROM hosted_decision WHERE workspace_id = $1 AND NOT (decision_id = ANY($2::text[]))`,
          [workspaceId, ids],
        );
      }
    });
    return Object.freeze(records);
  } catch (error) {
    storeFailure(error);
  }
}

export async function replaceHostedExecutions(
  workspaceId: string,
  executions: readonly unknown[],
  now = new Date(),
): Promise<readonly NexoraCanonicalExecution[]> {
  try {
    requireCustomerWorkspace(workspaceId);
    const db = await hostedWorkspaceDatabase();
    const decisions = await db.query<{ decision_id: string }>(
      `SELECT decision_id FROM hosted_decision WHERE workspace_id = $1`,
      [workspaceId],
    );
    const decisionIds = new Set(decisions.rows.map((row) => row.decision_id));
    const records = executions.map((execution) => executionRecord(workspaceId, execution, decisionIds));
    uniqueIds(records.map((record) => record.executionId));
    const updatedAt = now.toISOString();
    await db.transaction(async (tx) => {
      await tx.query(`DELETE FROM hosted_execution WHERE workspace_id = $1`, [workspaceId]);
      for (const record of records) {
        await tx.query(
          `INSERT INTO hosted_execution (workspace_id, execution_id, decision_id, record_json, updated_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [workspaceId, record.executionId, record.decisionId, JSON.stringify(record), updatedAt],
        );
      }
    });
    return Object.freeze(records);
  } catch (error) {
    storeFailure(error);
  }
}

export async function replaceHostedSavedScenes(
  workspaceId: string,
  scenes: readonly unknown[],
  now = new Date(),
): Promise<readonly SceneOrgSavedScene[]> {
  try {
    requireCustomerWorkspace(workspaceId);
    const records = scenes.map((scene) => sceneRecord(workspaceId, scene));
    uniqueIds(records.map((scene) => scene.sceneId));
    if (records.filter((scene) => scene.kind === "DEFAULT_MANAGER").length > 1) {
      throw new HostedOperationalError("invalid_record");
    }
    const db = await hostedWorkspaceDatabase();
    const updatedAt = now.toISOString();
    await db.transaction(async (tx) => {
      await tx.query(`DELETE FROM hosted_saved_scene WHERE workspace_id = $1`, [workspaceId]);
      for (const scene of records) {
        await tx.query(
          `INSERT INTO hosted_saved_scene (workspace_id, scene_id, name, is_default, record_json, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [workspaceId, scene.sceneId, scene.name, scene.kind === "DEFAULT_MANAGER", JSON.stringify(scene), updatedAt],
        );
      }
    });
    return Object.freeze(records);
  } catch (error) {
    storeFailure(error);
  }
}

export async function replaceHostedDecisionExecution(
  workspaceId: string,
  input: { decisions?: readonly unknown[]; executions?: readonly unknown[] },
  now = new Date(),
): Promise<void> {
  try {
    requireCustomerWorkspace(workspaceId);
    const db = await hostedWorkspaceDatabase();
    const existing = await db.query<{ decision_id: string }>(
      `SELECT decision_id FROM hosted_decision WHERE workspace_id = $1`,
      [workspaceId],
    );
    const decisions = input.decisions?.map((decision) => decisionRecord(workspaceId, decision));
    if (decisions) uniqueIds(decisions.map((record) => record.decisionId));
    const decisionIds = new Set(
      decisions ? decisions.map((record) => record.decisionId) : existing.rows.map((row) => row.decision_id),
    );
    const executions = input.executions?.map((execution) => executionRecord(workspaceId, execution, decisionIds));
    if (executions) uniqueIds(executions.map((record) => record.executionId));
    if (decisions && !executions) {
      const linked = await db.query<{ decision_id: string }>(
        `SELECT decision_id FROM hosted_execution WHERE workspace_id = $1`,
        [workspaceId],
      );
      if (linked.rows.some((row) => !decisionIds.has(row.decision_id))) {
        throw new HostedOperationalError("invalid_record");
      }
    }
    const updatedAt = now.toISOString();
    await db.transaction(async (tx) => {
      if (executions) await tx.query(`DELETE FROM hosted_execution WHERE workspace_id = $1`, [workspaceId]);
      if (decisions) {
        for (const record of decisions) {
          await tx.query(
            `INSERT INTO hosted_decision (workspace_id, decision_id, record_json, updated_at)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (workspace_id, decision_id)
             DO UPDATE SET record_json = EXCLUDED.record_json, updated_at = EXCLUDED.updated_at`,
            [workspaceId, record.decisionId, JSON.stringify(record), updatedAt],
          );
        }
        const ids = decisions.map((record) => record.decisionId);
        if (ids.length === 0) {
          await tx.query(`DELETE FROM hosted_decision WHERE workspace_id = $1`, [workspaceId]);
        } else {
          await tx.query(
            `DELETE FROM hosted_decision WHERE workspace_id = $1 AND NOT (decision_id = ANY($2::text[]))`,
            [workspaceId, ids],
          );
        }
      }
      if (executions) {
        for (const record of executions) {
          await tx.query(
            `INSERT INTO hosted_execution (workspace_id, execution_id, decision_id, record_json, updated_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [workspaceId, record.executionId, record.decisionId, JSON.stringify(record), updatedAt],
          );
        }
      }
    });
  } catch (error) {
    storeFailure(error);
  }
}

export async function readHostedOperationalSnapshot(workspaceId: string): Promise<HostedOperationalSnapshot> {
  try {
    requireCustomerWorkspace(workspaceId);
    const db = await hostedWorkspaceDatabase();
    const decisions = await db.query<{ record_json: string }>(
      `SELECT record_json FROM hosted_decision WHERE workspace_id = $1 ORDER BY decision_id ASC`,
      [workspaceId],
    );
    const executions = await db.query<{ record_json: string }>(
      `SELECT record_json FROM hosted_execution WHERE workspace_id = $1 ORDER BY execution_id ASC`,
      [workspaceId],
    );
    const scenes = await db.query<{ record_json: string }>(
      `SELECT record_json FROM hosted_saved_scene WHERE workspace_id = $1 ORDER BY scene_id ASC`,
      [workspaceId],
    );
    return Object.freeze({
      workspaceId,
      decisions: Object.freeze(decisions.rows.map((row) => JSON.parse(row.record_json) as NexoraCanonicalDecisionRecord)),
      executions: Object.freeze(executions.rows.map((row) => JSON.parse(row.record_json) as NexoraCanonicalExecution)),
      scenes: Object.freeze(scenes.rows.map((row) => JSON.parse(row.record_json) as SceneOrgSavedScene)),
    });
  } catch (error) {
    storeFailure(error);
  }
}

/** Server records replace stale browser records for the same workspace. */
export function projectHostedOperationalRecords<T extends { readonly workspaceId?: string | null }>(
  serverRecords: readonly T[],
  staleBrowserRecords: readonly T[],
  workspaceId: string,
): readonly T[] {
  const elsewhere = staleBrowserRecords.filter((record) => record.workspaceId !== workspaceId);
  return Object.freeze([...elsewhere, ...serverRecords]);
}
