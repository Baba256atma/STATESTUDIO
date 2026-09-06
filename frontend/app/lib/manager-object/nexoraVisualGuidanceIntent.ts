/**
 * Resolves whether a manager utterance is a visual-of-evidence request.
 * Not an onboarding parser. Does not map phrases to chart libraries.
 * Collection, object, and UI-locate requests remain non-visual.
 */

import type {
  NexoraVisualPurpose,
  NexoraVisualRepresentation,
} from "@/app/lib/director/nexoraVisualIntelligence.ts";

export type NexoraVisualGuidanceKind =
  | "RESOLVE"
  | "INSPECT"
  | "DISMISS"
  | "NONE";

export type NexoraVisualInspectKind =
  | "EXPLAIN"
  | "WHY"
  | "PROVENANCE"
  | "CAUSE"
  | "DECISION"
  | "CHANGE";

export type NexoraVisualGuidanceIntent = {
  readonly kind: NexoraVisualGuidanceKind;
  readonly purpose: NexoraVisualPurpose;
  readonly inspect: NexoraVisualInspectKind | null;
  readonly subjectId: string | null;
  readonly requestedMonths: number | null;
  readonly requestedRepresentation: NexoraVisualRepresentation | null;
  readonly comparableIds: readonly string[] | null;
};

const NONE: NexoraVisualGuidanceIntent = Object.freeze({
  kind: "NONE",
  purpose: "NONE",
  inspect: null,
  subjectId: null,
  requestedMonths: null,
  requestedRepresentation: null,
  comparableIds: null,
});

const COLLECTION_SHOW =
  /\b(?:problems?|issues?|scenarios?|decisions?|executions?|goals?|risks?)\b/;

function normalize(utterance: string): string {
  return utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveNexoraVisualGuidanceIntent(input: {
  readonly utterance: string;
}): NexoraVisualGuidanceIntent {
  const text = normalize(input.utterance);
  if (!text) return NONE;

  if (COLLECTION_SHOW.test(text) && /\b(?:show|see|list|open|bring|compare)\b/.test(text)) {
    return NONE;
  }
  if (/where (?:is|are) (?:the )?data/.test(text)) return NONE;
  if (/show me where (?:i |to )?add (?:my )?data/.test(text)) return NONE;
  if (/how do i add (?:my )?data/.test(text)) return NONE;
  if (/show capacity problem|show the capacity problem/.test(text)) return NONE;
  if (/^show me$/.test(text)) return NONE;

  if (
    /^(?:close|dismiss|hide|put away) (?:the )?(?:view|chart|visual|trend)$/.test(text) ||
    text === "put the view away"
  ) {
    return Object.freeze({
      ...NONE,
      kind: "DISMISS" as const,
    });
  }

  if (/what data is this using|where did this (?:chart|view) come from/.test(text)) {
    return inspect("PROVENANCE");
  }
  if (/why (?:did you (?:choose|show)|this visual|this view)/.test(text)) {
    return inspect("WHY");
  }
  if (/what does this show/.test(text)) return inspect("EXPLAIN");
  if (
    /\bprove(?:s|d)?\b|\bcaused\b|\bcaus(?:e|ality)\b|does this prove why|does (?:this|the) (?:visual|trend|chart) prove/.test(
      text,
    )
  ) {
    return inspect("CAUSE");
  }
  if (/should (?:we )?choose scenario|does this mean we should/.test(text)) {
    return inspect("DECISION");
  }
  if (/can i change the (?:chart|view)|show (?:this|it) another way/.test(text)) {
    return inspect("CHANGE");
  }

  const requestedRepresentation = /as a bar chart|bar chart/.test(text)
    ? ("COMPARISON_BARS" as const)
    : /as a line chart|line chart/.test(text)
      ? ("TREND_LINE" as const)
      : null;

  const requestedMonths = /\b(?:six|6) months?\b/.test(text) ? 6 : null;
  const subjectId = /\bvalue\b/.test(text) && !/delivery|otd/.test(text)
    ? "value"
    : /delivery|otd/.test(text)
      ? "delivery"
      : null;

  if (
    /compare (?:these|them|the two)|compare delivery/.test(text) ||
    /^compare\b/.test(text)
  ) {
    const visualCompare =
      /two periods|across the (?:two )?periods|delivery across|otd and ord|values|observations|bar chart/.test(
        text,
      );
    if (!visualCompare) {
      return NONE;
    }
    const comparableIds = /two periods|across the (?:two )?periods|delivery across/.test(
      text,
    )
      ? Object.freeze(["otd-periods", "otd-periods"])
      : /otd and ord/.test(text)
        ? Object.freeze(["otd", "ord-qty"])
        : null;
    return Object.freeze({
      kind: "RESOLVE" as const,
      purpose: "COMPARE" as const,
      inspect: null,
      subjectId,
      requestedMonths,
      requestedRepresentation,
      comparableIds,
    });
  }

  const visualShape =
    /over time|how has .+ changed|how .+ changed|\btrend\b|last (?:six|6) months|history visually|what does this data look like|show me delivery over time|show delivery over time/.test(
      text,
    );
  if (visualShape || requestedRepresentation) {
    return Object.freeze({
      kind: "RESOLVE" as const,
      purpose: "TREND" as const,
      inspect: null,
      subjectId,
      requestedMonths,
      requestedRepresentation,
      comparableIds: null,
    });
  }

  return NONE;
}

function inspect(kind: NexoraVisualInspectKind): NexoraVisualGuidanceIntent {
  return Object.freeze({
    ...NONE,
    kind: "INSPECT" as const,
    inspect: kind,
  });
}
