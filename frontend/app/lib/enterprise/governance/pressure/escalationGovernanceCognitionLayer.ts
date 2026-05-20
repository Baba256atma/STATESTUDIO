import type {
  CoordinationStressHandling,
  EscalationGovernanceStability,
  OperationalPressure,
  StabilizationMaturity,
} from "./strategicPressureGovernanceTypes";

/**
 * F9:4 — Escalation governance cognition (pressure awareness without panic systems).
 */
export class EscalationGovernanceCognitionLayer {
  synthesizeEscalationLine(
    escalationGovernance: EscalationGovernanceStability,
    operationalPressure: OperationalPressure
  ): string {
    if (escalationGovernance === "disciplined" && operationalPressure !== "critical") {
      return "Escalation governance disciplined — operational pressure contained within institutional oversight bounds";
    }
    if (operationalPressure === "critical" || escalationGovernance === "avoidant") {
      return "Escalation pressure elevated — stabilization and resilience continuity reinforcement recommended without fear-based alerting";
    }
    return `Escalation governance ${escalationGovernance} under ${operationalPressure} operational pressure`;
  }

  inferOperationalPressure(
    fragilityElevated: boolean,
    continuityPreserved: boolean
  ): OperationalPressure {
    if (!continuityPreserved) return "critical";
    if (fragilityElevated) return "elevated";
    return "moderate";
  }

  inferEscalationGovernance(
    governanceEscalation: string | undefined,
    fragilityElevated: boolean
  ): EscalationGovernanceStability {
    if (governanceEscalation === "disciplined" && !fragilityElevated) return "disciplined";
    if (governanceEscalation === "elevated" || fragilityElevated) return "contained";
    if (governanceEscalation === "balanced") return "forming";
    return "avoidant";
  }

  inferCoordinationStressHandling(
    coordinationIntegrity: string | undefined,
    fragilityElevated: boolean
  ): CoordinationStressHandling {
    if (coordinationIntegrity === "stable" && !fragilityElevated) return "resilient";
    if (coordinationIntegrity === "integrated") return "coordinated";
    if (fragilityElevated) return "fragmented";
    return "adapting";
  }

  inferStabilizationMaturity(
    enterpriseCoherenceActive: boolean,
    strategicCalibrationActive: boolean,
    fragilityElevated: boolean
  ): StabilizationMaturity {
    if (enterpriseCoherenceActive && strategicCalibrationActive && !fragilityElevated) {
      return "mature";
    }
    if (strategicCalibrationActive || enterpriseCoherenceActive) return "developing";
    if (fragilityElevated) return "strained";
    return "nascent";
  }
}

export const escalationGovernanceCognitionLayer = new EscalationGovernanceCognitionLayer();
