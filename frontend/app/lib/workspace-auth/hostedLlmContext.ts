/**
 * HOSTED-MVP:5 — server-built LLM context for one authorized workspace.
 *
 * The browser may supply the manager message. Workspace evidence comes
 * from the Hosted rows for that workspace.
 */

import { nexoraLlmManagementContextIdentity } from "@/app/lib/conversational-control/nexoraLlmManagementContext.ts";
import { nmiAdvisorIdentity } from "@/app/lib/nmi/nmiAdvisorIdentity.ts";

import { readHostedOperationalSnapshot } from "./hostedOperationalPersistence.ts";
import { hostedWorkspaceDatabase } from "./hostedWorkspaceStore.ts";

export const HOSTED_LLM_UTTERANCE_CHARS = 240;
export const HOSTED_LLM_VALUE_CHARS = 160;
export const HOSTED_LLM_ID_CHARS = 128;

export type HostedLlmEvidence = Readonly<{
  observations: readonly Readonly<{ metric: string; value: string }>[];
  decisions: readonly Readonly<{ id: string; title: string | null }>[];
  executions: readonly Readonly<{ id: string; title: string | null }>[];
}>;

function clip(value: string, limit: number): string {
  return value.trim().slice(0, limit);
}

export function projectHostedLlmManagementContext(input: {
  readonly workspaceId: string;
  readonly utterance: string;
  readonly evidence: HostedLlmEvidence;
}): Readonly<Record<string, unknown>> {
  const observations = input.evidence.observations.slice(0, 4).map((observation) => Object.freeze({
    id: clip(observation.metric, HOSTED_LLM_ID_CHARS),
    kind: "observation",
    label: clip(observation.metric, HOSTED_LLM_VALUE_CHARS),
    value: clip(observation.value, HOSTED_LLM_VALUE_CHARS),
    provenanceId: input.workspaceId,
    epistemic: "accepted",
  }));
  const decision = input.evidence.decisions[0];
  const execution = input.evidence.executions[0];
  return Object.freeze({
    identity: nexoraLlmManagementContextIdentity,
    workspaceId: input.workspaceId,
    subject: Object.freeze({
      canonicalId: observations[0]?.id ?? null,
      label: observations[0]?.label ?? null,
      kind: observations[0] ? "observation" : null,
      epistemic: observations[0] ? "accepted" : null,
    }),
    referent: Object.freeze({ canonicalId: null, provenance: input.workspaceId }),
    management: Object.freeze({ projection: nmiAdvisorIdentity, refs: Object.freeze([]) }),
    dataReality: Object.freeze({
      projections: Object.freeze(["hosted-observation"]),
      refs: Object.freeze(observations),
    }),
    conversation: Object.freeze({
      projection: "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
      currentUtterance: clip(input.utterance, HOSTED_LLM_UTTERANCE_CHARS),
      previousUtterance: null,
      frames: Object.freeze([]),
    }),
    evidence: Object.freeze({ refs: Object.freeze(observations) }),
    scenario: Object.freeze({ refs: Object.freeze([]) }),
    decision: Object.freeze({
      refs: Object.freeze(decision ? [Object.freeze({
        id: clip(decision.id, HOSTED_LLM_ID_CHARS),
        kind: "decision",
        label: clip(decision.title ?? decision.id, HOSTED_LLM_VALUE_CHARS),
        value: execution ? clip(execution.title ?? execution.id, HOSTED_LLM_VALUE_CHARS) : null,
        provenanceId: input.workspaceId,
        epistemic: "recorded",
      })] : []),
    }),
  });
}

export async function readHostedLlmEvidence(workspaceId: string): Promise<HostedLlmEvidence> {
  const db = await hostedWorkspaceDatabase();
  const observations = await db.query<{ metric_id: string; value_text: string }>(
    `SELECT metric_id, value_text FROM hosted_observation
     WHERE workspace_id = $1
     ORDER BY row_number ASC, observation_id ASC
     LIMIT 4`,
    [workspaceId],
  );
  const operational = await readHostedOperationalSnapshot(workspaceId);
  return Object.freeze({
    observations: Object.freeze(observations.rows.map((row) => Object.freeze({
      metric: row.metric_id,
      value: row.value_text,
    }))),
    decisions: Object.freeze(operational.decisions.slice(0, 1).map((decision) => Object.freeze({
      id: decision.decisionId,
      title: "title" in decision && typeof decision.title === "string" ? decision.title : null,
    }))),
    executions: Object.freeze(operational.executions.slice(0, 1).map((execution) => Object.freeze({
      id: execution.executionId,
      title: execution.title,
    }))),
  });
}

export function hostedLlmRequestPayload(input: {
  readonly workspaceId: string;
  readonly turnId: unknown;
  readonly deterministicResponse: unknown;
  readonly experienceStatus: unknown;
  readonly utterance: unknown;
  readonly evidence: HostedLlmEvidence;
}): Readonly<Record<string, unknown>> {
  const turnId = typeof input.turnId === "string" ? clip(input.turnId, HOSTED_LLM_ID_CHARS) : "";
  const deterministicResponse = typeof input.deterministicResponse === "string"
    ? input.deterministicResponse.slice(0, 2000)
    : "";
  const experienceStatus = typeof input.experienceStatus === "string"
    ? clip(input.experienceStatus, 64)
    : "applied";
  return Object.freeze({
    turnId,
    deterministicResponse,
    experienceStatus,
    workspaceId: input.workspaceId,
    managementContext: projectHostedLlmManagementContext({
      workspaceId: input.workspaceId,
      utterance: typeof input.utterance === "string" ? input.utterance : "",
      evidence: input.evidence,
    }),
  });
}
