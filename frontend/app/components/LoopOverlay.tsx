import React, { useMemo, useState } from "react";

type LoopEdge = {
  from: string;
  to: string;
  label?: string;
  weight?: number;
  polarity?: string;
  kind?: string;
};

type LoopItem = {
  id: string;
  label?: string;
  polarity?: string;
  strength?: number;
  edges?: LoopEdge[];
};

export function LoopOverlay({
  loops,
  activeLoopId,
  suggestions,
  showLoops,
  setShowLoops,
  showLoopLabels,
  setShowLoopLabels,
  onFocusObject,
}: {
  loops: LoopItem[];
  activeLoopId: string | null;
  suggestions: string[];
  showLoops: boolean;
  setShowLoops: (v: boolean) => void;
  showLoopLabels: boolean;
  setShowLoopLabels: (v: boolean) => void;
  onFocusObject?: (id: string) => void;
}) {
  const [uiFocusedLoop, setUiFocusedLoop] = useState<string | null>(null);

  const loopMap = useMemo(() => {
    const map = new Map<string, LoopItem>();
    loops?.forEach((l) => {
      if (l?.id) map.set(l.id, l);
    });
    return map;
  }, [loops]);

  const activeLoop = activeLoopId ? loopMap.get(activeLoopId) : null;
  const shownLoopId = uiFocusedLoop ?? activeLoopId ?? loops?.[0]?.id ?? null;
  const shownLoop = shownLoopId ? loopMap.get(shownLoopId) : null;

  const edgeCount = useMemo(() => {
    if (!Array.isArray(loops)) return 0;
    return loops.reduce((acc, l) => acc + (Array.isArray(l.edges) ? l.edges.length : 0), 0);
  }, [loops]);

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 900,
        maxWidth: 320,
        padding: 12,
        borderRadius: 14,
        backdropFilter: "blur(10px)",
        background: "rgba(10,12,18,0.72)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.92)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontWeight: 700, letterSpacing: 0.2, whiteSpace: "nowrap" }}>Loops</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "nowrap" }}>
          <button
            type="button"
            onClick={() => setShowLoops(!showLoops)}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: showLoops ? "rgba(34, 211, 238, 0.18)" : "rgba(255,255,255,0.08)",
              color: "white",
              cursor: "pointer",
            }}
          >
            {showLoops ? "Lines: On" : "Lines: Off"}
          </button>
          <button
            type="button"
            onClick={() => setShowLoopLabels(!showLoopLabels)}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: showLoopLabels ? "rgba(34, 211, 238, 0.18)" : "rgba(255,255,255,0.08)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Labels
          </button>
        </div>
      </div>

      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
        {loops?.length ?? 0} loops · {edgeCount} edges
      </div>

      {activeLoop && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 12px",
            borderRadius: 12,
            background: "linear-gradient(145deg, rgba(34,211,238,0.14), rgba(255,255,255,0.06))",
            border: "1px solid rgba(34,211,238,0.35)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
              Active: {activeLoop.label ?? activeLoop.id}
            </div>
            <span
              style={{
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {activeLoop.polarity ?? "neutral"}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 6,
              borderRadius: 6,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, (activeLoop.strength ?? 0) * 100))}%`,
                height: "100%",
                background: "rgba(34, 211, 238, 0.7)",
              }}
            />
          </div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>
            {Math.round(((activeLoop.strength ?? 0) * 100 || 0)).toFixed(0)}% strength
          </div>
        </div>
      )}

      {!loops || loops.length === 0 ? (
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>No loops triggered yet.</div>
      ) : (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {loops.map((loop) => {
            const isActive = shownLoopId === loop.id;
            return (
              <div
                key={loop.id}
                onClick={() => setUiFocusedLoop(loop.id)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: isActive
                    ? "1px solid rgba(34, 211, 238, 0.35)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isActive ? "rgba(34, 211, 238, 0.10)" : "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {loop.label ?? loop.id}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.75 }}>
                    {Math.round(((loop.strength ?? 0) * 100 || 0)).toFixed(0)}%
                  </div>
                </div>
                {Array.isArray(loop.edges) && loop.edges.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {loop.edges.slice(0, 3).map((e, idx) => (
                      <div
                        key={`${loop.id}-${idx}-${e.from}-${e.to}`}
                        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, opacity: 0.82 }}
                      >
                        <span
                          style={{ padding: "2px 6px", borderRadius: 8, background: "rgba(255,255,255,0.08)", cursor: "pointer" }}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            if (onFocusObject && e.from) onFocusObject(e.from);
                          }}
                        >
                          {e.from}
                        </span>
                        <span style={{ opacity: 0.65 }}>→</span>
                        <span
                          style={{ padding: "2px 6px", borderRadius: 8, background: "rgba(255,255,255,0.08)", cursor: "pointer" }}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            if (onFocusObject && e.to) onFocusObject(e.to);
                          }}
                        >
                          {e.to}
                        </span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.label ?? e.kind ?? ""}
                        </span>
                        <span style={{ opacity: 0.65 }}>{Number(e.weight ?? 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {shownLoop && suggestions && suggestions.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6 }}>Suggestions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {suggestions.slice(0, 3).map((s, idx) => (
              <div
                key={`${idx}-${s.slice(0, 8)}`}
                style={{
                  fontSize: 12,
                  padding: "6px 8px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
