import test from "node:test";
import assert from "node:assert/strict";

import {
  W1_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  W1_CERTIFICATION_FREEZE_TAGS,
  W1_CERTIFIED_TAG,
  W1_WAR_ROOM_OPERATIONAL_CERTIFICATION_TAG,
  WAR_ROOM_OPERATIONAL_COMPLETE_TAG,
} from "./warRoomOperationalCertificationContract.ts";
import { runWarRoomOperationalCertification } from "./warRoomOperationalCertification.ts";

test("exports W1 war room operational certification tags and diagnostic", () => {
  assert.equal(W1_CERTIFIED_TAG, "[W1_CERTIFIED]");
  assert.equal(WAR_ROOM_OPERATIONAL_COMPLETE_TAG, "[WAR_ROOM_OPERATIONAL_COMPLETE]");
  assert.equal(W1_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[W1_CERTIFICATION_COMPLETE]");
  assert.deepEqual(W1_CERTIFICATION_FREEZE_TAGS, [
    "[W1_CERTIFIED]",
    "[WAR_ROOM_OPERATIONAL_COMPLETE]",
  ]);
});

test("W1 war room operational certification passes gates A through N", () => {
  const result = runWarRoomOperationalCertification({ buildPassed: true, testsPassed: true });

  assert.equal(result.tag, W1_WAR_ROOM_OPERATIONAL_CERTIFICATION_TAG);
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 14);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(W1_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("W1 war room operational certification exposes required validation gates", () => {
  const result = runWarRoomOperationalCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("War Room Contract works"), true);
  assert.equal(gateNames.includes("Signal Aggregator works"), true);
  assert.equal(gateNames.includes("Critical Event Detector works"), true);
  assert.equal(gateNames.includes("Decision Pressure Engine works"), true);
  assert.equal(gateNames.includes("Action Priority Engine works"), true);
  assert.equal(gateNames.includes("Dashboard Binding works"), true);
  assert.equal(gateNames.includes("Assistant Bridge works"), true);
  assert.equal(gateNames.includes("No Scene mutations"), true);
  assert.equal(gateNames.includes("No Topology mutations"), true);
  assert.equal(gateNames.includes("No Routing changes"), true);
  assert.equal(gateNames.includes("No DS mutations"), true);
  assert.equal(gateNames.includes("No Simulation mutations"), true);
  assert.equal(gateNames.includes("Build passes"), true);
  assert.equal(gateNames.includes("Tests pass"), true);
});
