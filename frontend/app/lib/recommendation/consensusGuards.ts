/**
 * D7:5:9 — Executive strategic consensus governance guard rails.
 */

import type { ExecutiveConsensusSignal } from "./executiveConsensusTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveStrategicConsensusDev } from "./consensusDevLog.ts";

export type ExecutiveStrategicConsensusGuardCode =
  | "empty_consensus_context"
  | "too_many_consensus_signals"
  | "invalid_consensus_strength"
  | "invalid_consensus_region"
  | "duplicate_consensus_build"
  | "unsupported_consensus_claim"
  | "manipulative_alignment_detected"
  | "autonomous_consensus_enforcement"
  | "runaway_consensus_amplification"
  | "corrupted_consensus_state";

export type ExecutiveStrategicConsensusGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveStrategicConsensusGuardCode; message: string };

export const DEFAULT_MAX_CONSENSUS_SIGNALS = 96;
export const CONSENSUS_AMBIGUITY_DISCLAIMER =
  "Strategic consensus intelligence reflects alignment indicators under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_DISCLAIMER =
  "Nexora does not manipulate executive agreement; strategic alignment assessment remains fully under executive control.";

const PROHIBITED_MANIPULATION_TEXT = [
  "manipulative",
  "hidden persuasion",
  "force alignment",
  "forced alignment",
  "autonomous consensus",
  "mandate agreement",
  "political consensus engineering",
  "override executive",
  "override judgment",
  "consensus enforcement",
] as const;

function containsProhibitedManipulationText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_MANIPULATION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveStrategicConsensusGuardCode,
  message: string
): ExecutiveStrategicConsensusGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveStrategicConsensusDev("ConsensusGuard", { code, message });
  return result;
}

export function buildConsensusContentFingerprint(input: {
  topologyFingerprint: string;
  advisoryFingerprint?: string;
  explainabilityFingerprint?: string;
  governanceFingerprint?: string;
  memoryFingerprint?: string;
  comparisonFingerprint?: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    advisory: input.advisoryFingerprint ?? null,
    explainability: input.explainabilityFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    memory: input.memoryFingerprint ?? null,
    comparison: input.comparisonFingerprint ?? null,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateStrategicConsensus(input: {
  topologyId: string;
  regionIds: readonly string[];
  consensusSignals: readonly ExecutiveConsensusSignal[];
  priorConsensusFingerprints?: readonly string[];
  pendingFingerprint?: string;
  strategicAlignmentScore?: number;
  fragmentationEscalationScore?: number;
}): ExecutiveStrategicConsensusGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_consensus_context",
      "Topology context is required to evaluate strategic consensus"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.consensusSignals.length > DEFAULT_MAX_CONSENSUS_SIGNALS) {
    return reject(
      "too_many_consensus_signals",
      `Consensus signal count ${input.consensusSignals.length} exceeds max ${DEFAULT_MAX_CONSENSUS_SIGNALS}`
    );
  }

  if ((input.strategicAlignmentScore ?? 0) > 0.95) {
    return reject(
      "runaway_consensus_amplification",
      "Strategic alignment score implies uncontrolled consensus amplification"
    );
  }

  if ((input.fragmentationEscalationScore ?? 0) > 0.95) {
    return reject(
      "runaway_consensus_amplification",
      "Fragmentation escalation score implies uncontrolled consensus amplification"
    );
  }

  for (const signal of input.consensusSignals) {
    if (
      !Number.isFinite(signal.consensusStrength) ||
      signal.consensusStrength < 0 ||
      signal.consensusStrength > 0.92
    ) {
      return reject(
        "invalid_consensus_strength",
        `Consensus strength ${signal.consensusStrength} for ${signal.consensusId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_consensus_region",
          `Consensus region ${regionId} is not in topology for ${signal.consensusId}`
        );
      }
    }
  }

  if (input.priorConsensusFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject("duplicate_consensus_build", "Duplicate strategic consensus build fingerprint detected");
  }

  return { ok: true };
}

export function guardConsensusExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveStrategicConsensusGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_consensus_claim",
      "Consensus semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedManipulationText(combined)) {
    return reject(
      "manipulative_alignment_detected",
      "Consensus semantics imply manipulative alignment or persuasion"
    );
  }
  if (combined.toLowerCase().includes("autonomously enforce consensus")) {
    return reject(
      "autonomous_consensus_enforcement",
      "Consensus semantics imply autonomous consensus enforcement"
    );
  }
  return { ok: true };
}
