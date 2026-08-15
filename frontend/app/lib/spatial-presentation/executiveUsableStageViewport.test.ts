/**
 * SP:4.3A — 2.5D Visual Authority Correction tests.
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
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING,
  createExecutivePresentationPosition,
  mapExecutivePresentationPositionToWorld,
  resolveExecutivePresentationEffectiveRenderedScale,
  resolveExecutivePresentationWorldOrigin,
} from "./executivePresentationPlaneFoundation.ts";
import {
  EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT,
  projectExecutiveUsableStageAnchorToNdc,
  resolveExecutiveUsableStageViewport,
  resolveExecutiveUsableStageWorldAnchor,
} from "./executiveUsableStageViewport.ts";
import {
  resolveExecutiveNetworkTopology,
  executiveNetworkTopologyVersion,
} from "./executiveNetworkTopology.ts";

const here = dirname(fileURLToPath(import.meta.url));

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
  return applyExecutivePresentationPlaneToStagePresentation(
    applyExecutiveNetworkTopologyToStagePresentation(
      applyExecutiveFocusVisualGrammarToStagePresentation(
        deriveNexoraMVPStageInteractionPresentation(state),
        { presentationDepth: "minimum" },
      ),
    ),
  );
}

test("1–2. usable Stage bounds and center are deterministic", () => {
  const a = resolveExecutiveUsableStageViewport();
  const b = resolveExecutiveUsableStageViewport();
  assert.deepEqual(a, b);
  assert.deepEqual(a, EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT);
  assert.ok(a.centerX > a.minX && a.centerX < a.maxX);
  assert.ok(a.centerY > a.minY && a.centerY < a.maxY);
});

test("3. presentation {0,0} maps to usable world anchor / projects near usable center", () => {
  const origin = resolveExecutivePresentationWorldOrigin();
  const world = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(0, 0),
    depthRole: "focus",
  });
  // Depth may shift Z only — XY equals usable anchor.
  const anchor = resolveExecutiveUsableStageWorldAnchor();
  assert.equal(world.x, anchor.x);
  assert.equal(world.y, anchor.y);
  assert.equal(origin.x, anchor.x);
  assert.equal(origin.y, anchor.y);

  const projected = projectExecutiveUsableStageAnchorToNdc();
  assert.equal(projected.withinTolerance, true);
  assert.ok(
    Math.hypot(
      projected.projectedNdcX - projected.usableCenterNdcX,
      projected.projectedNdcY - projected.usableCenterNdcY,
    ) <= projected.tolerance,
  );
});

test("4–7. Delivery/Budget/Inventory/Revenue focus own presentation {0,0}", () => {
  for (const id of [
    "obj-delivery",
    "obj-budget",
    "obj-inventory",
    "obj-revenue",
  ]) {
    const presentation = focusPipeline(id);
    const focus = presentation.scene.objects.find((entry) => entry.id === id);
    assert.ok(focus, id);
    assert.equal(focus!.presentationPosition?.x, 0, id);
    assert.equal(focus!.presentationPosition?.y, 0, id);
    const expected = mapExecutivePresentationPositionToWorld({
      position: createExecutivePresentationPosition(0, 0),
      depthRole: focus!.depthRole ?? "focus",
    });
    assert.equal(focus!.targetPosition[0], expected.x, id);
    assert.equal(focus!.targetPosition[1], expected.y, id);
    assert.equal(focus!.targetPosition[2], expected.z, id);
  }
});

test("8. Overview remains executive-network without forced anchor", () => {
  const state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const presentation = applyExecutivePresentationPlaneToStagePresentation(
    applyExecutiveNetworkTopologyToStagePresentation(
      applyExecutiveFocusVisualGrammarToStagePresentation(
        deriveNexoraMVPStageInteractionPresentation(state),
        { presentationDepth: "minimum" },
      ),
    ),
  );
  assert.equal(presentation.scene.mode, "overview");
  assert.equal(presentation.scene.topologyKind, "executive-network");
  assert.equal(presentation.scene.focusedObjectId, null);
});

test("9. depth role does not move presentation center XY", () => {
  const focus = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(0, 0),
    depthRole: "focus",
  });
  const background = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(0, 0),
    depthRole: "background",
  });
  assert.equal(focus.x, background.x);
  assert.equal(focus.y, background.y);
  assert.equal(focus.z, background.z);
  assert.equal(EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING.depthRole, "layout-inert");
  assert.equal(
    EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING.presentationY,
    "world.y",
  );
});

test("10–12. legacy XYZ / sectors / renderer cannot override 2.5D target", () => {
  const planeBridge = readFileSync(
    join(here, "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts"),
    "utf8",
  );
  assert.match(
    planeBridge,
    /presentationPosition != null/,
  );
  assert.match(
    planeBridge,
    /SP:4\.3 may already author presentationPosition/,
  );
  const network = readFileSync(
    join(here, "executiveNetworkTopology.ts"),
    "utf8",
  );
  assert.doesNotMatch(network, /allocateExecutiveFocusHubSectors/);
  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  const grammar = shell.lastIndexOf(
    "applyExecutiveFocusVisualGrammarToStagePresentation",
  );
  const networkIdx = shell.lastIndexOf(
    "applyExecutiveNetworkTopologyToStagePresentation",
  );
  const plane = shell.lastIndexOf(
    "applyExecutivePresentationPlaneToStagePresentation",
  );
  assert.ok(networkIdx > grammar && plane > networkIdx);
});

test("13. animation destination equals mapped target for Delivery", () => {
  const presentation = focusPipeline("obj-delivery");
  const delivery = presentation.scene.objects.find(
    (entry) => entry.id === "obj-delivery",
  )!;
  const mapped = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(0, 0),
    depthRole: delivery.depthRole ?? "focus",
  });
  assert.equal(delivery.targetPosition[0], mapped.x);
  assert.equal(delivery.targetPosition[1], mapped.y);
  assert.equal(delivery.targetPosition[2], mapped.z);
});

test("14–15. canonical relationships and SP:4.3 topology unchanged", () => {
  assert.equal(executiveNetworkTopologyVersion, "4.3.0");
  const edges = NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
    Object.freeze({
      id: edge.id,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
    }),
  );
  const a = resolveExecutiveNetworkTopology({
    nodes: [
      {
        objectId: "obj-delivery",
        compositionScale: 0.55,
        disclosureState: "visible-primary",
      },
      {
        objectId: "obj-capacity",
        compositionScale: 0.5,
        disclosureState: "visible-related",
      },
    ],
    edges,
    anchorObjectId: "obj-delivery",
  });
  const b = resolveExecutiveNetworkTopology({
    nodes: [
      {
        objectId: "obj-delivery",
        compositionScale: 0.55,
        disclosureState: "visible-primary",
      },
      {
        objectId: "obj-capacity",
        compositionScale: 0.5,
        disclosureState: "visible-related",
      },
    ],
    edges,
    anchorObjectId: "obj-delivery",
  });
  assert.deepEqual(a.positions, b.positions);
  assert.equal(a.positions["obj-delivery"]?.x, 0);
  assert.equal(a.positions["obj-delivery"]?.y, 0);
  assert.equal(
    edges.some(
      (edge) =>
        String(edge.sourceId) === "obj-delivery" &&
        String(edge.targetId) === "obj-budget",
    ),
    false,
  );
});

test("16–17. compositionScale truth + determinism", () => {
  const presentation = focusPipeline("obj-budget");
  for (const object of presentation.scene.objects.filter(
    (entry) => entry.disclosureState !== "hidden",
  )) {
    assert.equal(
      resolveExecutivePresentationEffectiveRenderedScale(object.scale, {
        focused: object.focused,
      }),
      object.scale,
    );
  }
  const again = focusPipeline("obj-budget");
  assert.deepEqual(
    presentation.scene.objects.map((entry) => entry.targetPosition),
    again.scene.objects.map((entry) => entry.targetPosition),
  );
});
