/**
 * Phase B.5 / B.6 — short copy + highlight alignment + domain calibration (pure helpers).
 */

import { domainDefaultInsightHeadline, resolveDomainVocabulary } from "../lib/visual/domainVocabulary";
import type { FragilityDriver, FragilityScenePayload } from "../types/fragilityScanner";
import { augmentHighlightIdsWithDomainCalibration } from "./nexoraDomainCalibration";

const MAX_INSIGHT = 60;

const GENERIC_REASON_RE =
  /^(highlighted by fragility|observed pressure|risk detected|issue found|main pressure|active pressure)/i;

function shortenPhrase(raw: string, max: number): string {
  const t = String(raw ?? "")
    .replace(/^signal:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function isGenericScannerSummary(s: string): boolean {
  const t = s.toLowerCase().trim();
  if (t.length < 10) return true;
  if (/\b(undetermined|unknown|general)\b/.test(t) && t.length < 48) return true;
  return /\b(issue|issues|risk|alert)s?\b.*\b(detected|found|observed)\b/i.test(t) && t.length < 42;
}

function polishReasonLine(text: string, objectId: string, domainId?: string | null): string {
  const t = String(text ?? "").trim();
  if (!t || !GENERIC_REASON_RE.test(t)) return t;
  const vo = resolveDomainVocabulary(objectId, domainId) ?? resolveDomainVocabulary(t, domainId);
  if (vo?.clarityPhrase) return vo.clarityPhrase;
  return t;
}

function driverMatchScore(
  d: FragilityDriver,
  objectId: string,
  objectText: string,
  domainId?: string | null
): number {
  const ot = objectText.toLowerCase();
  const blob = [d.label, d.dimension, d.id, d.evidence_text]
    .map((x) => String(x ?? "").toLowerCase())
    .join(" ");
  let s = 0;
  for (const part of blob.split(/[^a-z0-9]+/).filter((p) => p.length > 2)) {
    if (ot.includes(part)) s += 1.5;
  }
  const vd = resolveDomainVocabulary(d.label, domainId);
  const vo = resolveDomainVocabulary(objectId, domainId);
  if (vd?.displayName && vo?.displayName && vd.displayName === vo.displayName) s += 6;
  return s;
}

function assignDriversToObjects(
  objectIds: string[],
  drivers: FragilityDriver[] | undefined,
  payload: FragilityScenePayload | null | undefined,
  domainId?: string | null
): Record<string, FragilityDriver> {
  if (!drivers?.length) return {};
  const used = new Set<number>();
  const out: Record<string, FragilityDriver> = {};
  const sortedIds = [...objectIds].map((id) => String(id).trim()).filter(Boolean);
  const reasonsMap = payload?.reasons_by_object ?? {};

  for (const id of sortedIds) {
    const po = payload?.objects?.find((o) => String(o?.id ?? "").trim() === id);
    const reasonBits = Array.isArray(reasonsMap[id]) ? reasonsMap[id].map(String).join(" ") : "";
    const objectText = [id, po?.id, po?.reason, reasonBits].filter(Boolean).join(" ");

    let bestI = -1;
    let bestS = 0;
    drivers.forEach((d, i) => {
      if (used.has(i)) return;
      const score = driverMatchScore(d, id, objectText, domainId);
      if (score > bestS) {
        bestS = score;
        bestI = i;
      }
    });
    if (bestI >= 0 && bestS >= 2) {
      used.add(bestI);
      out[id] = drivers[bestI];
    }
  }
  return out;
}

function shortDriverCaption(d: FragilityDriver, domainId?: string | null): string {
  const fromVocab = resolveDomainVocabulary(d.label, domainId);
  if (fromVocab?.clarityPhrase) return fromVocab.clarityPhrase;
  return shortenPhrase(d.label, 34);
}

/** One-line system insight for B.3 HUD (≤60 chars). B.6: domain + driver-aware when summary is thin/generic. */
export function buildPipelineInsightLine(
  summary: string | null | undefined,
  drivers: FragilityDriver[] | undefined,
  fragilityLevel: string | null | undefined,
  domainId?: string | null
): string | null {
  const sum = String(summary ?? "").trim();
  if (sum && !isGenericScannerSummary(sum)) {
    return shortenPhrase(sum, MAX_INSIGHT);
  }

  const top = drivers?.[0];
  const headline = domainDefaultInsightHeadline(domainId);
  const L = String(fragilityLevel ?? "").toLowerCase();
  const levelHint =
    L === "critical" || L === "high" ? "rising" : L === "medium" || L === "moderate" ? "building" : "";

  if (top?.label) {
    const piece = levelHint ? `${headline} ${levelHint}` : headline;
    return shortenPhrase(`${piece}: ${top.label}`, MAX_INSIGHT);
  }

  if (sum) return shortenPhrase(sum, MAX_INSIGHT);
  return shortenPhrase(headline, MAX_INSIGHT);
}

export function alignFragilityHighlightIdsForClarity(args: {
  sceneObjectIds: string[];
  highlightIds: string[];
  matchedObjectIds: string[];
  suggestedFocusIds: string[];
  reasonsByObject: Record<string, string[]> | undefined;
  domainId?: string | null;
  calibrationCorpus?: string | null;
  sceneObjects?: Array<{ id?: string; name?: string; label?: string; tags?: string[] }> | null;
}): string[] {
  const sceneSet = new Set(args.sceneObjectIds.map((id) => String(id).trim()).filter(Boolean));
  const inScene = args.highlightIds
    .map((id) => String(id).trim())
    .filter((id) => id && sceneSet.has(id));

  const matchedSet = new Set(args.matchedObjectIds.map((id) => String(id).trim()).filter(Boolean));
  const focusSet = new Set(args.suggestedFocusIds.map((id) => String(id).trim()).filter(Boolean));
  const reasonKeys = args.reasonsByObject
    ? new Set(Object.keys(args.reasonsByObject).map((k) => String(k).trim()))
    : new Set<string>();

  const aligned = inScene.filter((id) => matchedSet.has(id) || focusSet.has(id) || reasonKeys.has(id));
  let out = aligned.length > 0 ? aligned : inScene;
  out = Array.from(new Set(out));

  const corpus = String(args.calibrationCorpus ?? "").trim();
  const objs = args.sceneObjects;
  if (corpus && objs && objs.length > 0 && out.length < 2) {
    out = augmentHighlightIdsWithDomainCalibration({
      sceneObjectIds: args.sceneObjectIds,
      highlightIds: out,
      sceneObjects: objs,
      corpus,
      domainId: args.domainId,
      maxAdditional: 2,
      minScore: 3.5,
    });
  }

  return out;
}

export function buildClarityCaptionsByObjectId(args: {
  objectIds: string[];
  payload: FragilityScenePayload | null | undefined;
  drivers: FragilityDriver[] | undefined;
  domainId?: string | null;
}): Record<string, string> {
  const { objectIds, payload, drivers, domainId } = args;
  const reasonsMap = payload?.reasons_by_object ?? {};
  const assigned = assignDriversToObjects(objectIds, drivers, payload, domainId);

  const out: Record<string, string> = {};
  for (const rawId of objectIds) {
    const id = String(rawId ?? "").trim();
    if (!id) continue;

    const directReasons = reasonsMap[id];
    let parts: string[] = [];
    if (Array.isArray(directReasons) && directReasons.length > 0) {
      parts = directReasons
        .map((r) => polishReasonLine(String(r ?? ""), id, domainId))
        .map((r) => shortenPhrase(r, 28))
        .filter(Boolean)
        .slice(0, 2);
    }
    if (parts.length === 0 && payload?.objects?.length) {
      const po = payload.objects.find((o) => String(o?.id ?? "").trim() === id);
      if (po?.reason) {
        const one = shortenPhrase(polishReasonLine(po.reason, id, domainId), 40);
        if (one) parts = [one];
      }
    }
    if (parts.length === 0 && assigned[id]) {
      parts = [shortDriverCaption(assigned[id], domainId)];
    }
    if (parts.length === 0) {
      const vo = resolveDomainVocabulary(id, domainId);
      if (vo?.clarityPhrase) parts = [vo.clarityPhrase];
    }
    if (parts.length === 0 && objectIds.length === 1 && drivers?.[0]) {
      parts = [shortDriverCaption(drivers[0], domainId)];
    }
    if (parts.length > 0) out[id] = parts.join(" · ");
  }
  return out;
}

export function buildB5ClaritySignature(args: {
  alignedHighlightIds: string[];
  captions: Record<string, string>;
  insightLine: string | null;
}): string {
  const capKeys = Object.keys(args.captions)
    .sort()
    .map((k) => `${k}:${args.captions[k]}`)
    .join("|");
  return `${args.insightLine ?? ""}::${[...args.alignedHighlightIds].sort().join(",")}::${capKeys}`;
}
