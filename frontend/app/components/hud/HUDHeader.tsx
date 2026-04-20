import React from "react";
import { ConfigHealthBadge } from "../ConfigHealthBadge";
import type { HUDDockSide, HUDShellLayoutMode, HUDShellStatus, HUDTheme } from "./hudTypes";

type HUDHeaderProps = {
  accent: string;
  availableCompanies?: Array<{ id: string; name?: string }>;
  canFloatDrag: boolean;
  companyId: string;
  companyName?: string;
  configError?: string | null;
  configLoading?: boolean;
  headerControls?: React.ReactNode;
  hudTheme: NonNullable<HUDTheme> | Record<string, never>;
  isDragging: boolean;
  layoutMode: HUDShellLayoutMode;
  onChangeCompany?: (id: string) => void;
  onCollapse: () => void;
  onDragStart?: (e: React.PointerEvent) => void;
  onRefreshConfig?: () => void;
  renderDockSide: HUDDockSide;
  showStatusBadges: boolean;
  snapFloatingToSide: (side: HUDDockSide) => void;
  status?: HUDShellStatus;
  topRight?: React.ReactNode;
};

export function HUDHeader({
  accent,
  availableCompanies,
  canFloatDrag,
  companyId,
  companyName,
  configError,
  configLoading,
  headerControls,
  hudTheme,
  isDragging,
  layoutMode,
  onChangeCompany,
  onCollapse,
  onDragStart,
  onRefreshConfig,
  renderDockSide,
  showStatusBadges,
  snapFloatingToSide,
  status,
  topRight,
}: HUDHeaderProps): React.ReactElement {
  const companyOptions =
    availableCompanies && availableCompanies.length
      ? availableCompanies
      : [{ id: companyId, name: companyName ?? companyId }];

  return (
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
            onChange={(e) => onChangeCompany?.(e.target.value)}
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
            {companyOptions.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name ?? company.id}
              </option>
            ))}
          </select>
          {configLoading ? (
            <span style={{ fontSize: 11, color: hudTheme.mutedText ?? "rgba(255,255,255,0.75)" }}>
              Loading config…
            </span>
          ) : null}
          {configError ? <span style={{ fontSize: 11, color: "rgba(255,180,0,0.9)" }}>Config error</span> : null}
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
              style={dockToggleStyle(hudTheme, accent, renderDockSide === "left")}
              title="Dock Left"
              aria-label="Dock Left"
            >
              ⇤
            </button>
            <button
              type="button"
              onClick={() => snapFloatingToSide("right")}
              style={dockToggleStyle(hudTheme, accent, renderDockSide === "right")}
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
            style={iconButtonStyle(hudTheme)}
          >
            ↻
          </button>

          {layoutMode === "floating" ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCollapse();
              }}
              title="Collapse HUD"
              aria-label="Collapse HUD"
              style={iconButtonStyle(hudTheme)}
            >
              ⟂
            </button>
          ) : null}
        </div>
      </div>

      {showStatusBadges || headerControls ? (
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
                <div style={statusBadgeStyle(hudTheme)}>Loops: {status.loopsCount}</div>
              ) : null}
              <div style={statusBadgeStyle(hudTheme)}>
                Object: {status?.selectedObjectLabel ?? status?.selectedObjectId ?? "None"}
              </div>
              <div style={statusBadgeStyle(hudTheme)}>
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
  );
}

function iconButtonStyle(hudTheme: NonNullable<HUDTheme> | Record<string, never>): React.CSSProperties {
  return {
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
  };
}

function dockToggleStyle(
  hudTheme: NonNullable<HUDTheme> | Record<string, never>,
  accent: string,
  isActive: boolean
): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    borderRadius: 10,
    border: "none",
    background: isActive ? accent : "transparent",
    color: hudTheme.text ?? "rgba(255,255,255,0.9)",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function statusBadgeStyle(hudTheme: NonNullable<HUDTheme> | Record<string, never>): React.CSSProperties {
  return {
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
  };
}
