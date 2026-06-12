"use client";

import React from "react";

import type { ExecutiveAssistantActionCard } from "../../../lib/ui/executiveAssistantPanelTypes";
import type { ExecutiveWorkspaceId } from "../../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { AssistantFooterActions } from "./AssistantFooterActions";
import { AssistantSupportIconDock } from "./AssistantSupportIconDock";
import { AssistantSupportPanelDock } from "./AssistantSupportPanelDock";
import { useAssistantSupportAccordionOpenPanelId } from "../../../lib/assistant/useAssistantPanelDock";

export type AssistantSupportAccordionProps = Readonly<{
  children?: React.ReactNode;
  questionSuggestions?: readonly string[];
  questionsLoading?: boolean;
  insightText?: string | null;
  governanceText?: string | null;
  analyticsText?: string | null;
  showScenarioHost?: boolean;
  showAnalyticsHost?: boolean;
  recommendedActions?: readonly ExecutiveAssistantActionCard[];
  themeMode?: NexoraHudThemeMode;
  onQuestionSelect?: (question: string) => void;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  onActionSelect?: (action: ExecutiveAssistantActionCard) => void;
}>;

/** MRP:12:8 — Chat-first assistant shell with support dock + command dock footer. */
export function AssistantSupportAccordion(
  props: AssistantSupportAccordionProps
): React.ReactElement {
  const openPanelId = useAssistantSupportAccordionOpenPanelId();

  return (
    <div
      data-nx="assistant-support-accordion"
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {props.children}
          {openPanelId ? (
            <AssistantSupportPanelDock
              insightText={props.insightText}
              governanceText={props.governanceText}
              analyticsText={props.analyticsText}
              showScenarioHost={props.showScenarioHost}
              showAnalyticsHost={props.showAnalyticsHost}
              recommendedActions={props.recommendedActions}
              questionSuggestions={props.questionSuggestions}
              questionsLoading={props.questionsLoading}
              themeMode={props.themeMode}
              onActionSelect={props.onActionSelect}
              onQuestionSelect={props.onQuestionSelect}
            />
          ) : null}
        </div>
        <AssistantSupportIconDock themeMode={props.themeMode} />
      </div>
      <AssistantFooterActions
        themeMode={props.themeMode}
        onWorkspaceLaunch={props.onWorkspaceLaunch}
      />
    </div>
  );
}

export default AssistantSupportAccordion;
