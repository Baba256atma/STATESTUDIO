import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginTemporalConvergenceEvaluation,
  confidenceToConvergenceLevel,
  endTemporalConvergenceEvaluation,
  shouldEvaluateTemporalConvergence,
  shouldRetainConvergencePattern,
} from "./temporalConvergenceGuards";
import { getTemporalConvergenceStore } from "./temporalConvergenceStore";
import { getMultiTimelineStore } from "./multiTimelineStore";
import type { BranchCategory, OrganizationalTimelineBranch } from "./multiTimelineTypes";
import { getOperationalReplayStore } from "./operationalReplayStore";
import { getTemporalDriftProjectionStore } from "./temporalDriftProjectionStore";
import type { TemporalDriftProjection } from "./temporalDriftProjectionTypes";
import { getTemporalCognitionStore } from "./temporalCognitionStore";
import type {
  AlignmentState,
  ConvergenceCategory,
  ConvergenceStrength,
  EnterpriseConvergenceSignal,
  OperationalSynchronizationSequence,
  OrganizationalAlignmentTrajectory,
  StabilityConvergencePattern,
  StrategicAlignmentSnapshot,
  TemporalConvergenceInput,
  TemporalConvergenceResult,
} from "./temporalConvergenceTypes";
import type { StrategicTimelineSequence } from "./temporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][TemporalConvergence]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildConvergenceId(category: ConvergenceCategory): string {
  return stableSignature(["temporal-convergence", category]).slice(0, 56);
}

function countStabilizingBranches(branches: readonly OrganizationalTimelineBranch[]): number {
  const stabilizing: BranchCategory[] = [
    "stabilization",
    "resilience_growth",
    "governance_recovery",
    "adaptive_evolution",
  ];
  return branches.filter((b) => stabilizing.includes(b.branchType)).length;
}

function countDestabilizingBranches(branches: readonly OrganizationalTimelineBranch[]): number {
  const destabilizing: BranchCategory[] = ["escalation", "systemic_fragility", "operational_stagnation"];
  return branches.filter((b) => destabilizing.includes(b.branchType)).length;
}

function hasStabilizingDrift(projections: readonly TemporalDriftProjection[]): boolean {
  return projections.some(
    (p) =>
      p.trajectoryDirection === "stabilizing" ||
      p.trajectoryDirection === "adaptive_growth" ||
      p.trajectoryDirection === "recovering"
  );
}

function createPattern(
  category: ConvergenceCategory,
  convergenceStrength: ConvergenceStrength,
  alignmentState: AlignmentState,
  summary: string,
  signals: string[],
  confidence: number,
  now: number
): StabilityConvergencePattern {
  const conf = Number(Math.min(0.94, Math.max(0.45, confidence)).toFixed(2));
  return {
    convergenceId: buildConvergenceId(category),
    category,
    convergenceStrength,
    alignmentState,
    summary,
    convergenceSignals: Object.freeze(signals.slice(0, 6)),
    confidence: conf,
    confidenceLevel: confidenceToConvergenceLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEscalationDecayConvergence(
  sequences: readonly StrategicTimelineSequence[],
  projections: readonly TemporalDriftProjection[],
  fragilityElevated: boolean,
  now: number
): StabilityConvergencePattern | null {
  const noCascading = !sequences.some((s) => s.sequenceType === "cascading");
  const notEscalating = !projections.some(
    (p) => p.trajectoryDirection === "unstable" || p.trajectoryDirection === "degrading"
  );
  if (!noCascading && !notEscalating) return null;
  if (fragilityElevated && sequences.some((s) => s.timelineState === "escalating")) return null;

  return createPattern(
    "escalation_decay",
    notEscalating && noCascading ? "strong" : "moderate",
    "stabilizing",
    "Reduced escalation spread across temporal sequences indicates escalation decay convergence toward operational stability.",
    ["reduced_escalation_spread", "weakened_cascade_propagation", "de-escalation_momentum"],
    notEscalating ? 0.84 : 0.74,
    now
  );
}

function buildGovernanceStabilizationConvergence(
  projections: readonly TemporalDriftProjection[],
  branches: readonly OrganizationalTimelineBranch[],
  continuityPreserved: boolean,
  now: number
): StabilityConvergencePattern | null {
  const govDrift = projections.some((p) => p.trajectoryDirection === "stabilizing");
  const govBranch = branches.some(
    (b) => b.branchType === "stabilization" || b.branchType === "governance_recovery"
  );
  if (!govDrift && !govBranch && continuityPreserved) return null;

  return createPattern(
    "governance_stabilization",
    govBranch ? "strong" : "moderate",
    continuityPreserved ? "converging" : "synchronizing",
    "Governance coordination improving consistently across drift and branch layers indicates governance stabilization convergence.",
    ["governance_alignment", "pressure_containment", "executive_stability"],
    govBranch ? 0.86 : 0.76,
    now
  );
}

function buildResilienceAlignmentConvergence(
  projections: readonly TemporalDriftProjection[],
  replays: readonly { replayState: string; replayCategory: string }[],
  maturityTrend: string | undefined,
  now: number
): StabilityConvergencePattern | null {
  const resilientDrift = projections.some(
    (p) => p.trajectoryDirection === "adaptive_growth" || p.trajectoryDirection === "recovering"
  );
  const recoveryReplay = replays.some(
    (r) => r.replayState === "recovering" || r.replayState === "resolved"
  );
  const improving = maturityTrend === "improving" || maturityTrend === "accelerating";
  if (!resilientDrift && !recoveryReplay && !improving) return null;

  const strength: ConvergenceStrength =
    maturityTrend === "accelerating" ? "accelerating" : recoveryReplay ? "strong" : "moderate";

  return createPattern(
    "resilience_alignment",
    strength,
    improving ? "institutionalized" : "converging",
    "Operational resilience, governance stabilization, and coordination maturity are increasingly synchronizing toward enterprise-wide stability alignment.",
    [
      "reduced_escalation_spread",
      "improved_recovery_consistency",
      "coordination_stabilization",
    ],
    resilientDrift ? 0.88 : 0.8,
    now
  );
}

function buildFragilityReductionConvergence(
  projections: readonly TemporalDriftProjection[],
  fragilityElevated: boolean,
  now: number
): StabilityConvergencePattern | null {
  if (fragilityElevated) return null;
  const reducing = !projections.some(
    (p) => p.trajectoryDirection === "fragile" || p.trajectoryDirection === "degrading"
  );
  if (!reducing) return null;

  return createPattern(
    "fragility_reduction",
    "moderate",
    "synchronizing",
    "Pressure spread weakening and absent fragility elevation indicate fragility reduction convergence.",
    ["pressure_spread_weakening", "fragility_containment", "stability_momentum"],
    0.78,
    now
  );
}

function buildOperationalCoordinationConvergence(
  sequences: readonly StrategicTimelineSequence[],
  branches: readonly OrganizationalTimelineBranch[],
  now: number
): StabilityConvergencePattern | null {
  const coordinationSeq = sequences.some((s) => s.category === "coordination");
  const adaptiveBranch = branches.some((b) => b.branchType === "adaptive_evolution");
  if (!coordinationSeq && !adaptiveBranch) return null;

  return createPattern(
    "operational_coordination",
    adaptiveBranch ? "strong" : "moderate",
    "synchronizing",
    "Operational coordination systems are synchronizing across temporal and multi-timeline layers.",
    ["coordination_synchronization", "cross_system_alignment", "operational_harmony"],
    adaptiveBranch ? 0.85 : 0.75,
    now
  );
}

function buildRecoverySynchronizationConvergence(
  replays: readonly { replayState: string }[],
  temporalState: string | undefined,
  now: number
): StabilityConvergencePattern | null {
  const recovering =
    replays.some((r) => r.replayState === "recovering" || r.replayState === "resolved") ||
    temporalState === "recovering";
  if (!recovering) return null;

  return createPattern(
    "recovery_synchronization",
    "strong",
    "converging",
    "Recovery pathways reinforce one another, indicating recovery synchronization convergence across the enterprise chronology.",
    ["recovery_pathway_alignment", "intervention_consistency", "restoration_momentum"],
    0.86,
    now
  );
}

function buildAdaptiveAlignmentConvergence(
  maturityTrend: string | undefined,
  projections: readonly TemporalDriftProjection[],
  now: number
): StabilityConvergencePattern | null {
  const adaptive =
    maturityTrend === "improving" ||
    maturityTrend === "accelerating" ||
    projections.some((p) => p.trajectoryDirection === "adaptive_growth");
  if (!adaptive) return null;

  return createPattern(
    "adaptive_alignment",
    maturityTrend === "accelerating" ? "accelerating" : "strong",
    maturityTrend === "accelerating" ? "institutionalized" : "converging",
    "Institutional maturity improving steadily projects adaptive alignment convergence across organizational systems.",
    ["maturity_growth", "adaptive_synchronization", "learning_consolidation"],
    maturityTrend === "accelerating" ? 0.9 : 0.82,
    now
  );
}

function buildCompositeResilienceConvergence(
  patterns: StabilityConvergencePattern[],
  now: number
): StabilityConvergencePattern | null {
  const hasGov = patterns.some((p) => p.category === "governance_stabilization");
  const hasResilience = patterns.some((p) => p.category === "resilience_alignment");
  const hasCoord = patterns.some((p) => p.category === "operational_coordination");
  if (!hasGov || !hasResilience) return null;

  const signals = Object.freeze(
    Array.from(
      new Set(
        patterns.flatMap((p) => [...p.convergenceSignals]).concat(
          hasCoord ? ["coordination_stabilization"] : []
        )
      )
    ).slice(0, 6)
  );

  const confidence = Number(
    (patterns.reduce((s, p) => s + p.confidence, 0) / patterns.length + 0.02).toFixed(2)
  );

  return {
    convergenceId: buildConvergenceId("resilience_alignment"),
    category: "resilience_alignment",
    convergenceStrength: patterns.length >= 3 ? "accelerating" : "strong",
    alignmentState: "converging",
    summary:
      "Operational resilience, governance stabilization, and coordination maturity are increasingly synchronizing toward enterprise-wide stability alignment.",
    convergenceSignals: signals,
    confidence: Math.min(0.94, confidence),
    confidenceLevel: confidenceToConvergenceLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildAlignmentTrajectories(
  patterns: StabilityConvergencePattern[],
  now: number
): OrganizationalAlignmentTrajectory[] {
  return patterns.slice(0, 4).map((p) => ({
    trajectoryId: stableSignature(["alignment-trajectory", p.convergenceId]).slice(0, 48),
    category: p.category,
    alignmentState: p.alignmentState,
    trajectorySummary: p.summary.slice(0, 160),
    linkedConvergenceIds: Object.freeze([p.convergenceId]),
    generatedAt: now,
  }));
}

function buildSynchronizationSequences(
  patterns: StabilityConvergencePattern[],
  now: number
): OperationalSynchronizationSequence[] {
  return patterns.slice(0, 4).map((p) => ({
    sequenceId: stableSignature(["sync-sequence", p.convergenceId]).slice(0, 48),
    category: p.category,
    synchronizationLabel: `${p.category}_synchronization`,
    progressionSummary: p.summary.slice(0, 160),
    signalLabels: p.convergenceSignals,
    generatedAt: now,
  }));
}

function buildConvergenceSignals(
  patterns: StabilityConvergencePattern[],
  now: number
): EnterpriseConvergenceSignal[] {
  return patterns.slice(0, 4).map((p) => ({
    signalId: stableSignature(["convergence-signal", p.convergenceId]).slice(0, 48),
    category: p.category,
    convergenceStrength: p.convergenceStrength,
    alignmentState: p.alignmentState,
    summary: p.summary.slice(0, 120),
    confidence: p.confidence,
    generatedAt: now,
  }));
}

function buildAlignmentSnapshot(
  organizationId: string,
  patterns: StabilityConvergencePattern[],
  signals: EnterpriseConvergenceSignal[],
  trajectories: OrganizationalAlignmentTrajectory[],
  sequences: OperationalSynchronizationSequence[],
  now: number
): StrategicAlignmentSnapshot {
  const dominant = patterns[0];
  const signature = stableSignature([
    "d9-3-6-convergence-snapshot",
    organizationId,
    patterns.length,
    dominant?.convergenceId ?? "none",
    dominant?.category ?? "unknown",
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    convergenceCount: patterns.length,
    alignmentSummary:
      dominant?.summary ??
      "Enterprise stability alignment awareness awaiting sufficient convergence signal depth.",
    dominantCategory: dominant?.category ?? "unknown",
    dominantConvergenceStrength: dominant?.convergenceStrength ?? "weak",
    dominantAlignmentState: dominant?.alignmentState ?? "emerging",
    recentConvergencePatterns: Object.freeze(patterns.slice(0, 6)),
    convergenceSignals: Object.freeze(signals),
    alignmentTrajectories: Object.freeze(trajectories),
    synchronizationSequences: Object.freeze(sequences),
  };
}

function rankPatterns(patterns: StabilityConvergencePattern[]): StabilityConvergencePattern[] {
  const strengthOrder: ConvergenceStrength[] = ["accelerating", "strong", "moderate", "weak"];
  return [...patterns].sort((a, b) => {
    const strDiff =
      strengthOrder.indexOf(a.convergenceStrength) - strengthOrder.indexOf(b.convergenceStrength);
    if (strDiff !== 0) return strDiff;
    return b.confidence - a.confidence;
  });
}

export function evaluateTemporalConvergenceIntelligence(
  input: TemporalConvergenceInput
): TemporalConvergenceResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginTemporalConvergenceEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_convergence_guard",
      snapshot: null,
      newConvergencePatterns: 0,
      storeSignature: "",
    };
  }

  try {
    const store = getTemporalConvergenceStore(organizationId);
    const prior = store.getState();
    const temporalState = getTemporalCognitionStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();
    const multiState = getMultiTimelineStore(organizationId).getState();

    const temporalSnapshot = input.temporalSnapshot ?? temporalState.snapshots[0] ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;
    const multiSnapshot = input.multiTimelineSnapshot ?? multiState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-3-6-convergence-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      temporalSnapshot?.signature ?? temporalState.signature,
      driftSnapshot?.signature ?? driftState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      multiSnapshot?.signature ?? multiState.signature,
      input.maturitySnapshot?.signature ?? "no-maturity",
      input.fragilityElevated ? "fragile" : "stable",
    ]);

    if (
      !shouldEvaluateTemporalConvergence(
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
        newConvergencePatterns: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const sequences = temporalSnapshot?.recentSequences ?? temporalState.sequences;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const branches = multiSnapshot?.timelineBranches ?? multiState.branches;
    const maturityTrend = input.maturitySnapshot?.dominantEvolutionTrend;

    const depth =
      projections.length + sequences.length + replays.length + branches.length;
    if (depth < 4) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_convergence_depth",
        snapshot: prior.snapshots[0] ?? null,
        newConvergencePatterns: 0,
        storeSignature: prior.signature,
      };
    }

    const stabilizingCount = countStabilizingBranches(branches);
    const destabilizingCount = countDestabilizingBranches(branches);
    if (
      destabilizingCount > stabilizingCount &&
      (input.fragilityElevated ?? false) &&
      !hasStabilizingDrift(projections)
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "divergence_dominates_convergence",
        snapshot: prior.snapshots[0] ?? null,
        newConvergencePatterns: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: StabilityConvergencePattern[] = [];

    const escalationDecay = buildEscalationDecayConvergence(
      sequences,
      projections,
      input.fragilityElevated ?? false,
      now
    );
    if (escalationDecay) candidates.push(escalationDecay);

    const governance = buildGovernanceStabilizationConvergence(
      projections,
      branches,
      input.continuityPreserved !== false,
      now
    );
    if (governance) candidates.push(governance);

    const resilience = buildResilienceAlignmentConvergence(
      projections,
      replays,
      maturityTrend,
      now
    );
    if (resilience) candidates.push(resilience);

    const fragilityReduction = buildFragilityReductionConvergence(
      projections,
      input.fragilityElevated ?? false,
      now
    );
    if (fragilityReduction) candidates.push(fragilityReduction);

    const coordination = buildOperationalCoordinationConvergence(sequences, branches, now);
    if (coordination) candidates.push(coordination);

    const recoverySync = buildRecoverySynchronizationConvergence(
      replays,
      temporalSnapshot?.dominantTimelineState,
      now
    );
    if (recoverySync) candidates.push(recoverySync);

    const adaptive = buildAdaptiveAlignmentConvergence(maturityTrend, projections, now);
    if (adaptive) candidates.push(adaptive);

    const composite = buildCompositeResilienceConvergence(candidates, now);
    if (composite) {
      const withoutResilience = candidates.filter((p) => p.category !== "resilience_alignment");
      candidates.length = 0;
      candidates.push(...withoutResilience, composite);
    }

    const retained = rankPatterns(candidates.filter(shouldRetainConvergencePattern));
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_convergence",
        snapshot: prior.snapshots[0] ?? null,
        newConvergencePatterns: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.patterns.map((p) => p.convergenceId));
    const newCount = retained.filter((p) => !priorIds.has(p.convergenceId)).length;

    store.upsertPatterns(retained, now);

    const signals = buildConvergenceSignals(retained, now);
    store.upsertSignals(signals, now);

    const trajectories = buildAlignmentTrajectories(retained, now);
    store.upsertTrajectories(trajectories, now);

    const syncSequences = buildSynchronizationSequences(retained, now);
    store.upsertSequences(syncSequences, now);

    const snapshot = buildAlignmentSnapshot(
      organizationId,
      retained,
      signals,
      trajectories,
      syncSequences,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.length >= 2) {
      devLog(`convergence formation — ${retained.length} stability alignment patterns`);
    }
    if (resilience || composite) {
      devLog(`resilience synchronization — ${(composite ?? resilience)!.summary.slice(0, 72)}`);
    }
    if (governance) {
      devLog(`stabilization alignment — ${governance.alignmentState}: ${governance.summary.slice(0, 56)}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newConvergencePatterns: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endTemporalConvergenceEvaluation();
  }
}
