import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginCognitiveUncertaintyEvaluation,
  cautionPostureRank,
  clampUncertaintyConfidence,
  COGNITIVE_UNCERTAINTY_MIN_DRIFT_DEPTH,
  COGNITIVE_UNCERTAINTY_MIN_UNIFIED_LAYERS,
  endCognitiveUncertaintyEvaluation,
  shouldEvaluateCognitiveUncertainty,
  shouldRetainStrategicAmbiguityObservation,
  uncertaintySeverityRank,
} from "./cognitiveUncertaintyGuards";
import { getCognitiveUncertaintyStore } from "./cognitiveUncertaintyStore";
import type {
  AmbiguityCategory,
  CautionPosture,
  EnterpriseAmbiguitySignal,
  ExecutiveCognitiveUncertaintyInput,
  ExecutiveCognitiveUncertaintyResult,
  ExecutiveCognitiveUncertaintySnapshot,
  IncompleteInformationIndicator,
  StrategicAmbiguityObservation,
  UncertaintyAwarenessSummary,
  UncertaintySeverity,
  UncertaintyTopologyField,
  UnknownZoneObservation,
} from "./cognitiveUncertaintyTypes";

const DEV_LOG_PREFIX = "[Nexora][CognitiveUncertainty]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildAmbiguityId(label: string): string {
  return stableSignature(["cognitive-uncertainty", label]).slice(0, 56);
}

function createAmbiguityObservation(
  label: string,
  cautionPosture: CautionPosture,
  uncertaintySeverity: UncertaintySeverity,
  ambiguityCategory: AmbiguityCategory,
  summary: string,
  knownSignals: string[],
  unknownZones: string[],
  cautionRisks: string[],
  confidence: number,
  now: number
): StrategicAmbiguityObservation {
  return {
    ambiguityId: buildAmbiguityId(label),
    cautionPosture,
    uncertaintySeverity,
    ambiguityCategory,
    summary,
    knownSignals: Object.freeze(knownSignals),
    unknownZones: Object.freeze(unknownZones),
    cautionRisks: Object.freeze(cautionRisks),
    confidence: clampUncertaintyConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: ExecutiveCognitiveUncertaintyInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && input.temporalSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasVisibilityGap(input: ExecutiveCognitiveUncertaintyInput): boolean {
  const integritySignals = input.reasoningIntegritySnapshot?.recentTrustObservations.flatMap(
    (o) => [...o.consistencySignals, ...o.integrityRisks]
  );
  const metaRisks = input.metaCognitionSnapshot?.recentIntegrityObservations.flatMap(
    (o) => [...o.qualitySignals, ...o.risks]
  );
  const combined = [...(integritySignals ?? []), ...(metaRisks ?? [])];
  return combined.some(
    (s) =>
      s.includes("partial_operational_visibility") ||
      s.includes("partial_coordination_visibility") ||
      s.includes("subsystem_visibility")
  );
}

function buildEscalationWithIncompleteVisibility(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  const escalationRisk =
    input.foresightSnapshot?.summary.dominantRisk.includes("escalation") ||
    input.foresightSnapshot?.summary.earlyWarningState === "intensifying" ||
    input.foresightSnapshot?.summary.earlyWarningState === "spreading";
  const visibilityGap = hasVisibilityGap(input);
  const coordinationUncertain =
    input.confidenceSnapshot?.coordinationSummary.certaintyPosture === "low" ||
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "uncertain";

  if (!escalationRisk || (!visibilityGap && !coordinationUncertain)) return null;

  return createAmbiguityObservation(
    "escalation_visibility_moderation",
    "moderated",
    "elevated",
    "operational_visibility_gap",
    "Escalation risk appears elevated, BUT operational visibility in coordination systems is incomplete, therefore confidence should remain moderated.",
    ["escalation_risk_signal", "foresight_early_warning"],
    ["coordination_system_visibility", "operational_state_completeness"],
    ["premature_confidence_risk", "incomplete_situational_awareness"],
    0.84,
    now
  );
}

function buildOperationalVisibilityGap(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  if (!hasVisibilityGap(input)) return null;

  return createAmbiguityObservation(
    "operational_visibility_gap",
    "cautious",
    "material",
    "operational_visibility_gap",
    "Enterprise operational visibility remains partial across coordination and subsystem pathways — strategic outputs should be interpreted with caution.",
    ["integrity_verification_active", "meta_cognition_monitoring"],
    ["full_operational_topology", "cross_team_coordination_state"],
    ["visibility_blind_spot", "recommendation_caution"],
    0.8,
    now
  );
}

function buildCoordinationIncompleteness(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  const coordinationUncertain =
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "uncertain" ||
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "fragmented";
  const lowCertainty = input.confidenceSnapshot?.coordinationSummary.certaintyPosture === "low";

  if (!coordinationUncertain && !lowCertainty) return null;

  return createAmbiguityObservation(
    "coordination_incompleteness",
    "moderated",
    "elevated",
    "coordination_incompleteness",
    "Coordination intelligence signals remain incomplete — multi-team alignment state may not be fully observable.",
    ["confidence_arbitration_active"],
    ["coordination_topology_completeness", "dependency_visibility"],
    ["coordination_ambiguity", "alignment_uncertainty"],
    0.76,
    now
  );
}

function buildConfidenceWithoutEvidence(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  const mismatch = input.reasoningIntegritySnapshot?.recentTrustObservations.some((o) =>
    o.integrityRisks.includes("confidence_evidence_mismatch")
  );
  const metaWarns = input.metaCognitionSnapshot?.metaCognitiveRisks.some((r) =>
    r.riskLabel.includes("overconfidence")
  );
  const weakEvidence =
    input.governanceSnapshot?.integrityLevel === "weak" ||
    input.governanceSnapshot?.integrityLevel === "moderate";

  if (!mismatch && !(metaWarns && weakEvidence)) return null;

  return createAmbiguityObservation(
    "confidence_without_evidence",
    "restricted",
    "material",
    "confidence_without_evidence",
    "Confidence signals are elevated while underlying evidence remains sparse — recommendations should be treated cautiously until evidentiary support strengthens.",
    ["confidence_arbitration_active", "governance_evidence_review"],
    ["institutional_evidence_depth", "cross_runtime_validation"],
    ["overconfidence_risk", "trust_without_evidence"],
    0.71,
    now
  );
}

function buildEvidenceSparsity(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  const sparseGovernance =
    input.governanceSnapshot?.integrityLevel === "weak" ||
    input.governanceSnapshot?.governanceStatus === "degraded";
  const sparseMemory =
    input.memorySnapshot?.institutionalHealth === "weak" ||
    input.memorySnapshot?.institutionalHealth === "moderate";

  if (!sparseGovernance && !sparseMemory) return null;

  return createAmbiguityObservation(
    "evidence_sparsity",
    "cautious",
    "elevated",
    "evidence_sparsity",
    "Institutional and governance evidence remains limited — enterprise conclusions may rest on incomplete information substrates.",
    sparseGovernance ? ["governance_monitoring"] : ["institutional_memory_active"],
    ["verified_institutional_evidence", "governance_validation_depth"],
    ["sparse_evidence_risk", "interpretation_caution"],
    0.73,
    now
  );
}

function buildForesightLimitation(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  const foresightActive =
    input.foresightSnapshot?.summary.earlyWarningState === "intensifying" ||
    input.foresightSnapshot?.summary.earlyWarningState === "spreading";
  const certaintyLimited =
    input.confidenceSnapshot?.coordinationSummary.certaintyPosture === "low" ||
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "uncertain" ||
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "fragmented";

  if (!foresightActive || !certaintyLimited) return null;

  return createAmbiguityObservation(
    "foresight_limitation",
    "moderated",
    "elevated",
    "foresight_limitation",
    "Foresight signals suggest emerging strategic pressure, but certainty remains bounded — anticipatory conclusions should not be treated as fully known.",
    ["foresight_early_warning"],
    ["full_escalation_topology", "downstream_impact_visibility"],
    ["anticipatory_uncertainty", "bounded_foresight_confidence"],
    0.77,
    now
  );
}

function buildTemporalGap(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  const temporalGap =
    input.temporalSnapshot?.runtimeStatus === "degraded" ||
    input.temporalSnapshot?.runtimeStatus === "unstable" ||
    input.temporalSnapshot?.runtimeStatus === "initializing";

  if (!temporalGap) return null;

  return createAmbiguityObservation(
    "temporal_gap",
    "cautious",
    "elevated",
    "temporal_gap",
    "Temporal cognition coverage is incomplete or degraded — time-based strategic continuity may not be fully observable.",
    ["temporal_cognition_active"],
    ["long_horizon_temporal_continuity", "pressure_timeline_completeness"],
    ["temporal_blind_spot", "timeline_uncertainty"],
    0.74,
    now
  );
}

function buildGovernanceUnknown(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  const coherenceUnknown =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "low" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate";
  const governanceUnknown =
    input.governanceSnapshot?.governanceStatus === "monitored" ||
    input.governanceSnapshot?.governanceStatus === "degraded" ||
    input.governanceSnapshot?.governanceStatus === "unstable";

  if (!coherenceUnknown && !governanceUnknown) return null;

  return createAmbiguityObservation(
    "governance_unknown",
    "moderated",
    "monitored",
    "governance_unknown",
    "Governance alignment state remains partially unknown — institutional policy coherence may require additional validation before high-confidence action.",
    ["governance_coherence_monitoring"],
    ["verified_policy_alignment", "institutional_governance_continuity"],
    ["governance_ambiguity"],
    0.72,
    now
  );
}

function buildUnknownZoneCognition(
  input: ExecutiveCognitiveUncertaintyInput,
  now: number
): StrategicAmbiguityObservation | null {
  const fragmentedConfidence =
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "fragmented";
  const uncertainMeta =
    input.metaCognitionSnapshot?.awarenessSummary.dominantIntegrityState === "uncertain" ||
    input.metaCognitionSnapshot?.awarenessSummary.dominantIntegrityState === "fragmented";
  const degradedLayers = [
    input.foresightSnapshot?.runtimeStatus,
    input.temporalSnapshot?.runtimeStatus,
    input.decisionSnapshot?.runtimeStatus,
  ].filter((s) => s === "degraded" || s === "unstable").length;

  if (!fragmentedConfidence && !(uncertainMeta && degradedLayers >= 2)) return null;

  return createAmbiguityObservation(
    "unknown_zone_cognition",
    "unknown_zone",
    "critical",
    "subsystem_blind_spot",
    "Multiple cognition subsystems operate inside an unknown zone — Nexora may not fully know this situation and should communicate bounded confidence explicitly.",
    ["subsystem_visibility", "meta_cognition_reflection"],
    ["cross_runtime_state_completeness", "enterprise_situational_certainty"],
    ["unknown_zone_active", "executive_caution_required", "bounded_confidence_communication"],
    0.66,
    now
  );
}

function buildBoundedEpistemicAwareness(
  input: ExecutiveCognitiveUncertaintyInput,
  observations: StrategicAmbiguityObservation[],
  now: number
): StrategicAmbiguityObservation | null {
  const moderated = observations.filter((o) => o.cautionPosture !== "none").length;
  const driftStable =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "stable" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "adaptive";

  if (moderated < 2 || !driftStable) return null;

  return createAmbiguityObservation(
    "bounded_epistemic_awareness",
    "moderated",
    "monitored",
    "unknown",
    "Enterprise cognition remains strategically stable while explicit uncertainty zones persist — Nexora understands where it may not fully know the situation and recommends moderated confidence.",
    ["cognitive_drift_stable", "uncertainty_topology_mapped"],
    ["residual_unknown_zones"],
    [],
    0.86,
    now
  );
}

function buildAmbiguitySignal(
  observation: StrategicAmbiguityObservation,
  now: number
): EnterpriseAmbiguitySignal {
  return {
    signalId: stableSignature(["ambiguity-signal", observation.ambiguityId]).slice(0, 48),
    signalLabel: observation.ambiguityCategory.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.ambiguityCategory]),
    signalIntensity:
      observation.uncertaintySeverity === "critical" || observation.uncertaintySeverity === "material"
        ? "high"
        : observation.uncertaintySeverity === "elevated"
          ? "moderate"
          : "low",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildTopologyField(
  observation: StrategicAmbiguityObservation,
  now: number
): UncertaintyTopologyField | null {
  if (
    observation.uncertaintySeverity !== "elevated" &&
    observation.uncertaintySeverity !== "material" &&
    observation.uncertaintySeverity !== "critical"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["uncertainty-topology", observation.ambiguityId]).slice(0, 48),
    fieldLabel: observation.ambiguityCategory.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    topologyConcentration:
      observation.uncertaintySeverity === "critical"
        ? "critical"
        : observation.uncertaintySeverity === "material"
          ? "elevated"
          : "moderate",
    linkedCategories: Object.freeze([observation.ambiguityCategory]),
    generatedAt: now,
  };
}

function buildIncompleteIndicator(
  observation: StrategicAmbiguityObservation,
  now: number
): IncompleteInformationIndicator | null {
  if (observation.unknownZones.length < 1) return null;
  return {
    indicatorId: stableSignature(["incomplete-info", observation.ambiguityId]).slice(0, 48),
    indicatorLabel: observation.unknownZones[0] ?? "information_gap",
    indicatorSummary: observation.summary.slice(0, 100),
    informationGap:
      observation.uncertaintySeverity === "critical"
        ? "severe"
        : observation.uncertaintySeverity === "material"
          ? "substantial"
          : "partial",
    linkedCategories: Object.freeze([observation.ambiguityCategory]),
    generatedAt: now,
  };
}

function buildUnknownZone(
  observation: StrategicAmbiguityObservation,
  now: number
): UnknownZoneObservation | null {
  if (observation.cautionPosture !== "unknown_zone" && observation.unknownZones.length < 2) {
    return null;
  }
  return {
    zoneId: stableSignature(["unknown-zone", observation.ambiguityId]).slice(0, 48),
    zoneLabel: observation.unknownZones[0] ?? "unknown_zone",
    zoneSummary: observation.summary.slice(0, 100),
    zoneScope:
      observation.ambiguityCategory === "subsystem_blind_spot" ? "cross_runtime" : "subsystem",
    generatedAt: now,
  };
}

function buildUncertaintySnapshot(
  organizationId: string,
  observations: StrategicAmbiguityObservation[],
  signals: EnterpriseAmbiguitySignal[],
  topology: UncertaintyTopologyField[],
  incomplete: IncompleteInformationIndicator[],
  unknownZones: UnknownZoneObservation[],
  now: number
): ExecutiveCognitiveUncertaintySnapshot {
  const top = observations[0];
  const awarenessSummary: UncertaintyAwarenessSummary = top
    ? {
        dominantCautionPosture: top.cautionPosture,
        dominantUncertaintySeverity: top.uncertaintySeverity,
        uncertaintyHeadline: top.summary,
        epistemicPosture:
          top.cautionPosture === "unknown_zone" ||
          top.cautionPosture === "restricted" ||
          top.uncertaintySeverity === "critical"
            ? "low"
            : top.cautionPosture === "moderated"
              ? "moderate"
              : top.cautionPosture === "none"
                ? "high"
                : "moderate",
      }
    : {
        dominantCautionPosture: "moderated",
        dominantUncertaintySeverity: "monitored",
        uncertaintyHeadline:
          "Cognitive uncertainty awareness awaiting sufficient drift and integrity depth.",
        epistemicPosture: "low",
      };

  const signature = stableSignature([
    "d9-6-4-cognitive-uncertainty-snapshot",
    organizationId,
    observations.map((o) => o.ambiguityId),
    awarenessSummary.epistemicPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    ambiguityCount: observations.length,
    awarenessSummary,
    recentAmbiguityObservations: Object.freeze(observations.slice(0, 6)),
    ambiguitySignals: Object.freeze(signals.slice(0, 6)),
    uncertaintyTopologyFields: Object.freeze(topology.slice(0, 6)),
    incompleteInformationIndicators: Object.freeze(incomplete.slice(0, 6)),
    unknownZoneObservations: Object.freeze(unknownZones.slice(0, 6)),
  };
}

export function evaluateExecutiveCognitiveUncertainty(
  input: ExecutiveCognitiveUncertaintyInput
): ExecutiveCognitiveUncertaintyResult {
  if (!beginCognitiveUncertaintyEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newAmbiguityObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getCognitiveUncertaintyStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-4-cognitive-uncertainty-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
      input.metaCognitionSnapshot?.signature ?? "no-meta-cognition",
      input.reasoningIntegritySnapshot?.signature ?? "no-reasoning-integrity",
      input.cognitiveDriftSnapshot?.signature ?? "no-cognitive-drift",
      input.confidenceSnapshot?.signature ?? "no-confidence",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
      input.sequencingSnapshot?.signature ?? "no-sequencing",
    ]);

    if (
      !shouldEvaluateCognitiveUncertainty(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        snapshot: prior.snapshots[0] ?? null,
        newAmbiguityObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const driftDepth = input.cognitiveDriftSnapshot?.stabilityCount ?? 0;

    if (activeLayers < COGNITIVE_UNCERTAINTY_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_uncertainty_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newAmbiguityObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (driftDepth < COGNITIVE_UNCERTAINTY_MIN_DRIFT_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_cognitive_drift_depth",
        snapshot: prior.snapshots[0] ?? null,
        newAmbiguityObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: StrategicAmbiguityObservation[] = [];

    const escalationModeration = buildEscalationWithIncompleteVisibility(input, now);
    if (escalationModeration) candidates.push(escalationModeration);

    const visibilityGap = buildOperationalVisibilityGap(input, now);
    if (visibilityGap) candidates.push(visibilityGap);

    const coordinationGap = buildCoordinationIncompleteness(input, now);
    if (coordinationGap) candidates.push(coordinationGap);

    const confidenceGap = buildConfidenceWithoutEvidence(input, now);
    if (confidenceGap) candidates.push(confidenceGap);

    const evidenceSparse = buildEvidenceSparsity(input, now);
    if (evidenceSparse) candidates.push(evidenceSparse);

    const foresightLimit = buildForesightLimitation(input, now);
    if (foresightLimit) candidates.push(foresightLimit);

    const temporalGap = buildTemporalGap(input, now);
    if (temporalGap) candidates.push(temporalGap);

    const governanceUnknown = buildGovernanceUnknown(input, now);
    if (governanceUnknown) candidates.push(governanceUnknown);

    const unknownZone = buildUnknownZoneCognition(input, now);
    if (unknownZone) candidates.push(unknownZone);

    const boundedAwareness = buildBoundedEpistemicAwareness(input, candidates, now);
    if (boundedAwareness) candidates.push(boundedAwareness);

    const retained = candidates
      .filter(shouldRetainStrategicAmbiguityObservation)
      .sort(
        (a, b) =>
          cautionPostureRank(a.cautionPosture) - cautionPostureRank(b.cautionPosture) ||
          uncertaintySeverityRank(b.uncertaintySeverity) -
            uncertaintySeverityRank(a.uncertaintySeverity) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_ambiguity_observations",
        snapshot: prior.snapshots[0] ?? null,
        newAmbiguityObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.ambiguityObservations.map((o) => o.ambiguityId));
    const newCount = retained.filter((o) => !priorIds.has(o.ambiguityId)).length;

    const signals = retained.map((o) => buildAmbiguitySignal(o, now));
    const topology = retained
      .map((o) => buildTopologyField(o, now))
      .filter((f): f is UncertaintyTopologyField => f !== null);
    const incomplete = retained
      .map((o) => buildIncompleteIndicator(o, now))
      .filter((i): i is IncompleteInformationIndicator => i !== null);
    const unknownZones = retained
      .map((o) => buildUnknownZone(o, now))
      .filter((z): z is UnknownZoneObservation => z !== null);

    store.upsertAmbiguityObservations(retained, now);
    store.upsertAmbiguitySignals(signals, now);
    store.upsertUncertaintyTopologyFields(topology, now);
    store.upsertIncompleteInformationIndicators(incomplete, now);
    store.upsertUnknownZoneObservations(unknownZones, now);

    const snapshot = buildUncertaintySnapshot(
      organizationId,
      retained,
      signals,
      topology,
      incomplete,
      unknownZones,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastCautionPosture(snapshot.awarenessSummary.dominantCautionPosture);

    const finalState = store.getState();
    const priorCaution = prior.lastCautionPosture;

    if (unknownZone || escalationModeration) {
      devLog("major uncertainty emergence — epistemic caution intelligence active");
    }

    if (visibilityGap || coordinationGap) {
      devLog("incomplete-information awareness — operational visibility gaps mapped");
    }

    if (boundedAwareness) {
      devLog("bounded epistemic awareness — moderated confidence posture formed");
    }

    if (
      priorCaution &&
      priorCaution !== snapshot.awarenessSummary.dominantCautionPosture &&
      (snapshot.awarenessSummary.dominantCautionPosture === "unknown_zone" ||
        snapshot.awarenessSummary.dominantCautionPosture === "moderated")
    ) {
      devLog(
        `caution posture shift — ${priorCaution} → ${snapshot.awarenessSummary.dominantCautionPosture}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newAmbiguityObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endCognitiveUncertaintyEvaluation();
  }
}
