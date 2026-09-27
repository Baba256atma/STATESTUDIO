/**
 * NPA-T MLEVEL:3 — focused drill navigation tests A–AB.
 * Routes through selectNexoraMVPInteractionSubject. Does not start MLEVEL:4.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import { projectSceneOrgRightContext } from "@/app/lib/scene-org/sceneOrgRightContextContract.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { composeNmiManagementLevelPath } from "./nmiManagementLevelPathCompose.ts";
import { composeNmiManagementLevelSpatial } from "./nmiManagementLevelSpatialCompose.ts";
import {
  NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT,
  applyManagementLevelInteraction,
  classifyManagementLevelInteraction,
  createManagementLevelInteractionState,
} from "./nmiManagementLevelInteractionCompose.ts";
import { nmiManagementLevelInteractionIdentity } from "./nmiManagementLevelInteractionIdentity.ts";
import { NexoraManagementLevelContextNav } from "@/app/executive/nex-mvp/stage/NexoraManagementLevelContextNav.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPANY = "obj-revenue";
const OPERATIONS = "obj-delivery";
const PRODUCTION = "obj-inventory";
const CAPACITY = "obj-capacity";
const LINE = "obj-demand";

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

function hierarchyMap(
  extra: readonly NmiManagementRelationship[] = [],
) {
  return composeNmiManagementMap({
    mapId: "map-mlevel-3",
    model: composeNmiUnifiedManagementModel({
      modelId: "nmi-mlevel-3",
      contextId: "bca:ctx:plant",
      contextKind: "BUSINESS",
      businessProjectRef: ref(COMPANY, "BUSINESS_PROJECT"),
      nodes: [
        ref(COMPANY, "BUSINESS_PROJECT"),
        ref(OPERATIONS, "PROCESS"),
        ref(PRODUCTION, "PROCESS"),
        ref(CAPACITY, "PROBLEM"),
        ref(LINE, "PROBLEM"),
      ],
      relationships: [
        rel("rel:line-capacity", LINE, CAPACITY),
        rel("rel:capacity-production", CAPACITY, PRODUCTION),
        rel("rel:production-operations", PRODUCTION, OPERATIONS),
        rel("rel:operations-company", OPERATIONS, COMPANY),
        ...extra,
      ],
    }),
    annotations: [
      { id: COMPANY, title: "Company" },
      { id: OPERATIONS, title: "Operations" },
      { id: PRODUCTION, title: "Production" },
      { id: CAPACITY, title: "Capacity" },
      { id: LINE, title: "Line A" },
    ],
  });
}

function pathAt(id: string) {
  return composeNmiManagementLevelPath({
    selectedCanonicalId: id,
    map: hierarchyMap(),
  });
}

function stateAt(id: string) {
  return selectNexoraMVPInteractionSubject(createManagementLevelInteractionState(), id);
}

function activate(input: {
  readonly selectedId: string;
  readonly targetCanonicalId?: string | null;
  readonly sourceLevel?: "ACTIVE" | "PARENT" | "GRANDPARENT" | null;
  readonly kind?: "HOVER" | "FOCUS" | "DISCLOSURE" | "ACTIVATE";
  readonly surface?: "POINTER" | "KEYBOARD";
  readonly map?: ReturnType<typeof hierarchyMap>;
  readonly inferredMoParentId?: string | null;
  readonly trailObjectIds?: readonly string[] | null;
  readonly sceneGraphParentId?: string | null;
}) {
  const map = input.map ?? hierarchyMap();
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: input.selectedId,
    map,
  });
  const request = classifyManagementLevelInteraction({
    path,
    map,
    kind: input.kind ?? "ACTIVATE",
    surface: input.surface ?? "POINTER",
    sourceCanonicalId: input.selectedId,
    targetCanonicalId: input.targetCanonicalId,
    sourceLevel: input.sourceLevel,
    inferredMoParentId: input.inferredMoParentId,
    trailObjectIds: input.trailObjectIds,
    sceneGraphParentId: input.sceneGraphParentId,
  });
  return applyManagementLevelInteraction({
    request,
    path,
    map,
    interactionState: stateAt(input.selectedId),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
  });
}

function roles(result: ReturnType<typeof activate>) {
  return result.nextPath;
}

test("A. L2 activation creates canonical navigation request", () => {
  const request = classifyManagementLevelInteraction({
    path: pathAt(CAPACITY),
    map: hierarchyMap(),
    kind: "ACTIVATE",
    surface: "POINTER",
    sourceLevel: "PARENT",
    targetCanonicalId: PRODUCTION,
  });
  assert.equal(request.intent, "DRILL_UP");
  assert.equal(request.navigation, "CANONICAL_NAVIGATION");
  assert.equal(request.targetCanonicalId, PRODUCTION);
  assert.equal(request.mutatesLocalLevelStack, false);
});

test("B. L3 activation creates canonical navigation request", () => {
  const request = classifyManagementLevelInteraction({
    path: pathAt(CAPACITY),
    map: hierarchyMap(),
    kind: "ACTIVATE",
    surface: "KEYBOARD",
    sourceLevel: "GRANDPARENT",
    targetCanonicalId: OPERATIONS,
  });
  assert.equal(request.intent, "DRILL_UP");
  assert.equal(request.targetCanonicalId, OPERATIONS);
});

test("C. L1 child activation is DRILL_DOWN only from belongs_to", () => {
  const drill = classifyManagementLevelInteraction({
    path: pathAt(PRODUCTION),
    map: hierarchyMap(),
    kind: "ACTIVATE",
    targetCanonicalId: CAPACITY,
    sourceLevel: "ACTIVE",
  });
  assert.equal(drill.intent, "DRILL_DOWN");
  assert.equal(drill.targetCanonicalId, CAPACITY);
});

test("D. Drill-down changes canonical selected subject before recomposition", () => {
  const result = activate({ selectedId: PRODUCTION, targetCanonicalId: CAPACITY, sourceLevel: "ACTIVE" });
  assert.equal(result.navigationCommitted, true);
  assert.equal(result.selectedCanonicalId, CAPACITY);
  assert.equal(result.nextInteractionState.focusedSubject?.id, CAPACITY);
  assert.equal(result.nextPath.active?.canonicalId, result.selectedCanonicalId);
});

test("E. Drill-up changes canonical selected subject before recomposition", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "PARENT", targetCanonicalId: PRODUCTION });
  assert.equal(result.selectedCanonicalId, PRODUCTION);
  assert.equal(result.nextPath.active?.canonicalId, PRODUCTION);
});

test("F. Production L1 → Production L2 preserves canonical ID", () => {
  const before = pathAt(PRODUCTION);
  const after = activate({ selectedId: PRODUCTION, targetCanonicalId: CAPACITY, sourceLevel: "ACTIVE" });
  assert.equal(before.active?.canonicalId, PRODUCTION);
  assert.equal(after.nextPath.parent?.canonicalId, PRODUCTION);
});

test("G. L2 → L1 preserves canonical ID", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "PARENT" });
  assert.equal(result.nextPath.active?.canonicalId, PRODUCTION);
});

test("H. No local level-stack mutation exists", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "PARENT" });
  assert.equal(result.mutatesLocalLevelStack, false);
  assert.equal(result.request.mutatesLocalLevelStack, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT.ownsDrillStack, false);
});

test("I. Root produces no synthetic parent interaction", () => {
  const request = classifyManagementLevelInteraction({
    path: pathAt(COMPANY),
    map: hierarchyMap(),
    kind: "ACTIVATE",
    sourceLevel: "PARENT",
  });
  assert.equal(request.navigation, "NONE");
  assert.equal(request.intent, "NONE");
  const result = activate({ selectedId: COMPANY, sourceLevel: "PARENT" });
  assert.equal(result.navigationCommitted, false);
  assert.equal(result.nextPath.parent, null);
});

test("J. Deep hierarchy remains capped at L1/L2/L3", () => {
  const result = activate({ selectedId: PRODUCTION, targetCanonicalId: CAPACITY, sourceLevel: "ACTIVE" });
  assert.equal(result.nextSpatial.slots.length, 3);
  assert.equal(result.nextPath.active?.canonicalId, CAPACITY);
  assert.equal(result.nextPath.parent?.canonicalId, PRODUCTION);
  assert.equal(result.nextPath.grandparent?.canonicalId, OPERATIONS);
  assert.equal(result.nextSpatial.slots.some((slot) => slot.canonicalId === COMPANY), false);
});

test("K. Clicking L3 can expose previously hidden higher ancestry", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "GRANDPARENT" });
  assert.equal(result.nextPath.active?.canonicalId, OPERATIONS);
  assert.equal(result.nextPath.parent?.canonicalId, COMPANY);
  assert.equal(result.nextPath.grandparent, null);
});

test("L. Hover does not navigate", () => {
  const result = activate({
    selectedId: CAPACITY,
    sourceLevel: "PARENT",
    targetCanonicalId: PRODUCTION,
    kind: "HOVER",
  });
  assert.equal(result.request.navigation, "NONE");
  assert.equal(result.navigationCommitted, false);
  assert.equal(result.selectedCanonicalId, CAPACITY);
});

test("M. Focus does not automatically navigate", () => {
  const result = activate({
    selectedId: CAPACITY,
    sourceLevel: "PARENT",
    kind: "FOCUS",
  });
  assert.equal(result.navigationCommitted, false);
  assert.equal(result.nextPath.active?.canonicalId, CAPACITY);
});

test("N. Disclosure does not automatically navigate", () => {
  const result = activate({
    selectedId: CAPACITY,
    sourceLevel: "PARENT",
    kind: "DISCLOSURE",
  });
  assert.equal(result.navigationCommitted, false);
});

test("O. Pointer and keyboard activation resolve the same canonical target", () => {
  const pointer = activate({ selectedId: CAPACITY, sourceLevel: "PARENT", surface: "POINTER" });
  const keyboard = activate({ selectedId: CAPACITY, sourceLevel: "PARENT", surface: "KEYBOARD" });
  assert.equal(pointer.selectedCanonicalId, keyboard.selectedCanonicalId);
  assert.equal(pointer.selectedCanonicalId, PRODUCTION);
});

test("P. Ambiguous ancestry does not fabricate DRILL_UP", () => {
  const map = composeNmiManagementMap({
    mapId: "map-mlevel-3-ambiguous",
    model: composeNmiUnifiedManagementModel({
      modelId: "nmi-mlevel-3-ambiguous",
      contextId: "bca:ctx:plant",
      contextKind: "BUSINESS",
      nodes: [ref(CAPACITY, "PROBLEM"), ref(PRODUCTION, "PROCESS"), ref(OPERATIONS, "PROCESS")],
      relationships: [
        rel("rel:a", CAPACITY, PRODUCTION),
        rel("rel:b", CAPACITY, OPERATIONS),
      ],
    }),
  });
  const request = classifyManagementLevelInteraction({
    path: composeNmiManagementLevelPath({ selectedCanonicalId: CAPACITY, map }),
    map,
    kind: "ACTIVATE",
    sourceLevel: "PARENT",
    targetCanonicalId: PRODUCTION,
  });
  assert.equal(request.navigation, "NONE");
});

test("Q. Non-belongs_to relationship does not become DRILL_DOWN", () => {
  const map = hierarchyMap([rel("rel:depends", CAPACITY, PRODUCTION, "depends_on")]);
  const request = classifyManagementLevelInteraction({
    path: composeNmiManagementLevelPath({ selectedCanonicalId: OPERATIONS, map }),
    map,
    kind: "ACTIVATE",
    targetCanonicalId: COMPANY,
    sourceLevel: "ACTIVE",
  });
  assert.notEqual(request.intent, "DRILL_DOWN");
});

test("R. MO inferred parent does not become hierarchy navigation", () => {
  const request = classifyManagementLevelInteraction({
    path: pathAt(COMPANY),
    map: hierarchyMap(),
    kind: "ACTIVATE",
    sourceLevel: "PARENT",
    inferredMoParentId: OPERATIONS,
    targetCanonicalId: OPERATIONS,
  });
  assert.equal(request.usesInferredMoParentChild, false);
  assert.equal(request.navigation, "NONE");
});

test("S. STAGE-2D trail/history does not become hierarchy navigation", () => {
  const request = classifyManagementLevelInteraction({
    path: pathAt(COMPANY),
    map: hierarchyMap(),
    kind: "ACTIVATE",
    sourceLevel: "PARENT",
    trailObjectIds: [CAPACITY, PRODUCTION],
    targetCanonicalId: CAPACITY,
  });
  assert.equal(request.usesTrailAsHierarchy, false);
  assert.equal(request.navigation, "NONE");
});

test("T. Scene-graph parentId does not become hierarchy navigation", () => {
  const request = classifyManagementLevelInteraction({
    path: pathAt(COMPANY),
    map: hierarchyMap(),
    kind: "ACTIVATE",
    sourceLevel: "PARENT",
    sceneGraphParentId: OPERATIONS,
    targetCanonicalId: OPERATIONS,
  });
  assert.equal(request.usesSceneGraphParentId, false);
  assert.equal(request.navigation, "NONE");
});

test("U. Existing OVS management state is unchanged by level navigation", () => {
  const ovs = Object.freeze({ watch: true, critical: false, executiveState: "watch" });
  const before = JSON.stringify(ovs);
  activate({ selectedId: CAPACITY, sourceLevel: "PARENT" });
  assert.equal(JSON.stringify(ovs), before);
});

test("V. Existing Stage card authority is unchanged", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "PARENT" });
  assert.equal(result.nextSpatial.cardAuthority, SCENE_ORG_NORMAL_STAGE_CARD_RULE);
  assert.equal(result.nextSpatial.multipliesStageCardLimit, false);
});

test("W. Right Context follows existing canonical selection path", () => {
  const result = activate({ selectedId: PRODUCTION, targetCanonicalId: CAPACITY, sourceLevel: "ACTIVE" });
  const presentation = deriveNexoraMVPStageInteractionPresentation(result.nextInteractionState);
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(result.nextInteractionState, presentation);
  const right = projectSceneOrgRightContext({
    advisorBridge,
    focusedSubject: result.nextInteractionState.focusedSubject,
    selectedSubject: result.nextInteractionState.selectedSubject,
  });
  assert.equal(right.source, "existing-stage-advisor-bridge");
  assert.equal(right.canonicalId, CAPACITY);
  assert.equal(NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT.ownsRightContext, false);
});

test("X. Advisor/context receives the new canonical active subject", () => {
  const result = activate({ selectedId: PRODUCTION, targetCanonicalId: CAPACITY, sourceLevel: "ACTIVE" });
  const presentation = deriveNexoraMVPStageInteractionPresentation(result.nextInteractionState);
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(result.nextInteractionState, presentation);
  assert.equal(advisorBridge.advisorSubjectId, CAPACITY);
  assert.equal(advisorBridge.focusedSubject?.id, CAPACITY);
});

test("Y. No MLEVEL referent store is introduced", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "PARENT" });
  assert.equal(result.ownsReferentStore, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT.ownsReferentStore, false);
  assert.equal("levelReferent" in result, false);
});

test("Z. Spatial recomposition occurs from MLEVEL:1 → MLEVEL:2 after selection", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "PARENT" });
  const expected = composeNmiManagementLevelSpatial({ path: result.nextPath });
  assert.deepEqual(
    result.nextSpatial.slots.map((slot) => slot.canonicalId),
    expected.slots.map((slot) => slot.canonicalId),
  );
  assert.notEqual(result.nextSpatial, result.previousSpatial);
});

test("AA. Failed/stale target navigation does not partially shift level state", () => {
  const result = activate({
    selectedId: CAPACITY,
    sourceLevel: "ACTIVE",
    targetCanonicalId: "missing-canonical-id",
  });
  assert.equal(result.navigationCommitted, false);
  assert.equal(result.nextPath.active?.canonicalId, CAPACITY);
  assert.deepEqual(
    result.nextSpatial.slots.map((slot) => slot.canonicalId),
    result.previousSpatial.slots.map((slot) => slot.canonicalId),
  );
});

test("AB. No animation/interpolation implementation is introduced", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "PARENT" });
  assert.equal(result.interpolationImplemented, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT.interpolationImplemented, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT.startsMlevel4, false);
  for (const slot of result.nextSpatial.slots) {
    assert.equal(slot.interpolationImplemented, false);
    assert.deepEqual(slot.placement, slot.animationTarget);
  }
});

test("Journey A — Operations → Production", () => {
  const result = activate({ selectedId: OPERATIONS, targetCanonicalId: PRODUCTION, sourceLevel: "ACTIVE" });
  assert.equal(roles(result).active?.canonicalId, PRODUCTION);
  assert.equal(roles(result).parent?.canonicalId, OPERATIONS);
  assert.equal(roles(result).grandparent?.canonicalId, COMPANY);
});

test("Journey D — Capacity L3 Operations becomes L1", () => {
  const result = activate({ selectedId: CAPACITY, sourceLevel: "GRANDPARENT" });
  assert.equal(result.nextPath.active?.canonicalId, OPERATIONS);
  assert.equal(result.nextPath.parent?.canonicalId, COMPANY);
  assert.equal(result.nextPath.grandparent, null);
});

test("Live overlay wires ancestor clicks to onSelectSubject", () => {
  const composition = composeNmiManagementLevelSpatial({ path: pathAt(CAPACITY) });
  let received: string | null = null;
  const html = renderToStaticMarkup(
    React.createElement(NexoraManagementLevelContextNav, {
      composition,
      onSelectSubject: (id) => {
        received = id;
      },
    }),
  );
  assert.match(html, /data-testid="nexora-management-level-context-nav"/);
  assert.match(html, /data-canonical-id="obj-inventory"/);
  assert.match(html, /data-canonical-id="obj-delivery"/);
  assert.doesNotMatch(html, /level2-production/);
  assert.equal(received, null);
});

test("Shell routes MLEVEL ancestor activation through existing onSelectSubject", () => {
  const shell = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(shell, /composeNmiLiveManagementLevels/);
  assert.match(shell, /NexoraManagementLevelContextNav/);
  assert.match(shell, /onSelectSubject=\{onSelectSubject\}/);
  assert.match(shell, /selectNexoraMVPInteractionSubject/);
  assert.doesNotMatch(shell, /levelHistory/);
  assert.doesNotMatch(shell, /drillStack/);
  assert.equal(nmiManagementLevelInteractionIdentity, "NPA-T MLEVEL:3/ManagementLevelInteractionAdapter");
});
