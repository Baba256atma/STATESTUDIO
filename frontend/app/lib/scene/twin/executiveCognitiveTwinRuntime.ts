/**
 * E2:98 — Executive Cognitive Twin runtime: living enterprise model synthesis.
 */

import {
  logE298HealthUpdated,
  logE298RiskUpdated,
  logE298TwinInitialized,
  logE298TwinSnapshotGenerated,
  logE298TwinStateChanged,
} from "./executiveCognitiveTwinDiagnostics.ts";
import type {
  BuildExecutiveCognitiveTwinInput,
  CognitiveTwinConfidenceLevel,
  CognitiveTwinDepartment,
  CognitiveTwinDriftSignal,
  CognitiveTwinFutureBranch,
  CognitiveTwinHealthLevel,
  CognitiveTwinInstitutionalMemoryEntry,
  CognitiveTwinLifecycleState,
  CognitiveTwinRelationshipHealth,
  CognitiveTwinRelationshipTwin,
  CognitiveTwinResourceConstraint,
  CognitiveTwinRiskEvolution,
  CognitiveTwinTwinEntity,
  ExecutiveCognitiveTwinAwareness,
  ExecutiveCognitiveTwinCopilotContext,
  ExecutiveCognitiveTwinScores,
  ExecutiveCognitiveTwinSnapshot,
  ExecutiveCognitiveTwinState,
} from "./executiveCognitiveTwinTypes.ts";

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, Number(value.toFixed(3))));
}

function inferDepartment(input: {
  label: string;
  tags: readonly string[];
  role?: string;
}): CognitiveTwinDepartment | null {
  const blob = `${input.label} ${input.tags.join(" ")} ${input.role ?? ""}`.toLowerCase();
  if (blob.includes("finance") || blob.includes("budget") || blob.includes("cost")) return "finance";
  if (blob.includes("project") || blob.includes("delivery") || blob.includes("program")) return "projects";
  if (blob.includes("logistic") || blob.includes("supply") || blob.includes("inventory")) return "logistics";
  if (blob.includes("quality") || blob.includes("compliance")) return "quality";
  if (blob.includes("strategy") || blob.includes("decision")) return "strategy";
  if (blob.includes("operation") || blob.includes("process") || blob.includes("system")) return "operations";
  return "operations";
}

function healthFromRisk(riskLevel: "low" | "medium" | "high" | null, stressed: boolean): CognitiveTwinHealthLevel {
  if (riskLevel === "high") return stressed ? "critical" : "degraded";
  if (riskLevel === "medium") return stressed ? "degraded" : "warning";
  if (stressed) return "warning";
  return "healthy";
}

function confidenceFromScore(score: number): CognitiveTwinConfidenceLevel {
  if (score >= 0.72) return "high";
  if (score >= 0.45) return "medium";
  return "low";
}

function lifecycleFromHealth(health: CognitiveTwinHealthLevel): CognitiveTwinLifecycleState {
  if (health === "critical") return "stressed";
  if (health === "degraded") return "evolving";
  if (health === "recovering") return "recovering";
  if (health === "warning") return "active";
  return "active";
}

function buildObjectTwins(input: BuildExecutiveCognitiveTwinInput): CognitiveTwinTwinEntity[] {
  const affected = new Set(input.activeSimulation?.affectedObjectIds ?? []);
  const alertObjects = new Set((input.alerts ?? []).flatMap((alert) => alert.relatedObjectIds));
  const metaById = new Map((input.sceneObjectMeta ?? []).map((entry) => [entry.id, entry]));
  const ids = input.sceneObjectIds ?? [...metaById.keys()];

  return ids.map((id) => {
    const meta = metaById.get(id);
    const label = meta?.label ?? id;
    const tags = meta?.tags ?? [];
    const inSimulation = affected.has(id);
    const inAlert = alertObjects.has(id);
    const riskLevel = inSimulation ? input.activeSimulation?.riskLevel ?? null : null;
    const health = healthFromRisk(riskLevel, inAlert);
    const confidenceScore = clamp01(
      (input.pipelineConfidence ?? 0.55) * 0.4 +
        (inSimulation ? 0.25 : 0.45) -
        (health === "critical" ? 0.25 : health === "degraded" ? 0.12 : 0)
    );
    const pulseScore = clamp01(
      (health === "critical" ? 0.92 : health === "degraded" ? 0.74 : health === "warning" ? 0.58 : 0.42) +
        (inSimulation ? 0.08 : 0)
    );
    const healthScore = clamp01(1 - pulseScore * 0.55 + confidenceScore * 0.15);

    return {
      twinId: `object:${id}`,
      twinType: "object",
      label,
      department: inferDepartment({ label, tags, role: meta?.role }),
      lifecycleState: lifecycleFromHealth(health),
      healthState: health,
      confidenceState: confidenceFromScore(confidenceScore),
      pulseScore,
      healthScore,
      objectIds: [id],
      relatedScenarioIds: inSimulation && input.activeSimulation ? [input.activeSimulation.scenarioId] : [],
    };
  });
}

function buildClusterTwins(objectTwins: readonly CognitiveTwinTwinEntity[]): CognitiveTwinTwinEntity[] {
  const byDepartment = new Map<CognitiveTwinDepartment, CognitiveTwinTwinEntity[]>();
  objectTwins.forEach((twin) => {
    const dept = twin.department ?? "operations";
    const bucket = byDepartment.get(dept) ?? [];
    bucket.push(twin);
    byDepartment.set(dept, bucket);
  });

  return [...byDepartment.entries()].map(([department, members]) => {
    const avgPulse = members.reduce((sum, twin) => sum + twin.pulseScore, 0) / Math.max(1, members.length);
    const avgHealth = members.reduce((sum, twin) => sum + twin.healthScore, 0) / Math.max(1, members.length);
    const worst = members.reduce<CognitiveTwinHealthLevel>((current, twin) => {
      const order: CognitiveTwinHealthLevel[] = ["healthy", "recovering", "warning", "degraded", "critical"];
      return order.indexOf(twin.healthState) > order.indexOf(current) ? twin.healthState : current;
    }, "healthy");

    return {
      twinId: `cluster:${department}`,
      twinType: "cluster",
      label: `${department.charAt(0).toUpperCase()}${department.slice(1)} Cluster`,
      department,
      lifecycleState: lifecycleFromHealth(worst),
      healthState: worst,
      confidenceState: confidenceFromScore(avgHealth),
      pulseScore: clamp01(avgPulse),
      healthScore: clamp01(avgHealth),
      objectIds: members.flatMap((twin) => twin.objectIds),
      relatedScenarioIds: [...new Set(members.flatMap((twin) => twin.relatedScenarioIds))],
    };
  });
}

function buildDomainTwin(input: BuildExecutiveCognitiveTwinInput, clusters: readonly CognitiveTwinTwinEntity[]): CognitiveTwinTwinEntity[] {
  const label = input.domainLabel?.trim() || "Enterprise Domain";
  const avgPulse = clusters.reduce((sum, twin) => sum + twin.pulseScore, 0) / Math.max(1, clusters.length);
  const avgHealth = clusters.reduce((sum, twin) => sum + twin.healthScore, 0) / Math.max(1, clusters.length);
  const worst = clusters.reduce<CognitiveTwinHealthLevel>((current, twin) => {
    const order: CognitiveTwinHealthLevel[] = ["healthy", "recovering", "warning", "degraded", "critical"];
    return order.indexOf(twin.healthState) > order.indexOf(current) ? twin.healthState : current;
  }, "healthy");

  return [
    {
      twinId: `domain:${input.domainId ?? "enterprise"}`,
      twinType: "domain",
      label,
      department: "strategy",
      lifecycleState: lifecycleFromHealth(worst),
      healthState: worst,
      confidenceState: confidenceFromScore(avgHealth),
      pulseScore: clamp01(avgPulse),
      healthScore: clamp01(avgHealth),
      objectIds: clusters.flatMap((twin) => twin.objectIds),
      relatedScenarioIds: [...new Set(clusters.flatMap((twin) => twin.relatedScenarioIds))],
    },
  ];
}

function buildSystemTwin(input: BuildExecutiveCognitiveTwinInput, objectTwins: readonly CognitiveTwinTwinEntity[]): CognitiveTwinTwinEntity[] {
  const label = "Operational System";
  const avgPulse = objectTwins.reduce((sum, twin) => sum + twin.pulseScore, 0) / Math.max(1, objectTwins.length);
  const avgHealth = objectTwins.reduce((sum, twin) => sum + twin.healthScore, 0) / Math.max(1, objectTwins.length);
  const executionStress = input.executionState?.riskLevel === "high" ? 0.22 : input.executionState?.riskLevel === "medium" ? 0.12 : 0;

  return [
    {
      twinId: "system:operational_core",
      twinType: "system",
      label,
      department: "operations",
      lifecycleState: input.executionState?.status === "running" ? "evolving" : "active",
      healthState: healthFromRisk(input.executionState?.riskLevel ?? input.activeSimulation?.riskLevel ?? null, Boolean(input.alerts?.length)),
      confidenceState: confidenceFromScore(avgHealth),
      pulseScore: clamp01(avgPulse + executionStress),
      healthScore: clamp01(avgHealth - executionStress),
      objectIds: objectTwins.map((twin) => twin.objectIds[0]).filter(Boolean) as string[],
      relatedScenarioIds: input.activeSimulation ? [input.activeSimulation.scenarioId] : [],
    },
  ];
}

function buildResourceTwins(input: BuildExecutiveCognitiveTwinInput): CognitiveTwinTwinEntity[] {
  const affectedCount = input.activeSimulation?.affectedObjectIds.length ?? 0;
  const pathCount = input.activeSimulation?.propagationPaths.length ?? 0;
  const pressure = clamp01(affectedCount * 0.08 + pathCount * 0.06 + (input.executionState?.status === "running" ? 0.12 : 0));

  return (["capacity", "people", "equipment", "budget"] as const).map((kind, index) => ({
    twinId: `resource:${kind}`,
    twinType: "resource" as const,
    label: kind.charAt(0).toUpperCase() + kind.slice(1),
    department: kind === "budget" ? ("finance" as const) : ("operations" as const),
    lifecycleState: pressure > 0.65 ? ("stressed" as const) : ("active" as const),
    healthState: pressure > 0.75 ? ("degraded" as const) : pressure > 0.5 ? ("warning" as const) : ("healthy" as const),
    confidenceState: confidenceFromScore(1 - pressure * 0.4),
    pulseScore: clamp01(pressure + index * 0.03),
    healthScore: clamp01(1 - pressure),
    objectIds: [],
    relatedScenarioIds: input.activeSimulation ? [input.activeSimulation.scenarioId] : [],
  }));
}

function buildRelationshipTwins(
  input: BuildExecutiveCognitiveTwinInput,
  objectTwins: readonly CognitiveTwinTwinEntity[]
): CognitiveTwinRelationshipTwin[] {
  const healthByObject = new Map(objectTwins.map((twin) => [twin.objectIds[0], twin.healthState]));
  const pathKeys = new Set(
    (input.activeSimulation?.propagationPaths ?? []).map((path) => `${path.from}->${path.to}`)
  );

  return (input.relationships ?? []).map((relationship) => {
    const pathKey = `${relationship.sourceId}->${relationship.targetId}`;
    const inPath = pathKeys.has(pathKey);
    const sourceHealth = healthByObject.get(relationship.sourceId) ?? "healthy";
    const targetHealth = healthByObject.get(relationship.targetId) ?? "healthy";
    const stressed =
      sourceHealth === "degraded" ||
      sourceHealth === "critical" ||
      targetHealth === "degraded" ||
      targetHealth === "critical";
    const health: CognitiveTwinRelationshipHealth = stressed
      ? sourceHealth === "critical" || targetHealth === "critical"
        ? "broken"
        : "stressed"
      : inPath
        ? "stressed"
        : "healthy";
    const strength = clamp01(inPath ? 0.86 : stressed ? 0.42 : 0.68);

    return {
      relationshipId: relationship.id,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId,
      strength,
      health,
      pulseScore: clamp01(strength * (health === "broken" ? 0.95 : health === "stressed" ? 0.72 : 0.48)),
    };
  });
}

function buildMemory(input: BuildExecutiveCognitiveTwinInput): CognitiveTwinInstitutionalMemoryEntry[] {
  const entries: CognitiveTwinInstitutionalMemoryEntry[] = [];

  (input.memoryState?.entries ?? []).slice(0, 8).forEach((entry) => {
    entries.push({
      id: entry.id,
      kind: entry.outcome === "stable" ? "outcome" : entry.outcome === "unstable" ? "incident" : "decision",
      title: entry.decisionSummary,
      summary: `${entry.riskLevel} risk · ${entry.outcome}`,
      timestampLabel: new Date(entry.timestamp).toISOString(),
      relatedObjectIds: [],
      relatedScenarioId: entry.scenarioId,
    });
  });

  (input.timelineEvents ?? [])
    .filter((event) => event.markerType === "decision" || event.decisionId)
    .slice(0, 4)
    .forEach((event) => {
      entries.push({
        id: `timeline_memory_${event.id}`,
        kind: "decision",
        title: event.title,
        summary: event.summary ?? event.narrativeSummary ?? event.title,
        timestampLabel: event.timestamp ?? event.timestampIso ?? null,
        relatedObjectIds: event.relatedObjectIds ?? [],
        relatedScenarioId: event.scenarioId ?? null,
      });
    });

  return entries.slice(0, 12);
}

function buildFutureBranches(input: BuildExecutiveCognitiveTwinInput): CognitiveTwinFutureBranch[] {
  const universeLayers = input.scenarioUniverse?.layers.filter((layer) => layer.metadata.role === "alternative") ?? [];
  if (universeLayers.length > 0) {
    return universeLayers.map((layer) => ({
      scenarioId: layer.metadata.id,
      title: layer.metadata.title,
      confidence: confidenceFromScore(layer.metadata.confidence),
      riskEvolution:
        layer.metadata.riskLevel === "high"
          ? ("growing" as const)
          : layer.metadata.riskLevel === "low"
            ? ("declining" as const)
            : ("stable" as const),
      overallScore: layer.metadata.overallScore,
    }));
  }

  return (input.scenarioComparison?.rows ?? []).map((row) => ({
    scenarioId: row.scenarioId,
    title: row.title,
    confidence: confidenceFromScore(row.confidence),
    riskEvolution:
      row.riskLevel === "high" ? ("growing" as const) : row.riskLevel === "low" ? ("declining" as const) : ("stable" as const),
    overallScore: row.confidence,
  }));
}

function buildResourceConstraints(resources: readonly CognitiveTwinTwinEntity[]): CognitiveTwinResourceConstraint[] {
  return resources.map((resource) => ({
    resourceKind:
      resource.twinId.includes("budget")
        ? "budget"
        : resource.twinId.includes("people")
          ? "people"
          : resource.twinId.includes("equipment")
            ? "equipment"
            : "capacity",
    label: resource.label,
    pressureScore: resource.pulseScore,
    bottleneck: resource.healthState === "degraded" || resource.healthState === "critical",
  }));
}

function buildDriftSignals(input: BuildExecutiveCognitiveTwinInput, scores: ExecutiveCognitiveTwinScores): CognitiveTwinDriftSignal[] {
  const signals: CognitiveTwinDriftSignal[] = [];
  if (scores.enterpriseHealthScore < 0.55) {
    signals.push({
      kind: "operational",
      title: "Operational Drift",
      summary: "Execution posture is diverging from stable operating conditions.",
      severity: scores.enterpriseHealthScore < 0.35 ? "critical" : "degraded",
      score: clamp01(1 - scores.enterpriseHealthScore),
    });
  }
  if (input.decisionRecommendation && input.activeSimulation?.riskLevel === "high") {
    signals.push({
      kind: "strategic",
      title: "Strategic Drift",
      summary: "Recommended direction conflicts with elevated active scenario risk.",
      severity: "warning",
      score: 0.62,
    });
  }
  if ((input.alerts ?? []).some((alert) => !alert.acknowledged)) {
    signals.push({
      kind: "organizational",
      title: "Organizational Misalignment",
      summary: "Unacknowledged alerts indicate unresolved cross-unit tension.",
      severity: "warning",
      score: 0.58,
    });
  }
  return signals;
}

function resolveRiskEvolution(input: BuildExecutiveCognitiveTwinInput): CognitiveTwinRiskEvolution {
  if (input.activeSimulation?.riskLevel === "high" || input.executionState?.riskLevel === "high") return "growing";
  if (input.activeSimulation?.riskLevel === "low" && (input.alerts?.length ?? 0) === 0) return "declining";
  return "stable";
}

function buildScores(input: {
  objectTwins: readonly CognitiveTwinTwinEntity[];
  clusterTwins: readonly CognitiveTwinTwinEntity[];
  domainTwins: readonly CognitiveTwinTwinEntity[];
  systemTwins: readonly CognitiveTwinTwinEntity[];
  resourceTwins: readonly CognitiveTwinTwinEntity[];
  input: BuildExecutiveCognitiveTwinInput;
}): ExecutiveCognitiveTwinScores {
  const objectPulse =
    input.objectTwins.reduce((sum, twin) => sum + twin.pulseScore, 0) / Math.max(1, input.objectTwins.length);
  const objectHealth =
    input.objectTwins.reduce((sum, twin) => sum + twin.healthScore, 0) / Math.max(1, input.objectTwins.length);
  const domainPulse =
    input.domainTwins[0]?.pulseScore ??
    input.clusterTwins.reduce((sum, twin) => sum + twin.pulseScore, 0) / Math.max(1, input.clusterTwins.length);
  const domainHealth =
    input.domainTwins[0]?.healthScore ??
    input.clusterTwins.reduce((sum, twin) => sum + twin.healthScore, 0) / Math.max(1, input.clusterTwins.length);
  const enterprisePulse = clamp01(objectPulse * 0.45 + domainPulse * 0.35 + (input.systemTwins[0]?.pulseScore ?? 0.5) * 0.2);
  const enterpriseHealth = clamp01(objectHealth * 0.5 + domainHealth * 0.3 + (input.systemTwins[0]?.healthScore ?? 0.5) * 0.2);
  const readiness = clamp01(
    enterpriseHealth * 0.45 +
      (input.input.pipelineConfidence ?? 0.5) * 0.25 +
      (input.input.decisionRecommendation ? 0.15 : 0.05)
  );
  const resilience = clamp01(enterpriseHealth * 0.4 + (1 - enterprisePulse) * 0.35 + readiness * 0.25);
  const stability = clamp01(resilience * 0.55 + enterpriseHealth * 0.45 - (input.input.alerts?.length ?? 0) * 0.04);

  return {
    enterprisePulseScore: enterprisePulse,
    enterpriseHealthScore: enterpriseHealth,
    enterpriseReadinessScore: readiness,
    enterpriseResilienceScore: resilience,
    enterpriseStabilityScore: stability,
    domainPulseScore: clamp01(domainPulse),
    domainHealthScore: clamp01(domainHealth),
  };
}

function buildAwareness(input: BuildExecutiveCognitiveTwinInput, scores: ExecutiveCognitiveTwinScores): ExecutiveCognitiveTwinAwareness {
  return {
    situation: input.activeSimulation?.summary ?? "Enterprise twin is monitoring live operational conditions.",
    strategic: input.decisionRecommendation?.reasoning ?? input.scenarioUniverse?.comparisonSummary ?? "Strategic posture is stable.",
    operational:
      input.executionState?.status === "running"
        ? `Execution is active under ${input.executionState.riskLevel} risk.`
        : `Operational readiness at ${Math.round(scores.enterpriseReadinessScore * 100)}%.`,
  };
}

function buildCopilot(
  input: BuildExecutiveCognitiveTwinInput,
  scores: ExecutiveCognitiveTwinScores,
  driftSignals: readonly CognitiveTwinDriftSignal[],
  riskEvolution: CognitiveTwinRiskEvolution
): ExecutiveCognitiveTwinCopilotContext {
  const drift = driftSignals[0];
  return {
    narrative: `Enterprise twin pulse ${Math.round(scores.enterprisePulseScore * 100)} with ${riskEvolution} risk evolution.`,
    explanation: drift
      ? `${drift.title}: ${drift.summary}`
      : "Twin state is aligned with current operational and strategic signals.",
    recommendation:
      input.decisionRecommendation?.nextAction ??
      "Stabilize degraded entities and review scenario branches before committing.",
    changedSummary: input.activeSimulation ? `Scenario ${input.activeSimulation.scenarioId} shifted twin health.` : null,
  };
}

function buildSignature(input: BuildExecutiveCognitiveTwinInput): string {
  return [
    (input.sceneObjectIds ?? []).join("|") || "none",
    input.selectedObjectId ?? "none",
    input.activeSimulation?.scenarioId ?? "none",
    input.scenarioUniverse?.signature ?? "none",
    input.scenarioComparison?.id ?? "none",
    input.executionState?.status ?? "none",
    (input.alerts ?? []).map((alert) => `${alert.id}:${alert.acknowledged}`).join("|") || "none",
    input.memoryState?.entries.length ?? 0,
    input.warRoomSignature ?? "none",
  ].join("::");
}

export function buildExecutiveCognitiveTwinState(input: BuildExecutiveCognitiveTwinInput): ExecutiveCognitiveTwinState {
  const objectTwins = buildObjectTwins(input);
  const clusterTwins = buildClusterTwins(objectTwins);
  const domainTwins = buildDomainTwin(input, clusterTwins);
  const systemTwins = buildSystemTwin(input, objectTwins);
  const resourceTwins = buildResourceTwins(input);
  const relationships = buildRelationshipTwins(input, objectTwins);
  const memory = buildMemory(input);
  const futureBranches = buildFutureBranches(input);
  const scores = buildScores({ objectTwins, clusterTwins, domainTwins, systemTwins, resourceTwins, input });
  const resourceConstraints = buildResourceConstraints(resourceTwins);
  const driftSignals = buildDriftSignals(input, scores);
  const riskEvolution = resolveRiskEvolution(input);
  const awareness = buildAwareness(input, scores);
  const copilot = buildCopilot(input, scores, driftSignals, riskEvolution);
  const signature = buildSignature(input);

  const livingObjectIds = objectTwins
    .filter((twin) => twin.healthState !== "healthy" || twin.pulseScore >= 0.62)
    .map((twin) => twin.objectIds[0])
    .filter(Boolean) as string[];

  const stressedRelationshipIds = relationships
    .filter((entry) => entry.health === "stressed" || entry.health === "broken")
    .map((entry) => entry.relationshipId);

  const selectedTwinId = input.selectedObjectId ? `object:${input.selectedObjectId}` : null;

  const state: ExecutiveCognitiveTwinState = {
    signature,
    active: objectTwins.length > 0,
    registry: {
      objects: objectTwins,
      clusters: clusterTwins,
      domains: domainTwins,
      systems: systemTwins,
      resources: resourceTwins,
    },
    relationships,
    memory,
    futureBranches,
    resourceConstraints,
    driftSignals,
    riskEvolution,
    scores,
    awareness,
    copilot,
    livingObjectIds,
    stressedRelationshipIds,
    selectedTwinId,
  };

  logE298TwinInitialized(signature, {
    objectCount: objectTwins.length,
    clusterCount: clusterTwins.length,
    relationshipCount: relationships.length,
  });
  logE298TwinStateChanged(signature, {
    selectedTwinId,
    livingObjectCount: livingObjectIds.length,
    riskEvolution,
  });
  logE298HealthUpdated(`${signature}:health`, {
    enterpriseHealth: scores.enterpriseHealthScore,
    domainHealth: scores.domainHealthScore,
  });
  logE298RiskUpdated(`${signature}:risk`, { riskEvolution, driftCount: driftSignals.length });
  logE298TwinSnapshotGenerated(`${signature}:snapshot`, {
    readiness: scores.enterpriseReadinessScore,
    resilience: scores.enterpriseResilienceScore,
    stability: scores.enterpriseStabilityScore,
  });

  return state;
}

export function buildExecutiveCognitiveTwinSnapshot(
  state: ExecutiveCognitiveTwinState
): ExecutiveCognitiveTwinSnapshot {
  return {
    signature: state.signature,
    scores: state.scores,
    awareness: state.awareness,
    copilot: state.copilot,
    riskEvolution: state.riskEvolution,
    driftSignals: state.driftSignals,
  };
}

export function resolveExecutiveCognitiveTwinCopilotPrompt(state: ExecutiveCognitiveTwinState | null): string | null {
  if (!state?.active) return null;
  return [
    state.copilot.narrative,
    state.copilot.explanation,
    `Recommendation: ${state.copilot.recommendation}.`,
    state.copilot.changedSummary,
  ]
    .filter(Boolean)
    .join(" ");
}

export function resolveTwinLivingEntities(state: ExecutiveCognitiveTwinState | null): readonly CognitiveTwinTwinEntity[] {
  if (!state) return [];
  return state.registry.objects.filter((twin) => state.livingObjectIds.includes(twin.objectIds[0] ?? ""));
}
