/**
 * MO:1 — Explain Engine handoff contract.
 * Prepares object + intent + context + evidence + relationships.
 * Does not implement a per-object explanation engine.
 */

import type { ManagerObjectContext } from "./managerObjectContext.ts";
import type { ManagerObjectGuidance } from "./managerObjectGuidance.ts";
import { composeExecutiveObjectExplanation } from "./managerObjectExplainEngine.ts";
import type {
  ManagerObjectIntent,
  ManagerObjectSupportStatus,
} from "./managerObjectInteractionFoundation.ts";

export const MANAGER_OBJECT_EXPLAIN_HANDOFF_VERSION = "MO:1/ExplainEngineHandoff" as const;

export type ManagerObjectExplainHandoffRequest = {
  readonly version: typeof MANAGER_OBJECT_EXPLAIN_HANDOFF_VERSION;
  readonly objectId: string | null;
  readonly intent: ManagerObjectIntent;
  readonly context: ManagerObjectContext;
  readonly evidenceSupport: ManagerObjectSupportStatus;
  readonly relationshipIds: readonly string[];
};

export type ManagerObjectExplainHandoffResponse = {
  readonly version: typeof MANAGER_OBJECT_EXPLAIN_HANDOFF_VERSION;
  readonly explanation: string;
  readonly significance: string;
  readonly evidence: string;
  readonly uncertainty: string;
  readonly suggestedNextQuestions: readonly string[];
  readonly suggestedNextActions: readonly string[];
  readonly fabricated: false;
};

export function buildManagerObjectExplainHandoffRequest(input: {
  readonly objectId: string | null;
  readonly intent: ManagerObjectIntent;
  readonly context: ManagerObjectContext;
}): ManagerObjectExplainHandoffRequest {
  const evidenceSupport =
    input.context.kpi.support === "KNOWN"
      ? "KNOWN"
      : input.context.executiveMeaning.support === "KNOWN"
        ? "INFERRED"
        : "UNKNOWN";
  return Object.freeze({
    version: MANAGER_OBJECT_EXPLAIN_HANDOFF_VERSION,
    objectId: input.objectId,
    intent: input.intent,
    context: input.context,
    evidenceSupport,
    relationshipIds: Object.freeze(
      input.context.relationships.map((edge) => edge.relationshipId),
    ),
  });
}

/**
 * MO:1 preview adapter over the MO:2 generic composer.
 * Callers must not special-case individual objects.
 */
export function previewManagerObjectExplanation(
  request: ManagerObjectExplainHandoffRequest,
  guidance: ManagerObjectGuidance,
): ManagerObjectExplainHandoffResponse {
  const composed = composeExecutiveObjectExplanation({
    request,
    guidance,
    focus: "overview",
    depth: "STANDARD",
  });
  const evidenceText =
    composed.evidence[0]?.text ??
    "KPI / evidence for this object is currently unknown.";
  const status =
    request.intent === "IMPACT" || composed.epistemicStatus === "PREDICTED"
      ? composed.epistemicStatus
      : request.evidenceSupport;
  const uncertainty =
    status === "UNKNOWN"
      ? `UNKNOWN — ${composed.uncertainty ?? "insufficient evidence. Nexora will not convert this into a confident claim."}`
      : status === "INFERRED"
        ? `INFERRED — ${composed.uncertainty ?? "derived from recorded relationships, not direct observation."}`
        : status === "PREDICTED"
          ? `PREDICTED — ${composed.uncertainty ?? "forward-looking result, not an observed fact."}`
          : `KNOWN — ${composed.uncertainty ?? "supported by runtime/evidence."}`;

  return Object.freeze({
    version: MANAGER_OBJECT_EXPLAIN_HANDOFF_VERSION,
    explanation: composed.managerFacingText || composed.summary || "",
    significance: composed.significance ?? "Why this object matters is currently unknown.",
    evidence: evidenceText,
    uncertainty,
    suggestedNextQuestions: composed.recommendedNextQuestions,
    suggestedNextActions: Object.freeze(
      composed.availableActions.map((action) => action.label),
    ),
    fabricated: false,
  });
}
