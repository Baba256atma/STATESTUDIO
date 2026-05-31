import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";

export type ExecutiveIconSurfaceKind =
  | "status"
  | "risk"
  | "relationship"
  | "timeline"
  | "decision"
  | "layer"
  | "control";

export type ExecutiveIconSurfaceDescriptor = {
  kind: ExecutiveIconSurfaceKind;
  icon: string;
  label: string;
  title: string;
};

const ICON_REGISTRY: Record<string, ExecutiveIconSurfaceDescriptor> = {
  status_stable: { kind: "status", icon: "●", label: "Stable", title: "Stable status" },
  status_elevated: { kind: "status", icon: "◐", label: "Elevated", title: "Elevated status" },
  status_critical: { kind: "risk", icon: "◉", label: "Critical", title: "Critical risk" },
  risk_high: { kind: "risk", icon: "▲", label: "High Risk", title: "High risk signal" },
  risk_moderate: { kind: "risk", icon: "△", label: "Moderate", title: "Moderate risk" },
  relationship_link: { kind: "relationship", icon: "⟷", label: "Link", title: "Relationship" },
  timeline_active: { kind: "timeline", icon: "◆", label: "Active", title: "Active timeline event" },
  timeline_pending: { kind: "timeline", icon: "◇", label: "Pending", title: "Pending timeline event" },
  timeline_completed: { kind: "timeline", icon: "◈", label: "Done", title: "Completed timeline event" },
  decision_pending: { kind: "decision", icon: "◎", label: "Pending", title: "Decision pending" },
  decision_recommended: { kind: "decision", icon: "◉", label: "Recommended", title: "Decision recommended" },
  layer_suppliers: { kind: "layer", icon: "⬡", label: "Suppliers", title: "Suppliers layer" },
  layer_facilities: { kind: "layer", icon: "▣", label: "Facilities", title: "Facilities layer" },
  layer_inventory: { kind: "layer", icon: "▤", label: "Inventory", title: "Inventory layer" },
  control_replay: { kind: "control", icon: "↺", label: "Replay", title: "Replay timeline" },
  control_snapshot: { kind: "control", icon: "◫", label: "Snapshot", title: "Capture snapshot" },
};

export function resolveExecutiveIconSurface(id: string): ExecutiveIconSurfaceDescriptor | null {
  return ICON_REGISTRY[id] ?? null;
}

export function resolveExecutiveIconForSurface(
  surface: SceneHudThemeSurfaceId,
  key: string
): ExecutiveIconSurfaceDescriptor | null {
  return resolveExecutiveIconSurface(`${surface}_${key}`) ?? resolveExecutiveIconSurface(key);
}
