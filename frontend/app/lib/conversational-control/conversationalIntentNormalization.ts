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
export function isAmbiguousConversationalReference(token: string): boolean {
  const t = token.trim().toLowerCase();
  return (
    t === "this" ||
    t === "that" ||
    t === "it" ||
    t === "them" ||
    t === "these" ||
    t === "those" ||
    t === "here" ||
    t === "there" ||
    t === "the current" ||
    t === "current one" ||
    t === "the selected" ||
    t === "selected one"
  );
}

/**
 * Strip leading articles from a lexical target phrase.
 */
export function stripConversationalArticles(phrase: string): string {
  return phrase.replace(/^(the|a|an)\s+/i, "").trim();
}
