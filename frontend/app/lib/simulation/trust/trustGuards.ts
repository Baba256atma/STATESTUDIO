/**
 * D7:3:5 — Ethical organizational trust governance guard rails.
 */

import type { OrganizationalTrustSignal } from "./trustStabilityTypes.ts";
import { logTrustDev } from "./trustDevLog.ts";

export type TrustGuardCode =
  | "empty_trust_context"
  | "too_many_trust_signals"
  | "invalid_trust_intensity"
  | "invalid_trust_region"
  | "duplicate_trust_build"
  | "prohibited_behavioral_inference"
  | "invasive_trust_analysis"
  | "corrupted_trust_state";

export type TrustGuardResult =
  | { ok: true }
  | { ok: false; code: TrustGuardCode; message: string };

export const DEFAULT_MAX_TRUST_SIGNALS = 96;
export const PROHIBITED_TRUST_TEXT = [
  "personality",
  "emotion",
  "emotional",
  "psychological",
  "psychology",
  "sentiment",
  "manipulation",
  "surveillance",
  "belief",
  "relationship",
] as const;

function reject(code: TrustGuardCode, message: string): TrustGuardResult {
  const result = { ok: false as const, code, message };
  logTrustDev("TrustGuard", { code, message });
  return result;
}

export function buildTrustContentFingerprint(input: {
  topologyFingerprint: string;
  coordinationFingerprint?: string;
  frictionFingerprint?: string;
  influenceFingerprint?: string;
  actorFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    coordination: input.coordinationFingerprint ?? null,
    friction: input.frictionFingerprint ?? null,
    influence: input.influenceFingerprint ?? null,
    actors: input.actorFingerprint ?? null,
    tick: input.tick,
  });
}

export function containsProhibitedTrustText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_TRUST_TEXT.some((term) => lower.includes(term));
}

export function guardEvaluateOrganizationalTrust(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly OrganizationalTrustSignal[];
  priorTrustFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): TrustGuardResult {
  if (!input.topologyId) {
    return reject("empty_trust_context", "Topology context is required to evaluate organizational trust");
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_TRUST_SIGNALS) {
    return reject(
      "too_many_trust_signals",
      `Trust signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_TRUST_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_trust_intensity",
        `Trust signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_trust_region",
          `Trust signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsProhibitedTrustText(label)) {
      return reject(
        "invasive_trust_analysis",
        `Trust signal ${signal.signalId} contains prohibited behavioral inference text`
      );
    }
    for (const driver of signal.dominantTrustDrivers ?? []) {
      if (containsProhibitedTrustText(driver)) {
        return reject(
          "prohibited_behavioral_inference",
          `Trust signal ${signal.signalId} contains prohibited driver text`
        );
      }
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorTrustFingerprints ?? []).includes(pending)) {
    return reject("duplicate_trust_build", "Identical organizational trust evaluation was already executed");
  }

  return { ok: true };
}
