/**
 * NPA-T MLEVEL:3 — adapt level clicks into existing Stage/NMI selection.
 * Does not mutate a level stack. Hover/focus/disclosure never navigate.
 */

import {
  createInitialNexoraMVPObjectInteractionState,
  resolveNexoraMVPInteractionSubject,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { ManagementMap } from "./nmiManagementMapContract.ts";
import type { ManagementLevelPath, ManagementLevelRole } from "./nmiManagementLevelPathContract.ts";
import { composeNmiManagementLevelPath, requestManagementLevelNavigation } from "./nmiManagementLevelPathCompose.ts";
import type { ManagementLevelSpatialComposition } from "./nmiManagementLevelSpatialContract.ts";
import { composeNmiManagementLevelSpatial } from "./nmiManagementLevelSpatialCompose.ts";
import {
  NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT,
  type ManagementLevelActivationSurface,
  type ManagementLevelIntent,
  type ManagementLevelInteractionKind,
  type ManagementLevelInteractionRequest,
} from "./nmiManagementLevelInteractionContract.ts";
import { nmiManagementLevelInteractionIdentity } from "./nmiManagementLevelInteractionIdentity.ts";

export type ClassifyManagementLevelInteractionInput = {
  readonly path: ManagementLevelPath;
  readonly map?: ManagementMap | null;
  readonly kind: ManagementLevelInteractionKind;
  readonly surface?: ManagementLevelActivationSurface | null;
  readonly sourceCanonicalId?: string | null;
  readonly targetCanonicalId?: string | null;
  readonly sourceLevel?: ManagementLevelRole | null;
  readonly inferredMoParentId?: string | null;
  readonly trailObjectIds?: readonly string[] | null;
  readonly sceneGraphParentId?: string | null;
};

export type ApplyManagementLevelInteractionInput = {
  readonly request: ManagementLevelInteractionRequest;
  readonly path: ManagementLevelPath;
  readonly map?: ManagementMap | null;
  readonly interactionState: NexoraMVPObjectInteractionState;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
};

export type ManagementLevelInteractionResult = {
  readonly request: ManagementLevelInteractionRequest;
  readonly navigationCommitted: boolean;
  readonly selectedCanonicalId: string | null;
  readonly nextInteractionState: NexoraMVPObjectInteractionState;
  readonly nextPath: ManagementLevelPath;
  readonly nextSpatial: ManagementLevelSpatialComposition;
  readonly previousPath: ManagementLevelPath;
  readonly previousSpatial: ManagementLevelSpatialComposition;
  readonly mutatesLocalLevelStack: false;
  readonly interpolationImplemented: false;
  readonly ownsReferentStore: false;
  readonly opensDetailWorkspace: false;
};

function emptyRequest(
  input: ClassifyManagementLevelInteractionInput,
  intent: ManagementLevelIntent = "NONE",
): ManagementLevelInteractionRequest {
  return Object.freeze({
    identity: nmiManagementLevelInteractionIdentity,
    kind: input.kind,
    surface: input.surface ?? null,
    sourceCanonicalId: input.sourceCanonicalId ?? input.path.active?.canonicalId ?? null,
    targetCanonicalId: input.targetCanonicalId ?? null,
    sourceLevel: input.sourceLevel ?? null,
    intent,
    navigation: "NONE",
    opensDetailWorkspace: false,
    mutatesLocalLevelStack: false,
    restoresSnapshot: false,
    synthesizesObject: false,
    usesTrailAsHierarchy: false,
    usesInferredMoParentChild: false,
    usesSceneGraphParentId: false,
  });
}

function navigationRequest(
  input: ClassifyManagementLevelInteractionInput,
  intent: Exclude<ManagementLevelIntent, "NONE">,
  targetCanonicalId: string,
  sourceLevel: ManagementLevelRole | null,
): ManagementLevelInteractionRequest {
  return Object.freeze({
    ...emptyRequest(input, intent),
    targetCanonicalId,
    sourceLevel,
    intent,
    navigation: "CANONICAL_NAVIGATION",
  });
}

function belongsToParent(
  map: ManagementMap | null | undefined,
  childId: string,
  parentId: string,
): boolean {
  if (!map) return false;
  const parents = map.relationships
    .filter((rel) => rel.kind === "belongs_to" && rel.fromId === childId)
    .map((rel) => rel.toId)
    .filter((id, index, all) => all.indexOf(id) === index);
  if (parents.length !== 1) return false;
  return parents[0] === parentId;
}

export function classifyManagementLevelInteraction(
  input: ClassifyManagementLevelInteractionInput,
): ManagementLevelInteractionRequest {
  void input.inferredMoParentId;
  void input.trailObjectIds;
  void input.sceneGraphParentId;

  if (input.kind !== "ACTIVATE") {
    return emptyRequest(input);
  }

  const activeId = input.path.active?.canonicalId ?? null;
  const targetId = input.targetCanonicalId?.trim() || null;
  const sourceLevel = input.sourceLevel ?? null;

  if (sourceLevel === "PARENT" || sourceLevel === "GRANDPARENT") {
    const ancestorRequest = requestManagementLevelNavigation(input.path, sourceLevel);
    if (ancestorRequest.kind !== "CANONICAL_NAVIGATION") {
      return emptyRequest(input);
    }
    if (targetId && targetId !== ancestorRequest.canonicalId) {
      return emptyRequest(input);
    }
    return navigationRequest(input, "DRILL_UP", ancestorRequest.canonicalId, sourceLevel);
  }

  if (!targetId || !activeId) {
    return emptyRequest(input, "ACTIVATE");
  }

  if (belongsToParent(input.map, targetId, activeId)) {
    return navigationRequest(input, "DRILL_DOWN", targetId, "ACTIVE");
  }

  return navigationRequest(input, "ACTIVATE", targetId, sourceLevel ?? "ACTIVE");
}

export function applyManagementLevelInteraction(
  input: ApplyManagementLevelInteractionInput,
): ManagementLevelInteractionResult {
  const previousSpatial = composeNmiManagementLevelSpatial({ path: input.path });
  const fail = (committed: boolean, state: NexoraMVPObjectInteractionState, selected: string | null) =>
    Object.freeze({
      request: input.request,
      navigationCommitted: committed,
      selectedCanonicalId: selected,
      nextInteractionState: state,
      nextPath: input.path,
      nextSpatial: previousSpatial,
      previousPath: input.path,
      previousSpatial,
      mutatesLocalLevelStack: false as const,
      interpolationImplemented: false as const,
      ownsReferentStore: false as const,
      opensDetailWorkspace: false as const,
    });

  if (input.request.navigation !== "CANONICAL_NAVIGATION" || !input.request.targetCanonicalId) {
    const current =
      input.interactionState.focusedSubject?.id ?? input.interactionState.selectedSubject?.id ?? null;
    return fail(false, input.interactionState, current);
  }

  const target = input.request.targetCanonicalId;
  const catalog = input.catalog;
  if (catalog && resolveNexoraMVPInteractionSubject(target, catalog) == null) {
    const current =
      input.interactionState.focusedSubject?.id ?? input.interactionState.selectedSubject?.id ?? null;
    return fail(false, input.interactionState, current);
  }

  const nextState = selectNexoraMVPInteractionSubject(input.interactionState, target, catalog);
  const selected =
    nextState.focusedSubject?.id ?? nextState.selectedSubject?.id ?? null;
  if (selected !== target) {
    const current =
      input.interactionState.focusedSubject?.id ?? input.interactionState.selectedSubject?.id ?? null;
    return fail(false, nextState, current);
  }

  const nextPath = composeNmiManagementLevelPath({
    selectedCanonicalId: selected,
    map: input.map ?? null,
  });
  const nextSpatial = composeNmiManagementLevelSpatial({ path: nextPath });

  return Object.freeze({
    request: input.request,
    navigationCommitted: true,
    selectedCanonicalId: selected,
    nextInteractionState: nextState,
    nextPath,
    nextSpatial,
    previousPath: input.path,
    previousSpatial,
    mutatesLocalLevelStack: false,
    interpolationImplemented: false,
    ownsReferentStore: false,
    opensDetailWorkspace: false,
  });
}

export function createManagementLevelInteractionState(
  workspace: "overview" = "overview",
): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

export { NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT };
