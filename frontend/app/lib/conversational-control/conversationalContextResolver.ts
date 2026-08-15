/**
 * CC:2 — Deterministic Executive Context Resolver.
 *
 * Consumes CC:1 intent + target hints and an injected subject registry.
 * Resolves canonical subject IDs. Does not execute or mutate Runtime/Stage/Director.
 */

import {
  CONVERSATIONAL_CONTEXT_PRECEDENCE,
  CONVERSATIONAL_CONTEXT_REASON,
  type NexoraActiveStageContextSnapshot,
  type NexoraConversationContextSnapshot,
  type NexoraConversationalContextResolution,
  type NexoraConversationalContextTrace,
  type NexoraConversationalResolvedSubject,
  type NexoraConversationalResolutionSource,
  type NexoraConversationalResolutionStatus,
  type NexoraConversationalSubjectRecord,
  type NexoraExecutiveConversationalContextInput,
  type NexoraResolvedConversationalContext,
} from "./conversationalContext.ts";
import type {
  NexoraConversationalIntent,
  NexoraConversationalTargetHint,
} from "./conversationalIntent.ts";
import {
  buildNexoraConversationalSubjectMatchIndex,
  findCanonicalSubjectMatchesForHint,
  type NexoraConversationalSubjectMatchIndex,
} from "./conversationalSubjectRegistry.ts";

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Math.round(value * 1000) / 1000;
}

function toResolved(
  record: NexoraConversationalSubjectRecord,
  matchedHint?: string,
): NexoraConversationalResolvedSubject {
  return Object.freeze({
    subjectKind: record.subjectKind,
    subjectId: record.subjectId,
    canonicalName: record.canonicalName,
    ...(matchedHint ? { matchedHint } : {}),
  });
}

function lookupById(
  subjectId: string | null | undefined,
  index: NexoraConversationalSubjectMatchIndex,
): NexoraConversationalSubjectRecord | null {
  if (!subjectId) return null;
  return index.subjectsById.get(subjectId) ?? null;
}

function intentRequiresSubject(intent: NexoraConversationalIntent): boolean {
  if (intent.kind === "prepare-context" || intent.kind === "switch-workspace") {
    // Experience intents need a subject only when an explicit subject hint is present.
    return intent.requiresTarget === true;
  }
  if (intent.requiresTarget) return true;
  if (intent.requiresContext) return true;
  switch (intent.kind) {
    case "overview":
    case "navigate-back":
    case "navigate-forward":
    case "unknown":
      return false;
    case "show-problems":
    case "show-goals":
    case "show-scenarios":
    case "show-decisions":
    case "show-execution":
    case "show-related":
      // Collection without anchor → subject not required.
      return intent.requiresTarget === true || intent.requiresContext === true;
    default:
      return intent.requiresTarget === true;
  }
}

type HintResolution =
  | {
      readonly status: "resolved";
      readonly subject: NexoraConversationalResolvedSubject;
      readonly candidates: readonly string[];
      readonly reasons: readonly string[];
    }
  | {
      readonly status: "ambiguous";
      readonly candidates: readonly string[];
      readonly reasons: readonly string[];
    }
  | {
      readonly status: "not-found";
      readonly candidates: readonly string[];
      readonly reasons: readonly string[];
    };

function resolveHint(
  hint: NexoraConversationalTargetHint,
  index: NexoraConversationalSubjectMatchIndex,
): HintResolution {
  const matches = findCanonicalSubjectMatchesForHint(hint.raw, index);
  const candidateIds = Object.freeze(matches.map((m) => m.subjectId));

  if (matches.length === 0) {
    return {
      status: "not-found",
      candidates: candidateIds,
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.CANONICAL_SUBJECT_NOT_FOUND,
        CONVERSATIONAL_CONTEXT_REASON.NO_SYNTHESIZED_ID,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
    };
  }

  if (matches.length > 1) {
    return {
      status: "ambiguous",
      candidates: candidateIds,
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.MULTIPLE_CANONICAL_MATCHES,
        CONVERSATIONAL_CONTEXT_REASON.NO_SYNTHESIZED_ID,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
    };
  }

  const only = matches[0]!;
  return {
    status: "resolved",
    subject: toResolved(only, hint.raw),
    candidates: candidateIds,
    reasons: Object.freeze([
      CONVERSATIONAL_CONTEXT_REASON.EXPLICIT_TARGET_MATCH,
      CONVERSATIONAL_CONTEXT_REASON.CANONICAL_SUBJECT_MATCH,
      CONVERSATIONAL_CONTEXT_REASON.ID_FROM_REGISTRY_ONLY,
      CONVERSATIONAL_CONTEXT_REASON.NO_SYNTHESIZED_ID,
      CONVERSATIONAL_CONTEXT_REASON.EXPLICIT_TARGET_PRECEDENCE,
      CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
    ]),
  };
}

function resolveFromConversationContext(
  conversationContext: NexoraConversationContextSnapshot | null | undefined,
  index: NexoraConversationalSubjectMatchIndex,
): {
  readonly subject: NexoraConversationalResolvedSubject | null;
  readonly reasons: readonly string[];
  readonly contextCandidates: readonly string[];
  readonly status: "resolved" | "missing-context" | "unknown-id";
} {
  const candidates: string[] = [];
  if (conversationContext?.currentSubjectId) {
    candidates.push(conversationContext.currentSubjectId);
  }
  for (const id of conversationContext?.previousSubjectIds ?? []) {
    candidates.push(id);
  }

  const current = lookupById(conversationContext?.currentSubjectId, index);
  if (conversationContext?.currentSubjectId && !current) {
    return {
      subject: null,
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.UNKNOWN_SUBJECT_IN_CONTEXT,
        CONVERSATIONAL_CONTEXT_REASON.MISSING_CONVERSATION_CONTEXT,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
      contextCandidates: Object.freeze(candidates),
      status: "unknown-id",
    };
  }

  if (current) {
    return {
      subject: toResolved(current),
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.RESOLVED_FROM_CURRENT_SUBJECT,
        CONVERSATIONAL_CONTEXT_REASON.ID_FROM_REGISTRY_ONLY,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
      contextCandidates: Object.freeze(candidates),
      status: "resolved",
    };
  }

  const previousIds = conversationContext?.previousSubjectIds ?? [];
  for (const id of previousIds) {
    const prev = lookupById(id, index);
    if (prev) {
      return {
        subject: toResolved(prev),
        reasons: Object.freeze([
          CONVERSATIONAL_CONTEXT_REASON.RESOLVED_FROM_PREVIOUS_SUBJECT,
          CONVERSATIONAL_CONTEXT_REASON.ID_FROM_REGISTRY_ONLY,
          CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
        ]),
        contextCandidates: Object.freeze(candidates),
        status: "resolved",
      };
    }
  }

  return {
    subject: null,
    reasons: Object.freeze([
      CONVERSATIONAL_CONTEXT_REASON.MISSING_CONVERSATION_CONTEXT,
      CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
    ]),
    contextCandidates: Object.freeze(candidates),
    status: "missing-context",
  };
}

function resolveFromStageContext(
  stage: NexoraActiveStageContextSnapshot | null | undefined,
  allow: boolean,
  index: NexoraConversationalSubjectMatchIndex,
): {
  readonly subject: NexoraConversationalResolvedSubject | null;
  readonly reasons: readonly string[];
  readonly contextCandidates: readonly string[];
} {
  if (!allow) {
    return {
      subject: null,
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.STAGE_CONTEXT_NOT_PERMITTED,
      ]),
      contextCandidates: Object.freeze([]),
    };
  }

  const candidates: string[] = [];
  if (stage?.focusedSubjectId) candidates.push(stage.focusedSubjectId);
  if (stage?.selectedSubjectId) candidates.push(stage.selectedSubjectId);

  const focused = lookupById(stage?.focusedSubjectId, index);
  if (focused) {
    return {
      subject: toResolved(focused),
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.RESOLVED_FROM_STAGE_FOCUS,
        CONVERSATIONAL_CONTEXT_REASON.ID_FROM_REGISTRY_ONLY,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
      contextCandidates: Object.freeze(candidates),
    };
  }

  const selected = lookupById(stage?.selectedSubjectId, index);
  if (selected) {
    return {
      subject: toResolved(selected),
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.RESOLVED_FROM_STAGE_SELECTION,
        CONVERSATIONAL_CONTEXT_REASON.ID_FROM_REGISTRY_ONLY,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
      contextCandidates: Object.freeze(candidates),
    };
  }

  return {
    subject: null,
    reasons: Object.freeze([
      CONVERSATIONAL_CONTEXT_REASON.MISSING_CONVERSATION_CONTEXT,
      CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
    ]),
    contextCandidates: Object.freeze(candidates),
  };
}

function orderedHints(
  hints: readonly NexoraConversationalTargetHint[],
): readonly NexoraConversationalTargetHint[] {
  // Experience hints belong to CC:6 — never resolve as executive subjects.
  const subjectHints = hints.filter((h) => h.role !== "experience");
  const ordinals = subjectHints.filter((h) => h.role === "ordinal");
  if (ordinals.length > 0) {
    return Object.freeze([...ordinals]);
  }
  const left = subjectHints.filter(
    (h) => h.role === "compare-left" || h.role === "primary",
  );
  const right = subjectHints.filter(
    (h) => h.role === "compare-right" || h.role === "secondary",
  );
  const rest = subjectHints.filter(
    (h) =>
      h.role !== "compare-left" &&
      h.role !== "compare-right" &&
      h.role !== "primary" &&
      h.role !== "secondary" &&
      h.role !== "ordinal",
  );
  // Preserve utterance order when roles are compare-left/right or primary-first.
  if (left.length || right.length) {
    return Object.freeze([...left, ...right, ...rest]);
  }
  return Object.freeze([...subjectHints]);
}

function resolveOrdinalHint(
  hint: NexoraConversationalTargetHint,
  conversationContext: NexoraConversationContextSnapshot | null | undefined,
  index: NexoraConversationalSubjectMatchIndex,
): HintResolution {
  const token = hint.raw.trim().toLowerCase();
  const presented = conversationContext?.presentedSubjectIds ?? [];

  if (token === "previous") {
    const previousId = conversationContext?.previousSubjectIds?.[0] ?? null;
    const record = lookupById(previousId, index);
    if (!record) {
      return {
        status: "not-found",
        candidates: Object.freeze(previousId ? [previousId] : []),
        reasons: Object.freeze([
          CONVERSATIONAL_CONTEXT_REASON.PRESENTED_SET_MISSING_FOR_ORDINAL,
          CONVERSATIONAL_CONTEXT_REASON.MISSING_CONVERSATION_CONTEXT,
          CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
        ]),
      };
    }
    return {
      status: "resolved",
      subject: toResolved(record, hint.raw),
      candidates: Object.freeze([record.subjectId]),
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.RESOLVED_FROM_PREVIOUS_SUBJECT,
        CONVERSATIONAL_CONTEXT_REASON.ID_FROM_REGISTRY_ONLY,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
    };
  }

  if (presented.length === 0) {
    return {
      status: "not-found",
      candidates: Object.freeze([]),
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.PRESENTED_SET_MISSING_FOR_ORDINAL,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
    };
  }

  const ordinalIndex =
    token === "first" ? 0 : token === "second" ? 1 : token === "third" ? 2 : -1;
  if (ordinalIndex < 0) {
    return {
      status: "not-found",
      candidates: Object.freeze([...presented]),
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.ORDINAL_OUT_OF_RANGE,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
    };
  }

  const subjectId = presented[ordinalIndex] ?? null;
  if (!subjectId) {
    return {
      status: "not-found",
      candidates: Object.freeze([...presented]),
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.ORDINAL_OUT_OF_RANGE,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
    };
  }

  const record = lookupById(subjectId, index);
  if (!record) {
    return {
      status: "not-found",
      candidates: Object.freeze([...presented]),
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.UNKNOWN_SUBJECT_IN_CONTEXT,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
    };
  }

  return {
    status: "resolved",
    subject: toResolved(record, hint.raw),
    candidates: Object.freeze([...presented]),
    reasons: Object.freeze([
      CONVERSATIONAL_CONTEXT_REASON.RESOLVED_FROM_PRESENTED_SET_ORDINAL,
      CONVERSATIONAL_CONTEXT_REASON.ID_FROM_REGISTRY_ONLY,
      CONVERSATIONAL_CONTEXT_REASON.NO_SYNTHESIZED_ID,
      CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
    ]),
  };
}

function buildResult(args: {
  readonly primary: NexoraConversationalResolvedSubject | null;
  readonly secondary: readonly NexoraConversationalResolvedSubject[];
  readonly status: NexoraConversationalResolutionStatus;
  readonly source: NexoraConversationalResolutionSource;
  readonly confidence: number;
  readonly reasons: readonly string[];
  readonly intent: NexoraConversationalIntent;
  readonly hints: readonly NexoraConversationalTargetHint[];
  readonly contextCandidates: readonly string[];
  readonly canonicalCandidates: readonly string[];
  readonly precedenceApplied: readonly string[];
}): NexoraConversationalContextResolution {
  const context: NexoraResolvedConversationalContext = Object.freeze({
    primarySubject: args.primary,
    secondarySubjects: Object.freeze([...args.secondary]),
    resolutionStatus: args.status,
    source: args.source,
    confidence: clampConfidence(args.confidence),
    reasons: Object.freeze([...args.reasons]),
  });

  const trace: NexoraConversationalContextTrace = Object.freeze({
    intentKind: args.intent.kind,
    targetHints: Object.freeze(args.hints.map((h) => Object.freeze({ ...h }))),
    contextCandidates: Object.freeze([...args.contextCandidates]),
    canonicalCandidates: Object.freeze([...args.canonicalCandidates]),
    precedenceApplied: Object.freeze([...args.precedenceApplied]),
    finalPrimarySubjectId: args.primary?.subjectId ?? null,
    finalSecondarySubjectIds: Object.freeze(
      args.secondary.map((s) => s.subjectId),
    ),
    resolutionStatus: args.status,
    source: args.source,
    confidence: context.confidence,
    reasons: context.reasons,
  });

  return Object.freeze({ context, trace });
}

/**
 * Primary CC:2 API — resolve executive conversational context.
 * Pure function. Dependencies must be passed in explicitly.
 */
export function resolveNexoraExecutiveConversationalContext(
  input: NexoraExecutiveConversationalContextInput,
): NexoraConversationalContextResolution {
  const intent = input.intent;
  const hints = Object.freeze(
    orderedHints(input.targetHints ?? intent.targetHints ?? []),
  );
  const index = buildNexoraConversationalSubjectMatchIndex(
    input.executiveSubjects ?? [],
  );

  const precedenceApplied: string[] = [];
  const canonicalCandidates: string[] = [];
  let contextCandidates: readonly string[] = Object.freeze([]);

  // ── not required ──────────────────────────────────────────────────────────
  if (!intentRequiresSubject(intent)) {
    precedenceApplied.push(CONVERSATIONAL_CONTEXT_PRECEDENCE[4]!);
    return buildResult({
      primary: null,
      secondary: Object.freeze([]),
      status: "not-required",
      source: "none",
      confidence: 1,
      reasons: Object.freeze([
        CONVERSATIONAL_CONTEXT_REASON.INTENT_NOT_REQUIRING_SUBJECT,
        CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
      ]),
      intent,
      hints,
      contextCandidates,
      canonicalCandidates,
      precedenceApplied,
    });
  }

  // ── 1. Explicit target hints ──────────────────────────────────────────────
  if (hints.length > 0) {
    precedenceApplied.push(CONVERSATIONAL_CONTEXT_PRECEDENCE[0]!);

    const resolvedSubjects: NexoraConversationalResolvedSubject[] = [];
    const reasons: string[] = [];
    let ambiguous = false;
    let notFound = false;

    for (const hint of hints) {
      const result =
        hint.role === "ordinal"
          ? resolveOrdinalHint(hint, input.conversationContext, index)
          : resolveHint(hint, index);
      for (const id of result.candidates) {
        if (!canonicalCandidates.includes(id)) canonicalCandidates.push(id);
      }
      reasons.push(...result.reasons);

      if (result.status === "ambiguous") {
        ambiguous = true;
        break;
      }
      if (result.status === "not-found") {
        notFound = true;
        break;
      }
      resolvedSubjects.push(result.subject);
    }

    if (ambiguous) {
      return buildResult({
        primary: null,
        secondary: Object.freeze([]),
        status: "ambiguous",
        source: "explicit-hint",
        confidence: 0.4,
        reasons: Object.freeze([
          ...reasons,
          CONVERSATIONAL_CONTEXT_REASON.MULTIPLE_CANONICAL_MATCHES,
        ]),
        intent,
        hints,
        contextCandidates,
        canonicalCandidates,
        precedenceApplied,
      });
    }

    if (notFound) {
      return buildResult({
        primary: null,
        secondary: Object.freeze([]),
        status: "not-found",
        source: "explicit-hint",
        confidence: 0.25,
        reasons: Object.freeze([...reasons]),
        intent,
        hints,
        contextCandidates,
        canonicalCandidates,
        precedenceApplied,
      });
    }

    // Compare / multi-subject with partial deictic: fill missing slot from context.
    if (
      intent.kind === "compare" &&
      intent.requiresContext &&
      resolvedSubjects.length === 1
    ) {
      precedenceApplied.push(CONVERSATIONAL_CONTEXT_PRECEDENCE[1]!);
      const fromContext = resolveFromConversationContext(
        input.conversationContext,
        index,
      );
      contextCandidates = fromContext.contextCandidates;
      if (fromContext.status !== "resolved" || !fromContext.subject) {
        return buildResult({
          primary: null,
          secondary: Object.freeze([]),
          status: "missing-context",
          source: "conversation-context",
          confidence: 0.35,
          reasons: Object.freeze([
            ...reasons,
            ...fromContext.reasons,
            CONVERSATIONAL_CONTEXT_REASON.MISSING_CONVERSATION_CONTEXT,
          ]),
          intent,
          hints,
          contextCandidates,
          canonicalCandidates,
          precedenceApplied,
        });
      }

      // Preserve order: compare-left (context if deictic) then explicit right,
      // or explicit left then context — based on which hint roles exist.
      const hasRight = hints.some((h) => h.role === "compare-right");
      const hasLeft = hints.some((h) => h.role === "compare-left");
      let primary = resolvedSubjects[0]!;
      let secondary = fromContext.subject;

      if (hasRight && !hasLeft) {
        // "Compare it with Revenue" → context primary, revenue secondary
        primary = fromContext.subject;
        secondary = resolvedSubjects[0]!;
      } else if (hasLeft && !hasRight) {
        primary = resolvedSubjects[0]!;
        secondary = fromContext.subject;
      }

      return buildResult({
        primary,
        secondary: Object.freeze([secondary]),
        status: "resolved",
        source: "conversation-context",
        confidence: 0.86,
        reasons: Object.freeze([
          ...reasons,
          ...fromContext.reasons,
          CONVERSATIONAL_CONTEXT_REASON.SECONDARY_SUBJECT_RESOLVED,
          CONVERSATIONAL_CONTEXT_REASON.SUBJECT_ORDER_PRESERVED,
          ...(intent.kind.startsWith("show-")
            ? [CONVERSATIONAL_CONTEXT_REASON.RELATION_SCOPED_ANCHOR_ONLY]
            : []),
        ]),
        intent,
        hints,
        contextCandidates,
        canonicalCandidates,
        precedenceApplied,
      });
    }

    const primary = resolvedSubjects[0] ?? null;
    const secondary = Object.freeze(resolvedSubjects.slice(1));

    const relationScoped = intent.kind.startsWith("show-");

    return buildResult({
      primary,
      secondary,
      status: "resolved",
      source: hints.length > 0 ? "explicit-hint" : "canonical-match",
      confidence: secondary.length > 0 ? 0.94 : 0.96,
      reasons: Object.freeze([
        ...reasons,
        ...(secondary.length > 0
          ? [
              CONVERSATIONAL_CONTEXT_REASON.SECONDARY_SUBJECT_RESOLVED,
              CONVERSATIONAL_CONTEXT_REASON.SUBJECT_ORDER_PRESERVED,
            ]
          : []),
        ...(relationScoped
          ? [CONVERSATIONAL_CONTEXT_REASON.RELATION_SCOPED_ANCHOR_ONLY]
          : []),
      ]),
      intent,
      hints,
      contextCandidates,
      canonicalCandidates,
      precedenceApplied,
    });
  }

  // ── 2/3. Conversational reference / conversation context ──────────────────
  if (intent.requiresContext || hints.length === 0) {
    precedenceApplied.push(CONVERSATIONAL_CONTEXT_PRECEDENCE[1]!);
    precedenceApplied.push(CONVERSATIONAL_CONTEXT_PRECEDENCE[2]!);

    const fromContext = resolveFromConversationContext(
      input.conversationContext,
      index,
    );
    contextCandidates = fromContext.contextCandidates;

    if (fromContext.status === "resolved" && fromContext.subject) {
      return buildResult({
        primary: fromContext.subject,
        secondary: Object.freeze([]),
        status: "resolved",
        source: "conversation-context",
        confidence: 0.84,
        reasons: Object.freeze([
          ...fromContext.reasons,
          ...(intent.kind.startsWith("show-")
            ? [CONVERSATIONAL_CONTEXT_REASON.RELATION_SCOPED_ANCHOR_ONLY]
            : []),
        ]),
        intent,
        hints,
        contextCandidates,
        canonicalCandidates,
        precedenceApplied,
      });
    }

    // ── 4. Active Stage context when explicitly permitted ───────────────────
    precedenceApplied.push(CONVERSATIONAL_CONTEXT_PRECEDENCE[3]!);
    const fromStage = resolveFromStageContext(
      input.activeStageContext,
      input.allowActiveStageContext === true,
      index,
    );
    contextCandidates = Object.freeze([
      ...contextCandidates,
      ...fromStage.contextCandidates,
    ]);

    if (fromStage.subject) {
      return buildResult({
        primary: fromStage.subject,
        secondary: Object.freeze([]),
        status: "resolved",
        source: "active-stage-context",
        confidence: 0.7,
        reasons: Object.freeze([...fromStage.reasons]),
        intent,
        hints,
        contextCandidates,
        canonicalCandidates,
        precedenceApplied,
      });
    }

    precedenceApplied.push(CONVERSATIONAL_CONTEXT_PRECEDENCE[4]!);
    return buildResult({
      primary: null,
      secondary: Object.freeze([]),
      status: "missing-context",
      source: "none",
      confidence: 0.2,
      reasons: Object.freeze([
        ...fromContext.reasons,
        ...fromStage.reasons,
        CONVERSATIONAL_CONTEXT_REASON.MISSING_CONVERSATION_CONTEXT,
      ]),
      intent,
      hints,
      contextCandidates,
      canonicalCandidates,
      precedenceApplied,
    });
  }

  // Fallback — should be rare.
  precedenceApplied.push(CONVERSATIONAL_CONTEXT_PRECEDENCE[4]!);
  return buildResult({
    primary: null,
    secondary: Object.freeze([]),
    status: "not-found",
    source: "none",
    confidence: 0.15,
    reasons: Object.freeze([
      CONVERSATIONAL_CONTEXT_REASON.CANONICAL_SUBJECT_NOT_FOUND,
      CONVERSATIONAL_CONTEXT_REASON.DETERMINISTIC,
    ]),
    intent,
    hints,
    contextCandidates,
    canonicalCandidates,
    precedenceApplied,
  });
}
