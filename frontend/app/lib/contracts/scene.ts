export type LayoutMode = "floating" | "split" | "hybrid";

export type HUDTabKey =
  | "chat"
  | "decision"
  | "loops"
  | "objects"
  | "insights"
  | "settings"
  | "diagnostics";

export type SceneObjectId = string;

export type SceneObjectPatch = {
  id: SceneObjectId;
  // Visual patch fields (optional to allow partial updates)
  scale?: number;
  opacity?: number;
  color?: string; // any CSS-compatible color string
  position?: { x: number; y: number; z: number };
};

export type ScenePatch = {
  // bulk patch set
  objects?: SceneObjectPatch[];
};

export type SceneBackupV1 = {
  version: "v1";
  createdAt: number;
  // store what we actually backup in Nexora; keep flexible
  state: Record<string, unknown>;
};
