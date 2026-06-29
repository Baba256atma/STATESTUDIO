/**
 * APP-3:13 — Executive Intent Dashboard Integration.
 * Presentation metadata only — consumes APP-3:11 reasoning model exclusively.
 */

import {
  createDashboardIntentDiagnostic,
  type DashboardIntentDiagnostic,
} from "./executiveIntentDashboardDiagnostics.ts";
import { getExecutiveIntentDashboardCanonicalExample } from "./executiveIntentDashboardExamples.ts";
import {
  DASHBOARD_SECTION_TITLES,
  EXECUTIVE_INTENT_DASHBOARD_LAYOUT,
} from "./executiveIntentDashboardLayouts.ts";
import {
  createDashboardIntentModel,
  EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION,
  type DashboardIntentBadge,
  type DashboardIntentBadgeKey,
  type DashboardIntentCard,
  type DashboardIntentCardKey,
  type DashboardIntentFlags,
  type DashboardIntentMetric,
  type DashboardIntentMetricKey,
  type DashboardIntentModel,
  type DashboardIntentSection,
  type DashboardIntentSectionKey,
  type DashboardIntentStatus,
  type DashboardIntentSummary,
  type DashboardIntentValidationResult,
  type DashboardIntentWidget,
  type DashboardIntentWidgetKey,
} from "./executiveIntentDashboardTypes.ts";
import {
  buildReasoningExample,
  buildReasoningProbe,
} from "./executiveIntentReasoningEngine.ts";
import { EXECUTIVE_INTENT_REASONING_ENGINE_VERSION } from "./executiveIntentReasoningTypes.ts";
import type {
  ExecutiveIntentReadinessState,
  ExecutiveIntentReasoning,
} from "./executiveIntentReasoningTypes.ts";

export const EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_OWNER = "executive-intent-dashboard" as const;

export const EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_TAGS = Object.freeze([
  "[APP3_13]",
  "[EXECUTIVE_INTENT_DASHBOARD]",
  "[DASHBOARD_INTEGRATION]",
  "[REASONING_CONSUMER]",
  "[READ_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES = Object.freeze({
  deterministic: true,
  pure: true,
  noSideEffects: true,
  noGlobalState: true,
  noStorage: true,
  noMutation: true,
  noRecommendations: true,
  noBusinessReasoning: true,
  noUiRendering: true,
  reasoningConsumerOnly: true,
  readOnly: true,
} as const);

function deterministicId(prefix: string, payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}

function pushDiagnostic(
  diagnostics: DashboardIntentDiagnostic[],
  code: Parameters<typeof createDashboardIntentDiagnostic>[0],
  message: string,
  timestamp: string,
  options: Parameters<typeof createDashboardIntentDiagnostic>[3] = Object.freeze({})
): void {
  diagnostics.push(createDashboardIntentDiagnostic(code, message, timestamp, options));
}

function sectionContent(
  reasoning: ExecutiveIntentReasoning,
  sectionKey: DashboardIntentSectionKey
): string {
  const mapping: Partial<Record<DashboardIntentSectionKey, ExecutiveIntentReasoning["sections"][number]["sectionKey"]>> =
    Object.freeze({
      intent_overview: "intent_summary",
      current_state: "current_state",
      classification: "primary_classification",
      confidence: "confidence_summary",
      conflicts: "conflict_summary",
      dependencies: "dependency_summary",
      evolution: "evolution_summary",
      known_information: "known_information",
      unknown_information: "unknown_information",
    });

  if (sectionKey === "executive_summary") {
    return `Executive intent "${reasoning.summary.intentLabel}" — ${reasoning.readinessAssessment.headline}`;
  }
  if (sectionKey === "highlights") {
    return reasoning.highlights.items.map((item) => `${item.label}: ${item.description}`).join("; ") || "No highlights.";
  }
  if (sectionKey === "issues") {
    return reasoning.issues.map((issue) => `${issue.label}: ${issue.description}`).join("; ") || "No issues.";
  }
  if (sectionKey === "readiness") {
    return `${reasoning.readinessAssessment.headline} ${reasoning.readinessAssessment.explanation}`;
  }
  if (sectionKey === "diagnostics") {
    return reasoning.diagnostics.map((entry) => `${entry.code}: ${entry.message}`).join("; ");
  }

  const reasoningKey = mapping[sectionKey];
  if (!reasoningKey) return "Unavailable.";
  const section = reasoning.sections.find((entry) => entry.sectionKey === reasoningKey);
  return section?.content ?? "Unavailable.";
}

function sectionAvailable(
  reasoning: ExecutiveIntentReasoning,
  sectionKey: DashboardIntentSectionKey
): boolean {
  if (sectionKey === "executive_summary" || sectionKey === "intent_overview") return true;
  if (sectionKey === "highlights") return reasoning.highlights.items.length > 0;
  if (sectionKey === "issues") return reasoning.issues.length > 0;
  if (sectionKey === "readiness") return true;
  if (sectionKey === "diagnostics") return reasoning.diagnostics.length > 0;
  if (sectionKey === "conflicts") return reasoning.flags.hasConflicts;
  if (sectionKey === "dependencies") return reasoning.flags.hasDependencies;
  if (sectionKey === "evolution") return reasoning.flags.hasEvolutionHistory;
  if (sectionKey === "unknown_information") return reasoning.unknowns.length > 0;
  const mapping: Partial<Record<DashboardIntentSectionKey, ExecutiveIntentReasoning["sections"][number]["sectionKey"]>> =
    Object.freeze({
      current_state: "current_state",
      classification: "primary_classification",
      confidence: "confidence_summary",
      known_information: "known_information",
    });
  const reasoningKey = mapping[sectionKey];
  if (!reasoningKey) return false;
  return reasoning.sections.some((entry) => entry.sectionKey === reasoningKey && entry.available);
}

function layoutPanelForSection(sectionKey: DashboardIntentSectionKey): string | null {
  const panel = EXECUTIVE_INTENT_DASHBOARD_LAYOUT.panels.find((entry) =>
    (entry.sectionKeys as readonly string[]).includes(sectionKey)
  );
  return panel?.panelId ?? null;
}

export function mapReasoningStatusToDashboardStatus(
  readinessState: ExecutiveIntentReasoning["readinessAssessment"]["state"] | null
): DashboardIntentStatus {
  switch (readinessState) {
    case "ready":
      return "ready";
    case "needs_clarification":
      return "needs_clarification";
    case "blocked":
      return "blocked";
    case "archived":
      return "archived";
    case "incomplete":
    case "not_ready":
      return "incomplete";
    default:
      return "unknown";
  }
}

export function buildDashboardStatus(
  reasoning: ExecutiveIntentReasoning | null
): DashboardIntentStatus {
  if (!reasoning) return "unknown";
  return mapReasoningStatusToDashboardStatus(reasoning.readinessAssessment.state);
}

export function buildDashboardSections(
  reasoning: ExecutiveIntentReasoning | null
): readonly DashboardIntentSection[] {
  if (!reasoning) {
    return Object.freeze([
      Object.freeze({
        sectionId: deterministicId("dashboard-section", "executive_summary"),
        sectionKey: "executive_summary" as const,
        title: DASHBOARD_SECTION_TITLES.executive_summary,
        body: "No executive intent reasoning is available.",
        available: false,
        layoutPanelId: "executive_summary",
        readOnly: true as const,
      }),
    ]);
  }

  const sectionKeys = Object.keys(DASHBOARD_SECTION_TITLES) as DashboardIntentSectionKey[];
  return Object.freeze(
    sectionKeys.map((sectionKey) =>
      Object.freeze({
        sectionId: deterministicId("dashboard-section", `${sectionKey}:${reasoning.timestamp}`),
        sectionKey,
        title: DASHBOARD_SECTION_TITLES[sectionKey],
        body: sectionContent(reasoning, sectionKey),
        available: sectionAvailable(reasoning, sectionKey),
        layoutPanelId: layoutPanelForSection(sectionKey),
        readOnly: true as const,
      })
    )
  );
}

export function buildDashboardMetrics(
  reasoning: ExecutiveIntentReasoning | null
): readonly DashboardIntentMetric[] {
  if (!reasoning) return Object.freeze([]);

  const metrics: DashboardIntentMetric[] = [];
  const addMetric = (
    metricKey: DashboardIntentMetricKey,
    label: string,
    value: string,
    numericValue: number | null,
    unit: string | null
  ): void => {
    metrics.push(
      Object.freeze({
        metricId: deterministicId("dashboard-metric", metricKey),
        metricKey,
        label,
        value,
        numericValue,
        unit,
        readOnly: true as const,
      })
    );
  };

  const confidenceSection = reasoning.sections.find(
    (entry) => entry.sectionKey === "confidence_summary"
  );
  const aggregateScoreMatch = confidenceSection?.content.match(/(\d+)\/100/);
  addMetric(
    "confidence_score",
    "Confidence Score",
    aggregateScoreMatch?.[1] ?? reasoning.summary.confidenceLevel ?? "unknown",
    aggregateScoreMatch ? Number(aggregateScoreMatch[1]) : null,
    aggregateScoreMatch ? "score" : null
  );
  addMetric(
    "conflict_count",
    "Conflict Count",
    String(reasoning.flags.hasConflicts ? reasoning.issues.filter((i) => i.issueKey === "conflicting_objectives").length || 1 : 0),
    reasoning.flags.hasConflicts ? Math.max(1, reasoning.issues.filter((i) => i.issueKey === "conflicting_objectives").length) : 0,
    "count"
  );
  addMetric(
    "dependency_count",
    "Dependency Count",
    String(reasoning.flags.hasDependencies ? 1 : 0),
    reasoning.flags.hasDependencies ? 1 : 0,
    "count"
  );
  addMetric(
    "unknown_count",
    "Unknown Count",
    String(reasoning.unknowns.length),
    reasoning.unknowns.length,
    "count"
  );
  addMetric(
    "evolution_depth",
    "Evolution Depth",
    String(reasoning.flags.hasEvolutionHistory ? 1 : 0),
    reasoning.flags.hasEvolutionHistory ? 1 : 0,
    "depth"
  );
  addMetric(
    "classification_count",
    "Classification Count",
    String(reasoning.summary.primaryClassification ? 1 + (reasoning.sections.find((s) => s.sectionKey === "secondary_classifications")?.content.split(",").length ?? 0) : 0),
    reasoning.summary.primaryClassification ? 1 : 0,
    "count"
  );
  addMetric(
    "readiness_state",
    "Readiness State",
    reasoning.readinessAssessment.state,
    null,
    null
  );
  addMetric(
    "highlight_count",
    "Highlight Count",
    String(reasoning.highlights.items.length),
    reasoning.highlights.items.length,
    "count"
  );
  addMetric(
    "issue_count",
    "Issue Count",
    String(reasoning.issues.length),
    reasoning.issues.length,
    "count"
  );

  return Object.freeze(metrics);
}

export function buildDashboardBadges(
  reasoning: ExecutiveIntentReasoning | null
): readonly DashboardIntentBadge[] {
  if (!reasoning) return Object.freeze([]);

  const badges: DashboardIntentBadge[] = [];
  const addBadge = (badgeKey: DashboardIntentBadgeKey, label: string, active: boolean): void => {
    badges.push(
      Object.freeze({
        badgeId: deterministicId("dashboard-badge", badgeKey),
        badgeKey,
        label,
        active,
        readOnly: true as const,
      })
    );
  };

  addBadge("ready", "Ready", reasoning.readinessAssessment.state === "ready");
  addBadge("blocked", "Blocked", reasoning.readinessAssessment.state === "blocked");
  addBadge(
    "needs_clarification",
    "Needs Clarification",
    reasoning.readinessAssessment.state === "needs_clarification"
  );
  addBadge("high_confidence", "High Confidence", !reasoning.flags.lowConfidence);
  addBadge("conflict_detected", "Conflict Detected", reasoning.flags.hasConflicts);
  addBadge("dependency_present", "Dependency Present", reasoning.flags.hasDependencies);
  addBadge(
    "recently_updated",
    "Recently Updated",
    reasoning.highlights.items.some((item) => item.highlightKey === "recent_strategy_shift")
  );
  addBadge("archived", "Archived", reasoning.readinessAssessment.state === "archived");
  addBadge("future_compatible", "Future Compatible", true);

  return Object.freeze(badges);
}

function cardEmphasis(
  cardKey: DashboardIntentCardKey,
  reasoning: ExecutiveIntentReasoning
): DashboardIntentCard["emphasis"] {
  if (cardKey === "conflict" && reasoning.flags.hasConflicts) return "warning";
  if (cardKey === "readiness" && reasoning.readinessAssessment.state === "blocked") return "critical";
  if (cardKey === "confidence" && reasoning.flags.lowConfidence) return "warning";
  if (cardKey === "executive_summary" || cardKey === "intent") return "primary";
  return "neutral";
}

export function buildDashboardCards(
  reasoning: ExecutiveIntentReasoning | null
): readonly DashboardIntentCard[] {
  if (!reasoning) return Object.freeze([]);

  const cards: Array<{
    cardKey: DashboardIntentCardKey;
    title: string;
    subtitle: string;
    body: string;
    available: boolean;
  }> = [
    {
      cardKey: "executive_summary",
      title: "Executive Summary",
      subtitle: reasoning.summary.intentLabel,
      body: sectionContent(reasoning, "executive_summary"),
      available: true,
    },
    {
      cardKey: "intent",
      title: "Intent",
      subtitle: reasoning.summary.primaryClassification ?? "Unclassified",
      body: sectionContent(reasoning, "intent_overview"),
      available: true,
    },
    {
      cardKey: "state",
      title: "State",
      subtitle: reasoning.readinessAssessment.state,
      body: sectionContent(reasoning, "current_state"),
      available: sectionAvailable(reasoning, "current_state"),
    },
    {
      cardKey: "confidence",
      title: "Confidence",
      subtitle: reasoning.summary.confidenceLevel ?? "unknown",
      body: sectionContent(reasoning, "confidence"),
      available: sectionAvailable(reasoning, "confidence"),
    },
    {
      cardKey: "conflict",
      title: "Conflicts",
      subtitle: reasoning.flags.hasConflicts ? "Present" : "None",
      body: sectionContent(reasoning, "conflicts"),
      available: reasoning.flags.hasConflicts,
    },
    {
      cardKey: "dependency",
      title: "Dependencies",
      subtitle: reasoning.flags.hasDependencies ? "Present" : "None",
      body: sectionContent(reasoning, "dependencies"),
      available: reasoning.flags.hasDependencies,
    },
    {
      cardKey: "evolution",
      title: "Evolution",
      subtitle: reasoning.flags.hasEvolutionHistory ? "History" : "None",
      body: sectionContent(reasoning, "evolution"),
      available: reasoning.flags.hasEvolutionHistory,
    },
    {
      cardKey: "unknowns",
      title: "Unknowns",
      subtitle: `${reasoning.unknowns.length} recorded`,
      body: sectionContent(reasoning, "unknown_information"),
      available: reasoning.unknowns.length > 0,
    },
    {
      cardKey: "readiness",
      title: "Readiness",
      subtitle: reasoning.readinessAssessment.state,
      body: sectionContent(reasoning, "readiness"),
      available: true,
    },
  ];

  return Object.freeze(
    cards.map((card) =>
      Object.freeze({
        cardId: deterministicId("dashboard-card", card.cardKey),
        cardKey: card.cardKey,
        title: card.title,
        subtitle: card.subtitle,
        body: card.body,
        available: card.available,
        emphasis: cardEmphasis(card.cardKey, reasoning),
        readOnly: true as const,
      })
    )
  );
}

export function buildDashboardWidgets(
  reasoning: ExecutiveIntentReasoning | null
): readonly DashboardIntentWidget[] {
  const widgets: Array<{
    widgetKey: DashboardIntentWidgetKey;
    title: string;
    description: string;
    layoutPanelId: string;
    cardKeys: readonly DashboardIntentCardKey[];
    metricKeys: readonly DashboardIntentMetricKey[];
    available: boolean;
  }> = [
    {
      widgetKey: "summary",
      title: "Summary Widget",
      description: "Executive summary and intent overview.",
      layoutPanelId: "executive_summary",
      cardKeys: Object.freeze(["executive_summary", "intent"]),
      metricKeys: Object.freeze(["highlight_count", "issue_count"]),
      available: Boolean(reasoning),
    },
    {
      widgetKey: "status",
      title: "Status Widget",
      description: "Current state and readiness.",
      layoutPanelId: "status_overview",
      cardKeys: Object.freeze(["state", "readiness"]),
      metricKeys: Object.freeze(["readiness_state"]),
      available: Boolean(reasoning),
    },
    {
      widgetKey: "confidence",
      title: "Confidence Widget",
      description: "Understanding confidence presentation.",
      layoutPanelId: "confidence_panel",
      cardKeys: Object.freeze(["confidence"]),
      metricKeys: Object.freeze(["confidence_score"]),
      available: Boolean(reasoning),
    },
    {
      widgetKey: "conflict",
      title: "Conflict Widget",
      description: "Conflict presentation metadata.",
      layoutPanelId: "conflict_panel",
      cardKeys: Object.freeze(["conflict"]),
      metricKeys: Object.freeze(["conflict_count"]),
      available: Boolean(reasoning?.flags.hasConflicts),
    },
    {
      widgetKey: "dependency",
      title: "Dependency Widget",
      description: "Dependency presentation metadata.",
      layoutPanelId: "dependency_panel",
      cardKeys: Object.freeze(["dependency"]),
      metricKeys: Object.freeze(["dependency_count"]),
      available: Boolean(reasoning?.flags.hasDependencies),
    },
    {
      widgetKey: "evolution",
      title: "Evolution Widget",
      description: "Evolution history presentation metadata.",
      layoutPanelId: "evolution_panel",
      cardKeys: Object.freeze(["evolution"]),
      metricKeys: Object.freeze(["evolution_depth"]),
      available: Boolean(reasoning?.flags.hasEvolutionHistory),
    },
    {
      widgetKey: "readiness",
      title: "Readiness Widget",
      description: "Readiness assessment presentation.",
      layoutPanelId: "readiness_panel",
      cardKeys: Object.freeze(["readiness"]),
      metricKeys: Object.freeze(["readiness_state", "issue_count"]),
      available: Boolean(reasoning),
    },
    {
      widgetKey: "unknowns",
      title: "Unknowns Widget",
      description: "Unknown information presentation.",
      layoutPanelId: "unknowns_panel",
      cardKeys: Object.freeze(["unknowns"]),
      metricKeys: Object.freeze(["unknown_count"]),
      available: Boolean(reasoning && reasoning.unknowns.length > 0),
    },
  ];

  return Object.freeze(
    widgets.map((widget) =>
      Object.freeze({
        widgetId: deterministicId("dashboard-widget", widget.widgetKey),
        widgetKey: widget.widgetKey,
        title: widget.title,
        description: widget.description,
        layoutPanelId: widget.layoutPanelId,
        cardKeys: widget.cardKeys,
        metricKeys: widget.metricKeys,
        available: widget.available,
        readOnly: true as const,
      })
    )
  );
}

export function buildDashboardSummary(
  reasoning: ExecutiveIntentReasoning | null,
  metrics: readonly DashboardIntentMetric[],
  cards: readonly DashboardIntentCard[],
  badges: readonly DashboardIntentBadge[]
): DashboardIntentSummary {
  if (!reasoning) {
    return Object.freeze({
      summaryId: deterministicId("dashboard-summary", "none"),
      headline: "No executive intent dashboard model available.",
      intentLabel: "Unavailable",
      status: "unknown",
      confidenceLevel: null,
      primaryClassification: null,
      metricCount: 0,
      cardCount: 0,
      badgeCount: 0,
      readOnly: true as const,
    });
  }

  return Object.freeze({
    summaryId: deterministicId("dashboard-summary", reasoning.reasoningId),
    headline: `Dashboard for ${reasoning.summary.intentLabel}.`,
    intentLabel: reasoning.summary.intentLabel,
    status: mapReasoningStatusToDashboardStatus(reasoning.readinessAssessment.state),
    confidenceLevel: reasoning.summary.confidenceLevel,
    primaryClassification: reasoning.summary.primaryClassification,
    metricCount: metrics.length,
    cardCount: cards.length,
    badgeCount: badges.filter((badge) => badge.active).length,
    readOnly: true as const,
  });
}

function withSyntheticReadinessState(
  reasoning: ExecutiveIntentReasoning,
  state: ExecutiveIntentReadinessState
): ExecutiveIntentReasoning {
  const readinessAssessment = Object.freeze({
    ...reasoning.readinessAssessment,
    state,
    headline:
      state === "archived"
        ? "Intent is archived."
        : state === "blocked"
          ? "Intent is blocked."
          : state === "ready"
            ? "Intent is ready for downstream consumption."
            : reasoning.readinessAssessment.headline,
    explanation: reasoning.readinessAssessment.explanation,
    readyForAssistant: state === "ready" || state === "needs_clarification",
    readyForDashboard: state === "ready",
    blockingIssueCount: reasoning.readinessAssessment.blockingIssueCount,
    readOnly: true as const,
  });
  const summary = Object.freeze({
    ...reasoning.summary,
    readinessState: state,
    readOnly: true as const,
  });
  const flags = Object.freeze({
    ...reasoning.flags,
    readyForDashboard: state === "ready",
  });
  return Object.freeze({ ...reasoning, summary, readinessAssessment, flags });
}

function resolveDashboardFlags(input: Readonly<{
  reasoning: ExecutiveIntentReasoning | null;
}>): DashboardIntentFlags {
  return Object.freeze({
    dashboardReady: Boolean(input.reasoning),
    reasoningAvailable: Boolean(input.reasoning),
    readyForDashboard: Boolean(input.reasoning?.flags.readyForDashboard),
    hasConflicts: Boolean(input.reasoning?.flags.hasConflicts),
    hasDependencies: Boolean(input.reasoning?.flags.hasDependencies),
    hasEvolutionHistory: Boolean(input.reasoning?.flags.hasEvolutionHistory),
    lowConfidence: Boolean(input.reasoning?.flags.lowConfidence),
    multipleUnknowns: Boolean(input.reasoning?.flags.multipleUnknowns),
    futureCompatible: true as const,
    readOnly: true as const,
    deterministic: true as const,
  });
}

export function buildDashboardIntentModel(
  reasoning: ExecutiveIntentReasoning | null,
  timestamp: string = reasoning?.timestamp ?? new Date(0).toISOString()
): DashboardIntentModel {
  const diagnostics: DashboardIntentDiagnostic[] = [];
  const metrics = buildDashboardMetrics(reasoning);
  const cards = buildDashboardCards(reasoning);
  const badges = buildDashboardBadges(reasoning);
  const sections = buildDashboardSections(reasoning);
  const widgets = buildDashboardWidgets(reasoning);
  const summary = buildDashboardSummary(reasoning, metrics, cards, badges);
  const status = buildDashboardStatus(reasoning);
  const flags = resolveDashboardFlags({ reasoning });

  if (!reasoning) {
    pushDiagnostic(
      diagnostics,
      "reasoning_unavailable",
      "No executive intent reasoning model was provided.",
      timestamp
    );
  } else {
    if (flags.dashboardReady) {
      pushDiagnostic(diagnostics, "dashboard_ready", "Dashboard model is ready.", timestamp);
    }
    if (flags.readyForDashboard) {
      pushDiagnostic(diagnostics, "ready_for_dashboard", "Intent is ready for dashboard display.", timestamp);
    }
    if (status === "incomplete") {
      pushDiagnostic(diagnostics, "incomplete_intent", "Intent representation is incomplete.", timestamp);
    }
    if (status === "archived") {
      pushDiagnostic(diagnostics, "archived_intent", "Intent is archived.", timestamp);
    }
    if (status === "blocked") {
      pushDiagnostic(diagnostics, "blocked_intent", "Intent is blocked.", timestamp);
    }
    if (flags.lowConfidence) {
      pushDiagnostic(diagnostics, "low_confidence", "Low understanding confidence reported.", timestamp);
    }
    if (flags.hasConflicts) {
      pushDiagnostic(diagnostics, "conflict_present", "Conflicts are present.", timestamp);
    }
    if (flags.hasDependencies) {
      pushDiagnostic(diagnostics, "dependency_present", "Dependencies are present.", timestamp);
    }
    if (flags.multipleUnknowns) {
      pushDiagnostic(diagnostics, "unknown_information", "Multiple unknowns recorded.", timestamp);
    }
  }

  pushDiagnostic(
    diagnostics,
    "dashboard_model_success",
    "Dashboard model built deterministically from reasoning.",
    timestamp
  );

  return createDashboardIntentModel({
    modelId: deterministicId(
      "dashboard-intent-model",
      `${reasoning?.reasoningId ?? "none"}:${timestamp}`
    ),
    workspaceId: reasoning?.workspaceId ?? null,
    focusIntentId: reasoning?.focusIntentId ?? null,
    status,
    summary,
    sections,
    cards,
    metrics,
    badges,
    widgets,
    flags,
    diagnostics: Object.freeze([...diagnostics]),
    metadata: Object.freeze({
      dashboardIntegrationVersion: EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION,
      reasoningEngineVersion: reasoning?.metadata.reasoningEngineVersion ?? null,
      reasoningId: reasoning?.reasoningId ?? null,
      assistantIntegrationVersion: null,
      enginesConsumed: reasoning?.metadata.enginesConsumed ?? Object.freeze([]),
      layoutId: EXECUTIVE_INTENT_DASHBOARD_LAYOUT.layoutId,
      sectionCount: sections.length,
      widgetCount: widgets.length,
      readOnly: true as const,
    }),
    timestamp,
  });
}

export function validateDashboardModel(
  model: DashboardIntentModel
): DashboardIntentValidationResult {
  const issues: string[] = [];
  if (model.readOnly !== true) issues.push("Dashboard model must be read-only.");
  if (model.flags.readOnly !== true) issues.push("Dashboard flags must be read-only.");
  if (model.flags.deterministic !== true) issues.push("Dashboard integration must be deterministic.");
  if (model.metadata.dashboardIntegrationVersion !== EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION) {
    issues.push("Unexpected dashboard integration version.");
  }
  if (model.metadata.reasoningEngineVersion && model.metadata.reasoningEngineVersion !== EXECUTIVE_INTENT_REASONING_ENGINE_VERSION) {
    issues.push("Unexpected reasoning engine version reference.");
  }
  if (model.summary.status !== model.status) {
    issues.push("Summary status must match model status.");
  }
  if (model.summary.metricCount !== model.metrics.length) {
    issues.push("Summary metric count mismatch.");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export function buildDashboardExample(
  exampleId: string,
  workspaceId: string = "ws-example-001",
  owner: string = "executive-owner",
  generatedAt: string = new Date(0).toISOString()
): DashboardIntentModel | null {
  const example = getExecutiveIntentDashboardCanonicalExample(exampleId);
  if (!example) return null;

  if (!example.reasoningExampleId) {
    return buildDashboardIntentModel(null, generatedAt);
  }

  const reasoning = buildReasoningExample(
    example.reasoningExampleId,
    workspaceId,
    owner,
    generatedAt
  );
  if (!reasoning) return null;

  const presentationReasoning = example.syntheticStatus
    ? withSyntheticReadinessState(
        reasoning,
        example.syntheticStatus as ExecutiveIntentReadinessState
      )
    : reasoning;

  return buildDashboardIntentModel(presentationReasoning, generatedAt);
}

export function buildDashboardProbe(
  generatedAt: string = new Date(0).toISOString()
): DashboardIntentModel {
  const reasoning = buildReasoningProbe(generatedAt);
  return buildDashboardIntentModel(reasoning, generatedAt);
}

export function getExecutiveIntentDashboardIntegrationVersionMetadata(): Readonly<{
  dashboardIntegrationVersion: typeof EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION;
  owner: typeof EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_OWNER;
}> {
  return Object.freeze({
    dashboardIntegrationVersion: EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION,
    owner: EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_OWNER,
  });
}

export const ExecutiveIntentDashboardIntegration = Object.freeze({
  buildDashboardIntentModel,
  buildDashboardSummary,
  buildDashboardCards,
  buildDashboardMetrics,
  buildDashboardBadges,
  buildDashboardSections,
  buildDashboardWidgets,
  buildDashboardStatus,
  validateDashboardModel,
  buildDashboardExample,
  buildDashboardProbe,
  getExecutiveIntentDashboardIntegrationVersionMetadata,
  version: EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION,
  rules: EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES,
  tags: EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_TAGS,
});
