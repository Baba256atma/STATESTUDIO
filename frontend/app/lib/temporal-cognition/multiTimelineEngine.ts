import { stableSignature } from "../intelligence/shared/dedupe";
import { getCausalDependencyStore } from "./causalDependencyStore";
import type { OperationalCausalChain } from "./causalDependencyTypes";
import {
  beginMultiTimelineEvaluation,
  endMultiTimelineEvaluation,
  shouldEvaluateMultiTimelineDivergence,
  shouldRetainDivergencePath,
} from "./multiTimelineGuards";
import { getMultiTimelineStore } from "./multiTimelineStore";
import { getOperationalReplayStore } from "./operationalReplayStore";
import { getTemporalDriftProjectionStore } from "./temporalDriftProjectionStore";
import type { TemporalDriftProjection, TrajectoryDirection } from "./temporalDriftProjectionTypes";
import { getTemporalCognitionStore } from "./temporalCognitionStore";
import type {
  AlternativeEvolutionTrajectory,
  BranchCategory,
  BranchState,
  DivergenceStrength,
  EnterpriseDivergencePath,
  MultiTimelineDivergenceInput,
  MultiTimelineDivergenceResult,
  MultiTimelineSnapshot,
  OrganizationalTimelineBranch,
  StrategicBranchingSequence,
  TemporalDivergenceSignal,
} from "./multiTimelineTypes";
import type { StrategicTimelineSequence } from "./temporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][MultiTimeline]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildBranchId(branchType: BranchCategory): string {
  return stableSignature(["timeline-branch", branchType]).slice(0, 48);
}

function buildDivergenceId(branches: BranchCategory[]): string {
  return stableSignature(["enterprise-divergence", ...branches.sort().slice(0, 4)]).slice(0, 56);
}

function mapDirectionToBranch(direction: TrajectoryDirection): BranchCategory | null {
  if (direction === "stabilizing") return "stabilization";
  if (direction === "unstable" || direction === "degrading") return "escalation";
  if (direction === "adaptive_growth" || direction === "recovering") return "resilience_growth";
  if (direction === "fragile") return "systemic_fragility";
  if (direction === "stagnating") return "operational_stagnation";
  return null;
}

function inferBranchState(
  branchType: BranchCategory,
  active: boolean,
  conflicting: boolean
): BranchState {
  if (conflicting) return "diverging";
  if (branchType === "escalation" || branchType === "systemic_fragility") return "escalating";
  if (branchType === "stabilization" || branchType === "governance_recovery") return "stabilizing";
  if (branchType === "adaptive_evolution" || branchType === "resilience_growth") return "converging";
  if (!active) return "emerging";
  return "diverging";
}

function createBranch(
  branchType: BranchCategory,
  indicators: string[],
  summary: string,
  confidence: number,
  branchState: BranchState,
  now: number
): OrganizationalTimelineBranch {
  return {
    branchId: buildBranchId(branchType),
    branchType,
    branchState,
    indicators: Object.freeze(indicators.slice(0, 4)),
    summary,
    confidence: Number(Math.min(0.94, Math.max(0.45, confidence)).toFixed(2)),
    generatedAt: now,
    lastObservedAt: now,
  };
}

function buildStabilizationBranch(
  projections: readonly TemporalDriftProjection[],
  chains: readonly OperationalCausalChain[],
  continuityPreserved: boolean,
  now: number
): OrganizationalTimelineBranch | null {
  const stabilizing = projections.some((p) => p.trajectoryDirection === "stabilizing");
  const governance = chains.some((c) => c.category === "governance");
  if (!stabilizing && !governance && continuityPreserved) return null;

  return createBranch(
    "stabilization",
    ["governance_stabilization", "pressure_containment", "executive_alignment"],
    "Governance stabilization improving suggests a stabilization branch in organizational evolution.",
    stabilizing ? 0.82 : 0.72,
    inferBranchState("stabilization", true, false),
    now
  );
}

function buildEscalationBranch(
  projections: readonly TemporalDriftProjection[],
  sequences: readonly StrategicTimelineSequence[],
  fragilityElevated: boolean,
  now: number
): OrganizationalTimelineBranch | null {
  const escalating =
    projections.some(
      (p) => p.trajectoryDirection === "unstable" || p.trajectoryDirection === "degrading"
    ) ||
    sequences.some((s) => s.sequenceType === "cascading" || s.timelineState === "escalating");
  if (!escalating && !fragilityElevated) return null;

  return createBranch(
    "escalation",
    ["pressure_accumulation", "escalation_concentration", "coordination_stress"],
    "Pressure accumulation and escalation signals indicate an escalation divergence branch.",
    escalating ? 0.86 : 0.76,
    inferBranchState("escalation", true, fragilityElevated),
    now
  );
}

function buildResilienceGrowthBranch(
  projections: readonly TemporalDriftProjection[],
  maturityTrend: string | undefined,
  now: number
): OrganizationalTimelineBranch | null {
  const growing =
    projections.some(
      (p) => p.trajectoryDirection === "adaptive_growth" || p.trajectoryDirection === "recovering"
    ) || maturityTrend === "improving" || maturityTrend === "accelerating";
  if (!growing) return null;

  return createBranch(
    "resilience_growth",
    ["improved_recovery_speed", "resilience_strengthening", "adaptation_momentum"],
    "Recovery speed and resilience maturity trends indicate a resilience growth branch.",
    growing ? 0.88 : 0.74,
    inferBranchState("resilience_growth", true, false),
    now
  );
}

function buildGovernanceRecoveryBranch(
  chains: readonly OperationalCausalChain[],
  replays: readonly { replayCategory: string; replayState: string }[],
  now: number
): OrganizationalTimelineBranch | null {
  const recoveryChain = chains.some((c) => c.category === "resilience" || c.category === "recovery");
  const recoveryReplay = replays.some(
    (r) => r.replayCategory === "resilience" || r.replayState === "recovering"
  );
  if (!recoveryChain && !recoveryReplay) return null;

  return createBranch(
    "governance_recovery",
    ["governance_alignment", "recovery_acceleration", "stabilization_path"],
    "Governance recovery alternatives emerge when stabilization precedes operational recovery acceleration.",
    0.84,
    inferBranchState("governance_recovery", true, false),
    now
  );
}

function buildSystemicFragilityBranch(
  projections: readonly TemporalDriftProjection[],
  sequences: readonly StrategicTimelineSequence[],
  fragilityElevated: boolean,
  now: number
): OrganizationalTimelineBranch | null {
  const fragile =
    projections.some((p) => p.trajectoryDirection === "fragile") ||
    sequences.some((s) => s.sequenceType === "cyclical" || s.sequenceType === "recurring");
  if (!fragile && !fragilityElevated) return null;

  return createBranch(
    "systemic_fragility",
    ["persistent_coordination_instability", "fragility_accumulation", "unresolved_degradation"],
    "Repeated unresolved fragility projects a systemic fragility divergence branch.",
    fragile ? 0.85 : 0.77,
    inferBranchState("systemic_fragility", true, true),
    now
  );
}

function buildAdaptiveEvolutionBranch(
  projections: readonly TemporalDriftProjection[],
  chains: readonly OperationalCausalChain[],
  now: number
): OrganizationalTimelineBranch | null {
  const adaptive = projections.some((p) => p.trajectoryDirection === "adaptive_growth");
  const reducedEscalation = !chains.some((c) => c.propagationType === "cascading");
  if (!adaptive && !reducedEscalation) return null;

  return createBranch(
    "adaptive_evolution",
    ["reduced_escalation_propagation", "improved_pressure_absorption", "operational_adaptation"],
    "Reduced escalation propagation with adaptive growth signals an adaptive evolution branch.",
    adaptive ? 0.86 : 0.75,
    inferBranchState("adaptive_evolution", true, false),
    now
  );
}

function buildOperationalStagnationBranch(
  projections: readonly TemporalDriftProjection[],
  sequences: readonly StrategicTimelineSequence[],
  now: number
): OrganizationalTimelineBranch | null {
  const stagnating = projections.some((p) => p.trajectoryDirection === "stagnating");
  const coordinationStress = sequences.some((s) => s.category === "coordination");
  if (!stagnating && !coordinationStress) return null;

  return createBranch(
    "operational_stagnation",
    ["coordination_instability", "limited_evolution_momentum", "operational_inertia"],
    "Coordination instability persisting without recovery momentum indicates operational stagnation branch.",
    stagnating ? 0.78 : 0.7,
    inferBranchState("operational_stagnation", true, false),
    now
  );
}

function buildBranchesFromProjections(
  projections: readonly TemporalDriftProjection[],
  now: number
): OrganizationalTimelineBranch[] {
  const branches: OrganizationalTimelineBranch[] = [];
  for (const projection of projections) {
    const branchType = mapDirectionToBranch(projection.trajectoryDirection);
    if (!branchType || branches.some((b) => b.branchType === branchType)) continue;
    branches.push(
      createBranch(
        branchType,
        [...projection.supportingSignals],
        projection.summary.slice(0, 160),
        projection.confidence,
        inferBranchState(branchType, true, false),
        now
      )
    );
  }
  return branches;
}

function inferDivergenceStrength(branches: OrganizationalTimelineBranch[]): DivergenceStrength {
  if (branches.length >= 4) return "accelerating";
  if (branches.length >= 3) return "strong";
  if (branches.length >= 2) return "moderate";
  return "weak";
}

function pickDominantBranch(branches: OrganizationalTimelineBranch[]): BranchCategory {
  const ranked = [...branches].sort((a, b) => b.confidence - a.confidence);
  return ranked[0]?.branchType ?? "unknown";
}

function buildEnterpriseDivergencePath(
  branches: OrganizationalTimelineBranch[],
  now: number
): EnterpriseDivergencePath | null {
  if (branches.length < 2) return null;

  const branchTypes = branches.map((b) => b.branchType);
  const dominantBranch = pickDominantBranch(branches);
  const divergenceStrength = inferDivergenceStrength(branches);

  const hasResilience = branches.some((b) => b.branchType === "resilience_growth");
  const hasFragility = branches.some((b) => b.branchType === "systemic_fragility");
  const hasAdaptive = branches.some((b) => b.branchType === "adaptive_evolution");

  const summary =
    hasResilience && hasFragility
      ? "Current organizational evolution shows divergence between resilience growth pathways and systemic fragility escalation pathways depending on governance stabilization consistency."
      : hasAdaptive && hasFragility
        ? "Operational evolution diverges between adaptive evolution pathways and systemic fragility branches based on governance and pressure dynamics."
        : `Organizational evolution diverges across ${branches.length} alternative pathways with dominant ${dominantBranch.replace(/_/g, " ")} tendency.`;

  const confidence = Number(
    (
      branches.reduce((sum, b) => sum + b.confidence, 0) / Math.max(1, branches.length) +
      0.04
    ).toFixed(2)
  );

  return {
    divergenceId: buildDivergenceId(branchTypes),
    dominantBranch,
    divergenceStrength,
    summary,
    branches: Object.freeze(branches),
    confidence: Math.min(0.94, confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildBranchingSequences(
  branches: OrganizationalTimelineBranch[],
  divergenceId: string,
  now: number
): StrategicBranchingSequence[] {
  const sequences: StrategicBranchingSequence[] = [];
  for (let i = 0; i < branches.length - 1; i += 1) {
    const from = branches[i]!;
    const to = branches[i + 1]!;
    sequences.push({
      sequenceId: stableSignature(["branching-seq", from.branchType, to.branchType]).slice(0, 48),
      fromBranch: from.branchType,
      toBranch: to.branchType,
      branchingSummary: `Evolution may branch from ${from.branchType} toward ${to.branchType} depending on operational progression.`,
      linkedDivergenceIds: Object.freeze([divergenceId]),
      generatedAt: now,
    });
  }
  return sequences.slice(0, 6);
}

function buildAlternativeTrajectories(
  branches: OrganizationalTimelineBranch[],
  divergenceStrength: DivergenceStrength,
  now: number
): AlternativeEvolutionTrajectory[] {
  return branches.slice(0, 4).map((b) => ({
    trajectoryId: stableSignature(["alt-trajectory", b.branchId]).slice(0, 48),
    branchType: b.branchType,
    evolutionSummary: b.summary,
    linkedBranchIds: Object.freeze([b.branchId]),
    divergenceStrength,
    generatedAt: now,
  }));
}

function buildDivergenceSignals(
  path: EnterpriseDivergencePath,
  now: number
): TemporalDivergenceSignal[] {
  return path.branches.slice(0, 4).map((b) => ({
    signalId: stableSignature(["divergence-signal", b.branchId]).slice(0, 48),
    branchType: b.branchType,
    divergenceStrength: path.divergenceStrength,
    summary: b.summary.slice(0, 120),
    confidence: b.confidence,
    generatedAt: now,
  }));
}

function buildMultiTimelineSnapshot(
  organizationId: string,
  paths: EnterpriseDivergencePath[],
  branches: OrganizationalTimelineBranch[],
  trajectories: AlternativeEvolutionTrajectory[],
  sequences: StrategicBranchingSequence[],
  signals: TemporalDivergenceSignal[],
  now: number
): MultiTimelineSnapshot {
  const dominant = paths[0];
  const signature = stableSignature([
    "d9-3-5-multi-timeline-snapshot",
    organizationId,
    paths.length,
    branches.length,
    dominant?.divergenceId ?? "none",
    dominant?.dominantBranch ?? "unknown",
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    divergenceCount: paths.length,
    branchCount: branches.length,
    divergenceSummary:
      dominant?.summary ??
      "Multi-timeline divergence awareness awaiting sufficient drift and replay depth.",
    dominantBranch: dominant?.dominantBranch ?? "unknown",
    dominantDivergenceStrength: dominant?.divergenceStrength ?? "weak",
    recentDivergencePaths: Object.freeze(paths.slice(0, 4)),
    timelineBranches: Object.freeze(branches.slice(0, 12)),
    alternativeTrajectories: Object.freeze(trajectories),
    branchingSequences: Object.freeze(sequences),
    divergenceSignals: Object.freeze(signals),
  };
}

export function evaluateMultiTimelineDivergence(
  input: MultiTimelineDivergenceInput
): MultiTimelineDivergenceResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginMultiTimelineEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_multi_timeline_guard",
      snapshot: null,
      newDivergencePaths: 0,
      storeSignature: "",
    };
  }

  try {
    const store = getMultiTimelineStore(organizationId);
    const prior = store.getState();
    const temporalState = getTemporalCognitionStore(organizationId).getState();
    const causalState = getCausalDependencyStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();

    const temporalSnapshot = input.temporalSnapshot ?? temporalState.snapshots[0] ?? null;
    const causalSnapshot = input.causalSnapshot ?? causalState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-3-5-multi-timeline-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      temporalSnapshot?.signature ?? temporalState.signature,
      causalSnapshot?.signature ?? causalState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      driftSnapshot?.signature ?? driftState.signature,
      input.maturitySnapshot?.signature ?? "no-maturity",
      input.fragilityElevated ? "fragile" : "stable",
    ]);

    if (
      !shouldEvaluateMultiTimelineDivergence(
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
        newDivergencePaths: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const sequences = temporalSnapshot?.recentSequences ?? temporalState.sequences;
    const chains = causalSnapshot?.recentChains ?? causalState.chains;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const maturityTrend = input.maturitySnapshot?.dominantEvolutionTrend;

    const depth = projections.length + sequences.length + chains.length + replays.length;
    if (depth < 4) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_divergence_depth",
        snapshot: prior.snapshots[0] ?? null,
        newDivergencePaths: 0,
        storeSignature: prior.signature,
      };
    }

    const branchCandidates: OrganizationalTimelineBranch[] = [];

    const stabilization = buildStabilizationBranch(
      projections,
      chains,
      input.continuityPreserved !== false,
      now
    );
    if (stabilization) branchCandidates.push(stabilization);

    const escalation = buildEscalationBranch(
      projections,
      sequences,
      input.fragilityElevated ?? false,
      now
    );
    if (escalation) branchCandidates.push(escalation);

    const resilience = buildResilienceGrowthBranch(projections, maturityTrend, now);
    if (resilience) branchCandidates.push(resilience);

    const governanceRecovery = buildGovernanceRecoveryBranch(chains, replays, now);
    if (governanceRecovery) branchCandidates.push(governanceRecovery);

    const systemicFragility = buildSystemicFragilityBranch(
      projections,
      sequences,
      input.fragilityElevated ?? false,
      now
    );
    if (systemicFragility) branchCandidates.push(systemicFragility);

    const adaptive = buildAdaptiveEvolutionBranch(projections, chains, now);
    if (adaptive) branchCandidates.push(adaptive);

    const stagnation = buildOperationalStagnationBranch(projections, sequences, now);
    if (stagnation) branchCandidates.push(stagnation);

    for (const branch of buildBranchesFromProjections(projections, now)) {
      if (!branchCandidates.some((b) => b.branchType === branch.branchType)) {
        branchCandidates.push(branch);
      }
    }

    const uniqueBranches = branchCandidates.filter(
      (b, i, arr) => arr.findIndex((x) => x.branchType === b.branchType) === i
    );

    const divergencePath = buildEnterpriseDivergencePath(uniqueBranches, now);
    if (!divergencePath || !shouldRetainDivergencePath(divergencePath)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_branch_divergence",
        snapshot: prior.snapshots[0] ?? null,
        newDivergencePaths: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.divergencePaths.map((p) => p.divergenceId));
    const newCount = priorIds.has(divergencePath.divergenceId) ? 0 : 1;

    store.upsertBranches(uniqueBranches, now);
    store.upsertDivergencePaths([divergencePath], now);

    const trajectories = buildAlternativeTrajectories(
      uniqueBranches,
      divergencePath.divergenceStrength,
      now
    );
    store.upsertAlternativeTrajectories(trajectories, now);

    const branchingSequences = buildBranchingSequences(
      uniqueBranches,
      divergencePath.divergenceId,
      now
    );
    store.upsertBranchingSequences(branchingSequences, now);

    const signals = buildDivergenceSignals(divergencePath, now);
    store.upsertSignals(signals, now);

    const snapshot = buildMultiTimelineSnapshot(
      organizationId,
      [divergencePath],
      uniqueBranches,
      trajectories,
      branchingSequences,
      signals,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (divergencePath.branches.length >= 2) {
      devLog(`divergence formation — ${divergencePath.branches.length} branches, dominant ${divergencePath.dominantBranch}`);
    }
    if (resilience && systemicFragility) {
      devLog("resilience vs fragility branch divergence detected");
    }
    if (escalation?.branchState === "escalating") {
      devLog(`escalation branch acceleration — ${escalation.summary.slice(0, 56)}`);
    }
    if (stabilization) {
      devLog(`stabilization branch emergence — ${stabilization.summary.slice(0, 56)}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newDivergencePaths: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endMultiTimelineEvaluation();
  }
}
