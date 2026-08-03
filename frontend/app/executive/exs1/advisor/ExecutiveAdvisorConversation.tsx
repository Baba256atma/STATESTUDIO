"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { AdvisorSessionMessage } from "./ExecutiveAdvisorTypes";

type Props = {
  readonly messages: readonly AdvisorSessionMessage[];
};

export function ExecutiveAdvisorConversation({ messages }: Props) {
  const recent = messages.slice(-6);
  return (
    <div
      data-testid="executive-advisor-conversation"
      style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
    >
      {recent.map((message) => (
        <div
          key={message.id}
          data-testid={`advisor-message-${message.role}`}
          style={{
            padding: "0.5rem 0.6rem",
            borderRadius: cockpit.radius.sm,
            border: `1px solid ${cockpit.border}`,
            background:
              message.role === "advisor"
                ? "rgba(56,189,248,0.08)"
                : "rgba(255,255,255,0.03)",
            color: cockpit.textSoft,
            fontSize: "0.74rem",
            lineHeight: 1.45,
          }}
        >
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
              marginBottom: "0.15rem",
            }}
          >
            {message.role === "advisor" ? "Advisor" : "Manager"}
          </div>
          {message.text}
        </div>
      ))}
    </div>
  );
}
