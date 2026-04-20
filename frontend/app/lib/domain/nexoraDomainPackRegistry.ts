/**
 * B.37 — Locale / pilot domain packs: registry, resolution, validation.
 * Does not replace shell packs in `domainPackRegistry.ts` — use `getNexoraLocalePack` here.
 */

import type { NexoraLocaleDomainId, NexoraLocaleDomainPack } from "./nexoraDomainPack.ts";
import {
  LOCALE_PACK_EXTRA_VOCAB,
  REVIEW_RECOMMENDATION,
  REVIEW_STRENGTH,
  REVIEW_SUMMARY,
  REVIEW_WEAKNESS,
  SYNTH_FINDING,
  SYNTH_PRIORITY,
  SYNTH_SUMMARY,
} from "./nexoraDomainPackMappings.ts";

const REVIEW_TABLES = [REVIEW_WEAKNESS, REVIEW_STRENGTH, REVIEW_RECOMMENDATION, REVIEW_SUMMARY] as const;
const SYNTH_TABLES = [SYNTH_FINDING, SYNTH_PRIORITY, SYNTH_SUMMARY] as const;

function sliceRowTable(id: NexoraLocaleDomainId, tables: readonly Record<string, Record<NexoraLocaleDomainId, string>>[]) {
  const out: Record<string, string> = {};
  for (const t of tables) {
    for (const [genericKey, row] of Object.entries(t)) {
      out[genericKey] = row[id];
    }
  }
  return out;
}

/** B.35 — stable keys for `insightMapping` (generic pack must define all). */
export const REQUIRED_INSIGHT_MAPPING_KEYS = [
  "line_weak",
  "line_strong",
  "line_scenario_explore",
  "line_decision_util",
  "line_outcome_record",
  "line_moderate_generic",
  "hint_compare",
  "hint_outcome",
  "hint_explanation",
  "hint_reliability",
  "hint_mapping",
  "hint_clarity",
] as const;


const INSIGHT_LINES: Record<NexoraLocaleDomainId, Record<string, string>> = {
  generic: {
    line_weak: "System insight: performance is limited. Focus on improving reliability and usage flow.",
    line_strong: "System insight: system is performing well. Continue current usage.",
    line_scenario_explore: "System insight: explore more scenarios to improve decisions.",
    line_decision_util: "System insight: decisions are not being fully utilized.",
    line_outcome_record: "System insight: record outcomes to improve learning.",
    line_moderate_generic: "System insight: usage patterns can be tightened to get more from Nexora.",
  },
  retail: {
    line_weak: "System insight: performance is limited. Focus on improving reliability and usage flow.",
    line_strong: "System insight: operations are tracking well. Continue the current approach.",
    line_scenario_explore: "System insight: compare more operational paths before acting.",
    line_decision_util: "System insight: operational decisions are not being fully acted on.",
    line_outcome_record: "System insight: capture execution outcomes to improve operational learning.",
    line_moderate_generic: "System insight: usage patterns can be tightened to get more from Nexora.",
  },
  supply_chain: {
    line_weak: "System insight: performance is limited. Focus on improving reliability and usage flow.",
    line_strong: "System insight: flow signals are stable. Continue the current response pattern.",
    line_scenario_explore: "System insight: test more flow scenarios before intervention.",
    line_decision_util: "System insight: response options are not being fully used.",
    line_outcome_record: "System insight: capture downstream outcomes to improve flow learning.",
    line_moderate_generic: "System insight: usage patterns can be tightened to get more from Nexora.",
  },
  finance: {
    line_weak: "System insight: performance is limited. Focus on improving reliability and usage flow.",
    line_strong: "System insight: decision quality is stable. Continue the current discipline.",
    line_scenario_explore: "System insight: review more risk paths before committing.",
    line_decision_util: "System insight: risk decisions are not being fully activated.",
    line_outcome_record: "System insight: capture result outcomes to improve risk learning.",
    line_moderate_generic: "System insight: usage patterns can be tightened to get more from Nexora.",
  },
  psych_yung: {
    line_weak: "System insight: performance is limited. Focus on improving reliability and usage flow.",
    line_strong: "System insight: interpretive patterns are stabilizing. Continue the current reflective path.",
    line_scenario_explore: "System insight: explore more interpretive paths before concluding.",
    line_decision_util: "System insight: interpretations are not yet being fully integrated.",
    line_outcome_record: "System insight: capture reflection outcomes to deepen interpretation learning.",
    line_moderate_generic: "System insight: usage patterns can be tightened to get more from Nexora.",
  },
};

const INSIGHT_HINTS_SHARED = {
  hint_outcome: "Try: record what happened after key decisions.",
  hint_explanation: "Try: use “Why this?” when a result feels unclear.",
  hint_reliability: "Try: rerun assessment if errors repeat.",
  hint_mapping: "Try: verify inputs and sources before deciding.",
  hint_clarity: "Try: compare options side by side before you decide.",
} as const;

const INSIGHT_HINTS_COMPARE: Record<NexoraLocaleDomainId, string> = {
  generic: "Try: explore scenarios more.",
  retail: "Try: compare more operating paths.",
  supply_chain: "Try: test more flow paths.",
  finance: "Try: review more risk paths.",
  psych_yung: "Try: test more interpretive frames.",
};

function buildInsightMapping(id: NexoraLocaleDomainId): Record<string, string> {
  return {
    ...INSIGHT_LINES[id],
    hint_compare: INSIGHT_HINTS_COMPARE[id],
    ...INSIGHT_HINTS_SHARED,
  };
}

function buildLocalePacks(): NexoraLocaleDomainPack[] {
  return [
    {
      id: "generic",
      label: "Generic",
      aliases: ["generic", "default", "business", "devops", "strategy", "general", ""],
      vocabulary: { ...(LOCALE_PACK_EXTRA_VOCAB.generic ?? {}) },
      insightMapping: buildInsightMapping("generic"),
      reviewMapping: sliceRowTable("generic", REVIEW_TABLES),
      synthesisMapping: sliceRowTable("generic", SYNTH_TABLES),
      rollout: { allowPilot: true, allowProduct: true },
    },
    {
      id: "retail",
      label: "Retail",
      aliases: ["retail", "commerce", "store", "merchant"],
      vocabulary: { ...(LOCALE_PACK_EXTRA_VOCAB.retail ?? {}) },
      insightMapping: buildInsightMapping("retail"),
      reviewMapping: sliceRowTable("retail", REVIEW_TABLES),
      synthesisMapping: sliceRowTable("retail", SYNTH_TABLES),
      rollout: { allowPilot: true, allowProduct: true },
    },
    {
      id: "supply_chain",
      label: "Supply chain",
      aliases: ["supply_chain", "supply-chain", "scm", "supplier_network", "supplier network"],
      vocabulary: { ...(LOCALE_PACK_EXTRA_VOCAB.supply_chain ?? {}) },
      insightMapping: buildInsightMapping("supply_chain"),
      reviewMapping: sliceRowTable("supply_chain", REVIEW_TABLES),
      synthesisMapping: sliceRowTable("supply_chain", SYNTH_TABLES),
      rollout: { allowPilot: true, allowProduct: true },
    },
    {
      id: "finance",
      label: "Finance",
      aliases: ["finance", "finops", "treasury"],
      vocabulary: { ...(LOCALE_PACK_EXTRA_VOCAB.finance ?? {}) },
      insightMapping: buildInsightMapping("finance"),
      reviewMapping: sliceRowTable("finance", REVIEW_TABLES),
      synthesisMapping: sliceRowTable("finance", SYNTH_TABLES),
      rollout: { allowPilot: true, allowProduct: true },
    },
    {
      id: "psych_yung",
      label: "Psychological (Jungian)",
      aliases: ["psych_yung", "psych", "yung", "jung", "psycho_spiritual", "psycho-spiritual"],
      vocabulary: {},
      insightMapping: buildInsightMapping("psych_yung"),
      reviewMapping: sliceRowTable("psych_yung", REVIEW_TABLES),
      synthesisMapping: sliceRowTable("psych_yung", SYNTH_TABLES),
      trustBias: -0.05,
      rollout: { allowPilot: true, allowProduct: false },
    },
  ];
}

const LOCALE_PACKS: NexoraLocaleDomainPack[] = buildLocalePacks();
const LOCALE_PACKS_BY_ID: Record<string, NexoraLocaleDomainPack> = Object.fromEntries(LOCALE_PACKS.map((p) => [p.id, p]));

/** phrase (any locale) → canonical generic key used in mappings */
const LOCALE_PHRASE_TO_GENERIC = (() => {
  const m = new Map<string, string>();
  for (const t of [...REVIEW_TABLES, ...SYNTH_TABLES]) {
    for (const [g, row] of Object.entries(t)) {
      for (const v of Object.values(row)) {
        m.set(v, g);
      }
    }
  }
  return m;
})();

const LOCALE_ALIAS_TO_ID = (() => {
  const m = new Map<string, NexoraLocaleDomainId>();
  for (const p of LOCALE_PACKS) {
    for (const a of [...p.aliases, p.id]) {
      const k = normalizeAliasKey(a);
      if (!k) continue;
      if (!m.has(k)) m.set(k, p.id);
    }
  }
  return m;
})();

function normalizeAliasKey(s: string): string {
  return String(s).trim().toLowerCase().replace(/[\s-]+/g, "_");
}

/**
 * Resolve workspace / free-text input to a canonical locale domain id (deterministic).
 */
export function resolveNexoraLocaleDomainId(input?: string | null): NexoraLocaleDomainId {
  const raw = String(input ?? "").trim();
  const n = normalizeAliasKey(raw);
  if (!n) return "generic";

  if (n.includes("psych") || n.includes("yung") || n === "jung" || n.includes("psycho_spiritual")) {
    return "psych_yung";
  }

  const fromAlias = LOCALE_ALIAS_TO_ID.get(n);
  if (fromAlias) return fromAlias;

  if (n.includes("supply_chain") || n.includes("supply-chain") || n === "scm" || n.includes("supplier_network")) {
    return "supply_chain";
  }
  if (n.includes("finance") || n.includes("finops") || n.includes("treasury")) return "finance";
  if (n.includes("retail") || n.includes("commerce") || n.includes("store") || n.includes("merchant")) {
    return "retail";
  }

  return "generic";
}

/** B.37 spec name — same as `resolveNexoraLocaleDomainId`. */
export function resolveDomainId(input?: string | null): string {
  return resolveNexoraLocaleDomainId(input);
}

/**
 * Locale pack for B.35 / B.36 / B.13 merge hooks. Always returns a pack (unknown → generic).
 */
export function getNexoraLocalePack(domainId?: string | null): NexoraLocaleDomainPack {
  const id = resolveNexoraLocaleDomainId(domainId);
  return LOCALE_PACKS_BY_ID[id] ?? LOCALE_PACKS_BY_ID.generic;
}

/** Spec alias — returns generic pack instead of null so callers stay simple. */
export function getDomainPack(domainId?: string | null): NexoraLocaleDomainPack | null {
  return getNexoraLocalePack(domainId);
}

export function listNexoraLocaleDomainPacks(): NexoraLocaleDomainPack[] {
  return [...LOCALE_PACKS];
}

/** Spec alias */
export function listDomainPacks(): NexoraLocaleDomainPack[] {
  return listNexoraLocaleDomainPacks();
}

export function lookupInsightMapping(domainId: string | null | undefined, key: string): string {
  const pack = getNexoraLocalePack(domainId);
  const gen = LOCALE_PACKS_BY_ID.generic;
  return pack.insightMapping?.[key] ?? gen.insightMapping?.[key] ?? "";
}

export function translateLocalePhrase(
  phrase: string,
  domainId: string | null | undefined,
  mode: "review" | "synthesis" | "auto",
): string {
  const pack = getNexoraLocalePack(domainId);
  const gen = LOCALE_PACKS_BY_ID.generic;
  const gKey = LOCALE_PHRASE_TO_GENERIC.get(phrase) ?? phrase;

  const fromPack = (p: NexoraLocaleDomainPack) => {
    if (mode === "review") return p.reviewMapping?.[gKey];
    if (mode === "synthesis") return p.synthesisMapping?.[gKey];
    return p.synthesisMapping?.[gKey] ?? p.reviewMapping?.[gKey];
  };

  return fromPack(pack) ?? fromPack(gen) ?? gKey;
}

export function validateDomainPack(pack: NexoraLocaleDomainPack): string[] {
  const issues: string[] = [];
  if (!String(pack.id ?? "").trim()) issues.push("missing id");
  if (!String(pack.label ?? "").trim()) issues.push("missing label");
  if (!Array.isArray(pack.aliases)) issues.push("aliases must be an array");
  else if (pack.aliases.length === 0 && pack.id !== "generic") issues.push("non-generic pack should list aliases");

  for (const k of REQUIRED_INSIGHT_MAPPING_KEYS) {
    const v = pack.insightMapping?.[k];
    if (pack.id === "generic" && (!v || !String(v).trim())) {
      issues.push(`generic pack missing insightMapping.${k}`);
    }
  }

  return issues;
}

export function listIncompleteDomainPacks(): string[] {
  const gen = LOCALE_PACKS_BY_ID.generic;
  const requiredCount = Object.keys(gen.insightMapping ?? {}).length;
  const out: string[] = [];
  for (const p of LOCALE_PACKS) {
    const n = Object.keys(p.insightMapping ?? {}).length;
    if (n < requiredCount) out.push(p.id);
  }
  return out;
}

/** Startup self-check (dev): duplicate alias detection across packs. */
export function validateLocalePackRegistry(): string[] {
  const issues: string[] = [];
  const seen = new Map<string, string>();
  for (const p of LOCALE_PACKS) {
    issues.push(...validateDomainPack(p));
    for (const a of [...p.aliases, p.id]) {
      const k = normalizeAliasKey(a);
      if (!k) continue;
      if (seen.has(k)) {
        if (seen.get(k) !== p.id) {
          issues.push(`duplicate alias "${k}" on ${seen.get(k)} and ${p.id}`);
        }
      } else {
        seen.set(k, p.id);
      }
    }
  }
  if (!LOCALE_PACKS_BY_ID.generic) issues.push("missing generic pack");
  return issues;
}

export { LOCALE_PHRASE_TO_GENERIC };
