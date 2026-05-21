import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginExplainabilityEvaluation,
  clampExplainabilityConfidence,
  endExplainabilityEvaluation,
  EXPLAINABILITY_MIN_UNCERTAINTY_DEPTH,
  EXPLAINABILITY_MIN_UNIFIED_LAYERS,
  explanationStrengthRank,
  shouldEvaluateExplainability,
  shouldRetainExecutiveReasoningTrace,
  transparencyStateRank,
} from "./explainabilityGuards";
import { getExplainabilityStore } from "./explainabilityStore";
import type {
  EnterpriseCognitionPathway,
  ExecutiveExplainabilityInput,
  ExecutiveExplainabilityResult,
  ExecutiveReasoningTrace,
  ExplanationCategory,
  ExplanationConfidenceField,
  ExplanationStrength,
  ExplainabilitySummary,
  StrategicExplanationSnapshot,
  TransparencyState,
  TransparentReasoningSignal,
} from "./explainabilityTypes";

const DEV_LOG_PREFIX = "[Nexora][Explainability]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildExplainabilityId(label: string): string {
  return stableSignature(["explainability", label]).slice(0, 56);
}

function collectUncertaintyFactors(input: ExecutiveExplainabilityInput): string[] {
  const fromUncertainty =
    input.cognitiveUncertaintySnapshot?.recentAmbiguityObservations.flatMap((o) => [
      ...o.unknownZones,
      ...o.cautionRisks.filter((r) => r.includes("visibility") || r.includes("incomplete")),
    ]) ?? [];
  const fromIntegrity =
    input.reasoningIntegritySnapshot?.recentTrustObservations.flatMap((o) =>
      o.integrityRisks.filter(
        (r) => r.includes("visibility") || r.includes("mismatch") || r.includes("caution")
      )
    ) ?? [];
  return Array.from(new Set([...fromUncertainty, ...fromIntegrity])).slice(0, 6);
}

function createReasoningTrace(
  label: string,
  transparencyState: TransparencyState,
  explanationStrength: ExplanationStrength,
  explanationCategory: ExplanationCategory,
  summary: string,
  reasoningPathways: string[],
  uncertaintyFactors: string[],
  confidence: number,
  now: number
): ExecutiveReasoningTrace {
  return {
    explainabilityId: buildExplainabilityId(label),
    transparencyState,
    explanationStrength,
    explanationCategory,
    summary,
    reasoningPathways: Object.freeze(reasoningPathways),
    uncertaintyFactors: Object.freeze(uncertaintyFactors),
    confidence: clampExplainabilityConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: ExecutiveExplainabilityInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && input.temporalSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function buildGovernanceStabilizationTrace(
  input: ExecutiveExplainabilityInput,
  now: number
): ExecutiveReasoningTrace | null {
  const escalation =
    input.foresightSnapshot?.summary.dominantRisk.includes("escalation") ||
    input.foresightSnapshot?.summary.earlyWarningState === "intensifying" ||
    input.foresightSnapshot?.summary.earlyWarningState === "spreading";
  const preparednessWeak =
    input.foresightSnapshot?.summary.preparednessState.includes("weak") ||
    input.foresightSnapshot?.summary.preparednessState.includes("degraded") ||
    input.foresightSnapshot?.summary.preparednessState.includes("limited");
  const timingNarrow =
    input.foresightSnapshot?.executiveAnticipatoryIntelligence.interventionReadiness.includes(
      "narrow"
    ) ||
    input.foresightSnapshot?.executiveAnticipatoryIntelligence.interventionReadiness.includes(
      "urgent"
    ) ||
    input.foresightSnapshot?.executiveAnticipatoryIntelligence.interventionReadiness.includes(
      "imminent"
    );
  const memoryGovernanceFragility =
    input.memorySnapshot?.institutionalHealth === "weak" ||
    input.memorySnapshot?.institutionalHealth === "moderate" ||
    (input.cognitionSnapshot?.organizationalLearningLine.includes("governance") ?? false);
  const stabilizationFocus =
    input.decisionSnapshot?.summary.stabilizationFocus.includes("governance") ||
    input.decisionSnapshot?.summary.dominantPriority.includes("stabil");

  const hasGovernanceDrivers =
    escalation && (preparednessWeak || timingNarrow || memoryGovernanceFragility);
  const hasStabilizationPath = stabilizationFocus && escalation;
  if (!hasGovernanceDrivers && !hasStabilizationPath) return null;

  const uncertaintyFactors = collectUncertaintyFactors(input);

  return createReasoningTrace(
    "governance_reasoning_trace",
    uncertaintyFactors.length > 0 ? "explainable" : "coherent",
    "strong",
    "governance_alignment",
    "Governance stabilization was prioritized due to increasing escalation propagation, narrowing intervention timing, weakening preparedness, and institutional-memory evidence of recurring governance fragility.",
    [
      "early_warning_alignment",
      "preparedness_degradation",
      "institutional_memory_support",
      "timing_sensitivity_growth",
    ],
    uncertaintyFactors.length > 0 ? uncertaintyFactors : [],
    0.91,
    now
  );
}

function buildConfidenceReductionTrace(
  input: ExecutiveExplainabilityInput,
  now: number
): ExecutiveReasoningTrace | null {
  const foresightConflict = input.reasoningIntegritySnapshot?.recentTrustObservations.some(
    (o) =>
      o.integrityRisks.includes("inconsistency_risk") ||
      o.integrityRisks.includes("orchestration_conflict")
  );
  const visibilityGap = collectUncertaintyFactors(input).some((f) =>
    f.includes("visibility")
  );
  const lowCertainty =
    input.confidenceSnapshot?.coordinationSummary.certaintyPosture === "low" ||
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "uncertain" ||
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "fragmented";

  if (!lowCertainty && !(foresightConflict && visibilityGap)) return null;

  return createReasoningTrace(
    "confidence_reduction_trace",
    "traceable",
    "moderate",
    "confidence_arbitration",
    "Confidence was moderated because conflicting foresight signals and incomplete operational visibility reduced evidentiary support for higher-certainty conclusions.",
    ["confidence_arbitration_active", "foresight_signal_review"],
    collectUncertaintyFactors(input),
    0.78,
    now
  );
}

function buildOrchestrationSequencingTrace(
  input: ExecutiveExplainabilityInput,
  now: number
): ExecutiveReasoningTrace | null {
  const sequencingEvolving =
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving" ||
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "unstable";
  const pressurePropagation =
    input.cognitionSnapshot?.pressurePosture === "attention" ||
    input.cognitionSnapshot?.timelineStrategicEvolutionLine.includes("pressure") ||
    (input.fragilityElevated ?? false);

  if (!sequencingEvolving || !pressurePropagation) return null;

  return createReasoningTrace(
    "orchestration_sequencing_trace",
    "traceable",
    "moderate",
    "orchestration_pathway",
    "Adaptive sequencing changed because pressure propagation intensified across orchestration pathways and coordination responses required re-sequencing.",
    [
      "pressure_propagation_intensified",
      "adaptive_sequencing_active",
      "orchestration_pathway_shift",
    ],
    [],
    0.8,
    now
  );
}

function buildResilienceStabilityTrace(
  input: ExecutiveExplainabilityInput,
  now: number
): ExecutiveReasoningTrace | null {
  const resilienceStrengthening =
    input.cognitionSnapshot?.resilienceForecastLine.includes("strengthen") ||
    input.cognitionSnapshot?.resilienceForecastLine.includes("improve");
  const driftStable =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "stable" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "adaptive";
  const stabilizationFocus =
    input.decisionSnapshot?.summary.stabilizationFocus.includes("resilience") ||
    input.decisionSnapshot?.summary.stabilizationFocus.includes("stabil");

  if (!resilienceStrengthening || !driftStable) return null;

  return createReasoningTrace(
    "resilience_stability_trace",
    "coherent",
    "strong",
    "resilience_reasoning",
    stabilizationFocus
      ? "Stability optimization was prioritized because resilience pathways strengthened while enterprise cognition drift remained within stable bounds."
      : "Resilience reasoning strengthened because forecasted recovery pathways improved while cognition stability monitoring remained favorable.",
    ["resilience_pathway_strengthening", "cognitive_drift_stable", "stability_optimization_signal"],
    [],
    0.87,
    now
  );
}

function buildInterventionProjectionTrace(
  input: ExecutiveExplainabilityInput,
  now: number
): ExecutiveReasoningTrace | null {
  const interventionSignal =
    input.foresightSnapshot?.executiveAnticipatoryIntelligence.interventionReadiness.includes(
      "window"
    ) ||
    input.foresightSnapshot?.executiveAnticipatoryIntelligence.interventionReadiness.includes(
      "timing"
    ) ||
    input.foresightSnapshot?.executiveAnticipatoryIntelligence.interventionReadiness.includes(
      "narrow"
    );
  const advisoryIntervention =
    input.enterpriseNarrativeLine?.includes("intervention") ||
    input.decisionSnapshot?.summary.dominantPriority.includes("intervention");

  if (!interventionSignal && !advisoryIntervention) return null;

  return createReasoningTrace(
    "intervention_projection_trace",
    "explainable",
    "strong",
    "intervention_projection",
    "Intervention projection was elevated because foresight timing intelligence identified narrowing intervention windows alongside anticipatory risk alignment.",
    [
      "intervention_timing_signal",
      "foresight_alignment",
      "anticipatory_risk_context",
    ],
    collectUncertaintyFactors(input),
    0.85,
    now
  );
}

function buildForesightAlignmentTrace(
  input: ExecutiveExplainabilityInput,
  now: number
): ExecutiveReasoningTrace | null {
  const foresightAligned = input.reasoningIntegritySnapshot?.recentTrustObservations.some((o) =>
    o.consistencySignals.includes("foresight_decision_agreement")
  );
  const foresightActive =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.foresightHealth === "strong";

  if (!foresightAligned && !foresightActive) return null;

  return createReasoningTrace(
    "foresight_alignment_trace",
    "coherent",
    "strong",
    "foresight_alignment",
    "Strategic foresight conclusions aligned with decision orchestration because early-warning signals, recommended focus, and orchestration priorities remained directionally consistent.",
    [
      "foresight_decision_agreement",
      "early_warning_alignment",
      "recommended_focus_consistency",
    ],
    [],
    0.86,
    now
  );
}

function buildPreparednessReasoningTrace(
  input: ExecutiveExplainabilityInput,
  now: number
): ExecutiveReasoningTrace | null {
  const preparednessSignal =
    input.foresightSnapshot?.summary.preparednessState.includes("weak") ||
    input.foresightSnapshot?.summary.preparednessState.includes("degraded") ||
    input.foresightSnapshot?.summary.preparednessState.includes("forming");

  if (!preparednessSignal) return null;

  return createReasoningTrace(
    "preparedness_reasoning_trace",
    "traceable",
    "moderate",
    "preparedness_reasoning",
    "Preparedness reasoning flagged weakened readiness posture, influencing prioritization toward stabilization and risk-containment pathways.",
    ["preparedness_degradation", "readiness_posture_review"],
    collectUncertaintyFactors(input),
    0.79,
    now
  );
}

function buildEscalationAnalysisTrace(
  input: ExecutiveExplainabilityInput,
  now: number
): ExecutiveReasoningTrace | null {
  const escalation =
    input.foresightSnapshot?.summary.dominantRisk.includes("escalation") ||
    input.foresightSnapshot?.summary.earlyWarningState === "intensifying";

  if (!escalation) return null;

  return createReasoningTrace(
    "escalation_analysis_trace",
    "explainable",
    "strong",
    "escalation_analysis",
    "Escalation analysis elevated strategic warnings because dominant risk signals and early-warning states indicated intensifying propagation across enterprise systems.",
    ["escalation_risk_signal", "early_warning_alignment", "dominant_risk_context"],
    collectUncertaintyFactors(input),
    0.83,
    now
  );
}

function buildExecutiveGradeExplainability(
  traces: ExecutiveReasoningTrace[],
  activeLayers: number,
  now: number
): ExecutiveReasoningTrace | null {
  const strongTraces = traces.filter(
    (t) => t.explanationStrength === "strong" || t.explanationStrength === "executive_grade"
  ).length;
  const coherent = traces.filter(
    (t) =>
      t.transparencyState === "coherent" ||
      t.transparencyState === "explainable" ||
      t.transparencyState === "fully_transparent"
  ).length;

  if (strongTraces < 2 || coherent < 2 || activeLayers < 4) return null;

  return createReasoningTrace(
    "executive_grade_explainability",
    "fully_transparent",
    "executive_grade",
    "unknown",
    "Multiple enterprise cognition runtimes aligned to support the same strategic conclusion with traceable pathways, justified confidence, and explicit uncertainty factors — executive-grade explainability formed.",
    [
      "cross_runtime_alignment",
      "traceable_reasoning_pathways",
      "confidence_justification",
      "uncertainty_disclosure",
    ],
    [],
    0.93,
    now
  );
}

function buildTransparentSignal(
  trace: ExecutiveReasoningTrace,
  now: number
): TransparentReasoningSignal {
  return {
    signalId: stableSignature(["transparent-signal", trace.explainabilityId]).slice(0, 48),
    signalLabel: trace.explanationCategory.replace(/_/g, " "),
    signalSummary: trace.summary.slice(0, 100),
    linkedCategories: Object.freeze([trace.explanationCategory]),
    signalStrength:
      trace.explanationStrength === "executive_grade" || trace.explanationStrength === "strong"
        ? "high"
        : trace.explanationStrength === "moderate"
          ? "moderate"
          : "low",
    confidence: trace.confidence,
    generatedAt: now,
  };
}

function buildCognitionPathway(
  trace: ExecutiveReasoningTrace,
  source: string,
  target: string,
  now: number
): EnterpriseCognitionPathway | null {
  const categoryPathwayMap: Partial<
    Record<ExecutiveReasoningTrace["explanationCategory"], readonly [string, string]>
  > = {
    foresight_alignment: ["foresight", "decision_orchestration"],
    governance_alignment: ["institutional_memory", "governance"],
    orchestration_pathway: ["adaptive_sequencing", "decision_orchestration"],
    confidence_arbitration: ["meta_cognition", "confidence_arbitration"],
    intervention_projection: ["foresight", "intervention_projection"],
    escalation_analysis: ["foresight", "early_warning"],
    resilience_reasoning: ["temporal_cognition", "stability_optimization"],
  };
  const mapped = categoryPathwayMap[trace.explanationCategory];
  if (!mapped || mapped[0] !== source || mapped[1] !== target) return null;

  return {
    pathwayId: stableSignature([
      "cognition-pathway",
      source,
      target,
      trace.explainabilityId,
    ]).slice(0, 48),
    pathwayLabel: `${source} → ${target}`,
    pathwaySummary: trace.summary.slice(0, 80),
    sourceRuntime: source,
    targetRuntime: target,
    pathwayStrength: trace.explanationStrength,
    generatedAt: now,
  };
}

function buildExplanationConfidenceField(
  trace: ExecutiveReasoningTrace,
  now: number
): ExplanationConfidenceField {
  return {
    fieldId: stableSignature(["explanation-confidence", trace.explainabilityId]).slice(0, 48),
    fieldLabel: trace.explanationCategory.replace(/_/g, " "),
    fieldSummary: `Explanation confidence ${trace.confidence} with ${trace.transparencyState} transparency.`,
    confidencePosture:
      trace.explanationStrength === "executive_grade"
        ? "executive_grade"
        : trace.explanationStrength === "strong"
          ? "high"
          : trace.explanationStrength === "moderate"
            ? "moderate"
            : "low",
    linkedCategories: Object.freeze([trace.explanationCategory]),
    generatedAt: now,
  };
}

function buildExplanationSnapshot(
  organizationId: string,
  traces: ExecutiveReasoningTrace[],
  signals: TransparentReasoningSignal[],
  pathways: EnterpriseCognitionPathway[],
  confidenceFields: ExplanationConfidenceField[],
  now: number
): StrategicExplanationSnapshot {
  const top = traces[0];
  const awarenessSummary: ExplainabilitySummary = top
    ? {
        dominantTransparencyState: top.transparencyState,
        dominantExplanationStrength: top.explanationStrength,
        explainabilityHeadline: top.summary,
        auditabilityPosture:
          top.transparencyState === "fully_transparent" &&
          top.explanationStrength === "executive_grade"
            ? "executive_grade"
            : top.transparencyState === "partial"
              ? "low"
              : top.explanationStrength === "strong"
                ? "high"
                : "moderate",
      }
    : {
        dominantTransparencyState: "partial",
        dominantExplanationStrength: "weak",
        explainabilityHeadline:
          "Explainability intelligence awaiting sufficient uncertainty and cognition depth.",
        auditabilityPosture: "low",
      };

  const signature = stableSignature([
    "d9-6-5-explainability-snapshot",
    organizationId,
    traces.map((t) => t.explainabilityId),
    awarenessSummary.auditabilityPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    traceCount: traces.length,
    awarenessSummary,
    recentReasoningTraces: Object.freeze(traces.slice(0, 6)),
    transparentReasoningSignals: Object.freeze(signals.slice(0, 6)),
    cognitionPathways: Object.freeze(pathways.slice(0, 6)),
    explanationConfidenceFields: Object.freeze(confidenceFields.slice(0, 6)),
  };
}

export function evaluateExecutiveExplainability(
  input: ExecutiveExplainabilityInput
): ExecutiveExplainabilityResult {
  if (!beginExplainabilityEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newReasoningTraces: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getExplainabilityStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-5-explainability-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
      input.metaCognitionSnapshot?.signature ?? "no-meta-cognition",
      input.reasoningIntegritySnapshot?.signature ?? "no-reasoning-integrity",
      input.cognitiveDriftSnapshot?.signature ?? "no-cognitive-drift",
      input.cognitiveUncertaintySnapshot?.signature ?? "no-cognitive-uncertainty",
      input.confidenceSnapshot?.signature ?? "no-confidence",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
      input.sequencingSnapshot?.signature ?? "no-sequencing",
    ]);

    if (
      !shouldEvaluateExplainability(
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
        newReasoningTraces: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const uncertaintyDepth = input.cognitiveUncertaintySnapshot?.ambiguityCount ?? 0;

    if (activeLayers < EXPLAINABILITY_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_explainability_depth",
        snapshot: prior.snapshots[0] ?? null,
        newReasoningTraces: 0,
        storeSignature: prior.signature,
      };
    }

    if (uncertaintyDepth < EXPLAINABILITY_MIN_UNCERTAINTY_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_uncertainty_depth",
        snapshot: prior.snapshots[0] ?? null,
        newReasoningTraces: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: ExecutiveReasoningTrace[] = [];

    const governanceTrace = buildGovernanceStabilizationTrace(input, now);
    if (governanceTrace) candidates.push(governanceTrace);

    const escalationTrace = buildEscalationAnalysisTrace(input, now);
    if (escalationTrace) candidates.push(escalationTrace);

    const confidenceTrace = buildConfidenceReductionTrace(input, now);
    if (confidenceTrace) candidates.push(confidenceTrace);

    const orchestrationTrace = buildOrchestrationSequencingTrace(input, now);
    if (orchestrationTrace) candidates.push(orchestrationTrace);

    const resilienceTrace = buildResilienceStabilityTrace(input, now);
    if (resilienceTrace) candidates.push(resilienceTrace);

    const interventionTrace = buildInterventionProjectionTrace(input, now);
    if (interventionTrace) candidates.push(interventionTrace);

    const foresightTrace = buildForesightAlignmentTrace(input, now);
    if (foresightTrace) candidates.push(foresightTrace);

    const preparednessTrace = buildPreparednessReasoningTrace(input, now);
    if (preparednessTrace) candidates.push(preparednessTrace);

    const executiveGrade = buildExecutiveGradeExplainability(candidates, activeLayers, now);
    if (executiveGrade) candidates.push(executiveGrade);

    const retained = candidates
      .filter(shouldRetainExecutiveReasoningTrace)
      .sort(
        (a, b) =>
          transparencyStateRank(b.transparencyState) - transparencyStateRank(a.transparencyState) ||
          explanationStrengthRank(b.explanationStrength) -
            explanationStrengthRank(a.explanationStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_traces",
        snapshot: prior.snapshots[0] ?? null,
        newReasoningTraces: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.reasoningTraces.map((t) => t.explainabilityId));
    const newCount = retained.filter((t) => !priorIds.has(t.explainabilityId)).length;

    const signals = retained.map((t) => buildTransparentSignal(t, now));
    const pathways = retained
      .flatMap((t) => [
        buildCognitionPathway(t, "foresight", "decision_orchestration", now),
        buildCognitionPathway(t, "institutional_memory", "governance", now),
        buildCognitionPathway(t, "meta_cognition", "confidence_arbitration", now),
      ])
      .filter((p): p is EnterpriseCognitionPathway => p !== null);
    const confidenceFields = retained.map((t) => buildExplanationConfidenceField(t, now));

    store.upsertReasoningTraces(retained, now);
    store.upsertTransparentReasoningSignals(signals, now);
    store.upsertCognitionPathways(pathways, now);
    store.upsertExplanationConfidenceFields(confidenceFields, now);

    const snapshot = buildExplanationSnapshot(
      organizationId,
      retained,
      signals,
      pathways,
      confidenceFields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastTransparencyState(snapshot.awarenessSummary.dominantTransparencyState);

    const finalState = store.getState();
    const priorTransparency = prior.lastTransparencyState;

    if (governanceTrace || executiveGrade) {
      devLog("major reasoning trace formation — transparent explainability active");
    }

    if (priorTransparency && priorTransparency !== snapshot.awarenessSummary.dominantTransparencyState) {
      if (snapshot.awarenessSummary.dominantTransparencyState === "partial") {
        devLog("transparency degradation — reasoning trace completeness reduced");
      } else if (
        snapshot.awarenessSummary.dominantTransparencyState === "fully_transparent" ||
        snapshot.awarenessSummary.dominantTransparencyState === "explainable"
      ) {
        devLog("transparency recovery — executive reasoning pathways clarified");
      }
    }

    if (executiveGrade) {
      devLog("executive-grade explainability generation — cross-runtime auditability verified");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newReasoningTraces: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endExplainabilityEvaluation();
  }
}
