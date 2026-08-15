/**
 * CC:1 — Deterministic Conversational Intent Resolver.
 *
 * Utterance → Normalization → Typed Executive Intent.
 * Does NOT execute, mutate Runtime/Stage/Director, or resolve canonical object IDs.
 */

import {
  CONVERSATIONAL_INTENT_REASON,
  EXECUTION_CLASS_BY_INTENT_KIND,
  type NexoraConversationalIntent,
  type NexoraConversationalIntentInput,
  type NexoraConversationalIntentKind,
  type NexoraConversationalIntentResolution,
  type NexoraConversationalIntentTrace,
  type NexoraConversationalTargetHint,
} from "./conversationalIntent.ts";
import {
  isAmbiguousConversationalReference,
  normalizeNexoraConversationalUtterance,
  stripConversationalArticles,
} from "./conversationalIntentNormalization.ts";

type MatchResult = {
  readonly kind: NexoraConversationalIntentKind;
  readonly confidence: number;
  readonly reasons: readonly string[];
  readonly targetHints: readonly NexoraConversationalTargetHint[];
  readonly requiresContext: boolean;
  readonly requiresTarget: boolean;
  readonly candidateKinds: readonly NexoraConversationalIntentKind[];
};

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Math.round(value * 1000) / 1000;
}

function hint(
  raw: string,
  role: NexoraConversationalTargetHint["role"] = "primary",
): NexoraConversationalTargetHint | null {
  const cleaned = stripConversationalArticles(raw.trim());
  if (!cleaned) return null;
  return Object.freeze({ raw: cleaned, role });
}

function matchAmbiguous(normalized: string): MatchResult | null {
  // Deictic / underspecified references — never invent a target.
  const ambiguousPatterns: readonly RegExp[] = [
    /^(?:show|open|focus(?:\s+on)?|look\s+at|what\s+about)\s+(this|that|it|them|these|those)$/,
    /^what\s+about\s+(this|that|it)$/,
    /^open\s+it$/,
    /^show\s+me\s+(this|that|it)$/,
    /^(this|that|it)$/,
  ];

  for (const pattern of ambiguousPatterns) {
    if (!pattern.test(normalized)) continue;
    return {
      kind: "focus",
      confidence: 0.55,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["focus", "explore"] as const),
    };
  }

  if (
    /^(?:show|open|focus(?:\s+on)?)\s+(?:me\s+)?(?:the\s+)?(?:current|selected)(?:\s+(?:one|object|item))?$/.test(
      normalized,
    )
  ) {
    return {
      kind: "focus",
      confidence: 0.5,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["focus"] as const),
    };
  }

  return null;
}

function matchOverview(normalized: string): MatchResult | null {
  if (
    /^(?:return\s+to|go\s+back\s+to|back\s+to|show|open)?\s*overview$/.test(
      normalized,
    ) ||
    /^(?:go\s+to|take\s+me\s+to)\s+overview$/.test(normalized) ||
    /^return\s+to\s+overview$/.test(normalized) ||
    /^go\s+back\s+to\s+overview$/.test(normalized)
  ) {
    return {
      kind: "overview",
      confidence: 0.96,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_OVERVIEW,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: false,
      requiresTarget: false,
      candidateKinds: Object.freeze(["overview"] as const),
    };
  }
  return null;
}

function matchNavigation(normalized: string): MatchResult | null {
  if (
    /^(?:go\s+)?back$/.test(normalized) ||
    /^navigate\s+back$/.test(normalized) ||
    /^step\s+back$/.test(normalized)
  ) {
    return {
      kind: "navigate-back",
      confidence: 0.95,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_NAVIGATE_BACK,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: false,
      requiresTarget: false,
      candidateKinds: Object.freeze(["navigate-back"] as const),
    };
  }

  if (
    /^(?:go\s+)?forward$/.test(normalized) ||
    /^navigate\s+forward$/.test(normalized) ||
    /^step\s+forward$/.test(normalized)
  ) {
    return {
      kind: "navigate-forward",
      confidence: 0.95,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_NAVIGATE_FORWARD,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: false,
      requiresTarget: false,
      candidateKinds: Object.freeze(["navigate-forward"] as const),
    };
  }

  return null;
}

function matchCollectionShows(normalized: string): MatchResult | null {
  // Relation-scoped / possessive forms — lexical anchor only (CC:2 resolves IDs).
  const possessive = normalized.match(
    /^(?:show|open|list|see)(?:\s+me)?\s+(?:its|their|his|her)\s+(problems?|goals?|scenarios?|decisions?|execution|related(?:\s+objects?)?)$/,
  );
  if (possessive) {
    const kind = collectionKindFromToken(possessive[1] ?? "");
    if (kind) {
      return {
        kind,
        confidence: 0.88,
        reasons: [
          CONVERSATIONAL_INTENT_REASON.MATCHED_RELATION_SCOPED,
          CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
          CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
          CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
          CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ],
        targetHints: Object.freeze([]),
        requiresContext: true,
        requiresTarget: true,
        candidateKinds: Object.freeze([kind]),
      };
    }
  }

  const relatedTo = normalized.match(
    /^(?:show|open|list|see)(?:\s+me)?(?:\s+the)?\s+(problems?|goals?|scenarios?|decisions?|execution)\s+(?:related\s+to|for|of|about)\s+(.+)$/,
  );
  if (relatedTo) {
    const kind = collectionKindFromToken(relatedTo[1] ?? "");
    const raw = (relatedTo[2] ?? "").trim();
    if (kind && raw) {
      if (isAmbiguousConversationalReference(raw) || raw === "this" || raw === "that" || raw === "it") {
        return {
          kind,
          confidence: 0.82,
          reasons: [
            CONVERSATIONAL_INTENT_REASON.MATCHED_RELATION_SCOPED,
            CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
            CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
            CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
            CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
          ],
          targetHints: Object.freeze([]),
          requiresContext: true,
          requiresTarget: true,
          candidateKinds: Object.freeze([kind]),
        };
      }
      const primary = hint(raw, "primary");
      return {
        kind,
        confidence: 0.9,
        reasons: [
          CONVERSATIONAL_INTENT_REASON.MATCHED_RELATION_SCOPED,
          CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED,
          CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
          CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
          CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ],
        targetHints: Object.freeze(primary ? [primary] : []),
        requiresContext: false,
        requiresTarget: true,
        candidateKinds: Object.freeze([kind]),
      };
    }
  }

  // "Show Capacity problems" / "Show Revenue scenarios"
  const anchorThenKind = normalized.match(
    /^(?:show|open|list|see)(?:\s+me)?\s+(.+?)\s+(problems?|goals?|scenarios?|decisions?|execution)$/,
  );
  if (anchorThenKind) {
    const raw = (anchorThenKind[1] ?? "").trim();
    const kind = collectionKindFromToken(anchorThenKind[2] ?? "");
    if (
      kind &&
      raw &&
      !/^(?:the|all|my|our)$/.test(raw) &&
      !isAmbiguousConversationalReference(raw)
    ) {
      const primary = hint(raw, "primary");
      return {
        kind,
        confidence: 0.9,
        reasons: [
          CONVERSATIONAL_INTENT_REASON.MATCHED_RELATION_SCOPED,
          CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED,
          CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
          CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
          CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ],
        targetHints: Object.freeze(primary ? [primary] : []),
        requiresContext: false,
        requiresTarget: true,
        candidateKinds: Object.freeze([kind]),
      };
    }
  }

  const specs: readonly {
    readonly pattern: RegExp;
    readonly kind: NexoraConversationalIntentKind;
    readonly reason: string;
  }[] = [
    {
      pattern:
        /^(?:show|open|list|see)(?:\s+me)?(?:\s+the)?\s+related(?:\s+objects?)?$/,
      kind: "show-related",
      reason: CONVERSATIONAL_INTENT_REASON.MATCHED_RELATED,
    },
    {
      pattern:
        /^(?:show|open|list|see)(?:\s+me)?(?:\s+the)?\s+problems?(?:\s+collection)?$/,
      kind: "show-problems",
      reason: CONVERSATIONAL_INTENT_REASON.MATCHED_PROBLEMS,
    },
    {
      pattern:
        /^(?:show|open|list|see)(?:\s+me)?(?:\s+the)?\s+goals?(?:\s+collection)?$/,
      kind: "show-goals",
      reason: CONVERSATIONAL_INTENT_REASON.MATCHED_GOALS,
    },
    {
      pattern:
        /^(?:show|open|list|see)(?:\s+me)?(?:\s+the)?\s+scenarios?(?:\s+collection)?$/,
      kind: "show-scenarios",
      reason: CONVERSATIONAL_INTENT_REASON.MATCHED_SCENARIOS,
    },
    {
      pattern:
        /^(?:show|open|list|see)(?:\s+me)?(?:\s+the)?\s+decisions?(?:\s+collection)?$/,
      kind: "show-decisions",
      reason: CONVERSATIONAL_INTENT_REASON.MATCHED_DECISIONS,
    },
    {
      pattern:
        /^(?:show|open|list|see)(?:\s+me)?(?:\s+the)?\s+execution(?:\s+collection)?$/,
      kind: "show-execution",
      reason: CONVERSATIONAL_INTENT_REASON.MATCHED_EXECUTION,
    },
  ];

  for (const spec of specs) {
    if (!spec.pattern.test(normalized)) continue;
    return {
      kind: spec.kind,
      confidence: 0.94,
      reasons: [spec.reason, CONVERSATIONAL_INTENT_REASON.DETERMINISTIC],
      targetHints: Object.freeze([]),
      requiresContext: false,
      requiresTarget: false,
      candidateKinds: Object.freeze([spec.kind]),
    };
  }
  return null;
}

function collectionKindFromToken(
  token: string,
): NexoraConversationalIntentKind | null {
  const t = token.trim().toLowerCase();
  if (t.startsWith("problem")) return "show-problems";
  if (t.startsWith("goal")) return "show-goals";
  if (t.startsWith("scenario")) return "show-scenarios";
  if (t.startsWith("decision")) return "show-decisions";
  if (t === "execution") return "show-execution";
  if (t.startsWith("related")) return "show-related";
  return null;
}

function matchCompare(normalized: string): MatchResult | null {
  const pairForm = normalized.match(
    /^(?:compare|contrast)\s+(.+?)\s+(?:and|with|vs|versus)\s+(.+)$/,
  );
  if (pairForm) {
    const leftRaw = (pairForm[1] ?? "").trim();
    const rightRaw = (pairForm[2] ?? "").trim();
    const leftDeictic = isAmbiguousConversationalReference(leftRaw);
    const rightDeictic = isAmbiguousConversationalReference(rightRaw);
    const left = leftDeictic ? null : hint(leftRaw, "compare-left");
    const right = rightDeictic ? null : hint(rightRaw, "compare-right");
    const hints = Object.freeze(
      [left, right].filter((h): h is NexoraConversationalTargetHint => h != null),
    );
    const needsContext = leftDeictic || rightDeictic || hints.length < 2;
    return {
      kind: "compare",
      confidence: needsContext ? 0.62 : 0.93,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_COMPARE,
        ...(hints.length > 0
          ? [CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED]
          : []),
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ...(needsContext
          ? [CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE]
          : []),
      ],
      targetHints: hints,
      requiresContext: needsContext,
      requiresTarget: true,
      candidateKinds: Object.freeze(["compare"] as const),
    };
  }

  if (/^compare(?:\s+them|\s+these|\s+those)?$/.test(normalized)) {
    return {
      kind: "compare",
      confidence: 0.55,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_COMPARE,
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["compare"] as const),
    };
  }

  return null;
}

function matchAnalyze(normalized: string): MatchResult | null {
  const m = normalized.match(/^(?:analyze|analyse|analysis\s+of)\s+(.+)$/);
  if (!m) {
    if (/^(?:analyze|analyse)(?:\s+this|\s+that|\s+it)?$/.test(normalized)) {
      return {
        kind: "analyze",
        confidence: 0.55,
        reasons: [
          CONVERSATIONAL_INTENT_REASON.MATCHED_ANALYZE,
          CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
          CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
          CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ],
        targetHints: Object.freeze([]),
        requiresContext: true,
        requiresTarget: true,
        candidateKinds: Object.freeze(["analyze"] as const),
      };
    }
    return null;
  }

  const raw = (m[1] ?? "").trim();
  if (isAmbiguousConversationalReference(raw)) {
    return {
      kind: "analyze",
      confidence: 0.55,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_ANALYZE,
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["analyze"] as const),
    };
  }

  const primary = hint(raw, "primary");
  return {
    kind: "analyze",
    confidence: 0.92,
    reasons: [
      CONVERSATIONAL_INTENT_REASON.MATCHED_ANALYZE,
      CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED,
      CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
      CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
      CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
    ],
    targetHints: Object.freeze(primary ? [primary] : []),
    requiresContext: false,
    requiresTarget: true,
    candidateKinds: Object.freeze(["analyze"] as const),
  };
}

function matchSimulate(normalized: string): MatchResult | null {
  if (
    /^what\s+happens\s+if\s+we\s+do\s+nothing$/.test(normalized) ||
    /^what\s+if\s+we\s+do\s+nothing$/.test(normalized) ||
    /^simulate(?:\s+(?:this|the))?\s+scenario$/.test(normalized) ||
    /^run(?:\s+(?:this|the))?\s+simulation$/.test(normalized) ||
    /^simulate\s+(.+)$/.test(normalized)
  ) {
    const named = normalized.match(/^simulate\s+(.+)$/);
    const scenarioPhrase = named?.[1]?.trim() ?? "";
    const isDeictic =
      !scenarioPhrase ||
      isAmbiguousConversationalReference(scenarioPhrase) ||
      /^(?:this|the)\s+scenario$/.test(scenarioPhrase) ||
      scenarioPhrase === "scenario";

    const doNothing =
      /^what\s+happens\s+if\s+we\s+do\s+nothing$/.test(normalized) ||
      /^what\s+if\s+we\s+do\s+nothing$/.test(normalized);

    const targetHints =
      !isDeictic && scenarioPhrase
        ? Object.freeze(
            [hint(scenarioPhrase, "primary")].filter(
              (h): h is NexoraConversationalTargetHint => h != null,
            ),
          )
        : Object.freeze([] as NexoraConversationalTargetHint[]);

    return {
      kind: "simulate",
      confidence: doNothing || isDeictic ? 0.72 : 0.9,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_SIMULATE,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ...(isDeictic || doNothing
          ? [CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE]
          : [CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED]),
      ],
      targetHints,
      requiresContext: isDeictic || doNothing,
      requiresTarget: !doNothing,
      candidateKinds: Object.freeze(["simulate"] as const),
    };
  }
  return null;
}

function matchFocusOrOpen(normalized: string): MatchResult | null {
  const focus = normalized.match(
    /^(?:focus(?:\s+on)?|look\s+at|go\s+to)\s+(.+)$/,
  );
  const showOpen = normalized.match(
    /^(?:show|open)(?:\s+me)?\s+(.+)$/,
  );

  const matched = focus ?? showOpen;
  if (!matched) return null;

  const raw = (matched[1] ?? "").trim();
  if (!raw) return null;

  // Collection phrases already handled; guard if they slipped through.
  if (
    /^(?:the\s+)?(?:related(?:\s+objects?)?|problems?|goals?|scenarios?|decisions?|execution)$/.test(
      raw,
    )
  ) {
    return null;
  }

  if (isAmbiguousConversationalReference(raw)) {
    return {
      kind: "focus",
      confidence: 0.55,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_FOCUS,
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["focus"] as const),
    };
  }

  const primary = hint(raw, "primary");
  const fromFocus = focus != null;
  return {
    kind: "focus",
    confidence: fromFocus ? 0.95 : 0.9,
    reasons: [
      fromFocus
        ? CONVERSATIONAL_INTENT_REASON.MATCHED_FOCUS
        : CONVERSATIONAL_INTENT_REASON.MATCHED_OPEN_SHOW_TARGET,
      CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED,
      CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
      CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
      CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
    ],
    targetHints: Object.freeze(primary ? [primary] : []),
    requiresContext: false,
    requiresTarget: true,
    candidateKinds: Object.freeze(["focus", "explore"] as const),
  };
}

function matchExplore(normalized: string): MatchResult | null {
  const m = normalized.match(/^(?:explore|inspect)\s+(.+)$/);
  if (!m) {
    if (/^(?:explore|inspect)$/.test(normalized)) {
      return {
        kind: "explore",
        confidence: 0.5,
        reasons: [
          CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
          CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
          CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ],
        targetHints: Object.freeze([]),
        requiresContext: true,
        requiresTarget: true,
        candidateKinds: Object.freeze(["explore"] as const),
      };
    }
    return null;
  }

  const raw = (m[1] ?? "").trim();
  if (isAmbiguousConversationalReference(raw)) {
    return {
      kind: "explore",
      confidence: 0.55,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["explore"] as const),
    };
  }

  const primary = hint(raw, "primary");
  return {
    kind: "explore",
    confidence: 0.88,
    reasons: [
      CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED,
      CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
      CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
      CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
    ],
    targetHints: Object.freeze(primary ? [primary] : []),
    requiresContext: false,
    requiresTarget: true,
    candidateKinds: Object.freeze(["explore"] as const),
  };
}

function splitExperienceAndSubject(phrase: string): {
  readonly experienceRaw: string;
  readonly subjectRaw: string | null;
} {
  const compound = phrase.match(
    /^(.+?)\s+and\s+(?:focus(?:\s+on)?|look\s+at)\s+(.+)$/,
  );
  if (compound) {
    return {
      experienceRaw: (compound[1] ?? "").trim(),
      subjectRaw: (compound[2] ?? "").trim() || null,
    };
  }
  return { experienceRaw: phrase.trim(), subjectRaw: null };
}

function matchSwitchWorkspace(normalized: string): MatchResult | null {
  const openWorkspace = normalized.match(
    /^(?:open|switch\s+to)\s+(?:the\s+)?(.+?)\s+workspace$/,
  );
  const switchTo = normalized.match(/^switch\s+to\s+(?:the\s+)?(.+)$/);
  const matched = openWorkspace ?? switchTo;
  if (!matched) return null;

  const raw = (matched[1] ?? "").trim();
  if (!raw || isAmbiguousConversationalReference(raw)) {
    return {
      kind: "switch-workspace",
      confidence: 0.5,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_SWITCH_WORKSPACE,
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: false,
      candidateKinds: Object.freeze(["switch-workspace"] as const),
    };
  }

  const { experienceRaw, subjectRaw } = splitExperienceAndSubject(raw);
  const experience = hint(experienceRaw, "experience");
  const subject = subjectRaw ? hint(subjectRaw, "primary") : null;
  const hints = Object.freeze(
    [experience, subject].filter(
      (h): h is NexoraConversationalTargetHint => h != null,
    ),
  );

  return {
    kind: "switch-workspace",
    confidence: 0.94,
    reasons: [
      CONVERSATIONAL_INTENT_REASON.MATCHED_SWITCH_WORKSPACE,
      CONVERSATIONAL_INTENT_REASON.EXPERIENCE_HINT_EXTRACTED,
      ...(subject
        ? [CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED]
        : []),
      CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
      CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
    ],
    targetHints: hints,
    requiresContext: false,
    requiresTarget: subject != null,
    candidateKinds: Object.freeze(["switch-workspace"] as const),
  };
}

function matchPrepareContext(normalized: string): MatchResult | null {
  // "Prepare Nexora." alone / next meeting without context → underspecified.
  if (
    /^(?:prepare(?:\s+me)?|prepare\s+nexora|get\s+ready|set\s+nexora\s+up)$/.test(
      normalized,
    ) ||
    /^(?:prepare(?:\s+me)?(?:\s+for)?|get\s+ready\s+for|set\s+(?:nexora\s+)?up\s+for)\s+(?:my\s+)?next\s+meeting$/.test(
      normalized,
    )
  ) {
    return {
      kind: "prepare-context",
      confidence: 0.55,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_PREPARE_CONTEXT,
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: false,
      candidateKinds: Object.freeze(["prepare-context"] as const),
    };
  }

  const patterns: readonly RegExp[] = [
    /^(?:prepare(?:\s+me)?(?:\s+for)?|get\s+ready\s+for|set\s+(?:nexora\s+)?up\s+for)\s+(.+)$/,
    /^(?:im|i\s*m|i am)\s+entering\s+(.+?)(?:\s+prepare(?:\s+nexora)?)?$/,
    /^(?:im|i\s*m|i am)\s+meeting\s+(.+)$/,
    /^(?:lets|let us)\s+review\s+(.+)$/,
    /^prepare\s+nexora\s+for\s+(.+)$/,
  ];

  for (const pattern of patterns) {
    const m = normalized.match(pattern);
    if (!m) continue;
    let raw = (m[1] ?? "").trim();
    raw = raw.replace(/\s+prepare(?:\s+nexora)?$/, "").trim();
    if (!raw) continue;

    const { experienceRaw, subjectRaw } = splitExperienceAndSubject(raw);
    const experience = hint(experienceRaw, "experience");
    const subject = subjectRaw ? hint(subjectRaw, "primary") : null;
    const hints = Object.freeze(
      [experience, subject].filter(
        (h): h is NexoraConversationalTargetHint => h != null,
      ),
    );

    return {
      kind: "prepare-context",
      confidence: 0.93,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_PREPARE_CONTEXT,
        CONVERSATIONAL_INTENT_REASON.EXPERIENCE_HINT_EXTRACTED,
        ...(subject
          ? [CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED]
          : []),
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: hints,
      requiresContext: false,
      requiresTarget: subject != null,
      candidateKinds: Object.freeze(["prepare-context"] as const),
    };
  }

  return null;
}

function unknownMatch(normalized: string): MatchResult {
  return {
    kind: "unknown",
    confidence: normalized.length === 0 ? 1 : 0.2,
    reasons: [
      CONVERSATIONAL_INTENT_REASON.UNKNOWN_UTTERANCE,
      CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
    ],
    targetHints: Object.freeze([]),
    requiresContext: false,
    requiresTarget: false,
    candidateKinds: Object.freeze(["unknown"] as const),
  };
}

function matchOrdinalReference(normalized: string): MatchResult | null {
  const m = normalized.match(
    /^(?:open|show|focus(?:\s+on)?|select)?\s*(?:the\s+)?(first|second|third|previous)\s+(?:one|item|problem|scenario|decision)?$/,
  );
  if (!m) return null;
  const ordinal = (m[1] ?? "").trim();
  const ordinalHint = hint(ordinal, "ordinal");
  return {
    kind: "focus",
    confidence: 0.88,
    reasons: [
      CONVERSATIONAL_INTENT_REASON.MATCHED_ORDINAL_REFERENCE,
      CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
      CONVERSATIONAL_INTENT_REASON.TARGET_REQUIRED,
      CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
      CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
    ],
    targetHints: Object.freeze(ordinalHint ? [ordinalHint] : []),
    requiresContext: true,
    requiresTarget: true,
    candidateKinds: Object.freeze(["focus"] as const),
  };
}

function matchRecommendExplainPrioritize(
  normalized: string,
): MatchResult | null {
  // Explain / why
  if (
    /^(?:why(?:\s+is\s+this\s+important)?|explain(?:\s+that|\s+this|\s+why)?)$/.test(
      normalized,
    )
  ) {
    return {
      kind: "explain",
      confidence: 0.9,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_EXPLAIN,
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["explain"] as const),
    };
  }

  const explainAbout = normalized.match(
    /^(?:why(?:\s+is)?|explain)\s+(.+)$/,
  );
  if (explainAbout) {
    const raw = (explainAbout[1] ?? "").trim();
    if (raw && !isAmbiguousConversationalReference(raw)) {
      const primary = hint(raw, "primary");
      return {
        kind: "explain",
        confidence: 0.9,
        reasons: [
          CONVERSATIONAL_INTENT_REASON.MATCHED_EXPLAIN,
          CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED,
          CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
          CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ],
        targetHints: Object.freeze(primary ? [primary] : []),
        requiresContext: false,
        requiresTarget: true,
        candidateKinds: Object.freeze(["explain"] as const),
      };
    }
  }

  // Prioritize / what matters
  if (
    /^(?:what\s+matters\s+most|what\s+should\s+i\s+look\s+at\s+first|what\s+needs\s+my\s+attention)$/.test(
      normalized,
    )
  ) {
    return {
      kind: "prioritize",
      confidence: 0.92,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_PRIORITIZE,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["prioritize"] as const),
    };
  }

  // Recommend
  if (
    /^(?:what\s+do\s+you\s+recommend|what\s+should\s+i\s+do|recommend)$/.test(
      normalized,
    )
  ) {
    return {
      kind: "recommend",
      confidence: 0.93,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_RECOMMEND,
        CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze([]),
      requiresContext: true,
      requiresTarget: true,
      candidateKinds: Object.freeze(["recommend"] as const),
    };
  }

  const recommendAbout = normalized.match(
    /^(?:what\s+do\s+you\s+recommend\s+(?:about|for|on)|recommend(?:\s+(?:about|for|on))?)\s+(.+)$/,
  );
  if (recommendAbout) {
    const raw = (recommendAbout[1] ?? "").trim();
    if (raw && !isAmbiguousConversationalReference(raw)) {
      const primary = hint(raw, "primary");
      return {
        kind: "recommend",
        confidence: 0.94,
        reasons: [
          CONVERSATIONAL_INTENT_REASON.MATCHED_RECOMMEND,
          CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED,
          CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
          CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
        ],
        targetHints: Object.freeze(primary ? [primary] : []),
        requiresContext: false,
        requiresTarget: true,
        candidateKinds: Object.freeze(["recommend"] as const),
      };
    }
  }

  // "Should we increase Capacity?" → recommend about Capacity + scenario hint via unknown-impact in evidence later
  const shouldWe = normalized.match(
    /^should\s+we\s+(?:increase|expand|change|address)\s+(.+)$/,
  );
  if (shouldWe) {
    const raw = (shouldWe[1] ?? "").trim();
    const primary = hint(raw, "primary");
    return {
      kind: "recommend",
      confidence: 0.88,
      reasons: [
        CONVERSATIONAL_INTENT_REASON.MATCHED_RECOMMEND,
        CONVERSATIONAL_INTENT_REASON.TARGET_HINT_EXTRACTED,
        CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID,
        CONVERSATIONAL_INTENT_REASON.DETERMINISTIC,
      ],
      targetHints: Object.freeze(primary ? [primary] : []),
      requiresContext: false,
      requiresTarget: true,
      candidateKinds: Object.freeze(["recommend"] as const),
    };
  }

  return null;
}

function resolveMatch(normalized: string): MatchResult {
  // Order matters: experience/workspace/ordinal/recommend before generic focus/show.
  return (
    matchAmbiguous(normalized) ??
    matchOverview(normalized) ??
    matchNavigation(normalized) ??
    matchPrepareContext(normalized) ??
    matchSwitchWorkspace(normalized) ??
    matchRecommendExplainPrioritize(normalized) ??
    matchOrdinalReference(normalized) ??
    matchCollectionShows(normalized) ??
    matchCompare(normalized) ??
    matchAnalyze(normalized) ??
    matchSimulate(normalized) ??
    matchFocusOrOpen(normalized) ??
    matchExplore(normalized) ??
    unknownMatch(normalized)
  );
}

function freezeIntent(intent: NexoraConversationalIntent): NexoraConversationalIntent {
  return Object.freeze({
    kind: intent.kind,
    confidence: clampConfidence(intent.confidence),
    normalizedUtterance: intent.normalizedUtterance,
    source: "conversation",
    requiresContext: intent.requiresContext,
    requiresTarget: intent.requiresTarget,
    executionClass: intent.executionClass,
    reasons: Object.freeze([...intent.reasons]),
    targetHints: Object.freeze(
      intent.targetHints.map((h) => Object.freeze({ ...h })),
    ),
  });
}

/**
 * Primary CC:1 API — resolve a conversational utterance to a canonical intent.
 * Pure function. No Runtime/Stage/Director side effects.
 */
export function resolveNexoraConversationalIntent(
  input: NexoraConversationalIntentInput,
): NexoraConversationalIntentResolution {
  const utterance = typeof input?.utterance === "string" ? input.utterance : "";
  const normalizedUtterance = normalizeNexoraConversationalUtterance(utterance);
  const match = resolveMatch(normalizedUtterance);

  const intent = freezeIntent({
    kind: match.kind,
    confidence: match.confidence,
    normalizedUtterance,
    source: "conversation",
    requiresContext: match.requiresContext,
    requiresTarget: match.requiresTarget,
    executionClass: EXECUTION_CLASS_BY_INTENT_KIND[match.kind],
    reasons: Object.freeze([
      CONVERSATIONAL_INTENT_REASON.NORMALIZED,
      ...match.reasons,
    ]),
    targetHints: match.targetHints,
  });

  const trace: NexoraConversationalIntentTrace = Object.freeze({
    utterance,
    normalizedUtterance,
    candidateKinds: Object.freeze([...match.candidateKinds]),
    finalKind: intent.kind,
    confidence: intent.confidence,
    reasons: intent.reasons,
    targetHints: intent.targetHints,
    requiresContext: intent.requiresContext,
    requiresTarget: intent.requiresTarget,
  });

  return Object.freeze({ intent, trace });
}

/**
 * Convenience: intent only (no trace).
 */
export function resolveNexoraConversationalIntentOnly(
  input: NexoraConversationalIntentInput,
): NexoraConversationalIntent {
  return resolveNexoraConversationalIntent(input).intent;
}
