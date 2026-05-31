import type React from "react";

import type { HudEdgeIntegrationSnapshot, SceneHudEdgeAnchor } from "./sceneNativeHudVisualTypes";
import { logHudEdgeIntegration } from "./sceneNativeHudVisualInstrumentation";

const EDGE_PROFILES: Record<
  SceneHudEdgeAnchor,
  Omit<HudEdgeIntegrationSnapshot, "anchor">
> = {
  TOP_LEFT: { edgeInsetPx: 10, edgeFade: true, structuralAttachment: true, safeZonePaddingPx: 8 },
  TOP_RIGHT: { edgeInsetPx: 10, edgeFade: true, structuralAttachment: true, safeZonePaddingPx: 8 },
  BOTTOM_CENTER: { edgeInsetPx: 8, edgeFade: false, structuralAttachment: true, safeZonePaddingPx: 10 },
  BOTTOM_LEFT: { edgeInsetPx: 10, edgeFade: true, structuralAttachment: true, safeZonePaddingPx: 8 },
  BOTTOM_RIGHT: { edgeInsetPx: 10, edgeFade: true, structuralAttachment: true, safeZonePaddingPx: 8 },
  CENTER_FLOATING: { edgeInsetPx: 12, edgeFade: false, structuralAttachment: false, safeZonePaddingPx: 12 },
};

export function resolveHudEdgeIntegration(anchor: SceneHudEdgeAnchor): HudEdgeIntegrationSnapshot {
  const snapshot = { anchor, ...EDGE_PROFILES[anchor] };
  logHudEdgeIntegration(snapshot as unknown as Record<string, unknown>);
  return snapshot;
}

/** Apply structural edge attachment cues so panels feel anchored to workspace architecture. */
export function applyHudEdgeIntegrationStyle(
  anchor: SceneHudEdgeAnchor,
  themeMode: "day" | "night" = "night"
): React.CSSProperties {
  const edge = resolveHudEdgeIntegration(anchor);
  const rim =
    themeMode === "night"
      ? "inset 0 1px 0 rgba(255,255,255,0.05)"
      : "inset 0 1px 0 rgba(255,255,255,0.35)";

  const attachmentStyles: React.CSSProperties =
    anchor === "TOP_LEFT"
      ? { borderTopLeftRadius: 6, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }
      : anchor === "TOP_RIGHT"
        ? { borderTopLeftRadius: 10, borderTopRightRadius: 6, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }
        : anchor === "BOTTOM_CENTER"
          ? {
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              boxShadow: `${rim}, 0 -1px 0 rgba(125,211,252,0.08)`,
            }
          : { borderRadius: 10 };

  return {
    ...attachmentStyles,
    margin: edge.structuralAttachment ? `${edge.edgeInsetPx}px` : undefined,
  };
}
