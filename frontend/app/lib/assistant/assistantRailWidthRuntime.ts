/**
 * MRP:11:2:4 — Adaptive assistant rail width + layout measurement runtime.
 */

import {
  ASSISTANT_RAIL_MIN_WIDTH_PX,
  ASSISTANT_RAIL_PRESET_BONUS_PX,
  ASSISTANT_RAIL_WIDTH_BY_BREAKPOINT,
  ASSISTANT_READING_AVG_CHAR_WIDTH_PX,
  evaluateAssistantReadingComfort,
  resolveAssistantContentWidthPx,
  resolveAssistantRailLayoutTrace,
  resolveAssistantRailLayoutTraceLog,
  resolveAssistantWorkspaceBreakpoint,
  resolveMaxAssistantWidthForSceneDominance,
  type AssistantRailLayoutMeasurement,
  type AssistantRailLayoutTrace,
  type WorkspaceLayoutPreset,
} from "./assistantRailLayoutContract.ts";

export function resolveAssistantRailWidth(input: {
  viewportWidth: number;
  preset?: WorkspaceLayoutPreset;
}): number {
  const preset = input.preset ?? "executive";
  const breakpoint = resolveAssistantWorkspaceBreakpoint(input.viewportWidth);
  const breakpointTarget = ASSISTANT_RAIL_WIDTH_BY_BREAKPOINT[breakpoint];
  const presetBonus = ASSISTANT_RAIL_PRESET_BONUS_PX[preset];
  const dominanceCap = resolveMaxAssistantWidthForSceneDominance(input.viewportWidth);
  const target = breakpointTarget + presetBonus;
  return Math.min(Math.max(ASSISTANT_RAIL_MIN_WIDTH_PX, target), dominanceCap);
}

export function buildAssistantRailLayoutMeasurement(input: {
  viewportWidth: number;
  sceneWidth: number;
  assistantWidth: number;
  timelineWidth: number;
}): AssistantRailLayoutMeasurement {
  const contentWidth = resolveAssistantContentWidthPx(input.assistantWidth);
  const readingComfort = evaluateAssistantReadingComfort(contentWidth);
  const sceneToAssistantRatio =
    input.assistantWidth > 0 ? input.sceneWidth / input.assistantWidth : 0;

  return {
    viewportWidth: input.viewportWidth,
    sceneWidth: input.sceneWidth,
    assistantWidth: input.assistantWidth,
    timelineWidth: input.timelineWidth,
    sceneToAssistantRatio,
    contentWidth,
    estimatedCharsPerLine: Math.floor(contentWidth / ASSISTANT_READING_AVG_CHAR_WIDTH_PX),
    readingComfort,
  };
}

export function measureAssistantRailLayout(): AssistantRailLayoutMeasurement | null {
  if (typeof document === "undefined") return null;

  const viewportWidth = Math.round(globalThis.innerWidth ?? 0);
  const sceneEl = document.getElementById("nexora-stage");
  const assistantEl =
    document.querySelector('[data-nx="mrp-chat-first-assistant-surface"]') ??
    document.getElementById("nexora-visible-mrp-host");
  const timelineEl =
    document.querySelector('[data-hud="timeline"]') ??
    document.querySelector('[data-nx="executive-timeline-hud"]');

  if (!(sceneEl instanceof HTMLElement) || !(assistantEl instanceof HTMLElement)) {
    return null;
  }

  const sceneRect = sceneEl.getBoundingClientRect();
  const assistantRect = assistantEl.getBoundingClientRect();
  const timelineRect =
    timelineEl instanceof HTMLElement ? timelineEl.getBoundingClientRect() : null;

  return buildAssistantRailLayoutMeasurement({
    viewportWidth,
    sceneWidth: sceneRect.width,
    assistantWidth: assistantRect.width,
    timelineWidth: timelineRect?.width ?? 0,
  });
}

export function traceAssistantRailLayout(measurement: AssistantRailLayoutMeasurement): AssistantRailLayoutTrace {
  const trace = resolveAssistantRailLayoutTrace({
    assistantWidth: measurement.assistantWidth,
    sceneWidth: measurement.sceneWidth,
    readingComfort: measurement.readingComfort,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.log?.(resolveAssistantRailLayoutTraceLog(trace));
  }

  return trace;
}

declare global {
  interface Window {
    __ASSISTANT_RAIL_LAYOUT__?: AssistantRailLayoutMeasurement;
  }
}

export function publishAssistantRailLayoutMeasurement(
  measurement: AssistantRailLayoutMeasurement | null
): void {
  if (typeof window === "undefined" || !measurement) return;
  window.__ASSISTANT_RAIL_LAYOUT__ = measurement;
}
