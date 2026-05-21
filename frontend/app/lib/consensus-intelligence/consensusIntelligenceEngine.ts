import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginConsensusIntelligenceEvaluation,
  clampConsensusConfidence,
  CONSENSUS_INTELLIGENCE_MIN_REFLECTIVE_DEPTH,
  CONSENSUS_INTELLIGENCE_MIN_UNIFIED_LAYERS,
  consensusStateRank,
  consensusStrengthRank,
  endConsensusIntelligenceEvaluation,
  shouldEvaluateConsensusIntelligence,
  shouldRetainStrategicConsensusRecord,
} from "./consensusIntelligenceGuards";
import { getConsensusIntelligenceStore } from "./consensusIntelligenceStore";
import type {
  ConsensusAlignmentField,
  ConsensusState,
  ConsensusStrength,
  DistributedCognitionSummary,
  EnterprisePerspectiveConflict,
  ExecutiveConsensusIntelligenceInput,
  ExecutiveConsensusIntelligenceResult,
  ExecutiveReasoningPerspective,
  MultiAgentReasoningSignal,
  PerspectiveCategory,
  StrategicConsensusRecord,
  StrategicConsensusSnapshot,
} from "./consensusIntelligenceTypes";

const DEV_LOG_PREFIX = "[Nexora][ConsensusIntelligence]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildConsensusId(label: string): string {
  return stableSignature(["consensus-intelligence", label]).slice(0, 56);
}

function buildPerspectiveId(category: PerspectiveCategory): string {
  return stableSignature(["reasoning-perspective", category]).slice(0, 48);
}

function countActiveUnifiedLayers(input: ExecutiveConsensusIntelligenceInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function createPerspective(
  category: PerspectiveCategory,
  label: string,
  prioritySummary: string,
  weight: number,
  alignmentSignals: string[],
  divergenceRisks: string[],
  confidence: number,
  now: number
): ExecutiveReasoningPerspective {
  return {
    perspectiveId: buildPerspectiveId(category),
    perspectiveCategory: category,
    perspectiveLabel: label,
    prioritySummary,
    perspectiveWeight: weight,
    alignmentSignals: Object.freeze(alignmentSignals),
    divergenceRisks: Object.freeze(divergenceRisks),
    confidence: clampConsensusConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function createConsensusRecord(
  label: string,
  consensusState: ConsensusState,
  consensusStrength: ConsensusStrength,
  summary: string,
  alignedPerspectives: PerspectiveCategory[],
  divergentPerspectives: PerspectiveCategory[],
  consensusSignals: string[],
  confidence: number,
  now: number
): StrategicConsensusRecord {
  return {
    consensusId: buildConsensusId(label),
    consensusState,
    consensusStrength,
    summary,
    alignedPerspectives: Object.freeze(alignedPerspectives),
    divergentPerspectives: Object.freeze(divergentPerspectives),
    consensusSignals: Object.freeze(consensusSignals),
    confidence: clampConsensusConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildReasoningPerspectives(
  input: ExecutiveConsensusIntelligenceInput,
  now: number
): ExecutiveReasoningPerspective[] {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const summary = reflective?.summary;
  const perspectives: ExecutiveReasoningPerspective[] = [];

  const survivability = summary?.survivabilityState ?? "pending";
  const governance = summary?.governanceAlignment ?? "pending";
  const adaptation = summary?.adaptationState ?? "pending";
  const integrity = summary?.reasoningIntegrity ?? "pending";
  const trust = summary?.trustCalibration ?? "pending";

  perspectives.push(
    createPerspective(
      "resilience",
      "Resilience stabilization",
      `Prioritize survivability (${survivability}) and durable enterprise cognition under stress.`,
      survivability === "durable" || survivability === "survivable" ? 0.88 : 0.72,
      ["resilience_preservation", "stress_tolerance"],
      ["premature_acceleration"],
      0.84,
      now
    ),
    createPerspective(
      "governance",
      "Governance integrity",
      `Preserve strategic self-regulation (${governance}) and bounded cognition discipline.`,
      governance === "self_regulated" || governance === "stabilized" ? 0.9 : 0.7,
      ["governance_coherence", "cognition_boundaries"],
      ["governance_erosion"],
      0.86,
      now
    ),
    createPerspective(
      "operational_speed",
      "Operational speed",
      `Accelerate orchestration response when decision runtime signals execution urgency.`,
      input.decisionSnapshot?.runtimeStatus === "stable" ? 0.65 : 0.82,
      ["execution_urgency", "coordination_velocity"],
      ["stabilization_delay", "orchestration_friction"],
      0.78,
      now
    ),
    createPerspective(
      "recovery",
      "Recovery acceleration",
      `Favor adaptive recovery pathways (${adaptation}) after prior instability conditions.`,
      adaptation === "self_stabilized" || adaptation === "stabilizing" ? 0.85 : 0.68,
      ["recovery_after_instability", "adaptive_stabilization"],
      ["recovery_overreach"],
      0.8,
      now
    ),
    createPerspective(
      "coordination",
      "Coordination alignment",
      `Align cross-runtime orchestration with institutional coordination coherence.`,
      integrity === "verified" || integrity === "coherent" ? 0.83 : 0.7,
      ["cross_runtime_alignment", "orchestration_coordination"],
      ["sequencing_instability"],
      0.81,
      now
    ),
    createPerspective(
      "foresight",
      "Strategic foresight",
      `Weight anticipatory signals toward ${input.foresightSnapshot?.summary.recommendedFocus ?? "strategic continuity"}.`,
      input.foresightSnapshot?.runtimeStatus === "stable" ? 0.86 : 0.74,
      ["foresight_consistency", "anticipatory_alignment"],
      ["speculative_overreach"],
      0.82,
      now
    ),
    createPerspective(
      "risk",
      "Risk containment",
      `Elevate caution when uncertainty posture (${summary?.uncertaintyPosture ?? "moderated"}) remains elevated.`,
      summary?.uncertaintyPosture === "cautious" || summary?.uncertaintyPosture === "restricted"
        ? 0.87
        : 0.71,
      ["risk_containment", "caution_reinforcement"],
      ["risk_paralysis"],
      0.79,
      now
    ),
    createPerspective(
      "stability",
      "Enterprise stability",
      `Maintain stabilization-first reasoning when meta-cognition runtime is ${reflective?.runtimeStatus ?? "adaptive"}.`,
      reflective?.runtimeStatus === "stable" ? 0.9 : 0.76,
      ["stabilization_prioritization", "runtime_balance"],
      ["stability_stagnation"],
      0.85,
      now
    )
  );

  if (trust === "highly_trustworthy" || trust === "reliable") {
    perspectives.push(
      createPerspective(
        "unknown",
        "Trust-weighted synthesis",
        "Trust-calibrated perspectives reinforce consensus toward dependable executive conclusions.",
        0.8,
        ["trust_calibration_alignment"],
        [],
        0.83,
        now
      )
    );
  }

  return perspectives;
}

function buildGovernanceResilienceConsensus(
  perspectives: ExecutiveReasoningPerspective[],
  now: number
): StrategicConsensusRecord | null {
  const gov = perspectives.find((p) => p.perspectiveCategory === "governance");
  const res = perspectives.find((p) => p.perspectiveCategory === "resilience");
  const stab = perspectives.find((p) => p.perspectiveCategory === "stability");

  if (!gov || !res || gov.perspectiveWeight < 0.75 || res.perspectiveWeight < 0.75) return null;

  const aligned: PerspectiveCategory[] = ["governance", "resilience"];
  if (stab && stab.perspectiveWeight >= 0.8) aligned.push("stability");

  return createConsensusRecord(
    "governance_resilience_consensus",
    "converging",
    aligned.length >= 3 ? "strong" : "moderate",
    "Governance and resilience perspectives align — strong consensus reinforcement toward coordinated stabilization and integrity-preserving escalation containment.",
    aligned,
    [],
    ["governance_resilience_alignment", "consensus_reinforcement", "integrity_preservation"],
    0.88,
    now
  );
}

function buildOperationalSpeedDivergence(
  perspectives: ExecutiveReasoningPerspective[],
  now: number
): StrategicConsensusRecord | null {
  const speed = perspectives.find((p) => p.perspectiveCategory === "operational_speed");
  const stability = perspectives.find((p) => p.perspectiveCategory === "stability");

  if (!speed || !stability) return null;
  if (speed.perspectiveWeight < 0.75 || stability.perspectiveWeight < 0.8) return null;

  return createConsensusRecord(
    "operational_speed_divergence",
    "divergent",
    "moderate",
    "Operational speed conflicts with stabilization priorities — strategic divergence between execution urgency and enterprise stability containment.",
    ["coordination"],
    ["operational_speed", "stability"],
    ["orchestration_disagreement", "stabilization_tradeoff"],
    0.8,
    now
  );
}

function buildInstitutionalMemoryConvergence(
  input: ExecutiveConsensusIntelligenceInput,
  perspectives: ExecutiveReasoningPerspective[],
  now: number
): StrategicConsensusRecord | null {
  const memoryStrong =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    (input.memorySnapshot?.summary.primaryStrategicLesson.trim().length ?? 0) > 0;
  const foresight = perspectives.find((p) => p.perspectiveCategory === "foresight");
  const recovery = perspectives.find((p) => p.perspectiveCategory === "recovery");

  if (!memoryStrong || !foresight) return null;

  const aligned: PerspectiveCategory[] = ["foresight"];
  if (recovery && recovery.perspectiveWeight >= 0.75) aligned.push("recovery");

  return createConsensusRecord(
    "institutional_memory_convergence",
    "converging",
    "strong",
    "Institutional memory strongly supports foresight and recovery perspectives — weighted convergence toward historically validated strategic pathways.",
    aligned,
    [],
    ["institutional_memory_support", "weighted_convergence", "historical_validation"],
    0.87,
    now
  );
}

function buildCrossRuntimeAlignment(
  input: ExecutiveConsensusIntelligenceInput,
  now: number
): StrategicConsensusRecord | null {
  const runtimesStable =
    input.decisionSnapshot?.runtimeStatus === "stable" &&
    input.foresightSnapshot?.runtimeStatus === "stable" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable";
  const governanceCoherent =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "institutional_grade";

  if (!runtimesStable || !governanceCoherent) return null;

  return createConsensusRecord(
    "cross_runtime_executive_alignment",
    "aligned",
    "executive_grade",
    "Multiple enterprise runtimes agree consistently — executive-grade alignment across decision, foresight, and self-reflective cognition layers.",
    ["governance", "coordination", "foresight", "stability"],
    [],
    ["cross_runtime_alignment", "executive_grade_alignment", "runtime_consistency"],
    0.93,
    now
  );
}

function buildNarrowConsensusWarning(
  perspectives: ExecutiveReasoningPerspective[],
  input: ExecutiveConsensusIntelligenceInput,
  now: number
): StrategicConsensusRecord | null {
  const categories = new Set(perspectives.map((p) => p.perspectiveCategory));
  const highConfidence =
    (input.unifiedSelfReflectiveSnapshot?.selfReflectiveIntelligence.confidence ?? 0) >= 0.88;

  if (categories.size >= 6 || !highConfidence) return null;

  return createConsensusRecord(
    "narrow_consensus_warning",
    "negotiating",
    "partial",
    "High confidence with low perspective diversity — narrow-consensus warning indicates limited strategic debate across enterprise reasoning viewpoints.",
    Array.from(categories).slice(0, 3),
    [],
    ["narrow_consensus_warning", "low_perspective_diversity"],
    0.72,
    now
  );
}

function buildConvergingEnterpriseCognition(
  input: ExecutiveConsensusIntelligenceInput,
  perspectives: ExecutiveReasoningPerspective[],
  now: number
): StrategicConsensusRecord | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const stabilizing =
    reflective?.runtimeStatus === "adaptive" ||
    reflective?.runtimeStatus === "recovering" ||
    reflective?.summary.adaptationState === "stabilizing" ||
    reflective?.summary.adaptationState === "self_stabilized";

  if (!stabilizing) return null;

  const aligned = perspectives
    .filter((p) => p.perspectiveWeight >= 0.78 && p.perspectiveCategory !== "operational_speed")
    .map((p) => p.perspectiveCategory)
    .slice(0, 4);

  const divergent: PerspectiveCategory[] = perspectives.some(
    (p) => p.perspectiveCategory === "operational_speed" && p.perspectiveWeight >= 0.78
  )
    ? ["operational_speed"]
    : [];

  return createConsensusRecord(
    "enterprise_multi_perspective_alignment",
    divergent.length > 0 ? "converging" : "aligned",
    "strong",
    "Governance, resilience, and stabilization perspectives are converging toward coordinated escalation-containment and pressure-reduction priorities, while operational-speed perspectives remain partially divergent.",
    aligned.length > 0 ? aligned : (["governance", "resilience", "stability"] as PerspectiveCategory[]),
    divergent,
    ["institutional_memory_support", "cross_runtime_alignment", "foresight_consistency"],
    divergent.length > 0 ? 0.9 : 0.92,
    now
  );
}

function buildPerspectiveConflict(
  primary: PerspectiveCategory,
  opposing: PerspectiveCategory,
  summary: string,
  severity: EnterprisePerspectiveConflict["conflictSeverity"],
  now: number
): EnterprisePerspectiveConflict {
  return {
    conflictId: stableSignature(["perspective-conflict", primary, opposing]).slice(0, 48),
    conflictLabel: `${primary} vs ${opposing}`,
    conflictSummary: summary.slice(0, 100),
    primaryCategory: primary,
    opposingCategory: opposing,
    conflictSeverity: severity,
    generatedAt: now,
  };
}

function buildMultiAgentSignal(
  record: StrategicConsensusRecord,
  now: number
): MultiAgentReasoningSignal {
  return {
    signalId: stableSignature(["multi-agent-signal", record.consensusId]).slice(0, 48),
    signalLabel: record.consensusState.replace(/_/g, " "),
    signalSummary: record.summary.slice(0, 100),
    linkedCategories: Object.freeze([
      ...record.alignedPerspectives,
      ...record.divergentPerspectives,
    ]),
    signalIntensity:
      record.consensusStrength === "executive_grade" || record.consensusStrength === "strong"
        ? "high"
        : "moderate",
    confidence: record.confidence,
    generatedAt: now,
  };
}

function buildAlignmentField(
  record: StrategicConsensusRecord,
  now: number
): ConsensusAlignmentField | null {
  if (
    record.consensusState !== "converging" &&
    record.consensusState !== "aligned"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["alignment-field", record.consensusId]).slice(0, 48),
    fieldLabel: record.consensusState.replace(/_/g, " "),
    fieldSummary: record.summary.slice(0, 80),
    alignmentPosture:
      record.consensusStrength === "executive_grade"
        ? "executive_grade"
        : record.consensusStrength === "strong"
          ? "high"
          : record.consensusStrength === "moderate" || record.consensusStrength === "partial"
            ? "moderate"
            : "low",
    linkedCategories: Object.freeze(record.alignedPerspectives),
    generatedAt: now,
  };
}

function buildConsensusSnapshot(
  organizationId: string,
  perspectives: ExecutiveReasoningPerspective[],
  records: StrategicConsensusRecord[],
  conflicts: EnterprisePerspectiveConflict[],
  signals: MultiAgentReasoningSignal[],
  fields: ConsensusAlignmentField[],
  now: number
): StrategicConsensusSnapshot {
  const top = records[0];
  const uniqueCategories = new Set(perspectives.map((p) => p.perspectiveCategory));

  const awarenessSummary: DistributedCognitionSummary = top
    ? {
        dominantConsensusState: top.consensusState,
        dominantConsensusStrength: top.consensusStrength,
        consensusHeadline: top.summary,
        perspectiveDiversityPosture:
          uniqueCategories.size >= 7 ? "high" : uniqueCategories.size >= 5 ? "moderate" : "low",
      }
    : {
        dominantConsensusState: "fragmented",
        dominantConsensusStrength: "weak",
        consensusHeadline:
          "Distributed executive consensus awaiting sufficient self-reflective runtime depth.",
        perspectiveDiversityPosture: "low",
      };

  const signature = stableSignature([
    "d9-7-1-strategic-consensus-snapshot",
    organizationId,
    records.map((r) => r.consensusId),
    awarenessSummary.perspectiveDiversityPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: records.length,
    awarenessSummary,
    recentConsensusRecords: Object.freeze(records.slice(0, 6)),
    reasoningPerspectives: Object.freeze(perspectives.slice(0, 9)),
    perspectiveConflicts: Object.freeze(conflicts.slice(0, 6)),
    multiAgentSignals: Object.freeze(signals.slice(0, 6)),
    alignmentFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateExecutiveConsensusIntelligence(
  input: ExecutiveConsensusIntelligenceInput
): ExecutiveConsensusIntelligenceResult {
  if (!beginConsensusIntelligenceEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newConsensusRecords: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getConsensusIntelligenceStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-1-consensus-intelligence-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
    ]);

    if (
      !shouldEvaluateConsensusIntelligence(
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
        newConsensusRecords: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const reflectiveDepth = input.unifiedSelfReflectiveSnapshot
      ? input.unifiedSelfReflectiveSnapshot.activeSubsystems.length
      : 0;

    if (activeLayers < CONSENSUS_INTELLIGENCE_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newConsensusRecords: 0,
        storeSignature: prior.signature,
      };
    }

    if (reflectiveDepth < CONSENSUS_INTELLIGENCE_MIN_REFLECTIVE_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_reflective_depth",
        snapshot: prior.snapshots[0] ?? null,
        newConsensusRecords: 0,
        storeSignature: prior.signature,
      };
    }

    const perspectives = buildReasoningPerspectives(input, now);
    const candidates: StrategicConsensusRecord[] = [];

    const governanceResilience = buildGovernanceResilienceConsensus(perspectives, now);
    if (governanceResilience) candidates.push(governanceResilience);

    const speedDivergence = buildOperationalSpeedDivergence(perspectives, now);
    if (speedDivergence) candidates.push(speedDivergence);

    const memoryConvergence = buildInstitutionalMemoryConvergence(input, perspectives, now);
    if (memoryConvergence) candidates.push(memoryConvergence);

    const crossRuntime = buildCrossRuntimeAlignment(input, now);
    if (crossRuntime) candidates.push(crossRuntime);

    const narrowWarning = buildNarrowConsensusWarning(perspectives, input, now);
    if (narrowWarning) candidates.push(narrowWarning);

    const converging = buildConvergingEnterpriseCognition(input, perspectives, now);
    if (converging) candidates.push(converging);

    const retained = candidates
      .filter(shouldRetainStrategicConsensusRecord)
      .sort(
        (a, b) =>
          consensusStateRank(b.consensusState) - consensusStateRank(a.consensusState) ||
          consensusStrengthRank(b.consensusStrength) - consensusStrengthRank(a.consensusStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_consensus_records",
        snapshot: prior.snapshots[0] ?? null,
        newConsensusRecords: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.consensusRecords.map((r) => r.consensusId));
    const newCount = retained.filter((r) => !priorIds.has(r.consensusId)).length;

    const conflicts: EnterprisePerspectiveConflict[] = [];
    if (speedDivergence) {
      conflicts.push(
        buildPerspectiveConflict(
          "operational_speed",
          "stability",
          speedDivergence.summary,
          "moderate",
          now
        )
      );
    }
    const fragmented = retained.some((r) => r.consensusState === "fragmented");
    if (fragmented) {
      conflicts.push(
        buildPerspectiveConflict(
          "risk",
          "coordination",
          "Fragmented perspective coordination under elevated enterprise stress.",
          "high",
          now
        )
      );
    }

    const signals = retained.map((r) => buildMultiAgentSignal(r, now));
    const fields = retained
      .map((r) => buildAlignmentField(r, now))
      .filter((f): f is ConsensusAlignmentField => f !== null);

    store.upsertReasoningPerspectives(perspectives, now);
    store.upsertConsensusRecords(retained, now);
    store.upsertPerspectiveConflicts(conflicts, now);
    store.upsertMultiAgentSignals(signals, now);
    store.upsertAlignmentFields(fields, now);

    const snapshot = buildConsensusSnapshot(
      organizationId,
      perspectives,
      retained,
      conflicts,
      signals,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastConsensusState(snapshot.awarenessSummary.dominantConsensusState);

    const finalState = store.getState();
    const priorConsensus = prior.lastConsensusState;

    if (converging || crossRuntime) {
      devLog("major convergence formation — multi-perspective alignment emerging");
    }

    if (speedDivergence || retained.some((r) => r.consensusState === "divergent")) {
      devLog("strategic divergence emergence — perspective conflict detected");
    }

    if (crossRuntime || governanceResilience?.consensusStrength === "executive_grade") {
      devLog("executive-grade alignment stabilization — distributed cognition aligned");
    }

    if (conflicts.some((c) => c.conflictSeverity === "high")) {
      devLog("perspective conflict escalation — bounded disagreement monitoring elevated");
    }

    if (
      priorConsensus &&
      priorConsensus !== snapshot.awarenessSummary.dominantConsensusState &&
      (snapshot.awarenessSummary.dominantConsensusState === "aligned" ||
        snapshot.awarenessSummary.dominantConsensusState === "converging")
    ) {
      devLog(
        `consensus state shift — ${priorConsensus} → ${snapshot.awarenessSummary.dominantConsensusState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newConsensusRecords: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endConsensusIntelligenceEvaluation();
  }
}
