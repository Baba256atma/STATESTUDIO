/**
 * NPA-T DTH-EXP:LIVE-FIX1 — live DTH:5 → existing managementNeed → 4A → 7B spatial.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { DTH_EXP_NEXO_RECIPE_FAMILIES } from "./dthExpSceneRecipeContract.ts";
import {
  DTH_EXP_DIRECTOR_NEXO_NEED_TO_FAMILY,
  DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY,
  dthExpLiveManagementNeedIdentity,
  projectDthExpLiveTheatreSceneResponse,
  resolveDthExpManagementNeedFromLiveTheatre,
  selectNexoraDirectorNexoFamily,
  verifyDthExpLiveManagementNeedBoundary,
} from "./dthExpPublicIndex.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

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

test("A — Live DTH intent/context produces an existing managementNeed", () => {
  assert.equal(dthExpLiveManagementNeedIdentity, "NPA-T DTH-EXP:LIVE-FIX1/LiveManagementNeedAdapter");
  assert.equal(verifyDthExpLiveManagementNeedBoundary().ok, true);
  assert.equal(DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.selectsNexoFamily, false);
  const need = resolveDthExpManagementNeedFromLiveTheatre({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "risk",
  });
  assert.equal(need, "RISK_FOCUS");
  assert.equal(DTH_EXP_DIRECTOR_NEXO_NEED_TO_FAMILY[need], "NEXO_RISK");
});

test("B — REVIEW_FOCAL_OBJECT is context-sensitive, not one family", () => {
  const riskNeed = resolveDthExpManagementNeedFromLiveTheatre({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "risk",
  });
  const executionNeed = resolveDthExpManagementNeedFromLiveTheatre({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "execution",
  });
  const kpiNeed = resolveDthExpManagementNeedFromLiveTheatre({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "kpi",
  });
  assert.equal(riskNeed, "RISK_FOCUS");
  assert.equal(executionNeed, "EXECUTION_STATUS");
  assert.equal(kpiNeed, "UNSPECIFIED");
  const riskFamily = selectNexoraDirectorNexoFamily({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "risk",
    canonicalSubjectId: "obj-risk",
  });
  const executionFamily = selectNexoraDirectorNexoFamily({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "execution",
    canonicalSubjectId: "obj-execution",
  });
  assert.equal(riskFamily.selectedFamily, "NEXO_RISK");
  assert.equal(executionFamily.selectedFamily, "NEXO_EXECUTION");
  assert.notEqual(riskFamily.selectedFamily, executionFamily.selectedFamily);
});

test("C — ORIENT_TO_STAGE does not force a Nexo family", () => {
  const need = resolveDthExpManagementNeedFromLiveTheatre({
    sceneIntentKind: "ORIENT_TO_STAGE",
  });
  assert.equal(need, "UNSPECIFIED");
  const selection = selectNexoraDirectorNexoFamily({
    sceneIntentKind: "ORIENT_TO_STAGE",
    canonicalSubjectId: null,
  });
  assert.equal(selection.selectedFamily, null);
  assert.equal(selection.selectionState, "unresolved");
  const overview = projectDthExpLiveTheatreSceneResponse({ theatre: theatreFor(null) });
  assert.equal(overview.spatial, null);
  assert.equal(overview.targetFamily, null);
});

test("D — Adapter produces need; existing 4A still selects the family", () => {
  const need = resolveDthExpManagementNeedFromLiveTheatre({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "problem",
  });
  assert.equal(need, "CAUSE_INVESTIGATION");
  const selection = selectNexoraDirectorNexoFamily({
    managementNeed: need,
    canonicalSubjectId: "obj-problem",
  });
  assert.equal(selection.identity, "NPA-T DTH-EXP:4A/DirectorNexoSelection");
  assert.equal(selection.selectedFamily, "NEXO_CAUSE");
  assert.equal(selection.selectedFamily, DTH_EXP_DIRECTOR_NEXO_NEED_TO_FAMILY[need]);
});

test("E — Selected family stays inside the certified nine-family registry", () => {
  const selection = selectNexoraDirectorNexoFamily({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "risk",
    canonicalSubjectId: "obj-risk",
  });
  assert.ok(selection.selectedFamily);
  assert.ok((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes(selection.selectedFamily!));
  assert.equal(DTH_EXP_NEXO_RECIPE_FAMILIES.length, 9);
});

test("F — Live context → need → 4A family → 7B non-null spatial", () => {
  const theatre = theatreFor("obj-risk");
  assert.equal(theatre.sceneIntent.intentKind, "REVIEW_FOCAL_OBJECT");
  const focal = theatre.visibleExecutiveObjects.find((object) => object.id === "obj-risk");
  assert.equal(focal?.canonicalObjectType, "risk");
  const response = projectDthExpLiveTheatreSceneResponse({ theatre });
  assert.equal(response.managementNeed, "RISK_FOCUS");
  assert.equal(response.selection?.identity, "NPA-T DTH-EXP:4A/DirectorNexoSelection");
  assert.equal(response.targetFamily, "NEXO_RISK");
  assert.ok(response.spatial);
  assert.equal(response.spatial?.family, "NEXO_RISK");
  assert.ok(response.spatial?.actors.some((actor) => actor.canonicalObjectId === "obj-risk"));
  assert.equal(response.canonicalSubjectId, "obj-risk");
});

test("G — Insufficient semantics remain unresolved rather than guessed", () => {
  const generic = selectNexoraDirectorNexoFamily({
    sceneIntentKind: "REVIEW_FOCAL_OBJECT",
    focalCanonicalObjectType: "object",
    canonicalSubjectId: "obj-unknown",
  });
  assert.equal(generic.selectedFamily, null);
  const comparison = resolveDthExpManagementNeedFromLiveTheatre({
    sceneIntentKind: "COMPARE_CANDIDATES",
  });
  assert.equal(comparison, "UNSPECIFIED");
  const theatre = theatreFor("obj-capacity");
  const response = projectDthExpLiveTheatreSceneResponse({ theatre });
  assert.equal(response.spatial, null);
});

test("H — No duplicate Nexo selector in Shell / Stage / OVS", () => {
  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  const stage = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  const ovs = readFileSync(
    join(here, "../spatial-presentation/executiveOvsIsometricTheatreVisual.ts"),
    "utf8",
  );
  assert.doesNotMatch(shell, /selectNexoraDirectorNexoFamily/);
  assert.doesNotMatch(stage, /selectNexoraDirectorNexoFamily/);
  assert.doesNotMatch(ovs, /selectNexoraDirectorNexoFamily/);
  assert.equal(DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.parallelNexoSelector, false);
  assert.equal(DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.wiresOvsStage, false);
});

test("I — Authority preservation", () => {
  assert.equal(DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.parallelDirector, false);
  assert.equal(DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.inventsObjectTaxonomy, false);
  assert.equal(DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.inventsManagementNeedTaxonomy, false);
  const adapter = readFileSync(join(here, "./dthExpResolveLiveManagementNeed.ts"), "utf8");
  assert.doesNotMatch(adapter, /NEXO_FLOW|NEXO_CAUSE|selectedFamily/);
  assert.doesNotMatch(adapter, /NEXO_ROADMAP|NexoOverview|NexoInvestigation/);
  const projector = readFileSync(join(here, "./dthExpProjectLiveTheatreSceneResponse.ts"), "utf8");
  assert.match(projector, /orchestrateDthExpTheatreSceneResponse/);
  assert.doesNotMatch(projector, /selectNexoraDirectorNexoFamily/);
});
