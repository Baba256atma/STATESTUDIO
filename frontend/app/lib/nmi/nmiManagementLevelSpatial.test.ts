/**
 * NPA-T MLEVEL:2 — focused spatial placement tests A–T.
 * Presentation only. Does not start MLEVEL:3 or wire live DTH/OVS.
 */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import { EXECUTIVE_STAGE_2D_DEPTH } from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera.ts";
import type { NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { composeNmiManagementLevelPath } from "./nmiManagementLevelPathCompose.ts";
import {
  NMI_MANAGEMENT_LEVEL_SPATIAL_CONTRACT,
  composeNmiManagementLevelSpatial,
  renderNmiManagementLevelSpatialSvg,
} from "./nmiManagementLevelSpatialCompose.ts";
import { nmiManagementLevelSpatialIdentity } from "./nmiManagementLevelSpatialIdentity.ts";

function ref(id: string, kind: NmiCanonicalRef["kind"], authority: string): NmiCanonicalRef {
  return { id, kind, authority, sourceRef: `src:${id}` };
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

function hierarchyMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-mlevel-2",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:company", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("org:company", "BUSINESS_PROJECT", "BCA:1"),
      ref("proc:operations", "PROCESS", "BCA:4"),
      ref("proc:production", "PROCESS", "BCA:4"),
      ref("problem:capacity", "PROBLEM", "MO:1"),
    ],
    relationships: [
      rel("rel:capacity-production", "problem:capacity", "proc:production"),
      rel("rel:production-operations", "proc:production", "proc:operations"),
      rel("rel:operations-company", "proc:operations", "org:company"),
    ],
  });
  return composeNmiManagementMap({
    mapId: "map-mlevel-2",
    model,
    annotations: [
      { id: "org:company", title: "Company" },
      { id: "proc:operations", title: "Operations" },
      { id: "proc:production", title: "Production" },
      { id: "problem:capacity", title: "Capacity" },
    ],
  });
}

function pathFor(id: string) {
  return composeNmiManagementLevelPath({
    selectedCanonicalId: id,
    map: hierarchyMap(),
  });
}

function compositionFor(id: string, layoutMode?: "FULL" | "COMPRESSED" | "MINIMAL") {
  return composeNmiManagementLevelSpatial({
    path: pathFor(id),
    layoutMode,
  });
}

function slotBox(slot: {
  readonly placement: { readonly normalized: { readonly x: number; readonly y: number }; readonly width: number; readonly height: number };
}) {
  return {
    minX: slot.placement.normalized.x - slot.placement.width / 2,
    maxX: slot.placement.normalized.x + slot.placement.width / 2,
    minY: slot.placement.normalized.y - slot.placement.height / 2,
    maxY: slot.placement.normalized.y + slot.placement.height / 2,
  };
}

function overlaps(
  a: ReturnType<typeof slotBox>,
  b: ReturnType<typeof slotBox>,
): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY;
}

test("A. L1-only path produces one spatial slot", () => {
  const composition = compositionFor("org:company");
  assert.equal(composition.visibleLevelCount, 1);
  assert.equal(composition.slots.length, 1);
  assert.equal(composition.slots[0]?.role, "ACTIVE");
  assert.equal(composition.slots[0]?.canonicalId, "org:company");
  assert.equal(composition.placeholderSlots, 0);
});

test("B. L1/L2 produces two correctly ordered slots", () => {
  const composition = compositionFor("proc:operations");
  assert.equal(composition.slots.map((slot) => slot.role).join(","), "ACTIVE,PARENT");
  assert.equal(composition.slots[0]?.canonicalId, "proc:operations");
  assert.equal(composition.slots[1]?.canonicalId, "org:company");
  assert.ok((composition.slots[0]?.placement.normalized.y ?? 0) < (composition.slots[1]?.placement.normalized.y ?? 0));
});

test("C. L1/L2/L3 produces three correctly ordered slots", () => {
  const composition = compositionFor("proc:production");
  assert.equal(composition.slots.map((slot) => `${slot.role}:${slot.canonicalId}`).join(","), "ACTIVE:proc:production,PARENT:proc:operations,GRANDPARENT:org:company");
  const ys = composition.slots.map((slot) => slot.placement.normalized.y);
  assert.ok(ys[0]! < ys[1]! && ys[1]! < ys[2]!);
  assert.equal(overlaps(slotBox(composition.slots[0]!), slotBox(composition.slots[1]!)), false);
  assert.equal(overlaps(slotBox(composition.slots[1]!), slotBox(composition.slots[2]!)), false);
});

test("D. Hierarchy deeper than three never creates L4", () => {
  const composition = compositionFor("problem:capacity");
  assert.equal(composition.slots.length, 3);
  assert.equal(composition.slots.some((slot) => slot.canonicalId === "org:company"), false);
  assert.equal(composition.slots.map((slot) => slot.canonicalId).join(","), "problem:capacity,proc:production,proc:operations");
});

test("E. L1 receives FULL / WORKING / PRIMARY treatment", () => {
  const slot = compositionFor("proc:production").slots[0];
  assert.equal(slot?.detailMode, "FULL");
  assert.equal(slot?.presentationMode, "WORKING");
  assert.equal(slot?.interactionMode, "PRIMARY");
  assert.equal(slot?.scaleClass, "WORKING");
  assert.equal(slot?.stageCardEligible, true);
});

test("F. L2 receives SUMMARY / CONTEXT treatment", () => {
  const slot = compositionFor("proc:production").slots.find((item) => item.role === "PARENT");
  assert.equal(slot?.detailMode, "SUMMARY");
  assert.equal(slot?.presentationMode, "CONTEXT");
  assert.equal(slot?.interactionMode, "NAVIGABLE_CONTEXT");
  assert.equal(slot?.scaleClass, "CONTEXT");
  assert.equal(slot?.stageCardEligible, false);
  assert.equal(slot?.disabled, false);
});

test("G. L3 receives ORIENTATION / MINIMAL treatment", () => {
  const slot = compositionFor("proc:production").slots.find((item) => item.role === "GRANDPARENT");
  assert.equal(slot?.detailMode, "ORIENTATION");
  assert.equal(slot?.presentationMode, "MINIMAL");
  assert.equal(slot?.informationDensity, "MINIMAL");
  assert.equal(slot?.scaleClass, "ORIENTATION");
  assert.equal(slot?.stageCardEligible, false);
});

test("H. Spatial priority is strictly L1 > L2 > L3", () => {
  const composition = compositionFor("proc:production");
  const [l1, l2, l3] = composition.slots;
  assert.ok((l1?.spatialPriority ?? 0) > (l2?.spatialPriority ?? 0));
  assert.ok((l2?.spatialPriority ?? 0) > (l3?.spatialPriority ?? 0));
  assert.ok((l1?.scale ?? 0) > (l2?.scale ?? 0));
  assert.ok((l2?.scale ?? 0) > (l3?.scale ?? 0));
  assert.ok((l1?.placement.width ?? 0) > (l2?.placement.width ?? 0));
  assert.ok((l2?.placement.width ?? 0) > (l3?.placement.width ?? 0));
});

test("I. Missing levels produce no empty placeholder slots", () => {
  const one = compositionFor("org:company");
  const two = compositionFor("proc:operations");
  assert.equal(one.slots.length, 1);
  assert.equal(two.slots.length, 2);
  assert.equal(one.placeholderSlots, 0);
  assert.equal(two.placeholderSlots, 0);
  assert.equal(one.slots.some((slot) => slot.role === "PARENT" || slot.role === "GRANDPARENT"), false);
});

test("J. Spatial projection preserves canonical IDs", () => {
  const composition = compositionFor("proc:production");
  assert.deepEqual(
    composition.slots.map((slot) => slot.canonicalId),
    ["proc:production", "proc:operations", "org:company"],
  );
});

test("K. Spatial projection does not copy canonical Objects", () => {
  for (const slot of compositionFor("proc:production").slots) {
    assert.equal(slot.copiesCanonicalObject, false);
  }
});

test("L. Level depth does not modify OVS management state", () => {
  const ovsState = Object.freeze({ watch: true, critical: false, material: "watch-edge" });
  const before = JSON.stringify(ovsState);
  const composition = compositionFor("proc:production");
  assert.equal(JSON.stringify(ovsState), before);
  assert.equal(composition.ownsOvs, false);
  for (const slot of composition.slots) {
    assert.equal(slot.mutatesOvsManagementState, false);
    assert.equal(slot.mutatesOvsGeometry, false);
    assert.equal(slot.encodesLevelAsExecutiveState, false);
  }
});

test("M. Level depth does not modify selected/focused/Watch/Critical semantics", () => {
  const interaction = Object.freeze({ selected: "proc:production", focused: "proc:production", watch: ["kpi:otd"], critical: ["problem:capacity"] });
  const before = JSON.stringify(interaction);
  const composition = compositionFor("proc:production");
  assert.equal(JSON.stringify(interaction), before);
  for (const slot of composition.slots) {
    assert.equal(slot.mutatesSelectionFocusWatchCritical, false);
    assert.equal(slot.disabled, false);
  }
});

test("N. Stage card authority remains one Stage-wide 0–3 rule", () => {
  const composition = compositionFor("proc:production");
  assert.equal(composition.cardAuthority, SCENE_ORG_NORMAL_STAGE_CARD_RULE);
  assert.equal(composition.cardAuthority.maximum, 3);
  assert.equal(composition.multipliesStageCardLimit, false);
  assert.equal(composition.levelCards, false);
  assert.equal(composition.slots.filter((slot) => slot.stageCardEligible).length, 1);
});

test("O. Spatial projection does not independently resolve hierarchy", () => {
  assert.equal(NMI_MANAGEMENT_LEVEL_SPATIAL_CONTRACT.resolvesHierarchy, false);
  const path = pathFor("proc:production");
  const composition = composeNmiManagementLevelSpatial({ path });
  assert.equal(composition.resolvesHierarchy, false);
  assert.equal(composition.slots.length, path.visibleDepth);
});

test("P. Ambiguous ancestry does not create fabricated placement", () => {
  const map = composeNmiManagementMap({
    mapId: "map-mlevel-2-ambiguous",
    model: composeNmiUnifiedManagementModel({
      modelId: "nmi-mlevel-2-ambiguous",
      contextId: "bca:ctx:plant",
      contextKind: "BUSINESS",
      nodes: [
        ref("problem:shared", "PROBLEM", "MO:1"),
        ref("proc:a", "PROCESS", "BCA:4"),
        ref("proc:b", "PROCESS", "BCA:4"),
      ],
      relationships: [
        rel("rel:a", "problem:shared", "proc:a"),
        rel("rel:b", "problem:shared", "proc:b"),
      ],
    }),
  });
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:shared",
    map,
  });
  assert.equal(path.parentResolution, "AMBIGUOUS");
  const composition = composeNmiManagementLevelSpatial({ path });
  assert.equal(composition.slots.length, 1);
  assert.equal(composition.slots[0]?.canonicalId, "problem:shared");
  assert.equal(composition.placeholderSlots, 0);
});

test("Q. Compressed mode preserves level order and L1 dominance", () => {
  const composition = compositionFor("proc:production", "COMPRESSED");
  assert.equal(composition.layoutMode, "COMPRESSED");
  assert.equal(composition.slots.map((slot) => slot.role).join(","), "ACTIVE,PARENT,GRANDPARENT");
  assert.ok(composition.slots[0]!.scale > composition.slots[1]!.scale);
  assert.ok(composition.slots[1]!.scale > composition.slots[2]!.scale);
  assert.ok(composition.slots[0]!.placement.normalized.y < composition.slots[1]!.placement.normalized.y);
  assert.ok(composition.slots[1]!.placement.normalized.y < composition.slots[2]!.placement.normalized.y);
  assert.equal(overlaps(slotBox(composition.slots[0]!), slotBox(composition.slots[1]!)), false);
});

test("R. Static placement exposes deterministic interpolation endpoints", () => {
  const a = compositionFor("proc:production");
  const b = compositionFor("proc:production");
  assert.deepEqual(a.slots.map((slot) => slot.placement), b.slots.map((slot) => slot.placement));
  for (const slot of a.slots) {
    assert.deepEqual(slot.placement, slot.animationTarget);
    assert.equal(slot.interpolationImplemented, false);
    assert.equal(slot.placement.world.z, EXECUTIVE_STAGE_2D_DEPTH);
    assert.equal(slot.placement.plane, "xy");
  }
});

test("S. No second Stage, scene graph, canvas, or Director", () => {
  const composition = compositionFor("proc:production");
  assert.equal(composition.secondStage, false);
  assert.equal(composition.secondSceneGraph, false);
  assert.equal(composition.secondCanvas, false);
  assert.equal(composition.secondDirector, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_SPATIAL_CONTRACT.secondStage, false);
  assert.equal(nmiManagementLevelSpatialIdentity, "NPA-T MLEVEL:2/ManagementLevelSpatialPlacement");
  assert.equal(composition.usesZForHierarchy, false);
  assert.equal(composition.physicalZ, 0);
});

test("T. Existing Stage behavior remains valid when ManagementLevelPath is absent", () => {
  const composition = composeNmiManagementLevelSpatial({});
  assert.equal(composition.visibleLevelCount, 0);
  assert.equal(composition.slots.length, 0);
  assert.equal(composition.ownsStageTruth, false);
  assert.equal(composition.cardAuthority.maximum, 3);
});

test("Case E — same canonical subject can occupy L1 then L2 without duplication", () => {
  const asActive = compositionFor("proc:production");
  const asParent = compositionFor("problem:capacity");
  const first = asActive.slots.find((slot) => slot.canonicalId === "proc:production");
  const second = asParent.slots.find((slot) => slot.canonicalId === "proc:production");
  assert.equal(first?.role, "ACTIVE");
  assert.equal(second?.role, "PARENT");
  assert.equal(first?.copiesCanonicalObject, false);
  assert.equal(second?.copiesCanonicalObject, false);
  assert.equal(asParent.slots.filter((slot) => slot.canonicalId === "proc:production").length, 1);
});

test("visual sanity SVG is generated without live Stage integration", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const out = join(here, "../../../artifacts/mlevel/MLEVEL-2");
  mkdirSync(out, { recursive: true });
  const cases = [
    ["l1-only", compositionFor("org:company")],
    ["l1-l2", compositionFor("proc:operations")],
    ["l1-l2-l3", compositionFor("proc:production")],
  ] as const;
  for (const [name, composition] of cases) {
    const svg = renderNmiManagementLevelSpatialSvg(composition);
    writeFileSync(join(out, `${name}.svg`), svg);
    assert.match(svg, /<svg /);
    assert.match(svg, /ACTIVE|FULL/);
  }
});
