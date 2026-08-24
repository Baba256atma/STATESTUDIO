/**
 * MO:1 — generic object-aware manager intent.
 * Maps CC:1 kinds + utterance shape. Not per-object conversational code.
 */

import type { NexoraConversationalIntentKind } from "@/app/lib/conversational-control/conversationalIntent.ts";
import {
  normalizeNexoraConversationalUtterance,
  stripConversationalSignificanceQualifier,
} from "@/app/lib/conversational-control/conversationalIntentNormalization.ts";
import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import {
  MANAGER_OBJECT_INTENTS,
  type ManagerObjectIntent,
} from "./managerObjectInteractionFoundation.ts";
import {
  resolveExplanationLens,
  type ExplanationDepth,
  type ExplanationFocus,
} from "./managerObjectExplainEngine.ts";

export type ManagerObjectIntentResolution = {
  readonly intent: ManagerObjectIntent;
  readonly conversationalKind: NexoraConversationalIntentKind | "unknown";
  readonly namedHint: string | null;
  readonly usesActiveObject: boolean;
  readonly mentionedSubjectId: string | null;
  readonly explanationFocus: ExplanationFocus;
  readonly explanationDepth: ExplanationDepth;
};

export function stripManagerObjectSignificanceQualifier(raw: string): string {
  return stripConversationalSignificanceQualifier(raw);
}

export function findMentionedManagerObjectId(
  utterance: string,
  subjects: readonly NexoraConversationalSubjectRecord[],
): string | null {
  const normalized = normalizeNexoraConversationalUtterance(utterance);
  if (!normalized) return null;
  let best: { readonly id: string; readonly length: number } | null = null;
  for (const subject of subjects) {
    const names = [
      subject.canonicalName,
      subject.subjectId,
      ...(subject.aliases ?? []),
    ];
    for (const name of names) {
      const key = normalizeNexoraConversationalUtterance(name);
      if (!key) continue;
      const bounded = new RegExp(`(?:^|\\s)${escapeRegExp(key)}(?:$|\\s)`);
      if (!bounded.test(normalized)) continue;
      if (best == null || key.length > best.length) {
        best = { id: subject.subjectId, length: key.length };
      }
    }
  }
  return best?.id ?? null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function resolveManagerObjectIntent(input: {
  readonly utterance: string;
  readonly conversationalKind: NexoraConversationalIntentKind | "unknown";
  readonly hasNamedTargetHint: boolean;
  readonly subjects?: readonly NexoraConversationalSubjectRecord[];
}): ManagerObjectIntentResolution {
  const normalized = normalizeNexoraConversationalUtterance(input.utterance);
  const mentionedSubjectId = findMentionedManagerObjectId(
    input.utterance,
    input.subjects ?? [],
  );
  const usesActiveObject =
    !input.hasNamedTargetHint && mentionedSubjectId == null;
  const conversationalKind = input.conversationalKind;
  const intent = mapIntent(normalized, conversationalKind);
  const lens = resolveExplanationLens(input.utterance);

  return Object.freeze({
    intent,
    conversationalKind,
    namedHint: mentionedSubjectId,
    usesActiveObject,
    mentionedSubjectId,
    explanationFocus: lens.focus,
    explanationDepth: lens.depth,
  });
}

function mapIntent(
  normalized: string,
  kind: NexoraConversationalIntentKind | "unknown",
): ManagerObjectIntent {
  if (/what\s+happens\s+if\s+this\s+continues|if\s+this\s+continues/.test(normalized)) {
    return "IMPACT";
  }
  if (
    /what\s+don'?t\s+we\s+know|what\s+do\s+we\s+not\s+know|what\s+is\s+unknown|what\s+remains\s+unknown/.test(
      normalized,
    )
  ) {
    return "STATUS";
  }
  if (
    /what\s+happens\s+if\s+i\s+do\s+nothing|is\s+there\s+(?:a\s+)?(?:problem|risk)/.test(
      normalized,
    ) ||
    kind === "risk"
  ) {
    return "RISK";
  }
  if (
    /what\s+(?:is|are)\s+connected|what\s+is\s+connected\s+to|what\s+does\s+(?:it|this)\s+affect|what\s+is\s+affected|show\s+(?:me\s+)?(?:the\s+)?related/.test(
      normalized,
    ) ||
    kind === "show-related"
  ) {
    return "RELATIONSHIPS";
  }
  if (
    /what\s+are\s+my\s+options|what\s+options\s+do\s+i\s+have|compare/.test(
      normalized,
    ) ||
    kind === "compare" ||
    kind === "compare-scenarios"
  ) {
    return "OPTIONS";
  }
  if (
    /what\s+should\s+i\s+look\s+at\s+next|where\s+should\s+i\s+look\s+next|what\s+should\s+i\s+explore\s+next|where\s+should\s+i\s+go\s+next|what\s+should\s+i\s+look\s+at\s+first|which\s+path\s+moves|what\s+is\s+blocking\s+the\s+goal/.test(
      normalized,
    ) ||
    /what\s+should\s+happen\s+next|what\s+can\s+i\s+do|what\s+should\s+i\s+do\s+next/.test(normalized)
  ) {
    return "NEXT_ACTION";
  }
  if (
    /what\s+do\s+you\s+recommend|what\s+should\s+i\s+do/.test(normalized) ||
    kind === "recommend"
  ) {
    return "RECOMMEND";
  }
  if (
    /what\s+decision\s+is\s+required|do\s+i\s+need\s+to\s+make\s+a\s+decision/.test(
      normalized,
    ) ||
    kind === "decision-status" ||
    kind === "commit-decision" ||
    kind === "prefer-option" ||
    kind === "confirm-decision-commitment"
  ) {
    return "DECIDE";
  }
  if (
    kind === "explore-scenario" ||
    kind === "show-scenarios" ||
    kind === "define-scenario" ||
    kind === "explain-scenario" ||
    kind === "modify-scenario"
  ) {
    return "SCENARIO";
  }
  if (kind === "show-execution" || kind === "execution-status") {
    if (/what\s+happened|outcome/.test(normalized)) return "OUTCOME";
    return "EXECUTION";
  }
  if (kind === "change") return "IMPACT";
  if (
    /what\s+is\s+my\s+current\s+goal|how\s+is\s+this\s+related\s+to\s+my\s+goal|are\s+we\s+moving\s+toward\s+the\s+goal/.test(
      normalized,
    ) ||
    /(?:my|our)\s+goal\s+is|priority\s+is|is\s+now\s+the\s+priority/.test(
      normalized,
    ) ||
    /where\s+are\s+we|what\s+have\s+we\s+done|still\s+unresolved|what\s+is\s+blocking\s+us|why\s+is\s+it\s+blocking|how\s+does\s+this\s+help\s+my\s+goal|where\s+does\s+.+\s+fit|have\s+we\s+made\s+a\s+decision|has\s+execution\s+started|do\s+we\s+have\s+an\s+outcome|did\s+it\s+move\s+us\s+toward\s+the\s+goal|what\s+did\s+we\s+learn|are\s+we\s+finished/.test(
      normalized,
    )
  ) {
    return "STATUS";
  }
  if (
    /what\s+about\s+/.test(normalized)
  ) {
    return "STATUS";
  }
  if (
    kind === "prioritize" ||
    /what\s+should\s+i\s+pay\s+attention\s+to|what\s+needs\s+my\s+attention|what\s+is\s+most\s+important\s+right\s+now|do\s+i\s+need\s+to\s+intervene|should\s+i\s+intervene|what\s+can\s+continue\s+without\s+me|can\s+i\s+leave\s+this\s+alone|is\s+anything\s+getting\s+(?:worse|better)|urgent\s+opportunities|is\s+the\s+evidence\s+current|should\s+i\s+review\s+this|is\s+execution\s+okay/.test(
      normalized,
    )
  ) {
    return "STATUS";
  }
  if (
    /^why\b/.test(normalized) ||
    /why\s+is\s+.+\s+(?:critical|important|happening)/.test(normalized)
  ) {
    return "WHY";
  }
  if (kind === "explain") {
    return /^why\b/.test(normalized) ? "WHY" : "EXPLAIN";
  }
  if (kind === "situation" || kind === "evidence") return "STATUS";
  if (kind === "focus" || kind === "explore") return "STATUS";
  void MANAGER_OBJECT_INTENTS;
  return "EXPLAIN";
}
