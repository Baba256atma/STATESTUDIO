export type OrgMemoryEntryRef = {
  id: string;
  project_id?: string | null;
  workspace_id?: string | null;
  team_id?: string | null;
  domain?: string | null;
  title: string;
  timestamp: number;
  result_hint?: string | null;
  calibration_hint?: string | null;
  replay_backed?: boolean;
};

export type OrgMemorySignal = {
  id: string;
  label: string;
  category:
    | "org_success_pattern"
    | "org_failure_pattern"
    | "org_tradeoff_pattern"
    | "org_risk_pattern"
    | "org_confidence_pattern"
    | "org_learning_gap";
  strength: "weak" | "moderate" | "strong";
  coverage_count: number;
  summary: string;
  supporting_refs: OrgMemoryEntryRef[];
};

export type OrgMemoryCluster = {
  id: string;
  label: string;
  domains: string[];
  recurring_actions: string[];
  recurring_outcomes: string[];
  supporting_refs: OrgMemoryEntryRef[];
};

export type OrgMemoryState = {
  generated_at: number;
  coverage_count: number;
  signals: OrgMemorySignal[];
  clusters: OrgMemoryCluster[];
  recurring_successes: string[];
  recurring_failures: string[];
  recurring_tradeoffs: string[];
  recurring_uncertainties: string[];
  relevant_signals: OrgMemorySignal[];
  related_refs: OrgMemoryEntryRef[];
  org_guidance?: string | null;
  current_decision_note?: string | null;
  explanation: string;
};
