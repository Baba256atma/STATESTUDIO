/**
 * NPA-T STAGE-WORKSPACE-CONTEXT-WIRING:1
 * The registry workspace id reaches Stage composition. Unowned subjects stay on Flow.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import type { NexoraMVPStageObjectFixture } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  acceptStageManagerWorkspaceId,
  createManagerWorkspace,
  resolveActiveManagerWorkspace,
  resolveStageActiveManagerWorkspaceId,
} from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";

const shellSource = readFileSync(
  new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
  "utf8",
);

function overviewState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function stageBody(
  id: string,
  objectKind: string,
  managerWorkspaceId: string,
): NexoraMVPStageObjectFixture {
  return Object.freeze({
    id,
    label: id,
    kind: "object" as const,
    objectKind,
    managerWorkspaceId,
    presentationAuthorized: true as const,
    position: [3, 1, 2] as const,
    status: "stable" as const,
    attention: "normal" as const,
  }) as unknown as NexoraMVPStageObjectFixture;
}

function ownedCatalog(
  workspaceId: string,
  foreignWorkspaceId: string,
): NexoraMVPObjectInteractionCatalog {
  return {
    objects: [
      stageBody("company-a", "company", workspaceId),
      stageBody("obj-capacity", "object", workspaceId),
      stageBody("company-b", "company", foreignWorkspaceId),
      stageBody("obj-risk", "object", foreignWorkspaceId),
    ],
    relationships: [
      { id: "owned", sourceId: "company-a", targetId: "obj-capacity" },
      { id: "foreign", sourceId: "company-b", targetId: "obj-risk" },
    ],
    contextSubjects: [],
    contextLinks: [],
  };
}

function deriveOverview(
  catalog: NexoraMVPObjectInteractionCatalog,
  activeManagerWorkspaceId: string | null,
) {
  return deriveNexoraMVPStageInteractionPresentation(overviewState(), catalog, {
    consultExecutiveChangeSessionStore: false,
    activeManagerWorkspaceId,
  });
}

test("the Executive Shell reads the registry id into Stage composition", () => {
  assert.match(shellSource, /resolveStageActiveManagerWorkspaceId/);
  assert.match(
    shellSource,
    /const stageManagerWorkspaceId = useSyncExternalStore\(\s*subscribeWorkspaceRegistry,\s*resolveStageActiveManagerWorkspaceId,\s*\(\) => null,/,
  );
  assert.match(
    shellSource,
    /activeManagerWorkspaceId: stageManagerWorkspaceId/,
  );
});

test("BUSINESS and PROJECT registry ids reach Stage composition", () => {
  resetWorkspaceRegistryForTests();
  try {
    const business = createManagerWorkspace({ name: "Stage Business", kind: "BUSINESS" });
    assert.ok(business);
    setActiveWorkspace(business.workspaceId);
    assert.equal(resolveStageActiveManagerWorkspaceId(), business.workspaceId);
    assert.equal(resolveActiveManagerWorkspace().managerWorkspace?.kind, "BUSINESS");
    const businessPresentation = deriveOverview(
      ownedCatalog(business.workspaceId, "ws-foreign"),
      resolveStageActiveManagerWorkspaceId(),
    );
    assert.equal(businessPresentation.scene.overviewAnchorId, "company-a");
    assert.equal(businessPresentation.focusedSubjectId, null);
    assert.equal(businessPresentation.scene.focusedObjectId, null);

    const project = createManagerWorkspace({ name: "Stage Project", kind: "PROJECT" });
    assert.ok(project);
    setActiveWorkspace(project.workspaceId);
    assert.equal(resolveStageActiveManagerWorkspaceId(), project.workspaceId);
    assert.equal(resolveActiveManagerWorkspace().managerWorkspace?.kind, "PROJECT");
    const projectPresentation = deriveOverview(
      ownedCatalog(project.workspaceId, business.workspaceId),
      resolveStageActiveManagerWorkspaceId(),
    );
    assert.equal(projectPresentation.scene.overviewAnchorId, "company-a");
    assert.notEqual(projectPresentation.scene.overviewAnchorId, "company-b");
    const foreign = projectPresentation.scene.objects.find((object) => object.id === "company-b");
    assert.notEqual(foreign?.id, projectPresentation.scene.overviewAnchorId);
  } finally {
    resetWorkspaceRegistryForTests();
  }
});

test("workspace switching drops the previous Overview anchor", () => {
  resetWorkspaceRegistryForTests();
  try {
    const alpha = createManagerWorkspace({ name: "Alpha Stage", kind: "BUSINESS" });
    const beta = createManagerWorkspace({ name: "Beta Stage", kind: "PROJECT" });
    assert.ok(alpha && beta);
    const catalog = ownedCatalog(alpha.workspaceId, beta.workspaceId);
    setActiveWorkspace(alpha.workspaceId);
    const first = deriveOverview(catalog, resolveStageActiveManagerWorkspaceId());
    assert.equal(first.scene.overviewAnchorId, "company-a");
    setActiveWorkspace(beta.workspaceId);
    const second = deriveOverview(catalog, resolveStageActiveManagerWorkspaceId());
    assert.equal(second.scene.overviewAnchorId, "company-b");
    assert.notEqual(second.scene.overviewAnchorId, first.scene.overviewAnchorId);
    const placed = applyExecutiveStage2DTopologyRecompositionToStagePresentation(second, {
      overviewAnchorId: second.scene.overviewAnchorId,
    });
    const center = placed.scene.objects.find((object) => object.id === "company-b");
    const previous = placed.scene.objects.find((object) => object.id === "company-a");
    assert.deepEqual(center?.targetPosition, [0, 0, 0]);
    assert.notDeepEqual(previous?.targetPosition, [0, 0, 0]);
    assert.equal(placed.focusedSubjectId, null);
  } finally {
    resetWorkspaceRegistryForTests();
  }
});

test("null, workflow modes, and the legacy fallback stay closed", () => {
  assert.equal(acceptStageManagerWorkspaceId(null), null);
  assert.equal(acceptStageManagerWorkspaceId("overview"), null);
  assert.equal(acceptStageManagerWorkspaceId("problem"), null);
  assert.equal(acceptStageManagerWorkspaceId("scenario"), null);
  assert.equal(acceptStageManagerWorkspaceId("decision"), null);
  assert.equal(acceptStageManagerWorkspaceId("execution"), null);
  assert.equal(acceptStageManagerWorkspaceId("default_workspace"), null);
  const catalog = ownedCatalog("overview", "ws-other");
  const closed = deriveOverview(catalog, "overview");
  assert.equal(closed.scene.overviewAnchorId, null);
  const absent = deriveOverview(catalog, null);
  assert.equal(absent.scene.overviewAnchorId, null);
});

test("the demo registry record is not promoted to a manager workspace", () => {
  resetWorkspaceRegistryForTests();
  try {
    assert.equal(resolveStageActiveManagerWorkspaceId(), DEMO_WORKSPACE_ID);
    const active = resolveActiveManagerWorkspace();
    assert.equal(active.classification, "demo_test");
    assert.equal(active.managerWorkspace, null);
    const presentation = deriveOverview(
      getDefaultNexoraMVPObjectInteractionCatalog(),
      resolveStageActiveManagerWorkspaceId(),
    );
    assert.equal(presentation.scene.overviewAnchorId, null);
  } finally {
    resetWorkspaceRegistryForTests();
  }
});

test("an authorized Goal centers through Stage derivation when no Company exists", () => {
  const catalog: NexoraMVPObjectInteractionCatalog = {
    objects: [
      stageBody("goal-capacity", "goal", "ws-goal"),
      stageBody("obj-capacity", "object", "ws-goal"),
      stageBody("obj-risk", "object", "ws-other"),
    ],
    relationships: [
      { id: "goal-link", sourceId: "goal-capacity", targetId: "obj-capacity" },
    ],
    contextSubjects: [],
    contextLinks: [],
  };
  const presentation = deriveOverview(catalog, "ws-goal");
  assert.equal(presentation.scene.overviewAnchorId, "goal-capacity");
  assert.equal(presentation.scene.focusedObjectId, null);
  const advisor = buildNexoraMVPAdvisorContextBridge(overviewState(), presentation);
  assert.equal(advisor.advisorSubjectId, null);
});

test("legacy fixtures keep unresolved ownership and Flow", () => {
  const ownership = (object: NexoraMVPStageObjectFixture) =>
    (object as NexoraMVPStageObjectFixture & { managerWorkspaceId?: string }).managerWorkspaceId;
  const before = NEXORA_MVP_STAGE_OBJECT_FIXTURES.map(ownership);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const presentation = deriveOverview(catalog, "ws-business-live");
  assert.equal(presentation.scene.overviewAnchorId, null);
  assert.deepEqual(NEXORA_MVP_STAGE_OBJECT_FIXTURES.map(ownership), before);
  assert.equal(catalog.objects.some((object) => ownership(object) != null), false);
});

test("focus and Advisor stay independent of the Overview anchor", () => {
  const catalog = ownedCatalog("ws-focus", "ws-other");
  let state = overviewState();
  const overview = deriveOverview(catalog, "ws-focus");
  assert.equal(overview.scene.overviewAnchorId, "company-a");
  assert.equal(buildNexoraMVPAdvisorContextBridge(state, overview).advisorSubjectId, null);
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const focused = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
    activeManagerWorkspaceId: "ws-focus",
  });
  assert.equal(focused.scene.focusedObjectId, "obj-capacity");
  assert.equal(focused.scene.overviewAnchorId, null);
  assert.equal(buildNexoraMVPAdvisorContextBridge(state, focused).advisorSubjectId, "obj-capacity");
  const restored = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(restored.focusedSubject, null);
  const again = deriveNexoraMVPStageInteractionPresentation(restored, catalog, {
    consultExecutiveChangeSessionStore: false,
    activeManagerWorkspaceId: "ws-focus",
  });
  assert.equal(again.scene.overviewAnchorId, "company-a");
  assert.equal(again.focusedSubjectId, null);
});
