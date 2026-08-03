"use client";

import { useContext, useMemo } from "react";
import type { ExecutiveAdvisorContent } from "../../shell/ExecutiveAdvisorPanel";
import { ExecutiveConnectorContext } from "../../connectors/ExecutiveConnectorProvider";
import { ExecutiveRuntimeIntelligenceContext } from "../../intelligence/ExecutiveRuntimeIntelligenceProvider";
import { ExecutiveSimulationContext } from "../../simulation/ExecutiveSimulationProvider";
import { ExecutiveAdvisorReactContext } from "../ExecutiveAdvisorProvider";

/**
 * Runtime-aware Executive Advisor hook.
 * Consumes Recommendation Context, Connector facts, and Simulation facts.
 * Advisor explains — it does not approve publishing or simulation decisions.
 */
export function useExecutiveAdvisor() {
  const value = useContext(ExecutiveAdvisorReactContext);
  if (!value) {
    throw new Error(
      "useExecutiveAdvisor must be used within ExecutiveAdvisorProvider",
    );
  }

  const intelligence = useContext(ExecutiveRuntimeIntelligenceContext);
  const recommendation = intelligence?.recommendation ?? null;
  const connectors = useContext(ExecutiveConnectorContext);
  const connectorFacts = connectors?.advisorFacts ?? [];
  const simulation = useContext(ExecutiveSimulationContext);
  const simulationFacts = simulation?.advisorFacts ?? [];

  const assist: ExecutiveAdvisorContent = useMemo(() => {
    const parts = [value.engine.assistBody];
    if (recommendation && recommendation.type !== "Idle") {
      parts.push(
        `Why · ${recommendation.why}`,
        `Impact · ${recommendation.impact}`,
        `Next Step · ${recommendation.nextStep}`,
      );
    }
    if (connectorFacts.length > 0) {
      parts.push(`Connector · ${connectorFacts.join(" · ")}`);
    }
    if (simulationFacts.length > 0) {
      parts.push(`Simulation · ${simulationFacts.join(" · ")}`);
    }
    return {
      title: value.engine.assistTitle,
      body: parts.join(" "),
      guidance: value.engine.assistGuidance,
      suggestionCards: value.engine.suggestionCards,
      quickActions: value.engine.proposals
        .filter((p) => p.status === "pending")
        .map((p) => p.title),
      accent: value.engine.accent,
      packPerspective: value.engine.packPerspective,
      suggestions: value.engine.suggestions,
      proposals: value.engine.proposals,
      references: value.engine.references,
      conversationMode: value.engine.conversationMode,
      conversation: value.session.messages,
    };
  }, [
    value.engine,
    value.session.messages,
    recommendation,
    connectorFacts,
    simulationFacts,
  ]);

  const insight: ExecutiveAdvisorContent = useMemo(() => {
    const cards = [
      ...(simulationFacts.length
        ? simulationFacts.map((fact) => `Simulation · ${fact}`)
        : []),
      ...(connectorFacts.length
        ? connectorFacts.map((fact) => `Connector · ${fact}`)
        : []),
      ...(recommendation && recommendation.type !== "Idle"
        ? [
            `Signal · ${recommendation.type} (${recommendation.severity})`,
            `Why · ${recommendation.why}`,
            `Impact · ${recommendation.impact}`,
            `Suggested · ${recommendation.suggestedWorkspace} · ${recommendation.suggestedAction}`,
          ]
        : []),
      ...value.engine.insightCards,
    ];
    return {
      title: value.engine.insightTitle,
      body:
        recommendation && recommendation.type !== "Idle"
          ? `${value.engine.insightBody} Recommendation context ready for ${recommendation.packTitle}.`
          : simulationFacts.length
            ? `${value.engine.insightBody} Simulation results ready for executive review.`
            : connectorFacts.length
              ? `${value.engine.insightBody} Connector intake ready for manager review.`
              : value.engine.insightBody,
      guidance: value.engine.insightGuidance,
      suggestionCards: cards,
      accent: value.engine.accent,
      packPerspective: `${value.context.packTitle} · Insight`,
      suggestions: value.engine.suggestions,
      references: value.engine.references,
      conversationMode: value.engine.conversationMode,
    };
  }, [
    value.engine,
    value.context.packTitle,
    recommendation,
    connectorFacts,
    simulationFacts,
  ]);

  return {
    ...value,
    assist,
    insight,
  };
}
