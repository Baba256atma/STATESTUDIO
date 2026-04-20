"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { runFragilityScan } from "../../lib/api/fragilityScanner";
import type { FragilityFinding, FragilityScanResponse } from "../../types/fragilityScanner";
import { FragilityDriversList } from "./FragilityDriversList";
import { FragilityFindingsList } from "./FragilityFindingsList";
import { FragilityScannerOverlay } from "./FragilityScannerOverlay";
import { FragilityScoreCard } from "./FragilityScoreCard";
import { FragilitySuggestedActions } from "./FragilitySuggestedActions";

const PANEL_STYLE: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const CARD_STYLE: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(15,23,42,0.78)",
  display: "grid",
  gap: 8,
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  minHeight: 132,
  resize: "vertical",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(2,6,23,0.55)",
  color: "#e2e8f0",
  padding: 12,
  fontSize: 13,
  lineHeight: 1.5,
  boxSizing: "border-box",
};

const EXAMPLE_TEXT =
  "Deliveries are slipping because one supplier is overloaded, inventory buffers are low, and recovery time has increased across the network.";

type FragilityScannerPanelProps = {
  initialResult?: FragilityScanResponse | null;
  onScanComplete?: (result: FragilityScanResponse) => void;
};

export function FragilityScannerPanel({
  initialResult = null,
  onScanComplete,
}: FragilityScannerPanelProps): React.ReactElement {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FragilityScanResponse | null>(initialResult);

  useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
    }
  }, [initialResult]);

  const canRun = useMemo(() => text.trim().length > 0 && !loading, [loading, text]);
  const hasResult = !!result;
  const interpretationHint = useMemo(() => {
    if (!result) return null;
    if (result.fragility_score >= 0.75) return "Interpretation: system fragility is elevated and likely needs immediate containment.";
    if (result.fragility_score >= 0.5) return "Interpretation: fragility is meaningful and should be managed before pressure spreads.";
    return "Interpretation: current fragility looks contained, but the scanner still surfaced pressure points to watch.";
  }, [result]);
  const findings: FragilityFinding[] = useMemo(
    () => (Array.isArray(result?.findings) ? (result.findings as FragilityFinding[]) : []),
    [result]
  );
  const suggestedActions = useMemo(
    () => (Array.isArray(result?.suggested_actions) ? result.suggested_actions : []),
    [result]
  );
  const suggestedObjects = useMemo(
    () => (Array.isArray(result?.suggested_objects) ? result.suggested_objects : []),
    [result]
  );
  const hasSuggestedObjects = suggestedObjects.length > 0;

  const handleRun = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextResult = await runFragilityScan({
        text,
        mode: "business",
      });
      setResult(nextResult);
      onScanComplete?.(nextResult);
    } catch (scanError: unknown) {
      const message =
        scanError instanceof Error ? scanError.message : "Unable to run fragility scan right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [onScanComplete, text]);

  const handleClear = useCallback(() => {
    setText("");
    setError(null);
    setResult(null);
  }, []);

  return (
    <section style={PANEL_STYLE} aria-label="Fragility scanner" aria-busy={loading}>
      <div style={CARD_STYLE}>
        <div>
          <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 800 }}>Fragility Scanner</div>
          <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.45, marginTop: 4 }}>
            Paste a business update, report excerpt, or operational concern to detect fragility drivers.
          </div>
        </div>
        <label htmlFor="fragility-scanner-text" style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700 }}>
          Business text
        </label>
        <textarea
          id="fragility-scanner-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Example: Deliveries are slipping because one supplier is overloaded, inventory buffers are low, and recovery time has increased across the network."
          style={INPUT_STYLE}
          disabled={loading}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              setText(EXAMPLE_TEXT);
              setError(null);
            }}
            disabled={loading}
            style={{
              padding: "7px 10px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.2)",
              background: "rgba(2,6,23,0.45)",
              color: "#cbd5e1",
              fontSize: 11,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Use example input
          </button>
          <div style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>
            The scanner favors explainable drivers and executive-ready output.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => void handleRun()}
            disabled={!canRun}
            style={{
              padding: "9px 14px",
              borderRadius: 12,
              border: "1px solid rgba(96,165,250,0.35)",
              background: canRun ? "rgba(59,130,246,0.18)" : "rgba(30,41,59,0.5)",
              color: canRun ? "#dbeafe" : "#94a3b8",
              fontSize: 12,
              fontWeight: 700,
              cursor: canRun ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Scanning fragility..." : "Run Fragility Scan"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            style={{
              padding: "9px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(15,23,42,0.58)",
              color: "#cbd5e1",
              fontSize: 12,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Clear
          </button>
        </div>
        {error ? (
          <div
            role="alert"
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(248,113,113,0.25)",
              background: "rgba(127,29,29,0.22)",
              color: "#fecaca",
              fontSize: 12,
            }}
          >
            {error}
          </div>
        ) : !hasResult ? (
          <div
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(148,163,184,0.14)",
              background: "rgba(2,6,23,0.36)",
              color: "#94a3b8",
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            Paste a short operational update to reveal fragility drivers and system weak points.
          </div>
        ) : null}
      </div>

      {result ? (
        <>
              <>
          <FragilityScannerOverlay result={result} />
          <FragilityScoreCard
            score={result.fragility_score}
            level={result.fragility_level}
            summary={result.summary}
          />
          {interpretationHint ? (
            <div
              style={{
                padding: "9px 10px",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.16)",
                background: "rgba(2,6,23,0.42)",
                color: "#cbd5e1",
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              {interpretationHint}
            </div>
          ) : null}
          <FragilityDriversList drivers={result.drivers} />
          <FragilityFindingsList findings={findings} />
          <FragilitySuggestedActions actions={suggestedActions} />
          {hasSuggestedObjects ? (
            <section style={{ display: "grid", gap: 8 }}>
              <h3 style={{ margin: 0, color: "#e2e8f0", fontSize: 13, fontWeight: 800 }}>Suggested Object Focus</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {suggestedObjects.map((objectId) => (
                  <div
                    key={objectId}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(148,163,184,0.2)",
                      background: "rgba(2,6,23,0.5)",
                      color: "#cbd5e1",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {objectId}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
              </>
        </>
      ) : null}
    </section>
  );
}
