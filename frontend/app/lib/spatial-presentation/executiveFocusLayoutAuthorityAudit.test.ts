/**
 * Focus → layout authority audit tests (runtime position chain).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyExecutiveFocusVisualGrammarToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import {
  applyExecutiveNetworkTopologyToStagePresentation,
  getExecutiveNetworkTopologyFromPresentation,
} from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import {
  applyExecutivePresentationPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  createExecutive2DPosition,
  mapExecutive2DPositionToRenderWorld,
} from "./executivePresentationPlaneFoundation.ts";
import {
  captureExecutiveFocusLayoutAuthoritySnapshot,
} from "./executiveFocusLayoutAuthorityTrace.ts";

const here = dirname(fileURLToPath(import.meta.url));

const FIXTURES = [
  "obj-delivery",
  "obj-budget",
  "obj-inventory",
  "obj-revenue",
] as const;

function focusPipeline(objectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  const derived = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(
    derived,
    { presentationDepth: "minimum" },
  );
  const withNetwork =
    applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const finalPresentation =
    applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  return { state, withNetwork, finalPresentation };
}

test("1–4. click fixtures set focusedObjectId", () => {
  for (const id of FIXTURES) {
    const { state, finalPresentation } = focusPipeline(id);
    assert.equal(state.focusedSubject?.id, id);
    assert.equal(finalPresentation.scene.focusedObjectId, id);
  }
});

test("5–7. focused becomes anchor at {0,0} and survives Stage bridge", () => {
  for (const id of FIXTURES) {
    const { withNetwork, finalPresentation } = focusPipeline(id);
    const topology =
      getExecutiveNetworkTopologyFromPresentation(withNetwork) ??
      getExecutiveNetworkTopologyFromPresentation(finalPresentation);
    assert.ok(topology, id);
    assert.equal(topology!.anchorObjectId, id, id);
    assert.deepEqual(topology!.positions[id], { x: 0, y: 0 }, id);
    const focus = finalPresentation.scene.objects.find(
      (entry) => entry.id === id,
    );
    assert.ok(focus, id);
    assert.equal(focus!.presentationPosition?.x, 0, id);
    assert.equal(focus!.presentationPosition?.y, 0, id);
    assert.equal(focus!.disclosureState, "visible-primary", id);
  }
});

test("8–9. mapper output becomes targetPosition; no legacy XYZ overwrite after mapper", () => {
  const mapped = mapExecutive2DPositionToRenderWorld({
    position: createExecutive2DPosition(0, 0),
  });
  const expected = [mapped.x, mapped.y, mapped.z] as const;
  for (const id of FIXTURES) {
    const { finalPresentation } = focusPipeline(id);
    const focus = finalPresentation.scene.objects.find(
      (entry) => entry.id === id,
    )!;
    assert.deepEqual(focus.targetPosition, expected, id);
    assert.deepEqual(focus.overviewPosition, expected, id);
  }
});

test("10–12. no interaction/DR/safe-area post-shift of focus target after plane", () => {
  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  const grammar = shell.lastIndexOf(
    "applyExecutiveFocusVisualGrammarToStagePresentation",
  );
  const network = shell.lastIndexOf(
    "applyExecutiveNetworkTopologyToStagePresentation",
  );
  const plane = shell.lastIndexOf(
    "applyExecutivePresentationPlaneToStagePresentation",
  );
  const topologyPlane = shell.lastIndexOf(
    "applyExecutiveStage2DTopologyPlaneToStagePresentation",
  );
  const recomposition = shell.lastIndexOf(
    "applyExecutiveStage2DTopologyRecompositionToStagePresentation",
  );
  assert.ok(network > grammar && plane > network);
  assert.ok(topologyPlane > plane && recomposition > topologyPlane);
  // STAGE-2D live path continues past presentation plane with True-2D
  // flatten + click-to-center readability. Camera/navigation must not
  // rewrite the focus target after recomposition.
  assert.match(
    shell,
    /applyExecutiveStage2DTopologyRecompositionToStagePresentation/,
  );
  assert.doesNotMatch(
    shell,
    /NexoraExecutiveCameraNavigationControls/,
  );
});

test("13–14. animation destination equals targetPosition; renderer does not bind overviewPosition", () => {
  const stageObject = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(stageObject, /presentation\.targetPosition/);
  assert.match(stageObject, /const \[tx, ty, tz\] = presentation\.targetPosition/);
  assert.doesNotMatch(
    stageObject,
    /position=\{\[\s*presentation\.overviewPosition/,
  );
  assert.match(stageObject, /Never bind overviewPosition/);
});

test("15. identical click state → identical final position", () => {
  for (const id of FIXTURES) {
    const a = focusPipeline(id).finalPresentation;
    const b = focusPipeline(id).finalPresentation;
    const fa = a.scene.objects.find((entry) => entry.id === id)!;
    const fb = b.scene.objects.find((entry) => entry.id === id)!;
    assert.deepEqual(fa.targetPosition, fb.targetPosition, id);
    assert.deepEqual(fa.presentationPosition, fb.presentationPosition, id);
  }
});

test("dev trace captures one settled focus snapshot shape", () => {
  const { state, withNetwork, finalPresentation } = focusPipeline(
    "obj-delivery",
  );
  const topology = getExecutiveNetworkTopologyFromPresentation(withNetwork)!;
  const focus = finalPresentation.scene.objects.find(
    (entry) => entry.id === "obj-delivery",
  )!;
  const mapped = mapExecutive2DPositionToRenderWorld({
    position: createExecutive2DPosition(0, 0),
  });
  const snapshot = captureExecutiveFocusLayoutAuthoritySnapshot({
    objectId: "obj-delivery",
    selectedObjectId: state.selectedSubject?.id ?? null,
    focusedObjectId: finalPresentation.scene.focusedObjectId,
    anchorObjectId: topology.anchorObjectId,
    disclosureState: focus.disclosureState ?? null,
    topologyPosition: topology.positions["obj-delivery"] ?? null,
    presentationPosition: focus.presentationPosition ?? null,
    mappedWorldPosition: [mapped.x, mapped.y, mapped.z],
    stageTargetPosition: focus.targetPosition,
    overviewPosition: focus.overviewPosition,
    overviewMatchesTarget:
      JSON.stringify(focus.overviewPosition) ===
      JSON.stringify(focus.targetPosition),
  });
  assert.equal(snapshot.focusedObjectId, "obj-delivery");
  assert.equal(snapshot.anchorObjectId, "obj-delivery");
  assert.deepEqual(snapshot.topologyPosition, { x: 0, y: 0 });
  assert.equal(snapshot.overviewMatchesTarget, true);
});
