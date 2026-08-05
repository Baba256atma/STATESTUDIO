"use client";

import { useCallback, useState } from "react";
import { useExecutiveConversation } from "../conversation";
import { useExecutiveAdvisor } from "../advisor/hooks/useExecutiveAdvisor";
import { ExecutiveAdvisorHeader } from "../advisor/ExecutiveAdvisorHeader";
import type {
  AdvisorConversationMode,
  AdvisorProposal,
  AdvisorReference,
  AdvisorSessionMessage,
  AdvisorSuggestion,
} from "../advisor/ExecutiveAdvisorTypes";
import type { ExecutiveAdvisorTab } from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";
import { ExecutiveConversationView } from "../conversation/ExecutiveConversationView";
import { ExecutiveResizablePanel } from "./ExecutiveResizablePanel";

export type ExecutiveAdvisorContent = {
  readonly title: string;
  readonly body: string;
  readonly guidance: string;
  readonly suggestionCards?: readonly string[];
  readonly quickActions?: readonly string[];
  readonly accent?: string;
  readonly packPerspective?: string;
  readonly suggestions?: readonly AdvisorSuggestion[];
  readonly proposals?: readonly AdvisorProposal[];
  readonly references?: readonly AdvisorReference[];
  readonly conversationMode?: AdvisorConversationMode;
  readonly conversation?: readonly AdvisorSessionMessage[];
};

type Props = {
  readonly tab: ExecutiveAdvisorTab;
  readonly onTabChange: (tab: ExecutiveAdvisorTab) => void;
  readonly assist: ExecutiveAdvisorContent;
  readonly insight: ExecutiveAdvisorContent;
  readonly onApproveProposal?: (proposalId: string) => void;
  readonly onDismissProposal?: (proposalId: string) => void;
  readonly onSelectReference?: (reference: AdvisorReference) => void;
};

/**
 * Sprint 6.6 — Simplified Executive Co-Pilot panel.
 * Conversation-first; Context / More / Help are footer popovers.
 */
export function ExecutiveAdvisorPanel({
  tab,
  onTabChange,
  assist,
  insight,
  onApproveProposal,
  onDismissProposal,
}: Props) {
  const message = tab === "Assist" ? assist : insight;
  const accent = message.accent ?? cockpit.accent;
  const conversation = useExecutiveConversation();
  const advisor = useExecutiveAdvisor();

  const [width, setWidth] = useState(360);
  const [collapsed, setCollapsed] = useState(false);

  const onToggleCollapse = useCallback(() => {
    setCollapsed((v) => !v);
  }, []);

  return (
    <ExecutiveResizablePanel
      width={width}
      minWidth={cockpit.advisorMin}
      maxWidth={cockpit.advisorMax}
      collapsed={collapsed}
      collapsedWidth={cockpit.advisorCollapsedWidth}
      onWidthChange={setWidth}
      testId="executive-advisor-panel"
      style={{
        background: `linear-gradient(180deg, ${cockpit.panel} 0%, ${cockpit.navy} 100%)`,
        borderLeft: `1px solid ${cockpit.border}`,
        transition: collapsed
          ? `width 180ms ${cockpit.motion.easing}`
          : `width 220ms ${cockpit.motion.easing}`,
      }}
    >
      <aside
        data-exs1-compat="exs1-advisor"
        aria-label="Executive Advisor"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <ExecutiveAdvisorHeader
          tab={tab}
          onTabChange={onTabChange}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          accent={accent}
        />

        <div
          role="tabpanel"
          data-testid={`executive-advisor-${tab.toLowerCase()}`}
          aria-hidden={collapsed}
          style={{
            display: collapsed ? "none" : "flex",
            flex: 1,
            flexDirection: "column",
            padding: "0.35rem 1rem 0.85rem",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          <h2
            data-testid="executive-advisor-title"
            data-exs1-compat="exs1-advisor-title"
            style={srOnly}
          >
            {message.title}
          </h2>
          <p
            data-testid="executive-advisor-body"
            data-exs1-compat="exs1-advisor-body"
            style={srOnly}
          >
            {message.body}
          </p>

          <ExecutiveConversationView
            perspective={tab}
            accent={accent}
            welcomeCopy={conversation.welcomeCopy}
            messages={conversation.visibleMessages}
            suggestions={conversation.suggestions}
            pendingProposals={conversation.pendingProposals}
            streamState={conversation.session.streamState}
            panelWidth={width}
            advisorContext={advisor.context}
            facts={conversation.facts}
            guidance={message.guidance}
            onSend={(text) => conversation.send(text, tab)}
            onStop={conversation.stop}
            onSuggestion={(text) => conversation.send(text, tab)}
            onSelectReference={conversation.focusReference}
            onApproveProposal={
              onApproveProposal ?? conversation.approveProposal
            }
            onDismissProposal={
              onDismissProposal ?? conversation.dismissProposal
            }
            onRetry={(prompt) => conversation.send(prompt, tab)}
            onCopy={conversation.copyText}
            onDismissError={conversation.dismissError}
          />
        </div>
      </aside>
    </ExecutiveResizablePanel>
  );
}

const srOnly = {
  position: "absolute" as const,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden" as const,
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap" as const,
  border: 0,
};
