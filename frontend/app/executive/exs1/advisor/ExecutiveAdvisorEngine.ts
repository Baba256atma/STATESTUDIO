/**
 * Sprint 5 — Executive Advisor Engine.
 * Mock LLM output grounded in Runtime context. Never mutates Runtime.
 */

import { cockpit } from "../shell/executiveCockpitTheme";
import { selectPromptTemplate } from "./ExecutiveAdvisorPromptTemplates";
import { formatAdvisorContextBrief } from "./ExecutiveAdvisorContextBuilder";
import type {
  AdvisorEngineResult,
  AdvisorProposal,
  AdvisorProposalKind,
  AdvisorReference,
  AdvisorSuggestion,
  AdvisorSuggestionKind,
  ExecutiveAdvisorContext,
} from "./ExecutiveAdvisorTypes";

/**
 * Deterministic SSR-safe proposal identity from stable Runtime semantics.
 * Never includes time, random, or UUID values.
 */
export function createProposalId(input: {
  readonly kind: string;
  readonly targetId?: string;
  readonly sourceId?: string;
  readonly mode: string;
}): string {
  return [
    "proposal",
    input.mode,
    input.kind,
    input.targetId ?? "none",
    input.sourceId ?? "none",
  ]
    .join(":")
    .toLowerCase()
    .replace(/[^a-z0-9:-]+/g, "-");
}

function createSuggestionId(input: {
  readonly mode: string;
  readonly kind: AdvisorSuggestionKind;
  readonly title: string;
  readonly sourceId?: string;
}): string {
  return [
    "suggestion",
    input.mode,
    input.kind,
    input.title,
    input.sourceId ?? "none",
  ]
    .join(":")
    .toLowerCase()
    .replace(/[^a-z0-9:-]+/g, "-");
}

function createReferenceId(input: {
  readonly mode: string;
  readonly kind: string;
  readonly targetId?: string;
}): string {
  return ["reference", input.mode, input.kind, input.targetId ?? "none"]
    .join(":")
    .toLowerCase()
    .replace(/[^a-z0-9:-]+/g, "-");
}

function proposalIdFor(
  context: ExecutiveAdvisorContext,
  kind: AdvisorProposalKind,
  targetId?: string,
  sourceId?: string,
): string {
  return createProposalId({
    mode: context.mode,
    kind,
    targetId:
      targetId ??
      context.decisionId ??
      context.scenarioId ??
      context.selectedObjectId ??
      context.packId ??
      undefined,
    sourceId: sourceId ?? context.packId ?? undefined,
  });
}

function buildSuggestions(
  context: ExecutiveAdvisorContext,
): AdvisorSuggestion[] {
  const items: AdvisorSuggestion[] = [
    {
      id: createSuggestionId({
        mode: context.mode,
        kind: "Observation",
        title: "Runtime Context Locked",
        sourceId: context.packId ?? undefined,
      }),
      kind: "Observation",
      title: "Runtime Context Locked",
      body: `Mode ${context.mode} · Pack ${context.packTitle} · Lens ${context.timelineLens}.`,
    },
  ];

  if (
    context.highlightedFieldDisplayName &&
    context.highlightedFieldTechnical &&
    context.highlightedFieldDisplayName !== context.highlightedFieldTechnical
  ) {
    items.push({
      id: createSuggestionId({
        mode: context.mode,
        kind: "Observation",
        title: "Business Meaning Resolved",
        sourceId: context.highlightedFieldTechnical,
      }),
      kind: "Observation",
      title: "Business Meaning Resolved",
      body: `${context.highlightedFieldTechnical} means ${context.highlightedFieldDisplayName}.`,
    });
  }

  if (context.dataActive) {
    items.push({
      id: createSuggestionId({
        mode: context.mode,
        kind: "Recommendation",
        title: "Complete Data Mapping",
        sourceId: context.dataSourceId ?? undefined,
      }),
      kind: "Recommendation",
      title: "Complete Data Mapping",
      body: `${context.dataSourceName ?? "Selected source"} should be mapped before Runtime data use.`,
    });
  } else if (context.mode === "Monitoring") {
    items.push({
      id: createSuggestionId({
        mode: context.mode,
        kind: "Warning",
        title: "Monitoring Deviation",
        sourceId: context.packId ?? undefined,
      }),
      kind: "Warning",
      title: "Monitoring Deviation",
      body: context.monitoringSummary,
    });
    if (context.alertTitles[0]) {
      items.push({
        id: createSuggestionId({
          mode: context.mode,
          kind: "Risk",
          title: "Alert Attention",
          sourceId: context.alertTitles[0],
        }),
        kind: "Risk",
        title: "Alert Attention",
        body: context.alertTitles[0],
      });
    }
  } else if (context.mode === "Execution") {
    items.push({
      id: createSuggestionId({
        mode: context.mode,
        kind: "Warning",
        title: "Execution Blockers",
        sourceId: context.packId ?? undefined,
      }),
      kind: "Warning",
      title: "Execution Blockers",
      body:
        context.blockedTaskNames.length > 0
          ? context.blockedTaskNames.join(", ")
          : "No blockers — confirm Start Execution only with manager approval.",
    });
  } else if (context.mode === "Decision") {
    items.push({
      id: createSuggestionId({
        mode: context.mode,
        kind: "Recommendation",
        title: "Decision Ready for Review",
        sourceId: context.decisionId ?? undefined,
      }),
      kind: "Recommendation",
      title: "Decision Ready for Review",
      body: `${context.decisionName ?? "Active decision"} is ${context.decisionStatus ?? "pending"}.`,
    });
  } else if (context.mode === "Scenario") {
    items.push({
      id: createSuggestionId({
        mode: context.mode,
        kind: "Opportunity",
        title: "Compare Scenarios",
        sourceId: context.scenarioId ?? undefined,
      }),
      kind: "Opportunity",
      title: "Compare Scenarios",
      body: `Active scenario ${context.scenarioName ?? "—"} — compare before deciding.`,
    });
  } else {
    items.push({
      id: createSuggestionId({
        mode: context.mode,
        kind: "Question",
        title: "Executive Focus",
        sourceId: context.selectedObjectId ?? context.packId ?? undefined,
      }),
      kind: "Question",
      title: "Executive Focus",
      body: "Which object or pack should receive attention next?",
    });
  }

  return items;
}

function buildProposals(context: ExecutiveAdvisorContext): AdvisorProposal[] {
  const proposals: AdvisorProposal[] = [];

  if (context.dataActive) {
    proposals.push({
      id: proposalIdFor(
        context,
        "Open Data Mapping",
        context.dataSourceId ?? "data",
        context.packId ?? undefined,
      ),
      kind: "Open Data Mapping",
      title: "Open Data Mapping",
      body: "Open Mappings section for the active source. Requires manager approval.",
      status: "pending",
      nav: "Data",
    });
  }

  if (context.mode === "Scenario") {
    proposals.push({
      id: proposalIdFor(
        context,
        "Create Scenario",
        context.scenarioId ?? "scenario",
        context.packId ?? undefined,
      ),
      kind: "Create Scenario",
      title: "Create Scenario",
      body: "Propose a new scenario draft from current Runtime context.",
      status: "pending",
    });
  }

  if (context.mode === "Decision" && context.decisionId) {
    proposals.push({
      id: proposalIdFor(
        context,
        "Approve Decision",
        context.decisionId,
        context.packId ?? undefined,
      ),
      kind: "Approve Decision",
      title: "Approve Decision",
      body: `Propose approval of ${context.decisionName ?? "decision"}. Manager must confirm.`,
      status: "pending",
      decisionId: context.decisionId,
    });
  }

  if (context.mode === "Execution") {
    proposals.push({
      id: proposalIdFor(
        context,
        "Start Execution",
        "execution-plan",
        context.packId ?? undefined,
      ),
      kind: "Start Execution",
      title: "Start Execution",
      body: "Propose starting the Capacity Expansion plan. No auto-start.",
      status: "pending",
    });
  }

  if (context.mode === "Monitoring") {
    proposals.push({
      id: proposalIdFor(
        context,
        "Take Snapshot",
        "monitoring-snapshot",
        context.packId ?? undefined,
      ),
      kind: "Take Snapshot",
      title: "Take Snapshot",
      body: "Propose a Monitoring Snapshot for Journal/Pack history.",
      status: "pending",
    });
  }

  const focusId = context.selectedObjectId ?? context.selectedObjectIds[0];
  if (focusId) {
    proposals.push({
      id: proposalIdFor(context, "Focus Object", focusId, context.packId ?? undefined),
      kind: "Focus Object",
      title: `Focus ${context.selectedObjectLabel ?? focusId}`,
      body: "Request Director highlight for the referenced object.",
      status: "pending",
      objectId: focusId,
    });
  }

  proposals.push({
    id: proposalIdFor(
      context,
      "Open Journal",
      "journal",
      context.packId ?? undefined,
    ),
    kind: "Open Journal",
    title: "Open Journal",
    body: "Open Explorer Journal for commitment history.",
    status: "pending",
    nav: "Journal",
  });

  return proposals.slice(0, 4);
}

function buildReferences(context: ExecutiveAdvisorContext): AdvisorReference[] {
  const refs: AdvisorReference[] = [];
  if (context.packId) {
    refs.push({
      id: createReferenceId({
        mode: context.mode,
        kind: "pack",
        targetId: context.packId,
      }),
      kind: "pack",
      label: context.packTitle,
      packId: context.packId,
    });
  }
  if (context.selectedObjectId) {
    refs.push({
      id: createReferenceId({
        mode: context.mode,
        kind: "object",
        targetId: context.selectedObjectId,
      }),
      kind: "object",
      label: context.selectedObjectLabel ?? context.selectedObjectId,
      objectId: context.selectedObjectId,
    });
  }
  if (context.scenarioId && context.scenarioName) {
    refs.push({
      id: createReferenceId({
        mode: context.mode,
        kind: "scenario",
        targetId: context.scenarioId,
      }),
      kind: "scenario",
      label: context.scenarioName,
      scenarioId: context.scenarioId,
    });
  }
  if (context.decisionId && context.decisionName) {
    refs.push({
      id: createReferenceId({
        mode: context.mode,
        kind: "decision",
        targetId: context.decisionId,
      }),
      kind: "decision",
      label: context.decisionName,
      decisionId: context.decisionId,
    });
  }
  refs.push({
    id: createReferenceId({
      mode: context.mode,
      kind: "timeline",
      targetId: `${context.timelineLens}-${context.timelinePosition}`,
    }),
    kind: "timeline",
    label: `${context.timelineLens} · ${context.timelinePosition}`,
    lens: context.timelineLens,
  });
  return refs;
}

/**
 * Generate Advisor Assist + Insight surfaces from immutable Runtime context.
 */
export function runExecutiveAdvisorEngine(
  context: ExecutiveAdvisorContext,
): AdvisorEngineResult {
  const template = selectPromptTemplate(context.mode, context.dataActive);
  const brief = formatAdvisorContextBrief(context);
  const suggestions = buildSuggestions(context);
  const proposals = buildProposals(context);
  const references = buildReferences(context);

  const explanation = [
    template.explainLead,
    brief,
    context.selectedObjectLabel
      ? `Focus object: ${context.selectedObjectLabel}.`
      : "No object focused.",
  ].join("\n\n");

  const assistBody = explanation;
  const suggestionCards = suggestions.map((s) => `${s.kind} · ${s.title}`);

  const insightCards = template.insightSections.map((section) => {
    switch (section) {
      case "Executive Summary":
        return `${section} · ${context.packTitle} in ${context.mode}`;
      case "Current Situation":
        return `${section} · Execution ${context.executionStatus} · Monitoring ${context.monitoringHealth}`;
      case "Risks":
        return `${section} · ${
          context.alertTitles[0] ??
          context.blockedTaskNames[0] ??
          "No critical risk flagged"
        }`;
      case "Opportunities":
        return `${section} · ${
          context.scenarioName
            ? `Advance ${context.scenarioName}`
            : "Strengthen data readiness"
        }`;
      case "Recommended Focus":
        return `${section} · ${template.recommendLead}`;
      case "Open Decisions":
        return `${section} · ${context.decisionName ?? "None"} (${context.decisionStatus ?? "n/a"})`;
      case "Scenario Trade-offs":
        return `${section} · Active ${context.scenarioName ?? "—"}`;
      case "Decision Status":
        return `${section} · ${context.decisionStatus ?? "n/a"}`;
      case "Blockers":
        return `${section} · ${context.blockedTaskNames.join(", ") || "Clear"}`;
      case "Source Summary":
        return `${section} · ${context.dataSourceName ?? "No source"}`;
      case "Connection Health":
        return `${section} · Data experience ${context.dataActive ? "active" : "idle"}`;
      case "Mapping Overview":
        return `${section} · Review mappings before Runtime use`;
      default:
        return `${section} · ${context.goal}`;
    }
  });

  const accent =
    context.mode === "Monitoring"
      ? context.monitoringHealth === "Critical"
        ? "#F04438"
        : "#FDB022"
      : context.mode === "Execution" && context.blockedTaskNames.length > 0
        ? "#F04438"
        : cockpit.accent;

  return {
    conversationMode: template.conversationMode,
    templateId: template.id,
    assistTitle: template.summaryLead,
    assistBody,
    assistGuidance: `${template.recommendLead}. Proposals require manager approval — Advisor never changes Runtime directly.`,
    packPerspective: `${context.packTitle} · ${context.mode} · ${template.conversationMode}`,
    accent,
    suggestionCards,
    suggestions,
    proposals,
    references,
    insightTitle: "Executive Intelligence",
    insightBody: insightCards.join(" "),
    insightGuidance:
      "Insight consumes Runtime only. Mock executive intelligence — no autonomous execution.",
    insightCards,
    explanation,
  };
}
