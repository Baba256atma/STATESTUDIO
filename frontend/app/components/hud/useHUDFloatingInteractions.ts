import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LayoutMode } from "../../lib/contracts";
import type { HUDDockSide } from "./hudTypes";

type UseHUDFloatingInteractionsArgs = {
  canFloatDrag: boolean;
  dragOffset: { x: number; y: number };
  effectiveDockSide: HUDDockSide;
  effectiveWidthPx: number;
  hudRef: React.RefObject<HTMLDivElement | null>;
  layoutMode: LayoutMode;
  maxWidth: number;
  minWidth: number;
  setDockSideSafe: (side: HUDDockSide) => void;
  setDragOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setWidthPxSafe: (next: number) => void;
};

export function useHUDFloatingInteractions({
  canFloatDrag,
  dragOffset,
  effectiveDockSide,
  effectiveWidthPx,
  hudRef,
  layoutMode,
  maxWidth,
  minWidth,
  setDockSideSafe,
  setDragOffset,
  setWidthPxSafe,
}: UseHUDFloatingInteractionsArgs) {
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(effectiveWidthPx);

  const isDraggingRef = useRef(false);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const clampDragOffset = useCallback(
    (next: { x: number; y: number }) => {
      if (typeof window === "undefined") return next;

      const sideMargin = 8;
      const top = 60;
      const margin = 8;

      const width = hudRef.current?.offsetWidth ?? effectiveWidthPx;
      const height = hudRef.current?.offsetHeight ?? Math.round(window.innerHeight * 0.88);
      const baseLeft = effectiveDockSide === "left" ? sideMargin : window.innerWidth - width - sideMargin;
      const baseTop = top;

      const minLeft = margin;
      const maxLeft = window.innerWidth - width - margin;
      const minTop = margin;
      const maxTop = window.innerHeight - height - margin;

      const safeMaxLeft = maxLeft < minLeft ? minLeft : maxLeft;
      const safeMaxTop = maxTop < minTop ? minTop : maxTop;
      const clampedLeft = Math.min(Math.max(baseLeft + next.x, minLeft), safeMaxLeft);
      const clampedTop = Math.min(Math.max(baseTop + next.y, minTop), safeMaxTop);

      return { x: clampedLeft - baseLeft, y: clampedTop - baseTop };
    },
    [effectiveDockSide, effectiveWidthPx, hudRef]
  );

  const snapFloatingToSide = useCallback(
    (side: HUDDockSide) => {
      setDockSideSafe(side);
      setDragOffset((prev) => clampDragOffset({ x: 0, y: prev.y }));
    },
    [clampDragOffset, setDockSideSafe, setDragOffset]
  );

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizingRef.current = true;
      startXRef.current = e.clientX;
      startWidthRef.current = effectiveWidthPx;
    },
    [effectiveWidthPx]
  );

  const onDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (!canFloatDrag) return;
      const target = e.target as HTMLElement;
      if (target.closest("button")) return;
      isDraggingRef.current = true;
      setIsDragging(true);
      dragPointerIdRef.current = e.pointerId;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      dragOffsetRef.current = dragOffset;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [canFloatDrag, dragOffset]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const isHandleOnLeft = effectiveDockSide === "right";
      const dx = isHandleOnLeft ? startXRef.current - e.clientX : e.clientX - startXRef.current;
      const next = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + dx));
      setWidthPxSafe(next);
    };
    const onUp = () => {
      isResizingRef.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [effectiveDockSide, maxWidth, minWidth, setWidthPxSafe]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!canFloatDrag || !isDraggingRef.current) return;
      if (dragPointerIdRef.current !== null && e.pointerId !== dragPointerIdRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setDragOffset(clampDragOffset({ x: dragOffsetRef.current.x + dx, y: dragOffsetRef.current.y + dy }));
    };
    const onUp = (e: PointerEvent) => {
      if (dragPointerIdRef.current !== null && e.pointerId !== dragPointerIdRef.current) return;
      isDraggingRef.current = false;
      dragPointerIdRef.current = null;
      setIsDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [canFloatDrag, clampDragOffset, setDragOffset]);

  useEffect(() => {
    const onResize = () => {
      if (layoutMode !== "floating") return;
      setDragOffset((prev) => clampDragOffset(prev));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [clampDragOffset, layoutMode, setDragOffset]);

  return {
    clampDragOffset,
    isDragging,
    onDragStart,
    onResizeStart,
    snapFloatingToSide,
  };
}
