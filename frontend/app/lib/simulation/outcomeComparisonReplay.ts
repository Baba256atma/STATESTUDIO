import type {
  KpiStateMap,
  NexoraScenarioOutcome,
  NexoraSimulationKpiImpact,
  NexoraSimulationObjectImpact,
  NexoraSimulationSnapshot,
  ObjectStateMap,
} from "./domainSimulationScenarioEngine";

export type NexoraOutcomeComparisonMode =
  | "baseline_vs_scenario"
  | "scenario_vs_scenario"
  | "snapshot_vs_snapshot";

export type NexoraReplayPlaybackMode =
  | "step"
  | "timeline"
  | "summary";

export interface NexoraKpiDifference {
  id: string;
  label: string;
  leftValue?: number;
  rightValue?: number;
  delta?: number;
  trend?: "up" | "down" | "stable";
  notes?: string[];
}

export interface NexoraObjectDifference {
  objectId: string;
  leftRisk?: number;
  rightRisk?: number;
  riskDelta?: number;
  leftActivity?: number;
  rightActivity?: number;
  activityDelta?: number;
  leftStability?: number;
  rightStability?: number;
  stabilityDelta?: number;
  notes?: string[];
}

export interface NexoraSnapshotDifference {
  stepIndex: number;
  changedObjectIds?: string[];
  changedRelationIds?: string[];
  changedLoopIds?: string[];
  changedKpiIds?: string[];
  notes?: string[];
}

export interface NexoraOutcomeComparisonResult {
  comparisonMode: NexoraOutcomeComparisonMode;
  leftScenarioId?: string | null;
  rightScenarioId?: string | null;
  objectDifferences: NexoraObjectDifference[];
  kpiDifferences: NexoraKpiDifference[];
  snapshotDifferences: NexoraSnapshotDifference[];
  higherRiskSide?: "left" | "right" | "equal";
  summary?: string;
  notes?: string[];
}

export interface NexoraReplayFrame {
  index: number;
  label?: string;
  snapshot: NexoraSimulationSnapshot;
  notes?: string[];
}

export interface NexoraReplayTrack {
  scenarioId?: string | null;
  playbackMode: NexoraReplayPlaybackMode;
  frames: NexoraReplayFrame[];
  summary?: string;
  notes?: string[];
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function sortIds(values: string[]): string[] {
  return uniq(values).sort((a, b) => a.localeCompare(b));
}

function riskRank(value?: "low" | "moderate" | "high" | "critical" | null): number {
  switch (value) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "moderate":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function normalizeSnapshot(snapshot: unknown): NexoraSimulationSnapshot {
  if (snapshot && typeof snapshot === "object" && !Array.isArray(snapshot)) {
    const record = snapshot as Record<string, unknown>;
    return {
      stepIndex: safeNumber(record.stepIndex, 0),
      objectStates:
        record.objectStates && typeof record.objectStates === "object" && !Array.isArray(record.objectStates)
          ? { ...(record.objectStates as NexoraSimulationSnapshot["objectStates"]) }
          : {},
      relationStates:
        record.relationStates && typeof record.relationStates === "object" && !Array.isArray(record.relationStates)
          ? { ...(record.relationStates as NexoraSimulationSnapshot["relationStates"]) }
          : {},
      loopStates:
        record.loopStates && typeof record.loopStates === "object" && !Array.isArray(record.loopStates)
          ? { ...(record.loopStates as NexoraSimulationSnapshot["loopStates"]) }
          : {},
      kpiStates:
        record.kpiStates && typeof record.kpiStates === "object" && !Array.isArray(record.kpiStates)
          ? { ...(record.kpiStates as NexoraSimulationSnapshot["kpiStates"]) }
          : {},
    };
  }
  return {
    stepIndex: 0,
    objectStates: {},
    relationStates: {},
    loopStates: {},
    kpiStates: {},
  };
}

type NormalizedOutcome = {
  scenarioId?: string | null;
  overallRisk?: "low" | "moderate" | "high" | "critical" | null;
  objectImpacts: NexoraSimulationObjectImpact[];
  kpiImpacts: NexoraSimulationKpiImpact[];
  snapshots: NexoraSimulationSnapshot[];
};

function normalizeOutcome(outcome: unknown): NormalizedOutcome {
  const record =
    outcome && typeof outcome === "object" && !Array.isArray(outcome)
      ? (outcome as Record<string, unknown>)
      : {};
  return {
    scenarioId:
      record.scenarioId === null || record.scenarioId === undefined
        ? null
        : String(record.scenarioId).trim(),
    overallRisk: (record.overallRisk as NormalizedOutcome["overallRisk"]) ?? null,
    objectImpacts: Array.isArray(record.objectImpacts)
      ? record.objectImpacts.map((item) => ({ ...(item as NexoraSimulationObjectImpact) }))
      : [],
    kpiImpacts: Array.isArray(record.kpiImpacts)
      ? record.kpiImpacts.map((item) => ({ ...(item as NexoraSimulationKpiImpact) }))
      : [],
    snapshots: Array.isArray(record.snapshots)
      ? record.snapshots.map((snapshot) => normalizeSnapshot(snapshot))
      : [],
  };
}

export function safeNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function diffNumber(left?: number, right?: number): number {
  return Number((safeNumber(right, 0) - safeNumber(left, 0)).toFixed(4));
}

export function inferTrendFromDelta(delta: number): "up" | "down" | "stable" {
  if (delta > 0.02) return "up";
  if (delta < -0.02) return "down";
  return "stable";
}

export function buildKpiDifferences(args: {
  leftKpis?: KpiStateMap | null;
  rightKpis?: KpiStateMap | null;
}): NexoraKpiDifference[] {
  const leftKpis = args.leftKpis ?? {};
  const rightKpis = args.rightKpis ?? {};
  const ids = sortIds([...Object.keys(leftKpis), ...Object.keys(rightKpis)]);

  return ids.map((id) => {
    const left = leftKpis[id] ?? {};
    const right = rightKpis[id] ?? {};
    const leftValue = safeNumber(left.value, 0);
    const rightValue = safeNumber(right.value, 0);
    const delta = diffNumber(leftValue, rightValue);

    return {
      id,
      label: String(right.label ?? left.label ?? id),
      leftValue,
      rightValue,
      delta,
      trend: inferTrendFromDelta(delta),
      notes: delta === 0 ? ["No material KPI difference detected."] : [],
    };
  });
}

export function buildObjectDifferences(args: {
  leftObjects?: ObjectStateMap | null;
  rightObjects?: ObjectStateMap | null;
}): NexoraObjectDifference[] {
  const leftObjects = args.leftObjects ?? {};
  const rightObjects = args.rightObjects ?? {};
  const ids = sortIds([...Object.keys(leftObjects), ...Object.keys(rightObjects)]);

  return ids.map((id) => {
    const left = leftObjects[id] ?? {};
    const right = rightObjects[id] ?? {};
    const riskDelta = diffNumber(safeNumber(left.riskLevel, 0), safeNumber(right.riskLevel, 0));
    const activityDelta = diffNumber(safeNumber(left.activityLevel, 0), safeNumber(right.activityLevel, 0));
    const stabilityDelta = diffNumber(safeNumber(left.stabilityLevel, 0), safeNumber(right.stabilityLevel, 0));
    const notes: string[] = [];

    if (riskDelta !== 0) notes.push("Risk changed.");
    if (activityDelta !== 0) notes.push("Activity changed.");
    if (stabilityDelta !== 0) notes.push("Stability changed.");

    return {
      objectId: id,
      leftRisk: safeNumber(left.riskLevel, 0),
      rightRisk: safeNumber(right.riskLevel, 0),
      riskDelta,
      leftActivity: safeNumber(left.activityLevel, 0),
      rightActivity: safeNumber(right.activityLevel, 0),
      activityDelta,
      leftStability: safeNumber(left.stabilityLevel, 0),
      rightStability: safeNumber(right.stabilityLevel, 0),
      stabilityDelta,
      notes,
    };
  });
}

export function buildSnapshotDifferences(args: {
  leftSnapshots?: NexoraSimulationSnapshot[] | null;
  rightSnapshots?: NexoraSimulationSnapshot[] | null;
}): NexoraSnapshotDifference[] {
  const leftSnapshots = Array.isArray(args.leftSnapshots) ? args.leftSnapshots.map((snapshot) => normalizeSnapshot(snapshot)) : [];
  const rightSnapshots = Array.isArray(args.rightSnapshots) ? args.rightSnapshots.map((snapshot) => normalizeSnapshot(snapshot)) : [];
  const maxLength = Math.max(leftSnapshots.length, rightSnapshots.length);
  const results: NexoraSnapshotDifference[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const left = leftSnapshots[index] ?? normalizeSnapshot(null);
    const right = rightSnapshots[index] ?? normalizeSnapshot(null);

    const changedObjectIds = sortIds([
      ...Object.keys(left.objectStates ?? {}).filter((id) => JSON.stringify(left.objectStates[id]) !== JSON.stringify(right.objectStates?.[id] ?? {})),
      ...Object.keys(right.objectStates ?? {}).filter((id) => JSON.stringify(left.objectStates?.[id] ?? {}) !== JSON.stringify(right.objectStates[id])),
    ]);

    const changedRelationIds = sortIds([
      ...Object.keys(left.relationStates ?? {}).filter((id) => JSON.stringify(left.relationStates[id]) !== JSON.stringify(right.relationStates?.[id] ?? {})),
      ...Object.keys(right.relationStates ?? {}).filter((id) => JSON.stringify(left.relationStates?.[id] ?? {}) !== JSON.stringify(right.relationStates[id])),
    ]);

    const changedLoopIds = sortIds([
      ...Object.keys(left.loopStates ?? {}).filter((id) => JSON.stringify(left.loopStates[id]) !== JSON.stringify(right.loopStates?.[id] ?? {})),
      ...Object.keys(right.loopStates ?? {}).filter((id) => JSON.stringify(left.loopStates?.[id] ?? {}) !== JSON.stringify(right.loopStates[id])),
    ]);

    const changedKpiIds = sortIds([
      ...Object.keys(left.kpiStates ?? {}).filter((id) => JSON.stringify(left.kpiStates[id]) !== JSON.stringify(right.kpiStates?.[id] ?? {})),
      ...Object.keys(right.kpiStates ?? {}).filter((id) => JSON.stringify(left.kpiStates?.[id] ?? {}) !== JSON.stringify(right.kpiStates[id])),
    ]);

    results.push({
      stepIndex: index,
      changedObjectIds,
      changedRelationIds,
      changedLoopIds,
      changedKpiIds,
      notes:
        changedObjectIds.length + changedRelationIds.length + changedLoopIds.length + changedKpiIds.length > 0
          ? ["State changed across aligned snapshots."]
          : ["No aligned snapshot differences detected."],
    });
  }

  return results;
}

export function inferHigherRiskSide(args: {
  leftOverallRisk?: "low" | "moderate" | "high" | "critical" | null;
  rightOverallRisk?: "low" | "moderate" | "high" | "critical" | null;
}): "left" | "right" | "equal" {
  const leftRank = riskRank(args.leftOverallRisk);
  const rightRank = riskRank(args.rightOverallRisk);
  if (leftRank > rightRank) return "left";
  if (rightRank > leftRank) return "right";
  return "equal";
}

export function buildOutcomeComparisonSummary(args: {
  comparisonMode: NexoraOutcomeComparisonMode;
  higherRiskSide?: "left" | "right" | "equal";
  objectDifferences: NexoraObjectDifference[];
  kpiDifferences: NexoraKpiDifference[];
}): string {
  const topObject = [...args.objectDifferences]
    .sort((a, b) => Math.abs(b.riskDelta ?? 0) - Math.abs(a.riskDelta ?? 0))[0];
  const topKpi = [...args.kpiDifferences]
    .sort((a, b) => Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0))[0];

  const riskText =
    args.higherRiskSide === "equal"
      ? "risk remained broadly equivalent across both sides"
      : `${args.higherRiskSide} carried the higher risk profile`;
  const objectText = topObject ? `${topObject.objectId} showed the strongest object-level change` : "object differences stayed limited";
  const kpiText = topKpi ? `${topKpi.label} moved ${topKpi.trend ?? "stable"}` : "KPI movement stayed limited";

  return `${args.comparisonMode} comparison: ${riskText}; ${objectText}; ${kpiText}.`;
}

export function compareScenarioOutcomes(args: {
  leftOutcome: NexoraScenarioOutcome | NormalizedOutcome | unknown;
  rightOutcome: NexoraScenarioOutcome | NormalizedOutcome | unknown;
  comparisonMode?: NexoraOutcomeComparisonMode;
}): NexoraOutcomeComparisonResult {
  const comparisonMode = args.comparisonMode ?? "scenario_vs_scenario";
  const leftOutcome = normalizeOutcome(args.leftOutcome);
  const rightOutcome = normalizeOutcome(args.rightOutcome);

  const leftFinalSnapshot = leftOutcome.snapshots[leftOutcome.snapshots.length - 1] ?? normalizeSnapshot(null);
  const rightFinalSnapshot = rightOutcome.snapshots[rightOutcome.snapshots.length - 1] ?? normalizeSnapshot(null);

  const objectDifferences = buildObjectDifferences({
    leftObjects: leftFinalSnapshot.objectStates,
    rightObjects: rightFinalSnapshot.objectStates,
  });

  const kpiDifferences = buildKpiDifferences({
    leftKpis: leftFinalSnapshot.kpiStates,
    rightKpis: rightFinalSnapshot.kpiStates,
  });

  const snapshotDifferences = buildSnapshotDifferences({
    leftSnapshots: leftOutcome.snapshots,
    rightSnapshots: rightOutcome.snapshots,
  });

  const higherRiskSide = inferHigherRiskSide({
    leftOverallRisk: leftOutcome.overallRisk,
    rightOverallRisk: rightOutcome.overallRisk,
  });

  const summary = buildOutcomeComparisonSummary({
    comparisonMode,
    higherRiskSide,
    objectDifferences,
    kpiDifferences,
  });

  return {
    comparisonMode,
    leftScenarioId: leftOutcome.scenarioId ?? null,
    rightScenarioId: rightOutcome.scenarioId ?? null,
    objectDifferences,
    kpiDifferences,
    snapshotDifferences,
    higherRiskSide,
    summary,
    notes: ["Outcome comparison completed."],
  };
}

export function buildReplayFramesFromOutcome(
  outcome: NexoraScenarioOutcome | NormalizedOutcome | unknown
): NexoraReplayFrame[] {
  const normalized = normalizeOutcome(outcome);
  return normalized.snapshots
    .map((snapshot, index) => ({
      index,
      label: `Step ${safeNumber(snapshot.stepIndex, index)}`,
      snapshot,
      notes: [`Replay frame ${index + 1}.`],
    }))
    .sort((a, b) => a.index - b.index);
}

export function buildReplaySummary(args: {
  frames: NexoraReplayFrame[];
  scenarioId?: string | null;
}): string {
  const scenarioText = args.scenarioId ? ` for ${args.scenarioId}` : "";
  return `Replay track${scenarioText} contains ${args.frames.length} frame(s).`;
}

export function buildReplayTrack(args: {
  outcome: NexoraScenarioOutcome | NormalizedOutcome | unknown;
  playbackMode?: NexoraReplayPlaybackMode;
}): NexoraReplayTrack {
  const normalized = normalizeOutcome(args.outcome);
  const playbackMode = args.playbackMode ?? "timeline";
  const frames = buildReplayFramesFromOutcome(normalized);
  const summary = buildReplaySummary({
    frames,
    scenarioId: normalized.scenarioId ?? null,
  });

  return {
    scenarioId: normalized.scenarioId ?? null,
    playbackMode,
    frames,
    summary,
    notes: ["Replay track built from scenario outcome snapshots."],
  };
}

export function compareBaselineToScenario(args: {
  baselineOutcome: NexoraScenarioOutcome | NormalizedOutcome | unknown;
  scenarioOutcome: NexoraScenarioOutcome | NormalizedOutcome | unknown;
}): NexoraOutcomeComparisonResult {
  return compareScenarioOutcomes({
    leftOutcome: args.baselineOutcome,
    rightOutcome: args.scenarioOutcome,
    comparisonMode: "baseline_vs_scenario",
  });
}

const EXAMPLE_BASELINE_OUTCOME = {
  scenarioId: "baseline",
  overallRisk: "moderate",
  snapshots: [
    {
      stepIndex: 0,
      objectStates: {
        supplier: { riskLevel: 0.2, activityLevel: 0.5, stabilityLevel: 0.8 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        delivery_reliability: { label: "Delivery Reliability", value: 0.7 },
      },
    },
  ],
};

const EXAMPLE_BUSINESS_SCENARIO_OUTCOME = {
  scenarioId: "supplier_delay",
  overallRisk: "high",
  snapshots: [
    {
      stepIndex: 0,
      objectStates: {
        supplier: { riskLevel: 0.2, activityLevel: 0.5, stabilityLevel: 0.8 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        delivery_reliability: { label: "Delivery Reliability", value: 0.7 },
      },
    },
    {
      stepIndex: 1,
      objectStates: {
        supplier: { riskLevel: 0.7, activityLevel: 0.3, stabilityLevel: 0.4 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        delivery_reliability: { label: "Delivery Reliability", value: 0.45 },
      },
    },
  ],
};

const EXAMPLE_FINANCE_SCENARIO_A = {
  scenarioId: "liquidity_stress",
  overallRisk: "critical",
  snapshots: [
    {
      stepIndex: 0,
      objectStates: {
        liquidity: { riskLevel: 0.3, activityLevel: 0.5, stabilityLevel: 0.7 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        liquidity_health: { label: "Liquidity Health", value: 0.65 },
      },
    },
    {
      stepIndex: 1,
      objectStates: {
        liquidity: { riskLevel: 0.85, activityLevel: 0.35, stabilityLevel: 0.3 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        liquidity_health: { label: "Liquidity Health", value: 0.25 },
      },
    },
  ],
};

const EXAMPLE_FINANCE_SCENARIO_B = {
  scenarioId: "drawdown_risk",
  overallRisk: "high",
  snapshots: [
    {
      stepIndex: 0,
      objectStates: {
        liquidity: { riskLevel: 0.3, activityLevel: 0.5, stabilityLevel: 0.7 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        liquidity_health: { label: "Liquidity Health", value: 0.65 },
      },
    },
    {
      stepIndex: 1,
      objectStates: {
        liquidity: { riskLevel: 0.6, activityLevel: 0.4, stabilityLevel: 0.45 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        liquidity_health: { label: "Liquidity Health", value: 0.4 },
      },
    },
  ],
};

const EXAMPLE_DEVOPS_OUTCOME = {
  scenarioId: "database_latency",
  overallRisk: "high",
  snapshots: [
    {
      stepIndex: 0,
      objectStates: {
        database: { riskLevel: 0.25, activityLevel: 0.55, stabilityLevel: 0.75 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        service_uptime: { label: "Service Uptime", value: 0.8 },
      },
    },
    {
      stepIndex: 1,
      objectStates: {
        database: { riskLevel: 0.7, activityLevel: 0.45, stabilityLevel: 0.4 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        service_uptime: { label: "Service Uptime", value: 0.55 },
      },
    },
  ],
};

const EXAMPLE_STRATEGY_OUTCOME = {
  scenarioId: "competitor_pricing_pressure",
  overallRisk: "high",
  snapshots: [
    {
      stepIndex: 0,
      objectStates: {
        market_share: { riskLevel: 0.2, activityLevel: 0.5, stabilityLevel: 0.75 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        strategic_position: { label: "Strategic Position", value: 0.7 },
      },
    },
    {
      stepIndex: 1,
      objectStates: {
        market_share: { riskLevel: 0.65, activityLevel: 0.4, stabilityLevel: 0.45 },
      },
      relationStates: {},
      loopStates: {},
      kpiStates: {
        strategic_position: { label: "Strategic Position", value: 0.48 },
      },
    },
  ],
};

export const EXAMPLE_OUTCOME_COMPARISONS = {
  business: {
    baselineVsScenario: compareBaselineToScenario({
      baselineOutcome: EXAMPLE_BASELINE_OUTCOME,
      scenarioOutcome: EXAMPLE_BUSINESS_SCENARIO_OUTCOME,
    }),
    scenarioVsScenario: compareScenarioOutcomes({
      leftOutcome: EXAMPLE_BUSINESS_SCENARIO_OUTCOME,
      rightOutcome: EXAMPLE_BASELINE_OUTCOME,
    }),
    replayTrack: buildReplayTrack({
      outcome: EXAMPLE_BUSINESS_SCENARIO_OUTCOME,
    }),
  },
  finance: {
    baselineVsScenario: compareBaselineToScenario({
      baselineOutcome: EXAMPLE_BASELINE_OUTCOME,
      scenarioOutcome: EXAMPLE_FINANCE_SCENARIO_A,
    }),
    scenarioVsScenario: compareScenarioOutcomes({
      leftOutcome: EXAMPLE_FINANCE_SCENARIO_A,
      rightOutcome: EXAMPLE_FINANCE_SCENARIO_B,
    }),
    replayTrack: buildReplayTrack({
      outcome: EXAMPLE_FINANCE_SCENARIO_A,
    }),
  },
  devops: {
    baselineVsScenario: compareBaselineToScenario({
      baselineOutcome: EXAMPLE_BASELINE_OUTCOME,
      scenarioOutcome: EXAMPLE_DEVOPS_OUTCOME,
    }),
    scenarioVsScenario: compareScenarioOutcomes({
      leftOutcome: EXAMPLE_DEVOPS_OUTCOME,
      rightOutcome: EXAMPLE_BASELINE_OUTCOME,
    }),
    replayTrack: buildReplayTrack({
      outcome: EXAMPLE_DEVOPS_OUTCOME,
    }),
  },
  strategy: {
    baselineVsScenario: compareBaselineToScenario({
      baselineOutcome: EXAMPLE_BASELINE_OUTCOME,
      scenarioOutcome: EXAMPLE_STRATEGY_OUTCOME,
    }),
    scenarioVsScenario: compareScenarioOutcomes({
      leftOutcome: EXAMPLE_STRATEGY_OUTCOME,
      rightOutcome: EXAMPLE_BASELINE_OUTCOME,
    }),
    replayTrack: buildReplayTrack({
      outcome: EXAMPLE_STRATEGY_OUTCOME,
    }),
  },
};
