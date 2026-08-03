"use client";

import { useEffect, useRef, useState } from "react";
import { EXECUTIVE_MODES } from "../shell/executiveCockpitTypes";
import { cockpit } from "../shell/executiveCockpitTheme";
import { EXECUTIVE_MODE_CONFIG } from "./ExecutiveModeConfig";
import { useExecutiveMode } from "./hooks/useExecutiveMode";

/**
 * Executive Mode Selector — Porsche-inspired drive-mode control.
 * Upper-right of Stage. Never navigates the page.
 */
export function ExecutiveModeSelector() {
  const { activeMode, setActiveMode, config } = useExecutiveMode();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      data-testid="executive-mode-selector"
      style={{
        position: "absolute",
        top: "0.9rem",
        right: "0.9rem",
        zIndex: 8,
      }}
    >
      <button
        type="button"
        data-testid="executive-mode-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: "0.5rem 0.8rem",
          borderRadius: cockpit.radius.pill,
          border: `1px solid ${config.accent}99`,
          background: cockpit.glass,
          backdropFilter: "blur(10px)",
          color: cockpit.text,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: `${cockpit.elevation.panel}, 0 0 18px ${config.accent}28`,
          transition: cockpit.transition,
          transform: open ? "scale(1.03)" : "scale(1)",
        }}
      >
        <span
          aria-hidden
          style={{
            width: "0.6rem",
            height: "0.6rem",
            borderRadius: cockpit.radius.pill,
            border: `1.5px solid ${config.accent}`,
            background: `radial-gradient(circle at 35% 35%, ${config.accent}, ${config.accent}44)`,
            boxShadow: `0 0 10px ${config.accent}`,
            transition: cockpit.transition,
          }}
        />
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            lineHeight: 1.15,
          }}
        >
          <span
            style={{
              fontSize: cockpit.type.status.size,
              letterSpacing: cockpit.type.status.tracking,
              textTransform: "uppercase",
              color: cockpit.lowMuted,
              fontWeight: cockpit.type.status.weight,
            }}
          >
            Executive Mode
          </span>
          <span
            data-testid="executive-mode-current"
            data-mode={activeMode}
            data-active="true"
            style={{
              fontSize: "0.88rem",
              fontWeight: 600,
              letterSpacing: "0.03em",
              color: config.accent,
              transition: `color ${cockpit.motion.calm} ${cockpit.motion.easing}`,
            }}
          >
            {activeMode}
          </span>
        </span>
        <span
          aria-hidden
          style={{
            marginLeft: "0.15rem",
            color: cockpit.muted,
            fontSize: "0.65rem",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: `transform ${cockpit.motion.fast} ${cockpit.motion.easing}`,
          }}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Executive modes"
          data-testid="executive-mode-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 0.45rem)",
            right: 0,
            minWidth: "12.5rem",
            padding: "0.4rem",
            borderRadius: cockpit.radius.lg,
            border: `1px solid ${config.accent}55`,
            background: "rgba(10, 14, 22, 0.97)",
            backdropFilter: "blur(12px)",
            boxShadow: cockpit.elevation.floating,
            transformOrigin: "top right",
            animation: "exs-mode-menu-in 240ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {EXECUTIVE_MODES.map((item) => {
            const active = item === activeMode;
            const itemAccent = EXECUTIVE_MODE_CONFIG[item].accent;
            return (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={active}
                data-testid={`executive-mode-${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => {
                  setActiveMode(item);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  padding: "0.5rem 0.6rem",
                  border: "none",
                  borderRadius: cockpit.radius.sm,
                  background: active ? `${itemAccent}24` : "transparent",
                  color: active ? itemAccent : cockpit.textSoft,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.82rem",
                  fontWeight: active ? 600 : 450,
                  letterSpacing: "0.02em",
                  textAlign: "left",
                  transition: `background ${cockpit.motion.fast} ${cockpit.motion.easing}, color ${cockpit.motion.fast} ${cockpit.motion.easing}, transform ${cockpit.motion.fast} ${cockpit.motion.easing}`,
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(148,163,184,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: cockpit.radius.pill,
                    border: `1px solid ${itemAccent}`,
                    background: active ? itemAccent : "transparent",
                    boxShadow: active ? `0 0 8px ${itemAccent}` : "none",
                    transition: cockpit.transition,
                  }}
                />
                {item}
              </button>
            );
          })}
        </div>
      ) : null}

      <style>{`
        @keyframes exs-mode-menu-in {
          from { opacity: 0; transform: scale(0.96) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-testid="executive-mode-selector"] * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
