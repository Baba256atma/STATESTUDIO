"use client";

import React from "react";

import { nx, sectionTitleStyle, softCardStyle, primaryButtonStyle, secondaryButtonStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";
import type { StrategyGenerationMode, StrategyPreferredFocus } from "../../lib/strategy-generation/strategyGenerationTypes";
import type { WarRoomController } from "../../lib/warroom/warRoomTypes";
import { StrategyDetail } from "./StrategyDetail";
import { StrategyList } from "./StrategyList";

type StrategyPanelProps = {
  controller: WarRoomController;
};

const MODES: StrategyGenerationMode[] = ["explore", "optimize", "stress_test"];
const FOCI: StrategyPreferredFocus[] = ["risk", "growth", "efficiency", "stability"];

export function StrategyPanel({ controller }: StrategyPanelProps) {
  const strategyState = controller.state.strategyGeneration;
  const result = controller.strategyGeneration;
  const selected =
    result?.strategies.find((item) => item.strategy.strategy_id === strategyState.selectedStrategyId) ??
    result?.strategies[0] ??
    null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Strategy Generation</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 10 }}>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Generate deterministic strategy options from the current intelligence layer, then run the strongest move through the existing War Room pipeline.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6 }}>
          {MODES.map((mode) => {
            const active = strategyState.mode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => controller.setStrategyGenerationMode(mode)}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${active ? nx.borderStrong : nx.border}`,
                  background: active ? "rgba(59,130,246,0.16)" : "rgba(2,6,23,0.42)",
                  color: active ? "#dbeafe" : nx.text,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "8px 6px",
                  cursor: "pointer",
                }}
              >
                {mode === "stress_test" ? "Stress Test" : mode[0].toUpperCase() + mode.slice(1)}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
          {FOCI.map((focus) => {
            const active = strategyState.preferredFocus === focus;
            return (
              <button
                key={focus}
                type="button"
                onClick={() => controller.setStrategyPreferredFocus(focus)}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${active ? nx.borderStrong : nx.border}`,
                  background: active ? "rgba(59,130,246,0.16)" : "rgba(2,6,23,0.42)",
                  color: active ? "#dbeafe" : nx.text,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "8px 6px",
                  cursor: "pointer",
                }}
              >
                {focus[0].toUpperCase() + focus.slice(1)}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button type="button" onClick={() => void controller.generateStrategies()} style={primaryButtonStyle}>
            Generate Strategies
          </button>
          <button type="button" onClick={() => controller.clearStrategies()} style={secondaryButtonStyle}>
            Clear Strategies
          </button>
        </div>
      </div>

      {strategyState.loading ? <LoadingStateCard text="Synthesizing and ranking candidate strategies…" /> : null}
      {strategyState.error ? <ErrorStateCard text={strategyState.error} /> : null}
      {!strategyState.loading && !strategyState.error && !result ? (
        <EmptyStateCard text="Run a scenario first, then generate ranked strategy options from the current intelligence state." />
      ) : null}

      {result ? (
        <>
          <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
            <div style={{ color: nx.text, fontSize: 14, fontWeight: 800 }}>{result.summary.headline}</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{result.summary.explanation}</div>
            <div style={{ color: "#cbd5e1", fontSize: 12 }}>Confidence {Math.round(result.summary.confidence * 100)}%</div>
          </div>
          <StrategyList
            result={result}
            selectedStrategyId={strategyState.selectedStrategyId}
            onSelect={controller.selectGeneratedStrategy}
          />
          <StrategyDetail
            item={selected}
            onRun={() => {
              if (selected) controller.runGeneratedStrategy(selected.strategy.strategy_id);
            }}
          />
        </>
      ) : null}
    </div>
  );
}
