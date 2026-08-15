/**
 * NEX-MVP:7 — Executive Advisor + Insight presentation coordinator.
 *
 * Thin, UI-safe mapping from canonical MVP context into Advisor/Insight
 * view models. Declares approved REX/NEX-CI public surface identities.
 * Does not import private engines or Node-bound certification indexes
 * into browser clients. Does not invent KPI/KOI/facts.
 */

import type {
  NexoraMVPPresentationState,
  NexoraMVPSceneEnvironmentIntent,
  NexoraMVPWorkspaceKind,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import type {
  NexoraMVPAdvisorContextBridge,
  NexoraMVPInteractionMode,
  NexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type {
  NexoraMVPPresentationAvailableAction,
  NexoraMVPPresentationViewModel,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  type NexoraMVPStageObjectFixture,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
  type NexoraMVPContextSubjectFixture,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraMVPAdvisorInsightExperienceIdentity =
  "NEX-MVP:7/NexoraAdvisorInsightExperience" as const;

export const nexoraMVPAdvisorInsightExperienceVersion = "1.7.0" as const;

export const nexoraMVPAdvisorInsightExperienceNamespace =
  "nexora.mvp.advisor-insight-experience" as const;

export const nexoraMVPAdvisorInsightExperiencePhase =
  "AdvisorAndInsightExperience" as const;

export const nexoraMVPAdvisorInsightExperienceArchitecturalRole =
  "MVPExecutiveIntelligencePresentationCoordinator" as const;

export const nexoraMVPAdvisorInsightExperienceReadiness =
  "ReadyForExecutiveFlowIntegration" as const;

/** Approved public surface identities — not private implementation imports. */
export const NEXORA_MVP_INTELLIGENCE_UPSTREAM_SURFACES = Object.freeze({
  rexAdvisorPublicIndex:
    "REX-3:9/RuntimeExecutiveAdvisorExperiencePublicIndex" as const,
  rexAdvisorImportPath:
    "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePublicIndex" as const,
  rexInsightPublicIndex:
    "REX-4:9/RuntimeExecutiveInsightExperiencePublicIndex" as const,
  rexInsightImportPath:
    "@/app/lib/rex/runtimeExecutiveInsightExperiencePublicIndex" as const,
  nexCiPublicIndex:
    "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex" as const,
  nexCiAdvisorInsight: "NEX-CI:5/AdvisorInsightIntegration" as const,
});

export type NexoraMVPAdvisorInsightExperienceIdentity = {
  readonly id: typeof nexoraMVPAdvisorInsightExperienceIdentity;
  readonly version: typeof nexoraMVPAdvisorInsightExperienceVersion;
  readonly namespace: typeof nexoraMVPAdvisorInsightExperienceNamespace;
  readonly phase: typeof nexoraMVPAdvisorInsightExperiencePhase;
  readonly architecturalRole: typeof nexoraMVPAdvisorInsightExperienceArchitecturalRole;
};

const IDENTITY: NexoraMVPAdvisorInsightExperienceIdentity = Object.freeze({
  id: nexoraMVPAdvisorInsightExperienceIdentity,
  version: nexoraMVPAdvisorInsightExperienceVersion,
  namespace: nexoraMVPAdvisorInsightExperienceNamespace,
  phase: nexoraMVPAdvisorInsightExperiencePhase,
  architecturalRole: nexoraMVPAdvisorInsightExperienceArchitecturalRole,
});

export function getNexoraMVPAdvisorInsightExperienceIdentity(): NexoraMVPAdvisorInsightExperienceIdentity {
  return IDENTITY;
}

export const NEXORA_MVP_INTELLIGENCE_BOUNDARY = Object.freeze({
  architecturalRole: nexoraMVPAdvisorInsightExperienceArchitecturalRole,
  ownsAdvisorReasoning: false as const,
  ownsInsightReasoning: false as const,
  inventsKpiEngine: false as const,
  inventsKoiEngine: false as const,
  introducesGenericChatbot: false as const,
  importsPrivateUpstreamImplementation: false as const,
  uiSafe: true as const,
});

// ─── Context & view models ──────────────────────────────────────────────────

export type NexoraMVPIntelligenceAttention =
  | "normal"
  | "elevated"
  | "important"
  | "critical";

export type NexoraMVPIntelligenceActionKind =
  | "select-subject"
  | "change-workspace"
  | "change-presentation"
  | "open-panel";

export type NexoraMVPIntelligenceAction = {
  readonly id: string;
  readonly label: string;
  readonly kind: NexoraMVPIntelligenceActionKind;
  readonly available: boolean;
  readonly disabledReason?: string;
  readonly targetSubjectId?: string;
  readonly workspace?: NexoraMVPWorkspaceKind;
  readonly presentationState?: NexoraMVPPresentationState;
  readonly panelKind?: "decision" | "scenario" | "object" | "data";
};

export type NexoraMVPExecutiveIntelligenceContext = {
  readonly contextKey: string;
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
  readonly interactionMode: NexoraMVPInteractionMode;
  readonly selectedSubject: NexoraMVPInteractionSubject | null;
  readonly focusedSubject: NexoraMVPInteractionSubject | null;
  readonly subjectKind: string | null;
  readonly subjectLabel: string | null;
  readonly attention: NexoraMVPIntelligenceAttention | null;
  readonly status: string | null;
  readonly kpis: readonly NexoraMVPPresentationViewModel["secondaryKpis"][number][];
  readonly primaryKpi: NexoraMVPPresentationViewModel["primaryKpi"];
  readonly koi: NexoraMVPPresentationViewModel["koi"];
  readonly relationships: NexoraMVPPresentationViewModel["relationships"];
  readonly contextSubjects: readonly {
    readonly id: string;
    readonly label: string;
    readonly kind: string;
  }[];
  readonly availableActions: readonly NexoraMVPPresentationAvailableAction[];
  readonly summary: string | null;
  readonly capability: NexoraMVPPresentationViewModel["capability"];
  readonly overviewAttention: readonly {
    readonly id: string;
    readonly label: string;
    readonly attention: NexoraMVPIntelligenceAttention;
    readonly status: string;
  }[];
};

export type NexoraMVPAdvisorViewModel = {
  readonly contextKey: string;
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly subjectKind: string | null;
  readonly title: string;
  readonly contextLine: string;
  readonly recommendation: string | null;
  readonly rationale: string | null;
  readonly nextActions: readonly NexoraMVPIntelligenceAction[];
  readonly warning: string | null;
  readonly observation: string | null;
  readonly priority: string | null;
  readonly emptyReason: string | null;
};

export type NexoraMVPInsightViewModel = {
  readonly contextKey: string;
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly subjectKind: string | null;
  readonly title: string;
  readonly contextLine: string;
  readonly headline: string | null;
  readonly summary: string | null;
  readonly primaryKpi: NexoraMVPPresentationViewModel["primaryKpi"];
  readonly kpis: readonly NexoraMVPPresentationViewModel["secondaryKpis"][number][];
  readonly koi: NexoraMVPPresentationViewModel["koi"];
  readonly drivers: readonly string[];
  readonly risks: readonly string[];
  readonly relationships: NexoraMVPPresentationViewModel["relationships"];
  readonly changes: readonly string[];
  readonly attention: NexoraMVPIntelligenceAttention | null;
  readonly emptyReason: string | null;
};

export type NexoraMVPIntelligenceResolution = {
  readonly contextKey: string;
  readonly advisor: NexoraMVPAdvisorViewModel;
  readonly insight: NexoraMVPInsightViewModel;
};

const ATTENTION_RANK: Record<NexoraMVPIntelligenceAttention, number> = {
  critical: 4,
  important: 3,
  elevated: 2,
  normal: 1,
};

function attentionOf(
  value: string | undefined | null,
): NexoraMVPIntelligenceAttention | null {
  if (
    value === "normal" ||
    value === "elevated" ||
    value === "important" ||
    value === "critical"
  ) {
    return value;
  }
  return null;
}

function subjectFixture(
  subjectId: string | null,
): NexoraMVPStageObjectFixture | NexoraMVPContextSubjectFixture | null {
  if (subjectId == null) return null;
  return (
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((entry) => entry.id === subjectId) ??
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((entry) => entry.id === subjectId) ??
    null
  );
}

export function buildNexoraMVPIntelligenceContextKey(input: {
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly focusedSubjectId: string | null;
  readonly selectedSubjectId: string | null;
  readonly dataVersion?: string;
}): string {
  return [
    input.workspace,
    input.presentationState,
    input.focusedSubjectId ?? "none",
    input.selectedSubjectId ?? "none",
    input.dataVersion ?? "mvp-1",
  ].join("|");
}

function overviewAttentionItems(): NexoraMVPExecutiveIntelligenceContext["overviewAttention"] {
  return Object.freeze(
    [...NEXORA_MVP_STAGE_OBJECT_FIXTURES]
      .sort(
        (a, b) =>
          ATTENTION_RANK[b.attention] - ATTENTION_RANK[a.attention] ||
          a.id.localeCompare(b.id),
      )
      .slice(0, 3)
      .map((entry) =>
        Object.freeze({
          id: entry.id,
          label: entry.label,
          attention: entry.attention,
          status: entry.status,
        }),
      ),
  );
}

/**
 * Derive executive intelligence context from canonical MVP bridges.
 */
export function deriveNexoraMVPExecutiveIntelligenceContext(input: {
  readonly advisorBridge: NexoraMVPAdvisorContextBridge;
  readonly presentationViewModel: NexoraMVPPresentationViewModel;
  readonly focusedSubject: NexoraMVPInteractionSubject | null;
  readonly selectedSubject: NexoraMVPInteractionSubject | null;
  readonly breadcrumb: readonly NexoraMVPInteractionSubject[];
}): NexoraMVPExecutiveIntelligenceContext {
  const focused =
    input.focusedSubject ??
    input.selectedSubject ??
    (input.breadcrumb.length > 1
      ? input.breadcrumb[input.breadcrumb.length - 1]!
      : null);
  const fixture = subjectFixture(focused?.id ?? null);
  const attention =
    attentionOf(fixture && "attention" in fixture ? fixture.attention : null) ??
    null;

  const mappedSubjects: {
    readonly id: string;
    readonly label: string;
    readonly kind: string;
  }[] = [];
  for (const id of input.advisorBridge.contextSubjectIds) {
    const entry = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find(
      (item) => item.id === id,
    );
    if (!entry) continue;
    mappedSubjects.push(
      Object.freeze({
        id: entry.id,
        label: entry.label,
        kind: entry.kind,
      }),
    );
  }
  const contextSubjects = Object.freeze(mappedSubjects);

  const contextKey = buildNexoraMVPIntelligenceContextKey({
    workspace: input.advisorBridge.activeWorkspace,
    presentationState: input.advisorBridge.presentationState,
    focusedSubjectId: focused?.id ?? null,
    selectedSubjectId: input.selectedSubject?.id ?? null,
  });

  return Object.freeze({
    contextKey,
    workspace: input.advisorBridge.activeWorkspace,
    presentationState: input.advisorBridge.presentationState,
    environmentIntent: input.advisorBridge.environmentIntent,
    interactionMode: input.advisorBridge.interactionMode,
    selectedSubject: input.selectedSubject,
    focusedSubject: focused,
    subjectKind: focused?.kind ?? null,
    subjectLabel: focused?.label ?? null,
    attention,
    status: input.presentationViewModel.essentialStatus,
    kpis: input.presentationViewModel.secondaryKpis,
    primaryKpi: input.presentationViewModel.primaryKpi,
    koi: input.presentationViewModel.koi,
    relationships: input.presentationViewModel.relationships,
    contextSubjects,
    availableActions: input.presentationViewModel.availableActions,
    summary: input.presentationViewModel.summary,
    capability: input.presentationViewModel.capability,
    overviewAttention: overviewAttentionItems(),
  });
}

function contextLine(context: NexoraMVPExecutiveIntelligenceContext): string {
  const subject = context.subjectLabel ?? "Overview";
  return `${context.workspace} · ${subject} · ${context.presentationState}`;
}

function workspaceLens(workspace: NexoraMVPWorkspaceKind): string {
  switch (workspace) {
    case "problem":
      return "investigation";
    case "scenario":
      return "alternatives";
    case "decision":
      return "commitment";
    case "execution":
      return "delivery";
    default:
      return "orientation";
  }
}

function mapPresentationActions(
  context: NexoraMVPExecutiveIntelligenceContext,
): readonly NexoraMVPIntelligenceAction[] {
  return Object.freeze(
    context.availableActions
      .filter((action) => action.available)
      .slice(0, 3)
      .map((action) =>
        Object.freeze({
          id: action.id,
          label: action.label,
          kind:
            action.kind === "open-panel"
              ? ("open-panel" as const)
              : ("select-subject" as const),
          available: action.available,
          disabledReason: action.disabledReason,
          targetSubjectId: action.targetSubjectId,
          panelKind: action.panelKind,
        }),
      ),
  );
}

function buildWorkspaceAction(
  context: NexoraMVPExecutiveIntelligenceContext,
): NexoraMVPIntelligenceAction | null {
  if (context.focusedSubject == null) return null;
  if (context.workspace === "overview") {
    return Object.freeze({
      id: "intel-open-problem",
      label: "Investigate in Problem",
      kind: "change-workspace",
      available: true,
      workspace: "problem",
    });
  }
  if (context.workspace === "problem") {
    return Object.freeze({
      id: "intel-open-scenario",
      label: "Explore Scenario",
      kind: "change-workspace",
      available: true,
      workspace: "scenario",
    });
  }
  if (context.workspace === "scenario") {
    return Object.freeze({
      id: "intel-open-decision",
      label: "Review in Decision",
      kind: "change-workspace",
      available: true,
      workspace: "decision",
    });
  }
  return null;
}

function buildPresentationAction(
  context: NexoraMVPExecutiveIntelligenceContext,
): NexoraMVPIntelligenceAction | null {
  if (context.focusedSubject == null) return null;
  if (context.presentationState === "minimum" && context.capability.report) {
    return Object.freeze({
      id: "intel-open-report",
      label: "Open Report",
      kind: "change-presentation",
      available: true,
      presentationState: "report",
    });
  }
  if (
    context.presentationState === "report" &&
    context.capability.operation
  ) {
    return Object.freeze({
      id: "intel-open-operation",
      label: "Move to Operation",
      kind: "change-presentation",
      available: true,
      presentationState: "operation",
    });
  }
  return null;
}

function deriveDrivers(
  context: NexoraMVPExecutiveIntelligenceContext,
): readonly string[] {
  const drivers: string[] = [];
  for (const relation of context.relationships.slice(0, 3)) {
    drivers.push(`${relation.relation} ${relation.label}`);
  }
  for (const subject of context.contextSubjects.slice(0, 2)) {
    if (context.workspace === "scenario" && subject.kind === "scenario") {
      drivers.unshift(`Scenario context: ${subject.label}`);
    } else if (context.workspace === "problem" && subject.kind === "problem") {
      drivers.unshift(`Problem context: ${subject.label}`);
    } else if (context.workspace === "decision" && subject.kind === "decision") {
      drivers.unshift(`Decision context: ${subject.label}`);
    } else if (
      context.workspace === "execution" &&
      subject.kind === "execution"
    ) {
      drivers.unshift(`Execution context: ${subject.label}`);
    }
  }
  return Object.freeze([...new Set(drivers)].slice(0, 4));
}

function deriveRisks(
  context: NexoraMVPExecutiveIntelligenceContext,
): readonly string[] {
  const risks: string[] = [];
  if (context.attention === "critical" || context.attention === "important") {
    risks.push(
      `${context.subjectLabel ?? "Subject"} carries ${context.attention} attention.`,
    );
  }
  if (context.status === "risk" || context.status === "Watch") {
    risks.push(`${context.subjectLabel ?? "Subject"} is under watch.`);
  }
  if (
    context.primaryKpi?.status === "risk" ||
    context.primaryKpi?.status === "watch"
  ) {
    risks.push(
      `${context.primaryKpi.label} signal is ${context.primaryKpi.status}.`,
    );
  }
  return Object.freeze(risks.slice(0, 3));
}

function deriveRecommendation(
  context: NexoraMVPExecutiveIntelligenceContext,
): {
  readonly recommendation: string | null;
  readonly rationale: string | null;
  readonly warning: string | null;
  readonly observation: string | null;
  readonly priority: string | null;
  readonly nextActions: readonly NexoraMVPIntelligenceAction[];
  readonly emptyReason: string | null;
} {
  const mapped = mapPresentationActions(context);
  const workspaceAction = buildWorkspaceAction(context);
  const presentationAction = buildPresentationAction(context);
  const nextActions = Object.freeze(
    [
      ...mapped,
      ...(presentationAction ? [presentationAction] : []),
      ...(workspaceAction ? [workspaceAction] : []),
    ].slice(0, 3),
  );

  if (context.focusedSubject == null) {
    const top = context.overviewAttention[0];
    if (!top) {
      return {
        recommendation: null,
        rationale: null,
        warning: null,
        observation: "Executive Stage is ready for exploration.",
        priority: null,
        nextActions: Object.freeze([]),
        emptyReason: "No recommendation available for the current context.",
      };
    }
    return {
      recommendation: `Inspect ${top.label}`,
      rationale: `${top.label} currently carries ${top.attention} attention in ${context.workspace}.`,
      warning:
        top.attention === "critical"
          ? "Critical attention is active in the Stage overview."
          : null,
      observation: `${top.label} is the highest-attention object in view.`,
      priority: top.attention,
      nextActions: Object.freeze([
        Object.freeze({
          id: `intel-focus-${top.id}`,
          label: `Focus ${top.label}`,
          kind: "select-subject" as const,
          available: true,
          targetSubjectId: top.id,
        }),
      ]),
      emptyReason: null,
    };
  }

  const label = context.subjectLabel ?? "Subject";
  const lens = workspaceLens(context.workspace);

  if (context.presentationState === "minimum") {
    return {
      recommendation: nextActions[0]?.label ?? `Review ${label}`,
      rationale: `${label} is in focus for ${lens}. Keep scanning until Report is needed.`,
      warning:
        context.attention === "critical"
          ? `${label} requires elevated attention.`
          : null,
      observation:
        context.primaryKpi != null
          ? `${context.primaryKpi.label}: ${context.primaryKpi.value}`
          : `${label} · ${context.status ?? "stable"}`,
      priority: context.attention,
      nextActions: Object.freeze(nextActions.slice(0, 2)),
      emptyReason: null,
    };
  }

  if (context.presentationState === "report") {
    return {
      recommendation:
        nextActions[0]?.label ??
        (context.capability.operation
          ? "Move to Operation"
          : `Continue reviewing ${label}`),
      rationale:
        context.summary ??
        `${label} is the current ${context.subjectKind ?? "subject"} under ${lens}.`,
      warning: deriveRisks(context)[0] ?? null,
      observation: null,
      priority: context.attention,
      nextActions,
      emptyReason: null,
    };
  }

  // operation
  const available = nextActions.filter((action) => action.available);
  if (available.length === 0) {
    return {
      recommendation: null,
      rationale: `${label} is focused, but no executable actions are bound for this MVP context.`,
      warning: null,
      observation: null,
      priority: context.attention,
      nextActions: Object.freeze([]),
      emptyReason: "No recommendation available for the current context.",
    };
  }

  return {
    recommendation: available[0]!.label,
    rationale:
      context.summary ??
      `${label} is ready for ${lens}-oriented action in Operation.`,
    warning: deriveRisks(context)[0] ?? null,
    observation: null,
    priority: context.attention,
    nextActions: available,
    emptyReason: null,
  };
}

export function mapNexoraMVPAdvisorViewModel(
  context: NexoraMVPExecutiveIntelligenceContext,
): NexoraMVPAdvisorViewModel {
  const derived = deriveRecommendation(context);
  const title =
    context.focusedSubject == null
      ? "Advisor · Overview"
      : `Advisor · ${context.subjectLabel}`;

  return Object.freeze({
    contextKey: context.contextKey,
    subjectId: context.focusedSubject?.id ?? null,
    subjectLabel: context.subjectLabel,
    subjectKind: context.subjectKind,
    title,
    contextLine: contextLine(context),
    recommendation: derived.recommendation,
    rationale: derived.rationale,
    nextActions: derived.nextActions,
    warning: derived.warning,
    observation: derived.observation,
    priority: derived.priority,
    emptyReason: derived.emptyReason,
  });
}

export function mapNexoraMVPInsightViewModel(
  context: NexoraMVPExecutiveIntelligenceContext,
): NexoraMVPInsightViewModel {
  const line = contextLine(context);

  if (context.focusedSubject == null) {
    const top = context.overviewAttention[0];
    return Object.freeze({
      contextKey: context.contextKey,
      subjectId: null,
      subjectLabel: null,
      subjectKind: null,
      title: "Insight · Overview",
      contextLine: line,
      headline: top
        ? `${top.label} requires attention`
        : "Executive Stage overview",
      summary: top
        ? `${top.label} is ${top.status} with ${top.attention} attention in ${context.workspace}.`
        : "No additional insight is available for the current context.",
      primaryKpi: null,
      kpis: Object.freeze([]),
      koi: null,
      drivers: Object.freeze(
        context.overviewAttention.map(
          (entry) => `${entry.label} · ${entry.attention}`,
        ),
      ),
      risks: Object.freeze(
        context.overviewAttention
          .filter(
            (entry) =>
              entry.attention === "critical" || entry.attention === "important",
          )
          .map((entry) => `${entry.label} is ${entry.attention}.`),
      ),
      relationships: Object.freeze([]),
      changes: Object.freeze([]),
      attention: top?.attention ?? null,
      emptyReason: top
        ? null
        : "No additional insight is available for the current context.",
    });
  }

  const showDetail = context.presentationState !== "minimum";
  const drivers = showDetail ? deriveDrivers(context) : Object.freeze([]);
  const risks = showDetail ? deriveRisks(context) : Object.freeze([]);
  const headline =
    context.primaryKpi != null
      ? `${context.subjectLabel}: ${context.primaryKpi.label} ${context.primaryKpi.value}`
      : `${context.subjectLabel} · ${context.status ?? context.subjectKind}`;

  const summary =
    context.presentationState === "minimum"
      ? context.primaryKpi != null
        ? `${context.primaryKpi.label} is ${context.primaryKpi.value}${
            context.primaryKpi.delta ? ` (${context.primaryKpi.delta})` : ""
          }.`
        : `${context.subjectLabel} is currently ${context.status ?? "stable"}.`
      : context.summary;

  return Object.freeze({
    contextKey: context.contextKey,
    subjectId: context.focusedSubject.id,
    subjectLabel: context.subjectLabel,
    subjectKind: context.subjectKind,
    title: `Insight · ${context.subjectLabel}`,
    contextLine: line,
    headline,
    summary: summary ?? null,
    primaryKpi: showDetail || context.presentationState === "minimum"
      ? context.primaryKpi
      : context.primaryKpi,
    kpis: showDetail ? context.kpis : Object.freeze([]),
    koi: showDetail ? context.koi : null,
    drivers,
    risks,
    relationships: showDetail ? context.relationships : Object.freeze([]),
    changes: Object.freeze([]),
    attention: context.attention,
    emptyReason:
      summary == null &&
      context.primaryKpi == null &&
      drivers.length === 0
        ? "No additional insight is available for the current context."
        : null,
  });
}

/**
 * Resolve Advisor + Insight presentation for a context key (synchronous).
 */
export function resolveNexoraMVPExecutiveIntelligence(
  context: NexoraMVPExecutiveIntelligenceContext,
): NexoraMVPIntelligenceResolution {
  return Object.freeze({
    contextKey: context.contextKey,
    advisor: mapNexoraMVPAdvisorViewModel(context),
    insight: mapNexoraMVPInsightViewModel(context),
  });
}

/**
 * Stale-result protection: ignore resolution that no longer matches current key.
 */
export function applyNexoraMVPIntelligenceResolution(input: {
  readonly currentContextKey: string;
  readonly resolution: NexoraMVPIntelligenceResolution;
}): NexoraMVPIntelligenceResolution | null {
  if (input.resolution.contextKey !== input.currentContextKey) {
    return null;
  }
  return input.resolution;
}

export function verifyNexoraMVPAdvisorInsightExperience(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly determinismValid: boolean;
  readonly noFabricationValid: boolean;
}> {
  const identity = getNexoraMVPAdvisorInsightExperienceIdentity();
  const identityValid =
    identity.id === "NEX-MVP:7/NexoraAdvisorInsightExperience" &&
    identity.version === "1.7.0" &&
    identity.namespace === "nexora.mvp.advisor-insight-experience";

  const boundaryValid =
    NEXORA_MVP_INTELLIGENCE_BOUNDARY.ownsAdvisorReasoning === false &&
    NEXORA_MVP_INTELLIGENCE_BOUNDARY.introducesGenericChatbot === false &&
    NEXORA_MVP_INTELLIGENCE_BOUNDARY.importsPrivateUpstreamImplementation ===
      false;

  const bridge: NexoraMVPAdvisorContextBridge = Object.freeze({
    selectedSubject: Object.freeze({ id: "obj-capacity", kind: "object" }),
    focusedSubject: Object.freeze({ id: "obj-capacity", kind: "object" }),
    primaryStageSubjectId: "obj-capacity",
    advisorSubjectId: "obj-capacity",
    subjectKind: "object",
    relatedSubjectIds: Object.freeze(["obj-capacity", "obj-delivery"]),
    contextSubjectIds: Object.freeze(["ctx-problem-capacity"]),
    activeWorkspace: "problem",
    presentationState: "report",
    environmentIntent: "investigate",
    interactionMode: "object-focused",
    breadcrumb: Object.freeze([
      Object.freeze({ id: "trail-overview", kind: "object", label: "Overview" }),
      Object.freeze({ id: "obj-capacity", kind: "object", label: "Capacity" }),
    ]),
  });

  const presentationViewModel = Object.freeze({
    state: "report" as const,
    subjectId: "obj-capacity",
    subjectKind: "object",
    subjectLabel: "Capacity",
    essentialStatus: "Watch",
    showEssentialStatus: true,
    showKPIs: true,
    showKOI: false,
    showRelationships: true,
    showExecutiveSummary: true,
    showActions: false,
    showReportSurface: true,
    showOperationSurface: false,
    primaryKpi: Object.freeze({
      id: "kpi-capacity",
      label: "Utilization",
      value: "88%",
      target: "80%",
      delta: "+12%",
      trend: "up" as const,
      status: "risk" as const,
    }),
    secondaryKpis: Object.freeze([]),
    koi: null,
    summary:
      "Capacity is 12% above the intended target band and is currently constraining delivery.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-cap-delivery",
        label: "Delivery",
        relation: "blocks",
      }),
    ]),
    availableActions: Object.freeze([]),
    capability: Object.freeze({
      minimum: true as const,
      report: true,
      operation: true,
    }),
    workspace: "problem" as const,
    environmentIntent: "investigate" as const,
  });

  const context = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge: bridge,
    presentationViewModel,
    focusedSubject: Object.freeze({
      id: "obj-capacity",
      kind: "object",
      label: "Capacity",
    }),
    selectedSubject: Object.freeze({
      id: "obj-capacity",
      kind: "object",
      label: "Capacity",
    }),
    breadcrumb: bridge.breadcrumb,
  });

  const a = resolveNexoraMVPExecutiveIntelligence(context);
  const b = resolveNexoraMVPExecutiveIntelligence(context);
  const determinismValid = JSON.stringify(a) === JSON.stringify(b);

  const stale = applyNexoraMVPIntelligenceResolution({
    currentContextKey: "different",
    resolution: a,
  });
  const noFabricationValid =
    a.insight.koi == null &&
    a.insight.primaryKpi?.value === "88%" &&
    stale == null;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    determinismValid &&
    noFabricationValid;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    determinismValid,
    noFabricationValid,
  });
}
