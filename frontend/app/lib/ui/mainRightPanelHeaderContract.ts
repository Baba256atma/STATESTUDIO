/**
 * MRP:14:12 — Main Right Panel header vertical alignment + inset contract.
 */

import type React from "react";

import { MRP_TAB_RADIUS } from "./mainRightPanelDesignTokens.ts";

export const MRP_HEADER_INSET = 4;
export const MRP_HEADER_CONTROL_HEIGHT = 32;
export const MRP_COLLAPSE_BUTTON_WIDTH = 28;

export type MrpHeaderVerticalProbe = Readonly<{
  insightTop: number;
  assistantTop: number;
  collapseTop: number;
  insightBottom: number;
  assistantBottom: number;
  collapseBottom: number;
}>;

let lastHeaderTraceSignature: string | null = null;
let lastVerticalAlignment: boolean | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveMrpHeaderInset(): number {
  return MRP_HEADER_INSET;
}

export function resolveMrpHeaderControlHeight(): number {
  return MRP_HEADER_CONTROL_HEIGHT;
}

export function resolveMrpHeaderVerticalProbe(): MrpHeaderVerticalProbe {
  const inset = MRP_HEADER_INSET;
  return Object.freeze({
    insightTop: inset,
    assistantTop: inset,
    collapseTop: inset,
    insightBottom: inset,
    assistantBottom: inset,
    collapseBottom: inset,
  });
}

export function validateMrpHeaderVerticalAlignment(probe: MrpHeaderVerticalProbe): boolean {
  const inset = MRP_HEADER_INSET;
  const tolerance = 0.5;
  const controls = [
    probe.insightTop,
    probe.assistantTop,
    probe.collapseTop,
    probe.insightBottom,
    probe.assistantBottom,
    probe.collapseBottom,
  ];
  return controls.every((value) => Math.abs(value - inset) <= tolerance);
}

export function mrpHeaderShellStyle(borderSoft: string): React.CSSProperties {
  const inset = MRP_HEADER_INSET;
  return {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    boxSizing: "border-box",
    padding: `${inset}px 10px`,
    minHeight: inset + MRP_HEADER_CONTROL_HEIGHT + inset,
    borderBottom: `1px solid ${borderSoft}`,
  };
}

export function mrpHeaderTabRowStyle(): React.CSSProperties {
  return {
    display: "flex",
    gap: 8,
    minWidth: 0,
    flex: 1,
    alignItems: "center",
    minHeight: MRP_HEADER_CONTROL_HEIGHT,
  };
}

export function mrpHeaderCollapseButtonStyle(input: {
  border: string;
  background: string;
  color: string;
}): React.CSSProperties {
  return {
    flexShrink: 0,
    width: MRP_COLLAPSE_BUTTON_WIDTH,
    height: MRP_HEADER_CONTROL_HEIGHT,
    borderRadius: 8,
    border: `1px solid ${input.border}`,
    background: input.background,
    color: input.color,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  };
}

export function traceNexoraMRPHeader(probe?: MrpHeaderVerticalProbe): void {
  if (!isDev()) return;

  const resolvedProbe = probe ?? resolveMrpHeaderVerticalProbe();
  const insightAligned = Math.abs(resolvedProbe.insightTop - MRP_HEADER_INSET) <= 0.5;
  const assistantAligned = Math.abs(resolvedProbe.assistantTop - MRP_HEADER_INSET) <= 0.5;
  const collapseAligned = Math.abs(resolvedProbe.collapseTop - MRP_HEADER_INSET) <= 0.5;
  const verticalAlignment = validateMrpHeaderVerticalAlignment(resolvedProbe);
  const signature = [
    MRP_HEADER_INSET,
    insightAligned,
    assistantAligned,
    collapseAligned,
    verticalAlignment,
  ].join(":");

  if (lastHeaderTraceSignature !== signature) {
    lastHeaderTraceSignature = signature;
    globalThis.console?.log?.(
      `[NexoraMRPHeader] headerInset=${MRP_HEADER_INSET} insightAligned=${insightAligned} assistantAligned=${assistantAligned} collapseAligned=${collapseAligned}`
    );
  }

  if (lastVerticalAlignment !== verticalAlignment) {
    lastVerticalAlignment = verticalAlignment;
    globalThis.console?.log?.(`[NexoraMRPHeader] verticalAlignment=${verticalAlignment}`);
    if (!verticalAlignment) {
      globalThis.console?.warn?.("[NexoraMRPHeader][Brake] reason=header_alignment_mismatch");
    }
  }
}

export function resetMainRightPanelHeaderContractForTests(): void {
  lastHeaderTraceSignature = null;
  lastVerticalAlignment = null;
}

/** @internal Re-export for tab geometry coupling. */
export { MRP_TAB_RADIUS };
