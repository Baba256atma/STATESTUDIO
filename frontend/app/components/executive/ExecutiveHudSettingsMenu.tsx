"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { bindWindowListener } from "../../lib/dom/domListenerLifecycle";
import { getRegisteredHudPanels } from "../../lib/ui/hudPanelRegistry";
import type { HudDockPosition, HudPanelId, HudSizeMode } from "../../lib/ui/hudPreferencesTypes";
import { useHudPreferences } from "../../lib/ui/useHudPreferences";
import { useWorkspaceAppearance } from "../../lib/ui/useWorkspaceAppearance";

const SIZE_OPTIONS: HudSizeMode[] = ["compact", "normal", "expanded"];

function dockLabel(dock: HudDockPosition): string {
  if (dock === "left") return "Left";
  if (dock === "right") return "Right";
  if (dock === "top") return "Top";
  return "Bottom";
}

export function ExecutiveHudSettingsMenu(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { hudTheme } = useWorkspaceAppearance();
  const theme = hudTheme;
  const { isPanelVisible, getPanelDock, getPanelSize, setPanelVisibility, setPanelSize, setPanelDock } =
    useHudPreferences();
  const panels = getRegisteredHudPanels();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: Event) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    return bindWindowListener("mousedown", onPointerDown, undefined, {
      component: "ExecutiveHudSettingsMenu",
      eventType: "mousedown",
    });
  }, [open]);

  const toggleVisibility = useCallback(
    (panelId: HudPanelId) => {
      setPanelVisibility(panelId, isPanelVisible(panelId) ? "hidden" : "visible");
    },
    [isPanelVisible, setPanelVisibility]
  );

  return (
    <div ref={rootRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        title="HUD settings"
        onClick={() => setOpen((value) => !value)}
        style={{
          height: 28,
          padding: "0 10px",
          borderRadius: 7,
          border: `1px solid ${theme.panelBorder}`,
          background: theme.controlBackground,
          color: theme.textPrimary,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.04em",
          cursor: "pointer",
        }}
      >
        HUD
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="HUD settings"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 30,
            width: 280,
            maxHeight: "min(70vh, 420px)",
            overflow: "auto",
            borderRadius: 10,
            border: `1px solid ${theme.panelBorder}`,
            background: theme.panelBackground,
            backdropFilter: "blur(14px)",
            boxShadow: theme.panelGlow,
            padding: 10,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.textSecondary,
              marginBottom: 8,
            }}
          >
            HUD Settings
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {panels.map((panel) => {
              const visible = isPanelVisible(panel.id);
              const size = getPanelSize(panel.id);
              const dock = getPanelDock(panel.id);
              return (
                <div
                  key={panel.id}
                  style={{
                    borderRadius: 8,
                    border: `1px solid ${theme.controlBorder}`,
                    background: theme.controlBackground,
                    padding: "8px 8px 6px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      color: theme.textPrimary,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={visible}
                      disabled={!panel.customizable.visibility}
                      onChange={() => toggleVisibility(panel.id)}
                    />
                    {panel.label}
                  </label>
                  {panel.customizable.size ? (
                    <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                      {SIZE_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={size === option}
                          onClick={() => setPanelSize(panel.id, option)}
                          style={{
                            height: 22,
                            padding: "0 6px",
                            borderRadius: 6,
                            border: `1px solid ${size === option ? theme.accent : theme.controlBorder}`,
                            background:
                              size === option
                                ? `color-mix(in srgb, ${theme.accent} 16%, ${theme.controlBackground})`
                                : theme.controlBackground,
                            color: size === option ? theme.textPrimary : theme.textSecondary,
                            fontSize: 9,
                            fontWeight: 800,
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {panel.customizable.dock && panel.allowedDocks.length > 1 ? (
                    <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                      {panel.allowedDocks.map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={dock === option}
                          onClick={() => setPanelDock(panel.id, option)}
                          style={{
                            height: 22,
                            padding: "0 6px",
                            borderRadius: 6,
                            border: `1px solid ${dock === option ? theme.accent : theme.controlBorder}`,
                            background:
                              dock === option
                                ? `color-mix(in srgb, ${theme.accent} 16%, ${theme.controlBackground})`
                                : theme.controlBackground,
                            color: dock === option ? theme.textPrimary : theme.textSecondary,
                            fontSize: 9,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {dockLabel(option)}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ExecutiveHudSettingsMenu;
