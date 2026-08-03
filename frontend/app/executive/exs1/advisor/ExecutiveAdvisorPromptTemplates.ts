/**
 * Sprint 5 — Advisor prompt templates.
 * No hard-coded response text inside UI components.
 */

import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import type { AdvisorConversationMode } from "./ExecutiveAdvisorTypes";

export type AdvisorPromptTemplateId =
  | "general"
  | "scenario-review"
  | "decision-review"
  | "execution-review"
  | "monitoring-review"
  | "data-review";

export type AdvisorPromptTemplate = {
  readonly id: AdvisorPromptTemplateId;
  readonly conversationMode: AdvisorConversationMode;
  readonly systemIntent: string;
  readonly summaryLead: string;
  readonly explainLead: string;
  readonly recommendLead: string;
  readonly insightSections: readonly string[];
};

export const ADVISOR_PROMPT_TEMPLATES: Record<
  AdvisorPromptTemplateId,
  AdvisorPromptTemplate
> = Object.freeze({
  general: {
    id: "general",
    conversationMode: "Explain",
    systemIntent:
      "Explain the current executive situation calmly using Runtime context.",
    summaryLead: "Executive Summary",
    explainLead: "Here is what the cockpit currently shows.",
    recommendLead: "Recommended next executive focus",
    insightSections: [
      "Executive Summary",
      "Current Situation",
      "Risks",
      "Opportunities",
      "Recommended Focus",
      "Open Decisions",
    ],
  },
  "scenario-review": {
    id: "scenario-review",
    conversationMode: "Review",
    systemIntent: "Compare scenario options and clarify trade-offs.",
    summaryLead: "Scenario Review",
    explainLead: "Scenario comparison based on the active Runtime selection.",
    recommendLead: "Compare options before committing a Decision",
    insightSections: [
      "Executive Summary",
      "Current Situation",
      "Scenario Trade-offs",
      "Risks",
      "Opportunities",
      "Recommended Focus",
    ],
  },
  "decision-review": {
    id: "decision-review",
    conversationMode: "Prepare Decision",
    systemIntent: "Prepare a decision recommendation without executing it.",
    summaryLead: "Decision Review",
    explainLead: "Decision readiness from Runtime Decision state.",
    recommendLead: "Prepare recommendation for manager approval",
    insightSections: [
      "Executive Summary",
      "Current Situation",
      "Decision Status",
      "Risks",
      "Opportunities",
      "Open Decisions",
    ],
  },
  "execution-review": {
    id: "execution-review",
    conversationMode: "Guide",
    systemIntent: "Highlight blockers and execution progress.",
    summaryLead: "Execution Review",
    explainLead: "Execution path status from Runtime.",
    recommendLead: "Highlight blockers before progressing tasks",
    insightSections: [
      "Executive Summary",
      "Current Situation",
      "Blockers",
      "Risks",
      "Opportunities",
      "Recommended Focus",
    ],
  },
  "monitoring-review": {
    id: "monitoring-review",
    conversationMode: "Summarize",
    systemIntent: "Explain deviations between expected and actual outcomes.",
    summaryLead: "Monitoring Review",
    explainLead: "Deviation summary from Runtime Monitoring state.",
    recommendLead: "Explain deviations and protect executive attention",
    insightSections: [
      "Executive Summary",
      "Current Situation",
      "Risks",
      "Opportunities",
      "Recommended Focus",
      "Open Decisions",
    ],
  },
  "data-review": {
    id: "data-review",
    conversationMode: "Guide",
    systemIntent: "Guide data connection and mapping without Runtime mutation.",
    summaryLead: "Data Review",
    explainLead: "Data catalog posture from Runtime Data state.",
    recommendLead: "Complete mapping before relying on this source",
    insightSections: [
      "Executive Summary",
      "Source Summary",
      "Connection Health",
      "Mapping Overview",
      "Recommended Focus",
      "Open Decisions",
    ],
  },
});

export function selectPromptTemplate(
  mode: ExecutiveModeId,
  dataActive: boolean,
): AdvisorPromptTemplate {
  if (dataActive) return ADVISOR_PROMPT_TEMPLATES["data-review"];
  switch (mode) {
    case "Scenario":
      return ADVISOR_PROMPT_TEMPLATES["scenario-review"];
    case "Decision":
      return ADVISOR_PROMPT_TEMPLATES["decision-review"];
    case "Execution":
      return ADVISOR_PROMPT_TEMPLATES["execution-review"];
    case "Monitoring":
      return ADVISOR_PROMPT_TEMPLATES["monitoring-review"];
    default:
      return ADVISOR_PROMPT_TEMPLATES.general;
  }
}
