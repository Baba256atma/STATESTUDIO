"use client";

import { ExecutiveAdvisorConversation } from "../advisor/ExecutiveAdvisorConversation";
import { ExecutiveAdvisorProposalCard } from "../advisor/ExecutiveAdvisorProposalCard";
import { ExecutiveAdvisorReference } from "../advisor/ExecutiveAdvisorReference";
import { ExecutiveAdvisorSuggestionCard } from "../advisor/ExecutiveAdvisorSuggestionCard";
import type {
  AdvisorConversationMode,
  AdvisorProposal,
  AdvisorReference,
  AdvisorSessionMessage,
  AdvisorSuggestion,
} from "../advisor/ExecutiveAdvisorTypes";
import type { ExecutiveAdvisorTab } from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";

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

const TABS: readonly ExecutiveAdvisorTab[] = ["Assist", "Insight"];

/**
 * Executive Advisor Panel — Assist / Insight.
 * Mode changes header, suggestion cards, and quick actions.
 * Conversation body persists.
 */
export function ExecutiveAdvisorPanel({
  tab,
  onTabChange,
  assist,
  insight,
  onApproveProposal,
  onDismissProposal,
  onSelectReference,
}: Props) {
  const message = tab === "Assist" ? assist : insight;
  const accent = message.accent ?? cockpit.accent;

  return (
    <aside
      data-testid="executive-advisor-panel"
      data-exs1-compat="exs1-advisor"
      aria-label="Executive Advisor"
      style={{
        width: `min(${cockpit.advisorWidth}, 34vw)`,
        minWidth: "14rem",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(180deg, ${cockpit.panel} 0%, ${cockpit.navy} 100%)`,
        borderLeft: `1px solid ${cockpit.border}`,
        boxShadow: "inset 1px 0 0 rgba(255,255,255,0.02)",
        minHeight: 0,
      }}
    >
      <div
        style={{
          padding: "0.85rem 1.05rem 0.65rem",
          borderBottom: `1px solid ${cockpit.border}`,
          background: "rgba(255,255,255,0.012)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
            fontWeight: cockpit.type.status.weight,
          }}
        >
          Executive Advisor
        </p>
        <div
          role="tablist"
          aria-label="Advisor tabs"
          style={{
            display: "flex",
            gap: "0.35rem",
            marginTop: "0.55rem",
          }}
        >
          {TABS.map((item) => {
            const active = item === tab;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                data-testid={`executive-advisor-tab-${item.toLowerCase()}`}
                onClick={() => onTabChange(item)}
                style={{
                  flex: 1,
                  padding: "0.4rem 0.5rem",
                  borderRadius: cockpit.radius.sm,
                  border: active
                    ? `1px solid ${accent}`
                    : `1px solid ${cockpit.border}`,
                  background: active ? `${accent}22` : "transparent",
                  color: active ? accent : cockpit.muted,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: active ? 600 : 450,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: cockpit.transition,
                  boxShadow: active ? `0 0 14px ${accent}22` : "none",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        data-testid={`executive-advisor-${tab.toLowerCase()}`}
        style={{
          flex: 1,
          padding: "1.05rem 1.15rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.9rem",
          overflow: "auto",
        }}
      >
        <h2
          data-testid="executive-advisor-title"
          data-exs1-compat="exs1-advisor-title"
          style={{
            margin: 0,
            fontSize: cockpit.type.executiveTitle.size,
            fontWeight: cockpit.type.executiveTitle.weight,
            letterSpacing: cockpit.type.executiveTitle.tracking,
            color: accent,
            transition: `color ${cockpit.motion.calm} ${cockpit.motion.easing}`,
          }}
        >
          {message.title}
        </h2>

        {message.conversationMode ? (
          <p
            data-testid="executive-advisor-conversation-mode"
            style={{
              margin: 0,
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            Mode · {message.conversationMode}
          </p>
        ) : null}

        {message.packPerspective ? (
          <p
            data-testid="executive-advisor-pack-perspective"
            style={{
              margin: 0,
              fontSize: "0.72rem",
              letterSpacing: "0.04em",
              color: cockpit.muted,
            }}
          >
            {message.packPerspective}
          </p>
        ) : null}

        <p
          data-testid="executive-advisor-body"
          data-exs1-compat="exs1-advisor-body"
          style={{
            margin: 0,
            fontSize: "0.88rem",
            lineHeight: 1.55,
            color: cockpit.textSoft,
            whiteSpace: "pre-wrap",
          }}
        >
          {message.body}
        </p>

        {message.references?.length ? (
          <div
            data-testid="executive-advisor-references"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}
          >
            {message.references.map((reference) => (
              <ExecutiveAdvisorReference
                key={reference.id}
                reference={reference}
                onSelect={(ref) => onSelectReference?.(ref)}
              />
            ))}
          </div>
        ) : null}

        {message.suggestions?.length ? (
          <div
            data-testid="executive-advisor-suggestion-cards"
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            {message.suggestions.map((suggestion) => (
              <ExecutiveAdvisorSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
              />
            ))}
          </div>
        ) : message.suggestionCards?.length ? (
          <div
            data-testid="executive-advisor-suggestion-cards"
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            {message.suggestionCards.map((card) => (
              <div
                key={card}
                data-testid="executive-advisor-suggestion-card"
                style={{
                  padding: "0.6rem 0.7rem",
                  borderRadius: cockpit.radius.md,
                  border: `1px solid ${accent}40`,
                  background: `${accent}10`,
                  color: cockpit.text,
                  fontSize: "0.78rem",
                  lineHeight: 1.45,
                  boxShadow: cockpit.elevation.raised,
                  transition: cockpit.transition,
                }}
              >
                {card}
              </div>
            ))}
          </div>
        ) : null}

        {tab === "Assist" && message.proposals?.length ? (
          <div
            data-testid="executive-advisor-proposals"
            style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}
          >
            {message.proposals.map((proposal) => (
              <ExecutiveAdvisorProposalCard
                key={proposal.id}
                proposal={proposal}
                onApprove={(id) => onApproveProposal?.(id)}
                onDismiss={(id) => onDismissProposal?.(id)}
              />
            ))}
          </div>
        ) : null}

        {tab === "Assist" &&
        !message.proposals?.length &&
        message.quickActions?.length ? (
          <div
            data-testid="executive-advisor-quick-actions"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}
          >
            {message.quickActions.map((action) => (
              <button
                key={action}
                type="button"
                data-testid="executive-advisor-quick-action"
                style={{
                  padding: "0.35rem 0.55rem",
                  borderRadius: "999px",
                  border: `1px solid ${accent}66`,
                  background: "transparent",
                  color: accent,
                  fontSize: "0.66rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: cockpit.transition,
                }}
              >
                {action}
              </button>
            ))}
          </div>
        ) : null}

        {tab === "Assist" && message.conversation?.length ? (
          <ExecutiveAdvisorConversation messages={message.conversation} />
        ) : null}

        <div
          data-testid="executive-advisor-guidance"
          data-exs1-compat="exs1-advisor-guidance"
          style={{
            marginTop: "auto",
            padding: "0.85rem 0.95rem",
            borderRadius: "0.5rem",
            border: `1px solid ${accent}66`,
            background: `${accent}18`,
            transition: "border-color 250ms ease, background 250ms ease",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {tab === "Assist" ? "Guidance" : "Insight"}
          </p>
          <p
            style={{
              margin: "0.4rem 0 0",
              fontSize: "0.82rem",
              lineHeight: 1.5,
              color: cockpit.text,
            }}
          >
            {message.guidance}
          </p>
        </div>
      </div>
    </aside>
  );
}
