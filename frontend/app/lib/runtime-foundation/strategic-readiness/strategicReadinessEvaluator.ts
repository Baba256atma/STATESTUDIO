import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import {
  FEATURE_READINESS_IDS,
  READINESS_DIMENSIONS,
  clampReadinessConfidence,
  deriveAggregateConfidence,
  deriveAggregateReadinessState,
} from "./strategicReadinessRegistry.ts";
import type {
  ExecutiveReadinessSnapshot,
  FeatureReadinessEntry,
  ReadinessSignal,
  ReadinessState,
  RuntimeReadinessRegistry,
  StrategicReadinessEvaluation,
  StrategicReadinessTarget,
} from "./strategicReadinessTypes.ts";

const TARGETS: readonly StrategicReadinessTarget[] = Object.freeze([
  "mvp",
  "demo",
  "pilot",
  "production_candidate",
]);

const TARGET_REQUIRED_FEATURES: Record<StrategicReadinessTarget, readonly string[]> = {
  mvp: ["ingestion", "mapping", "fragility", "simulation", "decision_intelligence", "executive_panels", "chat_intelligence"],
  demo: ["mapping", "fragility", "simulation", "decision_intelligence", "executive_panels", "scenario_workflows", "chat_intelligence"],
  pilot: FEATURE_READINESS_IDS,
  production_candidate: FEATURE_READINESS_IDS,
};

const TARGET_REQUIRED_DIMENSIONS: Record<StrategicReadinessTarget, readonly string[]> = {
  mvp: ["development_status", "test_status", "runtime_stability", "integration_status", "ux_readiness", "executive_readiness"],
  demo: ["runtime_stability", "ux_readiness", "executive_readiness", "operational_readiness"],
  pilot: READINESS_DIMENSIONS,
  production_candidate: READINESS_DIMENSIONS,
};

function stateLabel(state: ReadinessState): string {
  return state.replace("_", " ");
}

function collectSignalIssues(signal: ReadinessSignal): string[] {
  if (signal.state === "ready") return [];
  const suffix = signal.blockers.length > 0 ? `: ${signal.blockers.join("; ")}` : "";
  return [`${signal.label} is ${stateLabel(signal.state)}${suffix}`];
}

function collectFeatureIssues(feature: FeatureReadinessEntry): string[] {
  if (feature.readinessState === "ready") return [];
  const suffix = feature.blockers.length > 0 ? `: ${feature.blockers.join("; ")}` : "";
  return [`${feature.label} is ${stateLabel(feature.readinessState)}${suffix}`];
}

function nextStepsFor(state: ReadinessState, blockers: readonly string[], incomplete: readonly string[]): string[] {
  if (state === "ready") return ["Keep readiness evidence current before executive exposure."];
  if (state === "blocked") {
    return blockers.slice(0, 3).map((item) => `Resolve blocker: ${item}`);
  }
  return incomplete.slice(0, 3).map((item) => `Complete readiness evidence: ${item}`);
}

export function evaluateStrategicReadinessTarget(
  registry: RuntimeReadinessRegistry,
  target: StrategicReadinessTarget
): StrategicReadinessEvaluation {
  const dimensionSignals = TARGET_REQUIRED_DIMENSIONS[target].map(
    (dimension) => registry.platform.dimensions[dimension as keyof typeof registry.platform.dimensions]
  );
  const featureSignals = TARGET_REQUIRED_FEATURES[target].map(
    (featureId) => registry.features.features[featureId as keyof typeof registry.features.features]
  );

  const states = [
    ...dimensionSignals.map((signal) => signal.state),
    ...featureSignals.map((feature) => feature.readinessState),
  ];
  if (registry.runtimeHealth.status === "critical") states.push("blocked");
  else if (registry.runtimeHealth.status === "degraded") states.push("not_ready");
  else if (registry.runtimeHealth.status === "warning") states.push("in_progress");

  const state = deriveAggregateReadinessState(states);
  const blockers = [
    ...dimensionSignals.flatMap((signal) => signal.blockers),
    ...featureSignals.flatMap((feature) => feature.blockers),
    ...registry.runtimeHealth.blockers,
  ].filter(Boolean);
  const incomplete = [
    ...dimensionSignals.flatMap(collectSignalIssues),
    ...featureSignals.flatMap(collectFeatureIssues),
    ...registry.runtimeHealth.warnings,
  ];
  const confidence = deriveAggregateConfidence([
    ...dimensionSignals.map((signal) => ({ confidence: signal.confidence, state: signal.state })),
    ...featureSignals.map((feature) => ({ confidence: feature.confidence, state: feature.readinessState })),
    { confidence: registry.runtimeHealth.confidence, state },
  ]);
  const highestRisk = blockers[0] ?? incomplete[0] ?? null;

  return {
    target,
    state,
    confidence: clampReadinessConfidence(confidence),
    blockers: Object.freeze(Array.from(new Set(blockers)).slice(0, 8)),
    incomplete: Object.freeze(Array.from(new Set(incomplete)).slice(0, 10)),
    highestRisk,
    shouldHappenNext: Object.freeze(nextStepsFor(state, blockers, incomplete)),
    decisionAuthority: "evaluation_only",
  };
}

export function evaluateStrategicReadiness(
  registry: RuntimeReadinessRegistry
): Readonly<Record<StrategicReadinessTarget, StrategicReadinessEvaluation>> {
  const evaluations = {} as Record<StrategicReadinessTarget, StrategicReadinessEvaluation>;
  for (const target of TARGETS) {
    evaluations[target] = evaluateStrategicReadinessTarget(registry, target);
  }
  return Object.freeze(evaluations);
}

export function buildExecutiveReadinessSnapshot(
  registry: RuntimeReadinessRegistry
): ExecutiveReadinessSnapshot {
  const evaluations = evaluateStrategicReadiness(registry);
  const mvpReady = evaluations.mvp.state === "ready";
  const demoReady = evaluations.demo.state === "ready";
  const incomplete = Array.from(new Set([
    ...evaluations.mvp.incomplete,
    ...evaluations.demo.incomplete,
  ])).slice(0, 8);
  const blocked = Array.from(new Set([
    ...evaluations.mvp.blockers,
    ...evaluations.demo.blockers,
    ...evaluations.pilot.blockers,
  ])).slice(0, 8);
  const highestRisk = blocked[0] ?? evaluations.mvp.highestRisk ?? evaluations.demo.highestRisk ?? null;
  const shouldHappenNext = blocked.length > 0
    ? blocked.slice(0, 3).map((item) => `Resolve blocker: ${item}`)
    : Array.from(new Set([
        ...evaluations.mvp.shouldHappenNext,
        ...evaluations.demo.shouldHappenNext,
      ])).slice(0, 4);
  const answer = mvpReady && demoReady
    ? "Nexora is ready for MVP and executive demo evaluation."
    : "Nexora is not fully ready; readiness gaps remain before executive exposure.";
  const signature = stableSignature([
    "d10-executive-readiness-snapshot",
    registry.signature,
    mvpReady,
    demoReady,
    highestRisk ?? "none",
  ]);

  return {
    snapshotId: stableSignature(["d10-executive-readiness-snapshot", registry.organizationId]).slice(0, 56),
    organizationId: registry.organizationId,
    generatedAt: registry.generatedAt,
    isNexoraReady: mvpReady && demoReady && blocked.length === 0,
    answer,
    incomplete: Object.freeze(incomplete),
    blocked: Object.freeze(blocked),
    highestRisk,
    shouldHappenNext: Object.freeze(shouldHappenNext),
    evaluations,
    signature,
  };
}
