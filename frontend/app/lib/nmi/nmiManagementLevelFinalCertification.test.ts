/**
 * NPA-T MLEVEL:FINAL — cross-phase invariants only.
 * Reuses MLEVEL:1–5 composers. Does not invent belongs_to or start another phase.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectSceneOrgRightContext } from "@/app/lib/scene-org/sceneOrgRightContextContract.ts";
import { EXECUTIVE_STAGE_MOTION } from "@/app/lib/spatial-presentation/executiveStageMotion.ts";
import type { NmiCanonicalRef } from "./nmiContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { composeNmiLiveUnifiedManagementModel } from "./nmiLiveHost.ts";
import { hostNmiLiveManagementIntelligence } from "./nmiLivePipeline.ts";
import { composeNmiLiveManagementLevels } from "./nmiLiveManagementLevelsCompose.ts";
import { applyManagementLevelSpatialToStagePresentation } from "./nmiLiveManagementLevelStageAdapter.ts";
import { classifyManagementLevelInteraction } from "./nmiManagementLevelInteractionCompose.ts";
import {
  MANAGEMENT_LEVEL_MOTION_TOKENS,
  planManagementLevelMotion,
  sampleManagementLevelMotion,
  settleManagementLevelMotion,
} from "./nmiManagementLevelMotionCompose.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPANY = "obj-revenue";
const OPERATIONS = "obj-delivery";
const PRODUCTION = "obj-inventory";
const CAPACITY = "obj-capacity";
const LINE_A = "obj-budget";

function ref(id: string, kind: NmiCanonicalRef["kind"]): NmiCanonicalRef {
  return { id, kind, authority: "canonical", sourceRef: `src:${id}` };
}

function rel(
  relationshipId: string,
  fromId: string,
  toId: string,
): NmiManagementRelationship {
  return {
    relationshipId,
    fromId,
    toId,
    kind: "belongs_to",
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
  ref(LINE_A, "PROBLEM"),
];

const DECLARED_RELS = [
  rel("rel:line-capacity", LINE_A, CAPACITY),
  rel("rel:capacity-production", CAPACITY, PRODUCTION),
  rel("rel:production-operations", PRODUCTION, OPERATIONS),
  rel("rel:operations-company", OPERATIONS, COMPANY),
];

function hosted(extraRels: readonly NmiManagementRelationship[] = DECLARED_RELS) {
  return hostNmiLiveManagementIntelligence({
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    focusedSubjectId: PRODUCTION,
    host: {
      declaredNodes: DECLARED_NODES,
      declaredRelationships: extraRels,
    },
  });
}

function levels(selectedId: string, extraRels?: readonly NmiManagementRelationship[]) {
  return composeNmiLiveManagementLevels({
    map: hosted(extraRels).map,
    selectedCanonicalId: selectedId,
  });
}

test("FINAL 1–2. Hierarchy only from belongs_to; no inference in live seams", () => {
  const host = readFileSync(join(HERE, "nmiLiveHost.ts"), "utf8");
  const path = readFileSync(join(HERE, "nmiManagementLevelPathCompose.ts"), "utf8");
  const stage = readFileSync(join(HERE, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"), "utf8");
  assert.match(path, /rel\.kind !== "belongs_to"/);
  assert.doesNotMatch(host, /parentChild|trailObjectIds|contextLinks/);
  assert.doesNotMatch(stage, /kind === ["']belongs_to["']/);
  assert.equal(levels(PRODUCTION).fabricatesBelongsTo, false);
});

test("FINAL 3–7. L1-only, two-level, three-level, deep cap 3, ambiguous safety", () => {
  const none = composeNmiLiveManagementLevels({
    map: hostNmiLiveManagementIntelligence({
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      focusedSubjectId: PRODUCTION,
    }).map,
    selectedCanonicalId: PRODUCTION,
  });
  assert.equal(none.spatial.visibleLevelCount, 1);
  assert.equal(none.path.parent, null);

  const two = levels(OPERATIONS);
  assert.equal(two.spatial.visibleLevelCount, 2);
  assert.equal(two.path.grandparent, null);

  const three = levels(PRODUCTION);
  assert.equal(three.path.active?.canonicalId, PRODUCTION);
  assert.equal(three.path.parent?.canonicalId, OPERATIONS);
  assert.equal(three.path.grandparent?.canonicalId, COMPANY);
  assert.equal(three.spatial.visibleLevelCount, 3);

  const deep = levels(LINE_A);
  assert.equal(deep.path.active?.canonicalId, LINE_A);
  assert.equal(deep.path.parent?.canonicalId, CAPACITY);
  assert.equal(deep.path.grandparent?.canonicalId, PRODUCTION);
  assert.equal(deep.path.visibleDepth, 3);
  assert.equal(deep.path.higherAncestryExists, true);
  assert.equal(deep.path.higherAncestryExpanded, false);

  const ambiguous = levels(CAPACITY, [
    rel("rel:a", CAPACITY, PRODUCTION),
    rel("rel:b", CAPACITY, OPERATIONS),
  ]);
  assert.equal(ambiguous.path.parentResolution, "AMBIGUOUS");
  assert.equal(ambiguous.spatial.visibleLevelCount, 1);
});

test("FINAL 8–13. Identity continuity and Stage-selection drills", () => {
  const production = levels(PRODUCTION);
  const capacity = levels(CAPACITY);
  assert.equal(production.path.active?.canonicalId, PRODUCTION);
  assert.equal(capacity.path.parent?.canonicalId, PRODUCTION);
  assert.equal(
    production.spatial.slots.find((slot) => slot.canonicalId === PRODUCTION)?.canonicalId,
    capacity.spatial.slots.find((slot) => slot.canonicalId === PRODUCTION)?.canonicalId,
  );

  const down = classifyManagementLevelInteraction({
    path: production.path,
    map: hosted().map,
    kind: "ACTIVATE",
    targetCanonicalId: CAPACITY,
    sourceLevel: "ACTIVE",
  });
  assert.equal(down.intent, "DRILL_DOWN");
  assert.equal(down.targetCanonicalId, CAPACITY);

  const upL2 = classifyManagementLevelInteraction({
    path: capacity.path,
    map: hosted().map,
    kind: "ACTIVATE",
    sourceLevel: "PARENT",
  });
  assert.equal(upL2.targetCanonicalId, PRODUCTION);
  assert.equal(upL2.navigation, "CANONICAL_NAVIGATION");

  const upL3 = classifyManagementLevelInteraction({
    path: capacity.path,
    map: hosted().map,
    kind: "ACTIVATE",
    sourceLevel: "GRANDPARENT",
  });
  assert.equal(upL3.targetCanonicalId, OPERATIONS);
});

test("FINAL 14–16. NMI Map uses Stage selection; no drill stack / history authority", () => {
  const shell = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  const compose = readFileSync(join(HERE, "nmiLiveManagementLevelsCompose.ts"), "utf8");
  assert.match(shell, /composeNmiStageProjection/);
  assert.match(shell, /onSelectSubject\(projection\.projectionAnchorId\)/);
  assert.doesNotMatch(compose, /drillStack|levelHistory|previousLevels/);
  assert.equal(levels(PRODUCTION).path.usesNavigationHistory, false);
});

test("FINAL 17–24. Spatial target, Z=0, OVS, cards, one Theatre/Stage/canvas", () => {
  const composed = levels(CAPACITY);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    CAPACITY,
    catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  const applied = applyManagementLevelSpatialToStagePresentation(presentation, composed.spatial);
  const production = applied.scene.objects.find((item) => item.id === PRODUCTION);
  const before = presentation.scene.objects.find((item) => item.id === PRODUCTION);
  assert.equal(production?.id, PRODUCTION);
  assert.equal(production?.executiveVisualState, before?.executiveVisualState);
  assert.equal(production?.targetPosition[2], 0);
  assert.equal(composed.spatial.cardAuthority.maximum, 3);
  assert.equal(composed.spatial.levelCards, false);
  assert.equal(composed.secondTheatre, false);
  assert.equal(composed.secondStage, false);
  const stage = readFileSync(join(HERE, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"), "utf8");
  assert.equal([...stage.matchAll(/<NexoraStageCanvas/g)].length, 1);
});

test("FINAL 25–27. Advisor and Right Context follow Stage selection; Detail owns no levels", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    CAPACITY,
    catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
  const right = projectSceneOrgRightContext({
    advisorBridge: advisor,
    focusedSubject: state.focusedSubject,
    selectedSubject: state.selectedSubject,
  });
  assert.equal(advisor.advisorSubjectId, CAPACITY);
  assert.equal(right.canonicalId, CAPACITY);
  const compose = readFileSync(join(HERE, "nmiLiveManagementLevelsCompose.ts"), "utf8");
  assert.doesNotMatch(compose, /detailWorkspace|savedScene|levelState/);
});

test("FINAL 28–32. Motion target, no semantic writes, reduced settle, interruption", () => {
  const production = levels(PRODUCTION);
  const capacity = composeNmiLiveManagementLevels({
    map: hosted().map,
    selectedCanonicalId: CAPACITY,
    previousSpatial: production.spatial,
  });
  assert.equal(capacity.motion.targetComposition, capacity.spatial);
  assert.equal(capacity.motion.ownsSelectedCanonicalId, false);
  assert.equal(capacity.motion.ownsHierarchy, false);
  assert.equal(MANAGEMENT_LEVEL_MOTION_TOKENS.durationMs, EXECUTIVE_STAGE_MOTION.topologyDurationMs);
  assert.equal(MANAGEMENT_LEVEL_MOTION_TOKENS.durationMs, 450);
  assert.equal(MANAGEMENT_LEVEL_MOTION_TOKENS.reducedMotionDurationMs, 80);
  assert.equal(MANAGEMENT_LEVEL_MOTION_TOKENS.easing, "easeOutCubic");

  const reduced = composeNmiLiveManagementLevels({
    map: hosted().map,
    selectedCanonicalId: CAPACITY,
    previousSpatial: production.spatial,
    reducedMotion: true,
  });
  const settledNormal = settleManagementLevelMotion(capacity.motion);
  const settledReduced = settleManagementLevelMotion(reduced.motion);
  assert.deepEqual(
    settledNormal.participants.map((item) => [item.canonicalId, item.current.normalized, item.current.scale]),
    settledReduced.participants.map((item) => [item.canonicalId, item.current.normalized, item.current.scale]),
  );

  const mid = sampleManagementLevelMotion(capacity.motion, 0.4);
  const interrupted = planManagementLevelMotion({
    previous: production.spatial,
    next: levels(LINE_A).spatial,
    selectedCanonicalId: LINE_A,
    liveSamples: mid.participants.map((item) => ({
      canonicalId: item.canonicalId,
      normalized: item.current.normalized,
      world: item.current.world,
      scale: item.current.scale,
      prominence: item.current.prominence,
    })),
  });
  assert.equal(interrupted.selectedCanonicalId, LINE_A);
  assert.equal(interrupted.targetComposition.slots[0]?.canonicalId, LINE_A);
  const nav = readFileSync(join(HERE, "../../executive/nex-mvp/stage/NexoraManagementLevelContextNav.tsx"), "utf8");
  assert.doesNotMatch(nav, /onSelectSubject\(.*progress/);
});

test("FINAL 33–36. NMI:8 forwards only; default mints zero; L1-only stale-safe; Stage without ancestry", () => {
  const defaultHost = composeNmiLiveUnifiedManagementModel({
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
  });
  assert.equal(defaultHost.model.relationships.some((item) => item.kind === "belongs_to"), false);
  assert.equal(defaultHost.fabricatesMissingStructure, false);

  const live = hosted();
  const forwarded = live.model.relationships.filter((item) => item.kind === "belongs_to");
  assert.deepEqual(
    forwarded.map((item) => item.relationshipId).sort(),
    DECLARED_RELS.map((item) => item.relationshipId).sort(),
  );
  assert.ok(forwarded.every((item) => item.sourceAuthority === "canonical"));
  assert.ok(forwarded.every((item) => item.causal === false));

  const afterL1 = composeNmiLiveManagementLevels({
    map: hostNmiLiveManagementIntelligence({
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      focusedSubjectId: "ctx-problem-margin",
    }).map,
    selectedCanonicalId: "ctx-problem-margin",
    previousSpatial: levels(PRODUCTION).spatial,
  });
  assert.equal(afterL1.spatial.visibleLevelCount, 1);
  assert.equal(afterL1.path.parent, null);

  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    CAPACITY,
    catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  assert.equal(applyManagementLevelSpatialToStagePresentation(presentation, null), presentation);
});

test("FINAL 35b. L1-only subject change does not surface previous L1 as context", () => {
  const map = hostNmiLiveManagementIntelligence({
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    focusedSubjectId: PRODUCTION,
  }).map;
  const from = composeNmiLiveManagementLevels({ map, selectedCanonicalId: PRODUCTION });
  const to = composeNmiLiveManagementLevels({
    map,
    selectedCanonicalId: "ctx-problem-capacity",
    previousSpatial: from.spatial,
  });
  const mid = sampleManagementLevelMotion(to.motion, 0.5);
  const surfaced = mid.participants.filter((item) => {
    const contextualRole = item.targetRole ?? item.sourceRole;
    return contextualRole === "PARENT" || contextualRole === "GRANDPARENT";
  });
  assert.equal(from.spatial.visibleLevelCount, 1);
  assert.equal(to.spatial.visibleLevelCount, 1);
  assert.equal(surfaced.length, 0);
});

test("FINAL 37–42. No per-frame hierarchy; wiring integrity; authority matrix", () => {
  const compose = readFileSync(join(HERE, "nmiLiveManagementLevelsCompose.ts"), "utf8");
  const shell = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  const mount = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraStageMount.tsx"), "utf8");
  const nav = readFileSync(join(HERE, "../../executive/nex-mvp/stage/NexoraManagementLevelContextNav.tsx"), "utf8");
  assert.match(compose, /composeNmiManagementLevelPath/);
  assert.doesNotMatch(nav, /composeNmiManagementLevelPath|composeNmiLiveUnifiedManagementModel/);
  assert.match(shell, /composeNmiLiveManagementLevels/);
  assert.match(shell, /hostNmiLiveManagementIntelligence/);
  assert.match(mount, /import \{ resolveNexoraLiveStageDthExpSpatial \}/);
  assert.match(mount, /managementLevelSpatial=\{managementLevelSpatial\}/);
  assert.doesNotMatch(shell + compose + nav, /levelHistory|drillStack|levelCards|ManagementLevelAdvisor|onLevelActorClick/);
  assert.equal(levels(PRODUCTION).path.ownsHierarchy, false);
  assert.equal(levels(PRODUCTION).path.ownsReferentTruth, false);
});
