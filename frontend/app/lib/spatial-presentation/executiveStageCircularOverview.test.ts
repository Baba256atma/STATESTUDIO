/**
 * NPA-T STAGE-CIRCULAR-OVERVIEW:1
 * Circular Overview activates only for an authorized Company or Goal.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES } from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { resolveNexoraMVPStageScenePresentation } from "../nex-mvp/nexora3DExecutiveStage.ts";
import { isLegacyWorkflowWorkspaceIdentifier } from "../workspace/workspaceRegistryContract.ts";
import {
  resolveExecutiveOverviewAnchor,
  resolveExecutiveTopologyGuidedStageComposition,
  type ExecutiveTopologyStageObjectInput,
} from "./executiveTopologyGuidedStageComposition.ts";
import {
  projectTestOwnedStageCatalog,
  STAGE_TEST_WORKSPACE_ALPHA,
} from "./executiveStageTestOwnedSubjectProjection.ts";

const workspaceA = "ws-alpha";
const workspaceB = "ws-beta";

function body(
  objectId: string,
  objectKind: string,
  workspaceId: string,
  extras: Partial<ExecutiveTopologyStageObjectInput> = {},
): ExecutiveTopologyStageObjectInput {
  return Object.freeze({
    objectId,
    label: objectId,
    objectKind,
    managerWorkspaceId: workspaceId,
    presentationAuthorized: true,
    disclosed: true,
    ...extras,
  });
}

function compose(
  objects: readonly ExecutiveTopologyStageObjectInput[],
  relationships: readonly { id: string; sourceId: string; targetId: string }[],
  workspaceId: string | null,
) {
  return resolveExecutiveTopologyGuidedStageComposition({
    objects,
    relationships: relationships.map((relationship) => Object.freeze(relationship)),
    focusedObjectId: null,
    topologyType: "auto",
    activeManagerWorkspaceId: workspaceId,
  });
}

function tuple(
  result: ReturnType<typeof compose>,
  objectId: string,
) {
  return result.byId.get(objectId)?.tuple ?? null;
}

test("one authorized company centers a ring and ignores unrelated subjects", () => {
  const objects = [
    body("company-a", "company", workspaceA),
    body("obj-capacity", "object", workspaceA),
    body("obj-budget", "object", workspaceA),
    body("obj-stranger", "object", workspaceA),
    body("obj-other-ws", "object", workspaceB),
  ];
  const relationships = [
    { id: "r1", sourceId: "company-a", targetId: "obj-capacity" },
    { id: "r2", sourceId: "company-a", targetId: "obj-budget" },
    { id: "r3", sourceId: "obj-stranger", targetId: "obj-budget" },
  ];
  const forward = compose(objects, relationships, workspaceA);
  const reverse = compose([...objects].reverse(), relationships, workspaceA);
  assert.equal(forward.topology, "hub");
  assert.equal(forward.selectionReason, "overview-anchor→hub");
  assert.equal(forward.focusedObjectId, null);
  assert.equal(forward.overviewAnchorId, "company-a");
  assert.deepEqual(tuple(forward, "company-a"), [0, 0, 0]);
  assert.deepEqual(tuple(forward, "obj-capacity"), tuple(reverse, "obj-capacity"));
  assert.deepEqual(tuple(forward, "obj-budget"), tuple(reverse, "obj-budget"));
  assert.notDeepEqual(tuple(forward, "obj-capacity"), tuple(forward, "obj-budget"));
  assert.equal(tuple(forward, "obj-stranger"), null);
  assert.equal(tuple(forward, "obj-other-ws"), null);
});

test("one goal is the center when no company exists", () => {
  const result = compose(
    [
      body("goal-capacity", "goal", workspaceA),
      body("obj-capacity", "object", workspaceA),
    ],
    [{ id: "r1", sourceId: "goal-capacity", targetId: "obj-capacity" }],
    workspaceA,
  );
  assert.equal(result.overviewAnchorId, "goal-capacity");
  assert.equal(result.topology, "hub");
  assert.deepEqual(tuple(result, "goal-capacity"), [0, 0, 0]);
  assert.ok(tuple(result, "obj-capacity"));
  assert.notDeepEqual(tuple(result, "obj-capacity"), [0, 0, 0]);
});

test("missing, ambiguous, and unauthorized centers preserve flow", () => {
  const flow = compose(
    [body("obj-capacity", "object", workspaceA)],
    [],
    workspaceA,
  );
  assert.equal(flow.topology, "flow");
  assert.equal(flow.overviewAnchorId, null);
  assert.equal(flow.selectionReason, "overview→flow");

  const goals = compose(
    [
      body("goal-a", "goal", workspaceA),
      body("goal-b", "goal", workspaceA),
    ],
    [],
    workspaceA,
  );
  assert.equal(goals.overviewAnchorId, null);
  assert.equal(goals.topology, "flow");

  const companies = compose(
    [
      body("company-a", "company", workspaceA),
      body("company-b", "company", workspaceA),
      body("goal-only", "goal", workspaceA),
    ],
    [],
    workspaceA,
  );
  assert.equal(companies.overviewAnchorId, null);

  const denied = compose(
    [body("company-a", "company", workspaceA, { presentationAuthorized: false })],
    [],
    workspaceA,
  );
  assert.equal(denied.overviewAnchorId, null);

  assert.equal(
    resolveExecutiveOverviewAnchor({
      objects: [body("company-a", "company", workspaceA)],
      activeManagerWorkspaceId: "overview",
    }),
    null,
  );
  assert.equal(isLegacyWorkflowWorkspaceIdentifier("overview"), true);
});

test("workspace switching cannot reuse another workspace anchor", () => {
  const objects = [
    body("company-a", "company", workspaceA),
    body("company-b", "company", workspaceB),
    body("obj-capacity", "object", workspaceA),
    body("obj-risk", "object", workspaceB),
  ];
  const relationships = [
    { id: "ra", sourceId: "company-a", targetId: "obj-capacity" },
    { id: "rb", sourceId: "company-b", targetId: "obj-risk" },
  ];
  const alpha = compose(objects, relationships, workspaceA);
  const beta = compose(objects, relationships, workspaceB);
  assert.equal(alpha.overviewAnchorId, "company-a");
  assert.equal(tuple(alpha, "obj-risk"), null);
  assert.equal(beta.overviewAnchorId, "company-b");
  assert.equal(tuple(beta, "obj-capacity"), null);
});

test("goal scene keeps overview unfocused and readability recenters the anchor", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: [
      {
        id: "goal-capacity",
        label: "Close Capacity Gap",
        kind: "object",
        objectKind: "goal",
        managerWorkspaceId: workspaceA,
        presentationAuthorized: true,
        position: [4, 3, 1] as const,
        status: "stable",
        attention: "normal",
      },
      {
        id: "obj-capacity",
        label: "Capacity",
        kind: "object",
        objectKind: "object",
        managerWorkspaceId: workspaceA,
        presentationAuthorized: true,
        position: [8, 1, 1] as const,
        status: "watch",
        attention: "important",
      },
    ],
    relationships: [
      { id: "r1", sourceId: "goal-capacity", targetId: "obj-capacity" },
    ],
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "minimum",
    environmentIntent: "neutral",
    activeManagerWorkspaceId: workspaceA,
  });
  assert.equal(scene.focusedObjectId, null);
  assert.equal(scene.overviewAnchorId, "goal-capacity");
  const base = deriveNexoraMVPStageInteractionPresentation(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    getDefaultNexoraMVPObjectInteractionCatalog(),
    { consultExecutiveChangeSessionStore: false },
  );
  const presentation = Object.freeze({
    ...base,
    mode: "overview" as const,
    focusedSubjectId: null,
    scene,
  });
  const placed = applyExecutiveStage2DTopologyRecompositionToStagePresentation(
    presentation,
    { overviewAnchorId: scene.overviewAnchorId },
  );
  const goal = placed.scene.objects.find((object) => object.id === "goal-capacity");
  const capacity = placed.scene.objects.find((object) => object.id === "obj-capacity");
  assert.deepEqual(goal?.targetPosition, [0, 0, 0]);
  assert.ok(capacity);
  assert.notDeepEqual(capacity?.targetPosition, goal?.targetPosition);
  assert.equal(placed.focusedSubjectId, null);
  assert.equal(placed.scene.focusedObjectId, null);
  assert.equal(goal?.focused, false);
  const advisor = buildNexoraMVPAdvisorContextBridge(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    base,
  );
  assert.equal(advisor.advisorSubjectId, null);
});

test("capacity focus replaces overview and overview clears it again", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.equal(state.focusedSubject, null);
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  const focused = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const advisor = buildNexoraMVPAdvisorContextBridge(state, focused);
  assert.equal(advisor.advisorSubjectId, "obj-capacity");
  const back = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(back.mode, "overview");
  assert.equal(back.focusedSubject, null);
});

test("a center with no related subjects stays a single point", () => {
  const result = compose([body("goal-only", "goal", workspaceA)], [], workspaceA);
  assert.equal(result.overviewAnchorId, "goal-only");
  assert.deepEqual(tuple(result, "goal-only"), [0, 0, 0]);
  assert.equal(result.positions.length, 1);
});

test("the production catalog has no company or goal and stays on flow", () => {
  assert.equal(NEXORA_MVP_STAGE_OBJECT_FIXTURES.length, 8);
  assert.equal(NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.length, 9);
  const records = NEXORA_MVP_STAGE_OBJECT_FIXTURES as readonly {
    readonly id: string;
    readonly label: string;
    readonly kind: string;
    readonly objectKind?: string;
    readonly managerWorkspaceId?: string;
  }[];
  assert.equal(
    records.some(
      (object) => object.objectKind === "goal" || object.managerWorkspaceId != null,
    ),
    false,
  );
  const result = compose(
    records.map((object) =>
      Object.freeze({
        objectId: object.id,
        label: object.label,
        objectKind: object.objectKind ?? object.kind,
      }),
    ),
    [],
    workspaceA,
  );
  assert.equal(result.topology, "flow");
  assert.equal(result.overviewAnchorId, null);
  assert.equal(result.focusedObjectId, null);
});

test("production grammar, network, and plane keep the authorized ring", () => {
  const state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  let presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    projectTestOwnedStageCatalog("workspace-a"),
    {
      consultExecutiveChangeSessionStore: false,
      activeManagerWorkspaceId: STAGE_TEST_WORKSPACE_ALPHA,
    },
  );
  presentation = applyExecutiveFocusVisualGrammarToStagePresentation(presentation, {
    presentationDepth: "minimum",
  });
  presentation = applyExecutiveNetworkTopologyToStagePresentation(presentation);
  presentation = applyExecutivePresentationPlaneToStagePresentation(presentation);
  presentation = applyExecutiveStage2DTopologyPlaneToStagePresentation(presentation);
  presentation = applyExecutiveStage2DTopologyRecompositionToStagePresentation(presentation, {
    overviewAnchorId: presentation.scene.overviewAnchorId,
  });
  const at = (id: string) =>
    presentation.scene.objects.find((object) => object.id === id)?.targetPosition;
  assert.deepEqual(at("company-alpha"), [0, 0, 0]);
  assert.deepEqual(at("test-capacity-alpha"), [0, 1.72, 0]);
  assert.deepEqual(at("test-budget-alpha"), [1.72, 0, 0]);
  assert.deepEqual(at("test-inventory-alpha"), [-1.72, 0, 0]);
  assert.deepEqual(at("test-risk-alpha"), [0, -1.72, 0]);

  const flow = deriveNexoraMVPStageInteractionPresentation(
    state,
    getDefaultNexoraMVPObjectInteractionCatalog(),
    { consultExecutiveChangeSessionStore: false },
  );
  const rewritten = applyExecutiveNetworkTopologyToStagePresentation(
    applyExecutiveFocusVisualGrammarToStagePresentation(flow, {
      presentationDepth: "minimum",
    }),
  );
  assert.equal(rewritten.scene.overviewAnchorId, null);
  assert.equal(rewritten.scene.topologyKind, "executive-network");
});
