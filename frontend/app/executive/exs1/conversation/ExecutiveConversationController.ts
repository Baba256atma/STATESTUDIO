/**
 * Sprint 6 — Conversation Controller.
 * Grounds replies in Advisor Context + Engine. Never mutates Runtime.
 */

import type {
  AdvisorEngineResult,
  AdvisorProposal,
  ExecutiveAdvisorContext,
} from "../advisor/ExecutiveAdvisorTypes";
import type { ExecutiveAdvisorTab } from "../shell/executiveCockpitTypes";
import {
  advisorReferencesToConversation,
  type ConversationInsightBlock,
  type ConversationMessage,
  type ConversationReference,
  type ConversationRuntimeFacts,
} from "./ExecutiveConversationSession";

export type ConversationTurnResult = {
  readonly text: string;
  readonly references: readonly ConversationReference[];
  readonly proposals: readonly AdvisorProposal[];
  readonly insight: ConversationInsightBlock | null;
};

function perspectiveLead(
  perspective: ExecutiveAdvisorTab,
  question: string,
): string {
  if (perspective === "Insight") {
    return `Insight analysis for “${question.trim()}”.`;
  }
  return `Advisor guidance for “${question.trim()}”.`;
}

function buildAdvisorBody(
  context: ExecutiveAdvisorContext,
  engine: AdvisorEngineResult,
  question: string,
  facts: ConversationRuntimeFacts,
): string {
  const lines = [
    perspectiveLead("Assist", question),
    "",
    engine.assistBody,
    "",
    `Recommendation · ${engine.assistGuidance}`,
  ];

  if (facts.warningSignalCount + facts.criticalSignalCount > 0) {
    lines.push(
      "",
      `Intelligence · ${facts.warningSignalCount + facts.criticalSignalCount} active warning/critical signal(s) inform this guidance.`,
    );
  }
  if (facts.simulationCompleted && facts.simulationSummary) {
    lines.push("", `Simulation · ${facts.simulationSummary}`);
  }
  if (context.decisionName) {
    lines.push(
      "",
      `Decision · ${context.decisionName} (${context.decisionStatus ?? "n/a"}) remains subject to manager approval.`,
    );
  }
  lines.push(
    "",
    "I can prepare a proposal — nothing changes in Runtime until you approve.",
  );
  return lines.join("\n");
}

function buildInsightBody(
  context: ExecutiveAdvisorContext,
  engine: AdvisorEngineResult,
  question: string,
  facts: ConversationRuntimeFacts,
): string {
  const lines = [
    perspectiveLead("Insight", question),
    "",
    "Evidence-led view of the current Runtime:",
    "",
    ...engine.insightCards.map((card) => `• ${card}`),
  ];
  if (facts.alertTitles.length) {
    lines.push("", `Monitoring alerts · ${facts.alertTitles.join("; ")}`);
  }
  if (facts.simulationSummary) {
    lines.push("", `Simulation interpretation · ${facts.simulationSummary}`);
  }
  lines.push(
    "",
    `Pack · ${context.packTitle} · Timeline · ${context.timelineLens} @ ${context.timelinePosition}`,
    engine.insightGuidance,
  );
  return lines.join("\n");
}

function buildInsightBlock(
  context: ExecutiveAdvisorContext,
  engine: AdvisorEngineResult,
  facts: ConversationRuntimeFacts,
): ConversationInsightBlock {
  const kpiCards = [
    {
      id: "kpi-mode",
      label: "Mode",
      value: context.mode,
      tone: "neutral" as const,
    },
    {
      id: "kpi-health",
      label: "Monitoring",
      value: facts.monitoringHealth,
      tone:
        facts.monitoringHealth === "Critical"
          ? ("critical" as const)
          : facts.monitoringHealth === "Warning"
            ? ("warning" as const)
            : ("positive" as const),
    },
    {
      id: "kpi-signals",
      label: "Signals",
      value: String(facts.warningSignalCount + facts.criticalSignalCount),
      tone:
        facts.criticalSignalCount > 0
          ? ("critical" as const)
          : facts.warningSignalCount > 0
            ? ("warning" as const)
            : ("neutral" as const),
    },
    {
      id: "kpi-execution",
      label: "Execution",
      value: `${context.executionStatus} · ${context.executionProgress}%`,
      tone: context.blockedTaskNames.length ? ("warning" as const) : ("neutral" as const),
    },
  ];

  const comparisonRows = [
    {
      id: "cmp-pack",
      label: "Active pack",
      detail: context.packTitle,
    },
    {
      id: "cmp-scenario",
      label: "Scenario",
      detail: context.scenarioName ?? "None selected",
    },
    {
      id: "cmp-decision",
      label: "Decision",
      detail: context.decisionName
        ? `${context.decisionName} · ${context.decisionStatus ?? "n/a"}`
        : "None selected",
    },
    {
      id: "cmp-sim",
      label: "Simulation",
      detail: facts.simulationSummary ?? "Not run in this session",
    },
  ];

  const evidence = engine.insightCards.slice(0, 4).map((card, index) => ({
    id: `ev-${index}`,
    label: "Evidence",
    detail: card,
  }));

  return {
    kpiCards,
    comparisonRows,
    evidence,
    chartPlaceholder: "Executive charts — coming in a future release.",
  };
}

function enrichReferences(
  engine: AdvisorEngineResult,
  facts: ConversationRuntimeFacts,
  context: ExecutiveAdvisorContext,
): ConversationReference[] {
  const refs = advisorReferencesToConversation(engine.references);
  if (facts.warningSignalCount + facts.criticalSignalCount > 0) {
    refs.push({
      id: "cref-signals",
      kind: "signal",
      label: "Intelligence Signals",
      nav: "Intelligence",
    });
  }
  if (facts.simulationCompleted) {
    refs.push({
      id: "cref-simulation",
      kind: "simulation",
      label: "Simulation Results",
      nav: "Simulations",
    });
  }
  if (context.decisionId) {
    const hasDecision = refs.some((r) => r.kind === "decision");
    if (!hasDecision) {
      refs.push({
        id: `cref-decision-${context.decisionId}`,
        kind: "decision",
        label: context.decisionName ?? "Decision",
        decisionId: context.decisionId,
      });
    }
  }
  return refs;
}

/**
 * Produce a grounded conversation turn from existing Advisor Engine output.
 */
export function buildConversationTurn(
  question: string,
  perspective: ExecutiveAdvisorTab,
  context: ExecutiveAdvisorContext,
  engine: AdvisorEngineResult,
  facts: ConversationRuntimeFacts,
): ConversationTurnResult {
  const text =
    perspective === "Insight"
      ? buildInsightBody(context, engine, question, facts)
      : buildAdvisorBody(context, engine, question, facts);

  const proposals =
    perspective === "Assist"
      ? engine.proposals.filter((p) => p.status === "pending").slice(0, 3)
      : [];

  return {
    text,
    references: enrichReferences(engine, facts, context),
    proposals,
    insight:
      perspective === "Insight"
        ? buildInsightBlock(context, engine, facts)
        : null,
  };
}

export async function streamConversationText(
  fullText: string,
  onUpdate: (partial: string) => void,
  options: {
    readonly chunkMs: number;
    readonly signal: AbortSignal;
  },
): Promise<string> {
  const tokens = fullText.split(/(\s+)/).filter(Boolean);
  let acc = "";
  for (const token of tokens) {
    if (options.signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    acc += token;
    onUpdate(acc);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, options.chunkMs);
    });
  }
  return acc;
}

export function messageToClipboardText(message: ConversationMessage): string {
  return message.text;
}
