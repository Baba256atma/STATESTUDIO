"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ScenePrefs } from "../../screens/homeScreenUtils";
import { useNexoraUiTheme } from "../../lib/ui/nexoraUiTheme";
import { nx } from "../ui/nexoraTheme";

const NAV_POPOVER_WIDTH = 240;
const NAV_POPOVER_GAP = 12;

function emitPrefsPatch(patch: Partial<ScenePrefs>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<Partial<ScenePrefs>>("nexora:scene-prefs-patch", { detail: patch }));
}

function emitDevToolsEvent(type: "roadmap" | "debug"): void {
  if (typeof window === "undefined") return;
  if (type === "roadmap") {
    window.dispatchEvent(new CustomEvent("nexora:devtools-open-roadmap"));
  } else {
    window.dispatchEvent(new CustomEvent("nexora:devtools-toggle-self-debug"));
  }
}

export type SceneSettingsMenuVariant = "header" | "navSettings" | "navInput";

type SceneSettingsMenuProps = {
  /** `header` — inline header control. `navSettings` — ⚙️ left rail, theme/scene popover only. `navInput` — 📡 opens center input (no right panel). */
  variant?: SceneSettingsMenuVariant;
};

type NavPopoverLayout = { left: number; bottom: number; maxHeight: number };

function GearIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SceneSettingsMenu(props: SceneSettingsMenuProps = {}) {
  const variant = props.variant ?? "header";
  const { themeMode, setThemeMode } = useNexoraUiTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const [navPopoverLayout, setNavPopoverLayout] = useState<NavPopoverLayout | null>(null);
  const [inputCenterOpen, setInputCenterOpen] = useState(false);

  const applyPreset = useCallback((preset: "dark_space" | "grid" | "minimal") => {
    if (preset === "dark_space") {
      emitPrefsPatch({ theme: "night", starDensity: 0, showGrid: false, showAxes: false });
    } else if (preset === "grid") {
      emitPrefsPatch({ theme: "night", showGrid: true, showAxes: true });
    } else {
      emitPrefsPatch({ theme: "night", showGrid: false, showAxes: false });
    }
    setOpen(false);
  }, []);
  const isDevMode = process.env.NODE_ENV !== "production";

  const updateNavPopoverLayout = useCallback(() => {
    if (variant !== "navSettings" || !open) return;
    const anchor = rootRef.current;
    if (!anchor) return;
    const ar = anchor.getBoundingClientRect();
    let left = ar.right + NAV_POPOVER_GAP;
    if (left + NAV_POPOVER_WIDTH > window.innerWidth - 8) {
      left = Math.max(8, ar.left - NAV_POPOVER_WIDTH - NAV_POPOVER_GAP);
    }
    const topMargin = 8;
    const maxHeight = Math.max(160, Math.min(ar.bottom - topMargin, window.innerHeight - topMargin));
    setNavPopoverLayout({
      left,
      bottom: window.innerHeight - ar.bottom,
      maxHeight,
    });
  }, [variant, open]);

  useLayoutEffect(() => {
    if (!open || variant !== "navSettings") return;
    updateNavPopoverLayout();
  }, [open, variant, updateNavPopoverLayout]);

  useEffect(() => {
    if (!open || variant !== "navSettings") return;
    const onResizeOrScroll = () => updateNavPopoverLayout();
    window.addEventListener("resize", onResizeOrScroll);
    window.addEventListener("scroll", onResizeOrScroll, true);
    return () => {
      window.removeEventListener("resize", onResizeOrScroll);
      window.removeEventListener("scroll", onResizeOrScroll, true);
    };
  }, [open, variant, updateNavPopoverLayout]);

  useEffect(() => {
    if (variant !== "navSettings") return;
    const onOpenAppearance = () => setOpen(true);
    window.addEventListener("nexora:open-scene-appearance-menu", onOpenAppearance);
    return () => window.removeEventListener("nexora:open-scene-appearance-menu", onOpenAppearance);
  }, [variant]);

  useEffect(() => {
    if (variant !== "navInput") return;
    const onVis = (event: Event) => {
      const d = (event as CustomEvent<{ open?: boolean }>).detail;
      setInputCenterOpen(d?.open === true);
    };
    window.addEventListener("nexora:input-center-visibility", onVis as EventListener);
    return () => window.removeEventListener("nexora:input-center-visibility", onVis as EventListener);
  }, [variant]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (menuPanelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const menuPanelBase: React.CSSProperties = {
    width: variant === "navSettings" ? NAV_POPOVER_WIDTH : undefined,
    minWidth: variant === "header" ? 220 : undefined,
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${nx.border}`,
    background: nx.popoverBg,
    boxShadow: nx.popoverShadow,
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
    boxSizing: "border-box",
  };

  const menuPanelInlineStyle: React.CSSProperties | null =
    variant === "header"
      ? {
          position: "absolute",
          right: 0,
          top: "calc(100% + 8px)",
          zIndex: 50,
          ...menuPanelBase,
        }
      : null;

  const menuPanelFixedStyle: React.CSSProperties | null =
    variant === "navSettings" && navPopoverLayout
      ? {
          position: "fixed",
          left: navPopoverLayout.left,
          bottom: navPopoverLayout.bottom,
          maxHeight: navPopoverLayout.maxHeight,
          zIndex: 200,
          ...menuPanelBase,
        }
      : null;

  const navSettingsTriggerStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    padding: 0,
    borderRadius: 12,
    border: open ? `1px solid ${nx.navTileActiveBorder}` : `1px solid ${nx.border}`,
    background: open ? nx.navTileActiveBg : nx.bgPanelSoft,
    color: open ? nx.text : nx.lowMuted,
    boxShadow: open ? nx.navTileActiveShadow : "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const navInputTriggerStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    padding: 0,
    borderRadius: 12,
    border: inputCenterOpen ? `1px solid ${nx.navTileActiveBorder}` : `1px solid ${nx.border}`,
    background: inputCenterOpen ? nx.navTileActiveBg : nx.bgPanelSoft,
    color: inputCenterOpen ? nx.text : nx.lowMuted,
    boxShadow: inputCenterOpen ? nx.navTileActiveShadow : "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const headerTriggerStyle: React.CSSProperties = {
    height: 36,
    padding: "0 12px",
    borderRadius: 10,
    border: `1px solid ${nx.border}`,
    background: nx.secondaryCtaBg,
    color: nx.muted,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  };

  const themeChip = (selected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: `1px solid ${selected ? nx.borderStrong : nx.border}`,
    background: selected ? nx.accentSoft : nx.bgPanelSoft,
    color: selected ? nx.accentMuted : nx.text,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  });

  const settingsPanelBody = (
    <>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Theme
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={themeChip(themeMode === "night")} onClick={() => setThemeMode("night")}>
          Night
        </button>
        <button type="button" style={themeChip(themeMode === "day")} onClick={() => setThemeMode("day")}>
          Day
        </button>
        <button type="button" style={themeChip(themeMode === "auto")} onClick={() => setThemeMode("auto")}>
          Auto
        </button>
      </div>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Scene background
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <button type="button" style={rowBtn} onClick={() => applyPreset("dark_space")}>
          Dark space
        </button>
        <button type="button" style={rowBtn} onClick={() => applyPreset("grid")}>
          Grid
        </button>
        <button type="button" style={rowBtn} onClick={() => applyPreset("minimal")}>
          Minimal
        </button>
      </div>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Stars</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" style={rowBtn} onClick={() => emitPrefsPatch({ starDensity: 0.62, theme: "stars" })}>
          On
        </button>
        <button type="button" style={rowBtn} onClick={() => emitPrefsPatch({ starDensity: 0, theme: "night" })}>
          Off
        </button>
      </div>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Motion</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" style={rowBtn} onClick={() => emitPrefsPatch({ motionIntensity: "low" })}>
          Low
        </button>
        <button type="button" style={rowBtn} onClick={() => emitPrefsPatch({ motionIntensity: "normal" })}>
          Normal
        </button>
      </div>
      {isDevMode ? (
        <>
          <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Dev Tools
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              type="button"
              style={rowBtn}
              onClick={() => {
                if (process.env.NODE_ENV !== "production") {
                  globalThis.console?.debug?.("[Nexora][Settings] dev_tools_mounted");
                  globalThis.console?.debug?.("[Nexora][Settings] roadmap_clicked");
                }
                emitDevToolsEvent("roadmap");
                setOpen(false);
              }}
            >
              🧭 Dev / RoadMap
            </button>
            <button
              type="button"
              style={rowBtn}
              onClick={() => {
                if (process.env.NODE_ENV !== "production") {
                  globalThis.console?.debug?.("[Nexora][Settings] dev_tools_mounted");
                  globalThis.console?.debug?.("[Nexora][Settings] debug_toggle");
                }
                emitDevToolsEvent("debug");
              }}
            >
              🛠 Self-Debug Show
            </button>
          </div>
        </>
      ) : null}
    </>
  );

  if (variant === "navInput") {
    return (
      <div ref={rootRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          type="button"
          title="Input / Data source"
          aria-label="Open input and data source in workspace"
          onClick={() => {
            if (process.env.NODE_ENV !== "production") {
              console.log("[Nexora][SourcePanelOpen]", { surface: "center_workspace" });
            }
            window.dispatchEvent(new CustomEvent("nexora:open-input-center"));
          }}
          style={navInputTriggerStyle}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden>
            📡
          </span>
        </button>
      </div>
    );
  }

  return (
    <div ref={rootRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        aria-expanded={variant === "header" ? open : variant === "navSettings" ? open : undefined}
        aria-haspopup="true"
        title={variant === "navSettings" ? "Settings" : "Settings"}
        aria-label={variant === "navSettings" ? "Open settings" : "Settings"}
        onClick={() => {
          setOpen((v) => !v);
        }}
        style={variant === "navSettings" ? navSettingsTriggerStyle : headerTriggerStyle}
      >
        {variant === "navSettings" ? <GearIcon /> : "Settings"}
      </button>
      {open && variant === "header" && menuPanelInlineStyle ? (
        <div ref={menuPanelRef} className="nexora-settings-popover" style={menuPanelInlineStyle}>
          {settingsPanelBody}
        </div>
      ) : null}
      {open && variant === "navSettings" && menuPanelFixedStyle && typeof document !== "undefined"
        ? createPortal(
            <div ref={menuPanelRef} className="nexora-settings-popover" style={menuPanelFixedStyle}>
              {settingsPanelBody}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

const rowBtn: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderRadius: 8,
  border: `1px solid ${nx.border}`,
  background: nx.bgDeep,
  color: nx.text,
  fontSize: 12,
  cursor: "pointer",
};
