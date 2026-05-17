/**
 * D7:6:7 — Executive scenario immersion governance guard rails.
 */

import type { ExecutiveScenarioImmersionSignal } from "./executiveScenarioImmersionTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logExecutiveScenarioImmersionDev } from "./scenarioImmersionDevLog.ts";

export type ExecutiveScenarioImmersionGuardCode =
  | "empty_immersion_context"
  | "too_many_immersion_signals"
  | "invalid_immersion_strength"
  | "invalid_immersion_region"
  | "duplicate_immersion_build"
  | "unsupported_immersion_claim"
  | "manipulative_emotional_immersion"
  | "addictive_scenario_system"
  | "fabricated_operational_future"
  | "runaway_immersion_orchestration"
  | "corrupted_immersion_state";

export type ExecutiveScenarioImmersionGuardResult =
  | { ok: true }
  | { ok: false; code: ExecutiveScenarioImmersionGuardCode; message: string };

export const DEFAULT_MAX_IMMERSION_SIGNALS = 96;
export const IMMERSION_AMBIGUITY_DISCLAIMER =
  "Executive scenario immersion reflects evidence-grounded strategic exploration under current conditions and is indicative, not definitive.";
export const NON_MANIPULATION_IMMERSION_DISCLAIMER =
  "Nexora supports evidence-grounded scenario exploration without hidden steering; immersive cognition remains fully under executive authority.";

const PROHIBITED_IMMERSION_TEXT = [
  "psychological manipulation",
  "psychological conditioning",
  "emotional persuasion",
  "emotional immersion",
  "manipulative emotional",
  "gaming simulation",
  "virtual reality entertainment",
  "addictive scenario",
  "addictive immersive",
  "addictive ux",
  "fabricated operational future",
  "fabricate operational",
  "hidden executive steering",
  "force attention",
  "forced attention",
  "manipulative",
  "override executive",
  "override judgment",
] as const;

function containsProhibitedImmersionText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_IMMERSION_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(
  code: ExecutiveScenarioImmersionGuardCode,
  message: string
): ExecutiveScenarioImmersionGuardResult {
  const result = { ok: false as const, code, message };
  logExecutiveScenarioImmersionDev("ImmersionGuard", { code, message });
  return result;
}

export function buildImmersionContentFingerprint(input: {
  topologyFingerprint: string;
  timelineFingerprint?: string;
  narrativeFingerprint?: string;
  insightPrioritizationFingerprint?: string;
  foresightFingerprint?: string;
  cognitiveLoadFingerprint?: string;
  orchestrationFingerprint?: string;
  governanceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    timeline: input.timelineFingerprint ?? null,
    narrative: input.narrativeFingerprint ?? null,
    insightPrioritization: input.insightPrioritizationFingerprint ?? null,
    foresight: input.foresightFingerprint ?? null,
    cognitiveLoad: input.cognitiveLoadFingerprint ?? null,
    orchestration: input.orchestrationFingerprint ?? null,
    governance: input.governanceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateExecutiveScenarioImmersion(input: {
  topologyId: string;
  regionIds: readonly string[];
  immersionSignals: readonly ExecutiveScenarioImmersionSignal[];
  priorImmersionFingerprints?: readonly string[];
  pendingFingerprint?: string;
  immersionClarityScore?: number;
  immersionOverloadScore?: number;
}): ExecutiveScenarioImmersionGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_immersion_context",
      "Topology context is required to evaluate executive scenario immersion"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.immersionSignals.length > DEFAULT_MAX_IMMERSION_SIGNALS) {
    return reject(
      "too_many_immersion_signals",
      `Immersion signal count ${input.immersionSignals.length} exceeds max ${DEFAULT_MAX_IMMERSION_SIGNALS}`
    );
  }

  if ((input.immersionClarityScore ?? 0) > 0.95) {
    return reject(
      "runaway_immersion_orchestration",
      "Immersion clarity score implies uncontrolled immersion orchestration"
    );
  }

  if ((input.immersionOverloadScore ?? 0) > 0.95) {
    return reject(
      "runaway_immersion_orchestration",
      "Immersion overload score implies uncontrolled immersion orchestration"
    );
  }

  for (const signal of input.immersionSignals) {
    if (
      !Number.isFinite(signal.immersionStrength) ||
      signal.immersionStrength < 0 ||
      signal.immersionStrength > 0.92
    ) {
      return reject(
        "invalid_immersion_strength",
        `Immersion strength ${signal.immersionStrength} for ${signal.immersionId} is out of allowed range`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_immersion_region",
          `Immersion region ${regionId} is not in topology for ${signal.immersionId}`
        );
      }
    }
  }

  if (input.priorImmersionFingerprints?.includes(input.pendingFingerprint ?? "")) {
    return reject(
      "duplicate_immersion_build",
      "Duplicate executive scenario immersion build fingerprint detected"
    );
  }

  return { ok: true };
}

export function guardExecutiveScenarioImmersionSemantics(input: {
  headline: string;
  summary: string;
}): ExecutiveScenarioImmersionGuardResult {
  const combined = `${input.headline} ${input.summary}`;
  if (containsFalseCertaintyText(combined)) {
    return reject(
      "unsupported_immersion_claim",
      "Immersion semantics contain unsupported certainty language"
    );
  }
  if (containsProhibitedImmersionText(combined)) {
    return reject(
      "manipulative_emotional_immersion",
      "Immersion semantics imply manipulative emotional immersion or conditioning"
    );
  }
  if (combined.toLowerCase().includes("addictive scenario")) {
    return reject("addictive_scenario_system", "Immersion semantics imply addictive scenario systems");
  }
  if (combined.toLowerCase().includes("fabricated operational future")) {
    return reject(
      "fabricated_operational_future",
      "Immersion semantics imply fabricated operational futures"
    );
  }
  return { ok: true };
}
