import { stableSignature } from "../intelligence/shared/dedupe";
import type { PerspectiveCategory, StrategicConsensusRecord } from "./consensusIntelligenceTypes";
import {
  beginPerspectiveNegotiationEvaluation,
  clampNegotiationConfidence,
  endPerspectiveNegotiationEvaluation,
  negotiationStrengthRank,
  PERSPECTIVE_NEGOTIATION_MIN_CONSENSUS_DEPTH,
  PERSPECTIVE_NEGOTIATION_MIN_UNIFIED_LAYERS,
  resolutionStateRank,
  shouldEvaluatePerspectiveNegotiation,
  shouldRetainStrategicPerspectiveNegotiation,
} from "./perspectiveNegotiationGuards";
import { getPerspectiveNegotiationStore } from "./perspectiveNegotiationStore";
import type {
  CognitiveNegotiationSignal,
  EnterpriseConflictResolutionSnapshot,
  ExecutiveTradeoffResolution,
  NegotiationCategory,
  NegotiationIntelligenceSummary,
  NegotiationStrength,
  PerspectiveReconciliationField,
  ResolutionState,
  StrategicPerspectiveNegotiation,
  StrategicPerspectiveNegotiationInput,
  StrategicPerspectiveNegotiationResult,
} from "./perspectiveNegotiationTypes";

const DEV_LOG_PREFIX = "[Nexora][PerspectiveNegotiation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildNegotiationId(label: string): string {
  return stableSignature(["perspective-negotiation", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: StrategicPerspectiveNegotiationInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function createNegotiation(
  label: string,
  resolutionState: ResolutionState,
  negotiationStrength: NegotiationStrength,
  negotiationCategory: NegotiationCategory,
  summary: string,
  alignedPerspectives: PerspectiveCategory[],
  contestedPerspectives: PerspectiveCategory[],
  negotiationSignals: string[],
  confidence: number,
  now: number
): StrategicPerspectiveNegotiation {
  return {
    negotiationId: buildNegotiationId(label),
    resolutionState,
    negotiationStrength,
    negotiationCategory,
    summary,
    alignedPerspectives: Object.freeze(alignedPerspectives),
    contestedPerspectives: Object.freeze(contestedPerspectives),
    negotiationSignals: Object.freeze(negotiationSignals),
    confidence: clampNegotiationConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function hasConsensusSignal(
  records: readonly StrategicConsensusRecord[],
  signal: string
): boolean {
  return records.some((r) => r.consensusSignals.includes(signal));
}

function hasDivergentPerspective(
  records: readonly StrategicConsensusRecord[],
  category: PerspectiveCategory
): boolean {
  return records.some((r) => r.divergentPerspectives.includes(category));
}

function buildGovernanceSpeedPartialReconciliation(
  consensus: StrategicPerspectiveNegotiationInput["strategicConsensusSnapshot"],
  now: number
): StrategicPerspectiveNegotiation | null {
  if (!consensus) return null;
  const records = consensus.recentConsensusRecords;
  const govResilience =
    hasConsensusSignal(records, "governance_resilience_alignment") ||
    records.some(
      (r) =>
        r.alignedPerspectives.includes("governance") &&
        r.alignedPerspectives.includes("resilience")
    );
  const speedConflict =
    hasDivergentPerspective(records, "operational_speed") ||
    hasConsensusSignal(records, "orchestration_disagreement");

  if (!govResilience || !speedConflict) return null;

  return createNegotiation(
    "enterprise_tradeoff_resolution_01",
    "partially_resolved",
    "strong",
    "governance_vs_speed",
    "Governance, resilience, and operational-speed perspectives remain partially reconciled through adaptive sequencing and controlled execution acceleration, though coordination pressure risks remain elevated.",
    ["governance", "resilience"],
    ["operational_speed"],
    ["adaptive_tradeoff_balance", "governance_resilience_alignment", "orchestration_disagreement"],
    0.89,
    now
  );
}

function buildStabilityAdaptabilityConvergence(
  input: StrategicPerspectiveNegotiationInput,
  consensus: StrategicPerspectiveNegotiationInput["strategicConsensusSnapshot"],
  now: number
): StrategicPerspectiveNegotiation | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const adaptation = reflective?.summary.adaptationState;
  const stabilizing =
    adaptation === "self_stabilized" ||
    adaptation === "stabilizing" ||
    reflective?.runtimeStatus === "stable";

  if (!stabilizing || !consensus) return null;

  const stabilityAligned = consensus.recentConsensusRecords.some((r) =>
    r.alignedPerspectives.includes("stability")
  );
  if (!stabilityAligned && consensus.awarenessSummary.dominantConsensusState !== "converging") {
    return null;
  }

  return createNegotiation(
    "stability_adaptability_convergence",
    "reconciled",
    "strong",
    "stability_vs_adaptability",
    "Stability and adaptability perspectives negotiate toward strong convergence — enterprise cognition balances stabilization discipline with adaptive recovery sequencing.",
    ["stability", "recovery", "governance"],
    [],
    ["stabilization_tradeoff_balance", "adaptive_recovery_alignment", "cross_runtime_alignment"],
    0.9,
    now
  );
}

function buildUnresolvedStrategicConflict(
  consensus: StrategicPerspectiveNegotiationInput["strategicConsensusSnapshot"],
  now: number
): StrategicPerspectiveNegotiation | null {
  if (!consensus) return null;
  const fragmented =
    consensus.awarenessSummary.dominantConsensusState === "fragmented" ||
    consensus.awarenessSummary.dominantConsensusState === "divergent";
  const multipleDivergent = consensus.recentConsensusRecords.filter(
    (r) => r.divergentPerspectives.length >= 2
  ).length;

  if (!fragmented && multipleDivergent < 1) return null;

  const contested = Array.from(
    new Set(
      consensus.recentConsensusRecords.flatMap((r) => r.divergentPerspectives)
    )
  ).slice(0, 4) as PerspectiveCategory[];

  if (contested.length < 2 && !fragmented) return null;

  return createNegotiation(
    "unresolved_strategic_conflict",
    "unresolved",
    "weak",
    "unknown",
    "Multiple strategic reasoning perspectives remain incompatible — enterprise negotiation pathways cannot yet converge without additional reconciliation signals.",
    [],
    contested.length > 0 ? contested : (["operational_speed", "stability"] as PerspectiveCategory[]),
    ["unresolved_strategic_conflict", "perspective_incompatibility", "negotiation_stalled"],
    0.62,
    now
  );
}

function buildInstitutionalMemoryCompromise(
  input: StrategicPerspectiveNegotiationInput,
  consensus: StrategicPerspectiveNegotiationInput["strategicConsensusSnapshot"],
  now: number
): StrategicPerspectiveNegotiation | null {
  const memoryStrong =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    (input.memorySnapshot?.summary.primaryStrategicLesson.trim().length ?? 0) > 0;
  if (!memoryStrong || !consensus) return null;

  const memorySupport =
    hasConsensusSignal(consensus.recentConsensusRecords, "institutional_memory_support") ||
    hasConsensusSignal(consensus.recentConsensusRecords, "weighted_convergence");

  if (!memorySupport) return null;

  return createNegotiation(
    "institutional_memory_compromise",
    "partially_resolved",
    "moderate",
    "continuity_vs_optimization",
    "Institutional memory reinforces a compromise pathway — historically validated lessons support balanced tradeoff negotiation without collapsing perspective diversity.",
    ["foresight", "recovery"],
    ["risk"],
    ["institutional_memory_support", "reconciliation_reinforcement", "historical_validation"],
    0.84,
    now
  );
}

function buildNegotiationInstabilityWarning(
  input: StrategicPerspectiveNegotiationInput,
  consensus: StrategicPerspectiveNegotiationInput["strategicConsensusSnapshot"],
  now: number
): StrategicPerspectiveNegotiation | null {
  if (!consensus) return null;
  const divergentRecords = consensus.recentConsensusRecords.filter(
    (r) => r.consensusState === "divergent" || r.consensusState === "fragmented"
  );
  const instability =
    divergentRecords.length >= 2 ||
    (input.fragilityElevated && consensus.perspectiveConflicts.some((c) => c.conflictSeverity === "high"));

  if (!instability) return null;

  return createNegotiation(
    "negotiation_instability_warning",
    "contested",
    "partial",
    "caution_vs_acceleration",
    "Divergence severity is increasing — negotiation instability warning indicates elevated tradeoff oscillation risk across enterprise reasoning perspectives.",
    ["risk"],
    ["operational_speed", "coordination"],
    ["negotiation_instability_warning", "divergence_escalation", "tradeoff_oscillation_risk"],
    0.74,
    now
  );
}

function buildExecutiveGradeReconciliation(
  input: StrategicPerspectiveNegotiationInput,
  consensus: StrategicPerspectiveNegotiationInput["strategicConsensusSnapshot"],
  now: number
): StrategicPerspectiveNegotiation | null {
  const runtimesStable =
    input.decisionSnapshot?.runtimeStatus === "stable" &&
    input.foresightSnapshot?.runtimeStatus === "stable" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable";
  const crossAligned =
    consensus &&
    (hasConsensusSignal(consensus.recentConsensusRecords, "cross_runtime_alignment") ||
      hasConsensusSignal(consensus.recentConsensusRecords, "executive_grade_alignment"));

  if (!runtimesStable || !crossAligned) return null;

  return createNegotiation(
    "executive_grade_reconciliation",
    "reconciled",
    "executive_grade",
    "foresight_vs_execution",
    "Cross-runtime agreement supports executive-grade reconciliation — balanced tradeoff negotiation converges across decision, foresight, and meta-cognition layers.",
    ["governance", "coordination", "foresight", "stability"],
    [],
    ["cross_runtime_alignment", "executive_grade_reconciliation", "balanced_tradeoff_convergence"],
    0.93,
    now
  );
}

function buildResilienceGrowthTradeoff(
  input: StrategicPerspectiveNegotiationInput,
  now: number
): StrategicPerspectiveNegotiation | null {
  const survivability = input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState;
  const growthPressure =
    input.foresightSnapshot?.summary.recommendedFocus?.toLowerCase().includes("growth") ||
    input.enterpriseNarrativeLine?.toLowerCase().includes("growth");

  if (survivability !== "durable" && survivability !== "survivable") return null;
  if (!growthPressure && !input.fragilityElevated) return null;

  return createNegotiation(
    "resilience_growth_tradeoff",
    "negotiating",
    "moderate",
    "resilience_vs_growth",
    "Resilience preservation negotiates with growth-oriented foresight — enterprise tradeoff pathways seek durable expansion without sacrificing stabilization discipline.",
    ["resilience", "foresight"],
    growthPressure ? (["operational_speed"] as PerspectiveCategory[]) : [],
    ["resilience_growth_balance", "durable_expansion_pathway"],
    0.81,
    now
  );
}

function buildTradeoffResolution(
  negotiation: StrategicPerspectiveNegotiation,
  now: number
): ExecutiveTradeoffResolution {
  return {
    resolutionId: stableSignature(["tradeoff-resolution", negotiation.negotiationId]).slice(0, 48),
    tradeoffLabel: negotiation.negotiationCategory.replace(/_/g, " "),
    tradeoffSummary: negotiation.summary.slice(0, 100),
    primaryCategory: negotiation.negotiationCategory,
    balancePosture:
      negotiation.negotiationStrength === "executive_grade"
        ? "executive_grade"
        : negotiation.negotiationStrength === "strong"
          ? "high"
          : negotiation.negotiationStrength === "moderate" || negotiation.negotiationStrength === "partial"
            ? "moderate"
            : "low",
    generatedAt: now,
  };
}

function buildNegotiationSignal(
  negotiation: StrategicPerspectiveNegotiation,
  now: number
): CognitiveNegotiationSignal {
  return {
    signalId: stableSignature(["negotiation-signal", negotiation.negotiationId]).slice(0, 48),
    signalLabel: negotiation.resolutionState.replace(/_/g, " "),
    signalSummary: negotiation.summary.slice(0, 100),
    linkedCategories: Object.freeze([negotiation.negotiationCategory]),
    signalIntensity:
      negotiation.negotiationStrength === "executive_grade" || negotiation.negotiationStrength === "strong"
        ? "high"
        : "moderate",
    confidence: negotiation.confidence,
    generatedAt: now,
  };
}

function buildReconciliationField(
  negotiation: StrategicPerspectiveNegotiation,
  now: number
): PerspectiveReconciliationField | null {
  if (
    negotiation.resolutionState !== "partially_resolved" &&
    negotiation.resolutionState !== "reconciled"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["reconciliation-field", negotiation.negotiationId]).slice(0, 48),
    fieldLabel: negotiation.resolutionState.replace(/_/g, " "),
    fieldSummary: negotiation.summary.slice(0, 80),
    reconciliationPosture:
      negotiation.negotiationStrength === "executive_grade"
        ? "executive_grade"
        : negotiation.negotiationStrength === "strong"
          ? "high"
          : negotiation.negotiationStrength === "moderate" || negotiation.negotiationStrength === "partial"
            ? "moderate"
            : "low",
    linkedCategories: Object.freeze([negotiation.negotiationCategory]),
    generatedAt: now,
  };
}

function buildConflictResolutionSnapshot(
  organizationId: string,
  negotiations: StrategicPerspectiveNegotiation[],
  tradeoffs: ExecutiveTradeoffResolution[],
  signals: CognitiveNegotiationSignal[],
  fields: PerspectiveReconciliationField[],
  now: number
): EnterpriseConflictResolutionSnapshot {
  const top = negotiations[0];
  const awarenessSummary: NegotiationIntelligenceSummary = top
    ? {
        dominantResolutionState: top.resolutionState,
        dominantNegotiationStrength: top.negotiationStrength,
        negotiationHeadline: top.summary,
        cohesionPosture:
          top.negotiationStrength === "executive_grade"
            ? "executive_grade"
            : top.negotiationStrength === "strong"
              ? "high"
              : top.negotiationStrength === "moderate" || top.negotiationStrength === "partial"
                ? "moderate"
                : "low",
      }
    : {
        dominantResolutionState: "unresolved",
        dominantNegotiationStrength: "weak",
        negotiationHeadline:
          "Enterprise conflict-resolution awareness awaiting sufficient consensus intelligence depth.",
        cohesionPosture: "low",
      };

  const signature = stableSignature([
    "d9-7-2-conflict-resolution-snapshot",
    organizationId,
    negotiations.map((n) => n.negotiationId),
    awarenessSummary.cohesionPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: negotiations.length,
    awarenessSummary,
    recentNegotiations: Object.freeze(negotiations.slice(0, 6)),
    tradeoffResolutions: Object.freeze(tradeoffs.slice(0, 6)),
    negotiationSignals: Object.freeze(signals.slice(0, 6)),
    reconciliationFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateStrategicPerspectiveNegotiation(
  input: StrategicPerspectiveNegotiationInput
): StrategicPerspectiveNegotiationResult {
  if (!beginPerspectiveNegotiationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newNegotiations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getPerspectiveNegotiationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-2-perspective-negotiation-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
    ]);

    if (
      !shouldEvaluatePerspectiveNegotiation(
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
        newNegotiations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusDepth = input.strategicConsensusSnapshot?.observationCount ?? 0;

    if (activeLayers < PERSPECTIVE_NEGOTIATION_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_negotiation_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newNegotiations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusDepth < PERSPECTIVE_NEGOTIATION_MIN_CONSENSUS_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_depth",
        snapshot: prior.snapshots[0] ?? null,
        newNegotiations: 0,
        storeSignature: prior.signature,
      };
    }

    const consensus = input.strategicConsensusSnapshot;
    const candidates: StrategicPerspectiveNegotiation[] = [];

    const governanceSpeed = buildGovernanceSpeedPartialReconciliation(consensus, now);
    if (governanceSpeed) candidates.push(governanceSpeed);

    const stabilityAdapt = buildStabilityAdaptabilityConvergence(input, consensus, now);
    if (stabilityAdapt) candidates.push(stabilityAdapt);

    const memoryCompromise = buildInstitutionalMemoryCompromise(input, consensus, now);
    if (memoryCompromise) candidates.push(memoryCompromise);

    const executiveReconciliation = buildExecutiveGradeReconciliation(input, consensus, now);
    if (executiveReconciliation) candidates.push(executiveReconciliation);

    const instability = buildNegotiationInstabilityWarning(input, consensus, now);
    if (instability) candidates.push(instability);

    const resilienceGrowth = buildResilienceGrowthTradeoff(input, now);
    if (resilienceGrowth) candidates.push(resilienceGrowth);

    const unresolved = buildUnresolvedStrategicConflict(consensus, now);
    if (unresolved) candidates.push(unresolved);

    const retained = candidates
      .filter(shouldRetainStrategicPerspectiveNegotiation)
      .sort(
        (a, b) =>
          resolutionStateRank(b.resolutionState) - resolutionStateRank(a.resolutionState) ||
          negotiationStrengthRank(b.negotiationStrength) -
            negotiationStrengthRank(a.negotiationStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_negotiations",
        snapshot: prior.snapshots[0] ?? null,
        newNegotiations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.negotiations.map((n) => n.negotiationId));
    const newCount = retained.filter((n) => !priorIds.has(n.negotiationId)).length;

    const tradeoffs = retained.map((n) => buildTradeoffResolution(n, now));
    const signals = retained.map((n) => buildNegotiationSignal(n, now));
    const fields = retained
      .map((n) => buildReconciliationField(n, now))
      .filter((f): f is PerspectiveReconciliationField => f !== null);

    store.upsertNegotiations(retained, now);
    store.upsertTradeoffResolutions(tradeoffs, now);
    store.upsertNegotiationSignals(signals, now);
    store.upsertReconciliationFields(fields, now);

    const snapshot = buildConflictResolutionSnapshot(
      organizationId,
      retained,
      tradeoffs,
      signals,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastResolutionState(snapshot.awarenessSummary.dominantResolutionState);

    const finalState = store.getState();
    const priorResolution = prior.lastResolutionState;

    if (governanceSpeed || memoryCompromise || stabilityAdapt) {
      devLog("major reconciliation formation — strategic tradeoff pathways emerging");
    }

    if (unresolved) {
      devLog("unresolved strategic conflict emergence — perspective negotiation stalled");
    }

    if (executiveReconciliation) {
      devLog("executive-grade negotiation convergence — distributed reasoning reconciled");
    }

    if (instability) {
      devLog("tradeoff instability escalation — negotiation oscillation risk elevated");
    }

    if (
      priorResolution &&
      priorResolution !== snapshot.awarenessSummary.dominantResolutionState &&
      (snapshot.awarenessSummary.dominantResolutionState === "reconciled" ||
        snapshot.awarenessSummary.dominantResolutionState === "partially_resolved")
    ) {
      devLog(
        `resolution state shift — ${priorResolution} → ${snapshot.awarenessSummary.dominantResolutionState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newNegotiations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endPerspectiveNegotiationEvaluation();
  }
}
