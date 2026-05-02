import type { NexoraComponentPanelId } from "../actions/actionTypes";
import type { RightPanelView } from "../ui/right-panel/rightPanelTypes";

export type NexoraIntent =
  | "open_calibration"
  | "open_dashboard"
  | "open_risk"
  | "open_fragility"
  | "open_decision_policy"
  | "open_executive_approval"
  | "open_decision_governance"
  | "open_pattern_intelligence"
  | "open_strategic_learning"
  | "open_decision_strategic"
  | "open_decision_lens"
  | "open_collaboration_intelligence"
  | "open_outcome_feedback"
  | "open_decision_memory"
  | "open_decision_lifecycle"
  | "open_scenario_tree"
  | "open_team_decision"
  | "open_decision_council"
  | "open_org_memory"
  | "open_strategic_command"
  | "open_compare"
  | "open_timeline"
  | "open_simulation"
  | "unknown_intent";

export type PanelFamily = "EXE" | "SIM" | "RSK";

export type PanelTarget =
  | { type: "center"; component: NexoraComponentPanelId }
  | { type: "right"; view: RightPanelView; family: PanelFamily };

export const INTENT_PANEL_REGISTRY: Record<NexoraIntent, PanelTarget> = {
  open_calibration: {
    type: "center",
    component: "confidence_calibration",
  },
  open_dashboard: {
    type: "right",
    view: "dashboard",
    family: "EXE",
  },
  open_risk: {
    type: "right",
    view: "risk",
    family: "RSK",
  },
  open_fragility: {
    type: "right",
    view: "fragility",
    family: "RSK",
  },
  open_team_decision: {
    type: "center",
    component: "team_decision",
  },
  open_decision_policy: {
    type: "center",
    component: "decision_policy",
  },
  open_executive_approval: {
    type: "center",
    component: "executive_approval",
  },
  open_decision_governance: {
    type: "center",
    component: "decision_governance",
  },
  open_pattern_intelligence: {
    type: "center",
    component: "pattern_intelligence",
  },
  open_strategic_learning: {
    type: "center",
    component: "strategic_learning",
  },
  open_decision_strategic: {
    type: "center",
    component: "decision_strategic",
  },
  open_decision_lens: {
    type: "center",
    component: "decision_lens",
  },
  open_collaboration_intelligence: {
    type: "center",
    component: "collaboration_intelligence",
  },
  open_outcome_feedback: {
    type: "center",
    component: "outcome_feedback",
  },
  open_decision_memory: {
    type: "center",
    component: "decision_memory",
  },
  open_decision_lifecycle: {
    type: "center",
    component: "decision_lifecycle",
  },
  open_scenario_tree: {
    type: "center",
    component: "scenario_tree",
  },
  open_decision_council: {
    type: "center",
    component: "decision_council",
  },
  open_org_memory: {
    type: "center",
    component: "org_memory",
  },
  open_strategic_command: {
    type: "center",
    component: "strategic_command_full",
  },
  open_compare: {
    type: "center",
    component: "compare",
  },
  open_timeline: {
    type: "center",
    component: "timeline",
  },
  open_simulation: {
    type: "right",
    view: "war_room",
    family: "SIM",
  },
  unknown_intent: {
    type: "right",
    view: "dashboard",
    family: "EXE",
  },
};

export function expectedFamilyForIntent(intent: NexoraIntent): PanelFamily {
  if (intent === "open_simulation") return "SIM";
  if (intent === "open_risk" || intent === "open_fragility") return "RSK";
  return "EXE";
}
