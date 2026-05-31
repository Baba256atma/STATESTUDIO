"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  nexoraHudSectionLabelStyle,
  type NexoraHudThemeMode,
} from "../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { useViewportWidthListener } from "../../lib/dom/useDomListener";
import { buildViewportResizeSignature } from "../../lib/layout/viewportResizeRuntime";
import {
  logExecutiveCommandBarActionTriggered,
  logExecutiveCommandBarMounted,
  logExecutiveCommandBarThemeResolved,
  logExecutiveDecisionStatusRendered,
  logExecutiveFrsiStatusRendered,
  logExecutiveReadinessRendered,
  logExecutiveScenarioStatusRendered,
} from "../../lib/ui/executiveCommandBarInstrumentation";
import {
  EXECUTIVE_COMMAND_BAR_ACTIONS,
  type ExecutiveCommandBarActionId,
  type ExecutiveCommandBarModel,
  type ExecutivePrioritySemantic,
} from "../../lib/ui/executiveCommandBarTypes";
import { ExecutiveViewModeControlResponsive } from "./ExecutiveViewModeControl";
import { ExecutiveLayoutPresetControlResponsive } from "./ExecutiveLayoutPresetControl";
import { ExecutiveHudSettingsMenu } from "./ExecutiveHudSettingsMenu";
import { ExecutiveCommandBarOverflowMenu } from "./ExecutiveCommandBarOverflowMenu";
import {
  auditExecutiveMinimalism,
  isTopBarActionOverflow,
  isTopBarItemOverflow,
  resolveExecutiveVisualWeight,
  resolveTopBarPriority,
} from "../../lib/workspace/minimalism";
import {
  executiveMotionTransition,
  executiveStatusDotStyle,
  resolveExecutiveStatusFromPriority,
  resolveExecutiveVocabulary,
} from "../../lib/workspace/harmonization";
import { resolveSceneThemeTokens } from "../../lib/theme/sceneThemeTokens";

export type ExecutiveCommandBarProps = {
  model: ExecutiveCommandBarModel;
  themeMode?: NexoraHudThemeMode;
  onAction?: (actionId: ExecutiveCommandBarActionId) => void;
  statusHudVisible?: boolean;
  quickActionsVisible?: boolean;
};

function StatusBlock(props: {
  title: string;
  primary: string;
  secondary: string;
  tertiary?: string;
  priority: ExecutivePrioritySemantic;
  theme: ReturnType<typeof useSceneHudTheme>;
  compact?: boolean;
  visualWeight: ReturnType<typeof resolveExecutiveVisualWeight>;
}): React.ReactElement {
  const tokens = resolveSceneThemeTokens(props.theme.mode);
  const status = resolveExecutiveStatusFromPriority(props.priority, tokens);
  return (
    <div
      style={{
        minWidth: 0,
        flex: props.compact ? "1 1 120px" : "1 1 140px",
        padding: `${props.visualWeight.blockPaddingPx}px 10px`,
        borderRadius: 9,
        border: `${props.visualWeight.borderWidthPx}px solid ${props.theme.controlBorder}`,
        background: props.theme.controlBackground,
      }}
    >
      <div style={{ ...nexoraHudSectionLabelStyle(props.theme), marginBottom: 4 }}>
        {resolveExecutiveVocabulary(props.title)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
        <span aria-hidden style={executiveStatusDotStyle(status)} />
        <div style={{ fontSize: props.compact ? 12 : 13, fontWeight: 800, color: props.theme.text, lineHeight: 1.2, minWidth: 0 }}>
          {props.primary}
        </div>
      </div>
      <div style={{ marginTop: 4, fontSize: 10, fontWeight: 600, color: props.theme.textMuted, lineHeight: 1.35 }}>
        {props.secondary}
      </div>
      {props.tertiary ? (
        <div style={{ marginTop: 2, fontSize: 10, fontWeight: 700, color: status.color, lineHeight: 1.35 }}>{props.tertiary}</div>
      ) : null}
    </div>
  );
}

export function ExecutiveCommandBar(props: ExecutiveCommandBarProps): React.ReactElement {
  const { model, themeMode = "night", onAction, statusHudVisible = true, quickActionsVisible = false } = props;
  const mountedRef = useRef(false);
  const theme = useSceneHudTheme(themeMode);
  const visualWeight = resolveExecutiveVisualWeight("PRIMARY", theme.mode);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useViewportWidthListener(setViewportWidth, "ExecutiveCommandBar");

  const viewportLayoutSignature = useMemo(
    () => buildViewportResizeSignature(viewportWidth),
    [viewportWidth]
  );

  const topBarPriority = resolveTopBarPriority({
    viewportWidth,
    commandBarVisible: true,
    quickActionsVisible,
    statusHudVisible,
  });

  useEffect(() => {
    auditExecutiveMinimalism({
      commandBarVisible: true,
      statusHudVisible,
      sceneInfoVisible: true,
      objectInfoVisible: true,
      timelineVisible: true,
      quickActionsVisible,
      viewportWidth,
    });
  }, [quickActionsVisible, statusHudVisible, viewportLayoutSignature, viewportWidth]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logExecutiveCommandBarMounted();
  }, []);

  useEffect(() => {
    logExecutiveCommandBarThemeResolved(theme.mode);
  }, [theme.mode]);

  useEffect(() => {
    logExecutiveFrsiStatusRendered(model.frsi.score);
    logExecutiveScenarioStatusRendered(model.scenario.name);
    logExecutiveDecisionStatusRendered(model.decision.phase);
    logExecutiveReadinessRendered(model.readiness.phase);
  }, [model.decision.phase, model.frsi.score, model.readiness.phase, model.scenario.name]);

  const layoutMode = viewportWidth < 768 ? "mobile" : viewportWidth < 1100 ? "tablet" : "desktop";
  const visibleActions = EXECUTIVE_COMMAND_BAR_ACTIONS.filter(
    (action) => model.actions.includes(action.id) && !isTopBarActionOverflow(action.id, topBarPriority)
  );
  const overflowActions = EXECUTIVE_COMMAND_BAR_ACTIONS.filter(
    (action) => model.actions.includes(action.id) && isTopBarActionOverflow(action.id, topBarPriority)
  ).map((action) => action.id);
  const showReadiness = !isTopBarItemOverflow("readiness", topBarPriority);

  const handleAction = (actionId: ExecutiveCommandBarActionId) => {
    logExecutiveCommandBarActionTriggered(actionId);
    onAction?.(actionId);
  };

  return (
    <div
      id="nexora-executive-command-bar"
      data-hud="executive-command-bar"
      data-nx-layout={layoutMode}
      style={{
        position: "relative",
        zIndex: 12,
        flexShrink: 0,
        borderBottom: `1px solid ${theme.shellBorder}`,
        background: theme.shellBackground,
        backdropFilter: `blur(${visualWeight.backdropBlurPx}px)`,
        boxShadow: visualWeight.shellShadow,
        color: theme.text,
        transition: executiveMotionTransition("panel"),
      }}
    >
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: layoutMode === "mobile" ? "10px 12px" : "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: layoutMode === "mobile" ? "wrap" : "nowrap",
            gap: 8,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: layoutMode === "mobile" ? "wrap" : "nowrap",
              gap: 8,
              alignItems: "stretch",
              flex: "1 1 auto",
              minWidth: 0,
            }}
          >
          <StatusBlock
            title="FRSI"
            primary={model.frsi.score != null ? `FRSI ${model.frsi.score}` : "FRSI —"}
            secondary={model.frsi.fragilityLabel}
            tertiary={model.frsi.trendLabel}
            priority={model.frsi.priority}
            theme={theme}
            compact={topBarPriority.compactStatusBlocks}
            visualWeight={visualWeight}
          />
          <StatusBlock
            title="Scenario"
            primary={model.scenario.name}
            secondary={model.scenario.stateLabel}
            priority={model.scenario.priority}
            theme={theme}
            compact={topBarPriority.compactStatusBlocks}
            visualWeight={visualWeight}
          />
          <StatusBlock
            title="Decision"
            primary={model.decision.label}
            secondary="Executive decision state"
            priority={model.decision.priority}
            theme={theme}
            compact={topBarPriority.compactStatusBlocks}
            visualWeight={visualWeight}
          />
          {showReadiness ? (
            <StatusBlock
              title="Readiness"
              primary={model.readiness.label}
              secondary="System readiness"
              priority={model.readiness.priority}
              theme={theme}
              compact={topBarPriority.compactStatusBlocks}
              visualWeight={visualWeight}
            />
          ) : null}
          </div>
          <div
            style={{
              display: "inline-flex",
              flexDirection: layoutMode === "mobile" ? "column" : "row",
              alignItems: layoutMode === "mobile" ? "stretch" : "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            {!isTopBarItemOverflow("hud_settings", topBarPriority) ? <ExecutiveHudSettingsMenu /> : null}
            {!isTopBarItemOverflow("layout_preset", topBarPriority) ? <ExecutiveLayoutPresetControlResponsive /> : null}
            {!isTopBarItemOverflow("view_mode", topBarPriority) ? <ExecutiveViewModeControlResponsive /> : null}
            <ExecutiveCommandBarOverflowMenu
              overflowItems={topBarPriority.overflowItems}
              actionItems={overflowActions}
              onAction={handleAction}
            />
          </div>
        </div>

        {topBarPriority.showMiniInsight && model.miniInsight ? (
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: theme.textMuted,
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: "0 2px",
            }}
            title={model.miniInsight}
          >
            {model.miniInsight}
          </div>
        ) : null}

        {topBarPriority.showInlineActions ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
          }}
        >
          {visibleActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action.id)}
              title={action.label}
              aria-label={action.label}
              style={{
                width: 28,
                height: 28,
                padding: 0,
                borderRadius: 7,
                border: `1px solid ${theme.controlBorder}`,
                background: theme.buttonBackground,
                color: theme.buttonText,
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              {action.label.slice(0, 1)}
            </button>
          ))}
        </div>
        ) : null}
      </div>
    </div>
  );
}
