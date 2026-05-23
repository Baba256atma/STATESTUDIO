"use client";

import React, { useEffect, useMemo, useRef } from "react";

import {
  nexoraHudSectionLabelStyle,
  type NexoraHudThemeMode,
} from "../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import {
  logExecutiveScenarioComparisonSelected,
  logExecutiveScenarioComparisonSimulationRequested,
  logExecutiveScenarioComparisonThemeResolved,
  logExecutiveScenarioComparisonWorkspaceMounted,
  logExecutiveScenarioDecisionEvaluationRendered,
  logExecutiveScenarioOptionCompared,
} from "../../lib/ui/executiveScenarioComparisonInstrumentation";
import type { ExecutiveScenarioComparisonModel, ScenarioComparisonOption } from "../../lib/ui/scenarioComparisonTypes";
import {
  formatScenarioCostLevel,
  formatScenarioRecommendationLevel,
  formatScenarioRiskChange,
  formatScenarioSpeedLevel,
} from "../../lib/ui/scenarioComparisonTypes";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveScenarioComparisonPanelProps = {
  open: boolean;
  model: ExecutiveScenarioComparisonModel;
  selectedScenarioId?: string | null;
  themeMode?: NexoraHudThemeMode;
  onSelectScenario?: (option: ScenarioComparisonOption) => void;
  onSimulateSelected?: (option: ScenarioComparisonOption | null) => void;
  onCompareDetails?: (optionIds: string[]) => void;
  onExplainWhy?: (option: ScenarioComparisonOption | null) => void;
};

function formatFrsiImpact(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value > 0 ? `+${value}` : `${value}`;
}

function recommendationColor(
  level: ScenarioComparisonOption["recommendationLevel"],
  theme: ReturnType<typeof useSceneHudTheme>
): string {
  if (level === "recommended") return theme.success;
  if (level === "risky") return theme.warning;
  return theme.accent;
}

function ComparisonMetric(props: {
  label: string;
  value: string;
  theme: ReturnType<typeof useSceneHudTheme>;
  accent?: string;
}): React.ReactElement {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: props.theme.label }}>
        {props.label}
      </div>
      <div style={{ marginTop: 2, fontSize: 10, fontWeight: 700, color: props.accent ?? props.theme.text }}>
        {props.value}
      </div>
    </div>
  );
}

function ComparisonOptionRow(props: {
  option: ScenarioComparisonOption;
  selected: boolean;
  focused: boolean;
  theme: ReturnType<typeof useSceneHudTheme>;
  onSelect: () => void;
}): React.ReactElement {
  const { option, selected, focused, theme, onSelect } = props;
  const accent = recommendationColor(option.recommendationLevel, theme);
  const borderColor = selected
    ? `color-mix(in srgb, ${accent} 55%, ${theme.controlBorder})`
    : focused
      ? `color-mix(in srgb, ${nx.accent} 35%, ${theme.controlBorder})`
      : theme.controlBorder;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "9px 10px",
        borderRadius: 10,
        border: `1px solid ${borderColor}`,
        background: selected
          ? `color-mix(in srgb, ${accent} 10%, ${theme.controlBackground})`
          : theme.controlBackground,
        color: theme.text,
        cursor: "pointer",
        boxShadow: selected && theme.mode === "night" ? `0 0 16px ${accent}20` : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ minWidth: 0, fontSize: 11, fontWeight: 800, lineHeight: 1.35 }}>{option.title}</div>
        <span
          style={{
            flexShrink: 0,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {formatScenarioRecommendationLevel(option.recommendationLevel)}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          marginTop: 8,
        }}
      >
        <ComparisonMetric
          label="Confidence"
          value={typeof option.confidence === "number" ? `${option.confidence}%` : "—"}
          theme={theme}
        />
        <ComparisonMetric
          label="FRSI Impact"
          value={formatFrsiImpact(option.expectedFrsiImpact)}
          theme={theme}
          accent={
            typeof option.expectedFrsiImpact === "number" && option.expectedFrsiImpact <= 0
              ? theme.success
              : theme.warning
          }
        />
        <ComparisonMetric
          label="Risk"
          value={formatScenarioRiskChange(option.riskChange)}
          theme={theme}
          accent={option.riskChange === "lower" ? theme.success : option.riskChange === "higher" ? theme.warning : theme.textMuted}
        />
        <ComparisonMetric label="Cost" value={formatScenarioCostLevel(option.costLevel)} theme={theme} />
        <ComparisonMetric label="Speed" value={formatScenarioSpeedLevel(option.speed)} theme={theme} />
        <ComparisonMetric
          label="Rec"
          value={formatScenarioRecommendationLevel(option.recommendationLevel)}
          theme={theme}
          accent={accent}
        />
      </div>
    </button>
  );
}

export function ExecutiveScenarioComparisonPanel(
  props: ExecutiveScenarioComparisonPanelProps
): React.ReactElement {
  const {
    open,
    model,
    selectedScenarioId = null,
    themeMode = "night",
    onSelectScenario,
    onSimulateSelected,
    onCompareDetails,
    onExplainWhy,
  } = props;

  const mountedRef = useRef(false);
  const theme = useSceneHudTheme(themeMode);
  const selectedOption = useMemo(
    () => model.options.find((option) => option.id === selectedScenarioId) ?? null,
    [model.options, selectedScenarioId]
  );
  const focusSet = useMemo(() => new Set(model.focusScenarioIds), [model.focusScenarioIds]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logExecutiveScenarioComparisonWorkspaceMounted();
  }, []);

  useEffect(() => {
    logExecutiveScenarioComparisonThemeResolved(theme.mode);
  }, [theme.mode]);

  useEffect(() => {
    for (const option of model.options) {
      logExecutiveScenarioOptionCompared(option.id);
    }
    logExecutiveScenarioDecisionEvaluationRendered(model.summary.bestOptionId);
  }, [model.options, model.summary.bestOptionId]);

  if (!open) {
    return <div aria-hidden style={{ display: "none" }} />;
  }

  const actionButtonStyle = (primary?: boolean): React.CSSProperties => ({
    flex: "1 1 0",
    minWidth: 0,
    padding: "7px 8px",
    borderRadius: 9,
    border: `1px solid ${primary ? nx.accent : theme.controlBorder}`,
    background: primary ? nx.accentSoft : theme.buttonBackground,
    color: primary ? nx.accent : theme.buttonText,
    fontSize: 10,
    fontWeight: 800,
    cursor: "pointer",
    lineHeight: 1.25,
  });

  return (
    <div
      data-hud="executive-scenario-comparison-panel"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
        background: theme.shellBackground,
        backdropFilter: "blur(14px)",
        color: theme.text,
      }}
    >
      <header
        style={{
          flexShrink: 0,
          padding: "10px 12px 8px",
          borderBottom: `1px solid ${theme.shellBorder}`,
          background: theme.headerBackground,
        }}
      >
        <div style={{ ...nexoraHudSectionLabelStyle(theme), marginBottom: 4 }}>Scenario Comparison</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, lineHeight: 1.4 }}>
          Evaluate alternatives before simulation or commitment.
        </div>
      </header>

      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          padding: "8px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {model.options.map((option) => (
          <ComparisonOptionRow
            key={option.id}
            option={option}
            selected={selectedScenarioId === option.id}
            focused={focusSet.has(option.id)}
            theme={theme}
            onSelect={() => {
              logExecutiveScenarioComparisonSelected({
                scenarioId: option.id,
                title: option.title,
              });
              onSelectScenario?.(option);
            }}
          />
        ))}
      </div>

      <div
        style={{
          flexShrink: 0,
          margin: "0 10px",
          padding: "9px 10px",
          borderRadius: 10,
          border: `1px solid ${theme.controlBorder}`,
          background: theme.controlBackground,
        }}
      >
        <div style={{ ...nexoraHudSectionLabelStyle(theme), marginBottom: 6 }}>Decision Evaluation</div>
        <div style={{ fontSize: 11, fontWeight: 800, color: theme.text, lineHeight: 1.35 }}>
          Best Option: {model.summary.bestOptionTitle}
        </div>
        <div style={{ marginTop: 6, fontSize: 10, lineHeight: 1.45, color: theme.textMuted }}>
          <strong style={{ color: theme.text }}>Why: </strong>
          {model.summary.whyItMatters}
        </div>
        <div style={{ marginTop: 4, fontSize: 10, lineHeight: 1.45, color: theme.textMuted }}>
          <strong style={{ color: theme.text }}>Tradeoff: </strong>
          {model.summary.tradeoff}
        </div>
        <div style={{ marginTop: 4, fontSize: 10, lineHeight: 1.45, color: theme.textMuted }}>
          <strong style={{ color: theme.text }}>Next: </strong>
          {model.summary.nextSuggestedAction}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: "10px 10px 12px",
          borderTop: `1px solid ${theme.shellBorder}`,
          background: theme.headerBackground,
        }}
      >
        <button
          type="button"
          style={actionButtonStyle()}
          onClick={() => {
            if (selectedOption) onSelectScenario?.(selectedOption);
          }}
        >
          Select Scenario
        </button>
        <button
          type="button"
          style={actionButtonStyle(true)}
          disabled={!selectedOption}
          onClick={() => {
            logExecutiveScenarioComparisonSimulationRequested({
              scenarioId: selectedOption?.id ?? null,
              title: selectedOption?.title ?? null,
            });
            onSimulateSelected?.(selectedOption);
          }}
        >
          Simulate Selected
        </button>
        <button
          type="button"
          style={actionButtonStyle()}
          onClick={() => onCompareDetails?.(model.focusScenarioIds)}
        >
          Compare Details
        </button>
        <button
          type="button"
          style={actionButtonStyle()}
          disabled={!selectedOption && !model.summary.bestOptionTitle}
          onClick={() => onExplainWhy?.(selectedOption)}
        >
          Explain Why
        </button>
      </div>
    </div>
  );
}
