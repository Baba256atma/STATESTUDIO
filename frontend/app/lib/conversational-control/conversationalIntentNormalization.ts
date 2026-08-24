/**
 * CC:1 — Deterministic utterance normalization.
 *
 * Small, rule-based. Not an NLP framework. Stage-state independent.
 */

/**
 * Normalize an executive utterance for deterministic intent matching.
 *
 * Handles:
 * - trim / collapse whitespace
 * - lowercase
 * - strip harmless punctuation (keep spaces)
 * - drop common command prefixes / politeness fillers
 */
export function normalizeNexoraConversationalUtterance(utterance: string): string {
  let text = typeof utterance === "string" ? utterance : "";

  text = text.normalize("NFKC");
  text = text.toLowerCase();
  // Replace punctuation with spaces (preserve alphanumeric word boundaries).
  text = text.replace(/[^\p{L}\p{N}\s]+/gu, " ");
  text = text.replace(/\s+/g, " ").trim();
  // Deterministic typo correction only — not semantic invention.
  text = text.replace(/\bhappend\b/g, "happened");

  // Drop leading executive phrasing / command prefixes (iteratively).
  const prefixPatterns: readonly RegExp[] = [
    /^please\s+/,
    /^could you\s+/,
    /^can you\s+/,
    /^would you\s+/,
    /^i want (?:you )?to\s+/,
    /^i(?:'| a)?m asking (?:you )?to\s+/,
    /^help me\s+/,
    /^nexora[, ]+/,
  ];

  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of prefixPatterns) {
      const next = text.replace(pattern, "");
      if (next !== text) {
        text = next.trim();
        changed = true;
      }
    }
  }

  return text;
}

/**
 * True when the token is a deictic / ambiguous reference that needs CC:2 context.
 */
const CONVERSATIONAL_INTERFACE_FILLER =
  /^(?:objects?|items?|nodes?|cards?|things?)$/iu;

/**
 * Interface/reference vocabulary around a subject, not a business name token.
 * Conservative: only trailing filler words, never mid-name deletion.
 */
export function stripConversationalInterfaceFiller(phrase: string): string {
  const text = phrase.trim();
  if (!text) return text;
  const stripped = text.replace(
    /\s+(?:objects?|items?|nodes?|cards?|things?)$/iu,
    "",
  ).trim();
  return stripped || text;
}

export function isConversationalInterfaceFiller(token: string): boolean {
  return CONVERSATIONAL_INTERFACE_FILLER.test(token.trim());
}

export function isAmbiguousConversationalReference(token: string): boolean {
  const t = token.trim().toLowerCase();
  const core = stripConversationalInterfaceFiller(t);
  return (
    core === "this" ||
    core === "that" ||
    core === "it" ||
    core === "them" ||
    core === "these" ||
    core === "those" ||
    core === "here" ||
    core === "there" ||
    core === "the current" ||
    core === "current one" ||
    core === "the selected" ||
    core === "selected one"
  );
}

/**
 * Controlled manager-language forms — not edit-distance fuzzy matching.
 * Example: deliver → delivery, recover → recovery.
 * Applied only after exact and interface-filler matching fail.
 */
const NO_ACTION_HORIZON =
  /(?:\s+(?:for|over)\s+(?:the\s+)?(?:next\s+)?(\d+)\s+(days?|weeks?|months?|quarters?|years?))?$/u;

/**
 * Executive no-action / continuation → consequence / scenario.
 * Qualifies the family, not a single reported sentence.
 */
export function isNoActionConsequenceUtterance(normalized: string): boolean {
  const text = normalized.trim();
  if (!text) return false;
  if (/^what is the risk of doing nothing$/.test(text)) return true;
  const stripped = text
    .replace(
      /^(?:what\s+(?:happens\s+)?if|what\s+is\s+the\s+risk\s+if)\s+/u,
      "",
    )
    .replace(NO_ACTION_HORIZON, "")
    .trim();
  return /^(?:(?:we|i)\s+)?(?:ignore(?:\s+(?:it|this|that))?|do\s+nothing|don(?:\s*)?t\s+(?:act|fix(?:\s+(?:it|this|that))?)|leave(?:\s+(?:it|this|that))?\s+alone|take\s+no\s+action|wait|this\s+continues)$/u.test(
    stripped,
  );
}

export function isInvestigationOptionsUtterance(normalized: string): boolean {
  return /^(?:what are my options|what options do i have|give me another option|give me another scenario)$/u.test(
    normalized.trim(),
  );
}

export function isInvestigateNowUtterance(normalized: string): boolean {
  return /^(?:what if we investigate(?:\s+(?:it|this|that))?(?:\s+now)?|what if we intervene)$/u.test(
    normalized.trim(),
  );
}

export type ExecutiveInvestigationAsk =
  | "open-why"
  | "list-explanations"
  | "evidence-for"
  | "are-you-sure"
  | "fact-or-assumption"
  | "stronger"
  | "unknowns"
  | "what-can-we-do"
  | "address-other"
  | "why-chose"
  | "rejected"
  | "reconsider"
  | "recommend-under-uncertainty"
  | "manager-observation";

export function classifyExecutiveInvestigationAsk(
  normalized: string,
): ExecutiveInvestigationAsk | null {
  const text = normalized.trim();
  if (!text) return null;
  if (
    /^why is .+ (?:below target|underperforming|off target|at risk)$/.test(text) ||
    /^why is (?:this|it) (?:below target|underperforming)$/.test(text)
  ) {
    return "open-why";
  }
  if (
    /^(?:what could explain (?:it|this|that)|what else could explain (?:it|this|that)|what else could explain .+|what may explain (?:it|this))$/.test(
      text,
    )
  ) {
    return "list-explanations";
  }
  if (
    /^(?:what evidence supports (?:that|this|it|the other(?: issue)?|.+)|why do you think .+ matters)$/.test(
      text,
    )
  ) {
    return "evidence-for";
  }
  if (/^(?:are you sure|how sure are you)$/.test(text)) return "are-you-sure";
  if (
    /^(?:is that a fact or an assumption|is this a fact or an assumption|is that a fact|are you assuming that)$/.test(
      text,
    )
  ) {
    return "fact-or-assumption";
  }
  if (
    /^(?:which explanation has stronger evidence|which has stronger evidence|which explanation is stronger)$/.test(
      text,
    )
  ) {
    return "stronger";
  }
  if (
    /^(?:what don(?:\s*)?t we know(?: yet)?|what do we not know(?: yet)?|what remains unknown|what is unknown)$/.test(
      text,
    )
  ) {
    return "unknowns";
  }
  if (/^(?:what can we do|what should we look at doing)$/.test(text)) {
    return "what-can-we-do";
  }
  if (
    /^(?:what if we address (?:the )?other(?: issue)?(?: instead)?|what if we address .+ instead)$/.test(
      text,
    )
  ) {
    return "address-other";
  }
  if (
    /^(?:why did we choose this|what evidence led to this decision|why did we choose that)$/.test(
      text,
    )
  ) {
    return "why-chose";
  }
  if (/^(?:what alternatives did we reject|which alternatives were rejected)$/.test(text)) {
    return "rejected";
  }
  if (
    /^(?:what would make us reconsider|what assumption does this decision depend on)$/.test(
      text,
    )
  ) {
    return "reconsider";
  }
  if (
    /^(?:.+\s+)?(?:increased|decreased|worsened|improved|rose|fell)(?:\s+.+)?$/.test(text) &&
    !/\?$/.test(text) &&
    !/^what /.test(text) &&
    !/^why /.test(text)
  ) {
    return "manager-observation";
  }
  return null;
}

export function expandControlledManagerLanguageKeys(key: string): readonly string[] {
  const trimmed = key.trim();
  if (trimmed.length < 6) return Object.freeze([]);
  const extras: string[] = [];
  if (/er$/u.test(trimmed) && !/eer$/u.test(trimmed)) {
    extras.push(`${trimmed.slice(0, -2)}ery`);
  }
  return Object.freeze([...new Set(extras.filter((item) => item && item !== trimmed))]);
}

/**
 * Strip leading articles from a lexical target phrase.
 */
export function stripConversationalArticles(phrase: string): string {
  return phrase.replace(/^(the|a|an)\s+/i, "").trim();
}

/**
 * Strip significance adjectives from object-aware why/explain hints.
 * Generic — not per-object. Never invents a subject id.
 */
export function stripConversationalSignificanceQualifier(phrase: string): string {
  return phrase
    .replace(/^(?:is|are|the)\s+/u, "")
    .replace(
      /\s+(?:critical|important|relevant|urgent|at risk|the problem|the risk|happening|below target|above target|underperforming|off target)$/u,
      "",
    )
    .trim();
}
