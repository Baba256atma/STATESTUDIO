import { stableSignature } from "../intelligence/shared/dedupe";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import { getActionDependencyStore } from "./actionDependencyStore";
import { getAdaptiveSequencingStore } from "./adaptiveSequencingStore";
import type { AdaptiveSequencingSnapshot } from "./adaptiveSequencingTypes";
import { getDecisionConfidenceStore } from "./decisionConfidenceStore";
import type { ConfidenceArbitrationSnapshot } from "./decisionConfidenceTypes";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type { ActionCategory, DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import { getPriorityArbitrationStore } from "./priorityArbitrationStore";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import { getScenarioCoordinationStore } from "./scenarioCoordinationStore";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import {
  alignmentStrengthRank,
  beginInstitutionalAlignmentEvaluation,
  clampAlignmentConfidence,
  coherenceStateRank,
  endInstitutionalAlignmentEvaluation,
  shouldEvaluateInstitutionalAlignment,
  shouldRetainEnterprisePolicyAlignment,
} from "./institutionalAlignmentGuards";
import { getInstitutionalAlignmentStore } from "./institutionalAlignmentStore";
import type {
  AlignmentCategory,
  AlignmentStrength,
  CoherenceState,
  EnterprisePolicyAlignment,
  GovernanceCoherenceSnapshot,
  InstitutionalAlignmentIntelligenceInput,
  InstitutionalAlignmentIntelligenceResult,
  InstitutionalAlignmentSignal,
  InstitutionalAlignmentSummary,
  OrganizationalIntegrityField,
  StrategicConsistencyIndicator,
} from "./institutionalAlignmentTypes";

const DEV_LOG_PREFIX = "[Nexora][InstitutionalAlignment]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildAlignmentId(label: string): string {
  return stableSignature(["institutional-alignment", label]).slice(0, 56);
}

function createPolicyAlignment(
  label: string,
  coherenceState: CoherenceState,
  alignmentStrength: AlignmentStrength,
  category: AlignmentCategory,
  summary: string,
  alignmentSignals: string[],
  coherenceRisks: string[],
  confidence: number,
  now: number
): EnterprisePolicyAlignment {
  const conf = clampAlignmentConfidence(confidence);
  return {
    alignmentId: buildAlignmentId(label),
    coherenceState,
    alignmentStrength,
    alignmentCategory: category,
    summary,
    alignmentSignals: Object.freeze(alignmentSignals),
    coherenceRisks: Object.freeze(coherenceRisks),
    confidence: conf,
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function orchestrationIncludes(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  category: ActionCategory
): boolean {
  return (
    coordinationSnapshot?.recentStrategicOrchestrations.some((o) =>
      o.actionSequence.includes(category)
    ) ?? false
  );
}

function buildStabilizationResilienceAlignment(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  resilienceLine: string,
  now: number
): EnterprisePolicyAlignment | null {
  const stabilization =
    orchestrationIncludes(coordinationSnapshot, "governance_alignment") ||
    orchestrationIncludes(coordinationSnapshot, "coordination_stabilization");
  const resilience =
    orchestrationIncludes(coordinationSnapshot, "resilience_reinforcement") ||
    resilienceLine.includes("strengthen");

  if (!stabilization || !resilience) return null;

  return createPolicyAlignment(
    "enterprise_governance_alignment",
    "coherent",
    "strong",
    "governance",
    "Governance stabilization, resilience reinforcement, and operational continuity remain strategically aligned across current orchestration pathways.",
    [
      "governance_consistency",
      "resilience_stability",
      "coordination_integrity",
      "operational_continuity",
    ],
    ["execution_speed_pressure"],
    0.9,
    now
  );
}

function buildAccelerationGovernanceConflict(
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  sequencingSnapshot: AdaptiveSequencingSnapshot | null,
  now: number
): EnterprisePolicyAlignment | null {
  const speedTension = arbitrationSnapshot?.recentExecutiveArbitrations.some(
    (a) =>
      a.competingPriorities.includes("operational_speed") &&
      (a.tradeoffType === "conflicting" || a.tradeoffType === "competing")
  );
  const rapidSequencing = sequencingSnapshot?.recentAdaptiveSequences.some(
    (s) => s.sequencingTransitions.some((t) => t.current === "recovery_acceleration")
  );

  if (!speedTension && !rapidSequencing) return null;

  return createPolicyAlignment(
    "operational_acceleration_governance_conflict",
    "conflicting",
    "moderate",
    "strategic_consistency",
    "Operational acceleration objectives weaken governance coherence as execution-speed pressure conflicts with stabilization sequencing.",
    ["execution_speed_pressure"],
    ["governance_delay", "execution_constraint", "coherence_fragmentation"],
    0.68,
    now
  );
}

function buildRecoverySustainabilityReinforcement(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  scenarioSnapshot: ScenarioCoordinationSnapshot | null,
  now: number
): EnterprisePolicyAlignment | null {
  const recovery = orchestrationIncludes(coordinationSnapshot, "recovery_acceleration");
  const reinforcingTopology = scenarioSnapshot?.recentResponseTopologies.some((t) =>
    t.interactionRelationships.some((r) => r.relationship === "reinforcing" || r.relationship === "stabilizing")
  );

  if (!recovery || !reinforcingTopology) return null;

  return createPolicyAlignment(
    "recovery_sustainability_reinforcement",
    "stabilizing",
    "strong",
    "recovery_sustainability",
    "Recovery coordination pathways reinforce strategic consistency by supporting sustainable stabilization across interconnected response topologies.",
    ["recovery_sustainability", "strategic_consistency", "coordination_coherence"],
    [],
    0.84,
    now
  );
}

function buildEscalationResilienceTension(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  fragilityElevated: boolean,
  now: number
): EnterprisePolicyAlignment | null {
  const escalationActive =
    anticipatorySnapshot?.summary.earlyWarningState === "emerging" ||
    anticipatorySnapshot?.summary.earlyWarningState === "intensifying" ||
    fragilityElevated;
  const resilienceConflict = arbitrationSnapshot?.recentExecutiveArbitrations.some(
    (a) =>
      a.competingPriorities.includes("resilience") &&
      a.competingPriorities.includes("operational_speed")
  );

  if (!escalationActive || !resilienceConflict) return null;

  return createPolicyAlignment(
    "escalation_resilience_governance_tension",
    "conflicting",
    "moderate",
    "resilience",
    "Escalation containment sequencing creates governance tension when resilience stability requirements conflict with rapid operational response pressure.",
    ["escalation_containment"],
    ["resilience_instability", "operational_speed_pressure"],
    0.71,
    now
  );
}

function buildInstitutionalGradeContinuityAlignment(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  confidenceSnapshot: ConfidenceArbitrationSnapshot | null,
  maturitySnapshot: InstitutionalIntelligenceMaturitySnapshot | null,
  continuityPreserved: boolean,
  now: number
): EnterprisePolicyAlignment | null {
  const orchestrationDepth = (coordinationSnapshot?.orchestrationCount ?? 0) >= 2;
  const highConfidence =
    confidenceSnapshot?.coordinationSummary.certaintyPosture === "high" ||
    confidenceSnapshot?.coordinationSummary.certaintyPosture === "executive_grade";
  const maturityStable =
    maturitySnapshot?.dominantMaturityLevel === "resilient" ||
    maturitySnapshot?.dominantMaturityLevel === "strategically_mature";

  if (!orchestrationDepth || !continuityPreserved) return null;
  if (!highConfidence && !maturityStable) return null;

  return createPolicyAlignment(
    "institutional_grade_continuity_alignment",
    "institutionally_aligned",
    "institutional_grade",
    "executive_alignment",
    "Multiple orchestration pathways supporting continuity form institutional-grade coherence across governance, resilience, and strategic alignment layers.",
    [
      "governance_consistency",
      "operational_continuity",
      "organizational_integrity",
      "executive_alignment",
    ],
    [],
    0.92,
    now
  );
}

function buildAdaptiveGovernanceIntegrityAlignment(
  sequencingSnapshot: AdaptiveSequencingSnapshot | null,
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  now: number
): EnterprisePolicyAlignment | null {
  const governanceSequencing = sequencingSnapshot?.recentAdaptiveSequences.some(
    (s) =>
      s.sequencingTransitions.some((t) => t.current === "governance_alignment") ||
      s.adaptationCategory === "governance_transition"
  );
  const governanceOrchestration = orchestrationIncludes(
    coordinationSnapshot,
    "governance_alignment"
  );

  if (!governanceSequencing || !governanceOrchestration) return null;

  return createPolicyAlignment(
    "adaptive_governance_integrity_alignment",
    "coherent",
    "strong",
    "organizational_integrity",
    "Adaptive sequencing maintains governance integrity by elevating alignment pathways without destabilizing institutional continuity requirements.",
    ["governance_consistency", "coordination_integrity", "organizational_integrity"],
    [],
    0.87,
    now
  );
}

function buildAlignmentSignal(
  label: string,
  summary: string,
  categories: AlignmentCategory[],
  coherenceState: CoherenceState,
  strength: AlignmentStrength,
  confidence: number,
  now: number
): InstitutionalAlignmentSignal {
  return {
    signalId: stableSignature(["alignment-signal", label]).slice(0, 48),
    signalLabel: label,
    signalSummary: summary,
    linkedCategories: Object.freeze(categories),
    coherenceState,
    alignmentStrength: strength,
    confidence: clampAlignmentConfidence(confidence),
    generatedAt: now,
  };
}

function buildConsistencyIndicator(
  label: string,
  summary: string,
  categories: AlignmentCategory[],
  level: StrategicConsistencyIndicator["consistencyLevel"],
  now: number
): StrategicConsistencyIndicator {
  return {
    indicatorId: stableSignature(["consistency-indicator", label]).slice(0, 48),
    indicatorLabel: label,
    consistencySummary: summary,
    linkedCategories: Object.freeze(categories),
    consistencyLevel: level,
    generatedAt: now,
  };
}

function buildIntegrityField(
  label: string,
  summary: string,
  categories: AlignmentCategory[],
  level: OrganizationalIntegrityField["integrityLevel"],
  now: number
): OrganizationalIntegrityField {
  return {
    fieldId: stableSignature(["integrity-field", label]).slice(0, 48),
    fieldLabel: label,
    fieldSummary: summary,
    integrityLevel: level,
    linkedCategories: Object.freeze(categories),
    generatedAt: now,
  };
}

function buildGovernanceCoherenceSnapshot(
  organizationId: string,
  alignments: EnterprisePolicyAlignment[],
  signals: InstitutionalAlignmentSignal[],
  indicators: StrategicConsistencyIndicator[],
  fields: OrganizationalIntegrityField[],
  now: number
): GovernanceCoherenceSnapshot {
  const top = alignments[0];
  const alignmentSummary: InstitutionalAlignmentSummary = top
    ? {
        dominantCoherenceState: top.coherenceState,
        dominantAlignmentStrength: top.alignmentStrength,
        alignmentHeadline: top.summary,
        coherencePosture:
          top.alignmentStrength === "institutional_grade" &&
          top.coherenceState === "institutionally_aligned"
            ? "institutional_grade"
            : top.coherenceState === "conflicting" || top.coherenceState === "fragmented"
              ? "low"
              : top.coherenceState === "coherent" || top.coherenceState === "institutionally_aligned"
                ? "high"
                : "moderate",
      }
    : {
        dominantCoherenceState: "fragmented",
        dominantAlignmentStrength: "weak",
        alignmentHeadline:
          "Institutional alignment awaiting sufficient confidence and orchestration depth.",
        coherencePosture: "low",
      };

  const signature = stableSignature([
    "d9-5-7-governance-coherence-snapshot",
    organizationId,
    alignments.map((a) => a.alignmentId),
    alignmentSummary.coherencePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    alignmentCount: alignments.length,
    alignmentSummary,
    recentPolicyAlignments: Object.freeze(alignments.slice(0, 6)),
    alignmentSignals: Object.freeze(signals.slice(0, 6)),
    consistencyIndicators: Object.freeze(indicators.slice(0, 6)),
    integrityFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateInstitutionalAlignmentIntelligence(
  input: InstitutionalAlignmentIntelligenceInput
): InstitutionalAlignmentIntelligenceResult {
  if (!beginInstitutionalAlignmentEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newPolicyAlignments: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getInstitutionalAlignmentStore(organizationId);
    const prior = store.getState();

    const orchestrationState = getDecisionOrchestrationStore(organizationId).getState();
    const dependencyState = getActionDependencyStore(organizationId).getState();
    const arbitrationState = getPriorityArbitrationStore(organizationId).getState();
    const scenarioState = getScenarioCoordinationStore(organizationId).getState();
    const sequencingState = getAdaptiveSequencingStore(organizationId).getState();
    const confidenceState = getDecisionConfidenceStore(organizationId).getState();
    const foresightState = getUnifiedForesightRuntimeStore(organizationId).getState();

    const coordinationSnapshot =
      input.coordinationSnapshot ?? orchestrationState.snapshots[0] ?? null;
    const dependencySnapshot =
      input.dependencySnapshot ?? dependencyState.snapshots[0] ?? null;
    const arbitrationSnapshot =
      input.arbitrationSnapshot ?? arbitrationState.snapshots[0] ?? null;
    const scenarioSnapshot =
      input.scenarioSnapshot ?? scenarioState.snapshots[0] ?? null;
    const sequencingSnapshot =
      input.sequencingSnapshot ?? sequencingState.snapshots[0] ?? null;
    const confidenceSnapshot =
      input.confidenceSnapshot ?? confidenceState.snapshots[0] ?? null;
    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-7-institutional-alignment-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      coordinationSnapshot?.signature ?? orchestrationState.signature,
      dependencySnapshot?.signature ?? dependencyState.signature,
      arbitrationSnapshot?.signature ?? arbitrationState.signature,
      scenarioSnapshot?.signature ?? scenarioState.signature,
      sequencingSnapshot?.signature ?? sequencingState.signature,
      confidenceSnapshot?.signature ?? confidenceState.signature,
      anticipatorySnapshot?.signature ?? foresightState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
      input.maturitySnapshot?.signature ?? "no-maturity",
    ]);

    if (
      !shouldEvaluateInstitutionalAlignment(
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
        newPolicyAlignments: 0,
        storeSignature: prior.signature,
      };
    }

    const alignmentDepth =
      (coordinationSnapshot?.orchestrationCount ?? 0) +
      (dependencySnapshot?.graphCount ?? 0) +
      (arbitrationSnapshot?.arbitrationCount ?? 0) +
      (scenarioSnapshot?.topologyCount ?? 0) +
      (sequencingSnapshot?.sequenceCount ?? 0) +
      (confidenceSnapshot?.confidenceCount ?? 0);

    if (alignmentDepth < 6) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_alignment_depth",
        snapshot: prior.snapshots[0] ?? null,
        newPolicyAlignments: 0,
        storeSignature: prior.signature,
      };
    }

    const resilienceLine =
      input.resilienceForecastLine ?? input.cognitionSnapshot?.resilienceForecastLine ?? "";
    const fragilityElevated = input.fragilityElevated ?? false;
    const continuityPreserved = input.continuityPreserved ?? true;

    const candidates: EnterprisePolicyAlignment[] = [];

    const stabilizationAlignment = buildStabilizationResilienceAlignment(
      coordinationSnapshot,
      resilienceLine,
      now
    );
    if (stabilizationAlignment) candidates.push(stabilizationAlignment);

    const accelerationConflict = buildAccelerationGovernanceConflict(
      arbitrationSnapshot,
      sequencingSnapshot,
      now
    );
    if (accelerationConflict) candidates.push(accelerationConflict);

    const recoveryReinforcement = buildRecoverySustainabilityReinforcement(
      coordinationSnapshot,
      scenarioSnapshot,
      now
    );
    if (recoveryReinforcement) candidates.push(recoveryReinforcement);

    const escalationTension = buildEscalationResilienceTension(
      anticipatorySnapshot,
      arbitrationSnapshot,
      fragilityElevated,
      now
    );
    if (escalationTension) candidates.push(escalationTension);

    const institutionalGrade = buildInstitutionalGradeContinuityAlignment(
      coordinationSnapshot,
      confidenceSnapshot,
      input.maturitySnapshot ?? null,
      continuityPreserved,
      now
    );
    if (institutionalGrade) candidates.push(institutionalGrade);

    const governanceIntegrity = buildAdaptiveGovernanceIntegrityAlignment(
      sequencingSnapshot,
      coordinationSnapshot,
      now
    );
    if (governanceIntegrity) candidates.push(governanceIntegrity);

    if (
      input.memorySnapshot?.continuityConcernActive &&
      (dependencySnapshot?.bottleneckIndicators.length ?? 0) >= 1
    ) {
      candidates.push(
        createPolicyAlignment(
          "institutional_memory_coherence_gap",
          "fragmented",
          "weak",
          "organizational_integrity",
          "Institutional memory continuity concerns indicate fragmented governance coherence across operational dependency pathways.",
          ["organizational_integrity"],
          ["continuity_disruption", "partial_coordination_visibility"],
          0.56,
          now
        )
      );
    }

    const retained = candidates
      .filter(shouldRetainEnterprisePolicyAlignment)
      .sort(
        (a, b) =>
          coherenceStateRank(b.coherenceState) - coherenceStateRank(a.coherenceState) ||
          alignmentStrengthRank(b.alignmentStrength) -
            alignmentStrengthRank(a.alignmentStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_alignments",
        snapshot: prior.snapshots[0] ?? null,
        newPolicyAlignments: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.policyAlignments.map((a) => a.alignmentId));
    const newCount = retained.filter((a) => !priorIds.has(a.alignmentId)).length;

    const alignmentSignals = retained.map((a) =>
      buildAlignmentSignal(
        a.alignmentId,
        a.summary.slice(0, 100),
        [a.alignmentCategory],
        a.coherenceState,
        a.alignmentStrength,
        a.confidence,
        now
      )
    );

    const consistencyIndicators = retained
      .filter((a) => a.coherenceState === "coherent" || a.coherenceState === "institutionally_aligned")
      .map((a) =>
        buildConsistencyIndicator(
          a.alignmentId,
          a.summary.slice(0, 100),
          [a.alignmentCategory, "strategic_consistency"],
          a.alignmentStrength === "institutional_grade" ? "high" : "moderate",
          now
        )
      );

    const integrityFields = retained.map((a) =>
      buildIntegrityField(
        a.alignmentId,
        a.summary.slice(0, 100),
        [a.alignmentCategory, "organizational_integrity"],
        a.coherenceState === "institutionally_aligned" ? "high" : a.coherenceState === "conflicting" ? "low" : "moderate",
        now
      )
    );

    store.upsertPolicyAlignments(retained, now);
    store.upsertAlignmentSignals(alignmentSignals, now);
    store.upsertConsistencyIndicators(consistencyIndicators, now);
    store.upsertIntegrityFields(integrityFields, now);

    const snapshot = buildGovernanceCoherenceSnapshot(
      organizationId,
      retained,
      alignmentSignals,
      consistencyIndicators,
      integrityFields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (institutionalGrade) {
      devLog("institutional-grade alignment formation — governance coherence stabilized");
    }
    if (accelerationConflict || escalationTension) {
      devLog("governance conflict emergence — coherence tension across orchestration pathways");
    }
    if (stabilizationAlignment || governanceIntegrity) {
      devLog("major coherence stabilization — enterprise alignment pathways reinforced");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newPolicyAlignments: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endInstitutionalAlignmentEvaluation();
  }
}
