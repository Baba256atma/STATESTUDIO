"use client";

import React from "react";

import {
  ASSISTANT_ACTION_CARD_LAUNCH_ACK_EVENT,
  buildRecommendedAssistantActionCards,
  launchAssistantActionCard,
  type AssistantActionCardContext,
  type AssistantActionCardLaunchAck,
  type AssistantActionCardModel,
} from "../../lib/assistant-bridge/assistantActionCardContract";
import { nx } from "../ui/nexoraTheme";
import { ExecutiveActionCard } from "./ExecutiveActionCard";

export type AssistantActionCardGroupProps = {
  context: AssistantActionCardContext;
  title?: string;
  cards?: readonly AssistantActionCardModel[];
};

function notificationTone(success: boolean): React.CSSProperties {
  return {
    padding: "8px 10px",
    borderRadius: 8,
    border: `1px solid ${success ? "rgba(74,222,128,0.28)" : "rgba(251,146,60,0.28)"}`,
    background: success ? "rgba(74,222,128,0.08)" : "rgba(251,146,60,0.08)",
    color: success ? "#bbf7d0" : "#fed7aa",
    fontSize: 11,
    fontWeight: 650,
    lineHeight: 1.4,
  };
}

export function AssistantActionCardGroup(props: AssistantActionCardGroupProps): React.ReactElement {
  const cards = props.cards ?? buildRecommendedAssistantActionCards(props.context);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [notificationSuccess, setNotificationSuccess] = React.useState(false);

  const showNotification = React.useCallback((message: string, success: boolean) => {
    setNotification(message);
    setNotificationSuccess(success);
  }, []);

  React.useEffect(() => {
    const onAck = (event: Event) => {
      const detail = (event as CustomEvent<AssistantActionCardLaunchAck>).detail;
      if (!detail) return;
      showNotification(
        detail.success ? "Workspace launch accepted by Dashboard." : detail.message,
        detail.success
      );
    };
    window.addEventListener(ASSISTANT_ACTION_CARD_LAUNCH_ACK_EVENT, onAck as EventListener);
    return () =>
      window.removeEventListener(ASSISTANT_ACTION_CARD_LAUNCH_ACK_EVENT, onAck as EventListener);
  }, [showNotification]);

  const handleLaunch = React.useCallback(
    (card: AssistantActionCardModel) => {
      const result = launchAssistantActionCard({
        card,
        context: props.context,
        requestId: `card:${card.id}:${Date.now()}`,
      });
      showNotification(result.message, result.success);
    },
    [props.context, showNotification]
  );

  return (
    <section
      data-nx="assistant-action-card-group"
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <div
        style={{
          color: nx.lowMuted,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {props.title ?? "Recommended Actions"}
      </div>

      {notification ? (
        <div style={notificationTone(notificationSuccess)} role="status">
          {notification}
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards.map((card) => (
          <ExecutiveActionCard key={card.id} card={card} onLaunch={handleLaunch} />
        ))}
      </div>
    </section>
  );
}

export default AssistantActionCardGroup;
