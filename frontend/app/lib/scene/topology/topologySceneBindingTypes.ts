/**
 * Scene ↔ topology binding contracts (data-only bridge).
 */

import type { TopologyConnection, TopologyType } from "./topologyTypes.ts";

export type SceneTopologyBindingSource = "json" | "topology" | "fallback";

export interface SceneTopologyBinding {
  objectId: string;
  nodeId: string;
  originalPosition?: {
    x: number;
    y: number;
    z: number;
  };
  topologyPosition?: {
    x: number;
    y: number;
    z: number;
  };
  finalPosition?: {
    x: number;
    y: number;
    z: number;
  };
  source: SceneTopologyBindingSource;
}

export type SceneTopologyMode = "auto" | "flow" | "hub" | "off";

export type SceneTopologyBindingDiagnostics = {
  objectCount: number;
  bindingCount: number;
  missingPositionCount: number;
  fallbackCount: number;
  warnings: string[];
  idle?: boolean;
  reason?: "empty_scene" | string;
};

export type SceneTopologyBindingResult = {
  topologyEnabled: boolean;
  topologyType: TopologyType | "off";
  bindings: SceneTopologyBinding[];
  connections: TopologyConnection[];
  diagnostics: SceneTopologyBindingDiagnostics;
};

/** Default for Prompt 1 — binding computed but not applied to scene visuals. */
export const DEFAULT_SCENE_TOPOLOGY_MODE: SceneTopologyMode = "off";

/** Active runtime mode for Type-C scene positioning (Prompt 2). */
export const ACTIVE_SCENE_TOPOLOGY_MODE: SceneTopologyMode = "auto";
