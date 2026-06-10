"use client";

import React, { useEffect } from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../lib/ui/executiveWorkspaceLayout";
import { useAssistantRailLayoutObserver } from "../../lib/assistant/useAssistantRailLayoutObserver";
import { traceAssistantRuntimeFreezeValidation } from "../../lib/assistant/assistantRuntimeFreezeContract";
import type { ExecutiveAssistantActionCard } from "../../lib/ui/executiveAssistantPanelTypes";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { AssistantSupportAccordion } from "./assistant/AssistantSupportAccordion";

export type MrpChatFirstAssistantSurfaceProps = Readonly<{
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

/**
 * MRP:11:2:2 — Chat-first assistant tab with per-panel dock collapse + icon restore.
 */
export function MrpChatFirstAssistantSurface(props: MrpChatFirstAssistantSurfaceProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  useAssistantRailLayoutObserver(true);

  useEffect(() => {
    traceAssistantRuntimeFreezeValidation();
  }, []);

  return (
    <div
      data-nx="mrp-chat-first-assistant-surface"
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: theme.shellBackground,
      }}
    >
      <AssistantSupportAccordion
        questionSuggestions={props.questionSuggestions}
        questionsLoading={props.questionsLoading}
        guidanceText={props.guidanceText}
        showScenarioHost={props.showScenarioHost}
        showComparisonHost={props.showComparisonHost}
        recommendedActions={props.recommendedActions}
        themeMode={props.themeMode}
        onQuestionSelect={props.onQuestionSelect}
        onActionSelect={props.onActionSelect}
      >
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantHost}
          data-nx="executive-assistant-host"
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        />
      </AssistantSupportAccordion>
    </div>
  );
}

export default MrpChatFirstAssistantSurface;
