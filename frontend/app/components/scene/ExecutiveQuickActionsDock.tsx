"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  nexoraHudShellStyle,
  type NexoraHudThemeMode,
  type NexoraHudThemeTokens,
} from "../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { resolveSceneThemeTokens } from "../../lib/theme/sceneThemeTokens";
import {
  executiveMotionTransition,
  resolveExecutiveControlButtonStyle,
  resolveExecutiveIconGlyph,
  resolveExecutiveVocabulary,
} from "../../lib/workspace/harmonization";
import {
  logExecutiveQuickActionAnalyzeRequested,
  logExecutiveQuickActionCompareRequested,
  logExecutiveQuickActionSimulateRequested,
  logExecutiveQuickActionSnapshotRequested,
  logExecutiveQuickActionsDockThemeResolved,
  logExecutiveQuickActionsMounted,
} from "../../lib/ui/executiveQuickActionsInstrumentation";
import type {
  ExecutiveQuickActionDefinition,
  ExecutiveQuickActionId,
  ExecutiveQuickActionsDockDensity,
  ExecutiveQuickActionsDockModel,
} from "../../lib/ui/executiveQuickActionsTypes";
import type { PanelSizeMode } from "../../lib/ui/workspaceLayoutTypes";

export type ExecutiveQuickActionsDockProps = {
  model: ExecutiveQuickActionsDockModel;
  themeMode?: NexoraHudThemeMode;
  panelSizeMode?: PanelSizeMode;
  onAction?: (actionId: ExecutiveQuickActionId) => void;
  onDensityChange?: (density: ExecutiveQuickActionsDockDensity) => void;
};

function logActionRequested(actionId: ExecutiveQuickActionId, context: ExecutiveQuickActionsDockModel["context"]): void {
  if (actionId === "analyze") {
    logExecutiveQuickActionAnalyzeRequested({
      hasObjectSelection: context.hasObjectSelection,
      label: context.analyzeLabel,
    });
    return;
  }
  if (actionId === "simulate") {
    logExecutiveQuickActionSimulateRequested();
    return;
  }
  if (actionId === "compare") {
    logExecutiveQuickActionCompareRequested();
    return;
  }
  logExecutiveQuickActionSnapshotRequested();
}

function QuickActionButton(props: {
  action: ExecutiveQuickActionDefinition;
  density: ExecutiveQuickActionsDockDensity;
  theme: NexoraHudThemeTokens;
  onClick: () => void;
}): React.ReactElement {
  const { action, density, theme, onClick } = props;
  const showLabel = density === "expanded";
  const tokens = resolveSceneThemeTokens(theme.mode);
  const iconId =
    action.id === "analyze"
      ? "control_analyze"
      : action.id === "simulate"
        ? "control_simulate"
        : action.id === "compare"
          ? "control_compare"
          : "control_snapshot";
  return (
    <button
      type="button"
      disabled={action.disabled}
      title={action.hint}
      aria-label={action.label}
      onClick={onClick}
      style={{
        ...resolveExecutiveControlButtonStyle(tokens, action.disabled ? "disabled" : "default"),
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: showLabel ? 6 : 0,
        minWidth: showLabel ? 88 : 36,
        height: 36,
        padding: showLabel ? "0 12px" : 0,
        borderRadius: 10,
        fontSize: showLabel ? 10 : 14,
        fontWeight: 800,
        lineHeight: 1,
        boxShadow: theme.mode === "night" ? theme.panelGlow : undefined,
        transition: executiveMotionTransition("hover"),
      }}
    >
      <span aria-hidden style={{ fontSize: 14, lineHeight: 1 }}>
        {resolveExecutiveIconGlyph(iconId, action.icon)}
      </span>
      {showLabel ? <span>{resolveExecutiveVocabulary(action.label)}</span> : null}
    </button>
  );
}

export function ExecutiveQuickActionsDock(props: ExecutiveQuickActionsDockProps): React.ReactElement {
  const { model, themeMode = "night", onAction, onDensityChange } = props;
  const mountedRef = useRef(false);
  const theme = useSceneHudTheme(themeMode);
  const [density, setDensity] = useState<ExecutiveQuickActionsDockDensity>(model.density);

  useEffect(() => {
    setDensity(model.density);
  }, [model.density]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logExecutiveQuickActionsMounted();
  }, []);

  useEffect(() => {
    logExecutiveQuickActionsDockThemeResolved(theme.mode);
  }, [theme.mode]);

  const handleToggleDensity = () => {
    const next: ExecutiveQuickActionsDockDensity = density === "expanded" ? "collapsed" : "expanded";
    setDensity(next);
    onDensityChange?.(next);
  };

  const handleAction = (action: ExecutiveQuickActionDefinition) => {
    if (action.disabled) return;
    logActionRequested(action.id, model.context);
    onAction?.(action.id);
  };

  return (
    <div
      data-hud="quick-actions"
      data-nx="executive-quick-actions-dock"
      data-nx-density={density}
      style={{
        ...nexoraHudShellStyle(theme, {
          borderRadius: 14,
          padding: density === "minimal" ? "4px 6px" : "6px 8px",
          pointerEvents: "auto",
          transition: executiveMotionTransition("panel"),
        }, { surface: "quickActionsDock", edgeAnchor: "BOTTOM_CENTER" }),
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        maxWidth: "96vw",
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {model.actions.map((action) => (
          <QuickActionButton
            key={action.id}
            action={action}
            density={density}
            theme={theme}
            onClick={() => handleAction(action)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleToggleDensity}
        title={density === "expanded" ? "Collapse quick actions" : "Expand quick actions"}
        aria-label={density === "expanded" ? "Collapse quick actions" : "Expand quick actions"}
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          border: `1px solid ${theme.controlBorder}`,
          background: theme.controlBackground,
          color: theme.textMuted,
          cursor: "pointer",
          fontSize: 10,
          fontWeight: 800,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {density === "expanded" ? "−" : "+"}
      </button>
    </div>
  );
}

export default ExecutiveQuickActionsDock;
