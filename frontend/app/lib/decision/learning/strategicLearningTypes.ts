export type StrategicLearningSignal = {
  id: string;
  label: string;
  category:
    | "pattern"
    | "calibration"
    | "memory_evolution"
    | "domain_drift"
    | "risk_recurrence"
    | "tradeoff_recurrence"
    | "confidence_shift"
    | "learning_gap";
  strength: "weak" | "moderate" | "strong";
  coverage_count: number;
  summary: string;
};

export type MemoryEvolutionSummary = {
  total_decisions: number;
  calibrated_decisions: number;
  replay_backed_decisions: number;
  recurring_clusters: number;
  confidence_trend: "improving" | "stable" | "weakening" | "unknown";
  summary: string;
};

export type DomainDriftSummary = {
  drift_detected: boolean;
  affected_domains: string[];
  summary: string;
  implications: string[];
};

export type StrategicLearningState = {
  generated_at: number;
  coverage_count: number;
  learning_signals: StrategicLearningSignal[];
  memory_evolution: MemoryEvolutionSummary;
  domain_drift: DomainDriftSummary;
  recurring_successes: string[];
  recurring_failures: string[];
  recurring_tradeoffs: string[];
  recurring_uncertainties: string[];
  strategic_guidance?: string | null;
  current_recommendation_note?: string | null;
  explanation: string;
};
