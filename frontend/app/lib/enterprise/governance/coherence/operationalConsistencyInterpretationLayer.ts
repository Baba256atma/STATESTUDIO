import type {
  AdaptationAlignment,
  CoherenceStrategicAlignment,
  OperationalConsistency,
} from "./enterpriseStrategicCoherenceTypes";

/**
 * F9:2 — Operational consistency interpretation (alignment cognition, not compliance enforcement).
 */
export class OperationalConsistencyInterpretationLayer {
  synthesizeAlignmentIntegrityLine(
    strategicAlignment: CoherenceStrategicAlignment,
    operationalConsistency: OperationalConsistency
  ): string {
    if (strategicAlignment === "harmonized" && operationalConsistency === "consistent") {
      return "Strategic alignment integrity holds — operational consistency and institutional synchronization remain coherent";
    }
    if (strategicAlignment === "fragmented" || operationalConsistency === "inconsistent") {
      return "Alignment degradation detected — coordination fragmentation may weaken operational harmony without removing executive flexibility";
    }
    return `Alignment ${strategicAlignment} · operational consistency ${operationalConsistency} — coherence cognition remains bounded oversight`;
  }

  synthesizeHarmonyLine(
    institutionalHarmony: string,
    governanceSynchronization: string
  ): string {
    return `Institutional harmony ${institutionalHarmony} · governance synchronization ${governanceSynchronization}`;
  }

  inferOperationalConsistency(
    governanceOversightActive: boolean,
    adaptationAlignment: AdaptationAlignment,
    fragilityElevated: boolean
  ): OperationalConsistency {
    if (governanceOversightActive && adaptationAlignment === "sustained") return "consistent";
    if (fragilityElevated) return "strained";
    if (adaptationAlignment === "aligned" || adaptationAlignment === "sustained") return "forming";
    return "inconsistent";
  }
}

export const operationalConsistencyInterpretationLayer =
  new OperationalConsistencyInterpretationLayer();
