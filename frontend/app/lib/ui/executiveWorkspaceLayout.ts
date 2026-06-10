import { bucketViewportWidth } from "../layout/hudLayoutSignature";

/**
 * E2:2 — Executive workspace layout contracts.
 * Single source of truth for dock widths, scene margins, and responsive breakpoints.
 * Reused by E2:3+ (Scene Panel), E2:4+ (Object/Dashboard/Chat docks).
 *
 * Frozen MVP panel contract:
 * - Left Navigation is permanent executive context navigation.
 * - Center Workspace is the always-active Three.js scene.
 * - Main Right Panel exposes Dashboard and Assistant only.
 * See docs/nexora-canonical-panel-architecture.md.
 */

/** Primary left navigation rail (section switcher). */
export const EXECUTIVE_LEFT_NAV_WIDTH_PX = 72;

/** Reserved left dock — collapsed rail until E2:3 Scene Panel mounts. */
export const EXECUTIVE_LEFT_DOCK_COLLAPSED_PX = 48;

/** Expanded left dock width target for E2:3 Scene Panel. */
export const EXECUTIVE_LEFT_DOCK_EXPANDED_PX = 280;

/** Right intelligence dock (inspector / object / dashboard host). */
export const EXECUTIVE_RIGHT_DOCK_WIDTH_PX = 430;

/** Collapsed right object panel rail (E2:4). */
export const EXECUTIVE_RIGHT_DOCK_COLLAPSED_PX = 48;

/** E2:12 — Executive AI assistant panel on right rail. */
export const EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX = 400;
export const EXECUTIVE_RIGHT_ASSISTANT_COLLAPSED_PX = 56;

/** Left command assistant column (chat — not the Scene Panel). */
export const EXECUTIVE_LEFT_COMMAND_WIDTH_PX = 340;
export const EXECUTIVE_LEFT_COMMAND_COLLAPSED_PX = 48;

/** Inner scene canvas padding (executive framing). */
export const EXECUTIVE_SCENE_ZONE_PADDING_PX = 12;

/** Minimum usable scene width before dock collapse rules tighten. */
export const EXECUTIVE_SCENE_MIN_WIDTH_PX = 480;

/** Responsive breakpoints (viewport width). */
export const EXECUTIVE_WORKSPACE_BREAKPOINTS = {
  tablet: 1024,
  compactDesktop: 1280,
  wideDesktop: 1600,
} as const;

export type ExecutiveWorkspaceBreakpoint = "mobile" | "tablet" | "compactDesktop" | "wideDesktop";

export type ExecutiveWorkspaceLayoutMetrics = {
  breakpoint: ExecutiveWorkspaceBreakpoint;
  viewportWidth: number;
  leftNavWidthPx: number;
  leftDockWidthPx: number;
  leftCommandWidthPx: number;
  rightDockWidthPx: number;
  scenePaddingPx: number;
  sceneMinWidthPx: number;
};

export const EXECUTIVE_WORKSPACE_ZONE_IDS = {
  topUtility: "nexora-top-control-bar",
  leftNav: "nexora-leftnav",
  leftDock: "nexora-left-scene-dock",
  leftDockHost: "nexora-left-scene-dock-host",
  leftCommand: "nexora-left-command-column",
  scene: "nexora-stage",
  sceneCanvasHost: "nexora-canvas-host",
  rightDock: "nexora-right-rail",
  objectPanelShell: "nexora-object-panel-shell",
  objectPanelHost: "nexora-object-panel-host",
  rightPanelRoot: "nexora-right-panel-root",
  /** MRP:10:12 — visible Type-C right rail host (not headless ObjectPanelShell). */
  visibleMrpHost: "nexora-visible-mrp-host",
  executiveAssistantShell: "nexora-executive-assistant-shell",
  executiveAssistantHost: "nexora-executive-assistant-host",
  executiveScenarioHost: "nexora-executive-scenario-host",
  executiveComparisonHost: "nexora-executive-comparison-host",
  executiveCommandBarHost: "nexora-executive-command-bar-host",
  bottomDock: "nexora-status-strip",
} as const;

export function resolveExecutiveWorkspaceBreakpoint(viewportWidth: number): ExecutiveWorkspaceBreakpoint {
  if (viewportWidth >= EXECUTIVE_WORKSPACE_BREAKPOINTS.wideDesktop) return "wideDesktop";
  if (viewportWidth >= EXECUTIVE_WORKSPACE_BREAKPOINTS.compactDesktop) return "compactDesktop";
  if (viewportWidth >= EXECUTIVE_WORKSPACE_BREAKPOINTS.tablet) return "tablet";
  return "mobile";
}

/** Computes dock widths for the current viewport without mutating layout engines. */
export function resolveExecutiveWorkspaceLayoutMetrics(
  viewportWidth: number,
  options?: {
    leftCommandOpen?: boolean;
    leftDockExpanded?: boolean;
    rightDockExpanded?: boolean;
    /** E2:8 — when false, left scene dock width is zero (HUD replaces sidebar). */
    leftSceneDockVisible?: boolean;
    /** E2:9 — when false, right object dock width is zero (HUD replaces sidebar). */
    rightObjectDockVisible?: boolean;
    /** E2:12 — when true, right rail hosts executive AI assistant. */
    rightAssistantVisible?: boolean;
    /** E2:12 — expanded vs collapsed assistant rail. */
    rightAssistantExpanded?: boolean;
    /** E2:18 — preset-aware right rail width override. */
    rightAssistantWidthPx?: number;
    /** E2:12 — when false, left command column width is zero. */
    leftCommandVisible?: boolean;
  }
): ExecutiveWorkspaceLayoutMetrics {
  const breakpoint = resolveExecutiveWorkspaceBreakpoint(viewportWidth);
  const leftCommandOpen = options?.leftCommandOpen ?? false;
  const leftDockExpanded = options?.leftDockExpanded ?? false;
  const rightDockExpanded = options?.rightDockExpanded ?? true;
  const leftSceneDockVisible = options?.leftSceneDockVisible ?? true;
  const rightObjectDockVisible = options?.rightObjectDockVisible ?? true;
  const rightAssistantVisible = options?.rightAssistantVisible ?? false;
  const rightAssistantExpanded = options?.rightAssistantExpanded ?? true;
  const rightAssistantWidthPx = options?.rightAssistantWidthPx ?? EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX;
  const leftCommandVisible = options?.leftCommandVisible ?? true;

  let rightDockWidthPx = rightAssistantVisible
    ? rightAssistantExpanded
      ? rightAssistantWidthPx
      : EXECUTIVE_RIGHT_ASSISTANT_COLLAPSED_PX
    : rightObjectDockVisible
      ? rightDockExpanded
        ? EXECUTIVE_RIGHT_DOCK_WIDTH_PX
        : EXECUTIVE_RIGHT_DOCK_COLLAPSED_PX
      : 0;
  let leftCommandWidthPx = leftCommandVisible
    ? leftCommandOpen
      ? EXECUTIVE_LEFT_COMMAND_WIDTH_PX
      : EXECUTIVE_LEFT_COMMAND_COLLAPSED_PX
    : 0;
  let leftDockWidthPx = leftSceneDockVisible
    ? leftDockExpanded
      ? EXECUTIVE_LEFT_DOCK_EXPANDED_PX
      : EXECUTIVE_LEFT_DOCK_COLLAPSED_PX
    : 0;

  if (breakpoint === "tablet") {
    rightDockWidthPx = rightAssistantVisible
      ? Math.min(rightDockWidthPx, EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX)
      : Math.min(rightDockWidthPx, 360);
    if (leftCommandVisible && leftCommandOpen) {
      leftCommandWidthPx = Math.min(leftCommandWidthPx, 300);
    }
  }

  if (breakpoint === "mobile") {
    rightDockWidthPx = rightAssistantVisible
      ? rightAssistantExpanded
        ? Math.min(rightDockWidthPx, 320)
        : EXECUTIVE_RIGHT_ASSISTANT_COLLAPSED_PX
      : !rightObjectDockVisible
        ? 0
        : rightDockExpanded
          ? Math.min(rightDockWidthPx, 320)
          : EXECUTIVE_RIGHT_DOCK_COLLAPSED_PX;
    leftCommandWidthPx = leftCommandVisible
      ? leftCommandOpen
        ? 280
        : EXECUTIVE_LEFT_COMMAND_COLLAPSED_PX
      : 0;
    leftDockWidthPx = leftSceneDockVisible ? EXECUTIVE_LEFT_DOCK_COLLAPSED_PX : 0;
  }

  return {
    breakpoint,
    viewportWidth,
    leftNavWidthPx: EXECUTIVE_LEFT_NAV_WIDTH_PX,
    leftDockWidthPx,
    leftCommandWidthPx,
    rightDockWidthPx,
    scenePaddingPx: EXECUTIVE_SCENE_ZONE_PADDING_PX,
    sceneMinWidthPx: EXECUTIVE_SCENE_MIN_WIDTH_PX,
  };
}

/** Normalized inset ratios for layout-aware camera framing (0–0.25). */
export function executiveDockInsetRatios(metrics: ExecutiveWorkspaceLayoutMetrics): {
  leftDockInsetRatio: number;
  rightDockInsetRatio: number;
} {
  const width = Math.max(1, metrics.viewportWidth);
  return {
    leftDockInsetRatio: Math.min(0.22, (metrics.leftNavWidthPx + metrics.leftDockWidthPx + metrics.leftCommandWidthPx) / width),
    rightDockInsetRatio: Math.min(0.28, metrics.rightDockWidthPx / width),
  };
}

export function buildExecutiveWorkspaceLayoutSignature(metrics: ExecutiveWorkspaceLayoutMetrics): string {
  return [
    metrics.breakpoint,
    bucketViewportWidth(Math.round(metrics.viewportWidth)),
    metrics.leftDockWidthPx,
    metrics.leftCommandWidthPx,
    metrics.rightDockWidthPx,
    metrics.scenePaddingPx,
  ].join("|");
}
