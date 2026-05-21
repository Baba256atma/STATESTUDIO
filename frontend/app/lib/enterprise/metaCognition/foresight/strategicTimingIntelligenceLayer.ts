import type { InstitutionalTrajectory } from "./institutionalFutureStateTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

/**
 * F10:4 — Strategic timing interpretation (windows, not rigid plans).
 */
export class StrategicTimingIntelligenceLayer {
  collectTimingConsiderations(
    trajectory: InstitutionalTrajectory,
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    fragilityElevated: boolean
  ): string[] {
    const considerations: string[] = [];

    if (fragilityElevated) {
      considerations.push("stabilization timing may precede acceleration of adaptation");
    }
    if (stack.pressureGovernanceActive) {
      considerations.push("escalation window awareness — executive stability governance active");
    }
    if (stack.organizationalEvolutionActive) {
      considerations.push("adaptation timing opportunity while evolution governance converges");
    }
    if (trajectory === "ascending" && stack.cognitiveEvolutionActive) {
      considerations.push("resilience reinforcement timing favorable during maturity progression");
    }
    if (stack.unifiedGovernanceRuntimeActive) {
      considerations.push("coordination evolution may require synchronized intervention timing");
    }

    return considerations.slice(0, 4);
  }

  synthesizeStrategicTimingLine(considerations: readonly string[]): string {
    if (considerations.length === 0) {
      return "Strategic timing cognition establishes with trajectory and reflection depth";
    }
    return `Timing considerations: ${considerations.slice(0, 2).join(" · ")}`;
  }
}

export const strategicTimingIntelligenceLayer = new StrategicTimingIntelligenceLayer();
