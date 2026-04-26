"use client";

import React from "react";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";

type Selection = {
  active_objects?: string[];
  highlighted_objects?: string[];
  rankings?: Array<{ id?: string; score?: number }>;
  reasoning?: string;
};

type FocusActionIntent = "simulate" | "compare" | "timeline" | "focus";

type FocusAction = {
  id: string;
  label: string;
  icon: string;
  intent: FocusActionIntent;
  onClick?: (() => void) | null;
};

function toLabel(id: string): string {
  return id.replace(/^obj_/, "").replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildActions(args: {
  onSimulate?: (() => void) | null;
  onCompare?: (() => void) | null;
}): FocusAction[] {
  const actions: FocusAction[] = [];
  if (args.onSimulate) {
    actions.push({ id: "simulate", label: "Simulate", icon: "S", intent: "simulate", onClick: args.onSimulate });
  }
  if (args.onCompare) {
    actions.push({ id: "compare", label: "Compare", icon: "C", intent: "compare", onClick: args.onCompare });
  }
  return actions;
}

function truncateList(items: string[], max = 7): string[] {
  return items.filter(Boolean).slice(0, max);
}

export default function ObjectSelectionPanel({
  selection,
  selectedObjectId,
  sceneJson,
  responseData,
  riskPropagation,
  onSimulate,
  onCompare,
}: {
  selection: Selection | null | undefined;
  selectedObjectId?: string | null;
  sceneJson?: any;
  responseData?: any;
  riskPropagation?: any;
  onSimulate?: (() => void) | null;
  onCompare?: (() => void) | null;
}) {
  const [mode, setMode] = React.useState<"list" | "details">("list");
  const active = Array.isArray(selection?.active_objects) ? selection!.active_objects! : [];
  const highlighted = Array.isArray(selection?.highlighted_objects) ? selection!.highlighted_objects! : [];
  const rankings = Array.isArray(selection?.rankings) ? selection!.rankings! : [];
  const primaryId = String(selectedObjectId ?? rankings[0]?.id ?? active[0] ?? highlighted[0] ?? "").trim();
  const explicitSelectedId = typeof selectedObjectId === "string" ? selectedObjectId.trim() : "";
  React.useEffect(() => {
    if (!explicitSelectedId) {
      setMode("list");
      return;
    }
    setMode(primaryId ? "details" : "list");
  }, [explicitSelectedId, primaryId]);
  const sceneObjects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  const primaryObject = sceneObjects.find((item: any) => String(item?.id ?? "").trim() === primaryId) ?? null;
  const typeLabel = String(primaryObject?.type ?? "unknown").trim() || "unknown";
  const riskScoreRaw =
    Number(rankings.find((item) => String(item?.id ?? "") === primaryId)?.score ?? responseData?.risk?.score ?? 0) || 0;
  const riskScore = Math.max(0, Math.min(1, riskScoreRaw));
  const fragilityContribution = Math.max(0, Math.min(1, Number(responseData?.fragility?.score ?? 0) || 0));
  const trend = riskScore >= 0.7 ? "up" : riskScore >= 0.35 ? "flat" : "down";
  const status = riskScore >= 0.72 ? "critical" : riskScore >= 0.35 ? "warning" : "stable";
  const relationships = (() => {
    const links = Array.isArray(riskPropagation?.edges) ? riskPropagation.edges : [];
    const upstream = links
      .filter((edge: any) => String(edge?.to ?? "").trim() === primaryId)
      .map((edge: any) => toLabel(String(edge?.from ?? "")));
    const downstream = links
      .filter((edge: any) => String(edge?.from ?? "").trim() === primaryId)
      .map((edge: any) => toLabel(String(edge?.to ?? "")));
    return {
      upstream: truncateList(upstream),
      downstream: truncateList(downstream),
    };
  })();
  const keyDrivers = truncateList(
    (Array.isArray(responseData?.fragility_scan?.drivers) ? responseData.fragility_scan.drivers : [])
      .map((driver: any) => String(driver?.label ?? driver?.id ?? ""))
      .filter(Boolean)
  );
  const lastEvent = String(responseData?.fragility?.summary ?? responseData?.summary ?? "No recent change signal")
    .trim()
    .slice(0, 92);

  if (!selection || !primaryId) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ ...sectionTitleStyle, marginBottom: 0 }}>Objects</div>
          <div style={{ fontSize: 11, color: nx.lowMuted, marginTop: 6 }}>Mode: list</div>
        </div>
        <EmptyStateCard text="Select an object to open details." />
      </div>
    );
  }
  const actions = buildActions({ onSimulate, onCompare });

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    globalThis.console?.debug?.("[Nexora][ObjectsDetails]", {
      mode,
      primaryId,
      status,
    });
  }, [mode, primaryId, status]);

  const sectionItemStyle: React.CSSProperties = { fontSize: 12, color: nx.text, lineHeight: 1.35 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
        <div style={{ ...sectionTitleStyle, marginBottom: 0 }}>Object Header</div>
        <div style={{ fontSize: 13, color: nx.text, fontWeight: 700 }}>{toLabel(primaryId)}</div>
        <div style={{ fontSize: 11, color: nx.lowMuted }}>
          type: {typeLabel} | status: {status}
        </div>
      </div>

      <div style={sectionTitleStyle}>Metrics</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
        <div style={sectionItemStyle}>- risk score: {riskScore.toFixed(2)}</div>
        <div style={sectionItemStyle}>- fragility contribution: {fragilityContribution.toFixed(2)}</div>
        <div style={sectionItemStyle}>- trend: {trend}</div>
      </div>

      <div style={sectionTitleStyle}>Relationships</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
        <div style={sectionItemStyle}>- upstream: {relationships.upstream.join(", ") || "none"}</div>
        <div style={sectionItemStyle}>- downstream: {relationships.downstream.join(", ") || "none"}</div>
      </div>

      <div style={sectionTitleStyle}>Signals</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
        <div style={sectionItemStyle}>- last event: {lastEvent}</div>
        {keyDrivers.slice(0, 5).map((driver) => (
          <div key={driver} style={sectionItemStyle}>
            - driver: {driver}
          </div>
        ))}
      </div>

      <details style={{ borderRadius: 10 }}>
        <summary style={{ cursor: "pointer", ...sectionTitleStyle }}>Actions (lightweight)</summary>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick ?? undefined}
              style={{
                textAlign: "left",
                border: `1px solid ${nx.border}`,
                background: nx.bgPanel,
                color: nx.text,
                borderRadius: 10,
                padding: "9px 10px",
                fontSize: 12,
                fontWeight: 700,
                cursor: action.onClick ? "pointer" : "default",
              }}
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
