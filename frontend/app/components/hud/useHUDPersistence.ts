import { useCallback, useEffect, useState } from "react";
import type { HUDDockSide } from "./hudTypes";

type UseHUDPersistenceArgs = {
  storageKey: string;
  defaultWidth?: number;
  widthPx?: number;
  onWidthPxChange?: (widthPx: number) => void;
  dockSide?: HUDDockSide;
  onDockSideChange?: (side: HUDDockSide) => void;
};

export function useHUDPersistence({
  storageKey,
  defaultWidth,
  widthPx,
  onWidthPxChange,
  dockSide,
  onDockSideChange,
}: UseHUDPersistenceArgs) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const [widthPxInternal, setWidthPxInternal] = useState<number>(defaultWidth ?? 520);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dockSideInternal, setDockSideInternal] = useState<HUDDockSide>("left");

  const isWidthControlled = typeof widthPx === "number";
  const effectiveWidthPx = isWidthControlled ? widthPx : widthPxInternal;
  const renderWidthPx = isMounted ? effectiveWidthPx : (defaultWidth ?? 520);
  const isDockControlled = dockSide !== undefined;
  const effectiveDockSide = dockSide ?? dockSideInternal;
  const renderDockSide: HUDDockSide = isMounted ? effectiveDockSide : "left";

  const setWidthPxSafe = useCallback(
    (next: number) => {
      onWidthPxChange?.(next);
      if (!isWidthControlled) {
        setWidthPxInternal(next);
      }
    },
    [isWidthControlled, onWidthPxChange]
  );

  const setDockSideSafe = useCallback(
    (side: HUDDockSide) => {
      onDockSideChange?.(side);
      if (!isDockControlled) {
        setDockSideInternal(side);
      }
    },
    [isDockControlled, onDockSideChange]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        collapsed?: boolean;
        widthPx?: number;
        dragOffset?: { x?: number; y?: number };
        dockSide?: HUDDockSide;
      };
      if (typeof parsed.collapsed === "boolean") setCollapsed(parsed.collapsed);
      if (!isWidthControlled && typeof parsed.widthPx === "number") setWidthPxInternal(parsed.widthPx);
      if (
        parsed.dragOffset &&
        typeof parsed.dragOffset.x === "number" &&
        typeof parsed.dragOffset.y === "number"
      ) {
        setDragOffset({ x: parsed.dragOffset.x, y: parsed.dragOffset.y });
      }
      if (!isDockControlled && (parsed.dockSide === "left" || parsed.dockSide === "right")) {
        setDockSideInternal(parsed.dockSide);
      }
    } catch {
      // ignore
    }
  }, [storageKey, isDockControlled, isWidthControlled]);

  useEffect(() => {
    try {
      const widthForStorage = isWidthControlled ? undefined : widthPxInternal;
      const base = { collapsed, dragOffset } as {
        collapsed: boolean;
        dragOffset: { x: number; y: number };
        widthPx?: number;
      };
      if (typeof widthForStorage === "number") {
        base.widthPx = widthForStorage;
      }

      const payload = isDockControlled ? base : { ...base, dockSide: dockSideInternal };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [collapsed, dockSideInternal, dragOffset, isDockControlled, isWidthControlled, storageKey, widthPxInternal]);

  return {
    collapsed,
    setCollapsed,
    dragOffset,
    setDragOffset,
    effectiveDockSide,
    effectiveWidthPx,
    isDockControlled,
    isMounted,
    isWidthControlled,
    renderDockSide,
    renderWidthPx,
    setDockSideSafe,
    setWidthPxSafe,
  };
}
