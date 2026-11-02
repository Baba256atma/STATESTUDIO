/**
 * NPA-T STAGE-TEST-OWNED-SUBJECT-PROJECTION:1
 * The test dataset reaches Stage composition and stays out of production.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { resolveNexoraMVPStageScenePresentation } from "../nex-mvp/nexora3DExecutiveStage.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import {
  STAGE_TEST_OWNED_RELATIONSHIPS,
  STAGE_TEST_OWNED_SUBJECTS,
  STAGE_TEST_WORKSPACE_ALPHA,
  STAGE_TEST_WORKSPACE_BETA,
  executiveStageTestOwnedSubjectProjectionIdentity,
  materializeStageTestOwnedSubjects,
  projectTestOwnedStageCatalog,
} from "./executiveStageTestOwnedSubjectProjection.ts";

const shellSource = readFileSync(
  new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
  "utf8",
);
const pageSource = readFileSync(
  new URL("../../executive/page.tsx", import.meta.url),
  "utf8",
);
const stageMountSource = readFileSync(
  new URL("../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx", import.meta.url),
  "utf8",
);
const projectionSource = readFileSync(
  new URL("./executiveStageTestOwnedSubjectProjection.ts", import.meta.url),
  "utf8",
);

function overviewState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function present(scenario: "workspace-a" | "workspace-b" | "no-center" | "foreign-company") {
  const catalog = projectTestOwnedStageCatalog(scenario);
  const workspaceId = scenario === "workspace-b"
    ? STAGE_TEST_WORKSPACE_BETA
    : STAGE_TEST_WORKSPACE_ALPHA;
  const derived = deriveNexoraMVPStageInteractionPresentation(overviewState(), catalog, {
    consultExecutiveChangeSessionStore: false,
    activeManagerWorkspaceId: workspaceId,
  });
  return {
    catalog,
    derived,
    placed: applyExecutiveStage2DTopologyRecompositionToStagePresentation(derived, {
      ...(derived.scene.overviewAnchorId != null
        ? { overviewAnchorId: derived.scene.overviewAnchorId }
        : {}),
    }),
  };
}

test("the test projection is absent from production Stage entry points", () => {
  assert.equal(
    executiveStageTestOwnedSubjectProjectionIdentity,
    "NPA-T STAGE-TEST-OWNED-SUBJECT-PROJECTION:1",
  );
  for (const source of [shellSource, pageSource, stageMountSource]) {
    assert.equal(source.includes("executiveStageTestOwnedSubjectProjection"), false);
    assert.equal(source.includes("company-alpha"), false);
    assert.equal(source.includes("ws-test-alpha"), false);
  }
  assert.equal(pageSource.includes("dataset"), true);
  assert.equal(/searchParams/.test(pageSource), true);
  assert.equal(projectionSource.includes("localStorage"), false);
  assert.equal(projectionSource.includes("indexedDB"), false);
  assert.equal(projectionSource.includes("sessionStorage"), false);
  assert.equal(projectionSource.includes("document.cookie"), false);
});

test("workspace projections admit only that workspace's center and related subjects", () => {
  const before = JSON.stringify(STAGE_TEST_OWNED_SUBJECTS);
  const registryBefore = getActiveWorkspaceId();
  const alpha = projectTestOwnedStageCatalog("workspace-a");
  const beta = projectTestOwnedStageCatalog("workspace-b");
  const alphaAgain = projectTestOwnedStageCatalog("workspace-a");
  assert.deepEqual(
    alpha.objects.map((object) => object.id),
    [
      "company-alpha",
      "test-capacity-alpha",
      "test-budget-alpha",
      "test-inventory-alpha",
      "test-risk-alpha",
    ],
  );
  assert.deepEqual(
    beta.objects.map((object) => object.id),
    ["company-beta", "test-delivery-beta", "test-quality-beta"],
  );
  assert.equal(new Set(alpha.objects.map((object) => object.id)).size, alpha.objects.length);
  assert.deepEqual(alpha, alphaAgain);
  assert.equal(JSON.stringify(STAGE_TEST_OWNED_SUBJECTS), before);
  assert.equal(getActiveWorkspaceId(), registryBefore);
  for (const id of [
    "test-unrelated-alpha",
    "test-denied-alpha",
    "test-undisclosed-alpha",
    "test-unresolved-alpha",
    "test-foreign-beta",
    "company-beta",
  ]) {
    assert.equal(alpha.objects.some((object) => object.id === id), false);
  }
  for (const id of ["company-alpha", "test-capacity-alpha"]) {
    assert.equal(beta.objects.some((object) => object.id === id), false);
  }
});

test("the Stage scene drops foreign, denied, and undisclosed subjects before rendering", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: materializeStageTestOwnedSubjects(),
    relationships: STAGE_TEST_OWNED_RELATIONSHIPS,
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "minimum",
    environmentIntent: "neutral",
    activeManagerWorkspaceId: STAGE_TEST_WORKSPACE_ALPHA,
  });
  const ids = scene.objects.map((object) => object.id);
  assert.equal(ids.includes("company-alpha"), true);
  assert.equal(ids.includes("test-capacity-alpha"), true);
  assert.equal(ids.includes("test-foreign-beta"), false);
  assert.equal(ids.includes("company-beta"), false);
  assert.equal(ids.includes("test-delivery-beta"), false);
  assert.equal(ids.includes("test-denied-alpha"), false);
  assert.equal(ids.includes("test-undisclosed-alpha"), false);
  assert.equal(scene.overviewAnchorId, "company-alpha");
  assert.notEqual(scene.overviewAnchorId, "test-unresolved-alpha");
  assert.equal(scene.focusedObjectId, null);
});

test("workspace A and B rings center the owned company and exclude the other workspace", () => {
  const alpha = present("workspace-a");
  const beta = present("workspace-b");
  const alphaCenter = alpha.placed.scene.objects.find((object) => object.id === "company-alpha");
  const betaCenter = beta.placed.scene.objects.find((object) => object.id === "company-beta");
  assert.equal(alpha.derived.scene.overviewAnchorId, "company-alpha");
  assert.deepEqual(alphaCenter?.targetPosition, [0, 0, 0]);
  assert.equal(alpha.placed.focusedSubjectId, null);
  assert.equal(alpha.placed.scene.focusedObjectId, null);
  assert.equal(
    buildNexoraMVPAdvisorContextBridge(overviewState(), alpha.derived).advisorSubjectId,
    null,
  );
  const alphaSatellites = alpha.placed.scene.objects.filter((object) => object.id !== "company-alpha");
  assert.equal(alphaSatellites.length, 4);
  assert.equal(new Set(alphaSatellites.map((object) => JSON.stringify(object.targetPosition))).size, 4);
  for (const object of alphaSatellites) {
    assert.notDeepEqual(object.targetPosition, [0, 0, 0]);
  }
  assert.equal(beta.derived.scene.overviewAnchorId, "company-beta");
  assert.deepEqual(betaCenter?.targetPosition, [0, 0, 0]);
  assert.equal(
    beta.placed.scene.objects.some((object) => object.id.endsWith("-alpha") || object.id === "company-alpha"),
    false,
  );
});

test("no center and a foreign company stay on Flow", () => {
  const none = present("no-center");
  const foreign = present("foreign-company");
  assert.equal(none.derived.scene.overviewAnchorId, null);
  assert.equal(foreign.derived.scene.overviewAnchorId, null);
  assert.equal(foreign.catalog.objects.length, 0);
  const production = deriveNexoraMVPStageInteractionPresentation(
    overviewState(),
    getDefaultNexoraMVPObjectInteractionCatalog(),
    {
      consultExecutiveChangeSessionStore: false,
      activeManagerWorkspaceId: STAGE_TEST_WORKSPACE_ALPHA,
    },
  );
  assert.equal(production.scene.overviewAnchorId, null);
  assert.equal(
    getDefaultNexoraMVPObjectInteractionCatalog().objects.some((object) => object.id === "company-alpha"),
    false,
  );
});

test("the authorized ring survives derivation and input reorder", () => {
  const catalog = projectTestOwnedStageCatalog("workspace-a");
  const reversed = {
    ...catalog,
    objects: [...catalog.objects].reverse(),
  };
  const present = (next: typeof catalog) =>
    deriveNexoraMVPStageInteractionPresentation(overviewState(), next, {
      consultExecutiveChangeSessionStore: false,
      activeManagerWorkspaceId: STAGE_TEST_WORKSPACE_ALPHA,
    });
  const first = present(catalog);
  const second = present(reversed);
  const radius = (id: string, presentation: typeof first) => {
    const object = presentation.scene.objects.find((entry) => entry.id === id);
    assert.equal(object?.labelVisible, true);
    assert.notEqual(object?.disclosureState, "hidden");
    return Math.hypot(object?.targetPosition[0] ?? 0, object?.targetPosition[1] ?? 0);
  };
  assert.deepEqual(
    first.scene.objects.find((object) => object.id === "company-alpha")?.targetPosition,
    [0, 0, 0],
  );
  for (const id of ["test-capacity-alpha", "test-budget-alpha", "test-inventory-alpha", "test-risk-alpha"]) {
    assert.ok(radius(id, first) > 1.4);
    assert.deepEqual(
      first.scene.objects.find((object) => object.id === id)?.targetPosition,
      second.scene.objects.find((object) => object.id === id)?.targetPosition,
    );
  }
  const production = deriveNexoraMVPStageInteractionPresentation(
    overviewState(),
    getDefaultNexoraMVPObjectInteractionCatalog(),
    {
      consultExecutiveChangeSessionStore: false,
      activeManagerWorkspaceId: STAGE_TEST_WORKSPACE_ALPHA,
    },
  );
  assert.equal(production.scene.overviewAnchorId, null);
});

test("focus clears the Overview anchor and Overview restores the same company", () => {
  const catalog = projectTestOwnedStageCatalog("workspace-a");
  let state = overviewState();
  state = selectNexoraMVPInteractionSubject(state, "test-capacity-alpha", catalog);
  const focused = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
    activeManagerWorkspaceId: STAGE_TEST_WORKSPACE_ALPHA,
  });
  const placed = applyExecutiveStage2DTopologyRecompositionToStagePresentation(focused);
  const capacity = placed.scene.objects.find((object) => object.id === "test-capacity-alpha");
  assert.equal(focused.scene.focusedObjectId, "test-capacity-alpha");
  assert.equal(focused.scene.overviewAnchorId, null);
  assert.deepEqual(capacity?.targetPosition, [0, 0, 0]);
  assert.equal(
    buildNexoraMVPAdvisorContextBridge(state, focused).advisorSubjectId,
    "test-capacity-alpha",
  );
  const restored = resetNexoraMVPObjectInteractionOverview(state);
  const overview = deriveNexoraMVPStageInteractionPresentation(restored, catalog, {
    consultExecutiveChangeSessionStore: false,
    activeManagerWorkspaceId: STAGE_TEST_WORKSPACE_ALPHA,
  });
  assert.equal(overview.scene.overviewAnchorId, "company-alpha");
  assert.equal(overview.focusedSubjectId, null);
  assert.equal(restored.focusedSubject, null);
});
