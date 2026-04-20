import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { LayoutMode } from "../lib/contracts";
import { HUDCollapsedRail } from "./hud/HUDCollapsedRail";
import { HUDHeader } from "./hud/HUDHeader";
import { HUDTabRail } from "./hud/HUDTabRail";
import type { HUDPanelsMap, HUDShellStatus, HUDTabKey, HUDTheme } from "./hud/hudTypes";
import { useHUDFloatingInteractions } from "./hud/useHUDFloatingInteractions";
import { useHUDPersistence } from "./hud/useHUDPersistence";

export type { HUDPanelsMap, HUDTabKey } from "./hud/hudTypes";

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
  status?: HUDShellStatus;
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
  theme?: HUDTheme;
  draggable?: boolean;
  layoutMode?: LayoutMode;
  onChangeLayoutMode?: (mode: LayoutMode) => void;
  dockSide?: "left" | "right";
  onDockSideChange?: (side: "left" | "right") => void;
}): React.ReactElement {
  void onChangeLayoutMode;

  const key = storageKey ?? "nexora_hud";
  const hudTheme = theme ?? {};
  const accent = hudTheme.accent ?? "rgba(34,211,238,0.18)";
  const isDraggable = draggable !== false;
  const canFloatDrag = isDraggable && layoutMode === "floating";
  const hudRef = useRef<HTMLDivElement | null>(null);

  const {
    collapsed,
    setCollapsed,
    dragOffset,
    setDragOffset,
    effectiveDockSide,
    effectiveWidthPx,
    renderDockSide,
    renderWidthPx,
    setDockSideSafe,
    setWidthPxSafe,
  } = useHUDPersistence({
    storageKey: key,
    defaultWidth,
    widthPx: widthPxProp,
    onWidthPxChange,
    dockSide: dockSideProp,
    onDockSideChange,
  });

  const minW = minWidth ?? 380;
  const maxW = maxWidth ?? 860;
  const floatingMinPx = minW;
  const safeRenderWidthPx =
    layoutMode === "floating" ? Math.max(floatingMinPx, renderWidthPx) : renderWidthPx;

  useEffect(() => {
    if (layoutMode !== "floating") return;
    if (effectiveWidthPx >= floatingMinPx) return;
    setWidthPxSafe(defaultWidth ?? 520);
  }, [defaultWidth, effectiveWidthPx, floatingMinPx, layoutMode, setWidthPxSafe]);

  const { isDragging, onDragStart, onResizeStart, snapFloatingToSide } = useHUDFloatingInteractions({
    canFloatDrag,
    dragOffset,
    effectiveDockSide,
    effectiveWidthPx,
    hudRef,
    layoutMode,
    maxWidth: maxW,
    minWidth: minW,
    setDockSideSafe,
    setDragOffset,
    setWidthPxSafe,
  });

  const openDocked = useCallback(
    (side: "left" | "right") => {
      setDockSideSafe(side);
      setCollapsed(false);
    },
    [setCollapsed, setDockSideSafe]
  );

  const tabs = useMemo<HUDTabKey[]>(
    () => ["chat", "kpi", "scene", "object", "loops", "decisions"],
    []
  );

  const tabLabel: Record<HUDTabKey, string> = {
    chat: "Chat",
    decision: "Decision",
    loops: "Loops",
    objects: "Objects",
    insights: "Insights",
    settings: "Settings",
    diagnostics: "Diagnostics",
    kpi: "KPI",
    scene: "Scene",
    object: "Object",
    decisions: "Decisions",
  };

  const tabIcon: Record<HUDTabKey, string> = {
    chat: "💬",
    decision: "🧭",
    loops: "⟲",
    objects: "⬡",
    insights: "✦",
    settings: "⚙",
    diagnostics: "🧪",
    kpi: "KPI",
    scene: "3D",
    object: "OBJ",
    decisions: "DEC",
  };

  const [panelAnim, setPanelAnim] = useState<"enter" | "idle">("idle");

  useLayoutEffect(() => {
    setPanelAnim("enter");
    const id = requestAnimationFrame(() => setPanelAnim("idle"));
    return () => cancelAnimationFrame(id);
  }, [activeTab]);

  const handleChangeTab = useCallback(
    (tab: HUDTabKey) => {
      if (collapsed) setCollapsed(false);
      onChangeTab(tab);
    },
    [collapsed, onChangeTab, setCollapsed]
  );

  if (collapsed) {
    return (
      <HUDCollapsedRail
        accent={accent}
        hudTheme={hudTheme}
        layoutMode={layoutMode}
        onOpen={() => setCollapsed(false)}
        onOpenDocked={openDocked}
        renderDockSide={renderDockSide}
      />
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
        transform: isFloatingMode && canFloatDrag ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : "none",
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
            <HUDHeader
              accent={accent}
              availableCompanies={availableCompanies}
              canFloatDrag={canFloatDrag}
              companyId={companyId}
              companyName={companyName}
              configError={configError}
              configLoading={configLoading}
              headerControls={headerControls}
              hudTheme={hudTheme}
              isDragging={isDragging}
              layoutMode={layoutMode}
              onChangeCompany={onCompanyChange}
              onCollapse={() => setCollapsed(true)}
              onDragStart={onDragStart}
              onRefreshConfig={onRefreshConfig}
              renderDockSide={renderDockSide}
              showStatusBadges={showStatusBadges}
              snapFloatingToSide={snapFloatingToSide}
              status={status}
              topRight={topRight}
            />

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
              <HUDTabRail
                accent={accent}
                activeTab={activeTab}
                hudTheme={hudTheme}
                onChangeTab={handleChangeTab}
                tabIcon={tabIcon}
                tabLabel={tabLabel}
                tabs={tabs}
              />

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
                          <HUDPanels
                            activeTab={activeTab}
                            panels={panels}
                            layoutMode={layoutMode}
                            splitColumns={splitColumns}
                          />
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
      </div>
      {layoutMode === "floating" ? null : (
        <div
          style={{
            gridColumn: spacerColumn,
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            pointerEvents: "none",
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
            boxShadow: "inset 0 0 120px rgba(0,0,0,0.65), inset 0 0 36px rgba(0,0,0,0.55)",
          }}
        />
      )}
    </div>
  );
}
