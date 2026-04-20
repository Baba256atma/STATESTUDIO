import { z } from "zod";

const NullableString = z.string().nullable().optional().default(null);

export const AdviceActionSchema = z
  .object({
    action: NullableString,
    impact_summary: NullableString,
    tradeoff: NullableString,
  })
  .passthrough();

export const AdvicePanelDataSchema = z
  .object({
    title: NullableString,
    summary: NullableString,
    why: NullableString,
    recommendation: NullableString,
    risk_summary: NullableString,
    recommendations: z.array(z.string()).default([]),
    related_object_ids: z.array(z.string()).default([]),
    supporting_driver_labels: z.array(z.string()).default([]),
    recommended_actions: z.array(AdviceActionSchema).default([]),
    primary_recommendation: z
      .object({
        action: NullableString,
      })
      .passthrough()
      .nullable()
      .optional()
      .default(null),
    confidence: z
      .object({
        level: z.number().optional(),
        score: z.number().optional(),
      })
      .passthrough()
      .nullable()
      .optional()
      .default(null),
  })
  .passthrough();

export const RiskEdgeSchema = z
  .object({
    from: NullableString,
    to: NullableString,
    weight: z.number().optional(),
  })
  .passthrough();

export const RiskPanelDataSchema = z
  .object({
    summary: NullableString,
    level: NullableString,
    risk_level: NullableString,
    headline: NullableString,
    drivers: z.array(z.unknown()).default([]),
    sources: z.array(z.string()).default([]),
    edges: z.array(RiskEdgeSchema).default([]),
  })
  .passthrough();

export const FragilityPanelDataSchema = z
  .object({
    summary: NullableString,
    level: NullableString,
    risk_level: NullableString,
    headline: NullableString,
    drivers: z.array(z.unknown()).default([]),
    sources: z.array(z.string()).default([]),
    edges: z.array(RiskEdgeSchema).default([]),
  })
  .passthrough();

export const ConflictPanelDataSchema = z
  .object({
    summary: NullableString,
    level: NullableString,
    headline: NullableString,
    posture: NullableString,
    drivers: z.array(z.unknown()).default([]),
    sources: z.array(z.string()).default([]),
    edges: z.array(RiskEdgeSchema).default([]),
  })
  .passthrough();

export const ComparePanelDataSchema = z
  .object({
    options: z.array(z.unknown()).default([]),
    recommendation: NullableString,
    summary: NullableString,
  })
  .passthrough();

export const TimelinePanelDataSchema = z
  .object({
    headline: NullableString,
    events: z
      .array(
        z
          .object({
            id: z.string().catch("timeline_event"),
            label: z.string().catch("Timeline event"),
            type: z.string().catch("signal"),
            order: z.number().catch(0),
            confidence: z.number().optional(),
            related_object_ids: z.array(z.string()).default([]),
          })
          .passthrough()
      )
      .default([]),
    related_object_ids: z.array(z.string()).default([]),
    steps: z.array(z.unknown()).default([]),
    stages: z.array(z.unknown()).default([]),
    timeline: z.array(z.unknown()).default([]),
    summary: NullableString,
  })
  .passthrough();

export const DashboardPanelDataSchema = z
  .object({
    summary: NullableString,
    happened: NullableString,
    why_it_matters: NullableString,
    what_to_do: NullableString,
  })
  .passthrough();

export const MemoryPanelDataSchema = z
  .object({
    entries: z.array(z.unknown()).default([]),
    summary: NullableString,
  })
  .passthrough();

export const ReplayPanelDataSchema = z
  .object({
    summary: NullableString,
  })
  .passthrough();

export const GovernancePanelDataSchema = z
  .object({
    summary: NullableString,
    happened: NullableString,
    why_it_matters: NullableString,
    what_to_do: NullableString,
  })
  .passthrough();

export const ApprovalPanelDataSchema = z
  .object({
    summary: NullableString,
    status: NullableString,
  })
  .passthrough();

export const PolicyPanelDataSchema = z
  .object({
    summary: NullableString,
    status: NullableString,
  })
  .passthrough();

export const CouncilPanelDataSchema = z
  .object({
    summary: NullableString,
    recommendation: NullableString,
  })
  .passthrough();

export const StrategicLearningPanelDataSchema = z
  .object({
    summary: NullableString,
  })
  .passthrough();

export const OrgMemoryPanelDataSchema = z
  .object({
    summary: NullableString,
    entries: z.array(z.unknown()).default([]),
  })
  .passthrough();

export const StrategicCommandPanelDataSchema = z
  .object({
    summary: NullableString,
    happened: NullableString,
    why_it_matters: NullableString,
    what_to_do: NullableString,
  })
  .passthrough();

export const WarRoomPanelDataSchema = z
  .object({
    headline: NullableString,
    posture: NullableString,
    priorities: z.array(z.string()).default([]),
    risks: z.array(z.string()).default([]),
    related_object_ids: z.array(z.string()).default([]),
    summary: NullableString,
    recommendation: NullableString,
    simulation_summary: NullableString,
    compare_summary: NullableString,
    executive_summary: NullableString,
    advice_summary: NullableString,
  })
  .passthrough();

export const SimulationPropagationSchema = z
  .object({
    source: z.string(),
    target: z.string(),
    weight: z.number().nullable().optional().default(null),
  })
  .passthrough();

export const SimulationPanelDataSchema = z
  .object({
    summary: NullableString,
    recommendation: NullableString,
    impacted_nodes: z.array(z.string()).default([]),
    propagation: z.array(SimulationPropagationSchema).default([]),
    risk_delta: z.number().nullable().optional().default(null),
  })
  .passthrough();

/** B.8/B.9 — HUD-attached decision context for panel meaning (no second derivation). */
export const NexoraB8PanelContextSchema = z
  .object({
    posture: NullableString,
    tradeoff: NullableString,
    nextMove: NullableString,
    objectIds: z.array(z.string()).default([]),
    drivers: z
      .array(
        z.object({
          id: z.string().optional().default(""),
          label: z.string().optional().default(""),
          score: z.number().optional(),
        })
      )
      .default([]),
    fragilityLevel: NullableString,
    summary: NullableString,
  })
  .passthrough();

export type NexoraB8PanelContext = z.infer<typeof NexoraB8PanelContextSchema>;

export const PanelSharedDataSchema = z
  .object({
    raw: z.unknown().nullable().optional().default(null),
    responseData: z.unknown().nullable().optional().default(null),
    sceneJson: z.unknown().nullable().optional().default(null),
    promptFeedback: z.unknown().nullable().optional().default(null),
    decisionCockpit: DashboardPanelDataSchema.nullable().optional().default(null),
    executiveSummary: DashboardPanelDataSchema.nullable().optional().default(null),
    dashboard: DashboardPanelDataSchema.nullable().optional().default(null),
    advice: AdvicePanelDataSchema.nullable().optional().default(null),
    strategicAdvice: AdvicePanelDataSchema.nullable().optional().default(null),
    risk: RiskPanelDataSchema.nullable().optional().default(null),
    fragility: FragilityPanelDataSchema.nullable().optional().default(null),
    conflict: ConflictPanelDataSchema.nullable().optional().default(null),
    compare: ComparePanelDataSchema.nullable().optional().default(null),
    timeline: TimelinePanelDataSchema.nullable().optional().default(null),
    memory: MemoryPanelDataSchema.nullable().optional().default(null),
    replay: ReplayPanelDataSchema.nullable().optional().default(null),
    governance: GovernancePanelDataSchema.nullable().optional().default(null),
    approval: ApprovalPanelDataSchema.nullable().optional().default(null),
    policy: PolicyPanelDataSchema.nullable().optional().default(null),
    strategicCouncil: CouncilPanelDataSchema.nullable().optional().default(null),
    strategicLearning: StrategicLearningPanelDataSchema.nullable().optional().default(null),
    orgMemory: OrgMemoryPanelDataSchema.nullable().optional().default(null),
    strategicCommand: StrategicCommandPanelDataSchema.nullable().optional().default(null),
    simulation: SimulationPanelDataSchema.nullable().optional().default(null),
    canonicalRecommendation: z.unknown().nullable().optional().default(null),
    decisionResult: z.unknown().nullable().optional().default(null),
    warRoom: WarRoomPanelDataSchema.nullable().optional().default(null),
    memoryEntries: z.array(z.unknown()).default([]),
    nexoraB8PanelContext: NexoraB8PanelContextSchema.nullable().optional().default(null),
    /** B.18 — optional audit snapshot for deterministic scenario/compare enrichment. */
    nexoraAuditRecord: z.unknown().nullable().optional().default(null),
    /** B.18 — optional pipeline trust snapshot (confidence tier, HUD lines). */
    nexoraPipelineTrust: z.unknown().nullable().optional().default(null),
    /** B.23 — bias layer (raw + governance + governed pick); replaces standalone adaptive bias field. */
    nexoraBiasLayerContext: z.unknown().nullable().optional().default(null),
    /** B.24 — Adaptive vs Pure (operator mode). */
    nexoraOperatorMode: z.enum(["adaptive", "pure"]).nullable().optional().default(null),
  })
  .passthrough();

export const CanonicalPanelDataSchema = z
  .object({
    advice: AdvicePanelDataSchema.nullable().optional().default(null),
    timeline: TimelinePanelDataSchema.nullable().optional().default(null),
    warRoom: WarRoomPanelDataSchema.nullable().optional().default(null),
  })
  .passthrough();

export type AdviceAction = z.infer<typeof AdviceActionSchema>;
export type AdvicePanelData = z.infer<typeof AdvicePanelDataSchema>;
export type CanonicalAdvicePanelData = z.infer<typeof AdvicePanelDataSchema>;
export type RiskPanelData = z.infer<typeof RiskPanelDataSchema>;
export type FragilityPanelData = z.infer<typeof FragilityPanelDataSchema>;
export type ConflictPanelData = z.infer<typeof ConflictPanelDataSchema>;
export type ComparePanelData = z.infer<typeof ComparePanelDataSchema>;
export type TimelinePanelData = z.infer<typeof TimelinePanelDataSchema>;
export type CanonicalTimelineEvent = z.infer<typeof TimelinePanelDataSchema>["events"][number];
export type CanonicalTimelinePanelData = z.infer<typeof TimelinePanelDataSchema>;
export type DashboardPanelData = z.infer<typeof DashboardPanelDataSchema>;
export type MemoryPanelData = z.infer<typeof MemoryPanelDataSchema>;
export type ReplayPanelData = z.infer<typeof ReplayPanelDataSchema>;
export type GovernancePanelData = z.infer<typeof GovernancePanelDataSchema>;
export type ApprovalPanelData = z.infer<typeof ApprovalPanelDataSchema>;
export type PolicyPanelData = z.infer<typeof PolicyPanelDataSchema>;
export type CouncilPanelData = z.infer<typeof CouncilPanelDataSchema>;
export type StrategicLearningPanelData = z.infer<typeof StrategicLearningPanelDataSchema>;
export type OrgMemoryPanelData = z.infer<typeof OrgMemoryPanelDataSchema>;
export type StrategicCommandPanelData = z.infer<typeof StrategicCommandPanelDataSchema>;
export type WarRoomPanelData = z.infer<typeof WarRoomPanelDataSchema>;
export type SimulationPropagationData = z.infer<typeof SimulationPropagationSchema>;
export type CanonicalWarRoomPanelData = z.infer<typeof WarRoomPanelDataSchema>;
export type SimulationPanelData = z.infer<typeof SimulationPanelDataSchema>;
export type PanelSharedData = z.infer<typeof PanelSharedDataSchema>;
export type CanonicalPanelData = z.infer<typeof CanonicalPanelDataSchema>;

/** Result of contract validation; safe to compute in render (no side effects). */
export type PanelSharedDataValidationResult = {
  data: PanelSharedData;
  contractFailed: boolean;
  /** Stable key for deduping dev-only debug emission after render. */
  contractDebugSignature: string;
  /** Present only when `contractFailed`; used for dev debug events after render. */
  contractFailureDetail: {
    issueCount: number;
    issuePaths: string[];
    rejectedSlices: string[];
  } | null;
};

const NullableDashboardSchema = DashboardPanelDataSchema.nullable().optional().default(null);
const NullableAdviceSchema = AdvicePanelDataSchema.nullable().optional().default(null);
const NullableRiskSchema = RiskPanelDataSchema.nullable().optional().default(null);
const NullableFragilitySchema = FragilityPanelDataSchema.nullable().optional().default(null);
const NullableConflictSchema = ConflictPanelDataSchema.nullable().optional().default(null);
const NullableCompareSchema = ComparePanelDataSchema.nullable().optional().default(null);
const NullableTimelineSchema = TimelinePanelDataSchema.nullable().optional().default(null);
const NullableMemorySchema = MemoryPanelDataSchema.nullable().optional().default(null);
const NullableReplaySchema = ReplayPanelDataSchema.nullable().optional().default(null);
const NullableGovernanceSchema = GovernancePanelDataSchema.nullable().optional().default(null);
const NullableApprovalSchema = ApprovalPanelDataSchema.nullable().optional().default(null);
const NullablePolicySchema = PolicyPanelDataSchema.nullable().optional().default(null);
const NullableCouncilSchema = CouncilPanelDataSchema.nullable().optional().default(null);
const NullableStrategicLearningSchema = StrategicLearningPanelDataSchema.nullable().optional().default(null);
const NullableOrgMemorySchema = OrgMemoryPanelDataSchema.nullable().optional().default(null);
const NullableStrategicCommandSchema = StrategicCommandPanelDataSchema.nullable().optional().default(null);
const NullableSimulationSchema = SimulationPanelDataSchema.nullable().optional().default(null);
const NullableWarRoomSchema = WarRoomPanelDataSchema.nullable().optional().default(null);

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function previewValue(value: unknown): unknown {
  try {
    if (value === null || value === undefined) return value;

    if (typeof value === "string") {
      return value.length > 120 ? `${value.slice(0, 120)}...` : value;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return value;
    }

    if (Array.isArray(value)) {
      return `[Array(${value.length})]`;
    }

    if (typeof value === "object") {
      return Object.keys(value as Record<string, unknown>).slice(0, 10);
    }

    return typeof value;
  } catch {
    return "[unserializable]";
  }
}

function getValueAtPath(obj: Record<string, unknown>, path: (string | number)[]) {
  let current: unknown = obj;

  for (const key of path) {
    if (current && typeof current === "object") {
      current = (current as Record<string | number, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return current;
}

function describeSliceShape(value: unknown) {
  if (Array.isArray(value)) {
    return { present: value.length > 0, shape: "array", size: value.length };
  }
  if (isObject(value)) {
    const size = Object.keys(value).length;
    return { present: size > 0, shape: "object", size };
  }
  return { present: Boolean(value), shape: value == null ? "null" : typeof value, size: 0 };
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function getStringArray(value: unknown, limit = 8): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.map((entry) => getString(entry)).filter((entry): entry is string => Boolean(entry)))
  ).slice(0, limit);
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeAdviceActionRecord(value: unknown): AdviceAction | null {
  if (!isObject(value)) return null;
  const action = getString(value.action);
  const impactSummary = getString(value.impact_summary);
  const tradeoff = getString(value.tradeoff);
  if (!action && !impactSummary && !tradeoff) return null;
  return {
    action,
    impact_summary: impactSummary,
    tradeoff,
  };
}

function normalizeAdviceSlice(value: unknown): AdvicePanelData | null {
  if (!isObject(value)) return null;
  const recommendedActions = Array.isArray(value.recommended_actions)
    ? value.recommended_actions
        .map((entry) => normalizeAdviceActionRecord(entry))
        .filter((entry): entry is AdviceAction => Boolean(entry))
    : [];
  const recommendations = getStringArray(value.recommendations, 6);
  const primaryRecommendationAction =
    getString(isObject(value.primary_recommendation) ? value.primary_recommendation.action : null) ??
    recommendedActions[0]?.action ??
    recommendations[0] ??
    null;
  const normalized = {
    ...value,
    title: getString(value.title),
    summary: getString(value.summary),
    why: getString(value.why),
    recommendation: getString(value.recommendation) ?? primaryRecommendationAction,
    risk_summary: getString(value.risk_summary),
    recommendations,
    related_object_ids: getStringArray(value.related_object_ids, 8),
    supporting_driver_labels: getStringArray(value.supporting_driver_labels, 8),
    recommended_actions: recommendedActions,
    primary_recommendation: primaryRecommendationAction ? { action: primaryRecommendationAction } : null,
    confidence:
      isObject(value.confidence) &&
      (typeof value.confidence.level === "number" || typeof value.confidence.score === "number")
        ? value.confidence
        : null,
  };

  const hasMeaningfulContent = Boolean(
    normalized.summary ||
      normalized.recommendation ||
      normalized.why ||
      normalized.recommendations.length ||
      normalized.recommended_actions.length ||
      normalized.primary_recommendation?.action
  );
  if (!hasMeaningfulContent) return null;
  return AdvicePanelDataSchema.parse(normalized);
}

function hasRenderableAdviceSlice(value: unknown) {
  if (!isObject(value)) return false;
  return Boolean(
    getString(value.summary) ||
      getString(value.recommendation) ||
      getString(value.why) ||
      (Array.isArray(value.recommendations) && value.recommendations.length > 0) ||
      (Array.isArray(value.recommended_actions) && value.recommended_actions.length > 0) ||
      getString(isObject(value.primary_recommendation) ? value.primary_recommendation.action : null)
  );
}

function normalizeRiskEdges(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!isObject(entry)) return null;
      const from = getString(entry.from);
      const to = getString(entry.to);
      const weight = typeof entry.weight === "number" && Number.isFinite(entry.weight) ? entry.weight : undefined;
      if (!from && !to && weight === undefined) return null;
      return { from, to, weight };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function normalizeRiskLikeSlice(
  value: unknown,
  schema: typeof RiskPanelDataSchema | typeof FragilityPanelDataSchema
): RiskPanelData | FragilityPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline),
    level: getString(value.level),
    risk_level: getString(value.risk_level),
    headline: getString(value.headline),
    drivers: Array.isArray(value.drivers) ? value.drivers : [],
    sources: getStringArray(value.sources, 8),
    edges: normalizeRiskEdges(value.edges),
  };
  const hasMeaningfulContent = Boolean(
    normalized.summary ||
      normalized.level ||
      normalized.risk_level ||
      normalized.drivers.length ||
      normalized.sources.length ||
      normalized.edges.length
  );
  if (!hasMeaningfulContent) return null;
  return schema.parse(normalized);
}

function hasRenderableRiskSlice(value: unknown) {
  if (!isObject(value)) return false;
  return Boolean(
    getString(value.summary) ||
      getString(value.level) ||
      getString(value.risk_level) ||
      getString(value.headline) ||
      (Array.isArray(value.drivers) && value.drivers.length > 0) ||
      (Array.isArray(value.sources) && value.sources.length > 0) ||
      (Array.isArray(value.edges) && value.edges.length > 0)
  );
}

function normalizeConflictSlice(value: unknown): ConflictPanelData | null {
  if (Array.isArray(value)) {
    if (!value.length) return null;
    return ConflictPanelDataSchema.parse({
      summary: null,
      level: null,
      drivers: value,
      sources: [],
      edges: [],
      headline: null,
      posture: null,
    });
  }
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline) ?? getString(value.posture),
    level: getString(value.level) ?? getString(value.risk_level),
    drivers: Array.isArray(value.drivers) ? value.drivers : [],
    sources: getStringArray(value.sources, 8),
    edges: normalizeRiskEdges(value.edges),
    headline: getString(value.headline),
    posture: getString(value.posture),
  };
  const hasMeaningfulContent = Boolean(
    normalized.summary ||
      normalized.level ||
      normalized.drivers.length ||
      normalized.sources.length ||
      normalized.edges.length ||
      normalized.headline ||
      normalized.posture
  );
  if (!hasMeaningfulContent) return null;
  return ConflictPanelDataSchema.parse(normalized);
}

function hasRenderableConflictSlice(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (!isObject(value)) return false;
  return Boolean(
    getString(value.summary) ||
      getString(value.headline) ||
      getString(value.posture) ||
      getString(value.level) ||
      (Array.isArray(value.drivers) && value.drivers.length > 0) ||
      (Array.isArray(value.sources) && value.sources.length > 0) ||
      (Array.isArray(value.edges) && value.edges.length > 0)
  );
}

function normalizeTimelineEvents(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry, index) => {
      if (!isObject(entry)) return null;
      const id = getString(entry.id) ?? `timeline_event_${index + 1}`;
      const label = getString(entry.label) ?? getString(entry.title) ?? getString(entry.summary) ?? "Timeline event";
      const type = getString(entry.type) ?? "signal";
      const order = typeof entry.order === "number" && Number.isFinite(entry.order) ? entry.order : index + 1;
      const confidence = typeof entry.confidence === "number" && Number.isFinite(entry.confidence) ? entry.confidence : undefined;
      const relatedObjectIds = getStringArray(entry.related_object_ids, 8);
      return {
        ...entry,
        id,
        label,
        type,
        order,
        confidence,
        related_object_ids: relatedObjectIds,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function normalizeTimelineSlice(value: unknown): TimelinePanelData | null {
  if (!isObject(value)) return null;
  const events = normalizeTimelineEvents(value.events);
  const steps = Array.isArray(value.steps) ? value.steps : [];
  const stages = Array.isArray(value.stages) ? value.stages : [];
  const timeline = Array.isArray(value.timeline) ? value.timeline : [];
  const normalized = {
    ...value,
    headline: getString(value.headline),
    summary: getString(value.summary),
    events,
    related_object_ids: getStringArray(value.related_object_ids, 8),
    steps,
    stages,
    timeline,
  };
  const hasMeaningfulContent = Boolean(
    normalized.headline ||
      normalized.summary ||
      normalized.events.length ||
      normalized.steps.length ||
      normalized.stages.length ||
      normalized.timeline.length
  );
  if (!hasMeaningfulContent) return null;
  return TimelinePanelDataSchema.parse(normalized);
}

function hasRenderableTimelineSlice(value: unknown) {
  if (!isObject(value)) return false;
  return Boolean(
    getString(value.headline) ||
      getString(value.summary) ||
      (Array.isArray(value.events) && value.events.length > 0) ||
      (Array.isArray(value.steps) && value.steps.length > 0) ||
      (Array.isArray(value.stages) && value.stages.length > 0) ||
      (Array.isArray(value.timeline) && value.timeline.length > 0)
  );
}

function normalizeSimulationPropagation(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!isObject(entry)) return null;
      const source = getString(entry.source);
      const target = getString(entry.target);
      const weight =
        typeof entry.weight === "number" && Number.isFinite(entry.weight)
          ? entry.weight
          : typeof entry.weight === "string" && Number.isFinite(Number(entry.weight))
            ? Number(entry.weight)
            : null;
      if (!source && !target && weight === null) return null;
      return {
        ...entry,
        source: source ?? "unknown_source",
        target: target ?? "unknown_target",
        weight,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function normalizeSimulationSlice(value: unknown): SimulationPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary),
    recommendation: getString(value.recommendation) ?? getString(value.action),
    impacted_nodes: getStringArray(value.impacted_nodes, 12),
    propagation: normalizeSimulationPropagation(value.propagation),
    risk_delta:
      typeof value.risk_delta === "number" && Number.isFinite(value.risk_delta)
        ? value.risk_delta
        : null,
  };
  const hasMeaningfulContent = Boolean(
    normalized.summary ||
      normalized.recommendation ||
      normalized.impacted_nodes.length ||
      normalized.propagation.length ||
      normalized.risk_delta !== null
  );
  if (!hasMeaningfulContent) return null;
  return SimulationPanelDataSchema.parse(normalized);
}

function hasRenderableSimulationSlice(value: unknown) {
  if (!isObject(value)) return false;
  return Boolean(
    getString(value.summary) ||
      getString(value.recommendation) ||
      (Array.isArray(value.impacted_nodes) && value.impacted_nodes.length > 0) ||
      (Array.isArray(value.propagation) && value.propagation.length > 0) ||
      value.risk_delta !== null && value.risk_delta !== undefined
  );
}
const panelContractWeakeningSignatures = new Set<string>();
const panelContractSliceNormalizedSignatures = new Set<string>();
const panelContractSalvagedSignatures = new Set<string>();

function tracePanelContractWeakening(
  status: "family_weakened" | "family_preserved" | "salvage_too_thin",
  family: string,
  beforeValue: unknown,
  afterValue: unknown
) {
  if (process.env.NODE_ENV === "production") return;
  const payload = {
    family,
    meaningfulFieldsPresentBeforeSalvage: getRenderableMeaningfulFields(family, beforeValue),
    resultingSalvagedShape: describeSliceShape(afterValue),
    renderable: isRenderableNormalizedSlice(family, afterValue),
  };
  const signature = JSON.stringify({ status, ...payload });
  if (panelContractWeakeningSignatures.has(signature)) return;
  panelContractWeakeningSignatures.add(signature);
  console.warn(`[Nexora][PanelContractWeakening] ${status}`, payload);
}


function normalizeWarRoomSlice(value: unknown): WarRoomPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    headline: getString(value.headline),
    posture: getString(value.posture),
    priorities: getStringArray(value.priorities, 8),
    risks: getStringArray(value.risks, 8),
    related_object_ids: getStringArray(value.related_object_ids, 8),
    summary: getString(value.summary),
    recommendation: getString(value.recommendation),
    simulation_summary: getString(value.simulation_summary),
    compare_summary: getString(value.compare_summary),
    executive_summary: getString(value.executive_summary),
    advice_summary: getString(value.advice_summary),
  };
  const hasMeaningfulContent = Boolean(
    normalized.headline ||
      normalized.posture ||
      normalized.priorities.length ||
      normalized.risks.length ||
      normalized.summary ||
      normalized.recommendation ||
      normalized.simulation_summary ||
      normalized.compare_summary ||
      normalized.executive_summary ||
      normalized.advice_summary
  );
  if (!hasMeaningfulContent) return null;
  return WarRoomPanelDataSchema.parse(normalized);
}

function hasRenderableWarRoomSlice(value: unknown) {
  if (!isObject(value)) return false;
  return Boolean(
    getString(value.headline) ||
      getString(value.posture) ||
      getString(value.summary) ||
      getString(value.recommendation) ||
      getString(value.simulation_summary) ||
      getString(value.compare_summary) ||
      getString(value.executive_summary) ||
      getString(value.advice_summary) ||
      (Array.isArray(value.priorities) && value.priorities.length > 0) ||
      (Array.isArray(value.risks) && value.risks.length > 0)
  );
}

function normalizeDashboardLikeSlice(
  value: unknown,
  schema:
    | typeof DashboardPanelDataSchema
    | typeof GovernancePanelDataSchema
    | typeof StrategicCommandPanelDataSchema
): DashboardPanelData | GovernancePanelData | StrategicCommandPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline) ?? getString(value.executive_summary),
    happened: getString(value.happened) ?? getString(value.what_happened),
    why_it_matters: getString(value.why_it_matters) ?? getString(value.why),
    what_to_do: getString(value.what_to_do) ?? getString(value.recommendation),
  };
  const hasMeaningfulContent = Boolean(
    normalized.summary || normalized.happened || normalized.why_it_matters || normalized.what_to_do
  );
  if (!hasMeaningfulContent) return null;
  return schema.parse(normalized);
}

function normalizeApprovalOrPolicySlice(
  value: unknown,
  schema: typeof ApprovalPanelDataSchema | typeof PolicyPanelDataSchema
): ApprovalPanelData | PolicyPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline),
    status: getString(value.status) ?? getString(value.level) ?? getString(value.posture),
  };
  const hasMeaningfulContent = Boolean(normalized.summary || normalized.status);
  if (!hasMeaningfulContent) return null;
  return schema.parse(normalized);
}

function normalizeCouncilSlice(value: unknown): CouncilPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline) ?? getString(value.executive_summary),
    recommendation: getString(value.recommendation) ?? getString(value.action) ?? getString(value.posture),
  };
  const hasMeaningfulContent = Boolean(normalized.summary || normalized.recommendation);
  if (!hasMeaningfulContent) return null;
  return CouncilPanelDataSchema.parse(normalized);
}

function normalizeStrategicLearningSlice(value: unknown): StrategicLearningPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline) ?? getString(value.recommendation),
  };
  if (!normalized.summary) return null;
  return StrategicLearningPanelDataSchema.parse(normalized);
}

function normalizeOrgMemorySlice(value: unknown): OrgMemoryPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline),
    entries: Array.isArray(value.entries) ? value.entries : Array.isArray(value.items) ? value.items : [],
  };
  const hasMeaningfulContent = Boolean(normalized.summary || normalized.entries.length);
  if (!hasMeaningfulContent) return null;
  return OrgMemoryPanelDataSchema.parse(normalized);
}

function normalizeCompareSlice(value: unknown): ComparePanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    options: Array.isArray(value.options) ? value.options : Array.isArray(value.choices) ? value.choices : [],
    recommendation: getString(value.recommendation) ?? getString(value.best_option),
    summary: getString(value.summary) ?? getString(value.headline),
  };
  const hasMeaningfulContent = Boolean(
    normalized.options.length || normalized.recommendation || normalized.summary
  );
  if (!hasMeaningfulContent) return null;
  return ComparePanelDataSchema.parse(normalized);
}

function normalizeMemorySlice(value: unknown): MemoryPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline),
    entries: Array.isArray(value.entries) ? value.entries : Array.isArray(value.items) ? value.items : [],
  };
  const hasMeaningfulContent = Boolean(normalized.summary || normalized.entries.length);
  if (!hasMeaningfulContent) return null;
  return MemoryPanelDataSchema.parse(normalized);
}

function normalizeReplaySlice(value: unknown): ReplayPanelData | null {
  if (!isObject(value)) return null;
  const normalized = {
    ...value,
    summary: getString(value.summary) ?? getString(value.headline) ?? getString(value.recommendation),
  };
  if (!normalized.summary) return null;
  return ReplayPanelDataSchema.parse(normalized);
}

function pickDashboard(input: Record<string, unknown>) {
  const responseData = isObject(input.responseData) ? input.responseData : null;
  const candidates = [
    input.dashboard,
    input.executiveSummary,
    input.decisionCockpit,
    responseData?.executive_summary,
    responseData?.decision_cockpit,
    responseData?.executive_summary_surface,
    input.decisionResult,
    input.canonicalRecommendation,
  ];

  for (const candidate of candidates) {
    if (isObject(candidate)) return candidate;
  }

  return undefined;
}

function pickAdvice(input: Record<string, unknown>) {
  const responseData = isObject(input.responseData) ? input.responseData : null;
  const promptFeedback = isObject(input.promptFeedback) ? input.promptFeedback : null;
  const candidates = [
    input.strategicAdvice,
    input.advice,
    responseData?.advice,
    responseData?.strategic_advice,
    responseData?.advice_slice,
    responseData?.canonical_recommendation,
    promptFeedback?.advice_feedback,
  ];

  for (const candidate of candidates) {
    if (isObject(candidate)) return candidate;
  }

  return undefined;
}

function pickRisk(input: Record<string, unknown>) {
  const direct = input.risk;
  if (isObject(direct)) return direct;
  return undefined;
}

function pickFragility(input: Record<string, unknown>) {
  const direct = input.fragility;
  if (isObject(direct)) return direct;

  const scanner = input.fragility_scan;
  if (isObject(scanner)) return scanner;

  const sceneJson = isObject(input.sceneJson) ? input.sceneJson : isObject(input.scene_json) ? input.scene_json : null;
  const scene = sceneJson && isObject(sceneJson.scene) ? sceneJson.scene : null;
  if (scene && isObject(scene.fragility)) return scene.fragility;

  const risk = input.risk;
  if (isObject(risk)) return risk;

  return undefined;
}

function pickConflict(input: Record<string, unknown>) {
  if (Array.isArray(input.conflict)) {
    return {
      drivers: input.conflict,
      sources: [],
      edges: [],
      summary: null,
    };
  }

  const direct = input.conflict;
  if (isObject(direct)) return direct;

  const multiAgent = isObject(input.multi_agent_decision) ? input.multi_agent_decision : null;
  if (multiAgent && Array.isArray(multiAgent.conflicts)) {
    return {
      summary: typeof multiAgent.summary === "string" ? multiAgent.summary : null,
      drivers: multiAgent.conflicts,
      sources: [],
      edges: [],
    };
  }

  const promptFeedback = isObject(input.promptFeedback) ? input.promptFeedback : isObject(input.prompt_feedback) ? input.prompt_feedback : null;
  const promptMultiAgent = promptFeedback && isObject(promptFeedback.multi_agent) ? promptFeedback.multi_agent : null;
  if (promptMultiAgent && Array.isArray(promptMultiAgent.conflicts)) {
    return {
      summary: typeof promptMultiAgent.summary === "string" ? promptMultiAgent.summary : null,
      drivers: promptMultiAgent.conflicts,
      sources: [],
      edges: [],
    };
  }

  return undefined;
}

function pickCompare(input: Record<string, unknown>) {
  const direct = input.compare;
  if (isObject(direct)) return direct;
  return undefined;
}

function pickTimeline(input: Record<string, unknown>) {
  const responseData = isObject(input.responseData) ? input.responseData : null;
  const simulation = isObject(input.simulation) ? input.simulation : null;
  const decisionResult = isObject(input.decisionResult) ? input.decisionResult : null;
  const candidates = [
    input.timeline,
    responseData?.timeline,
    responseData?.timeline_slice,
    responseData?.decision_timeline,
    responseData?.timeline_impact,
    simulation?.timeline,
    decisionResult?.timeline,
  ];

  for (const candidate of candidates) {
    if (isObject(candidate)) return candidate;
  }

  return undefined;
}

function pickMemory(input: Record<string, unknown>) {
  const direct = input.memory;
  if (isObject(direct)) return direct;
  if (Array.isArray(input.memoryEntries)) {
    return { entries: input.memoryEntries };
  }
  return undefined;
}

function pickSimulation(input: Record<string, unknown>) {
  const responseData = isObject(input.responseData) ? input.responseData : null;
  const decisionResult = isObject(input.decisionResult) ? input.decisionResult : isObject(input.decision_result) ? input.decision_result : null;
  const candidates = [
    input.simulation,
    input.decision_simulation,
    input.decisionSimulation,
    responseData?.simulation,
    responseData?.decision_simulation,
    responseData?.scenario_simulation,
    decisionResult?.simulation_result,
  ];

  for (const candidate of candidates) {
    if (isObject(candidate)) return candidate;
  }

  return undefined;
}

function pickWarRoom(input: Record<string, unknown>) {
  const responseData = isObject(input.responseData) ? input.responseData : null;
  const candidates = [
    input.warRoom,
    input.war_room,
    input.multi_agent_decision,
    responseData?.war_room,
    responseData?.war_room_slice,
    responseData?.multi_agent_decision,
    input.strategicCouncil,
  ];

  for (const candidate of candidates) {
    if (isObject(candidate)) return candidate;
  }

  return undefined;
}

function getRenderableMeaningfulFields(label: string, value: unknown) {
  if (!isObject(value)) return [];
  const fields: string[] = [];
  const pushIf = (condition: boolean, field: string) => {
    if (condition) fields.push(field);
  };

  switch (label) {
    case "advice":
    case "strategicAdvice":
      pushIf(Boolean(getString(value.summary)), "summary");
      pushIf(Boolean(getString(value.recommendation)), "recommendation");
      pushIf(Boolean(getString(value.why)), "why");
      pushIf(Array.isArray(value.recommendations) && value.recommendations.length > 0, "recommendations");
      pushIf(Array.isArray(value.recommended_actions) && value.recommended_actions.length > 0, "recommended_actions");
      pushIf(Boolean(getString(isObject(value.primary_recommendation) ? value.primary_recommendation.action : null)), "primary_recommendation.action");
      break;
    case "risk":
    case "fragility":
      pushIf(Boolean(getString(value.summary)), "summary");
      pushIf(Boolean(getString(value.level)), "level");
      pushIf(Boolean(getString(value.risk_level)), "risk_level");
      pushIf(Boolean(getString(value.headline)), "headline");
      pushIf(Array.isArray(value.drivers) && value.drivers.length > 0, "drivers");
      pushIf(Array.isArray(value.sources) && value.sources.length > 0, "sources");
      pushIf(Array.isArray(value.edges) && value.edges.length > 0, "edges");
      break;
    case "conflict":
      pushIf(Boolean(getString(value.summary)), "summary");
      pushIf(Boolean(getString(value.headline)), "headline");
      pushIf(Boolean(getString(value.posture)), "posture");
      pushIf(Boolean(getString(value.level)), "level");
      pushIf(Array.isArray(value.drivers) && value.drivers.length > 0, "drivers");
      pushIf(Array.isArray(value.sources) && value.sources.length > 0, "sources");
      pushIf(Array.isArray(value.edges) && value.edges.length > 0, "edges");
      break;
    case "timeline":
      pushIf(Boolean(getString(value.headline)), "headline");
      pushIf(Boolean(getString(value.summary)), "summary");
      pushIf(Array.isArray(value.events) && value.events.length > 0, "events");
      pushIf(Array.isArray(value.steps) && value.steps.length > 0, "steps");
      pushIf(Array.isArray(value.stages) && value.stages.length > 0, "stages");
      pushIf(Array.isArray(value.timeline) && value.timeline.length > 0, "timeline");
      break;
    case "simulation":
      pushIf(Boolean(getString(value.summary)), "summary");
      pushIf(Boolean(getString(value.recommendation)), "recommendation");
      pushIf(Array.isArray(value.impacted_nodes) && value.impacted_nodes.length > 0, "impacted_nodes");
      pushIf(Array.isArray(value.propagation) && value.propagation.length > 0, "propagation");
      pushIf(value.risk_delta !== null && value.risk_delta !== undefined, "risk_delta");
      break;
    case "warRoom":
      pushIf(Boolean(getString(value.headline)), "headline");
      pushIf(Boolean(getString(value.posture)), "posture");
      pushIf(Array.isArray(value.priorities) && value.priorities.length > 0, "priorities");
      pushIf(Array.isArray(value.risks) && value.risks.length > 0, "risks");
      pushIf(Boolean(getString(value.summary)), "summary");
      pushIf(Boolean(getString(value.recommendation)), "recommendation");
      pushIf(Boolean(getString(value.simulation_summary)), "simulation_summary");
      pushIf(Boolean(getString(value.compare_summary)), "compare_summary");
      pushIf(Boolean(getString(value.executive_summary)), "executive_summary");
      pushIf(Boolean(getString(value.advice_summary)), "advice_summary");
      break;
    default:
      Object.entries(value).forEach(([key, entry]) => {
        if (typeof entry === "string" && entry.trim().length > 0) fields.push(key);
        if (Array.isArray(entry) && entry.length > 0) fields.push(key);
      });
      break;
  }

  return fields;
}

function isRenderableNormalizedSlice(label: string, value: unknown) {
  switch (label) {
    case "advice":
    case "strategicAdvice":
      return hasRenderableAdviceSlice(value);
    case "risk":
    case "fragility":
      return hasRenderableRiskSlice(value);
    case "conflict":
      return hasRenderableConflictSlice(value);
    case "timeline":
      return hasRenderableTimelineSlice(value);
    case "simulation":
      return hasRenderableSimulationSlice(value);
    case "warRoom":
      return hasRenderableWarRoomSlice(value);
    default:
      return describeSliceShape(value).present;
  }
}

function normalizePanelSharedDataInput(input: unknown): Record<string, unknown> {
  const source = isObject(input) ? input : {};
  const normalizedDashboard = pickDashboard(source);
  const normalizedAdvice = pickAdvice(source);
  const normalizedRisk = pickRisk(source);
  const normalizedFragility = pickFragility(source);
  const normalizedConflict = pickConflict(source);
  const normalizedCompare = pickCompare(source);
  const normalizedTimeline = pickTimeline(source);
  const normalizedMemory = pickMemory(source);
  const normalizedSimulation = pickSimulation(source);
  const normalizedWarRoom = pickWarRoom(source);

  return {
    ...source,
    dashboard: isObject(source.dashboard) ? source.dashboard : normalizedDashboard,
    executiveSummary: isObject(source.executiveSummary) ? source.executiveSummary : normalizedDashboard,
    decisionCockpit: isObject(source.decisionCockpit) ? source.decisionCockpit : normalizedDashboard,
    advice: isObject(source.advice) ? source.advice : normalizedAdvice,
    strategicAdvice: isObject(source.strategicAdvice) ? source.strategicAdvice : normalizedAdvice,
    risk: isObject(source.risk) ? source.risk : normalizedRisk,
    fragility: isObject(source.fragility) ? source.fragility : normalizedFragility,
    conflict: isObject(source.conflict) || Array.isArray(source.conflict) ? normalizedConflict : normalizedConflict,
    compare: isObject(source.compare) ? source.compare : normalizedCompare,
    timeline: isObject(source.timeline) ? source.timeline : normalizedTimeline,
    memory: isObject(source.memory) ? source.memory : normalizedMemory,
    simulation: isObject(source.simulation) ? source.simulation : normalizedSimulation,
    governance: isObject(source.governance) ? source.governance : source.governance,
    approval: isObject(source.approval) ? source.approval : source.approval,
    policy: isObject(source.policy) ? source.policy : source.policy,
    strategicCouncil: isObject(source.strategicCouncil) ? source.strategicCouncil : source.strategicCouncil,
    strategicLearning: isObject(source.strategicLearning) ? source.strategicLearning : source.strategicLearning,
    orgMemory: isObject(source.orgMemory) ? source.orgMemory : source.orgMemory,
    strategicCommand: isObject(source.strategicCommand) ? source.strategicCommand : source.strategicCommand,
    warRoom: isObject(source.warRoom) ? source.warRoom : normalizedWarRoom,
    memoryEntries: Array.isArray(source.memoryEntries) ? source.memoryEntries : [],
  };
}

function safeParseSlice<T>(
  label: string,
  schema: z.ZodType<T>,
  value: unknown,
  fallback: T,
  issuesBySlice: Map<string, Array<Record<string, unknown>>>
): T {
  const result = schema.safeParse(value);
  if (result.success) return result.data;

  const normalizedValue = (() => {
    switch (label) {
      case "dashboard":
      case "executiveSummary":
      case "decisionCockpit":
        return normalizeDashboardLikeSlice(value, DashboardPanelDataSchema);
      case "advice":
      case "strategicAdvice":
        return normalizeAdviceSlice(value);
      case "risk":
        return normalizeRiskLikeSlice(value, RiskPanelDataSchema);
      case "fragility":
        return normalizeRiskLikeSlice(value, FragilityPanelDataSchema);
      case "conflict":
        return normalizeConflictSlice(value);
      case "compare":
        return normalizeCompareSlice(value);
      case "timeline":
        return normalizeTimelineSlice(value);
      case "memory":
        return normalizeMemorySlice(value);
      case "replay":
        return normalizeReplaySlice(value);
      case "governance":
        return normalizeDashboardLikeSlice(value, GovernancePanelDataSchema);
      case "approval":
        return normalizeApprovalOrPolicySlice(value, ApprovalPanelDataSchema);
      case "policy":
        return normalizeApprovalOrPolicySlice(value, PolicyPanelDataSchema);
      case "strategicCouncil":
        return normalizeCouncilSlice(value);
      case "strategicLearning":
        return normalizeStrategicLearningSlice(value);
      case "orgMemory":
        return normalizeOrgMemorySlice(value);
      case "strategicCommand":
        return normalizeDashboardLikeSlice(value, StrategicCommandPanelDataSchema);
      case "simulation":
        return normalizeSimulationSlice(value);
      case "warRoom":
        return normalizeWarRoomSlice(value);
      default:
        return null;
    }
  })();

  if (normalizedValue !== null) {
    const renderable = isRenderableNormalizedSlice(label, normalizedValue);
    if (process.env.NODE_ENV !== "production") {
      const payload = {
        slice: label,
        meaningfulFields: getRenderableMeaningfulFields(label, normalizedValue),
        salvagedShape: describeSliceShape(normalizedValue),
      };
      const signature = JSON.stringify(payload);
      if (!panelContractSliceNormalizedSignatures.has(signature)) {
        panelContractSliceNormalizedSignatures.add(signature);
        console.warn("[Nexora][PanelContractSliceNormalized]", payload);
      }
    }
    if (!renderable) {
      tracePanelContractWeakening("salvage_too_thin", label, value, normalizedValue);
      return fallback;
    }
    tracePanelContractWeakening("family_preserved", label, value, normalizedValue);
    return normalizedValue as T;
  }

  tracePanelContractWeakening("family_weakened", label, value, fallback);

  issuesBySlice.set(
    label,
    result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      code: issue.code,
      message: issue.message,
      value_preview: previewValue(value),
      meaningful_fields: (() => {
        if (!isObject(value)) return [];
        return Object.entries(value)
          .filter(([, entry]) => {
            if (typeof entry === "string") return entry.trim().length > 0;
            if (Array.isArray(entry)) return entry.length > 0;
            return entry != null;
          })
          .map(([key]) => key)
          .slice(0, 10);
      })(),
    }))
  );
  return fallback;
}

function salvagePanelSharedData(
  normalized: Record<string, unknown>,
  issuesBySlice: Map<string, Array<Record<string, unknown>>>
): PanelSharedData {
  const salvaged = {
    ...normalized,
    dashboard: safeParseSlice("dashboard", NullableDashboardSchema, normalized.dashboard, null, issuesBySlice),
    executiveSummary: safeParseSlice(
      "executiveSummary",
      NullableDashboardSchema,
      normalized.executiveSummary,
      null,
      issuesBySlice
    ),
    decisionCockpit: safeParseSlice(
      "decisionCockpit",
      NullableDashboardSchema,
      normalized.decisionCockpit,
      null,
      issuesBySlice
    ),
    advice: safeParseSlice("advice", NullableAdviceSchema, normalized.advice, null, issuesBySlice),
    strategicAdvice: safeParseSlice(
      "strategicAdvice",
      NullableAdviceSchema,
      normalized.strategicAdvice,
      null,
      issuesBySlice
    ),
    risk: safeParseSlice("risk", NullableRiskSchema, normalized.risk, null, issuesBySlice),
    fragility: safeParseSlice("fragility", NullableFragilitySchema, normalized.fragility, null, issuesBySlice),
    conflict: safeParseSlice("conflict", NullableConflictSchema, normalized.conflict, null, issuesBySlice),
    compare: safeParseSlice("compare", NullableCompareSchema, normalized.compare, null, issuesBySlice),
    timeline: safeParseSlice("timeline", NullableTimelineSchema, normalized.timeline, null, issuesBySlice),
    memory: safeParseSlice("memory", NullableMemorySchema, normalized.memory, null, issuesBySlice),
    replay: safeParseSlice("replay", NullableReplaySchema, normalized.replay, null, issuesBySlice),
    governance: safeParseSlice("governance", NullableGovernanceSchema, normalized.governance, null, issuesBySlice),
    approval: safeParseSlice("approval", NullableApprovalSchema, normalized.approval, null, issuesBySlice),
    policy: safeParseSlice("policy", NullablePolicySchema, normalized.policy, null, issuesBySlice),
    strategicCouncil: safeParseSlice(
      "strategicCouncil",
      NullableCouncilSchema,
      normalized.strategicCouncil,
      null,
      issuesBySlice
    ),
    strategicLearning: safeParseSlice(
      "strategicLearning",
      NullableStrategicLearningSchema,
      normalized.strategicLearning,
      null,
      issuesBySlice
    ),
    orgMemory: safeParseSlice("orgMemory", NullableOrgMemorySchema, normalized.orgMemory, null, issuesBySlice),
    strategicCommand: safeParseSlice(
      "strategicCommand",
      NullableStrategicCommandSchema,
      normalized.strategicCommand,
      null,
      issuesBySlice
    ),
    simulation: safeParseSlice("simulation", NullableSimulationSchema, normalized.simulation, null, issuesBySlice),
    warRoom: safeParseSlice("warRoom", NullableWarRoomSchema, normalized.warRoom, null, issuesBySlice),
    memoryEntries: Array.isArray(normalized.memoryEntries) ? normalized.memoryEntries : [],
    nexoraB8PanelContext: (() => {
      const parsed = NexoraB8PanelContextSchema.nullable().safeParse(normalized.nexoraB8PanelContext ?? null);
      return parsed.success ? parsed.data : null;
    })(),
  };

  return PanelSharedDataSchema.parse(salvaged);
}

export function validatePanelSharedDataWithDiagnostics(input: unknown): PanelSharedDataValidationResult {
  const DEBUG_PANEL_TRACE = process.env.NODE_ENV !== "production";
  const normalized = normalizePanelSharedDataInput(input);
  const result = PanelSharedDataSchema.safeParse(normalized);

  if (!result.success) {
    if (DEBUG_PANEL_TRACE) {
      const detailedIssues = result.error.issues.map((issue) => {
        const value = getValueAtPath(normalized, issue.path);

        return {
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
          expected: (issue as { expected?: unknown }).expected ?? null,
          received: (issue as { received?: unknown }).received ?? typeof value,
          value_preview: previewValue(value),
          value_type: typeof value,
        };
      });

      console.group("[Nexora][PanelContractInvalid]");
      console.log("Normalized Keys:", Object.keys(normalized));
      console.table(detailedIssues);
      console.log("Full Issues:", result.error.issues);
      console.log("Normalized Snapshot:", {
        dashboard: previewValue(normalized.dashboard),
        advice: previewValue(normalized.advice),
        timeline: previewValue(normalized.timeline),
        simulation: previewValue(normalized.simulation),
        conflict: previewValue(normalized.conflict),
        warRoom: previewValue(normalized.warRoom),
      });
      console.groupEnd();
    }
    const issuesBySlice = new Map<string, Array<Record<string, unknown>>>();
    const salvaged = salvagePanelSharedData(normalized, issuesBySlice);
    const issuePaths = result.error.issues.slice(0, 12).map((issue) => issue.path.join(".") || "(root)");
    const rejectedSlices = Array.from(issuesBySlice.keys());
    const contractDebugSignature = `fail:${result.error.issues.length}:${issuePaths.join("|")}:${rejectedSlices.sort().join(",")}`;

    if (DEBUG_PANEL_TRACE) {
      const payload = {
        rejectedSlices: Array.from(issuesBySlice.keys()),
        preservedSlices: {
          dashboard: Boolean(salvaged.dashboard ?? salvaged.executiveSummary ?? salvaged.decisionCockpit),
          executiveSummary: Boolean(salvaged.executiveSummary),
          decisionCockpit: Boolean(salvaged.decisionCockpit),
          advice: Boolean(salvaged.advice ?? salvaged.strategicAdvice),
          timeline: Boolean(salvaged.timeline),
          simulation: Boolean(salvaged.simulation),
          conflict: Boolean(salvaged.conflict),
          warRoom: Boolean(salvaged.warRoom),
        },
        usableShapes: {
          dashboard: describeSliceShape(salvaged.dashboard ?? salvaged.executiveSummary ?? salvaged.decisionCockpit),
          executiveSummary: describeSliceShape(salvaged.executiveSummary),
          decisionCockpit: describeSliceShape(salvaged.decisionCockpit),
          compare: describeSliceShape(salvaged.compare),
          memory: describeSliceShape(salvaged.memory),
          replay: describeSliceShape(salvaged.replay),
          governance: describeSliceShape(salvaged.governance),
          approval: describeSliceShape(salvaged.approval),
          policy: describeSliceShape(salvaged.policy),
          strategicCouncil: describeSliceShape(salvaged.strategicCouncil),
          strategicLearning: describeSliceShape(salvaged.strategicLearning),
          orgMemory: describeSliceShape(salvaged.orgMemory),
          strategicCommand: describeSliceShape(salvaged.strategicCommand),
          advice: describeSliceShape(salvaged.advice ?? salvaged.strategicAdvice),
          risk: describeSliceShape(salvaged.risk),
          fragility: describeSliceShape(salvaged.fragility),
          conflict: describeSliceShape(salvaged.conflict),
          timeline: describeSliceShape(salvaged.timeline),
          simulation: describeSliceShape(salvaged.simulation),
          warRoom: describeSliceShape(salvaged.warRoom),
        },
      };
      const signature = JSON.stringify(payload);
      if (!panelContractSalvagedSignatures.has(signature)) {
        panelContractSalvagedSignatures.add(signature);
        console.warn("[Nexora][PanelContractSalvaged]", payload);
      }
      issuesBySlice.forEach((sliceIssues, slice) => {
        console.warn("[Nexora][PanelContractSliceRejected]", {
          slice,
          issues: sliceIssues,
        });
      });
    }

    return {
      data: salvaged,
      contractFailed: true,
      contractDebugSignature,
      contractFailureDetail: {
        issueCount: result.error.issues.length,
        issuePaths,
        rejectedSlices,
      },
    };
  }

  if (DEBUG_PANEL_TRACE) {
    console.log("[Nexora][Trace][ValidatedPanelData]", {
      dashboard: Boolean(result.data.dashboard ?? result.data.executiveSummary ?? result.data.decisionCockpit),
      advice: Boolean(result.data.advice ?? result.data.strategicAdvice),
      timeline: Boolean(result.data.timeline),
      simulation: Boolean(result.data.simulation),
      risk: Boolean(result.data.risk),
      fragility: Boolean(result.data.fragility),
      conflict: Boolean(result.data.conflict),
      warRoom: Boolean(result.data.warRoom),
    });
    console.log("[Nexora][Trace][ValidatedSlices]", {
      dashboard: describeSliceShape(result.data.dashboard ?? result.data.executiveSummary ?? result.data.decisionCockpit),
      advice: describeSliceShape(result.data.advice),
      strategicAdvice: describeSliceShape(result.data.strategicAdvice),
      timeline: describeSliceShape(result.data.timeline),
      simulation: describeSliceShape(result.data.simulation),
      warRoom: describeSliceShape(result.data.warRoom),
      conflict: describeSliceShape(result.data.conflict),
      risk: describeSliceShape(result.data.risk),
      fragility: describeSliceShape(result.data.fragility),
    });
    console.group("[Nexora][PanelContractValid]");
    console.log("Available slices:", {
        dashboard: Boolean(result.data.dashboard ?? result.data.executiveSummary ?? result.data.decisionCockpit),
        advice: Boolean(result.data.advice ?? result.data.strategicAdvice),
        risk: Boolean(result.data.risk),
        fragility: Boolean(result.data.fragility),
        conflict: Boolean(result.data.conflict),
        compare: Boolean(result.data.compare),
        timeline: Boolean(result.data.timeline),
        memory: Boolean(result.data.memory),
        simulation: Boolean(result.data.simulation),
        warRoom: Boolean(result.data.warRoom),
    });
    console.log("Validated Snapshot:", {
      dashboard: previewValue(result.data.dashboard),
      advice: previewValue(result.data.advice),
      timeline: previewValue(result.data.timeline),
      simulation: previewValue(result.data.simulation),
      conflict: previewValue(result.data.conflict),
      warRoom: previewValue(result.data.warRoom),
    });
    console.groupEnd();
  }

  return {
    data: result.data,
    contractFailed: false,
    contractDebugSignature: "ok",
    contractFailureDetail: null,
  };
}

export function validatePanelSharedData(input: unknown): PanelSharedData {
  return validatePanelSharedDataWithDiagnostics(input).data;
}

export function validatePanelData(input: unknown): PanelSharedData {
  return validatePanelSharedData(input);
}
