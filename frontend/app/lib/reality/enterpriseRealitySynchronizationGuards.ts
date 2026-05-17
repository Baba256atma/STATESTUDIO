/**
 * D7:7:2 — Enterprise reality synchronization governance guard rails.
 */

import type { EnterpriseRealitySynchronizationSignal } from "./enterpriseRealitySynchronizationTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logEnterpriseRealitySynchronizationDev } from "./enterpriseRealitySynchronizationDevLog.ts";

export type EnterpriseRealitySynchronizationGuardCode =
  | "empty_synchronization_context"
  | "too_many_synchronization_signals"
  | "invalid_synchronization_strength"
  | "invalid_synchronization_region"
  | "duplicate_synchronization_build"
  | "unsupported_synchronization_claim"
  | "autonomous_enterprise_governance"
  | "fabricated_synchronization_state"
  | "unstable_recursive_synchronization"
  | "runaway_synchronization_orchestration"
  | "corrupted_synchronization_state";

export type EnterpriseRealitySynchronizationGuardResult =
  | { ok: true }
  | { ok: false; code: EnterpriseRealitySynchronizationGuardCode; message: string };

export const DEFAULT_MAX_SYNCHRONIZATION_SIGNALS = 96;
export const SYNCHRONIZATION_AMBIGUITY_DISCLAIMER =
  "Enterprise operational reality synchronization reflects evidence-grounded alignment under current inputs and is indicative, not definitive.";
export const NON_AUTONOMOUS_SYNCHRONIZATION_DISCLAIMER =
  "Nexora models operational synchronization without assigning enterprise governance authority; strategic decisions remain fully under executive control.";

const PROHIBITED_SYNC_TEXT = [
  "autonomous enterprise governance",
  "autonomous enterprise control",
  "autonomous operational governance",
  "self-governing enterprise",
  "self governing enterprise",
  "executive replacement ai",
  "executive replacement cognition",
  "unstable recursive synchronization",
  "fabricated synchronization state",
  "fabricate synchronized states",
  "hidden operational manipulation",
  "hidden operational governance",
  "psychological manipulation",
  "override executive",
  "override judgment",
  "manipulative",
] as const;

function containsProhibitedSyncText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_SYNC_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: EnterpriseRealitySynchronizationGuardCode,
  message: string
): EnterpriseRealitySynchronizationGuardResult {
  const result = { ok: false as const, code, message };
  logEnterpriseRealitySynchronizationDev("SyncGuard", { code, message });
  return result;
}

export function buildSynchronizationContentFingerprint(input: {
  topologyFingerprint: string;
  realityFingerprint?: string;
  orchestrationFingerprint?: string;
  momentumFingerprint?: string;
  equilibriumFingerprint?: string;
  governanceFingerprint?: string;
  foresightFingerprint?: string;
  trajectoryFingerprint?: string;
  divergenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    reality: input.realityFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    momentum: input.momentumFingerprint ?? null,
    equilibrium: input.equilibriumFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    trajectory: input.trajectoryFingerprint ?? null,
    divergence: input.divergenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateEnterpriseRealitySynchronization(input: {
  topologyId: string;
  regionIds: readonly string[];
  synchronizationSignals: readonly EnterpriseRealitySynchronizationSignal[];
  priorSynchronizationFingerprints?: readonly string[];
  pendingFingerprint?: string;
  synchronizationCoherenceScore?: number;
  operationalDriftScore?: number;
}): EnterpriseRealitySynchronizationGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_synchronization_context",
      "Topology context is required to evaluate enterprise reality synchronization"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.synchronizationSignals.length > DEFAULT_MAX_SYNCHRONIZATION_SIGNALS) {
    return reject(
      "too_many_synchronization_signals",
      `Synchronization signal count ${input.synchronizationSignals.length} exceeds max ${DEFAULT_MAX_SYNCHRONIZATION_SIGNALS}`
    );
  }

  if ((input.synchronizationCoherenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_synchronization_orchestration",
      "Synchronization coherence score implies uncontrolled synchronization orchestration"
    );
  }

  if ((input.operationalDriftScore ?? 0) > 0.95) {
    return reject(
      "runaway_synchronization_orchestration",
      "Operational drift score implies uncontrolled synchronization orchestration"
    );
  }

  for (const signal of input.synchronizationSignals) {
    if (
      !Number.isFinite(signal.synchronizationStrength) ||
      signal.synchronizationStrength < 0 ||
      signal.synchronizationStrength > 0.92
    ) {
      return reject(
        "invalid_synchronization_strength",
        `Synchronization strength ${signal.synchronizationStrength} for ${signal.synchronizationId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_synchronization_region",
          `Synchronization region ${regionId} is not in topology for ${signal.synchronizationId}`
        );
      }
    }
  }

  if (input.priorSynchronizationFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_synchronization_build",
      "Duplicate enterprise reality synchronization build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardEnterpriseRealitySynchronizationSemantics(input: {
  headline: string;
  summary: string;
}): EnterpriseRealitySynchronizationGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_synchronization_claim",
      "Synchronization semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedSyncText(combined)) {
    return reject(
      "fabricated_synchronization_state",
      "Synchronization semantics imply fabricated synchronization or autonomous enterprise governance"
    );
  }
  if (combined.toLowerCase().includes("autonomous enterprise governance")) {
    return reject(
      "autonomous_enterprise_governance",
      "Synchronization semantics imply autonomous enterprise governance"
    );
  }
  if (combined.toLowerCase().includes("unstable recursive synchronization")) {
    return reject(
      "unstable_recursive_synchronization",
      "Synchronization semantics imply unstable recursive synchronization"
    );
  }
  return { ok: true };
}
