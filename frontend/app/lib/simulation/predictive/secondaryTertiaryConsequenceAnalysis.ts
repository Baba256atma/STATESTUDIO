/**
 * D7:4:4 — Secondary and tertiary consequence analysis.
 */

import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type {
  PredictiveCascadeSignal,
  SecondaryTertiaryConsequenceRecord,
} from "./cascadingConsequenceTypes.ts";
import { logCascadeDev } from "./cascadeDevLog.ts";

export function analyzeSecondaryTertiaryConsequences(input: {
  signals: readonly PredictiveCascadeSignal[];
  trustState?: OrganizationalTrustState;
  coordinationState?: ExecutiveCoordinationState;
  divergenceState: MultiFutureDivergenceState;
}): readonly SecondaryTertiaryConsequenceRecord[] {
  const records: SecondaryTertiaryConsequenceRecord[] = [];

  for (const signal of input.signals) {
    if (signal.hopDepth < 2) continue;
    const tier: SecondaryTertiaryConsequenceRecord["consequenceTier"] =
      signal.hopDepth === 2 ? "secondary" : "tertiary";

    records.push(
      Object.freeze({
        recordId: `consequence::${signal.signalId}`,
        originRegionId: signal.originatingRegionIds[0] ?? "manufacturing",
        consequenceRegionId: signal.affectedRegionIds[0] ?? "logistics",
        consequenceTier: tier,
        consequenceStrength: Number(signal.propagationIntensity.toFixed(4)),
        explanation:
          tier === "secondary"
            ? `An indirect ${tier} consequence may emerge as instability propagates from ${signal.originatingRegionIds[0]} to ${signal.affectedRegionIds[0]}.`
            : `A delayed ${tier} systemic effect may develop through extended propagation chains across operational domains.`,
        contributingSignalIds: Object.freeze([signal.signalId]),
      })
    );
  }

  const trustStrained =
    input.trustState &&
    (input.trustState.trustStabilityLabel === "degrading" ||
      input.trustState.trustStabilityLabel === "critical");
  const coordinationWeak =
    (input.coordinationState?.organizationalSynchronizationScore ?? 1) < 0.45;

  if (trustStrained && coordinationWeak) {
    records.push(
      Object.freeze({
        recordId: "consequence::trust-coordination-chain",
        originRegionId: "manufacturing",
        consequenceRegionId: "logistics",
        consequenceTier: "tertiary",
        consequenceStrength: Number(
          Math.min(
            1,
            (input.trustState?.trustDegradationScore ?? 0.5) * 0.5 +
              input.divergenceState.futureFragmentationScore * 0.3
          ).toFixed(4)
        ),
        explanation:
          "Minor trust instability may cascade through coordination degradation into operational slowdown and future divergence escalation.",
        contributingSignalIds: Object.freeze(
          input.signals
            .filter((s) => s.hopDepth >= 2)
            .map((s) => s.signalId)
            .slice(0, 6)
        ),
      })
    );
  }

  const amplifying = input.signals.filter((s) => s.cascadeState === "amplifying");
  if (amplifying.length >= 2) {
    records.push(
      Object.freeze({
        recordId: "consequence::amplification-escalation",
        originRegionId: amplifying[0]?.originatingRegionIds[0] ?? "logistics",
        consequenceRegionId: amplifying[0]?.affectedRegionIds[0] ?? "finance",
        consequenceTier: "tertiary",
        consequenceStrength: Number(
          (
            amplifying.reduce((s, sig) => s + sig.propagationIntensity, 0) /
            amplifying.length
          ).toFixed(4)
        ),
        explanation:
          "Amplification escalation patterns may produce hidden future propagation chains across interconnected systems.",
        contributingSignalIds: Object.freeze(amplifying.map((s) => s.signalId)),
      })
    );
  }

  logCascadeDev("ChainReaction", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
