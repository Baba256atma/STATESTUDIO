"use client";

import { useMemo } from "react";
import type {
  AdvisorProposal,
  AdvisorProposalKind,
} from "../ExecutiveAdvisorTypes";

export type ExecutiveActionType =
  | "Decision"
  | "Simulation"
  | "Execution"
  | "Monitoring"
  | "Connector"
  | "Metadata Review";

export type ExecutiveActionPriority = "Critical" | "High" | "Normal";

export type ExecutiveActionStatus =
  | "Pending"
  | "Waiting"
  | "Requires Review";

export type ExecutiveActionItem = {
  readonly id: string;
  readonly proposalId: string;
  readonly type: ExecutiveActionType;
  readonly title: string;
  readonly description: string;
  readonly source: string;
  readonly status: ExecutiveActionStatus;
  readonly priority: ExecutiveActionPriority;
  readonly icon: string;
  readonly tone: string;
};

const TYPE_META: Record<
  ExecutiveActionType,
  { readonly icon: string; readonly tone: string }
> = {
  Decision: { icon: "🟢", tone: "#12B76A" },
  Simulation: { icon: "🟣", tone: "#A78BFA" },
  Execution: { icon: "🟠", tone: "#FDB022" },
  Monitoring: { icon: "🔵", tone: "#38bdf8" },
  Connector: { icon: "🟡", tone: "#FBBF24" },
  "Metadata Review": { icon: "⚪", tone: "#94A3B8" },
};

function mapKind(kind: AdvisorProposalKind): ExecutiveActionType {
  switch (kind) {
    case "Approve Decision":
      return "Decision";
    case "Create Scenario":
      return "Simulation";
    case "Start Execution":
      return "Execution";
    case "Take Snapshot":
    case "Focus Timeline":
      return "Monitoring";
    case "Open Data Mapping":
      return "Connector";
    default:
      return "Metadata Review";
  }
}

function mapPriority(
  kind: AdvisorProposalKind,
  type: ExecutiveActionType,
): ExecutiveActionPriority {
  if (kind === "Approve Decision" || kind === "Start Execution") {
    return "Critical";
  }
  if (type === "Simulation" || type === "Monitoring") {
    return "High";
  }
  return "Normal";
}

function sourceFor(proposal: AdvisorProposal): string {
  if (proposal.decisionId) return "Decision Candidate";
  if (proposal.scenarioId) return "Scenario";
  if (proposal.objectId) return `Object · ${proposal.objectId}`;
  if (proposal.packId) return `Pack · ${proposal.packId}`;
  if (proposal.nav) return `Explorer · ${proposal.nav}`;
  if (proposal.lens) return `Timeline · ${proposal.lens}`;
  return proposal.kind;
}

function toActionItem(proposal: AdvisorProposal): ExecutiveActionItem {
  const type = mapKind(proposal.kind);
  const meta = TYPE_META[type];
  return {
    id: `action-${proposal.id}`,
    proposalId: proposal.id,
    type,
    title: proposal.title,
    description: proposal.body,
    source: sourceFor(proposal),
    status: "Requires Review",
    priority: mapPriority(proposal.kind, type),
    icon: meta.icon,
    tone: meta.tone,
  };
}

const PRIORITY_RANK: Record<ExecutiveActionPriority, number> = {
  Critical: 0,
  High: 1,
  Normal: 2,
};

/** Pure mapping — Runtime proposals → Action Inbox items (Critical → High → order). */
export function buildExecutiveActionItems(
  proposals: readonly AdvisorProposal[],
): readonly ExecutiveActionItem[] {
  const pending = proposals.filter((p) => p.status === "pending");
  return pending
    .map(toActionItem)
    .sort((a, b) => {
      const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (byPriority !== 0) return byPriority;
      return (
        pending.findIndex((p) => p.id === a.proposalId) -
        pending.findIndex((p) => p.id === b.proposalId)
      );
    });
}

/**
 * Maps Runtime-backed Advisor proposals into Executive Action Inbox items.
 * No local proposal storage — reads pending proposals only.
 */
export function useExecutiveActionInbox(
  proposals: readonly AdvisorProposal[],
) {
  return useMemo(() => {
    const items = buildExecutiveActionItems(proposals);
    return {
      items,
      pendingCount: items.length,
      isEmpty: items.length === 0,
    };
  }, [proposals]);
}

export function findProposalForAction(
  proposals: readonly AdvisorProposal[],
  proposalId: string,
): AdvisorProposal | null {
  return proposals.find((p) => p.id === proposalId) ?? null;
}
