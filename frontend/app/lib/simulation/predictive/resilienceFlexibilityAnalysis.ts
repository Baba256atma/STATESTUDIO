/**
 * D7:4:7 — Resilience-flexibility analysis.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  ResilienceFlexibilityRecord,
  StrategicAdaptationSignal,
} from "./strategicAdaptationTypes.ts";
import { logAdaptationDev } from "./adaptationDevLog.ts";

export function analyzeResilienceFlexibility(input: {
  topology: OperationalUniverseTopology;
  signals: readonly StrategicAdaptationSignal[];
}): readonly ResilienceFlexibilityRecord[] {
  const records: ResilienceFlexibilityRecord[] = [];

  const crossDomainSignal = input.signals.find((s) =>
    s.signalId.includes("cross-domain-flexibility")
  );
  if (crossDomainSignal) {
    records.push(
      Object.freeze({
        recordId: "flexibility::cross-domain",
        regionId: "logistics",
        flexibilityType: "coordination_flexibility",
        flexibilityStrength: Number(crossDomainSignal.adaptationStrength.toFixed(4)),
        explanation:
          "Cross-domain coordination improvement may unlock large-scale recovery adaptation potential across logistics and manufacturing.",
        contributingSignalIds: Object.freeze([crossDomainSignal.signalId]),
      })
    );
  }

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const flexible = regionSignals.filter(
      (s) => s.adaptationState === "flexible" || s.adaptationState === "adaptive"
    );
    const rigid = regionSignals.filter(
      (s) => s.adaptationState === "strained" || s.adaptationState === "critical"
    );
    if (flexible.length === 0 && rigid.length === 0) continue;

    const flexibilityType: ResilienceFlexibilityRecord["flexibilityType"] =
      rigid.length > flexible.length ? "operational_flexibility" : "recovery_adaptation";

    const strength = Number(
      Math.min(
        1,
        flexible.reduce((s, sig) => s + sig.adaptationStrength, 0) /
          Math.max(1, flexible.length) || 0
      ).toFixed(4)
    );

    let explanation = "";
    if (rigid.length > flexible.length) {
      explanation = `Rigid operational structures in ${region.label} may constrain strategic flexibility under sustained pressure.`;
    } else {
      explanation = `Strategic flexibility opportunities in ${region.label} may support resilience-driven adaptation.`;
    }

    records.push(
      Object.freeze({
        recordId: `flexibility::${region.regionId}`,
        regionId: region.regionId,
        flexibilityType,
        flexibilityStrength: strength,
        explanation,
        contributingSignalIds: Object.freeze(regionSignals.map((s) => s.signalId)),
      })
    );
  }

  const leadershipSignal = input.signals.find((s) =>
    s.signalId.includes("leadership-recovery")
  );
  if (leadershipSignal) {
    records.push(
      Object.freeze({
        recordId: "flexibility::leadership-adaptive",
        regionId: leadershipSignal.affectedRegionIds[0] ?? "logistics",
        flexibilityType: "resilience_restructuring",
        flexibilityStrength: Number(leadershipSignal.adaptationStrength.toFixed(4)),
        explanation:
          "Leadership-driven coordination may enable resilience restructuring and adaptive recovery acceleration.",
        contributingSignalIds: Object.freeze([leadershipSignal.signalId]),
      })
    );
  }

  logAdaptationDev("StrategicFlexibility", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
