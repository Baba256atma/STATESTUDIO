/**
 * NPA-T RMS:10 — Experiment, fork, branch isolation, comparison.
 * Simulation Outcome ≠ real-world prediction. No automatic winner.
 */

import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { RMS_5_BOUNDARY } from "./rmsObserverContract.ts";
import { RMS_9_BOUNDARY } from "./rmsHandoffContract.ts";
import {
  RMS_10_BOUNDARY,
  RMS_10_MAX_BRANCHES,
  RMS_SIMULATION_REAL_WORLD_NOTICE,
  type RmsComparisonCell,
  type RmsExperiment,
  type RmsExperimentBranchView,
  type RmsExperimentComparison,
  type RmsExperimentTraceEvent,
  type RmsExperimentView,
  type RmsForkPoint,
  type RmsSimulationAction,
} from "./rmsExperimentContract.ts";
import { getRmsScenarioActionModel, listRmsScenarioActionModels } from "./rmsSimulationActionModels.ts";
import {
  applyRmsGroundTruthEventsOnCurrentTick,
  attachRmsExperimentBranch,
  cloneRmsFoundationSession,
  getRmsActiveManagerAuthority,
  getRmsHandoffPhase,
  inspectRmsExperimentTrace,
  inspectRmsGroundTruth,
  inspectRmsHandoffTrace,
  inspectRmsManagerConversation,
  inspectRmsOperatorLedger,
  inspectRmsSimulationActions,
  isRmsManagerTurnInFlight,
  pauseRmsGroundTruth,
  publishRmsOperatorObservableData,
  recordRmsExperimentTrace,
  recordRmsSimulationAction,
  replaceRmsSimulationAction,
  runRmsHumanManagerTurn,
  runRmsOperatorObservation,
  stepRmsEventSchedule,
} from "./rmsSession.ts";
import { getRmsWatchRuntime, getRmsWatchSession, hasRmsWatchRuntime, pauseRmsWatch } from "./rmsWatchSession.ts";
import { RMS_SCENARIO_OBSERVER_ACTOR, RMS_SCENARIO_OPERATOR_ACTOR, RMS_SCENARIO_RUN_ACTORS } from "./rmsScenarioRunner.ts";
import { assertRmsWatchCustomerSafe } from "./rmsWatchProjection.ts";
import {
  deleteRmsExperimentForWatch,
  getRmsExperimentIdForWatch,
  getRmsExperimentStored,
  setRmsExperimentStored,
} from "./rmsExperimentStore.ts";
import type { RmsPublicSimulationState } from "./rmsSimulationState.ts";

const observer = RMS_SCENARIO_OBSERVER_ACTOR;
const operator = RMS_SCENARIO_OPERATOR_ACTOR;
const human = RMS_SCENARIO_RUN_ACTORS.find((actor) => actor.kind === "REAL_MANAGER")!;

const COMPARABLE_FIELDS = Object.freeze([
  "orders_received",
  "CAP_AV",
  "inventory_quantity",
  "actual_progress",
  "resource_usage",
  "schedule_observation",
]);

function requireStored(experimentId: string) {
  const stored = getRmsExperimentStored(experimentId);
  if (!stored) throw new Error("RMS:10 unknown experiment");
  return stored;
}

function requireBranch(experimentId: string, branchId: string) {
  const stored = requireStored(experimentId);
  const session = stored.branches.get(branchId);
  if (!session) throw new Error("RMS:10 unknown branch");
  return { stored, session };
}

function trace(
  session: RmsPublicSimulationState,
  kind: RmsExperimentTraceEvent["kind"],
  branchId: string | null,
  ref: string,
): void {
  const events = inspectRmsExperimentTrace(session, observer).events;
  recordRmsExperimentTrace(session, Object.freeze({
    eventId: `${session.identity.runId}:exp:${events.length}:${kind}`,
    kind,
    atTick: inspectRmsGroundTruth(session, observer).clock.tick,
    branchId,
    ref,
  }));
}

function branchView(
  session: RmsPublicSimulationState,
  label: string,
  kind: "BASELINE" | "INTERVENTION",
  inheritedHumanTurns: number,
): RmsExperimentBranchView {
  const world = inspectRmsGroundTruth(session, observer);
  const inherited = inspectRmsManagerConversation(session, observer).turns.length;
  const humanTurns = inspectRmsHandoffTrace(session, observer).humanTurns.length;
  return Object.freeze({
    branchId: inspectRmsSimulationActions(session, observer).branchId ?? session.identity.runId,
    runId: session.identity.runId,
    worldId: world.worldId,
    label,
    kind,
    tick: world.clock.tick,
    paused: world.paused,
    inheritedTurnCount: inherited,
    postForkHumanTurns: Math.max(0, humanTurns - inheritedHumanTurns),
    simulationActions: inspectRmsSimulationActions(session, observer).actions,
  });
}

function refreshView(experimentId: string, extras?: Partial<RmsExperiment> & { readonly comparison?: RmsExperimentComparison | null }): RmsExperimentView {
  const stored = requireStored(experimentId);
  const experiment: RmsExperiment = Object.freeze({
    ...stored.view.experiment,
    ...extras,
    branchIds: Object.freeze([...stored.branches.keys()]),
  });
  const inheritedHumanTurns = inspectRmsHandoffTrace(stored.template, observer).humanTurns.length;
  const branches = experiment.branchIds.map((branchId) => {
    const existing = stored.view.branches.find((item) => item.branchId === branchId);
    const session = stored.branches.get(branchId)!;
    return branchView(
      session,
      existing?.label ?? branchId,
      existing?.kind ?? (branchId.endsWith(":baseline") ? "BASELINE" : "INTERVENTION"),
      inheritedHumanTurns,
    );
  });
  const view: RmsExperimentView = Object.freeze({
    experiment,
    forkPoint: stored.view.forkPoint,
    branches: Object.freeze(branches),
    comparison: extras && "comparison" in extras ? extras.comparison ?? null : stored.view.comparison,
    customerNotice: RMS_SIMULATION_REAL_WORLD_NOTICE,
    pausedAtFork: true,
  });
  stored.view = view;
  return setRmsExperimentStored(stored);
}

export function startRmsExperiment(watchSessionId: string): RmsExperimentView {
  if (RMS_10_BOUNDARY.autoWinner || RMS_10_BOUNDARY.realWorldPrediction) {
    throw new Error("RMS:10 must not declare winners or real-world predictions");
  }
  if (RMS_10_BOUNDARY.parallelVai || RMS_10_BOUNDARY.parallelNps || RMS_10_BOUNDARY.parallelStage) {
    throw new Error("RMS:10 must not create parallel VAI/NPS/Stage");
  }
  const existingId = getRmsExperimentIdForWatch(watchSessionId);
  if (existingId) return requireStored(existingId).view;
  if (!hasRmsWatchRuntime(watchSessionId)) throw new Error("RMS:10 parent WATCH runtime is missing");
  pauseRmsWatch(watchSessionId);
  const parent = getRmsWatchRuntime(watchSessionId);
  if (getRmsHandoffPhase(parent) !== "TAKE_CONTROL" || getRmsActiveManagerAuthority(parent) !== "HUMAN_MANAGER") {
    throw new Error("RMS:10 EXPERIMENT requires TAKE_CONTROL");
  }
  if (isRmsManagerTurnInFlight(parent)) throw new Error("RMS:10 cannot fork during an in-flight manager turn");
  pauseRmsGroundTruth(parent, operator, true);
  const watch = getRmsWatchSession(watchSessionId);
  const world = inspectRmsGroundTruth(parent, observer);
  const parentTick = world.clock.tick;
  const experimentId = `${watch.runId}:exp`;
  const forkPointId = `${experimentId}:fork`;
  const template = cloneRmsFoundationSession(parent, observer, {
    simulationId: `${watch.simulationId}:exp`,
    sessionId: `${watch.runId}:exp-template`,
    runId: `${watch.runId}:exp-template`,
    worldId: `${world.worldId}:fork`,
  });
  pauseRmsGroundTruth(template, operator, true);
  const baselineId = `${experimentId}:baseline`;
  const baseline = cloneRmsFoundationSession(template, observer, {
    simulationId: `${watch.simulationId}:exp`,
    sessionId: baselineId,
    runId: baselineId,
    worldId: `${world.worldId}:baseline`,
  });
  attachRmsExperimentBranch(template, { experimentId, branchId: `${experimentId}:template` });
  attachRmsExperimentBranch(baseline, { experimentId, branchId: baselineId });
  trace(template, "SAFE_BOUNDARY", null, "paused");
  trace(template, "FORK", null, forkPointId);
  trace(baseline, "BRANCH_CREATED", baselineId, "BASELINE");
  const forkPoint: RmsForkPoint = Object.freeze({
    forkPointId,
    experimentId,
    parentRunId: watch.runId,
    parentWatchSessionId: watchSessionId,
    scenarioId: watch.scenarioId,
    version: watch.version,
    simulationId: watch.simulationId,
    tick: parentTick,
    worldRef: world.worldId,
    operatorRef: "OPERATOR_AGENT",
    dataRealityRef: "P0:1/NexoraDataRealityFoundation",
    conversationRef: "executeNexoraConversationalExperience",
    stageRef: "Nexora Stage",
    eventLifecycleRef: "RMS:6",
    managerAuthority: "HUMAN_MANAGER",
    observerTraceBoundary: `${watch.runId}:observer`,
  });
  const experiment: RmsExperiment = Object.freeze({
    experimentId,
    scenarioId: watch.scenarioId,
    version: watch.version,
    parentRunId: watch.runId,
    parentWatchSessionId: watchSessionId,
    forkPointId,
    forkTick: parentTick,
    createdAt: world.clock.simulatedAt,
    createdBy: "HUMAN_MANAGER",
    branchIds: Object.freeze([baselineId]),
    baselineBranchId: baselineId,
    lifecycle: "FORKED",
    selectedBranchId: baselineId,
    comparisonReady: false,
  });
  const view: RmsExperimentView = Object.freeze({
    experiment,
    forkPoint,
    branches: Object.freeze([
      branchView(baseline, "No New Intervention", "BASELINE", inspectRmsHandoffTrace(template, observer).humanTurns.length),
    ]),
    comparison: null,
    customerNotice: RMS_SIMULATION_REAL_WORLD_NOTICE,
    pausedAtFork: true,
  });
  assertRmsWatchCustomerSafe({ notice: view.customerNotice, label: view.branches[0]?.label });
  return setRmsExperimentStored({
    view,
    parent,
    template,
    branches: new Map([[baselineId, baseline]]),
  });
}

export function createRmsExperimentBranch(
  experimentId: string,
  input: { readonly label: string; readonly kind?: "INTERVENTION" },
): RmsExperimentView {
  const stored = requireStored(experimentId);
  if (stored.branches.size >= RMS_10_MAX_BRANCHES) throw new Error("RMS:10 supports at most 3 comparison branches");
  const seq = stored.branches.size;
  const branchId = `${experimentId}:b${seq}`;
  const parentWorld = inspectRmsGroundTruth(stored.parent, observer);
  const session = cloneRmsFoundationSession(stored.template, observer, {
    simulationId: `${stored.view.forkPoint.simulationId}:${branchId}`,
    sessionId: branchId,
    runId: branchId,
    worldId: `${parentWorld.worldId}:${branchId}`,
  });
  attachRmsExperimentBranch(session, { experimentId, branchId });
  pauseRmsGroundTruth(session, operator, true);
  trace(session, "BRANCH_CREATED", branchId, input.label);
  stored.branches.set(branchId, session);
  stored.view = Object.freeze({
    ...stored.view,
    branches: Object.freeze([
      ...stored.view.branches,
      branchView(session, input.label, input.kind ?? "INTERVENTION", inspectRmsHandoffTrace(stored.template, observer).humanTurns.length),
    ]),
  });
  return refreshView(experimentId, { lifecycle: "FORKED", selectedBranchId: branchId });
}

export function selectRmsExperimentBranch(experimentId: string, branchId: string): RmsExperimentView {
  requireBranch(experimentId, branchId);
  const view = refreshView(experimentId, { selectedBranchId: branchId, lifecycle: "RUNNING" });
  const { session } = requireBranch(experimentId, branchId);
  trace(session, "BRANCH_SWITCH", branchId, branchId);
  return view;
}

export function speakOnRmsExperimentBranch(experimentId: string, branchId: string, utterance: string) {
  const { session } = requireBranch(experimentId, branchId);
  if (RMS_4_BOUNDARY.autoApproveDecision || RMS_4_BOUNDARY.autoStartExecution || RMS_10_BOUNDARY.ownsDecision || RMS_10_BOUNDARY.ownsExecution) {
    throw new Error("RMS:10 must not create Decision or start Execution");
  }
  const spoken = runRmsHumanManagerTurn(session, human, utterance);
  trace(session, "HUMAN_TURN", branchId, utterance);
  refreshView(experimentId, { lifecycle: "RUNNING", selectedBranchId: branchId });
  return Object.freeze({
    ...spoken,
    autoApproveDecision: false as const,
    autoStartExecution: false as const,
    createdDecision: false as const,
    startedExecution: false as const,
  });
}

export function requestRmsBranchSimulationAction(input: {
  readonly experimentId: string;
  readonly branchId: string;
  readonly actionType: string;
  readonly sourceManagementActionRef: string;
}): RmsSimulationAction {
  const { stored, session } = requireBranch(input.experimentId, input.branchId);
  const model = getRmsScenarioActionModel(stored.view.experiment.scenarioId, input.actionType);
  const tick = inspectRmsGroundTruth(session, observer).clock.tick;
  if (!model) {
    const unsupported: RmsSimulationAction = Object.freeze({
      simulationActionId: `${input.branchId}:${input.actionType}:unsupported`,
      experimentId: input.experimentId,
      branchId: input.branchId,
      sourceManagementActionRef: input.sourceManagementActionRef,
      actionType: input.actionType,
      effectiveTick: tick,
      expireTick: null,
      targetVariableId: "",
      targetKey: "",
      delta: 0,
      delayTicks: 0,
      durationTicks: null,
      status: "UNSUPPORTED",
      provenance: "management-action",
      modeledAssumptions: Object.freeze(["This action is not modeled in this simulation."]),
      vaiProvenCausality: false,
      realWorldPrediction: false,
    });
    recordRmsSimulationAction(session, unsupported);
    trace(session, "UNSUPPORTED_ACTION", input.branchId, input.actionType);
    refreshView(input.experimentId);
    return unsupported;
  }
  const action: RmsSimulationAction = Object.freeze({
    simulationActionId: `${input.branchId}:${model.actionType}:${tick}`,
    experimentId: input.experimentId,
    branchId: input.branchId,
    sourceManagementActionRef: input.sourceManagementActionRef,
    actionType: model.actionType,
    effectiveTick: tick + model.delayTicks,
    expireTick: model.durationTicks == null ? null : tick + model.delayTicks + model.durationTicks,
    targetVariableId: model.targetVariableId,
    targetKey: model.targetKey,
    delta: model.delta,
    delayTicks: model.delayTicks,
    durationTicks: model.durationTicks,
    status: "SCHEDULED",
    provenance: "management-action",
    modeledAssumptions: model.assumptions,
    vaiProvenCausality: false,
    realWorldPrediction: false,
  });
  recordRmsSimulationAction(session, action);
  trace(session, "SIMULATION_ACTION", input.branchId, action.simulationActionId);
  applyDueSimulationActions(session);
  refreshView(input.experimentId, { lifecycle: "RUNNING", selectedBranchId: input.branchId });
  return inspectRmsSimulationActions(session, observer).actions.find((item) => item.simulationActionId === action.simulationActionId) ?? action;
}

function applyDueSimulationActions(session: RmsPublicSimulationState): void {
  const world = inspectRmsGroundTruth(session, observer);
  const paused = world.paused;
  if (paused) pauseRmsGroundTruth(session, operator, false);
  for (const action of inspectRmsSimulationActions(session, observer).actions) {
    if (action.status === "UNSUPPORTED") continue;
    if (action.status === "SCHEDULED" && world.clock.tick >= action.effectiveTick && action.targetVariableId) {
      applyRmsGroundTruthEventsOnCurrentTick(session, operator, [
        {
          eventId: `${action.simulationActionId}:apply`,
          type: inferEventType(action.targetKey),
          variableId: action.targetVariableId,
          delta: action.delta,
        },
      ]);
      replaceRmsSimulationAction(session, action.simulationActionId, Object.freeze({ ...action, status: "APPLIED" }));
      trace(session, "WORLD_TRANSITION", action.branchId, action.simulationActionId);
    }
    const current = inspectRmsGroundTruth(session, observer);
    const latest = inspectRmsSimulationActions(session, observer).actions.find((item) => item.simulationActionId === action.simulationActionId);
    if (latest?.status === "APPLIED" && latest.expireTick != null && current.clock.tick >= latest.expireTick) {
      applyRmsGroundTruthEventsOnCurrentTick(session, operator, [
        {
          eventId: `${latest.simulationActionId}:expire`,
          type: inferEventType(latest.targetKey),
          variableId: latest.targetVariableId,
          delta: -latest.delta,
        },
      ]);
      replaceRmsSimulationAction(session, latest.simulationActionId, Object.freeze({ ...latest, status: "EXPIRED" }));
    }
  }
  if (paused) pauseRmsGroundTruth(session, operator, true);
}

function inferEventType(targetKey: string): "CAPACITY_CHANGE" | "RESOURCE_CHANGE" | "INVENTORY_CHANGE" | "SCHEDULE_CHANGE" {
  if (targetKey === "inventory") return "INVENTORY_CHANGE";
  if (targetKey === "staffAvailable" || targetKey === "scheduleVarianceDays") {
    return targetKey === "scheduleVarianceDays" ? "SCHEDULE_CHANGE" : "RESOURCE_CHANGE";
  }
  return "CAPACITY_CHANGE";
}

export function stepRmsExperimentBranch(experimentId: string, branchId: string, ticks = 1): RmsExperimentView {
  const { session } = requireBranch(experimentId, branchId);
  pauseRmsGroundTruth(session, operator, false);
  const start = inspectRmsGroundTruth(session, observer).clock.tick;
  stepRmsEventSchedule(session, operator, start + ticks);
  applyDueSimulationActions(session);
  const records = runRmsOperatorObservation(session, operator);
  publishRmsOperatorObservableData(session, operator, records);
  refreshView(experimentId, { lifecycle: "RUNNING", selectedBranchId: branchId });
  return selectRmsExperimentBranch(experimentId, branchId);
}

export function pauseRmsExperimentBranch(experimentId: string, branchId: string): RmsExperimentView {
  const { session } = requireBranch(experimentId, branchId);
  pauseRmsGroundTruth(session, operator, true);
  return refreshView(experimentId, { selectedBranchId: branchId });
}

export function resumeRmsExperimentBranch(experimentId: string, branchId: string): RmsExperimentView {
  const { session } = requireBranch(experimentId, branchId);
  pauseRmsGroundTruth(session, operator, false);
  return refreshView(experimentId, { selectedBranchId: branchId, lifecycle: "RUNNING" });
}

export function restartRmsExperimentBranch(experimentId: string, branchId: string): RmsExperimentView {
  const stored = requireStored(experimentId);
  const previous = stored.view.branches.find((item) => item.branchId === branchId);
  if (!previous) throw new Error("RMS:10 unknown branch");
  const world = inspectRmsGroundTruth(stored.parent, observer);
  const session = cloneRmsFoundationSession(stored.template, observer, {
    simulationId: `${stored.view.forkPoint.simulationId}:${branchId}`,
    sessionId: `${branchId}:restart`,
    runId: branchId,
    worldId: `${world.worldId}:${branchId}:restart`,
  });
  attachRmsExperimentBranch(session, { experimentId, branchId });
  pauseRmsGroundTruth(session, operator, true);
  trace(session, "BRANCH_RESTART", branchId, branchId);
  stored.branches.set(branchId, session);
  return refreshView(experimentId, { selectedBranchId: branchId, lifecycle: "FORKED" });
}

export function compareRmsExperiment(experimentId: string): RmsExperimentView {
  const stored = requireStored(experimentId);
  const rows: RmsComparisonCell[] = [];
  const assumptions: Record<string, readonly string[]> = {};
  for (const branch of stored.view.branches) {
    const session = stored.branches.get(branch.branchId)!;
    const ledger = inspectRmsOperatorLedger(session, observer);
    const latest: Record<string, string | number | boolean | null> = {};
    for (const record of ledger.observations) {
      if ((COMPARABLE_FIELDS as readonly string[]).includes(record.field)) latest[record.field] = record.value;
    }
    for (const field of COMPARABLE_FIELDS) {
      if (!(field in latest)) continue;
      rows.push(
        Object.freeze({
          experimentId,
          branchId: branch.branchId,
          runId: session.identity.runId,
          dimension: field,
          value: latest[field] ?? null,
          unit: null,
        }),
      );
    }
    assumptions[branch.branchId] = Object.freeze(
      inspectRmsSimulationActions(session, observer).actions.flatMap((item) => [...item.modeledAssumptions]),
    );
  }
  const comparison: RmsExperimentComparison = Object.freeze({
    experimentId,
    forkTick: stored.view.forkPoint.tick,
    notice: RMS_SIMULATION_REAL_WORLD_NOTICE,
    explanation: Object.freeze([
      `All paths started from the same simulation state at tick ${stored.view.forkPoint.tick}.`,
      "These are simulated consequences under this Scenario model.",
      RMS_SIMULATION_REAL_WORLD_NOTICE,
    ]),
    assumptions: Object.freeze(assumptions),
    rows: Object.freeze(rows),
    winner: null,
    bestPath: null,
    observerDiagnostics: false,
    canonicalOutcome: false,
    durableLearning: false,
  });
  assertRmsWatchCustomerSafe({
    notice: comparison.notice,
    explanation: comparison.explanation.join(" "),
  });
  const { session } = requireBranch(experimentId, stored.view.experiment.selectedBranchId);
  trace(session, "COMPARISON", null, experimentId);
  return refreshView(experimentId, { lifecycle: "COMPARING", comparisonReady: true, comparison });
}

export function getRmsExperimentView(experimentId: string): RmsExperimentView {
  return requireStored(experimentId).view;
}

export function getRmsExperimentBranchSession(experimentId: string, branchId: string): RmsPublicSimulationState {
  return requireBranch(experimentId, branchId).session;
}

export function getRmsExperimentParentSession(experimentId: string): RmsPublicSimulationState {
  return requireStored(experimentId).parent;
}

export function restoreRmsExperiment(watchSessionId: string): RmsExperimentView | null {
  const experimentId = getRmsExperimentIdForWatch(watchSessionId);
  if (!experimentId) return null;
  return requireStored(experimentId).view;
}

export function closeRmsExperimentForWatch(watchSessionId: string): void {
  deleteRmsExperimentForWatch(watchSessionId);
}

export function listRmsScenarioExperimentActions(scenarioId: string) {
  return listRmsScenarioActionModels(scenarioId);
}

export function verifyRmsExperiment(): { readonly ok: true } {
  if (RMS_10_BOUNDARY.ownsDecision || RMS_10_BOUNDARY.ownsExecution) throw new Error("RMS:10 must not own Decision/Execution");
  if (RMS_10_BOUNDARY.ownsOutcome || RMS_10_BOUNDARY.ownsLearning || RMS_10_BOUNDARY.writesCanonicalOutcome || RMS_10_BOUNDARY.writesDurableLearning) {
    throw new Error("RMS:10 must not write Outcome/Learning");
  }
  if (RMS_10_BOUNDARY.autoWinner || RMS_10_BOUNDARY.inventsUnsupportedEffects || RMS_10_BOUNDARY.freeWorldEditing) {
    throw new Error("RMS:10 comparison/action safety failed");
  }
  if (RMS_10_BOUNDARY.parallelVai || VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore) {
    throw new Error("RMS:10 must not duplicate VAI");
  }
  if (RMS_10_BOUNDARY.startsRms11) throw new Error("RMS:10 must not start RMS:11");
  if (RMS_10_BOUNDARY.groundTruthTransitionAuthority !== "RMS:2") throw new Error("RMS:10 must use RMS:2 transitions");
  if (RMS_9_BOUNDARY.startsRms10) throw new Error("RMS:9 must remain stopped at RMS:10");
  if (RMS_5_BOUNDARY.leaksGroundTruthToManager) throw new Error("RMS:10 Observer must not leak Ground Truth");
  return Object.freeze({ ok: true as const });
}

export { RMS_SIMULATION_REAL_WORLD_NOTICE, human as RMS_EXPERIMENT_HUMAN_ACTOR };
