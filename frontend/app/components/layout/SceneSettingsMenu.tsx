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

type SceneSettingsMenuProps = {
  /** Icon-only trigger for left nav; menu opens to the right of the rail (portaled). */
  variant?: "header" | "navIcon";
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

  const updateNavPopoverLayout = useCallback(() => {
    if (variant !== "navIcon" || !open) return;
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
    if (!open || variant !== "navIcon") {
      setNavPopoverLayout(null);
      return;
    }
    updateNavPopoverLayout();
  }, [open, variant, updateNavPopoverLayout]);

  useEffect(() => {
    if (!open || variant !== "navIcon") return;
    const onResizeOrScroll = () => updateNavPopoverLayout();
    window.addEventListener("resize", onResizeOrScroll);
    window.addEventListener("scroll", onResizeOrScroll, true);
    return () => {
      window.removeEventListener("resize", onResizeOrScroll);
      window.removeEventListener("scroll", onResizeOrScroll, true);
    };
  }, [open, variant, updateNavPopoverLayout]);

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
    width: variant === "navIcon" ? NAV_POPOVER_WIDTH : undefined,
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
    variant === "navIcon"
      ? null
      : {
          position: "absolute",
          right: 0,
          top: "calc(100% + 8px)",
          zIndex: 50,
          ...menuPanelBase,
        };

  const menuPanelFixedStyle: React.CSSProperties | null =
    variant === "navIcon" && navPopoverLayout
      ? {
          position: "fixed",
          left: navPopoverLayout.left,
          bottom: navPopoverLayout.bottom,
          maxHeight: navPopoverLayout.maxHeight,
          zIndex: 200,
          ...menuPanelBase,
        }
      : null;

  const triggerStyle: React.CSSProperties =
    variant === "navIcon"
      ? {
          width: 44,
          height: 44,
          padding: 0,
          borderRadius: 12,
          border: `1px solid ${nx.border}`,
          background: nx.bgPanelSoft,
          color: nx.lowMuted,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }
      : {
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
    </>
  );

  return (
    <div ref={rootRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        title="Settings"
        aria-label="Settings"
        onClick={() => setOpen((v) => !v)}
        style={triggerStyle}
      >
        {variant === "navIcon" ? <GearIcon /> : "Settings"}
      </button>
      {open && variant === "header" && menuPanelInlineStyle ? (
        <div ref={menuPanelRef} style={menuPanelInlineStyle}>
          {settingsPanelBody}
        </div>
      ) : null}
      {open && variant === "navIcon" && menuPanelFixedStyle && typeof document !== "undefined"
        ? createPortal(
            <div ref={menuPanelRef} style={menuPanelFixedStyle}>
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
