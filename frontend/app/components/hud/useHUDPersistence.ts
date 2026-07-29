import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { HUDDockSide } from "./hudTypes";

type UseHUDPersistenceArgs = {
  storageKey: string;
  defaultWidth?: number;
  widthPx?: number;
  onWidthPxChange?: (widthPx: number) => void;
  dockSide?: HUDDockSide;
  onDockSideChange?: (side: HUDDockSide) => void;
};

function subscribeNoop() {
  return () => {};
}

export function useHUDPersistence({
  storageKey,
  defaultWidth,
  widthPx,
  onWidthPxChange,
  dockSide,
  onDockSideChange,
}: UseHUDPersistenceArgs) {
  // Client hydration gate without setState-in-effect (AD-FE-SHELL-01).
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const [collapsed, setCollapsed] = useState(false);
  const [widthPxInternal, setWidthPxInternal] = useState<number>(defaultWidth ?? 520);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dockSideInternal, setDockSideInternal] = useState<HUDDockSide>("left");
  const [hydratedKey, setHydratedKey] = useState<string | null>(null);

  // One-way localStorage seed into local ownership during render (not an effect).
  if (isClient && hydratedKey !== storageKey) {
    setHydratedKey(storageKey);
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          collapsed?: boolean;
          widthPx?: number;
          dragOffset?: { x?: number; y?: number };
          dockSide?: HUDDockSide;
        };
        if (typeof parsed.collapsed === "boolean") setCollapsed(parsed.collapsed);
        if (typeof parsed.widthPx === "number") setWidthPxInternal(parsed.widthPx);
        if (
          parsed.dragOffset &&
          typeof parsed.dragOffset.x === "number" &&
          typeof parsed.dragOffset.y === "number"
        ) {
          setDragOffset({ x: parsed.dragOffset.x, y: parsed.dragOffset.y });
        }
        if (parsed.dockSide === "left" || parsed.dockSide === "right") {
          setDockSideInternal(parsed.dockSide);
        }
      }
    } catch {
      // ignore
    }
  }

  const isMounted = hydratedKey === storageKey;
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
    if (!isMounted) return;
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
  }, [collapsed, dockSideInternal, dragOffset, isDockControlled, isMounted, isWidthControlled, storageKey, widthPxInternal]);

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
