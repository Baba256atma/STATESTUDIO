/**
 * B.36 — Domain-aware pilot review (B.29) and synthesis (B.33) wording (deterministic, no LLM).
 * B.37 — Phrase tables live in locale packs (`nexoraDomainPackRegistry`); this module applies them.
 */

import type { NexoraLocaleDomainId } from "../domain/nexoraDomainPack.ts";
import { toSafeLocaleDomainIdForRollout } from "../domain/nexoraDomainPackRollout.ts";
import { resolveNexoraLocaleDomainId, translateLocalePhrase } from "../domain/nexoraDomainPackRegistry.ts";
import type { NexoraPilotReview } from "./nexoraPilotReview.ts";
import type { NexoraPilotSynthesis } from "./nexoraPilotSynthesis.ts";

export type NexoraReviewDomainId = NexoraLocaleDomainId;

export function normalizeReviewDomain(domainId?: string | null): NexoraReviewDomainId {
  return resolveNexoraLocaleDomainId(domainId);
}

const PILOT_ATTENTION_RE = /^Pilot needs attention in (\d+) area\(s\) — prioritize recommendations below\.$/;

function mapPilotAttentionSummary(s: string, domain: NexoraReviewDomainId): string {
  const m = PILOT_ATTENTION_RE.exec(s);
  if (!m) return s;
  const n = m[1];
  switch (domain) {
    case "retail":
      return `Operational pilot needs attention in ${n} area(s) — prioritize recommendations below.`;
    case "supply_chain":
      return `Flow pilot needs attention in ${n} area(s) — prioritize recommendations below.`;
    case "finance":
      return `Risk pilot needs attention in ${n} area(s) — prioritize recommendations below.`;
    case "psych_yung":
      return `Interpretive pilot needs attention in ${n} area(s) — prioritize recommendations below.`;
    default:
      return s;
  }
}

function mapReviewSummary(s: string, domain: NexoraReviewDomainId): string {
  if (domain === "generic") return s;
  const d = toSafeLocaleDomainIdForRollout(domain);
  if (PILOT_ATTENTION_RE.test(s)) return mapPilotAttentionSummary(s, d);
  return translateLocalePhrase(s, d, "review");
}

export function mapReviewByDomain(review: NexoraPilotReview, domain: NexoraReviewDomainId): NexoraPilotReview {
  if (domain === "generic") return review;

  const d = toSafeLocaleDomainIdForRollout(domain);
  return {
    summary: mapReviewSummary(review.summary, domain),
    strengths: review.strengths.map((x) => translateLocalePhrase(x, d, "review")),
    weaknesses: review.weaknesses.map((x) => translateLocalePhrase(x, d, "review")),
    recommendations: review.recommendations.map((x) => translateLocalePhrase(x, d, "review")),
  };
}

function translateFinding(phrase: string, domain: NexoraReviewDomainId): string {
  if (domain === "generic") return phrase;
  const d = toSafeLocaleDomainIdForRollout(domain);
  return translateLocalePhrase(phrase, d, "auto");
}

export function mapSynthesisByDomain(synthesis: NexoraPilotSynthesis, domain: NexoraReviewDomainId): NexoraPilotSynthesis {
  if (domain === "generic") return synthesis;

  const d = toSafeLocaleDomainIdForRollout(domain);
  return {
    overallStatus: synthesis.overallStatus,
    summary: translateLocalePhrase(synthesis.summary, d, "synthesis"),
    keyFindings: synthesis.keyFindings.map((x) => translateFinding(x, domain)),
    priorities: synthesis.priorities.map((p) => translateLocalePhrase(p, d, "synthesis")),
  };
}

let lastB36LogKey = "";

export function emitDomainReviewSynthesisAppliedDevOnce(payload: {
  baseSignature: string;
  domain: NexoraReviewDomainId;
  summary: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${payload.baseSignature}|${payload.domain}|${payload.summary}`;
  if (key === lastB36LogKey) return;
  lastB36LogKey = key;
  globalThis.console?.debug?.("[Nexora][B36] domain_review_synthesis_applied", payload);
}
