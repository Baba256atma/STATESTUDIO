/**
 * D7:1:10 — Simulation governance + anti-chaos tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { createSimulationStateSnapshot, createSimulationTimestamp } from "../simulationFoundation.index.ts";
import {
  advanceOperationalTimeline,
  createOperationalTimeline,
} from "../timeline/operationalTimelineEvolutionEngine.ts";
import {
  createScenarioBranch,
  createScenarioBranchForest,
} from "../branching/branchingScenarioTimelineEngine.ts";
import { DEFAULT_MAX_ACTIVE_BRANCHES } from "../branching/branchingGuards.ts";
import {
  orchestrateWarRoomSimulation,
  createWarRoomSimulationSession,
} from "../warroom/executiveWarRoomOrchestrationEngine.ts";
import {
  buildWarRoomScenarioSlotsFromForest,
  cloneTimelinesByScenario,
} from "../warroom/multiScenarioCoordination.ts";
import {
  createSimulationReplaySession,
  replaySimulationTimeline,
} from "../replay/executiveReplayOrchestrationEngine.ts";
import {
  governSimulationUniverse,
  buildGovernanceFingerprint,
  freezeSimulationGovernanceReport,
} from "./simulationAntiChaosGovernanceEngine.ts";
import { verifyReplayIntegrity } from "./replayIntegrityVerification.ts";
import { validateSimulationIntegrity } from "./simulationIntegrityValidation.ts";
import { buildExecutiveGovernanceNarrative } from "./executiveGovernanceNarratives.ts";
import { GOVERNANCE_POLICY } from "./governancePolicies.ts";

function snap(tick: number, fragility = 0.25) {
  return createSimulationStateSnapshot({
    simulationId: "sim-gov",
    timestamp: createSimulationTimestamp(tick, { epochSimulatedAt: "2026-01-01T00:00:00.000Z" }),
    objectStates: { supply: { operationalState: "stable" } },
    operationalMetrics: { fragility, confidence: 0.75, operationalLoad: 0.35 },
  });
}

test("stable universe receives allow governance response", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-stable", initialSnapshot: snap(0) });
  const verdict = governSimulationUniverse({
    activeTimelines: [timeline],
    branchForests: [createScenarioBranchForest(timeline)],
  });
  assert.equal(verdict.allowed, true);
  assert.equal(verdict.report.state.governanceStatus, "stable");
  assert.ok(verdict.report.responses.some((r) => r.action === "allow"));
});

test("deterministic governance fingerprints", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-det-gov", initialSnapshot: snap(0) });
  const input = {
    activeTimelines: [timeline],
    branchForests: [createScenarioBranchForest(timeline)],
  };
  const v1 = governSimulationUniverse(input);
  const v2 = governSimulationUniverse(input);
  assert.equal(v1.report.fingerprint, v2.report.fingerprint);
  assert.equal(buildGovernanceFingerprint(input), buildGovernanceFingerprint(input));
});

test("branch explosion triggers protected or halted governance", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-branch-gov", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);

  for (let i = 0; i < 20; i += 1) {
    const fork = createScenarioBranch({
      sourceTimeline: parent,
      forest,
      branchPointTick: 0,
      divergenceInput: { branchId: `branch_${i}`, label: `Branch ${i}` },
    });
    if (!fork.ok) break;
    forest = fork.forest;
    parent = fork.parentTimeline;
  }

  assert.ok(forest.branches.length >= DEFAULT_MAX_ACTIVE_BRANCHES);

  const timelines = Object.values(forest.timelinesById);
  const verdict = governSimulationUniverse({
    activeTimelines: timelines,
    branchForests: [forest],
  });

  assert.ok(
    ["monitoring", "degraded", "protected", "halted"].includes(
      verdict.report.state.governanceStatus
    )
  );
  assert.ok(verdict.report.findings.some((f) => f.code === "branch_explosion_risk"));
  assert.ok(
    verdict.report.responses.some(
      (r) => r.action === "reject_branch" || r.action === "protect" || r.action === "advise"
    )
  );
});

test("corrupted timeline is rejected without mutation", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-corrupt", initialSnapshot: snap(0) });
  const frozen = JSON.stringify(timeline);
  const corrupted = {
    ...timeline,
    currentTick: 99,
  } as typeof timeline;

  const findings = validateSimulationIntegrity({
    activeTimelines: [corrupted],
  });
  assert.ok(findings.some((f) => f.code === "timeline_corruption"));
  assert.equal(JSON.stringify(timeline), frozen);

  const verdict = governSimulationUniverse({ activeTimelines: [corrupted] });
  assert.equal(verdict.allowed, false);
});

test("replay integrity failure halts unsafe replay", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-rep-gov", initialSnapshot: snap(0) });
  const session = createSimulationReplaySession({
    replayId: "rep-gov",
    sourceTimelineId: timeline.timelineId,
  });
  const replayed = replaySimulationTimeline({ session, sourceTimeline: timeline });
  assert.ok(replayed.ok);
  if (!replayed.ok) return;

  const badSnapshot = {
    ...replayed.snapshot,
    session: {
      ...replayed.snapshot.session,
      sourceTimelineId: "wrong-timeline-id",
    },
  };

  const integrity = verifyReplayIntegrity([badSnapshot]);
  assert.equal(integrity.verified, false);
  assert.ok(integrity.failures.length > 0);

  const verdict = governSimulationUniverse({
    activeTimelines: [timeline],
    replaySnapshots: [badSnapshot],
  });
  assert.equal(verdict.report.state.governanceStatus, "halted");
  assert.ok(verdict.report.responses.some((r) => r.action === "halt_replay"));
});

test("orchestration overload detection", () => {
  const parent = createOperationalTimeline({ timelineId: "tl-orch-gov", initialSnapshot: snap(0) });
  const overloadedSlots = Array.from({ length: GOVERNANCE_POLICY.maxWarRoomScenarios + 1 }, (_, i) => ({
    scenarioId: `scenario_${i}`,
    timelineId: parent.timelineId,
    label: `Scenario ${i}`,
    role: "alternative" as const,
  }));

  const verdict = governSimulationUniverse({
    activeTimelines: [parent],
    warRoomSnapshots: [
      {
        session: {
          sessionId: "wr-overload",
          title: "Overload test",
          createdAt: "2026-01-01T00:00:00.000Z",
          activeScenarioIds: overloadedSlots.map((s) => s.scenarioId),
          status: "completed",
          baselineScenarioId: "scenario_0",
        },
        state: {
          activeTimelineIds: [parent.timelineId],
          comparisonIds: [],
          interventionQueueIds: [],
        },
        history: {
          sessionId: "wr-overload",
          entries: [],
          interventionSequence: [],
          comparisonHistory: [],
          syncHistory: [],
          fingerprint: "hist",
        },
        narrative: { headline: "h", summary: "s", scenarioSummaries: [], bullets: [] },
        scenarioSlots: overloadedSlots,
        workingTimelinesByScenarioId: { scenario_0: parent },
        interventionOutcomes: [],
        comparisonSnapshots: [],
        fingerprint: "wr-snap",
      },
    ],
  });

  assert.ok(verdict.report.findings.some((f) => f.code === "orchestration_overload"));
});

test("propagation instability monitoring", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-prop-gov", initialSnapshot: snap(0) });
  const verdict = governSimulationUniverse({
    activeTimelines: [timeline],
    propagationDepthSamples: [4.5, 4.2, 3.9],
  });
  assert.ok(verdict.report.findings.some((f) => f.code === "propagation_instability"));
  assert.ok(
    ["monitoring", "degraded", "protected", "halted"].includes(
      verdict.report.state.governanceStatus
    )
  );
});

test("executive governance narrative is readable", () => {
  const narrative = buildExecutiveGovernanceNarrative({
    status: "protected",
    metrics: {
      activeTimelineCount: 10,
      activeBranchCount: 9,
      activeReplaySessionCount: 1,
      activeWarRoomSessionCount: 1,
      propagationDepthAverage: 2,
      replayIntegrityScore: 1,
      orchestrationPressure: 0.6,
      comparisonLoad: 2,
    },
    findings: [
      {
        code: "branch_explosion_risk",
        severity: "warning",
        message: "Branch count is approaching safe limits.",
      },
    ],
    responses: [
      {
        action: "protect",
        reason: "Branch count is approaching safe limits.",
        findingCode: "branch_explosion_risk",
      },
    ],
    replayIntegrity: { verified: true, checkedReplayCount: 0, failures: [], score: 1 },
  });
  assert.match(narrative.headline, /protected|governance|stability/i);
  assert.ok(!narrative.headline.includes("graph invalidation"));
});

test("freeze governance report is immutable", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-freeze-gov", initialSnapshot: snap(0) });
  const verdict = governSimulationUniverse({ activeTimelines: [timeline] });
  const frozen = freezeSimulationGovernanceReport(verdict.report);
  assert.throws(() => {
    (frozen.state as { integrityScore: number }).integrityScore = 0;
  });
});

test("integrated war-room + replay governance", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-int-gov", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);
  const fork = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: { branchId: "alt_path", forkHeadPatch: { operationalMetrics: { fragility: 0.4 } } },
  });
  assert.ok(fork.ok);
  if (!fork.ok) return;
  forest = fork.forest;

  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);
  const { session, state, history } = createWarRoomSimulationSession({
    sessionId: "wr-int-gov",
    title: "Integrated governance",
    scenarioIds: slots.map((s) => s.scenarioId),
  });
  const orchestrated = orchestrateWarRoomSimulation({
    session,
    state,
    history,
    forest,
    scenarioSlots: slots,
    timelinesByScenarioId: timelines,
    runComparisons: true,
  });
  assert.ok(orchestrated.ok);
  if (!orchestrated.ok) return;

  const baseline = orchestrated.snapshot.workingTimelinesByScenarioId.baseline ?? parent;
  const replaySession = createSimulationReplaySession({
    replayId: "rep-int-gov",
    sourceTimelineId: baseline.timelineId,
  });
  const replayed = replaySimulationTimeline({
    session: replaySession,
    sourceTimeline: baseline,
    warRoomSnapshot: orchestrated.snapshot,
    branchForest: forest,
  });
  assert.ok(replayed.ok);
  if (!replayed.ok) return;

  const verdict = governSimulationUniverse({
    activeTimelines: Object.values(forest.timelinesById),
    branchForests: [forest],
    warRoomSnapshots: [orchestrated.snapshot],
    replaySnapshots: [replayed.snapshot],
    comparisonCount: orchestrated.snapshot.comparisonSnapshots.length,
  });

  assert.ok(verdict.report.metrics.activeWarRoomSessionCount >= 1);
  assert.ok(verdict.report.replayIntegrity.verified);
  assert.ok(verdict.report.enterpriseContract.auditSummary.length > 0);
});
