"use client";

import React, { useMemo } from "react";

import type { ExecutiveAssistantActionCard } from "../../../lib/ui/executiveAssistantPanelTypes";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { AssistantPanelIconDock } from "./AssistantPanelIconDock";
import {
  AssistantSupportPanelDock,
  resolveAssistantSupportPanelDockAvailablePanels,
} from "./AssistantSupportPanelDock";

export type AssistantSupportAccordionProps = Readonly<{
  children?: React.ReactNode;
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

export function AssistantSupportAccordion(
  props: AssistantSupportAccordionProps
): React.ReactElement {
  const availablePanels = useMemo(
    () =>
      resolveAssistantSupportPanelDockAvailablePanels({
        questionSuggestions: props.questionSuggestions,
        questionsLoading: props.questionsLoading,
        guidanceText: props.guidanceText,
        showScenarioHost: props.showScenarioHost,
        showComparisonHost: props.showComparisonHost,
        recommendedActions: props.recommendedActions,
      }),
    [
      props.questionSuggestions,
      props.questionsLoading,
      props.guidanceText,
      props.showScenarioHost,
      props.showComparisonHost,
      props.recommendedActions,
    ]
  );

  return (
    <div
      data-nx="assistant-support-accordion"
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
  );
}

export default AssistantSupportAccordion;
