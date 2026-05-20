import type {
  EvolutionConvergencePosture,
  InstitutionalStrategicEvolution,
  SelfRegulationDiscipline,
} from "./unifiedAdaptiveGovernanceTypes";

/**
 * F9:6 — Institutional strategic evolution convergence (not autonomous enterprise authority).
 */
export class InstitutionalStrategicEvolutionConvergenceLayer {
  synthesizeStrategicEvolutionLine(
    evolution: InstitutionalStrategicEvolution,
    posture: EvolutionConvergencePosture
  ): string {
    if (posture === "self_regulating" && evolution.enterpriseStrategicContinuity === "coherent") {
      return "Institutional strategic evolution self-regulating — governance, coherence, stability, and adaptation synchronize without replacing executive authority";
    }
    if (evolution.governanceContinuity === "broken") {
      return "Strategic evolution requires continuity reinforcement — unified governance maintains awareness while executives retain decision authority";
    }
    return `Strategic evolution ${evolution.institutionalEvolutionSync} · enterprise continuity ${evolution.enterpriseStrategicContinuity}`;
  }

  synthesizeSelfRegulationLine(evolution: InstitutionalStrategicEvolution): string {
    return `Self-regulation discipline ${evolution.selfRegulationDiscipline} · adaptation maturity ${evolution.adaptationGovernanceMaturity}`;
  }

  inferSelfRegulationDiscipline(
    governanceOversightActive: boolean,
    executiveStabilityActive: boolean,
    organizationalEvolutionActive: boolean,
    fragilityElevated: boolean
  ): SelfRegulationDiscipline {
    if (fragilityElevated) return "reactive";
    if (
      governanceOversightActive &&
      executiveStabilityActive &&
      organizationalEvolutionActive
    ) {
      return "mature";
    }
    if (governanceOversightActive || executiveStabilityActive) return "disciplined";
    return "forming";
  }
}

export const institutionalStrategicEvolutionConvergenceLayer =
  new InstitutionalStrategicEvolutionConvergenceLayer();
