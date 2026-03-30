import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { OrgMemoryCluster, OrgMemoryEntryRef } from "./orgMemoryTypes";

type OrgMemoryIndex = {
  refs: OrgMemoryEntryRef[];
  clusters: OrgMemoryCluster[];
};

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function unique(values: string[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

function inferDomain(entry: DecisionMemoryEntry) {
  return (
    text(entry.project_id).replace(/[_-]/g, " ") ||
    text(entry.workspace_id).replace(/[_-]/g, " ") ||
    "General"
  );
}

function entryRef(entry: DecisionMemoryEntry): OrgMemoryEntryRef {
  return {
    id: entry.id,
    project_id: entry.project_id ?? null,
    workspace_id: entry.workspace_id ?? null,
    team_id: entry.workspace_id ?? null,
    domain: inferDomain(entry),
    title: entry.title,
    timestamp: Number(entry.created_at || 0),
    result_hint: entry.feedback_summary ?? entry.observed_outcome_summary ?? entry.impact_summary ?? null,
    calibration_hint: entry.calibration_result?.calibration_label?.replace(/_/g, " ") ?? null,
    replay_backed: Boolean(entry.snapshot_ref?.replay_id || entry.observed_outcome_summary),
  };
}

function clusterKey(entry: DecisionMemoryEntry) {
  const action = text(entry.recommendation_action).toLowerCase().split(/\s+/).slice(0, 3).join("_");
  const domain = inferDomain(entry).toLowerCase().replace(/\s+/g, "_");
  const calibration = text(entry.calibration_result?.calibration_label).toLowerCase() || "uncalibrated";
  return `${domain}|${action || "general_action"}|${calibration}`;
}

export function buildOrgMemoryIndex(memoryEntries: DecisionMemoryEntry[]): OrgMemoryIndex {
  const usableEntries = memoryEntries.filter((entry) =>
    Boolean(entry.id && (entry.recommendation_action || entry.recommendation_summary || entry.situation_summary))
  );
  const refs = usableEntries.map(entryRef);
  const groups = new Map<string, DecisionMemoryEntry[]>();

  usableEntries.forEach((entry) => {
    const key = clusterKey(entry);
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  });

  const clusters: OrgMemoryCluster[] = Array.from(groups.entries())
    .map(([key, entries]) => ({
      id: `org_cluster_${key}`,
      label:
        entries.length > 1
          ? `${inferDomain(entries[0])} ${text(entries[0].recommendation_action || "decision")} pattern`
          : `${inferDomain(entries[0])} isolated decision pattern`,
      domains: unique(entries.map((entry) => inferDomain(entry)), 4),
      recurring_actions: unique(entries.map((entry) => entry.recommendation_action ?? ""), 4),
      recurring_outcomes: unique(
        entries.map(
          (entry) =>
            entry.feedback_summary ??
            entry.observed_outcome_summary ??
            entry.impact_summary ??
            entry.calibration_result?.calibration_label ??
            ""
        ),
        4
      ),
      supporting_refs: entries
        .slice(0, 5)
        .map(entryRef)
        .sort((a, b) => b.timestamp - a.timestamp),
    }))
    .sort((a, b) => b.supporting_refs.length - a.supporting_refs.length);

  return {
    refs: refs.sort((a, b) => b.timestamp - a.timestamp),
    clusters,
  };
}
