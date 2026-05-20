import type {
  ExecutiveStability,
  ResilienceContinuity,
  StrategicComposure,
} from "./strategicPressureGovernanceTypes";

/**
 * F9:4 — Executive operational stability interpretation (not executive surveillance).
 */
export class ExecutiveStabilityInterpretationLayer {
  synthesizeExecutiveStabilityLine(
    executiveStability: ExecutiveStability,
    strategicComposure: StrategicComposure
  ): string {
    if (executiveStability === "composed" && strategicComposure === "composed") {
      return "Executive operational stability composed — strategic composure holds under current pressure without surveillance framing";
    }
    if (executiveStability === "fragile" || strategicComposure === "reactive") {
      return "Stability under pressure requires attention — escalation governance and resilience continuity need reinforcement; executives retain authority";
    }
    return `Executive stability ${executiveStability} · strategic composure ${strategicComposure} — bounded institutional steadiness`;
  }

  synthesizeStabilizationLine(
    stabilizationMaturity: string,
    resilienceContinuity: ResilienceContinuity
  ): string {
    return `Stabilization maturity ${stabilizationMaturity} · resilience continuity ${resilienceContinuity}`;
  }

  inferExecutiveStability(
    fragilityElevated: boolean,
    continuityPreserved: boolean,
    governanceOversightActive: boolean
  ): ExecutiveStability {
    if (!continuityPreserved) return "fragile";
    if (fragilityElevated && !governanceOversightActive) return "forming";
    if (!fragilityElevated && governanceOversightActive) return "composed";
    if (!fragilityElevated) return "stable";
    return "forming";
  }

  inferStrategicComposure(
    executiveStability: ExecutiveStability,
    calibrationDecisionQuality: string | undefined
  ): StrategicComposure {
    if (executiveStability === "composed") return "composed";
    if (executiveStability === "stable") return "steady";
    if (calibrationDecisionQuality === "refined") return "forming";
    return "reactive";
  }
}

export const executiveStabilityInterpretationLayer = new ExecutiveStabilityInterpretationLayer();
