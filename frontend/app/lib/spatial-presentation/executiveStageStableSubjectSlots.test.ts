/**
 * NPA-T STAGE-STABLE-SUBJECT-SLOTS:1
 * Visible same-kind subjects receive distinct final coordinates.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { projectNexoraDecisionTheatreFoundation } from "../decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPStageInteractionPresentation,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
  type NexoraMVPContextSubjectKind,
} from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import { projectStageProdDirectorComposition } from "../stage-prod/stageProdDirectorComposition.ts";
import { resolveExecutiveThreadSectorPosition } from "./executiveThreadExpansion.ts";

const production = getDefaultNexoraMVPObjectInteractionCatalog();

function slotCatalog(
  kind: NexoraMVPContextSubjectKind,
  ids: readonly string[],
): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    ...production,
    contextSubjects: Object.freeze(
      ids.map((id) =>
        Object.freeze({
          id,
          label: id,
          kind,
          status: "watch" as const,
          attention: "normal" as const,
        }),
      ),
    ),
    contextLinks: Object.freeze(
      ids.map((id) =>
        Object.freeze({
          id: `link-${id}`,
          objectId: "obj-capacity",
          contextId: id,
          relation: "constrained-by",
        }),
      ),
    ),
  });
}

function derivedState(
  catalog: NexoraMVPObjectInteractionCatalog,
  subjectId: string,
  expand = true,
) {
  let state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "operation",
      environmentIntent: "neutral",
    }),
    subjectId,
    catalog,
  );
  if (expand) {
    state = Object.freeze({ ...state, expandExecutiveThread: true });
  }
  const derived = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  return { state, derived };
}

/** Readability is the owner that used to copy one sector onto every same-kind id. */
function readabilityPresentation(
  catalog: NexoraMVPObjectInteractionCatalog,
  subjectId: string,
  expand = true,
) {
  const { state, derived } = derivedState(catalog, subjectId, expand);
  const flat = applyExecutiveStage2DTopologyPlaneToStagePresentation(derived);
  const placed = applyExecutiveStage2DTopologyRecompositionToStagePresentation(flat);
  return { state, derived, placed };
}

/** Canvas order: Theatre, then the sealed readability writer. */
function canvasPresentation(
  catalog: NexoraMVPObjectInteractionCatalog,
  subjectId: string,
  expand = true,
) {
  const { state, derived } = derivedState(catalog, subjectId, expand);
  const flat = applyExecutiveStage2DTopologyPlaneToStagePresentation(derived);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
  });
  const composition = projectStageProdDirectorComposition({
    presentation: flat,
    theatre,
  });
  const placed = applyExecutiveStage2DTopologyRecompositionToStagePresentation(
    composition.presentation,
    composition.status === "applied" ? { sealExternalPlacement: true } : undefined,
  );
  return { state, derived, placed, composition };
}

function positionOf(
  presentation: NexoraMVPStageInteractionPresentation,
  id: string,
) {
  return (
    presentation.scene.objects.find((object) => object.id === id)?.targetPosition ??
    presentation.contextNodes.find((node) => node.id === id)?.targetPosition ??
    null
  );
}

function assertDistinct(presentation: NexoraMVPStageInteractionPresentation, ids: readonly string[]) {
  const points = ids.map((id) => {
    const point = positionOf(presentation, id);
    assert.ok(point, id);
    assert.equal(point[2], 0, id);
    assert.ok(Math.abs(point[0]) < 6 && Math.abs(point[1]) < 6, id);
    return point;
  });
  for (let left = 0; left < points.length; left += 1) {
    for (let right = left + 1; right < points.length; right += 1) {
      assert.notDeepEqual(points[left], points[right], `${ids[left]} ${ids[right]}`);
    }
  }
}

test("production context catalog is unchanged", () => {
  assert.equal(NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.length, 9);
  assert.equal(production.contextSubjects.length, 9);
});

test("two and three problems receive distinct final positions", () => {
  for (const present of [readabilityPresentation, canvasPresentation]) {
    const two = present(
      slotCatalog("problem", ["ctx-problem-a", "ctx-problem-b"]),
      "obj-capacity",
    );
    assert.deepEqual(positionOf(two.placed, "obj-capacity"), [0, 0, 0]);
    assertDistinct(two.placed, ["ctx-problem-a", "ctx-problem-b"]);

    const three = present(
      slotCatalog("problem", ["ctx-problem-a", "ctx-problem-b", "ctx-problem-c"]),
      "obj-capacity",
    );
    assert.deepEqual(positionOf(three.placed, "obj-capacity"), [0, 0, 0]);
    assertDistinct(three.placed, ["ctx-problem-a", "ctx-problem-b", "ctx-problem-c"]);
  }
});

test("scenarios, decisions, and execution subjects receive distinct positions", () => {
  for (const kind of ["scenario", "decision", "execution"] as const) {
    const ids = [`ctx-${kind}-a`, `ctx-${kind}-b`];
    for (const present of [readabilityPresentation, canvasPresentation]) {
      const placed = present(slotCatalog(kind, ids), "obj-capacity").placed;
      assert.deepEqual(positionOf(placed, "obj-capacity"), [0, 0, 0]);
      assertDistinct(placed, ids);
    }
  }
});

test("reordered inputs keep the same coordinates", () => {
  const forward = slotCatalog("problem", ["ctx-problem-b", "ctx-problem-a"]);
  const reverse = slotCatalog("problem", ["ctx-problem-a", "ctx-problem-b"]);
  for (const present of [readabilityPresentation, canvasPresentation]) {
    const left = present(forward, "obj-capacity").placed;
    const right = present(reverse, "obj-capacity").placed;
    assert.deepEqual(positionOf(left, "ctx-problem-a"), positionOf(right, "ctx-problem-a"));
    assert.deepEqual(positionOf(left, "ctx-problem-b"), positionOf(right, "ctx-problem-b"));
  }
});

test("one visible problem keeps the problem sector origin before relaxation", () => {
  const origin = resolveExecutiveThreadSectorPosition("problem");
  assert.deepEqual(origin, { x: 0.72, y: 1.68, z: 0 });
  assert.deepEqual(
    resolveExecutiveThreadSectorPosition("problem", 0, 1),
    origin,
  );
  const placed = readabilityPresentation(
    slotCatalog("problem", ["ctx-problem-only"]),
    "obj-capacity",
  ).placed;
  const again = readabilityPresentation(
    slotCatalog("problem", ["ctx-problem-only"]),
    "obj-capacity",
  ).placed;
  assert.deepEqual(positionOf(placed, "ctx-problem-only"), positionOf(again, "ctx-problem-only"));
  assert.deepEqual(positionOf(placed, "obj-capacity"), [0, 0, 0]);
});

test("a hidden peer does not consume a visible slot", () => {
  const visibleOnly = readabilityPresentation(
    slotCatalog("problem", ["ctx-problem-a"]),
    "obj-capacity",
  ).placed;
  const hiddenCatalog = Object.freeze({
    ...slotCatalog("problem", ["ctx-problem-a"]),
    contextSubjects: Object.freeze([
      ...slotCatalog("problem", ["ctx-problem-a"]).contextSubjects,
      Object.freeze({
        id: "ctx-problem-hidden",
        label: "Hidden",
        kind: "problem" as const,
        status: "watch" as const,
        attention: "normal" as const,
      }),
    ]),
  });
  const withHidden = readabilityPresentation(hiddenCatalog, "obj-capacity").placed;
  assert.equal(positionOf(withHidden, "ctx-problem-hidden"), null);
  assert.deepEqual(
    positionOf(visibleOnly, "ctx-problem-a"),
    positionOf(withHidden, "ctx-problem-a"),
  );
});

test("adding a problem does not move a scenario", () => {
  const scenarioOnly = slotCatalog("scenario", ["ctx-scenario-a"]);
  const mixed = Object.freeze({
    ...scenarioOnly,
    contextSubjects: Object.freeze([
      ...scenarioOnly.contextSubjects,
      Object.freeze({
        id: "ctx-problem-added",
        label: "Added",
        kind: "problem" as const,
        status: "watch" as const,
        attention: "normal" as const,
      }),
    ]),
    contextLinks: Object.freeze([
      ...scenarioOnly.contextLinks,
      Object.freeze({
        id: "link-added",
        objectId: "obj-capacity",
        contextId: "ctx-problem-added",
        relation: "constrained-by",
      }),
    ]),
  });
  const before = readabilityPresentation(scenarioOnly, "obj-capacity").placed;
  const after = readabilityPresentation(mixed, "obj-capacity").placed;
  assert.deepEqual(positionOf(before, "ctx-scenario-a"), positionOf(after, "ctx-scenario-a"));
  assert.notDeepEqual(positionOf(after, "ctx-problem-added"), positionOf(after, "ctx-scenario-a"));
});

test("focused work subjects stay centered and peers stay distinct", () => {
  const catalog = slotCatalog("problem", ["ctx-problem-a", "ctx-problem-b", "ctx-problem-c"]);
  const focused = readabilityPresentation(catalog, "ctx-problem-b", false);
  assert.deepEqual(positionOf(focused.placed, "ctx-problem-b"), [0, 0, 0]);
  const peers = ["ctx-problem-a", "ctx-problem-c"].filter(
    (id) => positionOf(focused.placed, id) != null,
  );
  if (peers.length > 0) assertDistinct(focused.placed, ["ctx-problem-b", ...peers]);
  const advisor = buildNexoraMVPAdvisorContextBridge(focused.state, focused.derived);
  assert.equal(advisor.advisorSubjectId, "ctx-problem-b");
});

test("back and overview keep the existing focus contract", () => {
  const catalog = slotCatalog("scenario", ["ctx-scenario-a"]);
  let state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "operation",
      environmentIntent: "neutral",
    }),
    "obj-capacity",
    catalog,
  );
  state = selectNexoraMVPInteractionSubject(state, "ctx-scenario-a", catalog);
  const back = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(back.focusedSubject?.id, "obj-capacity");
  const overview = resetNexoraMVPObjectInteractionOverview(back);
  assert.equal(overview.mode, "overview");
  assert.equal(overview.focusedSubject, null);
});

test("labels run after placement and world slots separate at desktop and narrow heights", () => {
  const placed = readabilityPresentation(
    slotCatalog("problem", ["ctx-problem-a", "ctx-problem-b"]),
    "obj-capacity",
  ).placed;
  const labeled = applyExecutiveStageObjectLabelTerritoryToStagePresentation(
    applyExecutiveStageFixedCameraToStagePresentation(placed),
    { presentationLevel: "operation" },
  );
  assert.deepEqual(positionOf(labeled, "ctx-problem-a"), positionOf(placed, "ctx-problem-a"));
  assert.deepEqual(positionOf(labeled, "obj-capacity"), [0, 0, 0]);
  const layout = (
    labeled.scene as { readonly stageLabelLayout?: { readonly labelLabelOverlapCount: number } }
  ).stageLabelLayout;
  assert.equal(layout?.labelLabelOverlapCount, 0);
  const left = positionOf(placed, "ctx-problem-a")!;
  const right = positionOf(placed, "ctx-problem-b")!;
  const worldGap = Math.hypot(left[0] - right[0], left[1] - right[1]);
  const pxAt = (height: number) => worldGap * (82.5 * (height / 697));
  assert.ok(pxAt(697) > 24);
  assert.ok(pxAt(565) > 24);
});
