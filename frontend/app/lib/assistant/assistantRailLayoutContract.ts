/**
 * MRP:11:2:4 — Assistant rail layout + reading comfort contract.
 */

import type { AssistantPanelDockId } from "./assistantPanelDockContract";

export type AssistantReadingComfortLevel = "pass" | "warn" | "fail";

export type AssistantRailLayoutMeasurement = Readonly<{
  viewportWidth: number;
  sceneWidth: number;
  assistantWidth: number;
  timelineWidth: number;
  sceneToAssistantRatio: number;
  contentWidth: number;
  estimatedCharsPerLine: number;
  readingComfort: AssistantReadingComfortLevel;
}>;

export type AssistantRailLayoutTrace = Readonly<{
  assistantWidth: number;
  sceneWidth: number;
  readingComfort: AssistantReadingComfortLevel;
  chipWrapMode: "enabled";
}>;

export type ExecutiveWorkspaceBreakpoint = "mobile" | "tablet" | "compactDesktop" | "wideDesktop";

export type WorkspaceLayoutPreset = "executive" | "analysis" | "simulation";

/** Target ~60–90 characters per line at executive body size. */
export const ASSISTANT_READING_TARGET_CHARS_PER_LINE = 72;
export const ASSISTANT_READING_MIN_CHARS_PER_LINE = 60;
export const ASSISTANT_READING_AVG_CHAR_WIDTH_PX = 6.4;

/** Scene must remain visually dominant on desktop. */
export const ASSISTANT_SCENE_DOMINANCE_MIN_RATIO = 0.55;

export const ASSISTANT_RAIL_MIN_WIDTH_PX = 320;
export const ASSISTANT_RAIL_BASE_WIDTH_PX = 400;
export const ASSISTANT_RAIL_WIDE_WIDTH_PX = 440;

export const ASSISTANT_RAIL_CONTENT_INSET_PX = 28;

/** Mirrors executiveWorkspaceLayout chrome — used for dominance math only. */
export const ASSISTANT_RAIL_SCENE_CHROME_PX = Object.freeze({
  leftNav: 72,
  leftDockCollapsed: 48,
  leftCommandCollapsed: 48,
  scenePadding: 12,
});

export const ASSISTANT_WORKSPACE_BREAKPOINTS = Object.freeze({
  tablet: 1024,
  compactDesktop: 1280,
  wideDesktop: 1600,
});

export const ASSISTANT_RAIL_WIDTH_BY_BREAKPOINT: Readonly<
  Record<ExecutiveWorkspaceBreakpoint, number>
> = Object.freeze({
  mobile: 320,
  tablet: 380,
  compactDesktop: 420,
  wideDesktop: ASSISTANT_RAIL_WIDE_WIDTH_PX,
});

export const ASSISTANT_RAIL_PRESET_BONUS_PX: Readonly<Record<WorkspaceLayoutPreset, number>> =
  Object.freeze({
    executive: 0,
    analysis: 20,
    simulation: 12,
  });

export function resolveAssistantWorkspaceBreakpoint(
  viewportWidth: number
): ExecutiveWorkspaceBreakpoint {
  if (viewportWidth >= ASSISTANT_WORKSPACE_BREAKPOINTS.wideDesktop) return "wideDesktop";
  if (viewportWidth >= ASSISTANT_WORKSPACE_BREAKPOINTS.compactDesktop) return "compactDesktop";
  if (viewportWidth >= ASSISTANT_WORKSPACE_BREAKPOINTS.tablet) return "tablet";
  return "mobile";
}

export function resolveAssistantRailSceneChromePx(): number {
  const c = ASSISTANT_RAIL_SCENE_CHROME_PX;
  return c.leftNav + c.leftDockCollapsed + c.leftCommandCollapsed + c.scenePadding * 2;
}

export function resolveAssistantContentWidthPx(assistantWidthPx: number): number {
  return Math.max(0, assistantWidthPx - ASSISTANT_RAIL_CONTENT_INSET_PX);
}

export function estimateAssistantCharsPerLine(contentWidthPx: number): number {
  if (contentWidthPx <= 0) return 0;
  return Math.floor(contentWidthPx / ASSISTANT_READING_AVG_CHAR_WIDTH_PX);
}

export function evaluateAssistantReadingComfort(contentWidthPx: number): AssistantReadingComfortLevel {
  const chars = estimateAssistantCharsPerLine(contentWidthPx);
  if (chars >= ASSISTANT_READING_MIN_CHARS_PER_LINE) return "pass";
  if (chars >= 48) return "warn";
  return "fail";
}

export function resolveMaxAssistantWidthForSceneDominance(viewportWidth: number): number {
  const chrome = resolveAssistantRailSceneChromePx();
  const minSceneWidth = Math.ceil(viewportWidth * ASSISTANT_SCENE_DOMINANCE_MIN_RATIO);
  const maxAssistant = viewportWidth - chrome - minSceneWidth;
  return Math.max(ASSISTANT_RAIL_MIN_WIDTH_PX, maxAssistant);
}

export function resolveAssistantRailLayoutTrace(
  measurement: Pick<
    AssistantRailLayoutMeasurement,
    "assistantWidth" | "sceneWidth" | "readingComfort"
  >
): AssistantRailLayoutTrace {
  return {
    assistantWidth: Math.round(measurement.assistantWidth),
    sceneWidth: Math.round(measurement.sceneWidth),
    readingComfort: measurement.readingComfort,
    chipWrapMode: "enabled",
  };
}

export function resolveAssistantRailLayoutTraceLog(trace: AssistantRailLayoutTrace): string {
  return [
    "[AssistantRailLayout]",
    `assistantWidth=${trace.assistantWidth}`,
    `sceneWidth=${trace.sceneWidth}`,
    `readingComfort=${trace.readingComfort}`,
    `chipWrapMode=${trace.chipWrapMode}`,
  ].join("\n");
}

export function isAssistantSupportPanelId(value: string): value is AssistantPanelDockId {
  return (
    value === "insight" ||
    value === "scenario" ||
    value === "analytics" ||
    value === "governance" ||
    value === "actions" ||
    value === "questions"
  );
}
