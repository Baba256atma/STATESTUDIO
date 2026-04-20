import React from "react";
import type { HUDTabKey, HUDTheme } from "./hudTypes";

type HUDTabRailProps = {
  accent: string;
  activeTab: HUDTabKey;
  hudTheme: NonNullable<HUDTheme> | Record<string, never>;
  onChangeTab: (tab: HUDTabKey) => void;
  tabIcon: Record<HUDTabKey, string>;
  tabLabel: Record<HUDTabKey, string>;
  tabs: HUDTabKey[];
};

export function HUDTabRail({
  accent,
  activeTab,
  hudTheme,
  onChangeTab,
  tabIcon,
  tabLabel,
  tabs,
}: HUDTabRailProps): React.ReactElement {
  return (
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
          onClick={() => onChangeTab(tab)}
          title={tabLabel[tab]}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
            background: activeTab === tab ? accent : "rgba(255,255,255,0.04)",
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
  );
}
