import type {
  AdaptationEffectiveness,
  DecisionQuality,
  InstitutionalLearningStrength,
} from "./adaptiveStrategicCalibrationTypes";

/**
 * F9:3 — Institutional decision quality cognition (evolution awareness, not executive scoring).
 */
export class DecisionQualityCognitionLayer {
  synthesizeDecisionQualityLine(
    decisionQuality: DecisionQuality,
    adaptationEffectiveness: AdaptationEffectiveness
  ): string {
    if (decisionQuality === "refined" && adaptationEffectiveness === "sustained") {
      return "Decision quality cognition indicates refined operational choices — adaptation effectiveness sustained without punitive scoring";
    }
    if (decisionQuality === "strained" || adaptationEffectiveness === "weak") {
      return "Decision evolution under pressure — strategic recalibration may strengthen continuity; executives retain decision authority";
    }
    return `Decision quality ${decisionQuality} · adaptation effectiveness ${adaptationEffectiveness} — bounded institutional refinement`;
  }

  inferDecisionQuality(
    governanceOversightActive: boolean,
    enterpriseCoherenceActive: boolean,
    cognitionConverged: boolean,
    fragilityElevated: boolean
  ): DecisionQuality {
    if (governanceOversightActive && enterpriseCoherenceActive && cognitionConverged) {
      return "refined";
    }
    if (fragilityElevated) return "strained";
    if (governanceOversightActive || enterpriseCoherenceActive) return "developing";
    return "emerging";
  }

  inferInstitutionalLearningStrength(
    adaptationEffectiveness: AdaptationEffectiveness,
    continuityPreserved: boolean
  ): InstitutionalLearningStrength {
    if (!continuityPreserved) return "weak";
    if (adaptationEffectiveness === "sustained") return "embedded";
    if (adaptationEffectiveness === "effective") return "strong";
    return "forming";
  }
}

export const decisionQualityCognitionLayer = new DecisionQualityCognitionLayer();
