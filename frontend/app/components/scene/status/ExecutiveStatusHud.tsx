"use client";

import React from "react";

import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import {
  resolveAttentionHierarchyStyle,
  resolveExecutiveConfidenceLabel,
  resolveExecutiveFrsiDisplay,
  shouldHideDuplicateInformation,
} from "../../../lib/workspace/minimalism";
import { resolveSceneThemeTokens } from "../../../lib/theme/sceneThemeTokens";
import { useSceneHudTheme, useSceneThemeOptional } from "../../../lib/theme/useSceneTheme";
import {
  logExecutiveStatusConfidenceRendered,
  logExecutiveStatusFrsiRendered,
  logExecutiveStatusHealthRendered,
  logExecutiveStatusHudMounted,
  logExecutiveStatusHudUpdated,
  logExecutiveStatusReadinessRendered,
} from "../../../lib/ui/executiveStatusInstrumentation";
import type { PanelSizeMode } from "../../../lib/ui/workspaceLayoutTypes";
import type { ExecutiveStatusHudModel } from "./ExecutiveStatusHud.types";
import {
  executiveStatusChipStyle,
  executiveStatusHeadlineStyle,
  executiveStatusMetricLabelStyle,
  executiveStatusMetricValueStyle,
  executiveStatusShellStyle,
  executiveStatusSublineStyle,
  severityColor,
} from "./ExecutiveStatusHud.theme";

export type ExecutiveStatusHudProps = {
  model: ExecutiveStatusHudModel;
  themeMode?: NexoraHudThemeMode;
  panelSizeMode?: PanelSizeMode;
  commandBarVisible?: boolean;
};

function StatusMetric(props: {
  label: string;
  value: string;
  subline?: string | null;
  theme: ReturnType<typeof useSceneHudTheme>;
  accent?: string;
}): React.ReactElement {
  return (
    <div style={{ minWidth: 0, flex: "1 1 72px" }}>
      <div style={executiveStatusMetricLabelStyle(props.theme)}>{props.label}</div>
      <div style={{ ...executiveStatusMetricValueStyle(props.theme), color: props.accent ?? props.theme.textPrimary }}>
        {props.value}
      </div>
      {props.subline ? <div style={executiveStatusSublineStyle(props.theme)}>{props.subline}</div> : null}
    </div>
  );
}

export function ExecutiveStatusHud(props: ExecutiveStatusHudProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const lastSignatureRef = React.useRef<string | null>(null);
  const sceneTheme = useSceneThemeOptional();
  const theme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const { model } = props;
  const compact = props.panelSizeMode === "compact";
  const commandBarVisible = props.commandBarVisible ?? true;
  const headlineStyle = resolveAttentionHierarchyStyle("pipeline_headline");
  const hideFrsi = shouldHideDuplicateInformation("frsi_score", {
    surface: "status_hud",
    commandBarVisible,
    statusHudVisible: true,
  });
  const hideHealthMetrics = shouldHideDuplicateInformation("health", {
    surface: "status_hud",
    commandBarVisible,
    statusHudVisible: true,
  });
  const hideReadiness = shouldHideDuplicateInformation("readiness", {
    surface: "status_hud",
    commandBarVisible,
    statusHudVisible: true,
  });
  const hideConfidence = shouldHideDuplicateInformation("confidence", {
    surface: "status_hud",
    commandBarVisible,
    statusHudVisible: true,
  });
  const hideScenarioChips = shouldHideDuplicateInformation("scenario_status", {
    surface: "status_hud",
    commandBarVisible,
    statusHudVisible: true,
  });
  const visibleChips = model.chips.filter((chip) => {
    if (hideScenarioChips && chip.id === "scenario") return false;
    if (hideReadiness && chip.id === "readiness") return false;
    if (hideConfidence && chip.id === "confidence") return false;
    if (hideFrsi && chip.id === "risk") return false;
    return true;
  });

  React.useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logExecutiveStatusHudMounted();
  }, []);

  React.useEffect(() => {
    const signature = JSON.stringify(model.snapshot);
    if (lastSignatureRef.current === signature) return;
    lastSignatureRef.current = signature;
    logExecutiveStatusHudUpdated({
      source: "ExecutiveStatusHud",
      reason: lastSignatureRef.current ? "snapshot_changed" : "initial",
      snapshot: model.snapshot as Record<string, unknown>,
    });
    logExecutiveStatusFrsiRendered({
      source: "ExecutiveStatusHud",
      score: model.frsiScore,
      trend: model.frsiTrendLabel,
    });
    logExecutiveStatusConfidenceRendered({
      source: "ExecutiveStatusHud",
      decision: model.confidenceDecision,
      analysis: model.confidenceAnalysis,
      scenario: model.confidenceScenario,
    });
    logExecutiveStatusReadinessRendered({
      source: "ExecutiveStatusHud",
      readiness: model.readinessLabel,
    });
    logExecutiveStatusHealthRendered({
      source: "ExecutiveStatusHud",
      health: model.healthLabel,
    });
  }, [model]);

  return (
    <div
      data-nx="executive-status-hud"
      data-hud="executive-status"
      data-nx-theme={theme.mode}
      data-nx-severity={model.severity}
      style={executiveStatusShellStyle(theme, model.severity)}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <div
        style={{
          ...executiveStatusHeadlineStyle(theme),
          opacity: headlineStyle.opacityMultiplier,
          fontWeight: headlineStyle.fontWeight,
        }}
        title={model.headline}
      >
        {model.headline}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, minWidth: 0 }}>
        {!hideFrsi ? (
          <StatusMetric
            label="FRSI"
            value={resolveExecutiveFrsiDisplay(model.frsiScore)}
            subline={`${model.frsiTrendLabel} · ${model.riskPosture}`}
            theme={theme}
            accent={severityColor(theme, model.chips.find((chip) => chip.id === "risk")?.severity ?? "normal")}
          />
        ) : null}
        {!compact && !hideReadiness ? (
          <>
            <StatusMetric
              label="Readiness"
              value={model.readinessLabel}
              theme={theme}
              accent={severityColor(
                theme,
                model.chips.find((chip) => chip.id === "readiness")?.severity ?? "attention"
              )}
            />
            {!hideConfidence ? (
              <StatusMetric
                label="Confidence"
                value={
                  model.confidenceDecision
                    ? model.confidenceDecision
                    : resolveExecutiveConfidenceLabel(null).replace(/^Confidence /, "")
                }
                subline={
                  model.confidenceScenario
                    ? `Scenario ${model.confidenceScenario}`
                    : model.confidenceAnalysis
                      ? `Analysis ${model.confidenceAnalysis}`
                      : null
                }
                theme={theme}
              />
            ) : null}
          </>
        ) : null}
      </div>

      {!compact && visibleChips.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {visibleChips.map((chip) => (
            <span
              key={chip.id}
              style={executiveStatusChipStyle(tokens, chip.severity, chip.severity !== "normal")}
            >
              {chip.label}
            </span>
          ))}
        </div>
      ) : (
        <div style={executiveStatusSublineStyle(theme)}>
          {!hideHealthMetrics ? `${model.healthLabel} · ` : ""}
          {!hideConfidence
            ? model.confidenceDecision
              ? `Confidence ${model.confidenceDecision}`
              : resolveExecutiveConfidenceLabel(null)
            : null}
        </div>
      )}
    </div>
  );
}

export default ExecutiveStatusHud;
