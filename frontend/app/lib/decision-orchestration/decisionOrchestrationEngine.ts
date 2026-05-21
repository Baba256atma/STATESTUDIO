import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdvisoryForesightStore } from "../foresight-cognition/advisoryForesightStore";
import { getPreparednessCognitionStore } from "../foresight-cognition/preparednessCognitionStore";
import { getInterventionTimingStore } from "../foresight-cognition/interventionTimingStore";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import type { RecommendationCategory } from "../foresight-cognition/advisoryForesightTypes";
import type { EnterpriseRecommendationSnapshot } from "../foresight-cognition/advisoryForesightTypes";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import type { InterventionWindowSnapshot } from "../foresight-cognition/interventionTimingTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import { getOperationalReplayStore } from "../temporal-cognition/operationalReplayStore";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import {
  beginDecisionOrchestrationEvaluation,
  confidenceToReadinessLevel,
  endDecisionOrchestrationEvaluation,
  priorityRank,
  readinessRank,
  shouldEvaluateDecisionOrchestration,
  shouldRetainStrategicDecisionOrchestration,
} from "./decisionOrchestrationGuards";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type {
  ActionCategory,
  ActionPriority,
  ActionReadinessSignal,
  DecisionCoordinationSnapshot,
  ExecutiveActionCandidate,
  ExecutiveDecisionOrchestrationInput,
  ExecutiveDecisionOrchestrationResult,
  OperationalResponseSequence,
  OrganizationalResponseDependency,
  OrchestrationAwarenessSummary,
  ReadinessState,
  StrategicDecisionOrchestration,
} from "./decisionOrchestrationTypes";

const DEV_LOG_PREFIX = "[Nexora][DecisionOrchestration]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildOrchestrationId(label: string, priority: ActionPriority): string {
  return stableSignature(["decision-orchestration", label, priority]).slice(0, 56);
}

function mapAdvisoryToActionCategory(category: RecommendationCategory): ActionCategory {
  switch (category) {
    case "governance_alignment":
      return "governance_alignment";
    case "escalation_prevention":
      return "escalation_prevention";
    case "resilience_reinforcement":
      return "resilience_reinforcement";
    case "coordination_stabilization":
      return "coordination_stabilization";
    case "pressure_reduction":
      return "pressure_reduction";
    case "recovery_acceleration":
      return "recovery_acceleration";
    case "operational_focus":
      return "operational_realignment";
    case "strategic_realignment":
      return "strategic_focus";
    default:
      return "unknown";
  }
}

function collectActionCandidates(
  advisorySnapshot: EnterpriseRecommendationSnapshot | null,
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  narrativeLine: string,
  now: number
): ExecutiveActionCandidate[] {
  const candidates: ExecutiveActionCandidate[] = [];

  for (const r of advisorySnapshot?.recentExecutiveGuidanceRecommendations ?? []) {
    const category = mapAdvisoryToActionCategory(r.category);
    if (category === "unknown") continue;
    candidates.push({
      candidateId: stableSignature(["action-candidate", category, r.advisoryId]).slice(0, 48),
      category,
      actionPriority:
        r.recommendationPriority === "critical"
          ? "critical"
          : r.recommendationPriority === "elevated"
            ? "elevated"
            : r.recommendationPriority === "moderate"
              ? "moderate"
              : "informational",
      readinessState: "identified",
      actionLabel: category.replace(/_/g, " "),
      actionSummary: r.summary,
      confidence: r.confidence,
      generatedAt: now,
      lastObservedAt: now,
      occurrenceCount: 1,
    });
  }

  if (anticipatorySnapshot) {
    const focus = anticipatorySnapshot.summary.recommendedFocus;
    if (focus.includes("governance") || focus.includes("stabilization")) {
      candidates.push({
        candidateId: stableSignature(["action-candidate", "governance_alignment", "foresight"]).slice(
          0,
          48
        ),
        category: "governance_alignment",
        actionPriority: anticipatorySnapshot.foresightHealth === "executive_grade" ? "elevated" : "moderate",
        readinessState: "organizing",
        actionLabel: "governance alignment",
        actionSummary: focus,
        confidence: 0.72,
        generatedAt: now,
        lastObservedAt: now,
        occurrenceCount: 1,
      });
    }
    if (
      anticipatorySnapshot.summary.earlyWarningState === "emerging" ||
      anticipatorySnapshot.summary.earlyWarningState === "intensifying"
    ) {
      candidates.push({
        candidateId: stableSignature(["action-candidate", "escalation_prevention", "foresight"]).slice(
          0,
          48
        ),
        category: "escalation_prevention",
        actionPriority: "elevated",
        readinessState: "sequencing",
        actionLabel: "escalation prevention",
        actionSummary: anticipatorySnapshot.summary.dominantRisk,
        confidence: 0.76,
        generatedAt: now,
        lastObservedAt: now,
        occurrenceCount: 1,
      });
    }
  }

  if (narrativeLine.includes("coordination strain") || narrativeLine.includes("pressure")) {
    candidates.push({
      candidateId: stableSignature(["action-candidate", "pressure_reduction", "narrative"]).slice(0, 48),
      category: "pressure_reduction",
      actionPriority: "moderate",
      readinessState: "identified",
      actionLabel: "pressure reduction",
      actionSummary: narrativeLine.slice(0, 120),
      confidence: 0.65,
      generatedAt: now,
      lastObservedAt: now,
      occurrenceCount: 1,
    });
  }

  return candidates;
}

function buildDependency(
  prerequisite: ActionCategory,
  dependent: ActionCategory,
  summary: string,
  now: number
): OrganizationalResponseDependency {
  return {
    dependencyId: stableSignature(["dependency", prerequisite, dependent]).slice(0, 48),
    prerequisiteCategory: prerequisite,
    dependentCategory: dependent,
    dependencySummary: summary,
    sensitivity: "elevated",
    generatedAt: now,
  };
}

function createOrchestration(
  label: string,
  readinessState: ReadinessState,
  actionPriority: ActionPriority,
  summary: string,
  actionSequence: ActionCategory[],
  dependencies: string[],
  confidence: number,
  now: number
): StrategicDecisionOrchestration {
  const conf = Number(Math.min(0.94, Math.max(0.5, confidence)).toFixed(2));
  return {
    orchestrationId: buildOrchestrationId(label, actionPriority),
    readinessState,
    actionPriority,
    summary,
    actionSequence: Object.freeze(actionSequence),
    dependencies: Object.freeze(dependencies),
    confidence: conf,
    confidenceLevel: confidenceToReadinessLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildStabilizationSequenceOrchestration(
  dependencies: OrganizationalResponseDependency[],
  now: number
): StrategicDecisionOrchestration | null {
  const sequence: ActionCategory[] = [
    "governance_alignment",
    "pressure_reduction",
    "coordination_stabilization",
    "recovery_acceleration",
  ];
  const depKeys = dependencies.map(
    (d) => `${d.dependentCategory}_requires_${d.prerequisiteCategory}`
  );

  return createOrchestration(
    "enterprise_stabilization_sequence",
    "coordinated",
    "elevated",
    "Governance stabilization and operational pressure reduction should be coordinated before escalation propagation expands further across dependent systems.",
    sequence,
    depKeys.length > 0 ? depKeys : ["pressure_reduction_requires_governance_alignment"],
    0.88,
    now
  );
}

function buildResilienceRecoverySequence(
  dependencies: OrganizationalResponseDependency[],
  now: number
): StrategicDecisionOrchestration | null {
  const sequence: ActionCategory[] = [
    "pressure_reduction",
    "resilience_reinforcement",
    "recovery_acceleration",
  ];

  return createOrchestration(
    "resilience_recovery_sequence",
    "sequencing",
    "moderate",
    "Recovery reinforcement should follow pressure reduction so resilience coordination stabilizes before acceleration actions begin.",
    sequence,
    [
      "recovery_acceleration_requires_pressure_reduction",
      ...dependencies.map((d) => `${d.dependentCategory}_requires_${d.prerequisiteCategory}`),
    ].slice(0, 4),
    0.82,
    now
  );
}

function buildEscalationCriticalOrchestration(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  replaySnapshot: OrganizationalReplaySnapshot | null,
  now: number
): StrategicDecisionOrchestration | null {
  const escalationSpread =
    anticipatorySnapshot?.summary.earlyWarningState === "intensifying" ||
    anticipatorySnapshot?.summary.earlyWarningState === "spreading" ||
    (replaySnapshot?.replayCount ?? 0) >= 2;

  if (!escalationSpread) return null;

  return createOrchestration(
    "escalation_containment_priority",
    "ready",
    "critical",
    "Escalation signals are spreading across operational replay patterns; escalation prevention must be prioritized before secondary stabilization actions.",
    ["escalation_prevention", "coordination_stabilization", "governance_alignment"],
    [],
    0.9,
    now
  );
}

function buildPreparednessTimingReadiness(
  preparednessSnapshot: EnterprisePreparednessSnapshot | null,
  interventionSnapshot: InterventionWindowSnapshot | null,
  now: number
): { orchestration: StrategicDecisionOrchestration | null; signal: ActionReadinessSignal | null } {
  const weakPreparedness =
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "weak" ||
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "limited";
  const narrowingWindow = interventionSnapshot?.recentStrategicInterventionWindows.some(
    (w) => w.windowState === "narrowing" || w.windowState === "closing"
  );

  if (!weakPreparedness || !narrowingWindow) {
    return { orchestration: null, signal: null };
  }

  const orchestration = createOrchestration(
    "elevated_action_readiness_window",
    "ready",
    "elevated",
    "Weak preparedness combined with a narrowing intervention window elevates action readiness for governance alignment and pressure reduction sequencing.",
    ["governance_alignment", "pressure_reduction", "escalation_prevention"],
    ["escalation_prevention_requires_governance_alignment"],
    0.86,
    now
  );

  const signal: ActionReadinessSignal = {
    signalId: stableSignature(["readiness-signal", "elevated", "timing"]).slice(0, 48),
    category: "governance_alignment",
    signalLabel: "elevated action readiness",
    signalSummary: orchestration.summary,
    readinessState: "ready",
    actionPriority: "elevated",
    confidence: 0.86,
    generatedAt: now,
  };

  return { orchestration, signal };
}

function buildAdaptiveOpportunityFocus(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  resilienceForecastLine: string,
  now: number
): StrategicDecisionOrchestration | null {
  const strongOpportunity =
    anticipatorySnapshot?.summary.dominantOpportunity.includes("strengthening") ||
    anticipatorySnapshot?.summary.dominantOpportunity.includes("growth") ||
    resilienceForecastLine.includes("strengthen");

  if (!strongOpportunity) return null;

  return createOrchestration(
    "adaptive_operational_focus",
    "coordinated",
    "moderate",
    "Strong resilience growth opportunity suggests adaptive operational focus on strategic alignment before broad recovery acceleration.",
    ["strategic_focus", "resilience_reinforcement", "operational_realignment"],
    [],
    0.8,
    now
  );
}

function buildResponseSequence(
  orchestration: StrategicDecisionOrchestration,
  now: number
): OperationalResponseSequence {
  return {
    sequenceId: stableSignature(["response-sequence", orchestration.orchestrationId]).slice(0, 48),
    sequenceLabel: orchestration.orchestrationId,
    actionSequence: orchestration.actionSequence,
    readinessState: orchestration.readinessState,
    actionPriority: orchestration.actionPriority,
    sequenceSummary: orchestration.summary,
    linkedOrchestrationId: orchestration.orchestrationId,
    generatedAt: now,
  };
}

function buildCoordinationSnapshot(
  organizationId: string,
  orchestrations: StrategicDecisionOrchestration[],
  signals: ActionReadinessSignal[],
  sequences: OperationalResponseSequence[],
  dependencies: OrganizationalResponseDependency[],
  now: number
): DecisionCoordinationSnapshot {
  const top = orchestrations[0];
  const awarenessSummary: OrchestrationAwarenessSummary = top
    ? {
        dominantCategory: top.actionSequence[0] ?? "governance_alignment",
        dominantReadinessState: top.readinessState,
        dominantActionPriority: top.actionPriority,
        orchestrationHeadline: top.summary,
        coordinationStability:
          top.readinessState === "coordinated" || top.readinessState === "ready"
            ? top.actionPriority === "critical"
              ? "executive_grade"
              : "strong"
            : "moderate",
      }
    : {
        dominantCategory: "unknown",
        dominantReadinessState: "identified",
        dominantActionPriority: "informational",
        orchestrationHeadline: "Decision orchestration awaiting sufficient action-readiness depth.",
        coordinationStability: "low",
      };

  const signature = stableSignature([
    "d9-5-1-coordination-snapshot",
    organizationId,
    orchestrations.map((o) => o.orchestrationId),
    awarenessSummary.coordinationStability,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    orchestrationCount: orchestrations.length,
    awarenessSummary,
    recentStrategicOrchestrations: Object.freeze(orchestrations.slice(0, 6)),
    actionReadinessSignals: Object.freeze(signals.slice(0, 6)),
    responseSequences: Object.freeze(sequences.slice(0, 6)),
    responseDependencies: Object.freeze(dependencies.slice(0, 6)),
  };
}

export function evaluateExecutiveDecisionOrchestration(
  input: ExecutiveDecisionOrchestrationInput
): ExecutiveDecisionOrchestrationResult {
  if (!beginDecisionOrchestrationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newStrategicOrchestrations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getDecisionOrchestrationStore(organizationId);
    const prior = store.getState();

    const foresightState = getUnifiedForesightRuntimeStore(organizationId).getState();
    const advisoryState = getAdvisoryForesightStore(organizationId).getState();
    const preparednessState = getPreparednessCognitionStore(organizationId).getState();
    const interventionState = getInterventionTimingStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();

    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;
    const advisorySnapshot = input.advisorySnapshot ?? advisoryState.snapshots[0] ?? null;
    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;
    const interventionSnapshot =
      input.interventionSnapshot ?? interventionState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-1-orchestration-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      anticipatorySnapshot?.signature ?? foresightState.signature,
      advisorySnapshot?.signature ?? advisoryState.signature,
      preparednessSnapshot?.signature ?? preparednessState.signature,
      interventionSnapshot?.signature ?? interventionState.signature,
      replaySnapshot?.signature ?? replayState.signature,
    ]);

    if (
      !shouldEvaluateDecisionOrchestration(
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
        newStrategicOrchestrations: 0,
        storeSignature: prior.signature,
      };
    }

    const orchestrationDepth =
      (advisorySnapshot?.recommendationCount ?? 0) +
      (anticipatorySnapshot?.runtimeHealth.layerDepth ?? 0) +
      (preparednessSnapshot?.signalCount ?? 0);

    if (orchestrationDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_orchestration_depth",
        snapshot: prior.snapshots[0] ?? null,
        newStrategicOrchestrations: 0,
        storeSignature: prior.signature,
      };
    }

    const narrativeLine = input.enterpriseNarrativeLine ?? "";
    const resilienceForecastLine = input.resilienceForecastLine ?? "";

    const candidates = collectActionCandidates(
      advisorySnapshot,
      anticipatorySnapshot,
      narrativeLine,
      now
    );

    const dependencies: OrganizationalResponseDependency[] = [
      buildDependency(
        "governance_alignment",
        "pressure_reduction",
        "Pressure reduction requires governance alignment to stabilize decision authority first.",
        now
      ),
      buildDependency(
        "pressure_reduction",
        "recovery_acceleration",
        "Recovery acceleration should follow measurable pressure reduction.",
        now
      ),
      buildDependency(
        "governance_alignment",
        "escalation_prevention",
        "Escalation prevention depends on governance stabilization sequencing.",
        now
      ),
    ];

    const candidatesOrchestrations: StrategicDecisionOrchestration[] = [];

    const stabilization = buildStabilizationSequenceOrchestration(dependencies, now);
    if (stabilization) candidatesOrchestrations.push(stabilization);

    const recovery = buildResilienceRecoverySequence(dependencies, now);
    if (recovery) candidatesOrchestrations.push(recovery);

    const escalation = buildEscalationCriticalOrchestration(
      anticipatorySnapshot,
      replaySnapshot,
      now
    );
    if (escalation) candidatesOrchestrations.push(escalation);

    const preparednessTiming = buildPreparednessTimingReadiness(
      preparednessSnapshot,
      interventionSnapshot,
      now
    );
    if (preparednessTiming.orchestration) {
      candidatesOrchestrations.push(preparednessTiming.orchestration);
    }

    const adaptive = buildAdaptiveOpportunityFocus(
      anticipatorySnapshot,
      resilienceForecastLine,
      now
    );
    if (adaptive) candidatesOrchestrations.push(adaptive);

    const retained = candidatesOrchestrations
      .filter(shouldRetainStrategicDecisionOrchestration)
      .sort(
        (a, b) =>
          priorityRank(b.actionPriority) - priorityRank(a.actionPriority) ||
          readinessRank(b.readinessState) - readinessRank(a.readinessState) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_orchestrations",
        snapshot: prior.snapshots[0] ?? null,
        newStrategicOrchestrations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.strategicOrchestrations.map((o) => o.orchestrationId));
    const newCount = retained.filter((o) => !priorIds.has(o.orchestrationId)).length;

    store.upsertStrategicOrchestrations(retained, now);
    store.upsertActionCandidates(candidates, now);

    const readinessSignals: ActionReadinessSignal[] = [];
    if (preparednessTiming.signal) readinessSignals.push(preparednessTiming.signal);
    for (const o of retained) {
      readinessSignals.push({
        signalId: stableSignature(["readiness", o.orchestrationId]).slice(0, 48),
        category: o.actionSequence[0] ?? "governance_alignment",
        signalLabel: o.readinessState,
        signalSummary: o.summary.slice(0, 140),
        readinessState: o.readinessState,
        actionPriority: o.actionPriority,
        confidence: o.confidence,
        generatedAt: now,
      });
    }
    store.upsertActionReadinessSignals(readinessSignals, now);

    const sequences = retained.map((o) => buildResponseSequence(o, now));
    store.upsertResponseSequences(sequences, now);
    store.upsertResponseDependencies(dependencies, now);

    const snapshot = buildCoordinationSnapshot(
      organizationId,
      retained,
      readinessSignals,
      sequences,
      dependencies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((o) => o.actionPriority === "critical")) {
      devLog(`critical action readiness emergence — ${retained[0]!.orchestrationId}`);
    }
    if (stabilization) {
      devLog("major orchestration formation — enterprise stabilization sequence");
    }
    if (dependencies.length >= 2) {
      devLog("stabilization dependency coordination — governance_alignment sequencing");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newStrategicOrchestrations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endDecisionOrchestrationEvaluation();
  }
}
