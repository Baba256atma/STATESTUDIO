"use client";

import React, { useEffect } from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../lib/ui/executiveWorkspaceLayout";
import { useAssistantRailLayoutObserver } from "../../lib/assistant/useAssistantRailLayoutObserver";
import {
  publishAssistantStabilityGateResult,
  traceAssistantStabilityGate,
} from "../../lib/assistant/assistantStabilityGateRuntime";
import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { ExecutiveAssistantActionCard } from "../../lib/ui/executiveAssistantPanelTypes";
import { traceAssistantRuntimeFreezeValidation } from "../../lib/assistant/assistantRuntimeFreezeContract";
import {
  auditAssistantAuthority,
  traceAssistantAuthorityAssistantChatActive,
  traceAssistantAuthorityFooterChatRemoved,
  traceAssistantAuthoritySingleAuthority,
} from "../../lib/ui/assistantAuthorityDiagnostics";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { AssistantSupportAccordion } from "./assistant/AssistantSupportAccordion";

export type MrpChatFirstAssistantSurfaceProps = Readonly<{
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

/**
 * MRP:12:7 — Chat-first assistant tab with executive support dock + command dock footer.
 */
export function MrpChatFirstAssistantSurface(props: MrpChatFirstAssistantSurfaceProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  useAssistantRailLayoutObserver(true);

  useEffect(() => {
    traceAssistantRuntimeFreezeValidation();
    const gate = traceAssistantStabilityGate();
    publishAssistantStabilityGateResult(gate);
    traceAssistantAuthorityFooterChatRemoved();
    traceAssistantAuthorityAssistantChatActive();
    traceAssistantAuthoritySingleAuthority();
    auditAssistantAuthority({
      footerChatMounted: Boolean(document.getElementById("nexora-bottom-command-dock")),
      assistantChatMounted: Boolean(document.getElementById("nexora-executive-assistant-host")),
    });
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
        insightText={props.insightText}
        governanceText={props.governanceText}
        analyticsText={props.analyticsText}
        showScenarioHost={props.showScenarioHost}
        showAnalyticsHost={props.showAnalyticsHost}
        recommendedActions={props.recommendedActions}
        themeMode={props.themeMode}
        onQuestionSelect={props.onQuestionSelect}
        onWorkspaceLaunch={props.onWorkspaceLaunch}
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
