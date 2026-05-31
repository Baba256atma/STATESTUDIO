import { resolveExecutiveIconSurface } from "../../hud/visual/executiveIconSurfaceRuntime";
import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";
import { logExecutiveIconRegistry } from "./executiveHarmonizationInstrumentation";

export type ExecutiveIconKind =
  | "status"
  | "risk"
  | "relationship"
  | "timeline"
  | "decision"
  | "layer"
  | "control"
  | "navigation"
  | "assistant";

export type ExecutiveIconDescriptor = {
  id: string;
  kind: ExecutiveIconKind;
  glyph: string;
  label: string;
  title: string;
  weight: "light" | "regular" | "emphasis";
};

const UNIFIED_ICON_REGISTRY: Record<string, ExecutiveIconDescriptor> = {
  status_healthy: { id: "status_healthy", kind: "status", glyph: "●", label: "Healthy", title: "Healthy status", weight: "regular" },
  status_warning: { id: "status_warning", kind: "status", glyph: "◐", label: "Warning", title: "Warning status", weight: "regular" },
  status_critical: { id: "status_critical", kind: "status", glyph: "◉", label: "Critical", title: "Critical status", weight: "emphasis" },
  status_active: { id: "status_active", kind: "status", glyph: "◆", label: "Active", title: "Active", weight: "regular" },
  status_inactive: { id: "status_inactive", kind: "status", glyph: "◇", label: "Inactive", title: "Inactive", weight: "light" },
  status_monitoring: { id: "status_monitoring", kind: "status", glyph: "◔", label: "Monitoring", title: "Monitoring", weight: "regular" },
  risk_elevated: { id: "risk_elevated", kind: "risk", glyph: "▲", label: "Elevated Risk", title: "Elevated risk", weight: "emphasis" },
  risk_moderate: { id: "risk_moderate", kind: "risk", glyph: "△", label: "Moderate Risk", title: "Moderate risk", weight: "regular" },
  relationship_dependency: { id: "relationship_dependency", kind: "relationship", glyph: "⟷", label: "Dependency", title: "Dependency relationship", weight: "regular" },
  timeline_event: { id: "timeline_event", kind: "timeline", glyph: "◈", label: "Event", title: "Timeline event", weight: "regular" },
  decision_recommended: { id: "decision_recommended", kind: "decision", glyph: "◎", label: "Recommended", title: "Recommended decision", weight: "emphasis" },
  control_analyze: { id: "control_analyze", kind: "control", glyph: "⌕", label: "Analyze", title: "Analyze", weight: "regular" },
  control_simulate: { id: "control_simulate", kind: "control", glyph: "⏵", label: "Simulate", title: "Simulate", weight: "regular" },
  control_compare: { id: "control_compare", kind: "control", glyph: "⇄", label: "Compare", title: "Compare scenarios", weight: "regular" },
  navigation_focus: { id: "navigation_focus", kind: "navigation", glyph: "◎", label: "Focus", title: "Focus object", weight: "regular" },
  assistant_prompt: { id: "assistant_prompt", kind: "assistant", glyph: "✦", label: "Assistant", title: "Executive assistant", weight: "regular" },
  layer_suppliers: { id: "layer_suppliers", kind: "layer", glyph: "⬡", label: "Suppliers", title: "Suppliers layer", weight: "regular" },
  layer_facilities: { id: "layer_facilities", kind: "layer", glyph: "▣", label: "Facilities", title: "Facilities layer", weight: "regular" },
  layer_inventory: { id: "layer_inventory", kind: "layer", glyph: "▤", label: "Inventory", title: "Inventory layer", weight: "regular" },
};

/** E2:49 Part 6 — unified unicode icon language (single visual family). */
export function resolveExecutiveIcon(id: string): ExecutiveIconDescriptor | null {
  const direct = UNIFIED_ICON_REGISTRY[id];
  if (direct) {
    logExecutiveIconRegistry("resolved", { id, kind: direct.kind });
    return direct;
  }
  const legacy = resolveExecutiveIconSurface(id);
  if (!legacy) return null;
  const mapped: ExecutiveIconDescriptor = {
    id,
    kind: legacy.kind,
    glyph: legacy.icon,
    label: legacy.label,
    title: legacy.title,
    weight: legacy.kind === "risk" || legacy.kind === "decision" ? "emphasis" : "regular",
  };
  logExecutiveIconRegistry("legacy_bridge", { id, kind: mapped.kind });
  return mapped;
}

export function resolveExecutiveIconForSurface(
  surface: SceneHudThemeSurfaceId,
  key: string
): ExecutiveIconDescriptor | null {
  return resolveExecutiveIcon(`${surface}_${key}`) ?? resolveExecutiveIcon(key);
}

export function resolveExecutiveIconGlyph(id: string, fallback = "•"): string {
  return resolveExecutiveIcon(id)?.glyph ?? fallback;
}
