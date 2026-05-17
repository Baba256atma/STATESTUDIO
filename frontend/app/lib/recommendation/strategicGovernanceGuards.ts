/**
 * D7:5:6 — Executive strategic governance guard rails.
 */

import type { StrategicGovernanceSignal } from "./strategicGovernanceTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategicGovernanceDev } from "./strategicGovernanceDevLog.ts";

export type StrategicGovernanceGuardCode =
  | "empty_governance_context"
  | "too_many_governance_signals"
  | "invalid_governance_strength"
  | "invalid_governance_region"
  | "duplicate_governance_build"
  | "unsupported_governance_claim"
  | "autonomous_governance_enforcement"
  | "hidden_authority_escalation"
  | "runaway_governance_amplification"
  | "corrupted_governance_state";

export type StrategicGovernanceGuardResult =
  | { ok: true }
  | { ok: false; code: StrategicGovernanceGuardCode; message: string };

export const DEFAULT_MAX_GOVERNANCE_SIGNALS = 96;
export const GOVERNANCE_AMBIGUITY_DISCLAIMER =
  "Strategic governance intelligence reflects alignment and safety indicators under current conditions and is indicative, not definitive.";
export const NON_ENFORCEMENT_DISCLAIMER =
  "Nexora does not apply governance actions without executive direction; executives retain full strategic authority.";

const PROHIBITED_ENFORCEMENT_TEXT = [
  "autonomous governance",
  "autonomous enforcement",
  "enforce governance",
  "automatically enforce",
  "auto-enforce",
  "hidden authority",
  "authority escalation",
  "override executive",
  "mandate governance",
  "self-governing",
] as const;

function containsProhibitedEnforcementText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_ENFORCEMENT_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: StrategicGovernanceGuardCode,
  message: string
): StrategicGovernanceGuardResult {
  const result = { ok: false as const, code, message };
  logStrategicGovernanceDev("GovernanceGuard", { code, message });
  return result;
}

export function buildGovernanceContentFingerprint(input: {
  topologyFingerprint: string;
  memoryFingerprint?: string;
  comparisonFingerprint?: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    memory: input.memoryFingerprint ?? null,
    comparison: input.comparisonFingerprint ?? null,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateStrategicGovernance(input: {
  topologyId: string;
  regionIds: readonly string[];
  governanceSignals: readonly StrategicGovernanceSignal[];
  priorGovernanceFingerprints?: readonly string[];
  pendingFingerprint?: string;
  governanceStabilityScore?: number;
  oversightRequirementScore?: number;
}): StrategicGovernanceGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_governance_context",
      "Topology context is required to evaluate strategic governance"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.governanceSignals.length > DEFAULT_MAX_GOVERNANCE_SIGNALS) {
    return reject(
      "too_many_governance_signals",
      `Governance signal count ${input.governanceSignals.length} exceeds max ${DEFAULT_MAX_GOVERNANCE_SIGNALS}`
    );
  }

  if ((input.governanceStabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_governance_amplification",
      "Governance stability score implies uncontrolled governance amplification"
    );
  }

  if ((input.oversightRequirementScore ?? 0) > 0.95) {
    return reject(
      "runaway_governance_amplification",
      "Oversight requirement score implies uncontrolled governance amplification"
    );
  }

  for (const signal of input.governanceSignals) {
    if (
      !Number.isFinite(signal.governanceStrength) ||
      signal.governanceStrength < 0 ||
      signal.governanceStrength > 0.92
    ) {
      return reject(
        "invalid_governance_strength",
        `Governance strength ${signal.governanceStrength} for ${signal.governanceId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_governance_region",
          `Governance region ${regionId} is not in topology for ${signal.governanceId}`
        );
      }
    }
  }

  if (input.priorGovernanceFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject("duplicate_governance_build", "Duplicate strategic governance build fingerprint detected");
  }

  return { ok: true };
}

export function guardGovernanceExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): StrategicGovernanceGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_governance_claim",
      "Governance semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedEnforcementText(combined)) {
    return reject(
      "autonomous_governance_enforcement",
      "Governance semantics imply autonomous governance enforcement"
    );
  }
  if (combined.toLowerCase().includes("hidden prioritization")) {
    return reject(
      "hidden_authority_escalation",
      "Governance semantics imply hidden authority escalation"
    );
  }
  return { ok: true };
}
