"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { nx, primaryButtonStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";
import { readUnknownErrorMessage } from "../../lib/system/nexoraErrors";
import type { SceneJson } from "../../lib/sceneTypes";

type LooseRecord = Record<string, unknown>;

function readApiErrorMessage(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const record = json as LooseRecord;
  const detail = record.detail;
  if (detail && typeof detail === "object") {
    const detailRecord = detail as LooseRecord;
    const error = detailRecord.error;
    if (error && typeof error === "object") {
      const message = (error as LooseRecord).message;
      if (typeof message === "string" && message.trim()) return message;
    }
    if (typeof detailRecord.message === "string" && detailRecord.message.trim()) {
      return detailRecord.message;
    }
  }
  if (typeof detail === "string" && detail.trim()) return detail;
  return fallback;
}

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
}

type ReplayStep = {
  index: number;
  label?: string;
  scene_json?: SceneJson | LooseRecord;
  fragility?: LooseRecord;
  conflicts?: unknown[];
  risk_propagation?: LooseRecord;
  object_selection?: LooseRecord;
};

type ReplayData = {
  episode_id?: string;
  summary?: string;
  steps?: ReplayStep[];
};

export type DecisionReplaySceneUpdatePayload = {
  scene_json: SceneJson | LooseRecord;
  fragility: LooseRecord;
  conflicts: unknown[];
  risk_propagation: LooseRecord;
  object_selection: LooseRecord;
};

type Props = {
  backendBase: string;
  episodeId: string | null;
  onSceneUpdate?: (payload: DecisionReplaySceneUpdatePayload) => void;
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
      const json: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = readApiErrorMessage(json, "Failed to load replay.");
        throw new Error(String(msg));
      }
      const replay = json as ReplayData;
      setReplayData(replay);
      setCurrentStepIndex(0);
      const first = Array.isArray(replay.steps) ? replay.steps[0] : null;
      applyStep(first ?? null);
    } catch (e: unknown) {
      setError(readUnknownErrorMessage(e, "Failed to load replay."));
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

  const fragilityScore = Number(asRecord(activeStep?.fragility)?.score ?? 0);
  const fragilityLevel = String(asRecord(activeStep?.fragility)?.level ?? "-");
  const conflictCount = Array.isArray(activeStep?.conflicts) ? activeStep!.conflicts!.length : 0;
  const riskPropagation = asRecord(activeStep?.risk_propagation);
  const riskEdgeCount = Array.isArray(riskPropagation?.edges) ? riskPropagation.edges.length : 0;
  const objectSelection = asRecord(activeStep?.object_selection);
  const topActiveObject = Array.isArray(objectSelection?.active_objects)
    ? String(objectSelection.active_objects[0] ?? "-")
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
      <div style={{ fontSize: 16, fontWeight: 800 }}>Operational replay</div>
      <div style={{ color: nx.muted, fontSize: 12 }}>
        Episode {episodeId || "not started"} — step through history without losing scene context.
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
