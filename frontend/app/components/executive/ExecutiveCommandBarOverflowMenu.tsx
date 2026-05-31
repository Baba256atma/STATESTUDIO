"use client";

import React, { useEffect, useRef, useState } from "react";

import { bindWindowListener } from "../../lib/dom/domListenerLifecycle";
import {
  TOP_BAR_OVERFLOW_LABELS,
  type TopBarOverflowItemId,
} from "../../lib/workspace/minimalism";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import type { ExecutiveCommandBarActionId } from "../../lib/ui/executiveCommandBarTypes";

export type ExecutiveCommandBarOverflowMenuProps = {
  overflowItems: TopBarOverflowItemId[];
  actionItems?: ExecutiveCommandBarActionId[];
  onAction?: (actionId: ExecutiveCommandBarActionId) => void;
  onOverflowSelect?: (itemId: TopBarOverflowItemId) => void;
};

const ACTION_LABELS: Record<ExecutiveCommandBarActionId, string> = {
  analyze: "Analyze",
  simulate: "Simulate",
  compare: "Compare",
  snapshot: "Snapshot",
  replay: "Replay",
  load_template: "Template",
  save_workspace: "Save Workspace",
  load_workspace: "Load Workspace",
};

export function ExecutiveCommandBarOverflowMenu(props: ExecutiveCommandBarOverflowMenuProps): React.ReactElement | null {
  const { overflowItems, actionItems = [], onAction, onOverflowSelect } = props;
  const theme = useSceneHudTheme("night");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: Event) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    return bindWindowListener("mousedown", onPointerDown, undefined, {
      component: "ExecutiveCommandBarOverflowMenu",
      eventType: "mousedown",
    });
  }, [open]);

  if (overflowItems.length === 0 && actionItems.length === 0) return null;

  const utilityItems = overflowItems.filter((item) =>
    ["hud_settings", "layout_preset", "view_mode", "developer_tools", "sandbox", "diagnostics"].includes(item)
  );
  const statusItems = overflowItems.filter((item) => !utilityItems.includes(item));

  return (
    <div ref={rootRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        title="More workspace controls"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          border: `1px solid ${theme.controlBorder}`,
          background: theme.buttonBackground,
          color: theme.buttonText,
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        ⋯
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Executive workspace overflow"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 30,
            minWidth: 180,
            padding: 6,
            borderRadius: 10,
            border: `1px solid ${theme.controlBorder}`,
            background: theme.shellBackground,
            boxShadow: theme.mode === "night" ? "0 8px 24px rgba(0,0,0,0.35)" : "0 8px 24px rgba(15,23,42,0.12)",
          }}
        >
          {statusItems.map((itemId) => (
            <button
              key={itemId}
              type="button"
              role="menuitem"
              onClick={() => {
                onOverflowSelect?.(itemId);
                if (itemId === "analyze" || itemId === "compare" || itemId === "load_template" || itemId === "save_workspace" || itemId === "load_workspace") {
                  onAction?.(itemId as ExecutiveCommandBarActionId);
                }
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 8px",
                border: "none",
                borderRadius: 6,
                background: "transparent",
                color: theme.text,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {TOP_BAR_OVERFLOW_LABELS[itemId]}
            </button>
          ))}
          {actionItems.map((actionId) => (
            <button
              key={actionId}
              type="button"
              role="menuitem"
              onClick={() => {
                onAction?.(actionId);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 8px",
                border: "none",
                borderRadius: 6,
                background: "transparent",
                color: theme.text,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {ACTION_LABELS[actionId]}
            </button>
          ))}
          {utilityItems.length > 0 ? (
            <div
              aria-hidden
              style={{
                margin: "4px 0",
                borderTop: `1px solid ${theme.controlBorder}`,
              }}
            />
          ) : null}
          {utilityItems.map((itemId) => (
            <button
              key={itemId}
              type="button"
              role="menuitem"
              onClick={() => {
                onOverflowSelect?.(itemId);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 8px",
                border: "none",
                borderRadius: 6,
                background: "transparent",
                color: theme.textMuted,
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {TOP_BAR_OVERFLOW_LABELS[itemId]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
