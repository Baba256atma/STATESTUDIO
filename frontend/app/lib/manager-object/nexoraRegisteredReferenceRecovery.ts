/**
 * NCA-POST:1 — Registered-reference recovery.
 * Normalizes manager language and fuzzy-matches only the supplied catalog.
 * Does not invent subjects, data, or business reasoning.
 */

export const nexoraNcaPost1Identity =
  "NCA-POST:1/NaturalLanguageRecoveryFailedTurnContinuityInitiativeDiscipline" as const;
export const nexoraNcaPost1Version = "1.0.0" as const;
export const nexoraNcaPost1Namespace =
  "nexora.nca.post.natural-language-recovery-failed-turn-continuity-initiative-discipline" as const;

export const REGISTERED_REFERENCE_CONFIDENCE = Object.freeze([
  "EXACT",
  "NORMALIZED_EXACT",
  "HIGH_CONFIDENCE_FUZZY",
  "AMBIGUOUS",
  "UNRESOLVED",
] as const);

export type RegisteredReferenceConfidence =
  (typeof REGISTERED_REFERENCE_CONFIDENCE)[number];

export type RegisteredReferenceCandidate = {
  readonly subjectId: string;
  readonly canonicalName: string;
  readonly matchedKey: string;
  readonly distance: number;
  readonly method: "exact" | "normalized-exact" | "morphology" | "fuzzy";
};

export type RegisteredReferenceResolution = {
  readonly raw: string;
  readonly normalized: string;
  readonly confidence: RegisteredReferenceConfidence;
  readonly matches: readonly RegisteredReferenceCandidate[];
  readonly selected: RegisteredReferenceCandidate | null;
  readonly ambiguous: boolean;
};

export type RegisteredReferenceCatalogEntry = {
  readonly subjectId: string;
  readonly canonicalName: string;
  readonly keys: readonly string[];
};

const FILLER_PREFIX =
  /^(?:please|show(?:\s+me)?|open|bring(?:\s+up)?|look(?:\s+at)?|focus(?:\s+on)?|explain|what(?:\s+is|\s+about)?|the|a|an|this|that|our|my)\s+/u;

export function normalizeRegisteredReferenceText(value: string): string {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripReferenceFillers(value: string): string {
  let text = normalizeRegisteredReferenceText(value);
  let previous = "";
  while (text && text !== previous) {
    previous = text;
    text = text.replace(FILLER_PREFIX, "").trim();
  }
  text = text.replace(/\b(?:please|object|item|card|view)\b/g, " ").replace(/\s+/g, " ").trim();
  return text;
}

export function damerauLevenshtein(a: string, b: string, limit = 2): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i]![0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0]![j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i]![j] = Math.min(matrix[i]![j]!, matrix[i - 2]![j - 2]! + 1);
      }
    }
  }
  return matrix[a.length]![b.length]!;
}

export function allowedFuzzyDistance(length: number): number {
  if (length < 5) return 0;
  if (length < 7) return 1;
  return 2;
}

function morphologyKeys(key: string): readonly string[] {
  const extras = new Set<string>([key]);
  if (key.endsWith("ies") && key.length > 4) extras.add(`${key.slice(0, -3)}y`);
  if (key.endsWith("y") && key.length > 3) extras.add(`${key.slice(0, -1)}ies`);
  if (key.endsWith("s") && !key.endsWith("ss") && key.length > 3) extras.add(key.slice(0, -1));
  if (!key.endsWith("s")) extras.add(`${key}s`);
  return Object.freeze([...extras]);
}

export function resolveRegisteredReference(input: {
  readonly raw: string;
  readonly catalog: readonly RegisteredReferenceCatalogEntry[];
  readonly contextNames?: readonly string[];
}): RegisteredReferenceResolution {
  const raw = String(input.raw ?? "").trim();
  const normalized = stripReferenceFillers(raw);
  if (!normalized) {
    return Object.freeze({
      raw,
      normalized,
      confidence: "UNRESOLVED",
      matches: Object.freeze([]),
      selected: null,
      ambiguous: false,
    });
  }

  const exact: RegisteredReferenceCandidate[] = [];
  const morph: RegisteredReferenceCandidate[] = [];
  const fuzzy: RegisteredReferenceCandidate[] = [];
  const context = new Set(
    (input.contextNames ?? []).map((name) => normalizeRegisteredReferenceText(name)),
  );

  for (const entry of input.catalog) {
    const keys = [...new Set(entry.keys.map((key) => normalizeRegisteredReferenceText(key)).filter(Boolean))];
    for (const key of keys) {
      if (key === normalized) {
        exact.push(candidate(entry, key, 0, normalized === stripReferenceFillers(raw) && raw.toLowerCase() === key ? "exact" : "normalized-exact"));
        break;
      }
      if (morphologyKeys(key).includes(normalized) || morphologyKeys(normalized).includes(key)) {
        morph.push(candidate(entry, key, 0, "morphology"));
        break;
      }
    }
  }
  if (exact.length === 1) return finish(raw, normalized, exact, "EXACT");
  if (exact.length > 1) return finish(raw, normalized, exact, "AMBIGUOUS");
  if (morph.length === 1) return finish(raw, normalized, morph, "NORMALIZED_EXACT");
  if (morph.length > 1) return finish(raw, normalized, morph, "AMBIGUOUS");

  const token = normalized.replace(/\s+/g, "");
  const limit = allowedFuzzyDistance(Math.max(token.length, 1));
  if (limit > 0) {
    for (const entry of input.catalog) {
      const keys = [...new Set(entry.keys.map((key) => normalizeRegisteredReferenceText(key)).filter(Boolean))];
      let best: RegisteredReferenceCandidate | null = null;
      for (const key of keys) {
        const compact = key.replace(/\s+/g, "");
        if (compact.length < 5) continue;
        const distance = damerauLevenshtein(token, compact, limit);
        if (distance > limit) continue;
        if (distance / Math.max(token.length, compact.length) > 0.34) continue;
        if (!best || distance < best.distance) {
          best = candidate(entry, key, distance, "fuzzy");
        }
      }
      if (best) fuzzy.push(best);
    }
  }

  fuzzy.sort((left, right) => {
    if (left.distance !== right.distance) return left.distance - right.distance;
    const leftCtx = context.has(normalizeRegisteredReferenceText(left.canonicalName)) ? 0 : 1;
    const rightCtx = context.has(normalizeRegisteredReferenceText(right.canonicalName)) ? 0 : 1;
    return leftCtx - rightCtx;
  });
  const unique = dedupe(fuzzy);
  if (unique.length === 0) return finish(raw, normalized, unique, "UNRESOLVED");
  const best = unique[0]!;
  const close = unique.filter((item) => item.distance <= best.distance);
  if (close.length > 1) return finish(raw, normalized, close, "AMBIGUOUS");
  if (unique[1] && unique[1].distance === best.distance) {
    return finish(raw, normalized, unique.slice(0, 2), "AMBIGUOUS");
  }
  return finish(raw, normalized, [best], "HIGH_CONFIDENCE_FUZZY");
}

function candidate(
  entry: RegisteredReferenceCatalogEntry,
  matchedKey: string,
  distance: number,
  method: RegisteredReferenceCandidate["method"],
): RegisteredReferenceCandidate {
  return Object.freeze({
    subjectId: entry.subjectId,
    canonicalName: entry.canonicalName,
    matchedKey,
    distance,
    method,
  });
}

function dedupe(
  items: readonly RegisteredReferenceCandidate[],
): readonly RegisteredReferenceCandidate[] {
  const seen = new Set<string>();
  const out: RegisteredReferenceCandidate[] = [];
  for (const item of items) {
    if (seen.has(item.subjectId)) continue;
    seen.add(item.subjectId);
    out.push(item);
  }
  return Object.freeze(out);
}

function finish(
  raw: string,
  normalized: string,
  matches: readonly RegisteredReferenceCandidate[],
  confidence: RegisteredReferenceConfidence,
): RegisteredReferenceResolution {
  const unique = dedupe(matches);
  const ambiguous = confidence === "AMBIGUOUS" || unique.length > 1;
  return Object.freeze({
    raw,
    normalized,
    confidence: ambiguous && unique.length > 1 ? "AMBIGUOUS" : confidence,
    matches: unique,
    selected: !ambiguous && unique.length === 1 ? unique[0]! : null,
    ambiguous,
  });
}

export function isRepairFollowUpUtterance(utterance: string): boolean {
  const text = normalizeRegisteredReferenceText(utterance).replace(/[?!.]+$/g, "");
  return /^(?:why|why not|how|what do you mean|what happened|explain|huh|what|sorry|come again)$/.test(
    text,
  );
}

export function isAbandonRepairUtterance(utterance: string): boolean {
  return /^(?:forget it|never mind|nevermind|drop it|leave it)$/i.test(
    normalizeRegisteredReferenceText(utterance),
  );
}

export function isProcessStateLanguage(text: string): boolean {
  return /journey process blocker|process blocker|decision_required|no decision (?:is |has been )?committed|options are understood enough to proceed|canonical relationship|goal linkage/i.test(
    text,
  );
}
