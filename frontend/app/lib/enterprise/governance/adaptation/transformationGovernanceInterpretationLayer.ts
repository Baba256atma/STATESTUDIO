import type { AdaptationGovernanceMaturity } from "./strategicAdaptationGovernanceTypes";

/**
 * F9:5 — Transformation governance interpretation (not autonomous restructuring engine).
 */
export class TransformationGovernanceInterpretationLayer {
  synthesizeAdaptationGovernanceLine(
    adaptationGovernance: AdaptationGovernanceMaturity,
    resilienceEvolution: string
  ): string {
    if (adaptationGovernance === "mature" && resilienceEvolution === "mature") {
      return "Adaptation governance mature — resilience-oriented evolution synchronizes with institutional progression; executives retain transformation authority";
    }
    if (adaptationGovernance === "strained") {
      return "Adaptation governance strained — pace transformation with continuity discipline rather than autonomous mutation";
    }
    return `Adaptation governance ${adaptationGovernance} · resilience evolution ${resilienceEvolution}`;
  }

  inferAdaptationGovernance(
    governanceOversightActive: boolean,
    strategicCalibrationActive: boolean,
    pressureGovernanceActive: boolean,
    fragilityElevated: boolean
  ): AdaptationGovernanceMaturity {
    if (fragilityElevated && !pressureGovernanceActive) return "strained";
    if (
      governanceOversightActive &&
      strategicCalibrationActive &&
      pressureGovernanceActive
    ) {
      return "mature";
    }
    if (governanceOversightActive || strategicCalibrationActive) return "developing";
    return "nascent";
  }
}

export const transformationGovernanceInterpretationLayer =
  new TransformationGovernanceInterpretationLayer();
