/**
 * NPA-T MLEVEL:1 — resolve visible L1/L2/L3 from the active subject upward.
 * Parent walk uses declared NMI belongs_to only. No history stack. No invented parents.
 */

import type { ManagementMap, ManagementMapNode } from "./nmiManagementMapContract.ts";
import type { NmiCanonicalRef, NmiNodeKind } from "./nmiContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import {
  MANAGEMENT_LEVEL_DETAIL,
  MANAGEMENT_LEVEL_PRESENTATION_MODE,
  NMI_MANAGEMENT_LEVEL_PATH_CONTRACT,
  type ManagementLevelNavigationRequest,
  type ManagementLevelParentResolution,
  type ManagementLevelPath,
  type ManagementLevelRole,
  type ManagementLevelSubjectProjection,
} from "./nmiManagementLevelPathContract.ts";
import { nmiManagementLevelPathIdentity } from "./nmiManagementLevelPathIdentity.ts";

export type NmiManagementLevelPathComposeInput = {
  readonly selectedCanonicalId?: string | null;
  readonly map?: ManagementMap | null;
};

type ParentLookup = {
  readonly resolution: ManagementLevelParentResolution;
  readonly parentId: string | null;
};

function emptyPath(): ManagementLevelPath {
  return Object.freeze({
    identity: nmiManagementLevelPathIdentity,
    active: null,
    parent: null,
    grandparent: null,
    visibleDepth: 0,
    parentResolution: "ABSENT",
    grandparentResolution: "ABSENT",
    higherAncestryExists: false,
    higherAncestryExpanded: false,
    usesNavigationHistory: false,
    usesTrailAsHierarchy: false,
    usesInferredMoParentChild: false,
    usesUndirectedBranchAsPath: false,
    ownsHierarchy: false,
    ownsObjectTruth: false,
    ownsStageTruth: false,
    ownsReferentTruth: false,
    secondManagementGraph: false,
    secondNmi: false,
    secondStage: false,
    secondSceneAuthority: false,
    mutatesSelection: false,
    mutatesLocalLevelStack: false,
    inventsHierarchy: false,
    hardcodesGrandparentAsCompany: false,
    startsMlevel2: false,
  });
}

function lookupCanonical(map: ManagementMap | null, id: string): {
  readonly kind: NmiNodeKind | null;
  readonly displayIdentity: string | null;
} {
  const node: ManagementMapNode | undefined = map?.nodes.find((item) => item.nodeId === id);
  if (node) {
    return { kind: node.kind, displayIdentity: node.title ?? node.nodeId };
  }
  const modelRef: NmiCanonicalRef | undefined = map?.sourceModel.nodes.find((item) => item.id === id);
  if (modelRef) {
    return { kind: modelRef.kind, displayIdentity: modelRef.id };
  }
  const business = map?.sourceModel.businessProjectRef;
  if (business?.id === id) {
    return { kind: business.kind, displayIdentity: business.id };
  }
  return { kind: null, displayIdentity: id };
}

function uniqueBelongsToParents(
  relationships: readonly NmiManagementRelationship[],
  childId: string,
): readonly string[] {
  const parents: string[] = [];
  for (const rel of relationships) {
    if (rel.kind !== "belongs_to") continue;
    if (rel.fromId !== childId) continue;
    if (!parents.includes(rel.toId)) parents.push(rel.toId);
  }
  return Object.freeze(parents);
}

function resolveManagementParent(
  map: ManagementMap | null,
  childId: string,
  blockedIds: ReadonlySet<string>,
): ParentLookup {
  if (!map) {
    return { resolution: "ABSENT", parentId: null };
  }
  const parents = uniqueBelongsToParents(map.relationships, childId).filter((id) => !blockedIds.has(id));
  if (parents.length === 0) {
    return { resolution: "ABSENT", parentId: null };
  }
  if (parents.length > 1) {
    return { resolution: "AMBIGUOUS", parentId: null };
  }
  return { resolution: "CANONICAL", parentId: parents[0] ?? null };
}

function projectSubject(
  map: ManagementMap | null,
  canonicalId: string,
  role: ManagementLevelRole,
): ManagementLevelSubjectProjection {
  const lookedUp = lookupCanonical(map, canonicalId);
  return Object.freeze({
    canonicalId,
    kind: lookedUp.kind,
    displayIdentity: lookedUp.displayIdentity,
    role,
    detail: MANAGEMENT_LEVEL_DETAIL[role],
    presentationMode: MANAGEMENT_LEVEL_PRESENTATION_MODE[role],
    relationshipToActive: role === "ACTIVE" ? "SELF" : role === "PARENT" ? "PARENT" : "GRANDPARENT",
    relationshipToAdjacent:
      role === "ACTIVE" ? "SELF" : role === "PARENT" ? "PARENT_OF_ACTIVE" : "PARENT_OF_PARENT",
    clickable: true,
    interactive: true,
    copiesCanonicalObject: false,
  });
}

export function composeNmiManagementLevelPath(input: NmiManagementLevelPathComposeInput): ManagementLevelPath {
  const activeId = input.selectedCanonicalId?.trim() ?? "";
  if (!activeId) return emptyPath();

  const map = input.map ?? null;
  const active = projectSubject(map, activeId, "ACTIVE");
  const parentLookup = resolveManagementParent(map, activeId, new Set([activeId]));

  if (parentLookup.resolution !== "CANONICAL" || !parentLookup.parentId) {
    return Object.freeze({
      ...emptyPath(),
      active,
      visibleDepth: 1,
      parentResolution: parentLookup.resolution,
      grandparentResolution: "ABSENT",
    });
  }

  const parent = projectSubject(map, parentLookup.parentId, "PARENT");
  const grandparentLookup = resolveManagementParent(
    map,
    parentLookup.parentId,
    new Set([activeId, parentLookup.parentId]),
  );

  if (grandparentLookup.resolution !== "CANONICAL" || !grandparentLookup.parentId) {
    return Object.freeze({
      ...emptyPath(),
      active,
      parent,
      visibleDepth: 2,
      parentResolution: "CANONICAL",
      grandparentResolution: grandparentLookup.resolution,
    });
  }

  const greatLookup = resolveManagementParent(
    map,
    grandparentLookup.parentId,
    new Set([activeId, parentLookup.parentId, grandparentLookup.parentId]),
  );

  return Object.freeze({
    ...emptyPath(),
    active,
    parent,
    grandparent: projectSubject(map, grandparentLookup.parentId, "GRANDPARENT"),
    visibleDepth: 3,
    parentResolution: "CANONICAL",
    grandparentResolution: "CANONICAL",
    higherAncestryExists: greatLookup.resolution === "CANONICAL",
  });
}

export function requestManagementLevelNavigation(
  path: ManagementLevelPath,
  role: ManagementLevelRole,
): ManagementLevelNavigationRequest {
  const subject =
    role === "ACTIVE" ? path.active : role === "PARENT" ? path.parent : path.grandparent;
  if (!path.active) {
    return Object.freeze({
      kind: "NONE",
      reason: "NO_ACTIVE_PATH",
      mutatesLocalLevelStack: false,
    });
  }
  if (!subject) {
    return Object.freeze({
      kind: "NONE",
      reason: "LEVEL_ABSENT",
      mutatesLocalLevelStack: false,
    });
  }
  return Object.freeze({
    kind: "CANONICAL_NAVIGATION",
    canonicalId: subject.canonicalId,
    sourceRole: role,
    mutatesLocalLevelStack: false,
    restoresSnapshot: false,
    synthesizesObject: false,
  });
}

export function navigateAndRecomposeManagementLevelPath(
  map: ManagementMap | null,
  path: ManagementLevelPath,
  role: ManagementLevelRole,
): ManagementLevelPath {
  const request = requestManagementLevelNavigation(path, role);
  if (request.kind !== "CANONICAL_NAVIGATION") return path;
  return composeNmiManagementLevelPath({
    selectedCanonicalId: request.canonicalId,
    map,
  });
}

export { NMI_MANAGEMENT_LEVEL_PATH_CONTRACT };
