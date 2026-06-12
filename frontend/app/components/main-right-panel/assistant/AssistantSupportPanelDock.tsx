"use client";

import React from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../../lib/ui/executiveWorkspaceLayout";
import type { ExecutiveAssistantActionCard } from "../../../lib/ui/executiveAssistantPanelTypes";
import { resolveAssistantSupportContentStyle } from "../../../lib/assistant/assistantReadingComfortTokens";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { AssistantDockedSupportPanel } from "./AssistantDockedSupportPanel";
import { AssistantExecutiveQuestionsPanel } from "./AssistantExecutiveQuestionsPanel";

export type AssistantSupportPanelDockProps = Readonly<{
  insightText?: string | null;
  governanceText?: string | null;
  analyticsText?: string | null;
  showScenarioHost?: boolean;
  showAnalyticsHost?: boolean;
  recommendedActions?: readonly ExecutiveAssistantActionCard[];
  questionSuggestions?: readonly string[];
  questionsLoading?: boolean;
  themeMode?: NexoraHudThemeMode;
  onActionSelect?: (action: ExecutiveAssistantActionCard) => void;
  onQuestionSelect?: (question: string) => void;
}>;

function SupportEmptyState(props: { text: string; theme: ReturnType<typeof useSceneHudTheme> }): React.ReactElement {
  return (
    <div style={{ ...resolveAssistantSupportContentStyle(props.theme), color: props.theme.textMuted }}>
      {props.text}
    </div>
  );
}

export function AssistantSupportPanelDock(props: AssistantSupportPanelDockProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);

  return (
    <div
      data-nx="assistant-support-panel-dock"
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        maxHeight: "38%",
        overflow: "hidden",
      }}
    >
      <AssistantDockedSupportPanel panelId="insight" themeMode={props.themeMode}>
        {props.insightText?.trim() ? (
          <div data-nx="assistant-support-insight" style={resolveAssistantSupportContentStyle(theme)}>
            {props.insightText}
          </div>
        ) : (
          <SupportEmptyState theme={theme} text="No executive observations yet." />
        )}
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel panelId="scenario" themeMode={props.themeMode}>
        {props.showScenarioHost ? (
          <div
            id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveScenarioHost}
            data-nx="executive-scenario-host"
            style={{ minHeight: 0, display: "flex", flexDirection: "column" }}
          />
        ) : (
          <SupportEmptyState theme={theme} text="Scenario suggestions will appear here when available." />
        )}
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel panelId="analytics" themeMode={props.themeMode}>
        {props.showAnalyticsHost ? (
          <div
            id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveComparisonHost}
            data-nx="executive-comparison-host"
            style={{ minHeight: 0, display: "flex", flexDirection: "column" }}
          />
        ) : props.analyticsText?.trim() ? (
          <div data-nx="assistant-support-analytics" style={resolveAssistantSupportContentStyle(theme)}>
            {props.analyticsText}
          </div>
        ) : (
          <SupportEmptyState theme={theme} text="Analytics signals will appear here when available." />
        )}
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel panelId="governance" themeMode={props.themeMode}>
        {props.governanceText?.trim() ? (
          <div data-nx="assistant-support-governance" style={resolveAssistantSupportContentStyle(theme)}>
            {props.governanceText}
          </div>
        ) : (
          <SupportEmptyState theme={theme} text="Governance guidance will appear here when available." />
        )}
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel panelId="actions" themeMode={props.themeMode}>
        <div
          data-nx="assistant-support-actions"
          style={{
            ...resolveAssistantSupportContentStyle(theme),
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {props.recommendedActions?.length ? (
            props.recommendedActions.map((action) => (
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
            ))
          ) : (
            <SupportEmptyState theme={theme} text="Recommended actions will appear here when available." />
          )}
        </div>
      </AssistantDockedSupportPanel>

      <AssistantDockedSupportPanel panelId="questions" themeMode={props.themeMode}>
        <AssistantExecutiveQuestionsPanel
          questions={props.questionSuggestions ?? []}
          loading={props.questionsLoading}
          themeMode={props.themeMode}
          onQuestionSelect={props.onQuestionSelect}
        />
      </AssistantDockedSupportPanel>
    </div>
  );
}

export default AssistantSupportPanelDock;
