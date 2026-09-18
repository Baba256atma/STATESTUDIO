/**
 * NPA-T RMS:8 — Watch Experience tests.
 * Does not start RMS:9. Playback must not duplicate CC:5.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { RMS_7_BOUNDARY } from "./rmsScenarioContract.ts";
import { listRmsScenarios } from "./rmsScenarioRegistry.ts";
import { RMS_8_BOUNDARY } from "./rmsWatchContract.ts";
import { listRmsWatchScenarioCards } from "./rmsWatchCatalog.ts";
import { assertRmsWatchCustomerSafe, verifyRmsWatchExperience } from "./rmsWatchProjection.ts";
import {
  pauseRmsWatch,
  playRmsWatch,
  restartRmsWatch,
  resumeRmsWatch,
  startRmsWatchSession,
  stepRmsWatch,
  switchRmsWatchScenario,
} from "./rmsWatchSession.ts";
import { RmsWatchExperience } from "@/app/executive/watch/RmsWatchExperience.tsx";

const here = dirname(fileURLToPath(import.meta.url));
const LEAK = /machineAvailability|availableCapacity|evt:demand|evt:machine|Ground Truth|MACHINE_FAILURE|DEMAND_SURGE|OPERATOR_ERROR|CAUSAL_OVERCLAIM|\bCC:5\b|\bRDI:|\bVAI:/;

test("1–7 registry selection, WATCH contract, real Stage/Advisor, manager identity", () => {
  assert.equal(verifyRmsWatchExperience().ok, true);
  assert.equal(RMS_8_BOUNDARY.interactionMode, "WATCH");
  assert.equal(RMS_8_BOUNDARY.ownsStage, false);
  assert.equal(RMS_8_BOUNDARY.ownsAdvisor, false);
  assert.equal(RMS_8_BOUNDARY.conversationEntry, "executeNexoraConversationalExperience");
  assert.equal(RMS_7_BOUNDARY.startsRms8, false);
  const cards = listRmsWatchScenarioCards();
  assert.equal(cards.length, listRmsScenarios().length);
  assert.equal(cards[0]?.scenarioId, "manufacturing-capacity-pressure");
  const markup = renderToStaticMarkup(React.createElement(RmsWatchExperience, { cards }));
  assert.match(markup, /Choose a Business or Project/);
  assert.match(markup, /Manufacturing Under Capacity Pressure/);
  assert.doesNotMatch(markup, LEAK);
  const watch = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "watch-mfg-contract" });
  assert.equal(watch.interactionMode, "WATCH");
  assert.equal(watch.presentation.managerLabel, "Simulated Manager");
  assert.equal(watch.presentation.stage.authority, "Nexora Stage");
  assert.equal(watch.presentation.stage.rmsOwnsStage, false);
  assert.equal(watch.presentation.conversation.every((item) => item.rewritten === false), true);
  assert.ok(watch.presentation.conversation.some((item) => item.speaker === "SIMULATED_MANAGER"));
  assert.ok(watch.presentation.conversation.some((item) => item.speaker === "NEXORA"));
});

test("8–12 play, pause, resume, step, restart equivalence", () => {
  const session = startRmsWatchSession({ scenarioId: "logistics-delivery-pressure", runId: "watch-play" });
  assert.equal(session.playbackState, "paused");
  const played = playRmsWatch(session.watchSessionId);
  assert.equal(played.playbackState, "playing");
  const paused = pauseRmsWatch(session.watchSessionId);
  assert.equal(paused.playbackState, "paused");
  const resumed = resumeRmsWatch(session.watchSessionId);
  assert.equal(resumed.playbackState, "playing");
  const stepped = stepRmsWatch(session.watchSessionId);
  assert.equal(stepped.cursor, resumed.cursor + 1);
  assert.equal(stepped.execution.cc5CallsAfterStart, 0);
  assert.equal(stepped.execution.publicationCount, session.execution.publicationCount);
  const restarted = restartRmsWatch(session.watchSessionId);
  assert.equal(restarted.cursor, 0);
  assert.deepEqual(
    restarted.presentation.moments.map((item) => item.kind),
    session.presentation.moments.map((item) => item.kind),
  );
  assert.deepEqual(
    restarted.presentation.conversation.map((item) => item.text),
    session.presentation.conversation.map((item) => item.text),
  );
  assert.notEqual(restarted.runId, session.runId);
});

test("13–22 customer firewall, visible moments, no invented Stage/Data meaning", () => {
  const watch = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "watch-firewall" });
  assertRmsWatchCustomerSafe(watch.presentation);
  assert.doesNotMatch(JSON.stringify(watch), LEAK);
  assert.equal(watch.presentation.sealedGroundTruthExposed, false);
  assert.equal(watch.presentation.observerDiagnosticsExposed, false);
  assert.equal(watch.presentation.moments.every((item) => item.invented === false), true);
  assert.doesNotMatch(watch.visibleMoments.map((item) => item.label).join(" "), /MACHINE_FAILURE|hidden tick/);
  assert.match(watch.presentation.whatChanged, /visible/i);
  assert.doesNotMatch(watch.presentation.whatChanged, /Machine A secretly/);
  assert.doesNotMatch(watch.presentation.whyNexoraReacted, /Ground Truth|secretly failed/);
  assert.equal(watch.presentation.data.every((item) => item.semanticConfirmed === false), true);
  assert.equal(watch.presentation.takeControlImplemented, false);
});

test("23–28 manufacturing/project/logistics/service, switch isolation, restart session", () => {
  const manufacturing = startRmsWatchSession({ scenarioId: "manufacturing-capacity-pressure", runId: "watch-mfg-e2e" });
  const project = startRmsWatchSession({ scenarioId: "project-delivery-pressure", runId: "watch-prj-e2e" });
  const logistics = startRmsWatchSession({ scenarioId: "logistics-delivery-pressure", runId: "watch-log-e2e" });
  const service = startRmsWatchSession({ scenarioId: "service-capacity-pressure", runId: "watch-svc-e2e" });
  assert.equal(manufacturing.presentation.organizationLabel, "Northstar Manufacturing");
  assert.equal(project.presentation.organizationLabel, "Warehouse Expansion");
  assert.equal(logistics.scenarioId, "logistics-delivery-pressure");
  assert.equal(service.scenarioId, "service-capacity-pressure");
  const switched = switchRmsWatchScenario({
    fromWatchSessionId: manufacturing.watchSessionId,
    scenarioId: "project-delivery-pressure",
  });
  assert.equal(switched.scenarioId, "project-delivery-pressure");
  assert.notEqual(switched.watchSessionId, manufacturing.watchSessionId);
  assert.doesNotMatch(JSON.stringify(switched.presentation), /Northstar Manufacturing/);
  const restarted = restartRmsWatch(project.watchSessionId);
  assert.equal(restarted.scenarioId, "project-delivery-pressure");
  assert.equal(restarted.execution.cc5CallsAfterStart, 0);
});

test("29–32 TAKE_CONTROL reserved, fork compatible, no playback CC:5, RMS:7 boundary", () => {
  const watch = startRmsWatchSession({ scenarioId: "service-capacity-pressure", runId: "watch-future" });
  playRmsWatch(watch.watchSessionId);
  stepRmsWatch(watch.watchSessionId);
  const after = pauseRmsWatch(watch.watchSessionId);
  assert.equal(after.takeControl.reserved, true);
  assert.equal(after.takeControl.implemented, false);
  assert.equal(after.takeControl.handoffReady, true);
  assert.equal(after.forkCompatible, true);
  assert.equal(RMS_8_BOUNDARY.startsRms9, false);
  assert.equal(after.execution.cc5CallsAfterStart, 0);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  const page = readFileSync(join(here, "../../executive/watch/page.tsx"), "utf8");
  assert.match(page, /RmsWatchExperience/);
  assert.doesNotMatch(page, /inspectRmsGroundTruth|inspectRmsObserverReport/);
});
