import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { OrgMemorySignal } from "./orgMemoryTypes";

type BuildOrgMemorySignalsInput = {
  memoryEntries: DecisionMemoryEntry[];
};

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function unique(values: string[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

function supportingRefs(entries: DecisionMemoryEntry[]) {
  return entries.slice(0, 4).map((entry) => ({
    id: entry.id,
    project_id: entry.project_id ?? null,
    workspace_id: entry.workspace_id ?? null,
    team_id: entry.workspace_id ?? null,
    domain: text(entry.project_id).replace(/[_-]/g, " ") || "General",
    title: entry.title,
    timestamp: Number(entry.created_at || 0),
    result_hint: entry.feedback_summary ?? entry.observed_outcome_summary ?? entry.impact_summary ?? null,
    calibration_hint: entry.calibration_result?.calibration_label?.replace(/_/g, " ") ?? null,
    replay_backed: Boolean(entry.snapshot_ref?.replay_id || entry.observed_outcome_summary),
  }));
}

export function buildOrgMemorySignals(input: BuildOrgMemorySignalsInput): OrgMemorySignal[] {
  const entries = [...input.memoryEntries].sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  const calibrated = entries.filter((entry) => entry.calibration_result);
  const replayBacked = entries.filter((entry) => entry.snapshot_ref?.replay_id || entry.observed_outcome_summary);
  const overconfident = entries.filter((entry) => entry.calibration_result?.calibration_label === "overconfident");
  const underconfident = entries.filter((entry) => entry.calibration_result?.calibration_label === "underconfident");
  const success = entries.filter((entry) =>
    entry.outcome_status === "better_than_expected" || entry.outcome_status === "as_expected"
  );
  const failure = entries.filter((entry) => entry.outcome_status === "worse_than_expected");
  const tradeoffs = unique(entries.flatMap((entry) => entry.alternative_actions ?? []), 3);
  const uncertainties = unique(
    entries.flatMap((entry) =>
      entry.timeline_events?.flatMap((event) => event.uncertainty ?? []) ?? []
    ),
    3
  );

  const signals: OrgMemorySignal[] = [];

  if (success.length >= 2) {
    signals.push({
      id: "org_success",
      label: "Cross-project success pattern",
      category: "org_success_pattern",
      strength: success.length >= 4 ? "strong" : "moderate",
      coverage_count: success.length,
      summary: `Across ${success.length} organization decision records, similar recommendations usually hold up once they reach execution or replay review.`,
      supporting_refs: supportingRefs(success),
    });
  }

  if (failure.length >= 2 || overconfident.length >= 2) {
    const source = failure.length >= overconfident.length ? failure : overconfident;
    signals.push({
      id: "org_failure",
      label: "Cross-project failure pattern",
      category: failure.length >= overconfident.length ? "org_failure_pattern" : "org_confidence_pattern",
      strength: source.length >= 4 ? "strong" : "moderate",
      coverage_count: source.length,
      summary:
        failure.length >= overconfident.length
          ? `Similar recommendations underperform across projects often enough that teams should compare them more aggressively before action.`
          : `High-confidence recommendations appear overconfident across multiple projects when outcome evidence is still thin.`,
      supporting_refs: supportingRefs(source),
    });
  }

  if (tradeoffs.length) {
    signals.push({
      id: "org_tradeoffs",
      label: tradeoffs[0],
      category: "org_tradeoff_pattern",
      strength: tradeoffs.length >= 3 ? "strong" : "moderate",
      coverage_count: tradeoffs.length,
      summary: `Organization memory keeps surfacing the same trade-off tension: ${tradeoffs[0].toLowerCase()}.`,
      supporting_refs: supportingRefs(entries.filter((entry) => (entry.alternative_actions ?? []).length > 0)),
    });
  }

  if (uncertainties.length) {
    signals.push({
      id: "org_risk",
      label: uncertainties[0],
      category: "org_risk_pattern",
      strength: uncertainties.length >= 3 ? "moderate" : "weak",
      coverage_count: uncertainties.length,
      summary: `A recurring uncertainty keeps appearing across organizational decisions: ${uncertainties[0].toLowerCase()}.`,
      supporting_refs: supportingRefs(entries.filter((entry) => (entry.timeline_events?.length ?? 0) > 0)),
    });
  }

  if (entries.length >= 3 && replayBacked.length < Math.max(2, Math.floor(entries.length / 3))) {
    signals.push({
      id: "org_gap",
      label: "Replay-backed coverage remains limited",
      category: "org_learning_gap",
      strength: "moderate",
      coverage_count: replayBacked.length,
      summary: `Organization memory is growing, but only ${replayBacked.length} decision ${replayBacked.length === 1 ? "record has" : "records have"} replay-backed outcome evidence.`,
      supporting_refs: supportingRefs(entries),
    });
  }

  if (underconfident.length >= 2) {
    signals.push({
      id: "org_underconfident",
      label: "Some recommendation classes are underconfident",
      category: "org_confidence_pattern",
      strength: underconfident.length >= 4 ? "moderate" : "weak",
      coverage_count: underconfident.length,
      summary: `Organization-wide evidence suggests some recommendation families are performing better than their original confidence implied.`,
      supporting_refs: supportingRefs(underconfident),
    });
  }

  return signals.slice(0, 6);
}
