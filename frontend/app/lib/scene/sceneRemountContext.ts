/**
 * E2:68 — Dev context attached to object remount diagnostics.
 */

export type SceneRemountContext = {
  parentSignature: string;
  visibleObjectsSignature: string;
  selectedObjectId: string | null;
  viewMode: string | null;
  previousKey?: string;
  nextKey?: string;
};

let activeContext: SceneRemountContext = {
  parentSignature: "unknown",
  visibleObjectsSignature: "unknown",
  selectedObjectId: null,
  viewMode: null,
};

export function setSceneRemountContext(context: Partial<SceneRemountContext>): void {
  activeContext = { ...activeContext, ...context };
}

export function getSceneRemountContext(): Readonly<SceneRemountContext> {
  return activeContext;
}

export function resetSceneRemountContextForTests(): void {
  activeContext = {
    parentSignature: "unknown",
    visibleObjectsSignature: "unknown",
    selectedObjectId: null,
    viewMode: null,
  };
}
