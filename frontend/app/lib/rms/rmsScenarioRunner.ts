/**
 * NPA-T RMS:7 — thin Scenario composition runner. No new intelligence layer.
 */

import type { RmsActorIdentity } from "./rmsActorContracts.ts";
import { RMS_MANAGER_PROFILES } from "./rmsManagerProfiles.ts";
import { emptyRmsManagerKnowledge } from "./rmsManagerRuntime.ts";
import { RMS_7_BOUNDARY, type RmsScenarioDefinition, type RmsScenarioRunResult } from "./rmsScenarioContract.ts";
import { getRmsScenario } from "./rmsScenarioRegistry.ts";
import { validateRmsScenarioDefinition } from "./rmsScenarioValidation.ts";
import {
  createRmsFoundationSession,
  inspectRmsEventSchedule,
  inspectRmsManagerConversation,
  inspectRmsObserverReport,
  inspectRmsOperatorLedger,
  loadRmsEventSchedule,
  measureRmsObserverIntelligence,
  prepareRmsManagerConversation,
  publishRmsOperatorObservableData,
  runRmsManagerConversationTurn,
  runRmsOperatorObservation,
  stepRmsEventSchedule,
} from "./rmsSession.ts";

const ACTORS = Object.freeze([
  Object.freeze({ actorId: "mgr-agent-1", kind: "MANAGER_AGENT" }),
  Object.freeze({ actorId: "ops-agent-1", kind: "OPERATOR_AGENT" }),
  Object.freeze({ actorId: "nexora-1", kind: "NEXORA" }),
  Object.freeze({ actorId: "observer-1", kind: "OBSERVER" }),
  Object.freeze({ actorId: "real-mgr-1", kind: "REAL_MANAGER" }),
]) satisfies readonly RmsActorIdentity[];

const manager = ACTORS.find((actor) => actor.kind === "MANAGER_AGENT")!;
const observer = ACTORS.find((actor) => actor.kind === "OBSERVER")!;
const operator = ACTORS.find((actor) => actor.kind === "OPERATOR_AGENT")!;

export function resolveRmsScenario(input: {
  readonly scenario?: RmsScenarioDefinition;
  readonly scenarioId?: string;
  readonly version?: string;
}): RmsScenarioDefinition {
  const scenario = input.scenario ?? getRmsScenario(input.scenarioId ?? "", input.version ?? "1.0");
  validateRmsScenarioDefinition(scenario);
  return scenario;
}

export function executeRmsScenario(input: {
  readonly scenario?: RmsScenarioDefinition;
  readonly scenarioId?: string;
  readonly version?: string;
  readonly runId: string;
  readonly simulationId?: string;
}): { readonly result: RmsScenarioRunResult; readonly session: ReturnType<typeof createRmsFoundationSession> } {
  if (RMS_7_BOUNDARY.ownsGroundTruthEngine || RMS_7_BOUNDARY.ownsOperatorEngine || RMS_7_BOUNDARY.ownsManagerEngine) {
    throw new Error("RMS:7 must compose existing engines");
  }
  if (RMS_7_BOUNDARY.encodesExpectedNexoraAnswer) throw new Error("RMS:7 must not encode Nexora answers");
  const scenario = resolveRmsScenario(input);
  const world = scenario.instantiateWorld();
  const session = createRmsFoundationSession({
    simulationId: input.simulationId ?? `rms-7:${scenario.scenarioId}`,
    simulationType: "scenario-library",
    sessionId: `rms-7-${input.runId}`,
    runId: input.runId,
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: ACTORS,
    groundTruth: world,
  });
  loadRmsEventSchedule(session, operator, scenario.eventSchedule);
  if (scenario.durationTicks > 0) {
    stepRmsEventSchedule(session, operator, scenario.durationTicks);
  }
  const observations = runRmsOperatorObservation(session, operator, { enabledSources: scenario.enabledSources });
  publishRmsOperatorObservableData(session, operator, observations);
  prepareRmsManagerConversation(session, manager, {
    profile: RMS_MANAGER_PROFILES[scenario.managerProfileId],
    objective: scenario.managerObjective,
    knowledge: emptyRmsManagerKnowledge(scenario.managerVisibleContext),
  });
  for (let i = 0; i < scenario.managerTurns; i += 1) {
    runRmsManagerConversationTurn(session, manager);
  }
  const report = measureRmsObserverIntelligence(session, observer);
  const events = inspectRmsEventSchedule(session, observer);
  const ledger = inspectRmsOperatorLedger(session, observer);
  const conversation = inspectRmsManagerConversation(session, observer);
  inspectRmsObserverReport(session, observer);
  const result = Object.freeze({
    scenarioId: scenario.scenarioId,
    version: scenario.version,
    simulationId: session.identity.simulationId,
    runId: session.identity.runId,
    startTick: 0,
    endTick: scenario.durationTicks,
    eventTraceIds: Object.freeze((events.runtime?.traces ?? []).map((item) => item.eventId)),
    observationRecordIds: Object.freeze(ledger.observations.map((item) => item.recordId)),
    managerTurnCount: conversation.turns.length,
    observerMeasurementCount: report.measurements.length,
    observerFindingCount: report.findings.length,
    lifecycle: "completed" as const,
    forkCompatible: true as const,
    sealedGroundTruthExposed: false as const,
  });
  return Object.freeze({ result, session });
}

export function runRmsScenario(input: {
  readonly scenario?: RmsScenarioDefinition;
  readonly scenarioId?: string;
  readonly version?: string;
  readonly runId: string;
  readonly simulationId?: string;
}): RmsScenarioRunResult {
  return executeRmsScenario(input).result;
}

export { ACTORS as RMS_SCENARIO_RUN_ACTORS, manager as RMS_SCENARIO_MANAGER_ACTOR, observer as RMS_SCENARIO_OBSERVER_ACTOR, operator as RMS_SCENARIO_OPERATOR_ACTOR };
