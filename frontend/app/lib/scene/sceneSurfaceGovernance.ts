"use client";

export type SceneSurfaceType =
  | "SYSTEM_INFO"
  | "OBJECT_INFO"
  | "TIMELINE"
  | "OVERLAY"
  | "ASSISTANT"
  | "TOOL"
  | "TRAINING"
  | "DEBUG";

export type SceneControlOwnership = {
  controlId: string;
  singleOwner: string;
  removedOwners?: readonly string[];
};

export type SceneSurfaceClassification = {
  panelId: string;
  surfaceType: SceneSurfaceType;
  owner: string;
  allowedInOperationalScene: boolean;
};

export const OPERATIONAL_SCENE_SURFACE_TYPES: ReadonlySet<SceneSurfaceType> =
  new Set(["SYSTEM_INFO", "OBJECT_INFO", "TIMELINE", "OVERLAY"]);

export const sceneControlOwnershipMap: readonly SceneControlOwnership[] = Object.freeze([
  {
    controlId: "globalView",
    singleOwner: "Scene Toolbar",
    removedOwners: ["Scene Info"],
  },
  {
    controlId: "pilotRunbook",
    singleOwner: "Tools / Help",
    removedOwners: ["Operational Scene"],
  },
  {
    controlId: "sandbox",
    singleOwner: "Tools",
    removedOwners: ["Operational Scene"],
  },
  {
    controlId: "executiveSituationalAwareness",
    singleOwner: "Object Info / AI Assistant Context",
    removedOwners: ["Operational Scene"],
  },
]);

const KNOWN_SURFACE_TYPES: Record<string, SceneSurfaceType> = {
  sceneInfo: "SYSTEM_INFO",
  objectInfo: "OBJECT_INFO",
  timeline: "TIMELINE",
  bottomWorkspace: "TIMELINE",
  quickActions: "OVERLAY",
  executiveStatus: "SYSTEM_INFO",
  sceneToolbar: "OVERLAY",
  propagationOverlay: "OVERLAY",
  relationshipOverlay: "OVERLAY",
  aiAssistant: "ASSISTANT",
  sandbox: "TOOL",
  pilotRunbook: "TRAINING",
  diagnostics: "DEBUG",
};

const loggedSceneCleanupKeys = new Set<string>();

function logSceneGovernanceOnce(label: string, key: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const dedupeKey = `${label}:${key}`;
  if (loggedSceneCleanupKeys.has(dedupeKey)) return;
  loggedSceneCleanupKeys.add(dedupeKey);
  globalThis.console?.info?.(label, payload);
}

export function classifySceneSurface(panelId: string, owner = panelId): SceneSurfaceClassification {
  const surfaceType = KNOWN_SURFACE_TYPES[panelId] ?? "OVERLAY";
  const allowedInOperationalScene = OPERATIONAL_SCENE_SURFACE_TYPES.has(surfaceType);

  logSceneGovernanceOnce("[Nexora][SurfaceClassification]", panelId, {
    panelId,
    surfaceType,
    owner,
    allowedInOperationalScene,
  });

  return {
    panelId,
    surfaceType,
    owner,
    allowedInOperationalScene,
  };
}

export function isSceneSurfaceAllowedInOperationalWorkspace(surfaceType: SceneSurfaceType): boolean {
  return OPERATIONAL_SCENE_SURFACE_TYPES.has(surfaceType);
}

export function logScenePanelRemoved(input: {
  panelId: string;
  surfaceType: SceneSurfaceType;
  movedTo: string;
  reason: string;
}): void {
  logSceneGovernanceOnce("[Nexora][PanelRemoved]", input.panelId, input);
}

export function logSceneCleanup(input: {
  panelCount: number;
  restrictedPanelCount: number;
  duplicateControlCount: number;
}): void {
  logSceneGovernanceOnce("[Nexora][SceneCleanup]", "scene-cleanup", input);
}
