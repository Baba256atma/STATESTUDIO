import type { GovernanceStability, OperationalDiscipline } from "./adaptiveGovernanceTypes";

/**
 * F9:1 — Enterprise self-calibration foundations (governance adaptation intelligence, not autonomous control).
 */
export class EnterpriseSelfCalibrationLayer {
  synthesizeCalibrationLine(
    governanceStability: GovernanceStability,
    operationalDiscipline: OperationalDiscipline
  ): string {
    if (governanceStability === "stable" && operationalDiscipline === "mature") {
      return "Self-calibration stable — operational discipline and governance continuity reinforce strategic execution consistency";
    }
    if (governanceStability === "strained" || operationalDiscipline === "degraded") {
      return "Recalibration recommended — operational discipline or governance stability may need executive reinforcement";
    }
    return `Governance ${governanceStability} · operational discipline ${operationalDiscipline} — bounded self-calibration without autonomous authority`;
  }

  inferGovernanceStability(
    continuityPreserved: boolean,
    convergenceDepth: number,
    fragilityElevated: boolean
  ): GovernanceStability {
    if (!continuityPreserved) return "fragile";
    if (fragilityElevated && convergenceDepth < 2) return "strained";
    if (convergenceDepth >= 4) return "stable";
    if (convergenceDepth >= 1) return "forming";
    return "fragile";
  }

  inferOperationalDiscipline(
    behavioralLearningActive: boolean,
    cognitiveCultureActive: boolean,
    cognitionConverged: boolean
  ): OperationalDiscipline {
    if (cognitiveCultureActive && cognitionConverged) return "mature";
    if (behavioralLearningActive || cognitiveCultureActive) return "developing";
    if (!cognitionConverged) return "degraded";
    return "nascent";
  }
}

export const enterpriseSelfCalibrationLayer = new EnterpriseSelfCalibrationLayer();
