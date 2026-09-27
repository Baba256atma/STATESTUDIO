/**
 * NPA-T MLEVEL:1 — focused Management Level path tests.
 * Presentation only. Does not start MLEVEL:2 or mutate Stage/NMI authorities.
 */

import assert from "node:assert/strict";
import test from "node:test";

import type { NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { composeNmiStageProjection } from "./nmiStageProjectionCompose.ts";
import {
  NMI_MANAGEMENT_LEVEL_PATH_CONTRACT,
  composeNmiManagementLevelPath,
  navigateAndRecomposeManagementLevelPath,
  requestManagementLevelNavigation,
} from "./nmiManagementLevelPathCompose.ts";
import { nmiManagementLevelPathIdentity } from "./nmiManagementLevelPathIdentity.ts";

function ref(id: string, kind: NmiCanonicalRef["kind"], authority: string): NmiCanonicalRef {
  return { id, kind, authority, sourceRef: `src:${id}` };
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

const HIERARCHY_NODES = [
  ref("org:company", "BUSINESS_PROJECT", "BCA:1"),
  ref("proc:operations", "PROCESS", "BCA:4"),
  ref("proc:production", "PROCESS", "BCA:4"),
  ref("problem:capacity", "PROBLEM", "MO:1"),
  ref("problem:line-a", "PROBLEM", "MO:1"),
];

function hierarchyMap(
  extraRelationships: readonly NmiManagementRelationship[] = [],
  extraNodes: readonly NmiCanonicalRef[] = [],
) {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-mlevel-1",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:company", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [...HIERARCHY_NODES, ...extraNodes],
    relationships: [
      rel("rel:line-capacity", "problem:line-a", "problem:capacity"),
      rel("rel:capacity-production", "problem:capacity", "proc:production"),
      rel("rel:production-operations", "proc:production", "proc:operations"),
      rel("rel:operations-company", "proc:operations", "org:company"),
      ...extraRelationships,
    ],
  });
  return composeNmiManagementMap({
    mapId: "map-mlevel-1",
    model,
    annotations: [
      { id: "org:company", title: "Company" },
      { id: "proc:operations", title: "Operations" },
      { id: "proc:production", title: "Production" },
      { id: "problem:capacity", title: "Capacity" },
      { id: "problem:line-a", title: "Line A" },
    ],
  });
}

test("A. Active root only yields L1", () => {
  const map = hierarchyMap();
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "org:company",
    map,
  });
  assert.equal(path.visibleDepth, 1);
  assert.equal(path.active?.canonicalId, "org:company");
  assert.equal(path.active?.role, "ACTIVE");
  assert.equal(path.parent, null);
  assert.equal(path.grandparent, null);
  assert.equal(path.parentResolution, "ABSENT");
  assert.equal(path.grandparentResolution, "ABSENT");
});

test("B. Active child yields L1 child and L2 parent", () => {
  const map = hierarchyMap();
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "proc:operations",
    map,
  });
  assert.equal(path.visibleDepth, 2);
  assert.equal(path.active?.canonicalId, "proc:operations");
  assert.equal(path.parent?.canonicalId, "org:company");
  assert.equal(path.parent?.role, "PARENT");
  assert.equal(path.grandparent, null);
  assert.equal(path.parentResolution, "CANONICAL");
});

test("C. Three-level hierarchy yields L1/L2/L3", () => {
  const map = hierarchyMap();
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "proc:production",
    map,
  });
  assert.equal(path.visibleDepth, 3);
  assert.equal(path.active?.canonicalId, "proc:production");
  assert.equal(path.parent?.canonicalId, "proc:operations");
  assert.equal(path.grandparent?.canonicalId, "org:company");
  assert.equal(path.grandparent?.role, "GRANDPARENT");
  assert.equal(path.hardcodesGrandparentAsCompany, false);
});

test("D. Hierarchy deeper than three keeps only the nearest three", () => {
  const map = hierarchyMap();
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:capacity",
    map,
  });
  assert.equal(path.visibleDepth, 3);
  assert.equal(path.active?.canonicalId, "problem:capacity");
  assert.equal(path.parent?.canonicalId, "proc:production");
  assert.equal(path.grandparent?.canonicalId, "proc:operations");
  assert.equal(path.higherAncestryExists, true);
  assert.equal(path.higherAncestryExpanded, false);
  assert.notEqual(path.grandparent?.canonicalId, "org:company");
});

test("E. Navigate deeper recomputes ancestors from the new canonical child", () => {
  const map = hierarchyMap();
  const before = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:capacity",
    map,
  });
  const after = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:line-a",
    map,
  });
  assert.equal(before.active?.canonicalId, "problem:capacity");
  assert.equal(after.active?.canonicalId, "problem:line-a");
  assert.equal(after.parent?.canonicalId, "problem:capacity");
  assert.equal(after.grandparent?.canonicalId, "proc:production");
  assert.equal(after.mutatesLocalLevelStack, false);
});

test("F. Navigate upward through visible L2 uses canonical navigation then recomposes", () => {
  const map = hierarchyMap();
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:capacity",
    map,
  });
  const request = requestManagementLevelNavigation(path, "PARENT");
  assert.equal(request.kind, "CANONICAL_NAVIGATION");
  if (request.kind !== "CANONICAL_NAVIGATION") throw new Error("expected navigation");
  assert.equal(request.canonicalId, "proc:production");
  assert.equal(request.mutatesLocalLevelStack, false);
  assert.equal(request.restoresSnapshot, false);
  const recomposed = navigateAndRecomposeManagementLevelPath(map, path, "PARENT");
  assert.equal(recomposed.active?.canonicalId, "proc:production");
  assert.equal(recomposed.parent?.canonicalId, "proc:operations");
  assert.equal(recomposed.grandparent?.canonicalId, "org:company");
});

test("G. Navigate upward through visible L3 preserves canonical identity", () => {
  const map = hierarchyMap();
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:capacity",
    map,
  });
  const request = requestManagementLevelNavigation(path, "GRANDPARENT");
  assert.equal(request.kind, "CANONICAL_NAVIGATION");
  if (request.kind !== "CANONICAL_NAVIGATION") throw new Error("expected navigation");
  assert.equal(request.canonicalId, "proc:operations");
  const recomposed = navigateAndRecomposeManagementLevelPath(map, path, "GRANDPARENT");
  assert.equal(recomposed.active?.canonicalId, "proc:operations");
  assert.equal(recomposed.active?.kind, "PROCESS");
  assert.equal(recomposed.parent?.canonicalId, "org:company");
});

test("H. Missing or ambiguous parent does not fabricate L2/L3", () => {
  const isolated = composeNmiManagementMap({
    mapId: "map-isolated",
    model: composeNmiUnifiedManagementModel({
      modelId: "nmi-isolated",
      contextId: "bca:ctx:plant",
      contextKind: "BUSINESS",
      nodes: [ref("problem:orphan", "PROBLEM", "MO:1")],
      relationships: [rel("rel:depends", "problem:orphan", "proc:production", "depends_on")],
    }),
  });
  const missing = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:orphan",
    map: isolated,
  });
  assert.equal(missing.visibleDepth, 1);
  assert.equal(missing.parent, null);
  assert.equal(missing.grandparent, null);
  assert.equal(missing.parentResolution, "ABSENT");
  assert.equal(missing.inventsHierarchy, false);

  const ambiguousMap = composeNmiManagementMap({
    mapId: "map-ambiguous",
    model: composeNmiUnifiedManagementModel({
      modelId: "nmi-ambiguous",
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
  const ambiguous = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:shared",
    map: ambiguousMap,
  });
  assert.equal(ambiguous.visibleDepth, 1);
  assert.equal(ambiguous.parent, null);
  assert.equal(ambiguous.parentResolution, "AMBIGUOUS");
  assert.equal(ambiguous.inventsHierarchy, false);
});

test("I. Level projections preserve source canonical IDs and do not copy Objects", () => {
  const map = hierarchyMap();
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:capacity",
    map,
  });
  assert.equal(path.active?.canonicalId, "problem:capacity");
  assert.equal(path.parent?.canonicalId, "proc:production");
  assert.equal(path.grandparent?.canonicalId, "proc:operations");
  assert.equal(path.active?.copiesCanonicalObject, false);
  assert.equal(path.parent?.copiesCanonicalObject, false);
  assert.equal(path.grandparent?.copiesCanonicalObject, false);
  assert.equal(path.active?.kind, "PROBLEM");
  assert.equal(path.parent?.kind, "PROCESS");
});

test("J. Management Levels do not own hierarchy, Object, Stage, or referent truth", () => {
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.ownsHierarchy, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.ownsObjectTruth, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.ownsStageTruth, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.ownsReferentTruth, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.secondManagementGraph, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.secondNmi, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.secondStage, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.usesTrailAsHierarchy, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.usesInferredMoParentChild, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.usesUndirectedBranchAsPath, false);
  assert.equal(NMI_MANAGEMENT_LEVEL_PATH_CONTRACT.startsMlevel2, false);
  assert.equal(nmiManagementLevelPathIdentity, "NPA-T MLEVEL:1/ManagementLevelPath");
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:capacity",
    map: hierarchyMap(),
  });
  assert.equal(path.ownsHierarchy, false);
  assert.equal(path.ownsObjectTruth, false);
  assert.equal(path.ownsStageTruth, false);
  assert.equal(path.ownsReferentTruth, false);
});

test("K. Progressive detail is FULL / SUMMARY / ORIENTATION", () => {
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: "problem:capacity",
    map: hierarchyMap(),
  });
  assert.equal(path.active?.detail, "FULL");
  assert.equal(path.active?.presentationMode, "WORKING");
  assert.equal(path.parent?.detail, "SUMMARY");
  assert.equal(path.parent?.presentationMode, "CONTEXT");
  assert.equal(path.grandparent?.detail, "ORIENTATION");
  assert.equal(path.grandparent?.presentationMode, "MINIMAL");
});

test("L. Stage projection without Management Level context remains safe", () => {
  const empty = composeNmiManagementLevelPath({});
  assert.equal(empty.visibleDepth, 0);
  assert.equal(empty.active, null);
  assert.equal(empty.mutatesSelection, false);

  const map = hierarchyMap();
  const projection = composeNmiStageProjection({
    projectionId: "proj-mlevel-safe",
    selectedCanonicalId: "problem:capacity",
    source: "MANAGEMENT_MAP",
    map,
  });
  assert.equal(projection.selectedCanonicalId, "problem:capacity");
  assert.equal(projection.nmiWroteStage, false);
  assert.equal(projection.collectionOwnsReferent, false);
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: projection.selectedCanonicalId,
    map,
  });
  assert.equal(path.active?.canonicalId, projection.selectedCanonicalId);
  assert.notEqual(path.identity, projection.identity);
});
