import type { ResilienceTrajectory } from "./institutionalFutureStateTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

/**
 * F10:4 — Future resilience awareness (trajectory reasoning, not predictive precision).
 */
export class ResilienceForesightLayer {
  inferResilienceTrajectory(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    fragilityElevated: boolean
  ): ResilienceTrajectory {
    if (fragilityElevated) return "at_risk";
    if (stack.executiveStabilityActive && stack.cognitiveEvolutionActive) return "strengthening";
    if (stack.pressurePosture === "attention") return "recovering";
    if (stack.resilienceEvolutionLine.includes("mature")) return "strengthening";
    return "plateau";
  }

  synthesizeResilienceForecastLine(trajectory: ResilienceTrajectory): string {
    if (trajectory === "strengthening") {
      return "Resilience trajectory may strengthen — institutional stabilization and recovery possibilities under governance continuity";
    }
    if (trajectory === "at_risk") {
      return "Resilience trajectory at risk — future recovery possible with deliberate stabilization, not guaranteed";
    }
    if (trajectory === "recovering") {
      return "Resilience trajectory recovering — operational recovery adaptation may emerge with sustained pressure governance";
    }
    return "Resilience trajectory plateau — sustainability awareness without fake predictive precision";
  }

  collectAdaptationOpportunities(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    cognitionConverged: boolean
  ): string[] {
    const opportunities: string[] = [];
    if (stack.organizationalEvolutionActive) {
      opportunities.push("organizational adaptation pathway while evolution governance active");
    }
    if (cognitionConverged && stack.enterpriseCoherenceActive) {
      opportunities.push("coordination evolution opportunity as cognition converges");
    }
    if (stack.strategicCalibrationActive) {
      opportunities.push("decision-quality refinement window");
    }
    return opportunities.slice(0, 3);
  }
}

export const resilienceForesightLayer = new ResilienceForesightLayer();
