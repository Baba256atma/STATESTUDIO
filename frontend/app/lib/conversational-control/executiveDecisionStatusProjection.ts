/**
 * CC:10R.1 — Pure Decision status serialization / projection.
 *
 * Canonical product semantics remain EXS1 vocabulary.
 * flowDomain kebab tokens are serialization only — not a second state machine.
 */

import type { NexoraExecutiveDecisionStatus } from "./executiveDecisionTransition.ts";
import type { NexoraCanonicalDecisionRecord } from "./executiveDecisionRuntimeAdapter.ts";

/** flowDomain / Stage serialized Decision status tokens. */
export type NexoraFlowDecisionStatusProjection =
  | "draft"
  | "under-review"
  | "approved"
  | "rejected"
  | "archived";

const CANONICAL_TO_FLOW: Readonly<
  Record<NexoraExecutiveDecisionStatus, NexoraFlowDecisionStatusProjection>
> = Object.freeze({
  Draft: "draft",
  "Under Review": "under-review",
  Approved: "approved",
  Rejected: "rejected",
  Archived: "archived",
});

const FLOW_TO_CANONICAL: Readonly<
  Record<NexoraFlowDecisionStatusProjection, NexoraExecutiveDecisionStatus>
> = Object.freeze({
  draft: "Draft",
  "under-review": "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
});

/**
 * Serialize canonical status → flow/Stage kebab projection.
 * Locked is a separate flag — never encoded as status "locked".
 */
export function serializeCanonicalDecisionStatus(
  status: NexoraExecutiveDecisionStatus,
): NexoraFlowDecisionStatusProjection {
  return CANONICAL_TO_FLOW[status];
}

/**
 * Deserialize flow kebab → canonical status.
 * Legacy token "locked" projects as Approved (lock is separate).
 */
export function deserializeFlowDecisionStatus(
  status: string,
): NexoraExecutiveDecisionStatus | null {
  const normalized = status.trim().toLowerCase();
  if (normalized === "locked") {
    return "Approved";
  }
  if (normalized in FLOW_TO_CANONICAL) {
    return FLOW_TO_CANONICAL[
      normalized as NexoraFlowDecisionStatusProjection
    ];
  }
  // Accept already-canonical labels.
  if (
    status === "Draft" ||
    status === "Under Review" ||
    status === "Approved" ||
    status === "Rejected" ||
    status === "Archived"
  ) {
    return status;
  }
  return null;
}

export type FlowDecisionProjectionRecord = {
  readonly id: string;
  readonly status: NexoraFlowDecisionStatusProjection;
  readonly locked: boolean;
  readonly label: string;
  readonly sourceScenarioId: string | null;
  readonly sourceProblemId: string | null;
  readonly objectId: string | null;
};

/**
 * Project a canonical Decision into flowDomain fixture shape.
 */
export function projectCanonicalDecisionToFlowRecord(
  decision: NexoraCanonicalDecisionRecord,
  seed?: {
    readonly sourceScenarioId?: string | null;
    readonly sourceProblemId?: string | null;
    readonly objectId?: string | null;
    readonly label?: string;
  },
): FlowDecisionProjectionRecord {
  return Object.freeze({
    id: decision.decisionId,
    status: serializeCanonicalDecisionStatus(decision.status),
    locked: decision.locked,
    label: seed?.label ?? decision.title,
    sourceScenarioId:
      seed?.sourceScenarioId ?? decision.scenarioId ?? null,
    sourceProblemId: seed?.sourceProblemId ?? null,
    objectId: seed?.objectId ?? null,
  });
}

/**
 * Bootstrap canonical records from flow fixture definitions (read-only seed).
 */
export function bootstrapCanonicalDecisionsFromFlowFixtures(
  fixtures: readonly {
    readonly id: string;
    readonly status: string;
    readonly label: string;
    readonly sourceScenarioId: string | null;
    readonly sourceProblemId?: string | null;
    readonly objectId?: string | null;
    readonly locked?: boolean;
  }[],
): readonly NexoraCanonicalDecisionRecord[] {
  return Object.freeze(
    fixtures.map((fixture) => {
      const status =
        deserializeFlowDecisionStatus(fixture.status) ?? "Under Review";
      const locked =
        fixture.locked ??
        (status === "Approved" || fixture.status === "locked");
      return Object.freeze({
        decisionId: fixture.id,
        title: fixture.label,
        status,
        locked,
        subjectIds: Object.freeze([] as string[]),
        scenarioId: fixture.sourceScenarioId ?? undefined,
        evidenceRefs: Object.freeze([]),
        uncertaintyRefs: Object.freeze([]),
        committedBy: "manager" as const,
        committedAt: status === "Approved" ? "2026-08-15T00:00:00.000Z" : undefined,
        source: "conversation" as const,
        workspaceId: null,
        modelId: null,
      });
    }),
  );
}
