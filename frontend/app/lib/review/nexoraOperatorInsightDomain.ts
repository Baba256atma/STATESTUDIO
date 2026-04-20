/**
 * B.35 — Domain-aware wording for the B.34 operator insight line (deterministic, no LLM).
 * B.37 — Copy sourced from locale packs (`nexoraDomainPackRegistry`).
 */

import { toSafeLocaleDomainIdForRollout } from "../domain/nexoraDomainPackRollout.ts";
import { lookupInsightMapping, resolveNexoraLocaleDomainId } from "../domain/nexoraDomainPackRegistry.ts";
import type { NexoraLocaleDomainId } from "../domain/nexoraDomainPack.ts";
import type { NexoraPilotSynthesis } from "./nexoraPilotSynthesis.ts";

export type NexoraOperatorInsightDomainId = NexoraLocaleDomainId;

export type NexoraOperatorInsightMessageKey =
  | "weak"
  | "strong"
  | "scenario_explore"
  | "decision_util"
  | "outcome_record"
  | "moderate_generic";

export function normalizeOperatorInsightDomain(domainId?: string | null): NexoraOperatorInsightDomainId {
  return resolveNexoraLocaleDomainId(domainId);
}

export function resolveOperatorInsightMessageKey(synthesis: NexoraPilotSynthesis): NexoraOperatorInsightMessageKey {
  if (synthesis.overallStatus === "weak") return "weak";
  if (synthesis.overallStatus === "strong") return "strong";

  const k = synthesis.keyFindings.map((x) => x.toLowerCase());
  const has = (sub: string) => k.some((x) => x.includes(sub));
  if (
    has("not exploring") ||
    has("exploring scenarios") ||
    has("operational paths") ||
    has("flow scenarios") ||
    has("risk paths") ||
    has("interpretive paths")
  ) {
    return "scenario_explore";
  }
  if (
    has("decision engagement") ||
    has("operational decision engagement") ||
    has("response engagement") ||
    has("risk decision engagement") ||
    has("interpretive integration")
  ) {
    return "decision_util";
  }
  if (
    has("learning loop") ||
    has("reflection loop") ||
    has("feedback loop") ||
    has("downstream learning") ||
    has("outcome tracking for decisions")
  ) {
    return "outcome_record";
  }

  const p0 = (synthesis.priorities[0] ?? "").toLowerCase();
  if (
    p0.includes("compare") ||
    p0.includes("operational options") ||
    p0.includes("flow alternatives") ||
    p0.includes("risk scenarios") ||
    p0.includes("interpretive alternatives")
  ) {
    return "scenario_explore";
  }
  if (p0.includes("outcome")) return "outcome_record";
  if (p0.includes("clarity") || p0.includes("recommendation")) return "decision_util";
  return "moderate_generic";
}

type HintSlot = "compare" | "outcome" | "explanation" | "reliability" | "mapping" | "clarity" | null;

function resolveHintSlot(synthesis: NexoraPilotSynthesis): HintSlot {
  const top = synthesis.priorities[0]?.toLowerCase() ?? "";
  if (
    top.includes("compare") ||
    top.includes("operational options") ||
    top.includes("flow alternatives") ||
    top.includes("risk scenarios") ||
    top.includes("interpretive alternatives")
  ) {
    return "compare";
  }
  if (top.includes("outcome")) return "outcome";
  if (top.includes("explanation")) return "explanation";
  if (top.includes("reliability")) return "reliability";
  if (top.includes("mapping") || top.includes("signals")) return "mapping";
  if (top.includes("clarity") || top.includes("recommendation")) return "clarity";
  return null;
}

export function buildDomainAwareOperatorInsightLine(input: {
  synthesis: NexoraPilotSynthesis;
  domainId?: string | null;
}): string {
  const domain = toSafeLocaleDomainIdForRollout(input.domainId);
  const key = resolveOperatorInsightMessageKey(input.synthesis);
  return lookupInsightMapping(domain, `line_${key}`);
}

export function buildDomainAwareOperatorInsightHint(input: {
  synthesis: NexoraPilotSynthesis;
  domainId?: string | null;
}): string | null {
  const slot = resolveHintSlot(input.synthesis);
  if (!slot) return null;
  const domain = toSafeLocaleDomainIdForRollout(input.domainId);
  const text = lookupInsightMapping(domain, `hint_${slot}`);
  return text.trim() ? text : null;
}

let lastB35InsightLogKey = "";

export function emitDomainOperatorInsightReadyDevOnce(payload: {
  signature: string;
  domain: NexoraOperatorInsightDomainId;
  line: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${payload.signature}|${payload.domain}|${payload.line}`;
  if (key === lastB35InsightLogKey) return;
  lastB35InsightLogKey = key;
  globalThis.console?.debug?.("[Nexora][B35] domain_operator_insight_ready", payload);
}
