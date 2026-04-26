"use client";

import React from "react";
import { nx, primaryButtonStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

const DEFAULT_DEMO = "retail_supply_chain_fragility";
const DEFAULT_DOMAIN = "general";
const PANEL_SOURCE = "source_control_panel";

const INTAKE_CHIPS = [
  { label: "Supplier delay", text: "Supplier delays are increasing, inventory buffers are shrinking, and fulfillment risk is rising." },
  { label: "Inventory pressure", text: "Inventory buffers are shrinking while demand stays elevated." },
  { label: "Demand spike", text: "A demand spike is stressing capacity and stretching lead times." },
] as const;

const EXAMPLE_PLACEHOLDER =
  "Example: Supplier delays are increasing, inventory buffers are shrinking, and customer complaints are rising…";

const CENTER_CLOSE_AFTER_ANALYSIS_MS = 250;

export type SourceControlPanelMode = "center" | "panel";

export type SourceControlPanelProps = {
  mode?: SourceControlPanelMode;
  onClose?: (() => void) | null;
};

export default function SourceControlPanel(props: SourceControlPanelProps = {}) {
  const mode = props.mode ?? "panel";
  const onClose = props.onClose ?? null;

  const [inputText, setInputText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isExiting, setIsExiting] = React.useState(false);
  const exitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    const onFinished = (event: Event) => {
      const d = (event as CustomEvent<{ source?: string; failed?: boolean }>).detail;
      if (d?.source !== PANEL_SOURCE) return;
      setIsSubmitting(false);
      if (d?.failed) {
        setError("We could not complete the analysis. Check your connection and try again.");
        return;
      }
      setError(null);
    };
    window.addEventListener("nexora:input-pipeline-finished", onFinished as EventListener);
    return () => window.removeEventListener("nexora:input-pipeline-finished", onFinished as EventListener);
  }, []);

  React.useEffect(() => {
    if (mode !== "center" || typeof onClose !== "function") return;
    const onAnalysisComplete = (event: Event) => {
      const d = (event as CustomEvent<{ ok?: boolean; source?: string }>).detail;
      if (!d?.ok || d.source !== "input_center") return;
      setIsExiting(true);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      exitTimerRef.current = setTimeout(() => {
        exitTimerRef.current = null;
        onClose();
      }, CENTER_CLOSE_AFTER_ANALYSIS_MS);
    };
    window.addEventListener("nexora:analysis-complete", onAnalysisComplete as EventListener);
    return () => window.removeEventListener("nexora:analysis-complete", onAnalysisComplete as EventListener);
  }, [mode, onClose]);

  const appendChipText = React.useCallback((snippet: string) => {
    setInputText((prev) => {
      const t = prev.trim();
      if (!t) return snippet;
      if (prev.includes(snippet)) return prev;
      return `${prev.replace(/\s+$/, "")}\n\n${snippet}`;
    });
  }, []);

  const handleAnalyze = React.useCallback(() => {
    const text = inputText.trim();
    if (!text || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    window.dispatchEvent(
      new CustomEvent("nexora:run-business-text-ingestion", {
        detail: {
          text,
          source: PANEL_SOURCE,
          domainId: "business",
          openPanel: "fragility",
        },
      })
    );
  }, [inputText, isSubmitting]);

  const handleLoadDemo = React.useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("nexora:load-demo-scenario", {
        detail: {
          demo: DEFAULT_DEMO,
          domainId: DEFAULT_DOMAIN,
          profileId: null,
        },
      })
    );
  }, []);

  const openAppearanceMenu = React.useCallback(() => {
    window.dispatchEvent(new CustomEvent("nexora:open-scene-appearance-menu"));
  }, []);

  const analyzeDisabled = !inputText.trim() || isSubmitting;

  const panelBody = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
      {mode === "panel" ? (
        <div style={{ ...softCardStyle, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Decision intake
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: nx.text, marginTop: 6 }}>Describe your situation</div>
          <div style={{ fontSize: 11, color: nx.muted, marginTop: 4, lineHeight: 1.45 }}>
            Nexora analyzes fragility and surfaces recommended moves on the right rail.
          </div>
        </div>
      ) : null}

      <div style={{ ...softCardStyle, padding: 12 }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={EXAMPLE_PLACEHOLDER}
          style={{
            marginTop: 0,
            width: "100%",
            minHeight: 100,
            resize: "vertical",
            background: "transparent",
            border: "none",
            color: nx.text,
            outline: "none",
            fontSize: 12,
            lineHeight: 1.5,
            fontFamily: "inherit",
          }}
        />
      </div>

      {error ? (
        <div style={{ fontSize: 12, color: nx.risk, lineHeight: 1.45 }} role="alert">
          {error}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={secondaryButtonStyle} disabled title="Coming soon">
          Upload file
        </button>
        <button type="button" style={secondaryButtonStyle} disabled title="Coming soon">
          Connect API
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={handleLoadDemo} disabled={isSubmitting}>
          Load demo
        </button>
      </div>

      <button
        type="button"
        style={{
          ...primaryButtonStyle,
          width: "100%",
          marginTop: 8,
          fontSize: 14,
          fontWeight: 600,
          opacity: analyzeDisabled ? 0.55 : 1,
          cursor: analyzeDisabled ? "not-allowed" : "pointer",
        }}
        onClick={handleAnalyze}
        disabled={analyzeDisabled}
      >
        {isSubmitting ? "Analyzing system…" : "Analyze system → reveal risk"}
      </button>

      <button
        type="button"
        onClick={openAppearanceMenu}
        style={{
          marginTop: 8,
          alignSelf: "flex-start",
          padding: 0,
          border: "none",
          background: "none",
          fontSize: 11,
          color: nx.muted,
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        Adjust scene appearance
      </button>
    </div>
  );

  if (mode === "center" && typeof onClose === "function") {
    return (
      <div
        className={`nexora-input-center-overlay absolute inset-0 z-40 flex items-center justify-center bg-black/30 p-6 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isExiting ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Decision intake"
        onMouseDown={(e) => {
          if (isExiting) return;
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className={`w-full max-w-[640px] space-y-4 rounded-2xl bg-white p-6 shadow-2xl transition-opacity duration-300 ease-out ${
            isExiting ? "opacity-0" : "opacity-100"
          } max-h-[min(90vh,720px)] overflow-y-auto`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="mb-4 min-w-0 flex-1">
              <div className="text-sm text-neutral-500">Decision Intake</div>
              <div className="text-xl font-semibold tracking-tight text-neutral-900">Describe your situation</div>
              <div className="mt-1 text-sm text-neutral-600">Nexora will analyze system fragility and recommend actions.</div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100"
              onClick={onClose}
              aria-label="Close decision intake"
            >
              Close
            </button>
          </div>

          <div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={EXAMPLE_PLACEHOLDER}
              disabled={isSubmitting}
              rows={5}
              className="min-h-[120px] w-full resize-y rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-3 text-sm leading-relaxed text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {INTAKE_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => appendChipText(chip.text)}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </div>
          ) : null}

          <div className="mt-1 border-t border-neutral-200 pt-3">
            <div className="mb-2 text-xs font-medium text-neutral-500">Optional data sources</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled
                title="Coming soon"
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-500"
              >
                Upload file
              </button>
              <button
                type="button"
                disabled
                className="rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-400"
              >
                Connect API
              </button>
              <button
                type="button"
                onClick={handleLoadDemo}
                disabled={isSubmitting}
                className="rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
              >
                Load demo
              </button>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-neutral-900 py-3 text-base font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleAnalyze}
            disabled={analyzeDisabled}
          >
            {isSubmitting ? "Analyzing system…" : "Analyze system → reveal risk"}
          </button>

          <button
            type="button"
            onClick={openAppearanceMenu}
            className="mt-1 text-left text-xs text-neutral-500 underline decoration-neutral-400 underline-offset-2 transition hover:text-neutral-700"
          >
            Adjust scene appearance
          </button>
        </div>
      </div>
    );
  }

  return panelBody;
}
