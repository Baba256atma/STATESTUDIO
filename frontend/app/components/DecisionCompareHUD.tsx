import React from "react";
import type { DecisionSnapshot } from "../lib/decision/decisionTypes";
import type { DecisionDiff } from "../lib/decision/decisionDiff";
import type { KpiValue } from "../lib/kpi/kpiEngine";

type Props = {
  snapshots: DecisionSnapshot[];
  selectedAId: string | null;
  selectedBId: string | null;
  onSelectA: (id: string) => void;
  onSelectB: (id: string) => void;
  diff: DecisionDiff | null;
  onApplySnapshot?: (id: string) => void;
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatDeltaCounts(v: any): string {
  if (!v || typeof v !== "object") return "";
  const added = Number(v.added ?? 0);
  const removed = Number(v.removed ?? 0);
  const modified = Number(v.modified ?? 0);
  const unchanged = Number(v.unchanged ?? 0);
  const severityUp = Number(v.severityUp ?? 0);
  const severityDown = Number(v.severityDown ?? 0);
  return `added ${added} • removed ${removed} • modified ${modified} • unchanged ${unchanged} • severity↑ ${severityUp} • severity↓ ${severityDown}`;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const WEIGHTS: Record<string, number> = {
  kpi_quality: 1.2,
  kpi_stability: 1.1,
  kpi_cost: 1.1,
  kpi_delivery: 1.1,
  kpi_risk: 1.3,
};

const computeScorePack = (
  snapshotA: (DecisionSnapshot & { kpis?: KpiValue[]; meta?: { riskScore?: number; chaosScore?: number } }) | null,
  snapshotB: (DecisionSnapshot & { kpis?: KpiValue[]; meta?: { riskScore?: number; chaosScore?: number } }) | null
) => {
  if (!snapshotA || !snapshotB) return null;

  const aKpis = snapshotA.kpis ?? [];
  const bKpis = snapshotB.kpis ?? [];
  const aMap = new Map(aKpis.map((k) => [k.id, k]));
  const bMap = new Map(bKpis.map((k) => [k.id, k]));
  const ids = Array.from(new Set([...aMap.keys(), ...bMap.keys()]));
  const weightedDeltaSum = ids.reduce((sum, id) => {
    const aVal = aMap.get(id)?.value ?? 0;
    const bVal = bMap.get(id)?.value ?? 0;
    const weight = WEIGHTS[id] ?? 1;
    return sum + weight * (bVal - aVal);
  }, 0);
  const kpiDeltaScore = clamp(Math.round(weightedDeltaSum * 100), -100, 100);

  const riskA = Number(snapshotA.meta?.riskScore ?? 40);
  const riskB = Number(snapshotB.meta?.riskScore ?? 40);
  const chaosA = Number(snapshotA.meta?.chaosScore ?? 50);
  const chaosB = Number(snapshotB.meta?.chaosScore ?? 50);

  const riskDelta = clamp(Math.round(riskA - riskB), -100, 100);
  const chaosDelta = clamp(Math.round(chaosA - chaosB), -100, 100);

  const finalScore = clamp(kpiDeltaScore + riskDelta + chaosDelta, -100, 100);
  const verdict = finalScore >= 10 ? "B is better overall" : finalScore <= -10 ? "A is safer overall" : "Balanced";
  const confidence = ids.length >= 3 && Math.abs(finalScore) >= 15 ? "high" : ids.length >= 1 ? "medium" : "low";

  const reasons = [
    `KPI delta score: ${kpiDeltaScore >= 0 ? "+" : ""}${kpiDeltaScore}`,
    `Risk change: A ${riskA} \u2192 B ${riskB}`,
    `Chaos change: A ${chaosA} \u2192 B ${chaosB}`,
  ];

  return {
    kpiDeltaScore,
    riskA,
    riskB,
    chaosA,
    chaosB,
    finalScore,
    verdict,
    confidence,
    reasons,
  };
};

// -----------------------------
// Phase 2 — Step 3: Insight Layer (local, UI-friendly)
// -----------------------------

type DecisionInsight = {
  verdict: string;
  recommendation: string;
  confidence: "low" | "medium" | "high";
  signals: {
    stability: "more_stable" | "less_stable" | "unknown";
    structuralChange: "none" | "minor" | "major";
    activeLoopChanged: boolean;
  };
};

function insightFromDecisionDiff(diff: DecisionDiff): DecisionInsight {
  const loopChanges = diff.loopChanges ?? [];
  const loopsAdded = loopChanges.filter((c) => c.change === "added");
  const loopsRemoved = loopChanges.filter((c) => c.change === "removed");
  const delta = loopsAdded.length + loopsRemoved.length;

  const structuralChange: DecisionInsight["signals"]["structuralChange"] =
    delta === 0 ? "none" : delta <= 2 ? "minor" : "major";

  const stability =
    ((diff as any)?.stabilityHint as DecisionInsight["signals"]["stability"] | undefined) ?? "unknown";

  const confidence: DecisionInsight["confidence"] =
    stability === "unknown"
      ? structuralChange === "major"
        ? "low"
        : "medium"
      : structuralChange === "major"
        ? "medium"
        : "high";

  const verdictParts: string[] = [];
  if (stability === "more_stable") verdictParts.push("B looks more stable");
  else if (stability === "less_stable") verdictParts.push("B looks less stable");
  else verdictParts.push("Stability is unclear");

  if (diff.activeLoopChanged) verdictParts.push("active loop changed");
  if (structuralChange === "major") verdictParts.push("big structural shift");

  const verdict = verdictParts.join(" · ");

  let recommendation = "";
  if (stability === "more_stable") {
    recommendation = "Prefer B if you need reliability; verify cost & delivery KPIs next.";
  } else if (stability === "less_stable") {
    recommendation = "Prefer A if you need predictability; use B only if you accept higher volatility.";
  } else {
    recommendation = "Save more snapshots (A/B) and compare again; add KPI scoring in the next step.";
  }

  return {
    verdict,
    recommendation,
    confidence,
    signals: {
      stability,
      structuralChange,
      activeLoopChanged: diff.activeLoopChanged,
    },
  };
}

export function DecisionCompareHUD({
  snapshots,
  selectedAId,
  selectedBId,
  onSelectA,
  onSelectB,
  diff,
  onApplySnapshot,
}: Props): React.ReactElement | null {
  if (!Array.isArray(snapshots) || snapshots.length < 2) return null;

  const parseSnapshotKey = (key: string): { id: string; timestamp: number } | null => {
    const lastColon = key.lastIndexOf(":");
    if (lastColon <= 0 || lastColon === key.length - 1) return null;
    const id = key.slice(0, lastColon);
    const timestamp = Number(key.slice(lastColon + 1));
    if (!Number.isFinite(timestamp)) return null;
    return { id, timestamp };
  };

  const findSnapshotByKey = (key: string | null): DecisionSnapshot | null => {
    if (!key) return null;
    const parsed = parseSnapshotKey(key);
    if (!parsed) return null;
    return snapshots.find((s) => s.id === parsed.id && s.timestamp === parsed.timestamp) ?? null;
  };

  const snapshotA = findSnapshotByKey(selectedAId) as
    | (DecisionSnapshot & { kpis?: KpiValue[]; meta?: { riskScore?: number; chaosScore?: number } })
    | null;
  const snapshotB = findSnapshotByKey(selectedBId) as
    | (DecisionSnapshot & { kpis?: KpiValue[]; meta?: { riskScore?: number; chaosScore?: number } })
    | null;
  const scorePack = computeScorePack(snapshotA, snapshotB);
  const aKpis = snapshotA?.kpis ?? [];
  const bKpis = snapshotB?.kpis ?? [];
  const aMap = new Map(aKpis.map((k) => [k.id, k]));
  const bMap = new Map(bKpis.map((k) => [k.id, k]));
  const kpiIds = Array.from(new Set([...aMap.keys(), ...bMap.keys()]));
  const kpiDiffs = kpiIds.map((id) => {
    const a = aMap.get(id)?.value ?? 0;
    const b = bMap.get(id)?.value ?? 0;
    return {
      id,
      label: bMap.get(id)?.label ?? aMap.get(id)?.label ?? id,
      delta: b - a,
    };
  });
  const improvements = kpiDiffs.filter((d) => d.delta >= 0.05).sort((a, b) => b.delta - a.delta);
  const regressions = kpiDiffs.filter((d) => d.delta <= -0.05).sort((a, b) => a.delta - b.delta);
  const kpiVerdict =
    improvements.length > regressions.length
      ? "B is KPI-better overall"
      : regressions.length > improvements.length
        ? "A is KPI-safer overall"
        : "KPIs are balanced";
  const kpiSignalsCount = improvements.length + regressions.length;
  const kpiConfidence = kpiSignalsCount >= 3 ? "high" : kpiSignalsCount >= 1 ? "medium" : "low";

  const renderSelect = (label: string, value: string | null, onChange: (id: string) => void) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
      <span style={{ fontSize: 12, opacity: 0.8 }}>{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "rgba(0,0,0,0.4)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 10,
          padding: "6px 8px",
        }}
      >
        <option value="" disabled>
          Select…
        </option>
        {Array.from(new Map(snapshots.map((s) => [`${s.id}:${s.timestamp}`, s] as const)).values()).map((s) => {
          const k = `${s.id}:${s.timestamp}`;
          return (
            <option key={k} value={k}>
              {formatTime(s.timestamp)} {s.activeLoopId ? `(${s.activeLoopId})` : ""}
            </option>
          );
        })}
      </select>
    </div>
  );

  const loopChanges = diff?.loopChanges ?? [];
  const loopsAdded = loopChanges.filter((c) => c.change === "added");
  const loopsRemoved = loopChanges.filter((c) => c.change === "removed");
  const loopsCommon = loopChanges.filter((c) => c.change === "unchanged" || c.change === "modified");

  const summaryChips = diff
    ? [
        { label: "Added", value: String(loopsAdded.length) },
        { label: "Removed", value: String(loopsRemoved.length) },
        { label: "Common", value: String(loopsCommon.length) },
        { label: "Active changed", value: diff.activeLoopChanged ? "Yes" : "No" },
        { label: "Stability", value: "unknown" },
      ]
    : [];

  const topAdded = loopsAdded.slice(0, 6);
  const topRemoved = loopsRemoved.slice(0, 6);

  const insight = diff ? insightFromDecisionDiff(diff) : null;
  const summaryText =
    typeof diff?.summary === "string"
      ? diff.summary
      : formatDeltaCounts((diff as any)?.summary) || JSON.stringify((diff as any)?.summary ?? "");

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 140,
        width: 340,
        maxHeight: "50vh",
        overflow: "auto",
        padding: 12,
        borderRadius: 14,
        background: "rgba(10,12,18,0.82)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        color: "white",
        zIndex: 1200,
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>Compare Snapshots</div>
        {onApplySnapshot ? (
          <div style={{ display: "flex", gap: 6 }}>
            {selectedAId ? (
              <button
                type="button"
                onClick={() => onApplySnapshot(selectedAId)}
                style={{
                  fontSize: 11,
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Replay A
              </button>
            ) : null}
            {selectedBId ? (
              <button
                type="button"
                onClick={() => onApplySnapshot(selectedBId)}
                style={{
                  fontSize: 11,
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.10)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Replay B
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 10 }}>
        {renderSelect("A (Before)", selectedAId, onSelectA)}
        {renderSelect("B (After)", selectedBId, onSelectB)}
      </div>

      {summaryChips.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {summaryChips.map((chip) => (
            <div
              key={chip.label}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 11,
              }}
            >
              {chip.label}: {chip.value}
            </div>
          ))}
        </div>
      ) : null}

      {diff ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {insight ? (
            <div
              style={{
                padding: 10,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Verdict</div>
              <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>{insight.verdict}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{insight.recommendation}</div>
              <div style={{ fontSize: 11, opacity: 0.65, marginTop: 8 }}>
                Confidence: {insight.confidence} · Change: {insight.signals.structuralChange}
              </div>
            </div>
          ) : null}

          <div style={{ fontSize: 12, opacity: 0.8 }}>{summaryText}</div>

          <div
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Decision Score</div>
            {scorePack ? (
              <div style={{ display: "grid", gap: 6, fontSize: 12, opacity: 0.9 }}>
                <div>
                  Final: {scorePack.finalScore >= 0 ? "+" : ""}
                  {scorePack.finalScore} · {scorePack.verdict} · confidence: {scorePack.confidence}
                </div>
                <div>KPI Delta Score: {scorePack.kpiDeltaScore}</div>
                <div>
                  Risk: A {scorePack.riskA} \u2192 B {scorePack.riskB}
                </div>
                <div>
                  Chaos: A {scorePack.chaosA} \u2192 B {scorePack.chaosB}
                </div>
                <div style={{ opacity: 0.8 }}>
                  <div>Reasons</div>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {scorePack.reasons.slice(0, 3).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Select A and B snapshots to compute Decision Score.
              </div>
            )}
          </div>

          <div
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>KPI Delta</div>
            {snapshotA && snapshotB ? (
              <>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>
                  {kpiVerdict} · confidence: {kpiConfidence}
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, opacity: 0.9 }}>Improvements (Top 3)</div>
                  {improvements.length === 0 ? (
                    <div style={{ fontSize: 12, opacity: 0.7 }}>None</div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {improvements.slice(0, 3).map((k) => (
                        <span
                          key={`kpi-improve:${k.id}`}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 999,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(40,160,80,0.12)",
                            fontSize: 11,
                          }}
                        >
                          {k.label}: {Math.round(k.delta * 100)}%
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ fontWeight: 600, fontSize: 12, opacity: 0.9 }}>Regressions (Top 3)</div>
                  {regressions.length === 0 ? (
                    <div style={{ fontSize: 12, opacity: 0.7 }}>None</div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {regressions.slice(0, 3).map((k) => (
                        <span
                          key={`kpi-regress:${k.id}`}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 999,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(200,80,80,0.12)",
                            fontSize: 11,
                          }}
                        >
                          {k.label}: {Math.round(k.delta * 100)}%
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, opacity: 0.7 }}>Select A and B snapshots to see KPI diff.</div>
            )}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 12, opacity: 0.9 }}>Added loops</div>
            {topAdded.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.7 }}>None</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {topAdded.map((c) => (
                  <span
                    key={`add:${c.loopId}`}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(40,160,80,0.12)",
                      fontSize: 11,
                    }}
                  >
                    + {c.loopId}
                  </span>
                ))}
              </div>
            )}

            <div style={{ fontWeight: 600, fontSize: 12, opacity: 0.9 }}>Removed loops</div>
            {topRemoved.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.7 }}>None</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {topRemoved.map((c) => (
                  <span
                    key={`rem:${c.loopId}`}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(200,80,80,0.12)",
                      fontSize: 11,
                    }}
                  >
                    − {c.loopId}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
