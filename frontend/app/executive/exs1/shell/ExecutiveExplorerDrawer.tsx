"use client";

import { useCallback, useRef, type PointerEvent, type ReactNode } from "react";
import {
  explorerTitle,
  type ExecutiveExplorerKind,
} from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";

type Props = {
  readonly kind: ExecutiveExplorerKind;
  readonly title?: string;
  readonly width: number;
  readonly onWidthChange: (width: number) => void;
  readonly onClose: () => void;
  readonly children?: ReactNode;
};

/**
 * Executive Explorer Drawer — single reusable panel.
 * Slides over reserved left space; Stage resizes smoothly.
 */
export function ExecutiveExplorerDrawer({
  kind,
  title,
  width,
  onWidthChange,
  onClose,
  children,
}: Props) {
  const open = kind != null;
  const displayTitle = title ?? explorerTitle(kind);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragRef.current = { startX: event.clientX, startWidth: width };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [width],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const delta = event.clientX - dragRef.current.startX;
      const next = Math.min(
        cockpit.drawerMax,
        Math.max(cockpit.drawerMin, dragRef.current.startWidth + delta),
      );
      onWidthChange(next);
    },
    [onWidthChange],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <aside
      data-testid="executive-explorer-drawer"
      data-open={open ? "true" : "false"}
      data-explorer={kind ?? "none"}
      aria-hidden={!open}
      aria-label={open ? displayTitle : "Explorer closed"}
      style={{
        width: open ? width : 0,
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(180deg, ${cockpit.panel} 0%, ${cockpit.navy} 100%)`,
        borderRight: open ? `1px solid ${cockpit.border}` : "none",
        boxShadow: open ? cockpit.elevation.panel : "none",
        transition: `width ${cockpit.drawerMs} ${cockpit.motion.easing}`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          width,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          opacity: open ? 1 : 0,
          transform: open ? "translateX(0)" : "translateX(-10px)",
          transition: `opacity ${cockpit.drawerMs} ${cockpit.motion.easing}, transform ${cockpit.drawerMs} ${cockpit.motion.easing}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 0.95rem",
            borderBottom: `1px solid ${cockpit.border}`,
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: cockpit.type.status.size,
                letterSpacing: cockpit.type.status.tracking,
                textTransform: "uppercase",
                color: cockpit.lowMuted,
                fontWeight: cockpit.type.status.weight,
              }}
            >
              Explorer
            </p>
            <h2
              data-testid="executive-explorer-title"
              style={{
                margin: "0.3rem 0 0",
                fontSize: cockpit.type.executiveTitle.size,
                fontWeight: cockpit.type.executiveTitle.weight,
                letterSpacing: cockpit.type.executiveTitle.tracking,
                color: cockpit.text,
              }}
            >
              {displayTitle}
            </h2>
          </div>
          <button
            type="button"
            data-testid="executive-explorer-close"
            aria-label="Close explorer"
            onClick={onClose}
            style={{
              border: `1px solid ${cockpit.border}`,
              background: "transparent",
              color: cockpit.muted,
              borderRadius: cockpit.radius.sm,
              width: "1.8rem",
              height: "1.8rem",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: cockpit.transition,
            }}
          >
            ×
          </button>
        </div>

        <div
          data-testid="executive-explorer-body"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: "0.95rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
          }}
        >
          {children ?? (
            <p
              style={{
                margin: 0,
                fontSize: cockpit.type.body.size,
                lineHeight: cockpit.type.body.lineHeight,
                color: cockpit.textSoft,
              }}
            >
              Browse {explorerTitle(kind)} assets without leaving the cockpit.
            </p>
          )}
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize explorer"
          data-testid="executive-explorer-resize"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "4px",
            height: "100%",
            cursor: "col-resize",
            background: "transparent",
          }}
        />
      </div>
    </aside>
  );
}
