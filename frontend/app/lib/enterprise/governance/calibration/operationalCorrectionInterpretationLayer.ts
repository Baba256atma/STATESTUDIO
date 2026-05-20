import type {
  GovernanceCorrectionQuality,
  OperationalRefinement,
  ResilienceDecisionEvolution,
  StrategicAdjustmentPattern,
} from "./adaptiveStrategicCalibrationTypes";

/**
 * F9:3 — Operational correction interpretation (strategic refinement, not surveillance).
 */
export class OperationalCorrectionInterpretationLayer {
  synthesizeCorrectionLine(
    strategicAdjustmentPatterns: StrategicAdjustmentPattern,
    governanceCorrectionQuality: GovernanceCorrectionQuality
  ): string {
    if (
      strategicAdjustmentPatterns === "adaptive" ||
      strategicAdjustmentPatterns === "proactive"
    ) {
      return `Operational correction ${strategicAdjustmentPatterns} — governance refinement ${governanceCorrectionQuality} supports institutional learning reinforcement`;
    }
    if (strategicAdjustmentPatterns === "reactive") {
      return "Reactive adjustment pattern — recalibration opportunity without executive performance judgment";
    }
    return `Strategic adjustment ${strategicAdjustmentPatterns} · governance correction ${governanceCorrectionQuality}`;
  }

  synthesizeRefinementLine(
    operationalRefinement: OperationalRefinement,
    resilienceDecisionEvolution: ResilienceDecisionEvolution
  ): string {
    return `Operational refinement ${operationalRefinement} · resilience decision evolution ${resilienceDecisionEvolution}`;
  }

  inferStrategicAdjustmentPattern(
    enterpriseCoherenceActive: boolean,
    fragilityElevated: boolean
  ): StrategicAdjustmentPattern {
    if (enterpriseCoherenceActive && !fragilityElevated) return "proactive";
    if (enterpriseCoherenceActive) return "adaptive";
    if (fragilityElevated) return "corrective";
    return "reactive";
  }

  inferResilienceDecisionEvolution(
    resilienceCoherence: string | undefined,
    fragilityElevated: boolean
  ): ResilienceDecisionEvolution {
    if (resilienceCoherence === "mature") return "consistent";
    if (resilienceCoherence === "aligned") return "maturing";
    if (fragilityElevated) return "fragile";
    return "forming";
  }

  inferGovernanceCorrectionQuality(
    governanceSynchronization: string | undefined,
    governanceOversightActive: boolean
  ): GovernanceCorrectionQuality {
    if (governanceSynchronization === "coherent" && governanceOversightActive) {
      return "mature";
    }
    if (governanceSynchronization === "synchronized") return "stable";
    return "forming";
  }

  inferOperationalRefinement(
    operationalConsistency: string | undefined,
    cognitionConverged: boolean
  ): OperationalRefinement {
    if (operationalConsistency === "consistent" && cognitionConverged) return "mature";
    if (operationalConsistency === "consistent" || operationalConsistency === "forming") {
      return "developing";
    }
    if (!cognitionConverged) return "degraded";
    return "nascent";
  }
}

export const operationalCorrectionInterpretationLayer =
  new OperationalCorrectionInterpretationLayer();
