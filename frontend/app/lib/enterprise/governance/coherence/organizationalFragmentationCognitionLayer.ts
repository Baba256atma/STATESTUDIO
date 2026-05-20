import type {
  CoherenceStrategicAlignment,
  CoordinationIntegrity,
  InstitutionalHarmony,
  ResilienceCoherence,
} from "./enterpriseStrategicCoherenceTypes";

/**
 * F9:2 — Organizational fragmentation cognition (awareness without fear-based governance).
 */
export class OrganizationalFragmentationCognitionLayer {
  synthesizeFragmentationLine(
    strategicAlignment: CoherenceStrategicAlignment,
    coordinationIntegrity: CoordinationIntegrity,
    resilienceCoherence: ResilienceCoherence
  ): string {
    if (strategicAlignment === "fragmented" || coordinationIntegrity === "fragmented") {
      return "Coordination fragmentation risk — strategic and operational layers may diverge; executive judgment retains authority";
    }
    if (resilienceCoherence === "discontinuous") {
      return "Resilience discontinuity observed — adaptation and governance synchronization may need reinforcement";
    }
    if (strategicAlignment === "harmonized" && coordinationIntegrity === "stable") {
      return "Fragmentation signals low — operational coherence and resilience alignment support institutional harmony";
    }
    return "Fragmentation cognition monitoring — alignment evolution tracked without bureaucratic enforcement";
  }

  inferCoordinationIntegrity(
    governanceSynchronization: string,
    fragilityElevated: boolean
  ): CoordinationIntegrity {
    if (governanceSynchronization === "coherent") return "stable";
    if (governanceSynchronization === "synchronized") return "integrated";
    if (fragilityElevated) return "fragmented";
    return "forming";
  }

  inferInstitutionalHarmony(
    strategicAlignment: CoherenceStrategicAlignment,
    continuityPreserved: boolean
  ): InstitutionalHarmony {
    if (!continuityPreserved) return "strained";
    if (strategicAlignment === "harmonized") return "stable";
    if (strategicAlignment === "tracking" || strategicAlignment === "forming") return "harmonious";
    return "forming";
  }
}

export const organizationalFragmentationCognitionLayer =
  new OrganizationalFragmentationCognitionLayer();
