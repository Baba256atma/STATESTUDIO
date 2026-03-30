import type { DecisionTimelineEvent } from "../../governance/decisionTimelineModel";
import type {
  DecisionCalibrationResult,
  DecisionOutcomeFeedback,
  ObservedOutcomeSignal,
} from "../outcome/decisionOutcomeTypes";

export type DecisionMemoryEntry = {
  id: string;
  created_at: number;
  workspace_id?: string | null;
  project_id?: string | null;
  title: string;
  prompt?: string | null;
  situation_summary?: string | null;
  recommendation_summary?: string | null;
  recommendation_action?: string | null;
  recommendation_confidence?: {
    score?: number | null;
    level?: "low" | "medium" | "high" | null;
  };
  impact_summary?: string | null;
  compare_summary?: string | null;
  target_ids?: string[];
  alternative_actions?: string[];
  snapshot_ref?: {
    scenario_id?: string | null;
    replay_id?: string | null;
  };
  observed_outcome_summary?: string | null;
  outcome_status?: DecisionOutcomeFeedback["outcome_status"];
  feedback_summary?: string | null;
  observed_signals?: ObservedOutcomeSignal[];
  calibration_result?: DecisionCalibrationResult | null;
  timeline_events?: DecisionTimelineEvent[];
  source: "chat" | "scanner" | "simulation" | "manual" | "system";
};
