import type {
  AdaptationConsistency,
  EscalationGovernance,
  InstitutionalCoherence,
  ResilienceGovernance,
  StrategicAlignment,
} from "./adaptiveGovernanceTypes";

/**
 * F9:1 — Strategic oversight interpretation (operational governance awareness, not executive replacement).
 */
export class StrategicOversightInterpretationLayer {
  synthesizeOversightLine(
    strategicAlignment: StrategicAlignment,
    institutionalCoherence: InstitutionalCoherence
  ): string {
    if (strategicAlignment === "aligned" && institutionalCoherence === "stable") {
      return "Strategic oversight indicates aligned operational coherence — governance continuity holds under current institutional depth";
    }
    if (strategicAlignment === "tracking" || institutionalCoherence === "coherent") {
      return "Oversight tracking strategic alignment and institutional coherence — adaptation governance remains bounded and continuity-safe";
    }
    if (strategicAlignment === "misaligned" || institutionalCoherence === "fragmenting") {
      return "Governance fragmentation risk elevated — strategic alignment and institutional coherence require executive attention without autonomous intervention";
    }
    return "Strategic oversight establishing — governance interpretation activates as institutional cognition deepens";
  }

  synthesizeAlignmentLine(
    strategicAlignment: StrategicAlignment,
    resilienceGovernance: ResilienceGovernance
  ): string {
    if (strategicAlignment === "aligned" && resilienceGovernance === "consistent") {
      return "Strategic alignment stable · resilience governance consistent across operational cycles";
    }
    if (resilienceGovernance === "strained") {
      return "Resilience governance under pressure — strategic alignment may weaken without disciplined recalibration";
    }
    return `Strategic alignment ${strategicAlignment} · resilience governance ${resilienceGovernance}`;
  }

  inferResilienceGovernance(
    resilienceEvolutionActive: boolean,
    fragilityElevated: boolean
  ): ResilienceGovernance {
    if (resilienceEvolutionActive && !fragilityElevated) return "consistent";
    if (resilienceEvolutionActive) return "adaptive";
    if (fragilityElevated) return "strained";
    return "reactive";
  }

  inferEscalationGovernance(behavioralLearningActive: boolean, fragilityElevated: boolean): EscalationGovernance {
    if (behavioralLearningActive && !fragilityElevated) return "disciplined";
    if (fragilityElevated) return "elevated";
    if (behavioralLearningActive) return "balanced";
    return "avoidant";
  }

  inferAdaptationConsistency(
    enterpriseEvolutionActive: boolean,
    institutionalCognitionConverged: boolean
  ): AdaptationConsistency {
    if (institutionalCognitionConverged) return "sustained";
    if (enterpriseEvolutionActive) return "coherent";
    return "forming";
  }

  inferInstitutionalCoherence(
    convergenceDepth: number,
    continuityPreserved: boolean
  ): InstitutionalCoherence {
    if (!continuityPreserved) return "fragmenting";
    if (convergenceDepth >= 4) return "stable";
    if (convergenceDepth >= 2) return "coherent";
    return "forming";
  }
}

export const strategicOversightInterpretationLayer = new StrategicOversightInterpretationLayer();
