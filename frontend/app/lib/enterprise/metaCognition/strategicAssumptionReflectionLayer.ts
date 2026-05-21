import type { ConfidenceEvolution } from "./executiveMetaCognitionTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../governance/adaptiveGovernanceTypes";

/**
 * F10:1 — Strategic assumption reflection (transparent, not mystical).
 */
export class StrategicAssumptionReflectionLayer {
  synthesizeAssumptionsLine(assumptions: readonly string[]): string {
    if (assumptions.length === 0) {
      return "Assumptions forming as governance and operational signals converge";
    }
    return `Assumptions: ${assumptions.slice(0, 3).join(" · ")}`;
  }

  synthesizeUncertaintyLine(uncertainty: string, supportingCount: number): string {
    return `Uncertainty ${uncertainty} · shaped by ${supportingCount} active signal group${supportingCount === 1 ? "" : "s"}`;
  }

  synthesizeConfidenceEvolutionLine(evolution: ConfidenceEvolution): string {
    if (evolution === "strengthening") {
      return "Confidence strengthening as governance layers align — ambiguity may still remain";
    }
    if (evolution === "strained") {
      return "Confidence strained — treat recommendations as bounded guidance";
    }
    return `Confidence evolution ${evolution}`;
  }

  synthesizeAdvisoryLimitsLine(limits: readonly string[]): string {
    return limits.join(" · ");
  }

  collectAssumptions(
    fragilityElevated: boolean,
    cognitionConverged: boolean,
    stack: AdaptiveGovernanceIntelligenceSnapshot
  ): string[] {
    const assumptions: string[] = [];
    if (cognitionConverged) assumptions.push("institutional cognition converged");
    if (stack.governanceOversightActive) assumptions.push("governance oversight reliable");
    if (fragilityElevated) assumptions.push("operational fragility elevated");
    if (!stack.enterpriseCoherenceActive) assumptions.push("coherence signals incomplete");
    if (!stack.executiveStabilityActive) assumptions.push("stability cognition still forming");
    return assumptions;
  }

  collectAdvisoryLimits(): string[] {
    return [
      "Executives retain decision authority",
      "Advisory does not replace governance judgment",
      "Uncertainty cannot be fully eliminated",
    ];
  }

  inferConfidenceEvolution(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    fragilityElevated: boolean
  ): ConfidenceEvolution {
    if (fragilityElevated) return "strained";
    if (stack.unifiedGovernanceRuntimeActive && stack.institutionalStrategicEvolutionConverged) {
      return "strengthening";
    }
    if (stack.governanceOversightActive) return "stable";
    return "forming";
  }
}

export const strategicAssumptionReflectionLayer = new StrategicAssumptionReflectionLayer();
