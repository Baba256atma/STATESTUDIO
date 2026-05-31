import type { ExecutiveEmptyStateContext } from "./executiveMinimalismTypes";
import { harmonizeExecutiveVocabulary } from "../harmonization";

const EXECUTIVE_EMPTY_STATES: Record<ExecutiveEmptyStateContext, string> = {
  no_selection: "Select a system node to inspect operational context.",
  no_data: "Awaiting Assessment",
  unknown: "Assessment Pending",
  loading: "Monitoring Ready",
  no_scenario: "No Scenario Selected",
  no_risk_signals: "No Active Risk Signals",
  no_timeline_events: "No Timeline Events Recorded",
  confidence_missing: "Confidence Assessment Pending",
  frsi_pending: "Fragility Assessment In Progress",
  placeholder: "Executive Context Initializing",
};

/** Replace generic empty-state copy with executive language. */
export function resolveExecutiveEmptyState(
  context: ExecutiveEmptyStateContext,
  fallback?: string | null
): string {
  const resolved = EXECUTIVE_EMPTY_STATES[context];
  if (resolved) return harmonizeExecutiveVocabulary(resolved);
  const trimmed = fallback?.trim();
  if (trimmed && !isGenericEmptyCopy(trimmed)) return harmonizeExecutiveVocabulary(trimmed);
  return harmonizeExecutiveVocabulary(EXECUTIVE_EMPTY_STATES.placeholder);
}

function isGenericEmptyCopy(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized === "no data" ||
    normalized === "unknown" ||
    normalized === "undefined" ||
    normalized === "placeholder" ||
    normalized.startsWith("loading") ||
    normalized === "—" ||
    normalized === "-"
  );
}

export function resolveExecutiveConfidenceLabel(value: string | null | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed || isGenericEmptyCopy(trimmed) || trimmed.toLowerCase() === "unknown") {
    return resolveExecutiveEmptyState("confidence_missing");
  }
  return trimmed.startsWith("Confidence") ? trimmed : `Confidence ${trimmed}`;
}

export function resolveExecutiveFrsiDisplay(score: number | null | undefined): string {
  if (typeof score === "number" && Number.isFinite(score)) return `${score}`;
  return "—";
}
