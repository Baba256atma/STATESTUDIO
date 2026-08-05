"use client";

import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly copy: string;
};

export function ExecutiveConversationWelcome({ copy }: Props) {
  return (
    <div
      data-testid="executive-conversation-welcome"
      style={{
        padding: "0.55rem 0.15rem 0.25rem",
        color: cockpit.textSoft,
        fontSize: "0.84rem",
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
      }}
    >
      {copy}
    </div>
  );
}
