"use client";

import {
  useCallback,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cockpit } from "./executiveCockpitTheme";

type Props = {
  readonly width: number;
  readonly minWidth: number;
  readonly maxWidth: number;
  readonly collapsed?: boolean;
  readonly collapsedWidth?: number;
  readonly onWidthChange: (width: number) => void;
  readonly children: ReactNode;
  readonly style?: CSSProperties;
  readonly testId?: string;
};

/**
 * Sprint 6.5 — Drag-resize panel shell (session-local width).
 * Resize handle on the leading edge; collapse width is separate.
 */
export function ExecutiveResizablePanel({
  width,
  minWidth,
  maxWidth,
  collapsed = false,
  collapsedWidth = cockpit.advisorCollapsedWidth,
  onWidthChange,
  children,
  style,
  testId = "executive-resizable-panel",
}: Props) {
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const displayWidth = collapsed ? collapsedWidth : width;

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (collapsed) return;
      event.preventDefault();
      dragRef.current = { startX: event.clientX, startWidth: width };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [collapsed, width],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current || collapsed) return;
      // Dragging the left edge: move left → widen
      const delta = dragRef.current.startX - event.clientX;
      const next = Math.min(
        maxWidth,
        Math.max(minWidth, dragRef.current.startWidth + delta),
      );
      onWidthChange(next);
    },
    [collapsed, maxWidth, minWidth, onWidthChange],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <aside
      data-testid={testId}
      data-collapsed={collapsed ? "true" : "false"}
      data-width={displayWidth}
      style={{
        width: displayWidth,
        flexShrink: 0,
        position: "relative",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        transition: collapsed
          ? `width 200ms ${cockpit.motion.easing}`
          : `width 220ms ${cockpit.motion.easing}`,
        ...style,
      }}
    >
      {!collapsed ? (
        <div
          data-testid="executive-advisor-resize-handle"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize Advisor panel"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            cursor: "col-resize",
            zIndex: 4,
            background: "transparent",
          }}
        />
      ) : null}
      {children}
    </aside>
  );
}
