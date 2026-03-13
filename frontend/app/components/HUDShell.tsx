import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ConfigHealthBadge } from "./ConfigHealthBadge";
import type { LayoutMode, HUDTabKey as ContractHUDTabKey } from "../lib/contracts";

export type HUDTabKey = ContractHUDTabKey | "kpi" | "scene" | "object" | "decisions";

export type HUDPanelsMap = Partial<Record<HUDTabKey, React.ReactNode>>;

export function HUDPanels({
  activeTab,
  panels,
  layoutMode,
  splitColumns,
}: {
  activeTab: HUDTabKey;
  panels: HUDPanelsMap;
  layoutMode?: LayoutMode;
  splitColumns?: string;
}): React.ReactElement {
  const isFloating = layoutMode === "floating";
  const content = panels[activeTab] ?? <div style={{ opacity: 0.7 }}>No panel selected.</div>;
  const isChatTab = activeTab === "chat";

  return (
    <div
      style={{
        flex: "1 1 0%",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {isChatTab ? (
        // Chat manages its own internal scroll + pinned composer.
        // Do NOT add any scrolling wrappers above it.
        <div
          style={{
            flex: "1 1 0%",
            minHeight: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {content}
        </div>
      ) : (
        // Other panels can scroll at the panel level.
        <div
          style={{
            flex: "1 1 0%",
            minHeight: 0,
            minWidth: 0,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              minWidth: 0,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

export function HUDShell({
  activeTab,
  onChangeTab,
  panels,
  right,
  topRight,
  headerControls,
  showStatusBadges = true,
  status,
  storageKey,
  defaultWidth,
  minWidth,
  maxWidth,
  widthPx: widthPxProp,
  onWidthPxChange,
  companyId,
  companyName,
  availableCompanies,
  onCompanyChange,
  configLoading,
  configError,
  onRefreshConfig,
  theme,
  draggable = true,
  layoutMode = "floating",
  onChangeLayoutMode,
  dockSide: dockSideProp,
  onDockSideChange,
}: {
  activeTab: HUDTabKey;
  onChangeTab: (tab: HUDTabKey) => void;
  panels?: HUDPanelsMap;
  right?: React.ReactNode;
  topRight?: React.ReactNode;
  headerControls?: React.ReactNode;
  showStatusBadges?: boolean;
  status?: {
    loopsCount?: number;
    selectedObjectId?: string | null;
    selectedObjectLabel?: string | null;
    modeName?: string | null;
    modeLabel?: string | null;
  };
  storageKey?: string;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  widthPx?: number;
  onWidthPxChange?: (widthPx: number) => void;
  companyId: string;
  companyName?: string;
  availableCompanies?: Array<{ id: string; name?: string }>;
  onCompanyChange?: (id: string) => void;
  configLoading?: boolean;
  configError?: string | null;
  onRefreshConfig?: () => void;
  theme?: {
    bg?: string;
    border?: string;
    text?: string;
    mutedText?: string;
    accent?: string;
    panelBg?: string;
  } | null;
  draggable?: boolean;
  layoutMode?: LayoutMode;
  onChangeLayoutMode?: (mode: LayoutMode) => void;
  dockSide?: "left" | "right";
  onDockSideChange?: (side: "left" | "right") => void;
}): React.ReactElement {
  const key = storageKey ?? "nexora_hud";
  const hudTheme = theme ?? {};
  const accent = hudTheme.accent ?? "rgba(34,211,238,0.18)";
  const isDraggable = draggable !== false;
  const canFloatDrag = isDraggable && layoutMode === "floating";
  const hudRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const [widthPxInternal, setWidthPxInternal] = useState<number>(defaultWidth ?? 520);
  const isWidthControlled = typeof widthPxProp === "number";
  const effectiveWidthPx = isWidthControlled ? widthPxProp! : widthPxInternal;
  const renderWidthPx = isMounted ? effectiveWidthPx : (defaultWidth ?? 520);
  const setWidthPxSafe = useCallback(
    (next: number) => {
      onWidthPxChange?.(next);
      if (!isWidthControlled) setWidthPxInternal(next);
    },
    [isWidthControlled, onWidthPxChange]
  );

  // drag-resize
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(effectiveWidthPx);

  const minW = minWidth ?? 380;
  const maxW = maxWidth ?? 860;

  // Ensure Floating mode never ends up too narrow (e.g. after switching from split/rail widths)
  const FLOATING_MIN_PX = minW;
  const safeRenderWidthPx =
    layoutMode === "floating" ? Math.max(FLOATING_MIN_PX, renderWidthPx) : renderWidthPx;

  useEffect(() => {
    if (layoutMode !== "floating") return;
    if (effectiveWidthPx >= FLOATING_MIN_PX) return;
    // Snap back to a sensible default so header controls (collapse button) are always visible.
    setWidthPxSafe(defaultWidth ?? 520);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutMode]);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dockSide, setDockSide] = useState<"left" | "right">("left");
  const isDockControlled = dockSideProp !== undefined;
  const effectiveDockSide = dockSideProp ?? dockSide;
  const renderDockSide: "left" | "right" = isMounted ? effectiveDockSide : "left";
  const setDockSideSafe = useCallback(
    (side: "left" | "right") => {
      onDockSideChange?.(side);
      if (!isDockControlled) setDockSide(side);
    },
    [isDockControlled, onDockSideChange]
  );
  const openDocked = useCallback(
    (side: "left" | "right") => {
      setDockSideSafe(side);
      setCollapsed(false);
    },
    [setDockSideSafe]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        collapsed?: boolean;
        widthPx?: number;
        dragOffset?: { x?: number; y?: number };
        dockSide?: "left" | "right";
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
        setDockSide(parsed.dockSide);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isWidthControlled]);

  useEffect(() => {
    try {
      const widthForStorage = isWidthControlled ? undefined : widthPxInternal;
      const base = { collapsed, dragOffset } as any;
      if (typeof widthForStorage === "number") base.widthPx = widthForStorage;

      const payload = isDockControlled ? base : { ...base, dockSide };
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [key, collapsed, dragOffset, dockSide, isDockControlled, isWidthControlled, widthPxInternal]);

  const clampDragOffset = useCallback(
    (next: { x: number; y: number }) => {
      if (typeof window === "undefined") return next;

      const sideMargin = 8;
      const top = 60;
      const margin = 8;

      const width = hudRef.current?.offsetWidth ?? effectiveWidthPx;
      const height = hudRef.current?.offsetHeight ?? Math.round(window.innerHeight * 0.88);

      // Base anchor depends on dockSide.
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
    [effectiveWidthPx, effectiveDockSide]
  );
  const snapFloatingToSide = useCallback(
    (side: "left" | "right") => {
      setDockSideSafe(side);
      // Reset offset so the HUD anchors cleanly to the chosen side.
      setDragOffset((prev) => clampDragOffset({ x: 0, y: prev.y }));
    },
    [clampDragOffset, setDockSideSafe]
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

  const onDragStart = useCallback((e: React.PointerEvent) => {
    if (!canFloatDrag) return;
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragPointerIdRef.current = e.pointerId;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragOffsetRef.current = dragOffset;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [dragOffset, canFloatDrag]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const isHandleOnLeft = effectiveDockSide === "right";
      const dx = isHandleOnLeft ? startXRef.current - e.clientX : e.clientX - startXRef.current;
      const next = Math.min(maxW, Math.max(minW, startWidthRef.current + dx));
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
  }, [minW, maxW, effectiveDockSide, setWidthPxSafe]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!canFloatDrag) return;
      if (!isDraggingRef.current) return;
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
  }, [clampDragOffset, canFloatDrag]);

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
  }, [clampDragOffset, layoutMode]);

  const tabs = useMemo<HUDTabKey[]>(
    () => ["chat", "kpi", "scene", "object", "loops", "decisions"],
    []
  );

  const tabLabel: Record<HUDTabKey, string> = {
    // New/contract tabs
    chat: "Chat",
    decision: "Decision",
    loops: "Loops",
    objects: "Objects",
    insights: "Insights",
    settings: "Settings",
    diagnostics: "Diagnostics",

    // Legacy tabs (kept for compatibility)
    kpi: "KPI",
    scene: "Scene",
    object: "Object",
    decisions: "Decisions",
  };
  const tabIcon: Record<HUDTabKey, string> = {
    // New/contract tabs
    chat: "💬",
    decision: "🧭",
    loops: "⟲",
    objects: "⬡",
    insights: "✦",
    settings: "⚙",
    diagnostics: "🧪",

    // Legacy tabs (kept for compatibility)
    kpi: "KPI",
    scene: "3D",
    object: "OBJ",
    decisions: "DEC",
  };

  const [panelAnim, setPanelAnim] = useState<"enter" | "idle">("idle");

  useLayoutEffect(() => {
    // trigger a short enter animation whenever the active tab changes
    setPanelAnim("enter");
    const id = requestAnimationFrame(() => setPanelAnim("idle"));
    return () => cancelAnimationFrame(id);
  }, [activeTab]);

  const handleChangeTab = useCallback(
    (tab: HUDTabKey) => {
      if (collapsed) setCollapsed(false);
      onChangeTab(tab);
    },
    [collapsed, onChangeTab]
  );

  if (collapsed) {
    if (layoutMode === "floating") {
      // Render via portal so no parent wrapper can intercept clicks on the scene.
      if (typeof document === "undefined") {
        return <></>;
      }

      return createPortal(
        <div
          style={{
            position: "fixed",
            top: 80,
            zIndex: 1200,
            ...(renderDockSide === "left" ? { left: 8 } : { right: 8 }),
            pointerEvents: "auto",
          }}
        >
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Open HUD"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              padding: "10px 8px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(10,12,18,0.85)",
              color: "rgba(255,255,255,0.85)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              pointerEvents: "auto",
            }}
          >
            Nexora HUD
          </button>
        </div>,
        document.body
      );
    }

    const railWidth = 56;
    const gridCols = renderDockSide === "left" ? `${railWidth}px 1fr` : `1fr ${railWidth}px`;
    const railColumn = renderDockSide === "left" ? 1 : 2;
    const spacerColumn = renderDockSide === "left" ? 2 : 1;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridCols,
          height: "100%",
          width: "100%",
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            gridColumn: railColumn,
            width: railWidth,
            minWidth: railWidth,
            maxWidth: railWidth,
            height: "100%",
            position: "relative",
            pointerEvents: "auto",
            borderRight: renderDockSide === "left" ? "1px solid rgba(255,255,255,0.10)" : "none",
            borderLeft: renderDockSide === "right" ? "1px solid rgba(255,255,255,0.10)" : "none",
            background: hudTheme.panelBg ?? "rgba(10,12,18,0.82)",
            color: hudTheme.text ?? "#eaeaea",
          }}
        >
          <div style={{ position: "absolute", left: 8, top: 8, display: "grid", gap: 6 }}>
            <button
              type="button"
              onClick={() => openDocked("left")}
              title="Open HUD (Left)"
              style={{
                height: 40,
                borderRadius: 12,
                border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                background: accent,
                color: hudTheme.text ?? "rgba(255,255,255,0.92)",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 12,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ⇤
            </button>
            <button
              type="button"
              onClick={() => openDocked("right")}
              title="Open HUD (Right)"
              style={{
                height: 40,
                borderRadius: 12,
                border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                background: accent,
                color: hudTheme.text ?? "rgba(255,255,255,0.92)",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 12,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ⇥
            </button>
          </div>
        </div>
        <div style={{ gridColumn: spacerColumn, minWidth: 0, minHeight: 0, pointerEvents: "none" }} />
      </div>
    );
  }

  const splitColumns =
    layoutMode === "floating"
      ? undefined
      : renderDockSide === "left"
        ? `${renderWidthPx}px 1fr`
        : `1fr ${renderWidthPx}px`;
  const hudColumn = renderDockSide === "left" ? 1 : 2;
  const spacerColumn = renderDockSide === "left" ? 2 : 1;

  const isFloatingMode = layoutMode === "floating";
  return (
    <div
      ref={hudRef}
      suppressHydrationWarning
      style={{
        // Floating mode is a viewport overlay; Split mode must fully fill the HomeScreen parent.
        position: isFloatingMode ? "fixed" : "relative",

        ...(isFloatingMode
          ? {
              top: 60,
              ...(renderDockSide === "left" ? { left: 8 } : { right: 8 }),
              width: safeRenderWidthPx,
              maxWidth: "65vw",
              height: "calc(100dvh - 72px)",
              maxHeight: "calc(100dvh - 72px)",
            }
          : {
              // In split mode, fill the parent via normal layout (more reliable than absolute+inset
              // when different HomeScreen branches wrap the HUD differently).
              width: "100%",
              height: "100dvh",
              maxWidth: "100%",
              maxHeight: "100dvh",
            }),

        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",

        gridTemplateColumns: isFloatingMode ? undefined : splitColumns,
        flexShrink: 0,

        border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.12)"}`,
        boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
        borderRadius: 18,
        zIndex: 1200,

        transform:
          isFloatingMode && canFloatDrag
            ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
            : "none",
        // Make the OUTER wrapper click-through
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          width: "100%",
          height: "100%",
          minHeight: 0,
          minWidth: 0,
        }}
      >
      <div
        style={{
          gridColumn: layoutMode === "floating" ? undefined : hudColumn,
          position: "relative",
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",

          // IMPORTANT: This wrapper must ALWAYS stretch to the full HUD height.
          // In floating mode (root is flex-column), `flex: 1` is required.
          // In split mode (root is grid), `height: 100%` + stretch guarantees the inset background
          // and panel area get the full available height on BOTH left/right sides.
          flex: "1 1 0%",
          height: "100%",
          maxHeight: "100%",
          alignSelf: "stretch",

          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          background: hudTheme.bg ?? "rgba(10,10,12,0.65)",
          backdropFilter: "blur(10px)",
          pointerEvents: "none",
        }}
      />
      {isDraggable ? (
        <div
          onMouseDown={onResizeStart}
          style={{
            position: "absolute",
            ...(renderDockSide === "left" ? { right: 0 } : { left: 0 }),
            top: 0,
            bottom: 0,
            width: 6,
            cursor: "ew-resize",
            background: "rgba(255,255,255,0.02)",
            zIndex: 2,
          }}
          title="Drag to resize"
        />
      ) : null}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
          maxHeight: "100%",
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
          color: hudTheme.text ?? "#eaeaea",
          opacity: 1,
          filter: "none",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "geometricPrecision",
        }}
      >
      <div
        onPointerDown={canFloatDrag ? onDragStart : undefined}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "10px 12px",
          background: hudTheme.panelBg ?? "rgba(10,12,18,0.82)",
          border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.10)"}`,
          borderBottom: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.10)"}`,
          minHeight: 60,
          height: "auto",
          cursor: canFloatDrag ? (isDragging ? "grabbing" : "grab") : "default",
          overflow: "visible",
          boxSizing: "border-box",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
            title={companyName}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.05,
                flexShrink: 0,
                paddingTop: 2,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: 0.2,
                  color: hudTheme.text ?? "rgba(255,255,255,0.98)",
                  textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                  marginTop: -2,
                }}
              >
                StateStudio
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontSize: 12,
                  fontWeight: 800,
                  color: hudTheme.mutedText ?? "rgba(255,255,255,0.80)",
                  textShadow: "0 1px 6px rgba(0,0,0,0.45)",
                  alignSelf: "center",
                }}
              >
                Nexora
              </div>
            </div>
            <ConfigHealthBadge />
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              minWidth: 180,
              maxWidth: 320,
              flexWrap: "wrap",
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: hudTheme.text ?? "rgba(255,255,255,0.92)",
              }}
            >
              Company
            </span>
            <select
              value={companyId}
              onChange={(e) => onCompanyChange?.(e.target.value)}
              style={{
                padding: "4px 8px",
                borderRadius: 10,
                border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                background: "rgba(0,0,0,0.35)",
                color: "white",
                fontSize: 11,
                minWidth: 90,
              }}
            >
              {(availableCompanies && availableCompanies.length
                ? availableCompanies
                : [{ id: companyId, name: companyName ?? companyId }]
              ).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? c.id}
                </option>
              ))}
            </select>
            {configLoading ? (
              <span style={{ fontSize: 11, color: hudTheme.mutedText ?? "rgba(255,255,255,0.75)" }}>
                Loading config…
              </span>
            ) : null}
            {configError ? (
              <span style={{ fontSize: 11, color: "rgba(255,180,0,0.9)" }}>
                Config error
              </span>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: 2,
                borderRadius: 999,
                border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <button
                type="button"
                onClick={() => snapFloatingToSide("left")}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: renderDockSide === "left" ? accent : "transparent",
                  color: hudTheme.text ?? "rgba(255,255,255,0.9)",
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Dock Left"
                aria-label="Dock Left"
              >
                ⇤
              </button>
              <button
                type="button"
                onClick={() => snapFloatingToSide("right")}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: renderDockSide === "right" ? accent : "transparent",
                  color: hudTheme.text ?? "rgba(255,255,255,0.9)",
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Dock Right"
                aria-label="Dock Right"
              >
                ⇥
              </button>
            </div>
            {topRight ? <div>{topRight}</div> : null}
            <button
              type="button"
              onClick={() => onRefreshConfig?.()}
              title="Refresh configuration"
              aria-label="Refresh"
              style={{
                padding: 0,
                borderRadius: 10,
                border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                background: "rgba(255,255,255,0.06)",
                color: hudTheme.text ?? "rgba(255,255,255,0.85)",
                cursor: "pointer",
                fontSize: 16,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
              }}
            >
              ↻
            </button>

            {layoutMode === "floating" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCollapsed(true);
                }}
                title="Collapse HUD"
                aria-label="Collapse HUD"
                style={{
                  padding: 0,
                  borderRadius: 10,
                  border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                  background: "rgba(255,255,255,0.06)",
                  color: hudTheme.text ?? "rgba(255,255,255,0.85)",
                  cursor: "pointer",
                  fontSize: 16,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "none",
                }}
              >
                ⟂
              </button>
            ) : null}
          </div>
        </div>

        {(showStatusBadges || headerControls) ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              minWidth: 0,
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {showStatusBadges ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  minWidth: 0,
                  flex: "1 1 0%",
                }}
              >
                {typeof status?.loopsCount === "number" ? (
                  <div
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                      background: "rgba(255,255,255,0.06)",
                      fontSize: 11,
                      color: hudTheme.mutedText ?? "rgba(255,255,255,0.85)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Loops: {status.loopsCount}
                  </div>
                ) : null}

                <div
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                    background: "rgba(255,255,255,0.06)",
                    fontSize: 11,
                    color: hudTheme.mutedText ?? "rgba(255,255,255,0.85)",
                    maxWidth: 320,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Object: {status?.selectedObjectLabel ?? status?.selectedObjectId ?? "None"}
                </div>

                <div
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
                    background: "rgba(255,255,255,0.06)",
                    fontSize: 11,
                    color: hudTheme.mutedText ?? "rgba(255,255,255,0.85)",
                    maxWidth: 320,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Mode: {status?.modeLabel ?? status?.modeName ?? "—"}
                </div>
              </div>
            ) : (
              <div style={{ flex: "1 1 0%" }} />
            )}

            {headerControls ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  marginLeft: "auto",
                  justifyContent: "flex-end",
                  maxWidth: "100%",
                }}
              >
                {headerControls}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 56,
            padding: "10px 8px",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleChangeTab(tab)}
              title={tabLabel[tab]}
              style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
            background:
              activeTab === tab
                ? accent
                : "rgba(255,255,255,0.04)",
            color: hudTheme.text ?? "rgba(255,255,255,0.9)",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.4,
            outline: "none",
            padding: 0,
            boxShadow: activeTab === tab ? `0 8px 18px ${accent}` : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
                <div style={{ fontSize: 16 }}>{tabIcon[tab]}</div>
              <div style={{ marginTop: 4, fontSize: 9, color: hudTheme.mutedText ?? "rgba(255,255,255,0.85)" }}>
                {tabLabel[tab]}
              </div>
            </div>
          </button>
        ))}
      </div>

        <div
          style={{
            flex: 1,
            padding: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 12,
              borderRadius: 14,
              border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.10)"}`,
              background: hudTheme.panelBg ?? "rgba(10,12,18,0.75)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
              minWidth: 0,
              flex: "1 1 0%",
              height: "100%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: activeTab === "chat" ? "visible" : "hidden",
            }}
          >
            <div
              key={activeTab}
              style={{
                transition: "opacity 160ms ease, transform 160ms ease",
                opacity: panelAnim === "enter" ? 0 : 1,
                transform: panelAnim === "enter" ? "translateY(6px)" : "translateY(0)",
                willChange: "opacity, transform",
                flex: "1 1 0%",
                minHeight: 0,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                height: "100%",
                maxHeight: "100%",
                overflow: activeTab === "chat" ? "visible" : "hidden",
              }}
            >
              <div
                style={{
                  flex: "1 1 0%",
                  minHeight: 0,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    flex: "1 1 0%",
                    minHeight: 0,
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  {panels ? (
                    <HUDPanels activeTab={activeTab} panels={panels} layoutMode={layoutMode} splitColumns={splitColumns} />
                  ) : (
                    <div
                      style={{
                        flex: 1,
                        minHeight: 0,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          flex: "1 1 0%",
                          minHeight: 0,
                          minWidth: 0,
                          overflow: "auto",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        {right ?? <div style={{ opacity: 0.7 }}>No panel selected.</div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      {layoutMode === "floating" ? null : (
        <div
          style={{
            gridColumn: spacerColumn,
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            pointerEvents: "none",
            // Galaxy / nebula backdrop (pure CSS gradients, no images)
            backgroundColor: "rgb(6, 8, 12)",
            backgroundImage: [
              "radial-gradient(1200px 900px at 20% 25%, rgba(120, 70, 255, 0.22), rgba(6, 8, 12, 0) 58%)",
              "radial-gradient(900px 700px at 75% 35%, rgba(60, 210, 255, 0.16), rgba(6, 8, 12, 0) 60%)",
              "radial-gradient(700px 600px at 60% 80%, rgba(255, 120, 210, 0.10), rgba(6, 8, 12, 0) 62%)",
              "radial-gradient(2px 2px at 12% 18%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 60%)",
              "radial-gradient(1.5px 1.5px at 32% 72%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 60%)",
              "radial-gradient(1.2px 1.2px at 68% 22%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 60%)",
              "radial-gradient(1px 1px at 82% 64%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 60%)",
              "linear-gradient(180deg, rgba(6, 8, 12, 0.92), rgba(6, 8, 12, 0.86))",
            ].join(","),
            boxShadow:
              "inset 0 0 120px rgba(0,0,0,0.65), inset 0 0 36px rgba(0,0,0,0.55)",
          }}
        />
      )}
    </div>
  );
}
