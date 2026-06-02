/**
 * E2:100 — Standard executive demonstration flow and strategic story.
 */

import type { ExecutiveAdvisorState } from "../advisor/executiveAdvisorTypes";
import type { ExecutiveWarRoomState } from "../warroom/executiveWarRoomTypes";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation";
import type { ExecutiveDemoFlow } from "./executiveIntelligenceTypes";

export function buildExecutiveDemoFlow(input: {
  domainLabel?: string | null;
  activeSimulation?: TypeCScenarioSimulation | null;
  activeScenarioTitle?: string | null;
  warRoom?: ExecutiveWarRoomState | null;
  advisor?: ExecutiveAdvisorState | null;
}): ExecutiveDemoFlow {
  const scenarioTitle =
    input.activeScenarioTitle ??
    input.activeSimulation?.scenarioId ??
    input.warRoom?.bestScenarioTitle ??
    `${input.domainLabel ?? "Enterprise"} Command Center`;

  const topRisk = input.advisor?.observations.find((entry) => entry.kind === "risk");
  const topRecommendation = input.advisor?.hud.topRecommendation ?? input.warRoom?.recommendations[0] ?? null;

  return {
    scenarioTitle,
    walkthroughSteps: [
      {
        step: 1,
        title: "Orient to reality",
        narrative: input.warRoom?.strategic.headline ?? "Review the living scene and enterprise twin pulse.",
      },
      {
        step: 2,
        title: "Inspect risks and timeline",
        narrative: topRisk?.summary ?? "Scan timeline markers and war room alerts for emerging pressure.",
      },
      {
        step: 3,
        title: "Compare scenarios",
        narrative: "Open scenario comparison to evaluate strategic alternatives side by side.",
      },
      {
        step: 4,
        title: "Run simulation",
        narrative: input.activeSimulation?.summary ?? "Execute propagation playback to preview downstream impact.",
      },
      {
        step: 5,
        title: "Decide with advisor",
        narrative: topRecommendation
          ? `Advisor recommends: ${topRecommendation.title}.`
          : "Review advisor recommendations and war room guidance before committing.",
      },
    ],
    strategicStory: [
      { phase: "problem", headline: topRisk?.title ?? "Operational pressure detected in the command center." },
      { phase: "analysis", headline: input.advisor?.hud.topQuestion?.question ?? "What assumption is driving current resource allocation?" },
      { phase: "simulation", headline: input.activeSimulation?.summary ?? "Simulate propagation paths before intervention." },
      { phase: "decision", headline: topRecommendation?.title ?? "Select the highest-confidence strategic path." },
      { phase: "outcome", headline: input.warRoom?.strategic.recommendedAction ?? "Track execution readiness and twin recovery." },
    ],
  };
}
