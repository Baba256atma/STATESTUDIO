/**
 * Dev-only internal engineering assistant: deterministic answers over self-debug state.
 * Observes and recommends only — no mutations, no external AI, no production surface.
 */

import type { SelfDebugDiagnosis } from "./debugDiagnosis";
import type { DebugEvent } from "./debugEventTypes";
import type { StrategicDebugSummary, SummaryKeyEvent } from "./debugSummary";
import type { FixSuggestion } from "./debugFixSuggestions";
import {
  DEFAULT_INVESTIGATION_PLAN,
  INVESTIGATION_PLAN_BY_TEMPLATE,
} from "./debugAssistantPrompts";

export type DevAssistantIntent =
  | "current_issue"
  | "failure_layer"
  | "next_checks"
  | "supporting_chain"
  | "root_cause_plain"
  | "guard_alerts"
  | "investigation_plan";

export type DevAssistantSupportingEvent = {
  id?: string;
  type: string;
  layer: string;
  message: string;
};

export type DevAssistantGuardRow = {
  severity: string;
  guardType: string;
  message: string;
  suggestion: string;
};

export type DevAssistantResponse = {
  mode: DevAssistantIntent;
  headline: string;
  answer: string;
  confidence: "high" | "medium" | "low";
  /** Primary layer from summary/diagnosis; may be "unknown" when weak. */
  layer: string;
  supporting_events: DevAssistantSupportingEvent[];
  recommended_checks: string[];
  guard_alerts: DevAssistantGuardRow[];
  /** Epistemic / evidence caveats — always short. */
  notes: string;
};

export type DevAssistantContext = {
  events: DebugEvent[];
  diagnoses: SelfDebugDiagnosis[];
  strategicSummary: StrategicDebugSummary;
  fixSuggestions: FixSuggestion[];
  /** Recent `guard_warning` / `guard_critical` debug events (newest first is ok). */
  guardAlertEvents: DebugEvent[];
};

const MAX_SUPPORTING = 8;
const MAX_CHECKS = 6;

function byIdMap(events: DebugEvent[]): Map<string, DebugEvent> {
  return new Map(events.map((e) => [e.id, e]));
}

function keyEventToSupporting(ke: SummaryKeyEvent): DevAssistantSupportingEvent {
  return { type: ke.type, layer: ke.layer, message: ke.message };
}

function eventToSupporting(e: DebugEvent): DevAssistantSupportingEvent {
  return {
    id: e.id,
    type: e.type,
    layer: e.layer,
    message: e.message.length > 140 ? `${e.message.slice(0, 137)}…` : e.message,
  };
}

function chainOrFallback(
  a: DevAssistantSupportingEvent[],
  b: DevAssistantSupportingEvent[]
): DevAssistantSupportingEvent[] {
  return a.length > 0 ? a : b;
}

function supportingFromDiagnosis(primary: SelfDebugDiagnosis | null, events: DebugEvent[]): DevAssistantSupportingEvent[] {
  if (!primary) return [];
  const m = byIdMap(events);
  const out: DevAssistantSupportingEvent[] = [];
  for (const sid of primary.supportingEventIds) {
    const ev = m.get(sid);
    if (ev) out.push(eventToSupporting(ev));
    if (out.length >= MAX_SUPPORTING) break;
  }
  return out;
}

function parseGuardRows(guardAlertEvents: DebugEvent[]): DevAssistantGuardRow[] {
  const out: DevAssistantGuardRow[] = [];
  for (const e of guardAlertEvents.slice(0, 12)) {
    const md = e.metadata ?? {};
    out.push({
      severity: typeof md.severity === "string" ? md.severity : e.type === "guard_critical" ? "critical" : "warning",
      guardType: typeof md.guardType === "string" ? md.guardType : e.type,
      message: e.message,
      suggestion: typeof md.suggestion === "string" ? md.suggestion : "",
    });
  }
  return out;
}

function evidenceNote(primary: SelfDebugDiagnosis | null, summary: StrategicDebugSummary): string {
  if (!primary && summary.template_key === "no_diagnosis") {
    return "Evidence is thin: no diagnosis rule matched — treat answers as orientation, not proof of a single defect.";
  }
  if (summary.confidence === "low") {
    return "Strategic summary confidence is low — corroborate with raw events and reproduction before changing code.";
  }
  if (primary?.confidence === "low") {
    return "Primary diagnosis confidence is low — prefer widening the repro or tightening correlation ids.";
  }
  return "Answers are synthesized from deterministic rules and recent events only — not a substitute for stepping through code.";
}

function layerHintFromTemplate(templateKey: string): string {
  if (templateKey.startsWith("chat_") || templateKey === "chat_repeated_errors") return "chat / intent";
  if (templateKey.includes("panel") || templateKey === "host_mismatch" || templateKey === "fallback_churn")
    return "panel / host";
  if (templateKey.includes("scene") || templateKey === "scene_drop") return "scene";
  if (templateKey.includes("subtab") || templateKey.includes("shell")) return "shell / inspector";
  if (templateKey.includes("contract")) return "contract";
  return "mixed";
}

function primaryLayer(primary: SelfDebugDiagnosis | null, summary: StrategicDebugSummary): string {
  if (primary?.layer && primary.layer !== "multiple") return primary.layer;
  if (typeof summary.where_it_failed === "string") return summary.where_it_failed;
  return "unknown";
}

/**
 * Run a single deterministic assistant “turn” for a preset developer intent.
 */
export function runDevAssistant(intent: DevAssistantIntent, ctx: DevAssistantContext): DevAssistantResponse {
  const { events, diagnoses, strategicSummary, fixSuggestions, guardAlertEvents } = ctx;
  const primary = diagnoses[0] ?? null;
  const guardRows = parseGuardRows(guardAlertEvents);
  const layer = primaryLayer(primary, strategicSummary);
  const notes = evidenceNote(primary, strategicSummary);

  const supportingFromPrimary = supportingFromDiagnosis(primary, events);
  const fallbackSupporting: DevAssistantSupportingEvent[] = strategicSummary.key_events.slice(0, MAX_SUPPORTING).map(keyEventToSupporting);

  const baseChecks = [strategicSummary.recommended_next_check].filter(Boolean);
  const fixChecks = fixSuggestions.slice(0, 4).map((f) => `${f.title}: ${f.what_to_check}`);

  switch (intent) {
    case "current_issue": {
      return {
        mode: intent,
        headline: strategicSummary.headline,
        answer: `${strategicSummary.what_happened} ${strategicSummary.why_it_happened}`.trim(),
        confidence: strategicSummary.confidence,
        layer,
        supporting_events: supportingFromPrimary.length > 0 ? supportingFromPrimary : fallbackSupporting,
        recommended_checks: [...baseChecks, ...fixChecks].slice(0, MAX_CHECKS),
        guard_alerts: guardRows,
        notes,
      };
    }
    case "failure_layer": {
      const templateHint =
        strategicSummary.template_key === "no_diagnosis"
          ? ""
          : ` Pattern id **${strategicSummary.template_key}** is usually ${layerHintFromTemplate(strategicSummary.template_key)}-heavy.`;
      return {
        mode: intent,
        headline: "Where this likely failed (strategic read)",
        answer: `The summary places the fault band around **${strategicSummary.where_it_failed}**. ${
          primary ? `Primary diagnosis layer: **${primary.layer}** (${primary.title}).` : "No primary diagnosis — use the last event layer as a weak hint only."
        }${templateHint}`,
        confidence: strategicSummary.confidence,
        layer: String(strategicSummary.where_it_failed),
        supporting_events: fallbackSupporting.slice(0, 6),
        recommended_checks: baseChecks.slice(0, 4),
        guard_alerts: guardRows,
        notes,
      };
    }
    case "next_checks": {
      return {
        mode: intent,
        headline: "Safest next checks (no auto-fix)",
        answer:
          "Work through these in order; stop when you find a definitive mismatch — prefer correlation ids over timing guesses.",
        confidence: strategicSummary.confidence,
        layer,
        supporting_events: supportingFromPrimary.length > 0 ? supportingFromPrimary.slice(0, 5) : fallbackSupporting.slice(0, 5),
        recommended_checks: [...baseChecks, ...fixChecks].slice(0, MAX_CHECKS),
        guard_alerts: guardRows,
        notes,
      };
    }
    case "supporting_chain": {
      const chain = supportingFromPrimary.length > 0 ? supportingFromPrimary : fallbackSupporting;
      return {
        mode: intent,
        headline: "Events that support the current read",
        answer:
          chain.length > 0
            ? "Below are supporting events (from diagnosis ids when available, otherwise strategic key events)."
            : "No supporting ids or key events in the current window — capture a longer repro or clear and retry.",
        confidence: chain.length >= 2 ? strategicSummary.confidence : "low",
        layer,
        supporting_events: chain,
        recommended_checks: baseChecks.slice(0, 3),
        guard_alerts: guardRows,
        notes,
      };
    }
    case "root_cause_plain": {
      const plain = primary
        ? `${primary.title}. ${primary.explanation}`
        : `${strategicSummary.headline}. ${strategicSummary.why_it_happened}`;
      return {
        mode: intent,
        headline: "Likely root cause (plain language)",
        answer: plain,
        confidence: primary?.confidence === "high" ? "high" : primary?.confidence === "medium" ? "medium" : strategicSummary.confidence,
        layer,
        supporting_events: chainOrFallback(supportingFromPrimary, fallbackSupporting).slice(0, 6),
        recommended_checks: baseChecks.slice(0, 4),
        guard_alerts: guardRows,
        notes,
      };
    }
    case "guard_alerts": {
      return {
        mode: intent,
        headline: "Active guard rails (recent)",
        answer:
          guardRows.length > 0
            ? `${guardRows.length} guard signal(s) in the recent buffer — these are early warnings, not verdicts.`
            : "No guard_warning / guard_critical events in the recent buffer.",
        confidence: guardRows.some((g) => g.severity === "critical") ? "medium" : "high",
        layer: guardAlertEvents[0]?.layer ?? "panel",
        supporting_events: guardAlertEvents.slice(0, 6).map(eventToSupporting),
        recommended_checks: guardRows.slice(0, 4).map((g) => (g.suggestion ? `${g.guardType}: ${g.suggestion}` : g.message)),
        guard_alerts: guardRows,
        notes: "Guards never block execution; pair each hint with the underlying debug event types in the chain.",
      };
    }
    case "investigation_plan": {
      const steps = INVESTIGATION_PLAN_BY_TEMPLATE[strategicSummary.template_key] ?? DEFAULT_INVESTIGATION_PLAN;
      const answer = steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
      return {
        mode: intent,
        headline: `Investigation plan (${strategicSummary.template_key})`,
        answer,
        confidence: strategicSummary.confidence,
        layer,
        supporting_events: fallbackSupporting.slice(0, 4),
        recommended_checks: steps,
        guard_alerts: guardRows,
        notes: `${notes} Plan steps are static templates — adjust to your local repro.`,
      };
    }
    default: {
      return {
        mode: intent,
        headline: "Assistant",
        answer: "Unknown intent.",
        confidence: "low",
        layer: "unknown",
        supporting_events: [],
        recommended_checks: [],
        guard_alerts: [],
        notes: "Internal error: unhandled intent.",
      };
    }
  }
}
