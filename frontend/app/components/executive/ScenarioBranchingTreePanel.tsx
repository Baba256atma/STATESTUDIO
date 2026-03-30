"use client";

import React from "react";

import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import {
  buildScenarioBranchingTreeModel,
  type ScenarioBranchNode,
} from "../../lib/decision/scenario/buildScenarioBranchingTreeModel";
import { nx, panelSurfaceStyle, primaryButtonStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type ScenarioBranchingTreePanelProps = {
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  strategicAdvice?: any | null;
  memoryEntries?: DecisionMemoryEntry[];
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
  onOpenCompare?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
  onOpenWarRoom?: (() => void) | null;
  onOpenObject?: ((id?: string | null) => void) | null;
};

function statusTone(status?: ScenarioBranchNode["status"]) {
  if (status === "recommended") return "#dbeafe";
  if (status === "viable") return "#dcfce7";
  if (status === "risky") return "#fecaca";
  return "#cbd5e1";
}

function statusBackground(status?: ScenarioBranchNode["status"]) {
  if (status === "recommended") return "rgba(59,130,246,0.14)";
  if (status === "viable") return "rgba(34,197,94,0.12)";
  if (status === "risky") return "rgba(239,68,68,0.12)";
  return "rgba(15,23,42,0.58)";
}

export function ScenarioBranchingTreePanel(props: ScenarioBranchingTreePanelProps) {
  const model = React.useMemo(
    () =>
      buildScenarioBranchingTreeModel({
        responseData: props.responseData ?? null,
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionResult: props.decisionResult ?? null,
        strategicAdvice: props.strategicAdvice ?? null,
        memoryEntries: props.memoryEntries ?? [],
      }),
    [props.responseData, props.canonicalRecommendation, props.decisionResult, props.strategicAdvice, props.memoryEntries]
  );
  const [selectedBranchId, setSelectedBranchId] = React.useState<string | null>(model.recommendedBranchId ?? model.branches[0]?.id ?? null);

  React.useEffect(() => {
    setSelectedBranchId(model.recommendedBranchId ?? model.branches[0]?.id ?? null);
  }, [model.recommendedBranchId, model.branches]);

  const selectedBranch =
    model.branches.find((branch) => branch.id === selectedBranchId) ??
    model.branches[0] ??
    null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Scenario Branching Tree</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Explore how different decisions can lead to different futures.
        </div>
      </div>

      <div style={{ ...softCardStyle, padding: 14, gap: 8 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Current State
        </div>
        <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>{model.root.title}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{model.root.summary}</div>
        {model.root.impact_summary ? (
          <div style={{ color: "#93c5fd", fontSize: 12, lineHeight: 1.45 }}>{model.root.impact_summary}</div>
        ) : null}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 1, height: 24, background: "rgba(96,165,250,0.24)" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {model.branches.length ? (
          model.branches.map((branch) => {
            const active = branch.id === selectedBranch?.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => setSelectedBranchId(branch.id)}
                style={{
                  ...panelSurfaceStyle,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  textAlign: "left",
                  cursor: "pointer",
                  border: active ? "1px solid rgba(96,165,250,0.28)" : `1px solid ${nx.border}`,
                  background: active ? "rgba(59,130,246,0.12)" : "rgba(15,23,42,0.78)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{branch.title}</div>
                    <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45, marginTop: 4 }}>
                      {branch.summary}
                    </div>
                  </div>
                  <div
                    style={{
                      borderRadius: 999,
                      padding: "5px 8px",
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: statusTone(branch.status),
                      background: statusBackground(branch.status),
                      whiteSpace: "nowrap",
                    }}
                  >
                    {branch.status ?? "unknown"}
                  </div>
                </div>

                {branch.impact_summary ? (
                  <div style={{ color: "#dbeafe", fontSize: 12, lineHeight: 1.45 }}>{branch.impact_summary}</div>
                ) : null}
                {branch.tradeoff_summary ? (
                  <div style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.45 }}>
                    Trade-off: {branch.tradeoff_summary}
                  </div>
                ) : null}
                {branch.replay_ref?.memory_entry_id ? (
                  <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
                    Similar path seen before
                  </div>
                ) : null}
              </button>
            );
          })
        ) : (
          <div style={{ ...softCardStyle, padding: 14, gap: 6 }}>
            <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Future Paths
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
              No alternative futures available yet. Use Compare Options to explore more paths.
            </div>
          </div>
        )}
      </div>

      <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Branch Preview
            </div>
            <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800, marginTop: 4 }}>
              {selectedBranch?.title ?? "No branch selected"}
            </div>
          </div>
          {selectedBranch?.confidence_level ? (
            <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
              Confidence {selectedBranch.confidence_level}
            </div>
          ) : null}
        </div>

        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          {selectedBranch?.summary ?? "Select a path to inspect how that future diverges from the current state."}
        </div>

        {selectedBranch?.impact_items?.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedBranch.impact_items.slice(0, 4).map((item) => (
              <div key={`${selectedBranch.id}-${item.label}`} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 800, lineHeight: 1.4 }}>•</span>
                <span style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
                  {item.label}: {item.value ?? "No visible change"}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {selectedBranch?.target_ids?.length ? (
          <div style={{ color: "#93c5fd", fontSize: 11, lineHeight: 1.45 }}>
            Targets: {selectedBranch.target_ids.map((id) => props.resolveObjectLabel?.(id) ?? id).join(", ")}
          </div>
        ) : null}
      </div>

      <div style={{ ...softCardStyle, padding: 12, gap: 10 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Explore Next
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={props.onOpenCompare ?? (() => {})} style={primaryButtonStyle}>
            Compare This Path
          </button>
          <button type="button" onClick={props.onOpenTimeline ?? (() => {})} style={secondaryButtonStyle}>
            View Timeline
          </button>
          <button type="button" onClick={props.onOpenWarRoom ?? (() => {})} style={secondaryButtonStyle}>
            Open In War Room
          </button>
          {selectedBranch?.target_ids?.[0] && props.onOpenObject ? (
            <button
              type="button"
              onClick={() => props.onOpenObject?.(selectedBranch.target_ids?.[0] ?? null)}
              style={secondaryButtonStyle}
            >
              Inspect Targets
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
