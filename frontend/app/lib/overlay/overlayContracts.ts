/** E2:23 — Canonical scene overlay contract (interpretation layer, non-destructive). */

export type SceneOverlayType = "propagation" | "risk_flow" | "scenario" | "dependency";

export interface SceneOverlay {
  id: string;
  type: SceneOverlayType;
  sourceIds: string[];
  targetIds: string[];
  severity?: number;
  visible: boolean;
  metadata?: Record<string, unknown>;
}

export type OverlayVisibilityKey = SceneOverlayType;

export type OverlayLayerPriority = Record<SceneOverlayType, number>;

export const OVERLAY_LAYER_PRIORITY: OverlayLayerPriority = {
  dependency: 1,
  propagation: 2,
  risk_flow: 3,
  scenario: 4,
};

export type OverlayEdge = {
  from: string;
  to: string;
  strength: number;
  depth?: number;
};

export type OverlayRuntimeVisibility = Record<OverlayVisibilityKey, boolean>;

export const DEFAULT_OVERLAY_VISIBILITY: OverlayRuntimeVisibility = {
  propagation: true,
  risk_flow: true,
  scenario: true,
  dependency: false,
};

export type OverlayActivationReason =
  | "propagation_bridge"
  | "simulation_payload"
  | "scenario_action"
  | "object_selection"
  | "dependency_graph"
  | "manual"
  | "runtime";

export type RegisteredOverlayDefinition = {
  type: SceneOverlayType;
  label: string;
  description: string;
  defaultVisible: boolean;
  priority: number;
};
