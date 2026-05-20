import type {
  BuildExecutiveMetaCognitionSnapshotInput,
  ExecutiveConfidenceEvolution,
  ExecutiveMetaCognitionAssumption,
  ExecutiveMetaCognitionSnapshot,
  ExecutiveMetaCognitionUncertainty,
  ExecutiveReasoningPathStep,
} from "./executiveMetaCognitionTypes";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function normalizeConfidence(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value > 1 ? clamp01(value / 100) : clamp01(value);
}

function text(value: unknown): string {
  return String(value ?? "").trim();
}

function pushUnique(target: string[], value: string, limit = 5): void {
  const next = text(value);
  if (!next || target.includes(next) || target.length >= limit) return;
  target.push(next);
}

function objectCount(sceneJson: unknown): number {
  const scene = asRecord(asRecord(sceneJson)?.scene);
  const objects = scene?.objects;
  return Array.isArray(objects) ? objects.length : 0;
}

function hasLoops(sceneJson: unknown): boolean {
  const scene = asRecord(asRecord(sceneJson)?.scene);
  return Array.isArray(scene?.loops) && scene.loops.length > 0;
}

function confidenceEvolution(previous: number | null | undefined, current: number): ExecutiveConfidenceEvolution {
  if (typeof previous !== "number" || !Number.isFinite(previous)) {
    return {
      previous: null,
      current,
      direction: "unknown",
      explanation: "Confidence is being established from the current recommendation, signals, and visible system context.",
    };
  }
  const delta = current - previous;
  if (Math.abs(delta) < 0.03) {
    return {
      previous,
      current,
      direction: "steady",
      explanation: "Confidence is steady because the current evidence has not materially changed the recommendation posture.",
    };
  }
  return {
    previous,
    current,
    direction: delta > 0 ? "increased" : "decreased",
    explanation:
      delta > 0
        ? "Confidence increased as supporting signals and recommendation structure became more coherent."
        : "Confidence decreased because uncertainty, missing context, or signal pressure weakened the advisory posture.",
  };
}

function stableSignature(parts: readonly unknown[]): string {
  return parts
    .map((part) => {
      if (part == null) return "null";
      if (typeof part === "string" || typeof part === "number" || typeof part === "boolean") return String(part);
      try {
        return JSON.stringify(part);
      } catch {
        return String(part);
      }
    })
    .join("|");
}

export function buildExecutiveMetaCognitionSnapshot(
  input: BuildExecutiveMetaCognitionSnapshotInput
): ExecutiveMetaCognitionSnapshot {
  const recommendation = input.canonicalRecommendation ?? null;
  const advice = asRecord(input.strategicAdvice);
  const response = asRecord(input.responseData);
  const sceneObjects = objectCount(input.sceneJson);
  const confidence =
    normalizeConfidence(recommendation?.confidence.score) ??
    normalizeConfidence(input.executiveSummary?.confidence.value) ??
    normalizeConfidence(response?.decision_confidence) ??
    0.34;
  const fragility = text(input.pipelineStatus?.fragilityLevel).toLowerCase();
  const signalCount = Number(input.pipelineStatus?.signalsCount ?? input.pipelineStatus?.mappedObjectsCount ?? 0);

  const supportingSignals: string[] = [];
  pushUnique(supportingSignals, sceneObjects > 0 ? `${sceneObjects} mapped enterprise objects` : "No mapped enterprise objects yet");
  pushUnique(supportingSignals, hasLoops(input.sceneJson) ? "Topology dependencies are visible" : "Topology dependency evidence is limited");
  pushUnique(supportingSignals, input.pipelineStatus?.summary ?? input.pipelineStatus?.insightLine ?? "");
  pushUnique(supportingSignals, recommendation?.reasoning.why ?? "");
  pushUnique(supportingSignals, text(advice?.summary ?? advice?.recommendation ?? ""));

  const assumptions: ExecutiveMetaCognitionAssumption[] = [
    {
      id: "assumption::scene-represents-operating-context",
      label: sceneObjects > 0 ? "Visible scene represents the active operating context." : "Operating context is still being established.",
      source: "scene",
      stability: sceneObjects >= 3 ? "stable" : sceneObjects > 0 ? "forming" : "weak",
    },
    {
      id: "assumption::recommendation-boundary",
      label: recommendation
        ? "Recommendation reasoning is bounded by the current evidence and simulation context."
        : "Recommendation boundary is not fully available yet.",
      source: "recommendation",
      stability: recommendation ? "forming" : "weak",
    },
    {
      id: "assumption::governance-quality",
      label: "Governance interpretation should remain advisory and auditable before execution.",
      source: "governance",
      stability: "stable",
    },
  ];

  const uncertainty: ExecutiveMetaCognitionUncertainty[] = [];
  if (sceneObjects < 2) {
    uncertainty.push({
      id: "uncertainty::thin-scene",
      label: "Limited object context reduces reasoning coverage.",
      severity: "high",
    });
  }
  if (!recommendation) {
    uncertainty.push({
      id: "uncertainty::no-canonical-recommendation",
      label: "No canonical recommendation is available to audit yet.",
      severity: "medium",
    });
  }
  if (fragility === "high" || fragility === "critical") {
    uncertainty.push({
      id: "uncertainty::elevated-fragility",
      label: "Elevated fragility may make near-term interpretation more sensitive to weak signals.",
      severity: fragility === "critical" ? "high" : "medium",
    });
  }
  if (signalCount <= 0) {
    uncertainty.push({
      id: "uncertainty::weak-signal-count",
      label: "Signal count is low, so confidence should remain conservative.",
      severity: "medium",
    });
  }

  const reasoningPath: ExecutiveReasoningPathStep[] = [
    "enterprise_signals",
    "operational_synchronization",
    "topology_cognition",
    "fragility_intelligence",
    "strategic_interpretation",
    "advisory_reasoning",
    "governance_intelligence",
    "meta_cognition_reflection",
    "executive_strategic_self_awareness",
  ];

  const currentConfidence = Number(confidence.toFixed(4));
  const evolution = confidenceEvolution(input.previousConfidence, currentConfidence);
  const advisoryLimits =
    uncertainty.length > 0
      ? uncertainty.slice(0, 3).map((item) => item.label)
      : ["No advisory limit is blocking interpretation, but executive review remains required."];
  const governanceContext =
    recommendation?.source === "simulation"
      ? "Recommendation is informed by simulation evidence and remains subject to executive governance."
      : "Recommendation is advisory, auditable, and requires governance review before execution.";
  const strategicReflection =
    uncertainty.length > 0
      ? "Nexora can explain the reasoning path, but current confidence remains bounded by incomplete or sensitive evidence."
      : "Nexora can trace the recommendation from signals through governance with a stable advisory posture.";

  return {
    organizationId: text(input.organizationId) || "default-enterprise",
    signature: stableSignature([
      input.organizationId ?? "default-enterprise",
      sceneObjects,
      recommendation?.id ?? "no-rec",
      recommendation?.confidence.level ?? "no-level",
      currentConfidence,
      fragility || "no-fragility",
      signalCount,
      uncertainty.map((item) => item.id),
    ]),
    reasoningPath,
    supportingSignals,
    assumptions,
    uncertainty,
    confidenceEvolution: evolution,
    governanceContext,
    advisoryLimits,
    strategicReflection,
    assistantReflectionLine: `${strategicReflection} ${evolution.explanation}`,
    rightRailReflectionLine: `Reasoning reflection: ${supportingSignals[0] ?? "Signals pending"}; ${advisoryLimits[0]}`,
    timelineReflectionLine: `Reasoning memory: confidence ${evolution.direction}; assumptions ${assumptions[0]?.stability ?? "forming"}.`,
    timestamp: Number.isFinite(input.timestamp) ? Number(input.timestamp) : 0,
  };
}
