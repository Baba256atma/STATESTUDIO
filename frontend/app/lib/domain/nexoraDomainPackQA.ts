/**
 * B.38 — Domain pack QA / coverage gate (deterministic, no backend).
 */

import type { NexoraLocaleDomainId, NexoraLocaleDomainPack } from "./nexoraDomainPack.ts";
import {
  CANONICAL_SYNTH_FINDING_KEYS,
  CANONICAL_SYNTH_PRIORITY_KEYS,
  CANONICAL_SYNTH_SUMMARY_KEYS,
} from "./nexoraDomainPackMappings.ts";
import {
  getNexoraLocalePack,
  listNexoraLocaleDomainPacks,
  REQUIRED_INSIGHT_MAPPING_KEYS,
  resolveNexoraLocaleDomainId,
  validateLocalePackRegistry,
} from "./nexoraDomainPackRegistry.ts";

export type NexoraDomainPackQAStatus = "ready" | "partial" | "invalid";

export type NexoraDomainPackQAReport = {
  domainId: string;
  status: NexoraDomainPackQAStatus;
  score: number;
  coverage: {
    insight: number;
    review: number;
    synthesis: number;
    vocabulary: number;
  };
  issues: string[];
};

/** Semantic review requirements → canonical `reviewMapping` keys (B.36). */
const REVIEW_REQUIREMENT_KEYS: Record<string, string> = {
  low_compare: "Users are not exploring scenarios enough",
  low_decision: "Users hesitate to make decisions",
  low_outcome: "Learning loop is weak",
};

export const REQUIRED_KEYS = {
  insight: [...REQUIRED_INSIGHT_MAPPING_KEYS],
  review: Object.keys(REVIEW_REQUIREMENT_KEYS),
  synthesis: ["summary", "finding", "priority"],
} as const;

function countPresentInsight(pack: NexoraLocaleDomainPack): number {
  let n = 0;
  for (const k of REQUIRED_INSIGHT_MAPPING_KEYS) {
    const v = pack.insightMapping?.[k];
    if (typeof v === "string" && v.trim()) n += 1;
  }
  return n;
}

function countPresentReview(pack: NexoraLocaleDomainPack): number {
  let n = 0;
  for (const key of Object.values(REVIEW_REQUIREMENT_KEYS)) {
    const v = pack.reviewMapping?.[key];
    if (typeof v === "string" && v.trim()) n += 1;
  }
  return n;
}

function synthGroupCoverage(
  pack: NexoraLocaleDomainPack,
  keys: readonly string[],
  pick: (k: string) => string | undefined,
): number {
  if (keys.length === 0) return 1;
  let present = 0;
  for (const k of keys) {
    const v = pick(k);
    if (typeof v === "string" && v.trim()) present += 1;
  }
  return present / keys.length;
}

function synthesisSectionCoverage(pack: NexoraLocaleDomainPack): number {
  const sm = pack.synthesisMapping ?? {};
  const summary = synthGroupCoverage(pack, CANONICAL_SYNTH_SUMMARY_KEYS, (k) => sm[k]);
  const finding = synthGroupCoverage(pack, CANONICAL_SYNTH_FINDING_KEYS, (k) => sm[k]);
  const priority = synthGroupCoverage(pack, CANONICAL_SYNTH_PRIORITY_KEYS, (k) => sm[k]);
  return (summary + finding + priority) / 3;
}

function vocabularyCoverage(pack: NexoraLocaleDomainPack): number {
  if (pack.id === "generic") return 1;
  const stems = Object.keys(pack.vocabulary ?? {}).length;
  if (stems === 0 && (pack.id === "psych_yung" || pack.id === "generic")) return 1;
  return Math.min(1, stems / 3);
}

function collectDuplicateIssuesForPack(packId: string, registryIssues: readonly string[]): string[] {
  const out: string[] = [];
  for (const line of registryIssues) {
    if (line.includes("duplicate alias") && line.includes(packId)) out.push(line);
  }
  return out;
}

/**
 * Evaluate a single locale pack for completeness vs B.38 requirements.
 */
export function evaluateDomainPackCoverage(
  pack: NexoraLocaleDomainPack,
  options?: { registryIssues?: readonly string[] },
): NexoraDomainPackQAReport {
  const issues: string[] = [];
  const registryIssues = options?.registryIssues ?? validateLocalePackRegistry();
  issues.push(...collectDuplicateIssuesForPack(pack.id, registryIssues));

  if (!String(pack.id ?? "").trim()) issues.push("Missing pack id");
  if (!String(pack.label ?? "").trim()) issues.push("Missing pack label");
  if (!Array.isArray(pack.aliases) || (pack.aliases.length === 0 && pack.id !== "generic")) {
    issues.push("No aliases defined");
  }

  const insightKeys = Object.keys(pack.insightMapping ?? {});
  if (insightKeys.length === 0) {
    issues.push("No insightMapping");
  } else {
    for (const k of REQUIRED_INSIGHT_MAPPING_KEYS) {
      const v = pack.insightMapping?.[k];
      if (!v || !String(v).trim()) {
        issues.push(`Missing insight mapping: ${k}`);
      }
    }
  }

  const insightPresent = countPresentInsight(pack);
  const insightCov = insightPresent / REQUIRED_INSIGHT_MAPPING_KEYS.length;

  const reviewPresent = countPresentReview(pack);
  const reviewCov = reviewPresent / Object.keys(REVIEW_REQUIREMENT_KEYS).length;
  if (reviewCov < 1 && pack.id !== "generic") {
    for (const [label, key] of Object.entries(REVIEW_REQUIREMENT_KEYS)) {
      if (!pack.reviewMapping?.[key]?.trim()) {
        issues.push(`Review mapping incomplete: ${label} (${key})`);
      }
    }
  }

  const synthCov = synthesisSectionCoverage(pack);
  if (synthCov < 1 && pack.id !== "generic") {
    issues.push("Synthesis mapping incomplete");
  }

  const vocabCov = vocabularyCoverage(pack);
  if (vocabCov < 0.34 && pack.id !== "generic" && pack.id !== "psych_yung") {
    issues.push("Low vocabulary coverage");
  }

  const coverage = {
    insight: insightCov,
    review: reviewCov,
    synthesis: synthCov,
    vocabulary: vocabCov,
  };

  const score = (coverage.insight + coverage.review + coverage.synthesis + coverage.vocabulary) / 4;

  let status: NexoraDomainPackQAStatus = "ready";
  const critical =
    !String(pack.id ?? "").trim() ||
    !String(pack.label ?? "").trim() ||
    (!pack.aliases?.length && pack.id !== "generic") ||
    insightKeys.length === 0 ||
    score < 0.3;

  const hasDuplicate = issues.some((x) => x.includes("duplicate alias"));
  const hasMissingRequiredCoverage =
    insightCov < 1 ||
    (pack.id !== "generic" && reviewCov < 1) ||
    (pack.id !== "generic" && synthCov < 1);

  if (critical || hasDuplicate) {
    status = "invalid";
  } else if (score < 0.75 || hasMissingRequiredCoverage) {
    status = "partial";
  }

  if (pack.id === "generic" && score >= 0.75 && insightCov >= 1 && !hasDuplicate) {
    status = "ready";
  }

  return {
    domainId: pack.id,
    status,
    score: Math.round(score * 1000) / 1000,
    coverage,
    issues,
  };
}

export function evaluateAllDomainPacksQA(): NexoraDomainPackQAReport[] {
  const reg = validateLocalePackRegistry();
  return listNexoraLocaleDomainPacks().map((p) => evaluateDomainPackCoverage(p, { registryIssues: reg }));
}

export function getDomainPackQAStatus(domainId: string): NexoraDomainPackQAStatus {
  const id = resolveNexoraLocaleDomainId(domainId);
  const pack = listNexoraLocaleDomainPacks().find((p) => p.id === id) ?? listNexoraLocaleDomainPacks().find((p) => p.id === "generic")!;
  const reg = validateLocalePackRegistry();
  return evaluateDomainPackCoverage(pack, { registryIssues: reg }).status;
}

const partialWarned = new Set<string>();
let lastB38LogKey = "";

function emitDomainPackQAEvaluatedDevOnce(payload: { packCount: number; signature: string }): void {
  if (process.env.NODE_ENV === "production") return;
  if (payload.signature === lastB38LogKey) return;
  lastB38LogKey = payload.signature;
  globalThis.console?.debug?.("[Nexora][B38] domain_pack_qa_evaluated", payload);
}

/**
 * Non-blocking guard: invalid packs resolve to `generic`; partial logs once in dev.
 */
export function toSafeLocaleDomainIdForPack(domainId?: string | null): NexoraLocaleDomainId {
  const id = resolveNexoraLocaleDomainId(domainId);
  if (id === "generic") return "generic";
  const st = getDomainPackQAStatus(id);
  if (st === "invalid") return "generic";
  if (st === "partial" && process.env.NODE_ENV !== "production") {
    if (!partialWarned.has(id)) {
      partialWarned.add(id);
      globalThis.console?.warn?.(`[Nexora][B38] locale pack "${id}" is PARTIAL — some mappings may fall back to generic.`);
    }
  }
  return id;
}

/** Run full QA, optional dev log; returns reports for `__NEXORA_DEBUG__.domainPackQA`. */
export function runDomainPackQAAndLogDev(): NexoraDomainPackQAReport[] {
  const reports = evaluateAllDomainPacksQA();
  const signature = reports.map((r) => `${r.domainId}:${r.status}:${r.score}`).join("|");
  emitDomainPackQAEvaluatedDevOnce({ packCount: reports.length, signature });
  return reports;
}
