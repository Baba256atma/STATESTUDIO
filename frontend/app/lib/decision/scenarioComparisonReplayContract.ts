import type { SceneJson, SemanticObjectMeta } from "../sceneTypes";
import type {
  PropagationStep,
  SimulationResult,
  TimelineStep,
} from "./simulationContract";

export type ScenarioReference = {
  projectId: string;
  scenarioId: string;
  name?: string;
  timestamp: number;
};

export type ScenarioSnapshot = {
  ref: ScenarioReference;
  baselineRef?: ScenarioReference | null;
  simulation: SimulationResult;
  scene: {
    objectCount: number;
    relationCount: number;
    loopCount: number;
    highlightedObjectIds: string[];
  };
  semantics?: {
    objectMetaCount: number;
    domains?: string[];
    categories?: string[];
  };
  intelligence: {
    riskSummary: string;
    timelineSteps: string[];
    recommendation: string;
    confidence?: number;
  };
  meta?: Record<string, unknown>;
};

export type ScenarioDelta = {
  changedObjects: {
    added: string[];
    removed: string[];
    retained: string[];
  };
  riskDelta: {
    beforeSummary?: string;
    afterSummary: string;
    changedDimensions: string[];
  };
  timelineDelta: {
    beforeSteps: string[];
    afterSteps: string[];
    changed: boolean;
  };
  adviceDelta: {
    before?: string;
    after: string;
    changed: boolean;
  };
  impactDelta: {
    beforeAffectedCount: number;
    afterAffectedCount: number;
    diff: number;
  };
};

export type ScenarioComparisonInput = {
  baseline: ScenarioSnapshot | null;
  current: ScenarioSnapshot;
  mode?: "baseline_vs_impacted" | "scenario_a_vs_b" | "mitigation_off_vs_on";
};

export type BaselineComparisonReadyShape = {
  baselineAvailable: boolean;
  mode: "baseline_vs_impacted" | "scenario_a_vs_b" | "mitigation_off_vs_on";
  comparable: boolean;
  reason?: string;
};

export type ScenarioComparisonResult = {
  a: ScenarioReference | null;
  b: ScenarioReference;
  mode: "baseline_vs_impacted" | "scenario_a_vs_b" | "mitigation_off_vs_on";
  summary: string;
  delta: ScenarioDelta;
  baselineReady: BaselineComparisonReadyShape;
};

export type ReplayStep = {
  index: number;
  phase: "immediate" | "near_term" | "downstream" | "mitigation" | "propagation";
  summary: string;
  affectedObjectIds: string[];
  propagation?: PropagationStep[];
  note?: string;
};

export type ReplaySequence = {
  scenario: ScenarioReference;
  steps: ReplayStep[];
  totalSteps: number;
  summary: string;
};

function unique(ids: string[]): string[] {
  return Array.from(new Set((ids ?? []).filter(Boolean)));
}

function timelineToStrings(steps: TimelineStep[]): string[] {
  return (Array.isArray(steps) ? steps : []).map((s) => String(s?.summary ?? "").trim()).filter(Boolean);
}

function safeMetaStats(semanticObjectMeta?: Record<string, SemanticObjectMeta | Record<string, unknown>>) {
  const values = Object.values(semanticObjectMeta ?? {});
  const domains = unique(
    values
      .map((v: any) => String(v?.domain ?? "").trim().toLowerCase())
      .filter(Boolean)
  );
  const categories = unique(
    values
      .map((v: any) => String(v?.category ?? "").trim().toLowerCase())
      .filter(Boolean)
  );
  return {
    objectMetaCount: values.length,
    domains,
    categories,
  };
}

export function createScenarioSnapshot(params: {
  projectId: string;
  simulation: SimulationResult;
  sceneJson?: SceneJson | null;
  semanticObjectMeta?: Record<string, SemanticObjectMeta | Record<string, unknown>>;
  timestamp?: number;
  baselineRef?: ScenarioReference | null;
  meta?: Record<string, unknown>;
}): ScenarioSnapshot {
  const ts = Number.isFinite(params.timestamp) ? Number(params.timestamp) : Date.now();
  const scene = params.sceneJson;
  const objectCount = Array.isArray(scene?.scene?.objects) ? scene!.scene.objects!.length : 0;
  const relationCount = Array.isArray((scene as any)?.scene?.relations) ? (scene as any).scene.relations.length : 0;
  const loopCount = Array.isArray(scene?.scene?.loops) ? scene!.scene.loops!.length : 0;
  const highlightedObjectIds = unique([
    ...(params.simulation?.matchedObjectIds ?? []),
    ...(params.simulation?.impact?.directlyAffectedObjectIds ?? []),
    ...(params.simulation?.impact?.downstreamObjectIds ?? []),
  ]);

  return {
    ref: {
      projectId: String(params.projectId || "default"),
      scenarioId: String(params.simulation?.scenario?.id ?? `scenario_${ts}`),
      name: params.simulation?.scenario?.name,
      timestamp: ts,
    },
    baselineRef: params.baselineRef ?? null,
    simulation: params.simulation,
    scene: {
      objectCount,
      relationCount,
      loopCount,
      highlightedObjectIds,
    },
    semantics: safeMetaStats(params.semanticObjectMeta),
    intelligence: {
      riskSummary: String(params.simulation?.risk?.summary ?? ""),
      timelineSteps: timelineToStrings(params.simulation?.timeline ?? []),
      recommendation: String(params.simulation?.advice?.recommendation ?? ""),
      confidence: params.simulation?.confidence,
    },
    meta: params.meta,
  };
}

export function buildReplaySequence(snapshot: ScenarioSnapshot): ReplaySequence {
  const timeline = Array.isArray(snapshot?.simulation?.timeline) ? snapshot.simulation.timeline : [];
  const propagation = Array.isArray(snapshot?.simulation?.propagation) ? snapshot.simulation.propagation : [];

  const steps: ReplayStep[] = timeline.map((t, idx) => ({
    index: idx + 1,
    phase: t.phase,
    summary: t.summary,
    affectedObjectIds: unique((t.affectedObjectIds ?? []).map(String)),
    propagation:
      idx === 0
        ? propagation.filter((p) => p.influence === "direct")
        : idx === 1
        ? propagation.filter((p) => p.influence === "downstream")
        : [],
  }));

  if (!steps.length && propagation.length) {
    steps.push({
      index: 1,
      phase: "propagation",
      summary: "Propagation sequence inferred from connected dependencies.",
      affectedObjectIds: unique(
        propagation.flatMap((p) => [String(p.fromObjectId ?? ""), String(p.toObjectId ?? "")])
      ),
      propagation,
    });
  }

  const summary =
    steps.length > 0
      ? `${steps.length} replay steps generated for ${snapshot.ref.name ?? snapshot.ref.scenarioId}.`
      : `No replay steps available for ${snapshot.ref.name ?? snapshot.ref.scenarioId}.`;

  return {
    scenario: snapshot.ref,
    steps,
    totalSteps: steps.length,
    summary,
  };
}

export function compareScenarioSnapshots(
  input: ScenarioComparisonInput
): ScenarioComparisonResult {
  const mode = input.mode ?? "baseline_vs_impacted";
  const base = input.baseline;
  const cur = input.current;

  const baseObjs = unique(base?.scene?.highlightedObjectIds ?? []);
  const curObjs = unique(cur?.scene?.highlightedObjectIds ?? []);
  const baseSet = new Set(baseObjs);
  const curSet = new Set(curObjs);
  const added = curObjs.filter((id) => !baseSet.has(id));
  const removed = baseObjs.filter((id) => !curSet.has(id));
  const retained = curObjs.filter((id) => baseSet.has(id));

  const beforeTimeline = base?.intelligence?.timelineSteps ?? [];
  const afterTimeline = cur?.intelligence?.timelineSteps ?? [];
  const beforeAdvice = base?.intelligence?.recommendation;
  const afterAdvice = cur?.intelligence?.recommendation ?? "";

  const delta: ScenarioDelta = {
    changedObjects: { added, removed, retained },
    riskDelta: {
      beforeSummary: base?.intelligence?.riskSummary,
      afterSummary: cur?.intelligence?.riskSummary ?? "",
      changedDimensions: unique(
        [
          ...(base?.simulation?.risk?.affectedDimensions ?? []),
          ...(cur?.simulation?.risk?.affectedDimensions ?? []),
        ].map(String)
      ),
    },
    timelineDelta: {
      beforeSteps: beforeTimeline,
      afterSteps: afterTimeline,
      changed: JSON.stringify(beforeTimeline) !== JSON.stringify(afterTimeline),
    },
    adviceDelta: {
      before: beforeAdvice,
      after: afterAdvice,
      changed: String(beforeAdvice ?? "") !== String(afterAdvice ?? ""),
    },
    impactDelta: {
      beforeAffectedCount: baseObjs.length,
      afterAffectedCount: curObjs.length,
      diff: curObjs.length - baseObjs.length,
    },
  };

  const baselineReady: BaselineComparisonReadyShape = {
    baselineAvailable: !!base,
    mode,
    comparable: !!base,
    reason: base ? undefined : "No baseline snapshot provided; comparison is one-sided.",
  };

  const summary = base
    ? `Comparison (${mode}) found ${added.length} added, ${removed.length} removed, and ${retained.length} retained affected objects.`
    : `Comparison (${mode}) unavailable: baseline snapshot missing.`;

  return {
    a: base?.ref ?? null,
    b: cur.ref,
    mode,
    summary,
    delta,
    baselineReady,
  };
}
