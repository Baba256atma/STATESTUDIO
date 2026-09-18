/**
 * NPA-T RMS:8 — WATCH session playback. Presentation over one Scenario run.
 * Pause/step/play do not re-execute CC:5 or republish Data Reality.
 */

import { executeRmsScenario } from "./rmsScenarioRunner.ts";
import { exportRmsWatchSafeSurface } from "./rmsSession.ts";
import { getRmsWatchScenarioCard } from "./rmsWatchCatalog.ts";
import { RMS_8_BOUNDARY, type RmsWatchSession, type RmsWatchSpeed } from "./rmsWatchContract.ts";
import { progressForCursor, projectRmsWatchPresentation } from "./rmsWatchProjection.ts";
import { deleteRmsTakeControlView } from "./rmsHandoffStore.ts";
import { deleteRmsExperimentForWatch } from "./rmsExperimentStore.ts";
import type { RmsPublicSimulationState } from "./rmsSimulationState.ts";

const ORGANIZATION: Readonly<Record<string, string>> = Object.freeze({
  "manufacturing-capacity-pressure": "Northstar Manufacturing",
  "project-delivery-pressure": "Warehouse Expansion",
  "logistics-delivery-pressure": "Harbor Logistics",
  "service-capacity-pressure": "Northline Service",
});

let watchSeq = 0;
const SESSIONS = new Map<string, RmsWatchSession>();
const RUNTIMES = new Map<string, RmsPublicSimulationState>();

function buildSession(input: {
  readonly scenarioId: string;
  readonly version: string;
  readonly runId: string;
  readonly watchSessionId: string;
}): RmsWatchSession {
  if (RMS_8_BOUNDARY.duplicatesCc5OnPlayback) throw new Error("RMS:8 must not duplicate CC:5 on playback");
  const executed = executeRmsScenario({
    scenarioId: input.scenarioId,
    version: input.version,
    runId: input.runId,
    simulationId: `rms-8:${input.scenarioId}`,
  });
  const card = getRmsWatchScenarioCard(input.scenarioId, input.version);
  const surface = exportRmsWatchSafeSurface(executed.session, {
    scenarioId: input.scenarioId,
    version: input.version,
  });
  const presentation = projectRmsWatchPresentation({
    surface,
    card,
    organizationLabel: ORGANIZATION[input.scenarioId] ?? card.title,
  });
  const watch = Object.freeze({
    watchSessionId: input.watchSessionId,
    scenarioId: input.scenarioId,
    version: input.version,
    runId: executed.result.runId,
    simulationId: executed.result.simulationId,
    interactionMode: "WATCH",
    playbackState: "paused",
    cursor: 0,
    speed: 1,
    progress: "Beginning",
    currentTickLabel: "Start",
    visibleMoments: Object.freeze([presentation.moments[0]!]),
    currentMoment: presentation.moments[0] ?? null,
    presentation,
    execution: Object.freeze({
      managerTurnCount: surface.managerTurnCount,
      publicationCount: surface.publicationCount,
      cc5CallsAfterStart: 0,
    }),
    takeControl: Object.freeze({ reserved: true, implemented: false, handoffReady: true }),
    forkCompatible: true,
  });
  RUNTIMES.set(input.watchSessionId, executed.session);
  return watch;
}

function slice(session: RmsWatchSession, cursor: number, playbackState: RmsWatchSession["playbackState"]): RmsWatchSession {
  const last = session.presentation.moments.length - 1;
  const nextCursor = Math.min(Math.max(0, cursor), Math.max(0, last));
  const completed = nextCursor >= last;
  const state = completed ? "completed" : playbackState;
  const visible = session.presentation.moments.slice(0, nextCursor + 1);
  return Object.freeze({
    ...session,
    playbackState: state,
    cursor: nextCursor,
    progress: progressForCursor(session.presentation.moments, nextCursor),
    currentTickLabel: visible[visible.length - 1]?.label ?? "Start",
    visibleMoments: Object.freeze(visible),
    currentMoment: visible[visible.length - 1] ?? null,
    execution: Object.freeze({ ...session.execution, cc5CallsAfterStart: 0 as const }),
  });
}

export function startRmsWatchSession(input: { readonly scenarioId: string; readonly version?: string; readonly runId?: string }): RmsWatchSession {
  watchSeq += 1;
  const session = buildSession({
    scenarioId: input.scenarioId,
    version: input.version ?? "1.0",
    runId: input.runId ?? `watch-${watchSeq}`,
    watchSessionId: `watch-session-${watchSeq}`,
  });
  SESSIONS.set(session.watchSessionId, session);
  return session;
}

export function getRmsWatchSession(watchSessionId: string): RmsWatchSession {
  const session = SESSIONS.get(watchSessionId);
  if (!session) throw new Error("RMS:8 unknown WATCH session");
  return session;
}

function put(next: RmsWatchSession): RmsWatchSession {
  SESSIONS.set(next.watchSessionId, next);
  return next;
}

export function playRmsWatch(watchSessionId: string): RmsWatchSession {
  const session = getRmsWatchSession(watchSessionId);
  if (session.playbackState === "completed") return session;
  return put(slice(session, session.cursor, "playing"));
}

export function pauseRmsWatch(watchSessionId: string): RmsWatchSession {
  const session = getRmsWatchSession(watchSessionId);
  if (session.playbackState === "completed") return session;
  return put(slice(session, session.cursor, "paused"));
}

export function resumeRmsWatch(watchSessionId: string): RmsWatchSession {
  return playRmsWatch(watchSessionId);
}

export function stepRmsWatch(watchSessionId: string): RmsWatchSession {
  const session = getRmsWatchSession(watchSessionId);
  const state = session.playbackState === "playing" ? "playing" : "paused";
  return put(slice(session, session.cursor + 1, state));
}

export function restartRmsWatch(watchSessionId: string): RmsWatchSession {
  const previous = getRmsWatchSession(watchSessionId);
  SESSIONS.delete(watchSessionId);
  RUNTIMES.delete(watchSessionId);
  deleteRmsTakeControlView(watchSessionId);
  deleteRmsExperimentForWatch(watchSessionId);
  const next = buildSession({
    scenarioId: previous.scenarioId,
    version: previous.version,
    runId: `${previous.runId}:restart`,
    watchSessionId,
  });
  SESSIONS.set(watchSessionId, next);
  return next;
}

export function switchRmsWatchScenario(input: {
  readonly fromWatchSessionId: string;
  readonly scenarioId: string;
  readonly version?: string;
}): RmsWatchSession {
  SESSIONS.delete(input.fromWatchSessionId);
  RUNTIMES.delete(input.fromWatchSessionId);
  deleteRmsTakeControlView(input.fromWatchSessionId);
  deleteRmsExperimentForWatch(input.fromWatchSessionId);
  return startRmsWatchSession({ scenarioId: input.scenarioId, version: input.version });
}

export function setRmsWatchSpeed(watchSessionId: string, speed: RmsWatchSpeed): RmsWatchSession {
  const session = getRmsWatchSession(watchSessionId);
  const next = Object.freeze({ ...session, speed });
  return put(next);
}

export function listRmsWatchSessionIds(): readonly string[] {
  return Object.freeze([...SESSIONS.keys()]);
}

export function getRmsWatchRuntime(watchSessionId: string): RmsPublicSimulationState {
  const runtime = RUNTIMES.get(watchSessionId);
  if (!runtime) throw new Error("RMS:8 WATCH runtime is not bound");
  return runtime;
}

export function hasRmsWatchRuntime(watchSessionId: string): boolean {
  return RUNTIMES.has(watchSessionId);
}
