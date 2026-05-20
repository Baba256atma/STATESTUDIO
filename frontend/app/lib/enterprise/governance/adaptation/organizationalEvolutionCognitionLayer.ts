import type {
  CoordinationEvolution,
  InstitutionalProgression,
  OperationalAdaptation,
  ResilienceEvolution,
  StrategicTransformation,
  TransformationContinuity,
} from "./strategicAdaptationGovernanceTypes";

/**
 * F9:5 — Autonomous organizational evolution cognition (not corporate self-governance AI).
 */
export class OrganizationalEvolutionCognitionLayer {
  synthesizeTransformationContinuityLine(
    transformationContinuity: TransformationContinuity,
    strategicTransformation: StrategicTransformation
  ): string {
    if (transformationContinuity === "coherent" && strategicTransformation === "sustained") {
      return "Transformation continuity coherent — enterprise restructuring preserves operational continuity without autonomous executive replacement";
    }
    if (transformationContinuity === "fragmented" || strategicTransformation === "disrupted") {
      return "Transformation continuity needs reinforcement — adaptation governance and resilience evolution should align before structural acceleration";
    }
    return `Transformation continuity ${transformationContinuity} · strategic transformation ${strategicTransformation}`;
  }

  synthesizeOperationalEvolutionLine(
    operationalAdaptation: OperationalAdaptation,
    coordinationEvolution: CoordinationEvolution
  ): string {
    return `Operational adaptation ${operationalAdaptation} · coordination evolution ${coordinationEvolution}`;
  }

  inferTransformationContinuity(
    continuityPreserved: boolean,
    executiveStabilityActive: boolean,
    fragilityElevated: boolean
  ): TransformationContinuity {
    if (!continuityPreserved) return "fragmented";
    if (executiveStabilityActive && !fragilityElevated) return "coherent";
    if (!fragilityElevated) return "sustained";
    return "forming";
  }

  inferStrategicTransformation(
    enterpriseEvolutionActive: boolean,
    strategicEvolutionActive: boolean,
    fragilityElevated: boolean
  ): StrategicTransformation {
    if (fragilityElevated) return "disrupted";
    if (enterpriseEvolutionActive && strategicEvolutionActive) return "sustained";
    if (enterpriseEvolutionActive || strategicEvolutionActive) return "progressing";
    return "nascent";
  }

  inferOperationalAdaptation(
    strategicCalibrationActive: boolean,
    enterpriseCoherenceActive: boolean,
    fragilityElevated: boolean
  ): OperationalAdaptation {
    if (fragilityElevated) return "strained";
    if (strategicCalibrationActive && enterpriseCoherenceActive) return "synchronized";
    if (enterpriseCoherenceActive) return "coordinated";
    return "forming";
  }

  inferCoordinationEvolution(
    coordinationIntegrity: string | undefined,
    cognitionConverged: boolean
  ): CoordinationEvolution {
    if (coordinationIntegrity === "aligned" && cognitionConverged) return "mature";
    if (coordinationIntegrity === "aligned" || cognitionConverged) return "aligned";
    if (coordinationIntegrity === "forming") return "adapting";
    return "fragmented";
  }

  inferInstitutionalProgression(
    convergenceDepth: number,
    institutionalCognitionConverged: boolean
  ): InstitutionalProgression {
    if (institutionalCognitionConverged && convergenceDepth >= 5) return "mature";
    if (convergenceDepth >= 3) return "developing";
    if (convergenceDepth >= 1) return "early";
    return "strained";
  }

  inferResilienceEvolution(
    resilienceEvolutionActive: boolean,
    resilienceGovernance: string | undefined,
    fragilityElevated: boolean
  ): ResilienceEvolution {
    if (resilienceEvolutionActive && resilienceGovernance === "consistent") return "mature";
    if (resilienceEvolutionActive || resilienceGovernance === "adaptive") return "sustained";
    if (fragilityElevated) return "reactive";
    return "adaptive";
  }
}

export const organizationalEvolutionCognitionLayer = new OrganizationalEvolutionCognitionLayer();
