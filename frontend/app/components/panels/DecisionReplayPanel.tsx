"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cardStyle, nx, primaryButtonStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";

type ReplayStep = {
  index: number;
  label?: string;
  scene_json?: any;
  fragility?: any;
  conflicts?: any[];
  risk_propagation?: any;
  object_selection?: any;
};

type ReplayData = {
  episode_id?: string;
  summary?: string;
  steps?: ReplayStep[];
};

type Props = {
  backendBase: string;
  episodeId: string | null;
  onSceneUpdate?: (payload: any) => void;
};

export default function DecisionReplayPanel({ backendBase, episodeId, onSceneUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replayData, setReplayData] = useState<ReplayData | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = useMemo(() => (Array.isArray(replayData?.steps) ? replayData!.steps! : []), [replayData]);
  const activeStep = steps[currentStepIndex] ?? null;

  const applyStep = useCallback(
    (step: ReplayStep | null) => {
      if (!step) return;
      onSceneUpdate?.({
        scene_json: step.scene_json ?? {},
        fragility: step.fragility ?? {},
        conflicts: Array.isArray(step.conflicts) ? step.conflicts : [],
        risk_propagation: step.risk_propagation ?? {},
        object_selection: step.object_selection ?? {},
      });
    },
    [onSceneUpdate]
  );

  const loadReplay = useCallback(async () => {
    if (!episodeId) {
      setError("No episode id. Send at least one chat message first.");
      return;
    }
    setLoading(true);
    setError(null);
    setPlaying(false);
    try {
      const res = await fetch(`${backendBase}/replay/view/${encodeURIComponent(episodeId)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (json as any)?.detail?.error?.message ?? (json as any)?.detail ?? "Failed to load replay.";
        throw new Error(String(msg));
      }
      setReplayData(json as ReplayData);
      setCurrentStepIndex(0);
      const first = Array.isArray((json as any)?.steps) ? (json as any).steps[0] : null;
      applyStep(first ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load replay.");
    } finally {
      setLoading(false);
    }
  }, [applyStep, backendBase, episodeId]);

  const prev = useCallback(() => {
    setPlaying(false);
    setCurrentStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentStepIndex((i) => Math.min(Math.max(0, steps.length - 1), i + 1));
  }, [steps.length]);

  useEffect(() => {
    applyStep(activeStep);
  }, [activeStep, applyStep]);

  useEffect(() => {
    if (!playing || steps.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrentStepIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1200);
    return () => window.clearInterval(id);
  }, [playing, steps.length]);

  const fragilityScore = Number(activeStep?.fragility?.score ?? 0);
  const fragilityLevel = String(activeStep?.fragility?.level ?? "-");
  const conflictCount = Array.isArray(activeStep?.conflicts) ? activeStep!.conflicts!.length : 0;
  const riskEdgeCount = Array.isArray(activeStep?.risk_propagation?.edges) ? activeStep.risk_propagation.edges.length : 0;
  const topActiveObject = Array.isArray(activeStep?.object_selection?.active_objects)
    ? String(activeStep?.object_selection?.active_objects?.[0] ?? "-")
    : "-";

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 12,
        borderRadius: 16,
        background: nx.bgPanel,
        border: `1px solid ${nx.border}`,
        color: nx.text,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 800 }}>Decision Replay</div>
      <div style={{ color: nx.muted, fontSize: 12 }}>
        Episode: {episodeId || "Not started"}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => void loadReplay()}
          disabled={loading || !episodeId}
          style={{ ...primaryButtonStyle, opacity: loading || !episodeId ? 0.7 : 1, cursor: loading || !episodeId ? "default" : "pointer" }}
        >
          {loading ? "Loading..." : "Load Replay"}
        </button>
        <button type="button" onClick={() => setPlaying((v) => !v)} disabled={!steps.length} style={{ ...primaryButtonStyle, opacity: !steps.length ? 0.7 : 1 }}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={prev} disabled={!steps.length || currentStepIndex <= 0} style={{ ...primaryButtonStyle, opacity: !steps.length || currentStepIndex <= 0 ? 0.7 : 1 }}>
          Prev
        </button>
        <button type="button" onClick={next} disabled={!steps.length || currentStepIndex >= steps.length - 1} style={{ ...primaryButtonStyle, opacity: !steps.length || currentStepIndex >= steps.length - 1 ? 0.7 : 1 }}>
          Next
        </button>
      </div>

      {replayData?.summary ? <div style={{ fontSize: 12, color: "#93c5fd" }}>{replayData.summary}</div> : null}
      {!episodeId ? <EmptyStateCard text="No decision history yet." /> : null}
      {loading ? <LoadingStateCard text="Loading replay steps…" /> : null}
      {error ? <ErrorStateCard text={error} /> : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflow: "auto" }}>
        <div style={sectionTitleStyle}>Steps</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {steps.map((s, idx) => (
            <button
              key={`${s.index}-${idx}`}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              style={{
                textAlign: "left",
                padding: "6px 8px",
                borderRadius: 8,
                border: idx === currentStepIndex ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(148,163,184,0.2)",
                background: idx === currentStepIndex ? "rgba(37,99,235,0.14)" : "rgba(15,23,42,0.65)",
                color: nx.text,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Step {idx + 1}: {String(s.label ?? `Step ${idx + 1}`)}
            </button>
          ))}
          {!steps.length ? <EmptyStateCard text="No decision history yet." /> : null}
        </div>

        {activeStep ? (
          <div
            style={{
              ...softCardStyle,
              marginTop: 4,
              padding: 10,
              gap: 5,
              fontSize: 12,
            }}
          >
            <div>Fragility: <b>{Number.isFinite(fragilityScore) ? fragilityScore.toFixed(2) : "-"}</b> · <b>{fragilityLevel}</b></div>
            <div>Conflicts: <b>{conflictCount}</b></div>
            <div>Risk edges: <b>{riskEdgeCount}</b></div>
            <div>Top active object: <b>{topActiveObject}</b></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
