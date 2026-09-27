/**
 * NPA-T STAGE-PRESENCE:FIX1 — ground presence, OVS:2/SP:2.6 preservation.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { resolveExecutiveOvsObjectStateVisual } from "./executiveOvsObjectStateVisual.ts";
import {
  EXECUTIVE_OBJECT_GROUND_PRESENCE,
  EXECUTIVE_OBJECT_PRESENCE_BOUNDARY,
  resolveExecutiveObjectVisualIdentity,
} from "./executiveObjectPresenceIdentity.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("A — territory no longer encodes Watch / Critical / Unresolved", () => {
  for (const executiveState of ["watch", "critical", "unresolved"] as const) {
    const related = resolveExecutiveObjectVisualIdentity({
      objectKind: "object",
      interactionState: "related",
      executiveState,
    });
    const overview = resolveExecutiveObjectVisualIdentity({
      objectKind: "object",
      interactionState: "overview",
      executiveState,
    });
    assert.equal(related.territoryStyle, "ground");
    assert.equal(overview.territoryStyle, "ground");
    assert.notEqual(related.territoryStyle, "attention");
    assert.notEqual(related.territoryStyle, "critical");
  }
});

test("B — Watch / Critical remain OVS:2 body + silhouette edge", () => {
  const watch = resolveExecutiveOvsObjectStateVisual({
    objectKind: "object",
    status: "watch",
  });
  const critical = resolveExecutiveOvsObjectStateVisual({
    objectKind: "object",
    status: "risk",
  });
  const unresolved = resolveExecutiveOvsObjectStateVisual({
    objectKind: "object",
    status: "unresolved",
  });
  assert.equal(watch.managementClass, "watch");
  assert.equal(watch.edgeStyle, "solid");
  assert.ok(watch.edgeOpacity >= 0.3);
  assert.equal(critical.managementClass, "critical");
  assert.ok(critical.edgeOpacity > watch.edgeOpacity);
  assert.equal(unresolved.managementClass, "unresolved");
  assert.equal(unresolved.edgeStyle, "uncertainty");
});

test("C — Focus / Selected do not change territory style", () => {
  const idle = resolveExecutiveObjectVisualIdentity({
    objectKind: "object",
    interactionState: "overview",
    executiveState: "watch",
  });
  const focused = resolveExecutiveObjectVisualIdentity({
    objectKind: "object",
    interactionState: "focused",
    executiveState: "watch",
  });
  const selected = resolveExecutiveObjectVisualIdentity({
    objectKind: "object",
    interactionState: "selected",
    executiveState: "watch",
  });
  assert.equal(idle.territoryStyle, "ground");
  assert.equal(focused.territoryStyle, "ground");
  assert.equal(selected.territoryStyle, "ground");
  assert.equal(focused.territoryOpacity, idle.territoryOpacity);
});

test("D — Ground presence is semantically neutral", () => {
  assert.equal(EXECUTIVE_OBJECT_GROUND_PRESENCE.color, "#64748b");
  assert.ok(EXECUTIVE_OBJECT_GROUND_PRESENCE.opacityPrimary < 0.12);
  const objectSrc = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(objectSrc, /visualLayerRole: "ground-presence"/);
  assert.match(objectSrc, /position=\{\[0, -geometryProfile\.height \* 0\.52, 0\.012\]\}/);
  assert.doesNotMatch(objectSrc, /rotation=\{\[Math\.PI \/ 2, 0, 0\]\}/);
  assert.doesNotMatch(
    objectSrc,
    /territoryStyle === "critical"[\s\S]*#f87171/,
  );
});

test("E — Focus pedestal is independent of territory", () => {
  const objectSrc = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(objectSrc, /emphasis\.showFocusPedestal \? \(/);
  assert.doesNotMatch(objectSrc, /territoryStyle === "focused"/);
  const focusSrc = readFileSync(
    join(here, "executiveObjectFocusAttentionPresentation.ts"),
    "utf8",
  );
  assert.match(focusSrc, /showFocusPedestal: focused/);
});

test("F — XY / semantic Z / Type-C topology not restored", () => {
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.changesSemanticZ, false);
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.usesZForTopology, false);
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.restoresTypeCXzTopology, false);
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.movesCamera, false);
});

test("G — Collection members still skip ground mesh", () => {
  const objectSrc = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(objectSrc, /!isCollectionMember/);
});

test("H — Ground presence is not a hit target", () => {
  const objectSrc = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(
    objectSrc,
    /visualLayerRole: "ground-presence"[\s\S]{0,80}raycast=\{\(\) => null\}|raycast=\{\(\) => null\}[\s\S]{0,220}visualLayerRole: "ground-presence"/,
  );
});

test("I — Context objects remain without ground presence", () => {
  const context = resolveExecutiveObjectVisualIdentity({
    objectKind: "context",
    interactionState: "background",
  });
  assert.equal(context.territoryStyle, "none");
  assert.equal(context.territoryOpacity, 0);
});

test("J — No new presence / rim / state authority", () => {
  const identity = readFileSync(
    join(here, "executiveObjectPresenceIdentity.ts"),
    "utf8",
  );
  assert.match(identity, /STAGE-OBJ:2\/ExecutiveBusinessObjectPresenceIdentity/);
  assert.doesNotMatch(identity, /new Grounding system|STAGE-PRESENCE-STORE/);
});
