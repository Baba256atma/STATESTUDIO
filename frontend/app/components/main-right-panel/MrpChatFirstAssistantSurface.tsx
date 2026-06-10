"use client";

import React, { useMemo } from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../lib/ui/executiveWorkspaceLayout";
import { useAssistantRailLayoutObserver } from "../../lib/assistant/useAssistantRailLayoutObserver";
import type { ExecutiveAssistantActionCard } from "../../lib/ui/executiveAssistantPanelTypes";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import {
  AssistantSupportPanelDock,
  resolveAssistantSupportPanelDockAvailablePanels,
} from "./assistant/AssistantSupportPanelDock";
import { AssistantPanelIconDock } from "./assistant/AssistantPanelIconDock";

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

  const availablePanels = useMemo(
    () =>
      resolveAssistantSupportPanelDockAvailablePanels({
        questionSuggestions: props.questionSuggestions,
        guidanceText: props.guidanceText,
        showScenarioHost: props.showScenarioHost,
        showComparisonHost: props.showComparisonHost,
        recommendedActions: props.recommendedActions,
      }),
    [
      props.questionSuggestions,
      props.guidanceText,
      props.showScenarioHost,
      props.showComparisonHost,
      props.recommendedActions,
    ]
  );

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
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
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

          <AssistantSupportPanelDock
            questionSuggestions={props.questionSuggestions}
            questionsLoading={props.questionsLoading}
            guidanceText={props.guidanceText}
            showScenarioHost={props.showScenarioHost}
            showComparisonHost={props.showComparisonHost}
            recommendedActions={props.recommendedActions}
            themeMode={props.themeMode}
            onQuestionSelect={props.onQuestionSelect}
            onActionSelect={props.onActionSelect}
          />
        </div>

        <AssistantPanelIconDock availablePanels={availablePanels} themeMode={props.themeMode} />
      </div>
    </div>
  );
}

export default MrpChatFirstAssistantSurface;
