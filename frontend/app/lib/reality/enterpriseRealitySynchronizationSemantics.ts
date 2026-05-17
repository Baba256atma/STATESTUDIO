/**
 * D7:7:2 — Executive-readable enterprise reality synchronization semantics.
 */

import type {
  EnterpriseRealitySynchronizationSemantics,
  EnterpriseRealitySynchronizationIntelligenceState,
} from "./enterpriseRealitySynchronizationTypes.ts";
import {
  SYNCHRONIZATION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_SYNCHRONIZATION_DISCLAIMER,
} from "./enterpriseRealitySynchronizationGuards.ts";

export function buildEnterpriseRealitySynchronizationSemantics(input: {
  state: EnterpriseRealitySynchronizationIntelligenceState;
}): EnterpriseRealitySynchronizationSemantics {
  const governanceDrift = input.state.operationalDriftRecords.find((r) =>
    r.recordId.includes("governance-alignment")
  );
  const crossDomainDrift = input.state.operationalDriftRecords.find((r) =>
    r.recordId.includes("cross-domain")
  );
  const recoverySync = input.state.crossDomainSynchronizationRecords.find((r) =>
    r.recordId.includes("recovery-logistics")
  );

  const headline =
    input.state.executiveSynchronizationLabel === "aligned" ||
    input.state.executiveSynchronizationLabel === "stable"
      ? "Enterprise operational synchronization remains stable across logistics and manufacturing recovery systems, although governance fragmentation within financial coordination pathways is beginning to introduce moderate operational drift."
      : input.state.executiveSynchronizationLabel === "drifting"
        ? crossDomainDrift
          ? crossDomainDrift.explanation
          : governanceDrift
            ? governanceDrift.explanation
            : "Enterprise operational synchronization may require consolidation when domains diverge across the enterprise."
        : input.state.executiveSynchronizationLabel === "fragmented" ||
            input.state.executiveSynchronizationLabel === "critical"
          ? governanceDrift
            ? governanceDrift.explanation
            : "Strategic synchronization instability may elevate when operational drift persists across enterprise domains."
          : recoverySync
            ? recoverySync.explanation
            : "Enterprise operational synchronization remains under active assessment across interconnected systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveSynchronizationLabel === "aligned") {
    summaryParts.push(
      "Aligned synchronization may indicate cross-domain operational coherence with strong strategic continuity."
    );
  } else if (input.state.executiveSynchronizationLabel === "stable") {
    summaryParts.push(
      "Stable synchronization may reflect consistent enterprise-state alignment across operational layers."
    );
  } else if (input.state.executiveSynchronizationLabel === "drifting") {
    summaryParts.push(
      "Drifting synchronization may suggest moderate operational divergence between interconnected enterprise domains."
    );
  } else if (input.state.executiveSynchronizationLabel === "fragmented") {
    summaryParts.push(
      "Fragmented synchronization may weaken enterprise continuity when operational states diverge materially."
    );
  } else {
    summaryParts.push(
      "Critical synchronization conditions may elevate strategic risk until operational alignment stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative synchronization coherence is ${(input.state.synchronizationCoherenceScore * 100).toFixed(0)}% with cross-domain sync at ${(input.state.crossDomainSyncScore * 100).toFixed(0)}% and drift at ${(input.state.operationalDriftScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.synchronizationAmbiguityDisclaimer || SYNCHRONIZATION_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousSynchronizationDisclaimer ||
      NON_AUTONOMOUS_SYNCHRONIZATION_DISCLAIMER
  );

  const synchronizationSummaries = input.state.activeSynchronizationSignals.map((s) => {
    const drivers = (s.dominantSynchronizationDrivers ?? []).join(", ") || "sync_drivers";
    return `${s.synchronizationId}: ${s.synchronizationState} (${drivers}, strength ${(s.synchronizationStrength * 100).toFixed(0)}%).`;
  });

  const alignmentSummaries = input.state.crossDomainSynchronizationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const driftSummaries = input.state.operationalDriftRecords.slice(0, 4).map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.synchronizedOperationalZones.length > 0) {
    bullets.push(
      `Synchronized operational zones: ${input.state.synchronizedOperationalZones.join(", ")}.`
    );
  }
  if (input.state.operationalDriftZones.length > 0) {
    bullets.push(`Operational drift zones: ${input.state.operationalDriftZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora models enterprise operational synchronization; strategic decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    synchronizationSummaries: Object.freeze(synchronizationSummaries),
    alignmentSummaries: Object.freeze(alignmentSummaries),
    driftSummaries: Object.freeze(driftSummaries),
    bullets: Object.freeze(bullets),
  });
}
