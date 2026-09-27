/**
 * NPA-T MLEVEL:5 — live Stage/OVS/Theatre integration tests A–AL.
 * Does not invent belongs_to. Does not start MLEVEL:FINAL.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import { projectSceneOrgRightContext } from "@/app/lib/scene-org/sceneOrgRightContextContract.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { classifyManagementLevelInteraction } from "./nmiManagementLevelInteractionCompose.ts";
import { settleManagementLevelMotion } from "./nmiManagementLevelMotionCompose.ts";
import type { NmiCanonicalRef } from "./nmiContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { composeNmiLiveUnifiedManagementModel } from "./nmiLiveHost.ts";
import { hostNmiLiveManagementIntelligence } from "./nmiLivePipeline.ts";
import { composeNmiLiveManagementLevels } from "./nmiLiveManagementLevelsCompose.ts";
import {
  NMI_LIVE_MANAGEMENT_LEVEL_STAGE_ADAPTER,
  applyManagementLevelSpatialToStagePresentation,
} from "./nmiLiveManagementLevelStageAdapter.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPANY = "obj-revenue";
const OPERATIONS = "obj-delivery";
const PRODUCTION = "obj-inventory";
const CAPACITY = "obj-capacity";

function ref(id: string, kind: NmiCanonicalRef["kind"]): NmiCanonicalRef {
  return { id, kind, authority: "canonical", sourceRef: `src:${id}` };
}

function rel(
  relationshipId: string,
  fromId: string,
  toId: string,
  kind: NmiManagementRelationship["kind"] = "belongs_to",
): NmiManagementRelationship {
  return {
    relationshipId,
    fromId,
    toId,
    kind,
    epistemicStatus: "DECLARED",
    causal: false,
    convertsAssociationToCause: false,
    convertsAssumptionToFact: false,
    sourceAuthority: "canonical",
    sourceRef: relationshipId,
  };
}

const DECLARED_NODES = [
  ref(COMPANY, "BUSINESS_PROJECT"),
  ref(OPERATIONS, "PROCESS"),
  ref(PRODUCTION, "PROCESS"),
  ref(CAPACITY, "PROBLEM"),
];

const DECLARED_RELS = [
  rel("rel:capacity-production", CAPACITY, PRODUCTION),
  rel("rel:production-operations", PRODUCTION, OPERATIONS),
  rel("rel:operations-company", OPERATIONS, COMPANY),
];

function liveHost(extraRels: readonly NmiManagementRelationship[] = DECLARED_RELS) {
  return hostNmiLiveManagementIntelligence({
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    focusedSubjectId: PRODUCTION,
    host: {
      declaredNodes: DECLARED_NODES,
      declaredRelationships: extraRels,
      declaredAnnotations: [
        { id: COMPANY, title: "Company" },
        { id: OPERATIONS, title: "Operations" },
        { id: PRODUCTION, title: "Production" },
        { id: CAPACITY, title: "Capacity" },
      ],
    },
  });
}

function levels(selectedId: string, extraRels?: readonly NmiManagementRelationship[]) {
  return composeNmiLiveManagementLevels({
    map: liveHost(extraRels).map,
    selectedCanonicalId: selectedId,
  });
}

function presentationAt(id: string) {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    id,
    catalog,
  );
  return { state, presentation: deriveNexoraMVPStageInteractionPresentation(state, catalog) };
}

test("A. Live canonical belongs_to reaches MLEVEL:1", () => {
  const hosted = liveHost();
  assert.ok(hosted.map.relationships.some((item) => item.kind === "belongs_to" && item.relationshipId === "rel:capacity-production"));
  const composed = levels(PRODUCTION);
  assert.equal(composed.path.active?.canonicalId, PRODUCTION);
  assert.equal(composed.path.parent?.canonicalId, OPERATIONS);
  assert.equal(composed.path.grandparent?.canonicalId, COMPANY);
});

test("B. NMI live host does not fabricate belongs_to", () => {
  const hosted = composeNmiLiveUnifiedManagementModel({
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
  });
  assert.equal(hosted.fabricatesMissingStructure, false);
  assert.equal(hosted.model.relationships.some((item) => item.kind === "belongs_to"), false);
});

test("C. Existing canonical relationship IDs survive live hosting", () => {
  const hosted = liveHost();
  assert.deepEqual(
    hosted.model.relationships.filter((item) => item.kind === "belongs_to").map((item) => item.relationshipId).sort(),
    DECLARED_RELS.map((item) => item.relationshipId).sort(),
  );
});

test("D. Three-level live fixture resolves L1/L2/L3", () => {
  const composed = levels(PRODUCTION);
  assert.equal(composed.spatial.visibleLevelCount, 3);
  assert.equal(composed.fabricatesBelongsTo, false);
});

test("E. L1-only live fixture remains valid", () => {
  const hosted = hostNmiLiveManagementIntelligence({
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    focusedSubjectId: "ctx-problem-margin",
  });
  const composed = composeNmiLiveManagementLevels({
    map: hosted.map,
    selectedCanonicalId: "ctx-problem-margin",
  });
  assert.equal(composed.spatial.visibleLevelCount, 1);
  assert.equal(composed.spatial.placeholderSlots, 0);
});

test("F. Partial two-level hierarchy remains valid", () => {
  const composed = levels(OPERATIONS);
  assert.equal(composed.spatial.visibleLevelCount, 2);
  assert.equal(composed.path.grandparent, null);
});

test("G. Ambiguous hierarchy does not fabricate parent", () => {
  const composed = levels(CAPACITY, [
    rel("rel:a", CAPACITY, PRODUCTION),
    rel("rel:b", CAPACITY, OPERATIONS),
  ]);
  assert.equal(composed.path.parentResolution, "AMBIGUOUS");
  assert.equal(composed.spatial.visibleLevelCount, 1);
});

test("H. Stage consumes MLEVEL:2 placement", () => {
  const { presentation } = presentationAt(PRODUCTION);
  const spatial = levels(PRODUCTION).spatial;
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, spatial);
  const production = applied.scene.objects.find((item) => item.id === PRODUCTION);
  const slot = spatial.slots.find((item) => item.canonicalId === PRODUCTION);
  assert.equal(production?.targetPosition[0], slot?.placement.world.x);
  assert.equal(production?.targetPosition[1], slot?.placement.world.y);
  assert.equal(production?.scale, slot?.scale);
});

test("I. No second Stage is created", () => {
  assert.equal(levels(PRODUCTION).secondStage, false);
});

test("J. No second canvas/R3F root is created", () => {
  const stage = readFileSync(join(HERE, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"), "utf8");
  assert.equal([...stage.matchAll(/<NexoraStageCanvas/g)].length, 1);
  assert.match(stage, /data-mlevel-second-canvas="false"/);
});

test("K. OVS canonical ID matches MLEVEL canonical ID", () => {
  const { presentation } = presentationAt(CAPACITY);
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, levels(CAPACITY).spatial);
  assert.ok(applied.scene.objects.some((item) => item.id === CAPACITY));
  assert.equal(levels(CAPACITY).spatial.slots[0]?.canonicalId, CAPACITY);
});

test("L. OVS geometry ownership remains unchanged", () => {
  assert.equal(NMI_LIVE_MANAGEMENT_LEVEL_STAGE_ADAPTER.ownsOvsGeometry, false);
});

test("M. OVS management state remains unchanged by level role", () => {
  const { presentation } = presentationAt(CAPACITY);
  const before = presentation.scene.objects.find((item) => item.id === CAPACITY);
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, levels(CAPACITY).spatial);
  const after = applied.scene.objects.find((item) => item.id === CAPACITY);
  assert.equal(after?.executiveVisualState, before?.executiveVisualState);
  assert.equal(after?.status, before?.status);
  assert.equal(after?.attention, before?.attention);
  assert.equal(NMI_LIVE_MANAGEMENT_LEVEL_STAGE_ADAPTER.ownsOvsManagementState, false);
});

test("N. L1 role can compose with existing OVS state", () => {
  const { presentation } = presentationAt(CAPACITY);
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, levels(CAPACITY).spatial);
  const object = applied.scene.objects.find((item) => item.id === CAPACITY);
  assert.equal(object?.id, CAPACITY);
  assert.ok(object?.status);
  assert.equal(levels(CAPACITY).spatial.slots[0]?.role, "ACTIVE");
});

test("O. L2 role can compose with existing OVS state", () => {
  const { presentation } = presentationAt(CAPACITY);
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, levels(CAPACITY).spatial);
  const production = applied.scene.objects.find((item) => item.id === PRODUCTION);
  assert.equal(production?.status, presentation.scene.objects.find((item) => item.id === PRODUCTION)?.status);
  assert.equal(levels(CAPACITY).spatial.slots.find((item) => item.canonicalId === PRODUCTION)?.role, "PARENT");
});

test("P. Physical Z remains zero for hierarchy", () => {
  const { presentation } = presentationAt(PRODUCTION);
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, levels(PRODUCTION).spatial);
  for (const slot of levels(PRODUCTION).spatial.slots) {
    const object = applied.scene.objects.find((item) => item.id === slot.canonicalId);
    if (object) assert.equal(object.targetPosition[2], 0);
  }
  assert.equal(NMI_LIVE_MANAGEMENT_LEVEL_STAGE_ADAPTER.usesZForHierarchy, false);
});

test("Q. Stage cards remain 0–3 Stage-wide", () => {
  assert.equal(levels(PRODUCTION).spatial.cardAuthority, SCENE_ORG_NORMAL_STAGE_CARD_RULE);
  assert.equal(levels(PRODUCTION).spatial.cardAuthority.maximum, 3);
});

test("R. L2/L3 do not gain working card sets", () => {
  const spatial = levels(PRODUCTION).spatial;
  assert.equal(spatial.slots.filter((slot) => slot.stageCardEligible).length, 1);
  assert.equal(spatial.levelCards, false);
});

test("S. DTH remains one active Theatre composition", () => {
  const { presentation } = presentationAt(PRODUCTION);
  const spatial = levels(PRODUCTION).spatial;
  const before = presentation.scene.objects.find((item) => item.id === PRODUCTION)?.targetPosition;
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, spatial, { theatreActive: true });
  assert.deepEqual(applied.scene.objects.find((item) => item.id === PRODUCTION)?.targetPosition, before);
  assert.equal(levels(PRODUCTION).secondTheatre, false);
});

test("T. L2/L3 do not instantiate Theatre recipes", () => {
  const adapter = readFileSync(join(HERE, "nmiLiveManagementLevelStageAdapter.ts"), "utf8");
  assert.doesNotMatch(adapter, /composeDth|projectNexoraDecisionTheatreFoundation/);
});

test("U. L2 activation uses existing onSelectSubject", () => {
  const request = classifyManagementLevelInteraction({
    path: levels(CAPACITY).path,
    map: liveHost().map,
    kind: "ACTIVATE",
    sourceLevel: "PARENT",
  });
  assert.equal(request.navigation, "CANONICAL_NAVIGATION");
  assert.equal(request.targetCanonicalId, PRODUCTION);
  const shell = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(shell, /onSelectSubject=\{onSelectSubject\}/);
  assert.match(shell, /selectNexoraMVPInteractionSubject/);
});

test("V. L3 activation uses existing onSelectSubject", () => {
  const request = classifyManagementLevelInteraction({
    path: levels(CAPACITY).path,
    map: liveHost().map,
    kind: "ACTIVATE",
    sourceLevel: "GRANDPARENT",
  });
  assert.equal(request.targetCanonicalId, OPERATIONS);
});

test("W. Canonical child activation can produce DRILL_DOWN", () => {
  const request = classifyManagementLevelInteraction({
    path: levels(PRODUCTION).path,
    map: liveHost().map,
    kind: "ACTIVATE",
    targetCanonicalId: CAPACITY,
    sourceLevel: "ACTIVE",
  });
  assert.equal(request.intent, "DRILL_DOWN");
});

test("X. Non-child activation is not falsely classified as DRILL_DOWN", () => {
  const request = classifyManagementLevelInteraction({
    path: levels(PRODUCTION).path,
    map: liveHost().map,
    kind: "ACTIVATE",
    targetCanonicalId: "obj-budget",
    sourceLevel: "ACTIVE",
  });
  assert.notEqual(request.intent, "DRILL_DOWN");
});

test("Y. Drill-down recomposes MLEVEL:1/2", () => {
  const after = levels(CAPACITY);
  assert.equal(after.path.active?.canonicalId, CAPACITY);
  assert.equal(after.path.parent?.canonicalId, PRODUCTION);
  assert.equal(after.path.grandparent?.canonicalId, OPERATIONS);
});

test("Z. Drill-up recomposes MLEVEL:1/2", () => {
  const after = levels(PRODUCTION);
  assert.equal(after.path.active?.canonicalId, PRODUCTION);
  assert.equal(after.path.parent?.canonicalId, OPERATIONS);
  assert.equal(after.path.grandparent?.canonicalId, COMPANY);
});

test("AA. MLEVEL:4 receives the resulting before/after composition", () => {
  const before = levels(PRODUCTION);
  const after = composeNmiLiveManagementLevels({
    map: liveHost().map,
    selectedCanonicalId: CAPACITY,
    previousSpatial: before.spatial,
  });
  assert.equal(after.motion.sourceComposition, before.spatial);
  assert.equal(after.motion.targetComposition, after.spatial);
});

test("AB. MLEVEL:4 target equals MLEVEL:2", () => {
  const composed = levels(CAPACITY);
  const settled = settleManagementLevelMotion(composed.motion);
  for (const slot of composed.spatial.slots) {
    const current = settled.participants.find((item) => item.canonicalId === slot.canonicalId)?.current;
    assert.deepEqual(current?.normalized, slot.placement.normalized);
    assert.equal(current?.scale, slot.scale);
  }
});

test("AC. Reduced motion settles to identical final state", () => {
  const normal = composeNmiLiveManagementLevels({
    map: liveHost().map,
    selectedCanonicalId: CAPACITY,
    previousSpatial: levels(PRODUCTION).spatial,
    reducedMotion: false,
  });
  const reduced = composeNmiLiveManagementLevels({
    map: liveHost().map,
    selectedCanonicalId: CAPACITY,
    previousSpatial: levels(PRODUCTION).spatial,
    reducedMotion: true,
  });
  assert.deepEqual(
    settleManagementLevelMotion(normal.motion).participants.map((item) => [item.canonicalId, item.current.normalized, item.current.scale]),
    settleManagementLevelMotion(reduced.motion).participants.map((item) => [item.canonicalId, item.current.normalized, item.current.scale]),
  );
});

test("AD. Right Context remains downstream of Stage selection", () => {
  const { state, presentation } = presentationAt(CAPACITY);
  const right = projectSceneOrgRightContext({
    advisorBridge: buildNexoraMVPAdvisorContextBridge(state, presentation),
    focusedSubject: state.focusedSubject,
    selectedSubject: state.selectedSubject,
  });
  assert.equal(right.canonicalId, CAPACITY);
  assert.equal(right.source, "existing-stage-advisor-bridge");
});

test("AE. Advisor subject remains downstream of Stage selection", () => {
  const { state, presentation } = presentationAt(CAPACITY);
  const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(advisor.advisorSubjectId, CAPACITY);
});

test("AF. Detail does not create another level state", () => {
  const composer = readFileSync(join(HERE, "nmiLiveManagementLevelsCompose.ts"), "utf8");
  assert.doesNotMatch(composer, /detailWorkspace|levelState/);
});

test("AG. NMI Map selection recomposes levels through canonical selection", () => {
  const composed = composeNmiLiveManagementLevels({
    map: liveHost().map,
    selectedCanonicalId: CAPACITY,
  });
  assert.equal(composed.path.active?.canonicalId, CAPACITY);
  const shell = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(shell, /composeNmiLiveManagementLevels/);
  assert.match(shell, /composeNmiStageProjection/);
  assert.match(shell, /onSelectSubject\(projection\.projectionAnchorId\)/);
});

test("AH. No render-time hierarchy inference exists", () => {
  const stage = readFileSync(join(HERE, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"), "utf8");
  const nav = readFileSync(join(HERE, "../../executive/nex-mvp/stage/NexoraManagementLevelContextNav.tsx"), "utf8");
  assert.doesNotMatch(stage, /kind === ["']belongs_to["']/);
  assert.doesNotMatch(nav, /kind === ["']belongs_to["']/);
  assert.equal(levels(PRODUCTION).resolvesHierarchyInRenderer, false);
});

test("AI. No animation frame writes semantic state", () => {
  const nav = readFileSync(join(HERE, "../../executive/nex-mvp/stage/NexoraManagementLevelContextNav.tsx"), "utf8");
  assert.doesNotMatch(nav, /onSelectSubject\(.*progress/);
  assert.match(nav, /planManagementLevelMotion/);
});

test("AJ. Existing Stage remains usable without MLEVEL composition", () => {
  const { presentation } = presentationAt(CAPACITY);
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, null);
  assert.equal(applied, presentation);
  assert.ok(presentation.scene.objects.length > 0);
});

test("AK. No second hierarchy/navigation/referent/Object authority exists", () => {
  const hosted = liveHost();
  assert.equal(hosted.secondManagementStore, false);
  assert.equal(composeNmiLiveUnifiedManagementModel({ catalog: getDefaultNexoraMVPObjectInteractionCatalog() }).secondManagementStore, false);
});

test("AL. Live integration does not create selection/recomposition loops", () => {
  const first = levels(PRODUCTION);
  const second = composeNmiLiveManagementLevels({
    map: liveHost().map,
    selectedCanonicalId: PRODUCTION,
  });
  assert.equal(first.path.active?.canonicalId, second.path.active?.canonicalId);
  assert.equal(first.spatial.visibleLevelCount, second.spatial.visibleLevelCount);
  const shell = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(shell, /managementLevelSpatial=\{managementLevelSpatial\}/);
  assert.match(shell, /hostNmiLiveManagementIntelligence/);
});
