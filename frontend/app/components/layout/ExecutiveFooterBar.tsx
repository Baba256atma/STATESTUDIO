"use client";

import React from "react";

import {
  EXECUTIVE_FOOTER_BAR_HEIGHT_PX,
  EXECUTIVE_FOOTER_BAR_ID,
} from "../../lib/ui/executiveFooterBarContract";

/** MRP:12:9 — Permanent application footer shell (placeholder for future enterprise modules). */
export function ExecutiveFooterBar(): React.ReactElement {
  return (
    <footer
      id={EXECUTIVE_FOOTER_BAR_ID}
      data-nx="executive-footer-bar"
      aria-label="Executive footer"
      style={{
        flexShrink: 0,
        width: "100%",
        height: EXECUTIVE_FOOTER_BAR_HEIGHT_PX,
        minHeight: EXECUTIVE_FOOTER_BAR_HEIGHT_PX,
        borderTop: "1px solid var(--nx-border-subtle, rgba(255,255,255,0.08))",
        background: "var(--nx-bg-shell, rgba(8,12,18,0.96))",
        pointerEvents: "none",
      }}
    />
  );
}

export default ExecutiveFooterBar;
