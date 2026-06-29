/**
 * APP-2:11 — Executive Scenario Assistant Adapter.
 * Conversational projection from ExecutiveScenarioWorkspaceView only.
 */

import type { ExecutiveScenarioWorkspaceView } from "./executiveScenarioWorkspaceView.ts";
import {
  buildExecutiveScenarioAssistantFollowUpTopics,
} from "./executiveScenarioAssistantTopics.ts";
import {
  createExecutiveScenarioAssistantConversationContext,
  createExecutiveScenarioAssistantEvidenceReference,
  createExecutiveScenarioAssistantExplanationSection,
  createExecutiveScenarioAssistantView,
  createUnavailableExecutiveScenarioAssistantView,
  type ExecutiveScenarioAssistantAdapterRequest,
  type ExecutiveScenarioAssistantEvidenceReference,
  type ExecutiveScenarioAssistantExplanationSection,
  type ExecutiveScenarioAssistantStatus,
  type ExecutiveScenarioAssistantView,
  EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
} from "./executiveScenarioAssistantView.ts";
import {
  createExecutiveScenarioAssistantDiagnostic,
  type ExecutiveScenarioAssistantDiagnostic,
} from "./executiveScenarioAssistantDiagnostics.ts";

export {
  EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
  type ExecutiveScenarioAssistantAdapterRequest,
  type ExecutiveScenarioAssistantView,
};

export const EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES = Object.freeze({
  readOnly: true,
  consumesWorkspaceViewOnly: true,
  generatesIntelligence: false,
  answersQuestions: false,
  executesRecommendations: false,
  modifiesScenarios: false,
  modifiesPackage: false,
  noUi: true,
  noReact: true,
  noLlm: true,
  noMl: true,
  noGlobalCache: true,
  workspaceIsolated: true,
  deterministic: true,
  formatsOnly: true,
} as const);

export const EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_MANIFEST = Object.freeze({
  stageId: "APP-2/11",
  title: "Executive Scenario Assistant Adapter",
  goal: "Single read-only assistant integration boundary for APP-2.",
  adapterVersion: EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
  workspaceAdapterModified: false,
  contractModified: false,
} as const);

function resolveAssistantStatus(
  view: ExecutiveScenarioWorkspaceView,
  diagnostics: readonly ExecutiveScenarioAssistantDiagnostic[]
): ExecutiveScenarioAssistantStatus {
  if (diagnostics.some((entry) => entry.severity === "error") || view.status === "unavailable") {
    return "unavailable";
  }
  if (view.status === "partial" || diagnostics.some((entry) => entry.severity === "warning")) {
    return "partial";
  }
  return "ready";
}

function validateWorkspaceViewForAssistant(
  view: ExecutiveScenarioWorkspaceView,
  workspaceId: string | undefined,
  generatedAt: string
): readonly ExecutiveScenarioAssistantDiagnostic[] {
  const diagnostics: ExecutiveScenarioAssistantDiagnostic[] = [];

  if (!view.readOnly) {
    diagnostics.push(
      createExecutiveScenarioAssistantDiagnostic(
        "missing_workspace_view",
        "ExecutiveScenarioWorkspaceView must be read-only.",
        generatedAt
      )
    );
  }
  if (view.adapterVersion !== "APP-2/10") {
    diagnostics.push(
      createExecutiveScenarioAssistantDiagnostic(
        "adapter_failure",
        "ExecutiveScenarioWorkspaceView adapter version mismatch.",
        generatedAt
      )
    );
  }
  if (workspaceId !== undefined && view.workspaceId !== workspaceId.trim()) {
    diagnostics.push(
      createExecutiveScenarioAssistantDiagnostic(
        "invalid_conversation_context",
        "Workspace view workspace ID does not match request.",
        generatedAt,
        Object.freeze({ requestedWorkspaceId: workspaceId, viewWorkspaceId: view.workspaceId })
      )
    );
  }
  if (view.summary === null) {
    diagnostics.push(
      createExecutiveScenarioAssistantDiagnostic(
        "missing_summary",
        "ExecutiveScenarioSummary not available in workspace view.",
        generatedAt
      )
    );
  }
  if (view.recommendationPortfolio === null) {
    diagnostics.push(
      createExecutiveScenarioAssistantDiagnostic(
        "missing_recommendation_portfolio",
        "ExecutiveRecommendationPortfolio not available in workspace view.",
        generatedAt
      )
    );
  }
  if (view.selectionState === "unavailable" || view.selectionState === "invalid") {
    diagnostics.push(
      createExecutiveScenarioAssistantDiagnostic(
        "invalid_conversation_context",
        `Workspace selection state is ${view.selectionState}.`,
        generatedAt
      )
    );
  }

  return Object.freeze(diagnostics);
}

function buildConversationContext(
  view: ExecutiveScenarioWorkspaceView
): ReturnType<typeof createExecutiveScenarioAssistantConversationContext> {
  return createExecutiveScenarioAssistantConversationContext({
    workspaceId: view.workspaceId,
    scenarioId: view.scenarioId,
    packageId: view.packageId,
    packageVersion: view.packageVersion,
    workspaceAdapterVersion: view.adapterVersion,
    selectionState: view.selectionState,
    refreshState: view.refreshState,
  });
}

function buildExplanationSections(
  view: ExecutiveScenarioWorkspaceView
): readonly ExecutiveScenarioAssistantExplanationSection[] {
  const summary = view.summary;
  const portfolio = view.recommendationPortfolio;
  if (summary === null) {
    return Object.freeze([]);
  }

  const sections: ExecutiveScenarioAssistantExplanationSection[] = [
    createExecutiveScenarioAssistantExplanationSection({
      sectionId: "section-executive-situation",
      kind: "executive_situation",
      title: "Executive Situation",
      content: summary.situationBrief,
    }),
    createExecutiveScenarioAssistantExplanationSection({
      sectionId: "section-executive-priority",
      kind: "executive_priority",
      title: "Executive Priority",
      content: summary.prioritySummary,
    }),
    createExecutiveScenarioAssistantExplanationSection({
      sectionId: "section-dependencies",
      kind: "dependencies",
      title: "Dependencies",
      content: summary.dependencySummary,
    }),
    createExecutiveScenarioAssistantExplanationSection({
      sectionId: "section-conflicts",
      kind: "conflicts",
      title: "Conflicts",
      content: summary.conflictSummary,
    }),
    createExecutiveScenarioAssistantExplanationSection({
      sectionId: "section-opportunities",
      kind: "opportunities",
      title: "Opportunities",
      content: summary.opportunitySummary,
    }),
    createExecutiveScenarioAssistantExplanationSection({
      sectionId: "section-risks",
      kind: "risks",
      title: "Risks",
      content: summary.riskSummary,
    }),
    createExecutiveScenarioAssistantExplanationSection({
      sectionId: "section-kpis",
      kind: "kpis",
      title: "KPIs",
      content: summary.kpiSummary,
    }),
  ];

  if (portfolio !== null && portfolio.recommendations.length > 0) {
    const overview = portfolio.recommendations
      .map((entry) => `${entry.title}: ${entry.summary}`)
      .join(" ");
    sections.push(
      createExecutiveScenarioAssistantExplanationSection({
        sectionId: "section-recommendation-overview",
        kind: "recommendation_overview",
        title: "Recommendation Overview",
        content: overview,
      })
    );
  }

  return Object.freeze(sections);
}

function mapSummarySourceToEvidenceSource(
  source: string
): ExecutiveScenarioAssistantEvidenceReference["source"] {
  if (source === "dependency_graph") return "dependency_graph";
  if (source === "conflict_graph") return "conflict_graph";
  if (source === "opportunity_graph") return "opportunity_graph";
  if (source === "priority") return "priority";
  return "summary";
}

function buildEvidenceReferences(
  view: ExecutiveScenarioWorkspaceView
): readonly ExecutiveScenarioAssistantEvidenceReference[] {
  const evidence: ExecutiveScenarioAssistantEvidenceReference[] = [];
  let index = 0;

  if (view.summary !== null) {
    for (const entry of view.summary.supportingEvidence) {
      evidence.push(
        createExecutiveScenarioAssistantEvidenceReference({
          evidenceRefId: `assistant-evidence-${index++}`,
          source: mapSummarySourceToEvidenceSource(entry.source),
          sourceRef: entry.sourceRef,
          summary: entry.summary,
        })
      );
    }
  }

  if (view.recommendationPortfolio !== null) {
    for (const entry of view.recommendationPortfolio.evidence) {
      evidence.push(
        createExecutiveScenarioAssistantEvidenceReference({
          evidenceRefId: `assistant-evidence-${index++}`,
          source: "recommendation_portfolio",
          sourceRef: entry.sourceRef,
          summary: entry.summary,
        })
      );
    }
    for (const recommendation of view.recommendationPortfolio.recommendations) {
      for (const entry of recommendation.supportingEvidence) {
        evidence.push(
          createExecutiveScenarioAssistantEvidenceReference({
            evidenceRefId: `assistant-evidence-${index++}`,
            source: "recommendation_portfolio",
            sourceRef: entry.sourceRef,
            summary: entry.summary,
          })
        );
      }
    }
  }

  return Object.freeze(evidence);
}

export function adaptExecutiveScenarioWorkspaceViewToAssistantView(
  request: ExecutiveScenarioAssistantAdapterRequest
): ExecutiveScenarioAssistantView {
  const { workspaceView, generatedAt, workspaceId } = request;

  const validationDiagnostics = validateWorkspaceViewForAssistant(
    workspaceView,
    workspaceId,
    generatedAt
  );
  const hasBlockingError = validationDiagnostics.some((entry) => entry.severity === "error");

  if (hasBlockingError) {
    return createUnavailableExecutiveScenarioAssistantView(
      workspaceView.workspaceId,
      generatedAt,
      validationDiagnostics
    );
  }

  const explanationSections = buildExplanationSections(workspaceView);
  const evidenceReferences = buildEvidenceReferences(workspaceView);
  const diagnostics = [...validationDiagnostics];

  if (evidenceReferences.length === 0) {
    diagnostics.push(
      createExecutiveScenarioAssistantDiagnostic(
        "missing_evidence",
        "No evidence references available for assistant projection.",
        generatedAt
      )
    );
  }

  const followUpTopics = buildExecutiveScenarioAssistantFollowUpTopics({
    hasSummary: workspaceView.summary !== null,
    hasPortfolio: workspaceView.recommendationPortfolio !== null,
    hasRecommendations: (workspaceView.recommendationPortfolio?.recommendations.length ?? 0) > 0,
    hasAssumptions: (workspaceView.recommendationPortfolio?.assumptions.length ?? 0) > 0,
    hasConstraints: (workspaceView.recommendationPortfolio?.constraints.length ?? 0) > 0,
  });

  if (followUpTopics.length === 0) {
    diagnostics.push(
      createExecutiveScenarioAssistantDiagnostic(
        "invalid_topic",
        "No follow-up topics available for assistant projection.",
        generatedAt
      )
    );
  }

  const assistantStatus = resolveAssistantStatus(workspaceView, Object.freeze(diagnostics));
  const summary = workspaceView.summary;

  return createExecutiveScenarioAssistantView({
    workspaceId: workspaceView.workspaceId,
    scenarioId: workspaceView.scenarioId,
    assistantStatus,
    adapterVersion: EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
    conversationContext: buildConversationContext(workspaceView),
    executiveHeadline: summary?.executiveHeadline ?? "Executive intelligence unavailable.",
    executiveSituation: summary?.situationBrief ?? "",
    recommendationPortfolio: workspaceView.recommendationPortfolio,
    explanationSections,
    followUpTopics,
    evidenceReferences,
    diagnostics: Object.freeze(diagnostics),
    generatedAt,
  });
}

export const ExecutiveScenarioAssistantAdapter = Object.freeze({
  adaptExecutiveScenarioWorkspaceViewToAssistantView,
  rules: EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES,
  manifest: EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_MANIFEST,
  version: EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
});
