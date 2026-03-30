import type { PanelResolvedData, ResolvedPanelName } from "./panelDataResolverTypes";

const FALLBACK_COPY: Record<
  string,
  { title: string; message: string; suggestedActionLabel: string }
> = {
  advice: {
    title: "Strategic Advice",
    message: "No action is ready yet. Try a prompt like 'supplier delay' or 'rising costs'.",
    suggestedActionLabel: "Run scan",
  },
  timeline: {
    title: "Decision Timeline",
    message: "No progression path is ready yet. Run a what-if scenario to see what changes next.",
    suggestedActionLabel: "Run scenario",
  },
  dashboard: {
    title: "Executive Overview",
    message: "The dashboard is still waiting for decision context. Submit a scenario or prompt to populate executive insight.",
    suggestedActionLabel: "Start analysis",
  },
  simulate: {
    title: "Simulation",
    message: "No simulation is available yet. Run a scenario to generate results.",
    suggestedActionLabel: "Run simulation",
  },
  compare: {
    title: "Compare Options",
    message: "No comparison data is available yet. Run analysis or simulation to compare the current options.",
    suggestedActionLabel: "Run analysis",
  },
  risk: {
    title: "Risk",
    message: "Risk view is waiting for fragility or propagation context.",
    suggestedActionLabel: "Run simulation",
  },
  war_room: {
    title: "War Room",
    message: "No executive posture is ready yet. Compare options to generate a decision brief.",
    suggestedActionLabel: "Compare options",
  },
  decision_governance: {
    title: "Decision Governance",
    message: "Governance posture is not ready yet. Stronger recommendation and action context are needed.",
    suggestedActionLabel: "Review recommendation",
  },
  executive_approval: {
    title: "Executive Approval",
    message: "Approval workflow is not ready yet. Nexora needs clearer recommendation and governance context first.",
    suggestedActionLabel: "Review recommendation",
  },
  decision_policy: {
    title: "Decision Policy",
    message: "Policy posture is not ready yet. Build more recommendation context to activate policy guidance.",
    suggestedActionLabel: "Review recommendation",
  },
  decision_council: {
    title: "Decision Council",
    message: "Council guidance is not available yet. Run analysis to generate a stronger decision brief.",
    suggestedActionLabel: "Run analysis",
  },
  strategic_command: {
    title: "Strategic Command",
    message: "Strategic command is waiting for recommendation context before it can guide the next move.",
    suggestedActionLabel: "Start analysis",
  },
  memory: {
    title: "Decision Memory",
    message: "Decision memory is not ready yet.",
    suggestedActionLabel: "Open memory",
  },
  replay: {
    title: "Decision Replay",
    message: "Replay is not ready yet for this decision.",
    suggestedActionLabel: "Replay decision",
  },
  workspace: {
    title: "Workspace",
    message: "Workspace context is not ready yet.",
    suggestedActionLabel: "Open workspace",
  },
  collaboration: {
    title: "Collaboration",
    message: "Collaboration context is not ready yet.",
    suggestedActionLabel: "Open collaboration",
  },
};

export function buildPanelFallbackState(
  panel: ResolvedPanelName,
  status: PanelResolvedData["status"] = "fallback",
  missingFields: string[] = []
): PanelResolvedData<null> {
  const copy = FALLBACK_COPY[panel] ?? FALLBACK_COPY.dashboard;
  return {
    status,
    title: copy.title,
    message: copy.message,
    data: null,
    missingFields,
    suggestedActionLabel: copy.suggestedActionLabel,
  };
}
