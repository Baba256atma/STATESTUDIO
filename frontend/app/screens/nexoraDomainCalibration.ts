/**
 * Phase B.6 — domain-aware calibration for highlight hints (pure helpers, no React).
 */

import {
  getDomainVocabularyPack,
  resolveDomainVocabulary,
  type DomainVocabularyEntry,
} from "../lib/visual/domainVocabulary";

function normalizeCorpus(raw: string): string {
  return String(raw ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function scoreEntryOnCorpus(entry: DomainVocabularyEntry, corpus: string): number {
  if (!corpus) return 0;
  const parts: string[] = [
    ...entry.match,
    ...(entry.aliases ?? []),
    ...(entry.signalHints ?? []),
  ]
    .map((s) => String(s).toLowerCase().trim())
    .filter(Boolean);

  let score = 0;
  for (const p of parts) {
    if (!p) continue;
    if (corpus.includes(p)) {
      score += p.length >= 14 ? 4 : p.length >= 8 ? 3 : 2;
    } else {
      const words = p.split(/[^a-z0-9]+/).filter((w) => w.length > 2);
      const hits = words.filter((w) => corpus.includes(w)).length;
      if (hits >= 2) score += hits + 1;
      else if (hits === 1) score += 0.75;
    }
  }
  return score;
}

function objectBlob(obj: { id?: string; name?: string; label?: string; tags?: string[] }): string {
  return [obj.id, obj.name, obj.label, ...(Array.isArray(obj.tags) ? obj.tags : [])]
    .map((x) => String(x ?? "").toLowerCase())
    .join(" ");
}

/**
 * Score how strongly a scene object aligns with the calibration corpus for this domain.
 */
export function scoreSceneObjectAgainstCorpus(
  obj: { id?: string; name?: string; label?: string; tags?: string[] },
  corpus: string,
  domainId?: string | null
): number {
  const c = normalizeCorpus(corpus);
  if (!c) return 0;
  const pack = getDomainVocabularyPack(domainId);
  const blob = objectBlob(obj);
  const labelKey = String(obj.label ?? obj.name ?? obj.id ?? "").trim();
  const resolvedObj = labelKey ? resolveDomainVocabulary(labelKey, domainId) : null;
  let best = 0;

  for (const entry of pack.entries) {
    const entryCorpusScore = scoreEntryOnCorpus(entry, c);
    if (entryCorpusScore <= 0) continue;

    const nameMatch =
      resolvedObj?.displayName && entry.displayName && resolvedObj.displayName === entry.displayName ? 3.5 : 0;
    const tokenOverlap = entry.match.some((m) => m.length > 2 && blob.includes(m.toLowerCase())) ? 2 : 0;

    const combined = entryCorpusScore + nameMatch + tokenOverlap;
    best = Math.max(best, combined);
  }

  return best;
}

export type AugmentHighlightCalibrationArgs = {
  sceneObjectIds: string[];
  highlightIds: string[];
  sceneObjects: Array<{ id?: string; name?: string; label?: string; tags?: string[] }>;
  corpus: string;
  domainId?: string | null;
  /** Extra ids to add beyond current highlight count (default 2). */
  maxAdditional?: number;
  /** Minimum calibration score to propose an object (default 3.5). */
  minScore?: number;
};

/**
 * When scanner mapping is thin, add in-scene objects that strongly match summary/driver corpus.
 */
export function augmentHighlightIdsWithDomainCalibration(args: AugmentHighlightCalibrationArgs): string[] {
  const corpus = normalizeCorpus(args.corpus);
  if (!corpus || !args.sceneObjectIds.length) return [...new Set(args.highlightIds)];

  const minScore = args.minScore ?? 3.5;
  const maxAdd = args.maxAdditional ?? 2;
  const existing = new Set(args.highlightIds.map((id) => String(id).trim()).filter(Boolean));

  const byId = new Map<string, (typeof args.sceneObjects)[0]>();
  for (const o of args.sceneObjects) {
    const id = String(o?.id ?? "").trim();
    if (id) byId.set(id, o);
  }

  const ranked = args.sceneObjectIds
    .map((id) => {
      const obj = byId.get(id) ?? { id };
      return { id, score: scoreSceneObjectAgainstCorpus(obj, corpus, args.domainId) };
    })
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score);

  const out = [...existing];
  let added = 0;
  for (const { id } of ranked) {
    if (added >= maxAdd) break;
    if (existing.has(id)) continue;
    out.push(id);
    existing.add(id);
    added += 1;
  }

  return [...new Set(out)];
}
