import type {
  NexoraMVPAdvisorContextBridge,
  NexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

/** NPA-T ORG:5 — read-only projection of the final existing Stage bridge. */
export const sceneOrgRightContextContractIdentity =
  "NPA-T ORG:5/AdvisorFlexibleRightPanel" as const;

export type SceneOrgRightContextProjection = Readonly<{
  kind: "SUBJECT" | "COLLECTION" | "EMPTY";
  contextKey: string;
  canonicalId: string | null;
  label: string;
  collectionCategory: string | null;
  collectionObjectCount: number;
  source: "existing-stage-advisor-bridge";
}>;

function matchingSubject(
  canonicalId: string,
  candidates: readonly (Readonly<{ id: string; label?: string }> | null)[],
): Readonly<{ id: string; label?: string }> | null {
  return candidates.find((candidate) => candidate?.id === canonicalId) ?? null;
}

/**
 * The bridge already resolves Stage/referent precedence. ORG:5 only prevents
 * stale presentation by refusing to reuse subject props when the bridge has
 * moved to a collection or cleared context.
 */
export function projectSceneOrgRightContext(input: {
  readonly advisorBridge: NexoraMVPAdvisorContextBridge;
  readonly focusedSubject: NexoraMVPInteractionSubject | null;
  readonly selectedSubject: NexoraMVPInteractionSubject | null;
}): SceneOrgRightContextProjection {
  const bridge = input.advisorBridge;
  if (bridge.presentationMode === "collection") {
    const category = bridge.collectionCategory ?? "unknown";
    return Object.freeze({
      kind: "COLLECTION",
      contextKey: `collection:${category}`,
      canonicalId: null,
      label: bridge.advisorPresentationContext ?? "Current collection",
      collectionCategory: category,
      collectionObjectCount: bridge.collectionObjectCount ?? 0,
      source: "existing-stage-advisor-bridge",
    });
  }

  const canonicalId = bridge.advisorSubjectId;
  if (canonicalId != null) {
    const subject = matchingSubject(canonicalId, [
      input.focusedSubject,
      input.selectedSubject,
      bridge.focusedSubject,
      bridge.selectedSubject,
    ]);
    return Object.freeze({
      kind: "SUBJECT",
      contextKey: `subject:${canonicalId}`,
      canonicalId,
      label: subject?.label ?? canonicalId,
      collectionCategory: null,
      collectionObjectCount: 0,
      source: "existing-stage-advisor-bridge",
    });
  }

  return Object.freeze({
    kind: "EMPTY",
    contextKey: `empty:${bridge.activeWorkspace}:${bridge.presentationMode ?? "overview"}`,
    canonicalId: null,
    label: "No active contextual detail",
    collectionCategory: null,
    collectionObjectCount: 0,
    source: "existing-stage-advisor-bridge",
  });
}

export type SceneOrgRightPanelChromeState = Readonly<{
  width: number;
  collapsed: boolean;
}>;

export function createSceneOrgRightPanelChromeState(
  width = 320,
): SceneOrgRightPanelChromeState {
  return Object.freeze({ width, collapsed: false });
}

export function updateSceneOrgRightPanelChrome(
  current: SceneOrgRightPanelChromeState,
  update:
    | Readonly<{ kind: "RESIZE"; width: number }>
    | Readonly<{ kind: "TOGGLE_COLLAPSE" }>,
): SceneOrgRightPanelChromeState {
  return update.kind === "RESIZE"
    ? Object.freeze({ ...current, width: update.width })
    : Object.freeze({ ...current, collapsed: !current.collapsed });
}

export const SCENE_ORG_RIGHT_CONTEXT_AUTHORITY_GUARD = Object.freeze({
  consumesFinalStageBridge: true,
  advisorAuthority: "CC:5/NCA/NXA/ECA",
  createsContextAuthority: false,
  createsReferentSystem: false,
  createsAdvisor: false,
  ownsConversationState: false,
  mutatesStageState: false,
  panelChromeIsPresentationOnly: true,
});
