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
            id: z.string(),
            label: z.string(),
            type: z.string(),
            order: z.number(),
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
    weight: z.number(),
  })
  .passthrough();

export const SimulationPanelDataSchema = z
  .object({
    summary: NullableString,
    impacted_nodes: z.array(z.string()).default([]),
    propagation: z.array(SimulationPropagationSchema).default([]),
    risk_delta: z.number().nullable().optional().default(null),
  })
  .passthrough();

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
export type CanonicalWarRoomPanelData = z.infer<typeof WarRoomPanelDataSchema>;
export type SimulationPanelData = z.infer<typeof SimulationPanelDataSchema>;
export type PanelSharedData = z.infer<typeof PanelSharedDataSchema>;
export type CanonicalPanelData = z.infer<typeof CanonicalPanelDataSchema>;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function pickDashboard(input: Record<string, unknown>) {
  const direct = input.dashboard;
  if (isObject(direct)) return direct;
  const executiveSummary = input.executiveSummary;
  if (isObject(executiveSummary)) return executiveSummary;
  const decisionCockpit = input.decisionCockpit;
  if (isObject(decisionCockpit)) return decisionCockpit;
  return undefined;
}

function pickAdvice(input: Record<string, unknown>) {
  const direct = input.strategicAdvice;
  if (isObject(direct)) return direct;
  const alias = input.advice;
  if (isObject(alias)) return alias;
  return undefined;
}

function pickRisk(input: Record<string, unknown>) {
  const direct = input.risk;
  if (isObject(direct)) return direct;
  return undefined;
}

function pickCompare(input: Record<string, unknown>) {
  const direct = input.compare;
  if (isObject(direct)) return direct;
  return undefined;
}

function pickTimeline(input: Record<string, unknown>) {
  const direct = input.timeline;
  if (isObject(direct)) return direct;
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
  const direct = input.simulation;
  if (isObject(direct)) return direct;
  const alias = input.decision_simulation;
  if (isObject(alias)) return alias;
  return undefined;
}

function pickWarRoom(input: Record<string, unknown>) {
  const direct = input.warRoom;
  if (isObject(direct)) return direct;
  const alias = input.multi_agent_decision;
  if (isObject(alias)) return alias;
  return undefined;
}

function normalizePanelSharedDataInput(input: unknown): Record<string, unknown> {
  const source = isObject(input) ? input : {};
  return {
    ...source,
    dashboard: pickDashboard(source),
    executiveSummary: pickDashboard(source),
    decisionCockpit: isObject(source.decisionCockpit) ? source.decisionCockpit : undefined,
    advice: pickAdvice(source),
    strategicAdvice: pickAdvice(source),
    risk: pickRisk(source),
    compare: pickCompare(source),
    timeline: pickTimeline(source),
    memory: pickMemory(source),
    simulation: pickSimulation(source),
    governance: isObject(source.governance) ? source.governance : undefined,
    approval: isObject(source.approval) ? source.approval : undefined,
    policy: isObject(source.policy) ? source.policy : undefined,
    strategicCouncil: isObject(source.strategicCouncil) ? source.strategicCouncil : undefined,
    strategicLearning: isObject(source.strategicLearning) ? source.strategicLearning : undefined,
    orgMemory: isObject(source.orgMemory) ? source.orgMemory : undefined,
    strategicCommand: isObject(source.strategicCommand) ? source.strategicCommand : undefined,
    warRoom: pickWarRoom(source),
    memoryEntries: Array.isArray(source.memoryEntries) ? source.memoryEntries : [],
  };
}

export function validatePanelSharedData(input: unknown): PanelSharedData {
  const normalized = normalizePanelSharedDataInput(input);
  const result = PanelSharedDataSchema.safeParse(normalized);

  if (!result.success) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Nexora][PanelContractInvalid]", {
        keys: Object.keys(normalized),
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
        })),
      });
    }
    return PanelSharedDataSchema.parse({});
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][PanelContractValid]", {
      keys: Object.keys(normalized),
      slices: {
        dashboard: Boolean(result.data.dashboard ?? result.data.executiveSummary ?? result.data.decisionCockpit),
        advice: Boolean(result.data.strategicAdvice),
        risk: Boolean(result.data.risk),
        compare: Boolean(result.data.compare),
        timeline: Boolean(result.data.timeline),
        memory: Boolean(result.data.memory),
        simulation: Boolean(result.data.simulation),
        warRoom: Boolean(result.data.warRoom),
      },
    });
  }

  return result.data;
}

export function validatePanelData(input: unknown): PanelSharedData {
  return validatePanelSharedData(input);
}
