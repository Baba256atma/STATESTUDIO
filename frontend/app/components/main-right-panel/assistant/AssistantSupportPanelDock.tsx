"use client";

import React from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../../lib/ui/executiveWorkspaceLayout";
import type { ExecutiveAssistantActionCard } from "../../../lib/ui/executiveAssistantPanelTypes";
import type { AssistantPanelDockId } from "../../../lib/assistant/assistantPanelDockContract";
import { resolveAssistantSupportContentStyle } from "../../../lib/assistant/assistantReadingComfortTokens";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { AssistantDockedSupportPanel } from "./AssistantDockedSupportPanel";
import { AssistantSuggestedQuestionsStrip } from "./AssistantSuggestedQuestionsStrip";

export type AssistantSupportPanelDockProps = Readonly<{
  questionSuggestions?: readonly string[];
  questionsLoading?: boolean;
  guidanceText?: string | null;
  showScenarioHost?: boolean;
  showComparisonHost?: boolean;
  recommendedActions?: readonly ExecutiveAssistantActionCard[];
  themeMode?: NexoraHudThemeMode;
  onQuestionSelect?: (question: string) => void;
  onActionSelect?: (action: ExecutiveAssistantActionCard) => void;
}>;

export function AssistantSupportPanelDock(
  props: AssistantSupportPanelDockProps
): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);

  const hasSuggestions = Boolean(props.questionSuggestions?.length);
  const hasGuidance = Boolean(props.guidanceText?.trim());
  const hasActions = Boolean(props.recommendedActions?.length);

  const handleQuestionSelect = (question: string) => {
    props.onQuestionSelect?.(question);
  };

  return (
    <div
      data-nx="assistant-support-panel-dock"
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        maxHeight: "42%",
        overflow: "hidden",
      }}
    >
      <AssistantDockedSupportPanel
        panelId="suggestions"
        available={hasSuggestions}
        themeMode={props.themeMode}
      >
        <AssistantSuggestedQuestionsStrip
          questions={props.questionSuggestions ?? []}
          loading={props.questionsLoading}
          themeMode={props.themeMode}
          onQuestionSelect={handleQuestionSelect}
        />
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel
        panelId="guidance"
        available={hasGuidance}
        themeMode={props.themeMode}
      >
        <div data-nx="assistant-support-guidance" style={resolveAssistantSupportContentStyle(theme)}>
          {props.guidanceText}
        </div>
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel
        panelId="scenario"
        available={props.showScenarioHost}
        themeMode={props.themeMode}
      >
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveScenarioHost}
          data-nx="executive-scenario-host"
          style={{
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        />
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel
        panelId="decision"
        available={props.showComparisonHost}
        themeMode={props.themeMode}
      >
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveComparisonHost}
          data-nx="executive-comparison-host"
          style={{
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        />
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel
        panelId="actions"
        available={hasActions}
        themeMode={props.themeMode}
      >
        <div
          data-nx="assistant-support-actions"
          style={{
            ...resolveAssistantSupportContentStyle(theme),
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {props.recommendedActions?.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={action.disabled}
              onClick={() => props.onActionSelect?.(action)}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 10,
                border: `1px solid ${theme.controlBorder}`,
                background: theme.controlBackground,
                color: theme.text,
                cursor: action.disabled ? "not-allowed" : "pointer",
                opacity: action.disabled ? 0.6 : 1,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700 }}>{action.label}</div>
              {action.hint ? (
                <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{action.hint}</div>
              ) : null}
            </button>
          ))}
        </div>
      </AssistantDockedSupportPanel>
    </div>
  );
}

export function resolveAssistantSupportPanelDockAvailablePanels(
  props: Pick<
    AssistantSupportPanelDockProps,
    | "questionSuggestions"
    | "guidanceText"
    | "showScenarioHost"
    | "showComparisonHost"
    | "recommendedActions"
  >
): AssistantPanelDockId[] {
  const panels: AssistantPanelDockId[] = [];
  if (props.questionSuggestions?.length) panels.push("suggestions");
  if (props.guidanceText?.trim()) panels.push("guidance");
  if (props.showScenarioHost) panels.push("scenario");
  if (props.showComparisonHost) panels.push("decision");
  if (props.recommendedActions?.length) panels.push("actions");
  return panels;
}

export default AssistantSupportPanelDock;
