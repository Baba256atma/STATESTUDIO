/**
 * NPA-T OVS:3-FIX1B — response.spatial → dthExpSpatial live Stage handoff.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { projectDthExpLiveTheatreSceneResponse } from "@/app/lib/dth-exp/dthExpPublicIndex.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  nexoraLiveStageDthExpSpatialHandoffIdentity,
  resolveNexoraLiveStageDthExpSpatial,
} from "./resolveNexoraLiveStageDthExpSpatial.ts";

const here = dirname(fileURLToPath(import.meta.url));

function theatreFor(objectId: string | null) {
  let stageState = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (objectId != null) {
    stageState = selectNexoraMVPInteractionSubject(stageState, objectId);
  }
  return projectNexoraDecisionTheatreFoundation({ stageState });
}

test("A — Eligible risk spatial is the same projection Stage receives", () => {
  assert.equal(
    nexoraLiveStageDthExpSpatialHandoffIdentity,
    "NPA-T OVS:3-FIX1B/LiveStageDthExpSpatialHandoff",
  );
  const theatre = theatreFor("obj-risk");
  const response = projectDthExpLiveTheatreSceneResponse({ theatre });
  const dthExpSpatial = resolveNexoraLiveStageDthExpSpatial(theatre);
  assert.equal(response.targetFamily, "NEXO_RISK");
  assert.ok(response.spatial);
  assert.ok(dthExpSpatial);
  assert.equal(dthExpSpatial.family, response.spatial.family);
  assert.equal(dthExpSpatial.identity, response.spatial.identity);
  assert.deepEqual(
    dthExpSpatial.actors.map((actor) => actor.canonicalObjectId),
    response.spatial.actors.map((actor) => actor.canonicalObjectId),
  );
  assert.equal(dthExpSpatial.family, "NEXO_RISK");
  const mount = readFileSync(join(here, "NexoraStageMount.tsx"), "utf8");
  assert.match(mount, /resolveNexoraLiveStageDthExpSpatial\(theatreComposition\)/);
  assert.match(mount, /dthExpSpatial=\{dthExpSpatial\}/);
});

test("B — Null spatial remains null on Stage", () => {
  const overview = theatreFor(null);
  const response = projectDthExpLiveTheatreSceneResponse({ theatre: overview });
  assert.equal(response.spatial, null);
  assert.equal(resolveNexoraLiveStageDthExpSpatial(overview), null);
  assert.equal(resolveNexoraLiveStageDthExpSpatial(null), null);
  const capacity = theatreFor("obj-capacity");
  assert.equal(resolveNexoraLiveStageDthExpSpatial(capacity), null);
});

test("C — Stale NEXO_RISK spatial does not survive a later non-spatial scene", () => {
  const riskSpatial = resolveNexoraLiveStageDthExpSpatial(theatreFor("obj-risk"));
  assert.ok(riskSpatial);
  const later = resolveNexoraLiveStageDthExpSpatial(theatreFor(null));
  assert.equal(later, null);
  assert.notEqual(later, riskSpatial);
});

test("D — Canonical obj-risk identity is unchanged across the handoff", () => {
  const theatre = theatreFor("obj-risk");
  const spatial = resolveNexoraLiveStageDthExpSpatial(theatre);
  assert.ok(spatial?.actors.some((actor) => actor.canonicalObjectId === "obj-risk"));
  assert.equal(
    spatial?.actors.some((actor) => actor.canonicalObjectId === "ovs-risk"),
    false,
  );
});

test("E — Shell / Stage / OVS do not select Nexo families", () => {
  const shell = readFileSync(join(here, "NexoraExecutiveShell.tsx"), "utf8");
  const stage = readFileSync(join(here, "stage/Nexora3DExecutiveStage.tsx"), "utf8");
  const mount = readFileSync(join(here, "NexoraStageMount.tsx"), "utf8");
  const ovs = readFileSync(
    join(here, "../../lib/spatial-presentation/executiveOvsIsometricTheatreVisual.ts"),
    "utf8",
  );
  const handoff = readFileSync(join(here, "resolveNexoraLiveStageDthExpSpatial.ts"), "utf8");
  for (const source of [shell, stage, mount, ovs, handoff]) {
    assert.doesNotMatch(source, /selectNexoraDirectorNexoFamily/);
    assert.doesNotMatch(source, /DTH_EXP_DIRECTOR_NEXO_NEED_TO_FAMILY/);
  }
});

test("F — Shell / Stage do not recompute spatial layout", () => {
  const shell = readFileSync(join(here, "NexoraExecutiveShell.tsx"), "utf8");
  const stage = readFileSync(join(here, "stage/Nexora3DExecutiveStage.tsx"), "utf8");
  const mount = readFileSync(join(here, "NexoraStageMount.tsx"), "utf8");
  const handoff = readFileSync(join(here, "resolveNexoraLiveStageDthExpSpatial.ts"), "utf8");
  for (const source of [shell, stage, mount, handoff]) {
    assert.doesNotMatch(source, /projectDthExpSpatialLayout/);
  }
  assert.match(handoff, /projectDthExpLiveTheatreSceneResponse/);
  assert.match(handoff, /\.spatial/);
});

test("G — Single Stage / Canvas host is preserved", () => {
  const mount = readFileSync(join(here, "NexoraStageMount.tsx"), "utf8");
  const stage = readFileSync(join(here, "stage/Nexora3DExecutiveStage.tsx"), "utf8");
  assert.equal([...mount.matchAll(/<Nexora3DExecutiveStage/g)].length, 1);
  assert.equal([...stage.matchAll(/<NexoraStageCanvas/g)].length, 1);
  assert.doesNotMatch(mount, /<Canvas\b/);
});

test("H — Authority guard", () => {
  const handoff = readFileSync(join(here, "resolveNexoraLiveStageDthExpSpatial.ts"), "utf8");
  const mount = readFileSync(join(here, "NexoraStageMount.tsx"), "utf8");
  for (const source of [handoff, mount]) {
    assert.doesNotMatch(source, /directNexoraPresentation/);
    assert.doesNotMatch(source, /NEXO_ROADMAP|NEXO_OVERVIEW|NEXO_OBJECT/);
    assert.doesNotMatch(source, /useState\([^)]*spatial/i);
    assert.doesNotMatch(source, /createContext\(/);
  }
});
