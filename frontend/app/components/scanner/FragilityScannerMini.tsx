"use client";

import React, { useEffect, useMemo, useState } from "react";
import { runFragilityScan } from "../../lib/api/fragilityScanner";
import type { FragilityScanResponse } from "../../types/fragilityScanner";
import { nx } from "../ui/nexoraTheme";

const EXAMPLE_INPUTS = [
  {
    id: "supplier_dependency",
    label: "Supplier dependency",
    text: "Our main supplier has been overloaded for two weeks, delivery reliability is falling, and inventory buffers are shrinking.",
  },
  {
    id: "delivery_delays",
    label: "Delivery delays",
    text: "Shipments are arriving late across multiple routes and order fulfillment is slowing down.",
  },
  {
    id: "inventory_pressure",
    label: "Inventory pressure",
    text: "Stock coverage has dropped after repeated demand spikes and replenishment is not keeping pace.",
  },
] as const;

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

const SUBTLE_CARD_STYLE: React.CSSProperties = {
  ...CARD_STYLE,
  background: "rgba(2,6,23,0.42)",
  border: `1px solid ${nx.border}`,
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  minHeight: 120,
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

const SECTION_HEADING_STYLE: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

function levelTone(level: string): { color: string; background: string; border: string } {
  const normalized = String(level).trim().toLowerCase();
  if (normalized === "high" || normalized === "critical") {
    return { color: "#fdba74", background: "rgba(251,146,60,0.14)", border: "rgba(251,146,60,0.28)" };
  }
  if (normalized === "medium") {
    return { color: "#fde68a", background: "rgba(250,204,21,0.12)", border: "rgba(250,204,21,0.24)" };
  }
  return { color: "#86efac", background: "rgba(134,239,172,0.12)", border: "rgba(134,239,172,0.24)" };
}

function formatSceneObjectLabel(id: string): string {
  return String(id ?? "")
    .replace(/^obj_/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

type FragilityScannerMiniProps = {
  initialResult?: FragilityScanResponse | null;
  onScanComplete?: (result: FragilityScanResponse) => void;
};

export function FragilityScannerMini({
  initialResult = null,
  onScanComplete,
}: FragilityScannerMiniProps): React.ReactElement {
  const [scannerText, setScannerText] = useState("");
  const [scannerLoading, setScannerLoading] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scannerResult, setScannerResult] = useState<FragilityScanResponse | null>(initialResult);

  useEffect(() => {
    if (initialResult) {
      setScannerResult(initialResult);
    }
  }, [initialResult]);

  const canRun = useMemo(() => scannerText.trim().length > 0 && !scannerLoading, [scannerLoading, scannerText]);
  const hasResult = !!scannerResult;
  const levelUi = useMemo(
    () => levelTone(scannerResult?.fragility_level ?? "low"),
    [scannerResult?.fragility_level]
  );
  const interpretationHint = useMemo(() => {
    if (!scannerResult) {
      return "Paste a short operational update to reveal fragility drivers, risk level, and likely weak points.";
    }
    if (scannerResult.fragility_score >= 0.7) {
      return "High fragility suggests the system may be vulnerable to operational disruption. Use the top drivers as a starting point for inspection.";
    }
    if (scannerResult.fragility_score >= 0.4) {
      return "Review the top drivers before testing another scenario. They point to the most likely weak points in the current update.";
    }
    return "The system looks relatively contained, but the top drivers still show where pressure could build next.";
  }, [scannerResult]);
  const sceneTargets = useMemo(() => {
    const payloadObjects = Array.isArray(scannerResult?.scene_payload?.objects) ? scannerResult.scene_payload.objects : [];
    const focusSet = new Set(
      Array.isArray(scannerResult?.scene_payload?.suggested_focus)
        ? scannerResult.scene_payload.suggested_focus.map((value) => String(value))
        : []
    );
    return payloadObjects.slice(0, 4).map((item) => {
      const id = String(item.id ?? "").trim();
      return {
        id,
        label: formatSceneObjectLabel(id),
        reason: String(item.reason ?? "").trim(),
        isPrimaryFocus: focusSet.has(id),
      };
    });
  }, [scannerResult]);

  const handleRun = async () => {
    setScannerLoading(true);
    setScannerError(null);

    try {
      const result = await runFragilityScan({
        text: scannerText,
        mode: "business",
      });
      setScannerResult(result);
      onScanComplete?.(result);
    } catch (error) {
      setScannerError(error instanceof Error ? error.message : "Unable to run fragility scan right now.");
    } finally {
      setScannerLoading(false);
    }
  };

  const handleClear = () => {
    setScannerText("");
    setScannerError(null);
    setScannerResult(null);
  };

  return (
    <section style={PANEL_STYLE} aria-label="Fragility scanner" aria-busy={scannerLoading}>
      <div style={CARD_STYLE}>
        <div>
          <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 800 }}>Fragility Scanner</div>
          <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.45, marginTop: 4 }}>
            Paste a business update, report excerpt, or operational concern to detect fragility drivers.
          </div>
        </div>

        <label htmlFor="fragility-scanner-mini-text" style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700 }}>
          Business text
        </label>
        <textarea
          id="fragility-scanner-mini-text"
          value={scannerText}
          onChange={(event) => setScannerText(event.target.value)}
          placeholder="Example: Our main supplier is overloaded, delivery delays are increasing, and inventory buffers are shrinking."
          style={INPUT_STYLE}
          disabled={scannerLoading}
        />

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700 }}>Try an example</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EXAMPLE_INPUTS.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => {
                  setScannerText(example.text);
                  setScannerError(null);
                }}
                disabled={scannerLoading}
                style={{
                  padding: "7px 10px",
                  borderRadius: 999,
                  border: `1px solid ${nx.border}`,
                  background: "rgba(2,6,23,0.42)",
                  color: "#cbd5e1",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: scannerLoading ? "not-allowed" : "pointer",
                }}
              >
                {example.label}
              </button>
            ))}
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
            {scannerLoading ? "Scanning fragility..." : "Run Fragility Scan"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={scannerLoading}
            style={{
              padding: "9px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(15,23,42,0.58)",
              color: "#cbd5e1",
              fontSize: 12,
              cursor: scannerLoading ? "not-allowed" : "pointer",
            }}
          >
            Clear scan
          </button>
        </div>

        {scannerError ? (
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
            {scannerError}
          </div>
        ) : null}
      </div>

      {!hasResult && !scannerError ? (
        <div style={SUBTLE_CARD_STYLE}>
          <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>
            Reveal weak points from plain-language updates
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>
            {interpretationHint}
          </div>
          <div style={{ color: "#64748b", fontSize: 11, lineHeight: 1.45 }}>
            You will get back a summary, fragility score, risk level, and top drivers.
          </div>
        </div>
      ) : null}

      {scannerResult ? (
        <div style={CARD_STYLE}>
          <div style={SECTION_HEADING_STYLE}>
            Summary
          </div>
          <div style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.55, fontWeight: 600 }}>
            {scannerResult.summary || "No summary returned."}
          </div>
          {scannerResult.scene_payload?.scanner_overlay?.summary &&
          scannerResult.scene_payload.scanner_overlay.summary !== scannerResult.summary ? (
            <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>
              Scene note: {scannerResult.scene_payload.scanner_overlay.summary}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "stretch" }}>
            <div style={{ minWidth: 120 }}>
              <div style={SECTION_HEADING_STYLE}>Risk Score</div>
              <div style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 800 }}>
                {Number.isFinite(scannerResult.fragility_score) ? scannerResult.fragility_score.toFixed(2) : "0.00"}
              </div>
            </div>
            <div style={{ minWidth: 140 }}>
              <div style={SECTION_HEADING_STYLE}>Risk Level</div>
              <div
                style={{
                  marginTop: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 999,
                  color: levelUi.color,
                  background: levelUi.background,
                  border: `1px solid ${levelUi.border}`,
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {scannerResult.fragility_level || "unknown"}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={SECTION_HEADING_STYLE}>
              Top Drivers
            </div>
            {Array.isArray(scannerResult.drivers) && scannerResult.drivers.length > 0 ? (
              scannerResult.drivers.map((driver) => (
                <div
                  key={driver.id}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(2,6,23,0.42)",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}>{driver.label}</div>
                    <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>
                      {driver.severity}
                    </div>
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700 }}>
                    {Number.isFinite(driver.score) ? driver.score.toFixed(2) : "0.00"}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "#64748b", fontSize: 12 }}>
                No clear fragility drivers were returned.
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={SECTION_HEADING_STYLE}>Scene Focus</div>
            {sceneTargets.length > 0 ? (
              sceneTargets.map((target) => (
                <div
                  key={target.id}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: target.isPrimaryFocus
                      ? "1px solid rgba(96,165,250,0.34)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: target.isPrimaryFocus ? "rgba(59,130,246,0.14)" : "rgba(2,6,23,0.42)",
                    display: "grid",
                    gap: 4,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}>{target.label}</div>
                    <div style={{ color: target.isPrimaryFocus ? "#93c5fd" : "#64748b", fontSize: 10, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
                      {target.isPrimaryFocus ? "Primary Focus" : "Highlighted"}
                    </div>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 11 }}>{target.id}</div>
                  {target.reason ? (
                    <div style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.45 }}>{target.reason}</div>
                  ) : (
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      Highlighted by the current fragility analysis.
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ color: "#64748b", fontSize: 12 }}>
                No scene-linked targets were returned for this scan.
              </div>
            )}
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: `1px solid ${nx.border}`,
              background: "rgba(2,6,23,0.36)",
              color: "#94a3b8",
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            {interpretationHint}
          </div>
        </div>
      ) : null}
    </section>
  );
}
