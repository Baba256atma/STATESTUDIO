import type React from "react";

import type { NexoraHudThemeTokens } from "../../scene/nexoraHudTheme";
import { resolveSceneThemeTokens } from "../../theme/sceneThemeTokens";
import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";
import { resolveExecutiveVisualWeight } from "../../workspace/minimalism";
import type { AttentionHierarchyTier } from "../../workspace/minimalism/executiveMinimalismTypes";
import { resolveExecutiveTransparency } from "./executiveTransparencyRuntime";
import { applyHudEdgeIntegrationStyle } from "./hudEdgeIntegrationRuntime";
import { resolveSceneHudDepth } from "./sceneHudDepthRuntime";
import { resolveSceneHudSpatialAlignment } from "./sceneHudSpatialAlignmentRuntime";
import type { SceneHudEdgeAnchor, SceneNativeHudDesignSnapshot, SceneNativeHudShellInput } from "./sceneNativeHudVisualTypes";
import { logSceneNativeHudVisualSystem } from "./sceneNativeHudVisualInstrumentation";
import { resolveSceneHudTypography } from "./sceneHudTypographyRuntime";
import {
  HUD_PANEL_BORDER_WIDTH,
  HUD_PANEL_RADIUS,
  isSceneNativeHudPanelSurface,
} from "../hudPanelDesignContract.ts";

const SURFACE_GLASS: Partial<Record<SceneHudThemeSurfaceId, SceneNativeHudDesignSnapshot["panelGlassLevel"]>> = {
  sceneInfoHud: "instrument",
  objectInfoHud: "instrument",
  timelineHud: "glass",
  executiveStatusHud: "glass",
  quickActionsDock: "instrument",
  sceneNavigationToolbar: "instrument",
  commandBar: "solid",
};

const SURFACE_EDGE: Partial<Record<SceneHudThemeSurfaceId, SceneHudEdgeAnchor>> = {
  sceneInfoHud: "TOP_LEFT",
  objectInfoHud: "TOP_RIGHT",
  timelineHud: "BOTTOM_CENTER",
  executiveStatusHud: "TOP_RIGHT",
  quickActionsDock: "BOTTOM_CENTER",
  sceneNavigationToolbar: "CENTER_FLOATING",
};

function attentionTierForSurface(surface: SceneHudThemeSurfaceId): AttentionHierarchyTier {
  if (surface === "executiveStatusHud" || surface === "commandBar") return "SECONDARY";
  if (surface === "timelineHud") return "TERTIARY";
  return "TERTIARY";
}

function resolveDesignSnapshot(
  surface: SceneHudThemeSurfaceId,
  themeMode: "day" | "night",
  options?: { focused?: boolean; collapsed?: boolean }
): SceneNativeHudDesignSnapshot {
  const transparency = resolveExecutiveTransparency(undefined, options);
  const visualWeight = resolveExecutiveVisualWeight(attentionTierForSurface(surface), themeMode);
  const glassLevel = SURFACE_GLASS[surface] ?? "instrument";

  const glassProfile =
    glassLevel === "instrument"
      ? { borderWeight: 0.5, cornerRadius: 8, shadow: "rim" as const, glow: "none" as const, blur: transparency.blurPx }
      : glassLevel === "glass"
        ? { borderWeight: 0.75, cornerRadius: 10, shadow: "ambient" as const, glow: "subtle" as const, blur: transparency.blurPx + 2 }
        : { borderWeight: 1, cornerRadius: 9, shadow: "elevated" as const, glow: "accent" as const, blur: transparency.blurPx + 4 };

  const unifiedPanel = isSceneNativeHudPanelSurface(surface);

  return {
    panelGlassLevel: glassLevel,
    panelTransparency: transparency.surfaceOpacity,
    panelBlur: glassProfile.blur,
    panelBorderWeight: unifiedPanel
      ? HUD_PANEL_BORDER_WIDTH
      : visualWeight.borderWidthPx * glassProfile.borderWeight,
    panelCornerRadius: unifiedPanel ? HUD_PANEL_RADIUS : glassProfile.cornerRadius,
    panelShadowProfile: glassProfile.shadow,
    panelGlowProfile: glassProfile.glow,
  };
}

function shadowForProfile(
  profile: SceneNativeHudDesignSnapshot["panelShadowProfile"],
  themeMode: "day" | "night"
): string | undefined {
  if (profile === "none") return undefined;
  if (profile === "rim") {
    return themeMode === "night" ? "inset 0 1px 0 rgba(255,255,255,0.05)" : "inset 0 1px 0 rgba(255,255,255,0.4)";
  }
  if (profile === "ambient") {
    return themeMode === "night" ? "0 8px 24px rgba(0,0,0,0.22)" : "0 8px 20px rgba(15,23,42,0.08)";
  }
  return themeMode === "night" ? "0 10px 28px rgba(0,0,0,0.28)" : "0 10px 24px rgba(15,23,42,0.1)";
}

function glowForProfile(
  profile: SceneNativeHudDesignSnapshot["panelGlowProfile"],
  themeMode: "day" | "night"
): string | undefined {
  if (profile === "none") return undefined;
  if (profile === "subtle") {
    return themeMode === "night"
      ? "0 0 12px rgba(125,211,252,0.06)"
      : "0 0 10px rgba(15,23,42,0.04)";
  }
  return themeMode === "night"
    ? "0 0 16px rgba(125,211,252,0.1)"
    : "0 0 12px rgba(15,23,42,0.06)";
}

export function resolveSceneNativeHudDesign(input: SceneNativeHudShellInput): SceneNativeHudDesignSnapshot {
  const snapshot = resolveDesignSnapshot(input.surface, input.themeMode, {
    focused: input.focused,
    collapsed: input.collapsed,
  });
  logSceneNativeHudVisualSystem({
    surface: input.surface,
    themeMode: input.themeMode,
    ...snapshot,
  });
  return snapshot;
}

export function resolveSceneNativeHudShell(
  theme: NexoraHudThemeTokens,
  input: SceneNativeHudShellInput,
  overrides?: React.CSSProperties
): React.CSSProperties {
  const tokens = resolveSceneThemeTokens(theme.mode);
  const design = resolveDesignSnapshot(input.surface, theme.mode, {
    focused: input.focused,
    collapsed: input.collapsed,
  });
  const depth = resolveSceneHudDepth(input.surface, input.focused);
  const edgeAnchor = input.edgeAnchor ?? SURFACE_EDGE[input.surface] ?? "CENTER_FLOATING";
  const alignment = resolveSceneHudSpatialAlignment({ surface: input.surface });
  const transparency = resolveExecutiveTransparency(undefined, {
    focused: input.focused,
    collapsed: input.collapsed,
  });
  const unifiedPanel = isSceneNativeHudPanelSurface(input.surface);
  const edgeStyle = unifiedPanel ? {} : applyHudEdgeIntegrationStyle(edgeAnchor, theme.mode);

  const shadow = shadowForProfile(design.panelShadowProfile, theme.mode);
  const glow = glowForProfile(design.panelGlowProfile, theme.mode);
  const combinedShadow = [shadow, glow].filter(Boolean).join(", ") || undefined;

  const backgroundMix = transparency.allowSceneVisibility
    ? `color-mix(in srgb, ${tokens.panelBackground} ${Math.round(design.panelTransparency * 100)}%, transparent)`
    : tokens.panelBackground;

  return {
    borderRadius: design.panelCornerRadius,
    ...(unifiedPanel
      ? {
          borderTopLeftRadius: HUD_PANEL_RADIUS,
          borderTopRightRadius: HUD_PANEL_RADIUS,
          borderBottomLeftRadius: HUD_PANEL_RADIUS,
          borderBottomRightRadius: HUD_PANEL_RADIUS,
        }
      : {}),
    border: `${design.panelBorderWeight}px solid color-mix(in srgb, ${tokens.panelBorder} 72%, transparent)`,
    background: backgroundMix,
    backdropFilter: `blur(${design.panelBlur}px) saturate(120%)`,
    WebkitBackdropFilter: `blur(${design.panelBlur}px) saturate(120%)`,
    boxShadow: combinedShadow,
    color: tokens.textPrimary,
    pointerEvents: "auto",
    opacity: depth.opacityMultiplier,
    zIndex: depth.zIndex,
    overflowX: "hidden",
    minWidth: 0,
    maxWidth: alignment.preserveSceneCenter ? `min(${Math.round(alignment.maxWidthRatio * 100)}vw, 100%)` : undefined,
    ...edgeStyle,
    ...overrides,
  };
}

export function resolveSceneNativeHudSectionLabel(
  theme: NexoraHudThemeTokens,
  role: "executiveHeader" | "sectionHeader" = "sectionHeader"
): React.CSSProperties {
  return resolveSceneHudTypography(role, theme.label);
}

export function resolveSceneNativeHudMetricStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return resolveSceneHudTypography("primaryMetric", theme.textPrimary);
}

export function resolveSceneNativeHudContextStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return resolveSceneHudTypography("contextText", theme.textSecondary);
}
