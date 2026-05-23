import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildExecutiveReadinessSnapshot,
  buildFeatureReadinessRegistry,
  buildReadinessDomainModel,
  buildRuntimeReadinessRegistry,
  deriveAggregateReadinessState,
  evaluateStrategicReadiness,
  validateExecutiveReadinessSnapshot,
  validateRuntimeReadinessRegistry,
} from "./index.ts";
import type { FeatureReadinessId, ReadinessDimension, RuntimeReadinessInput } from "./index.ts";

const allDimensionsReady = Object.fromEntries(
  [
    "development_status",
    "test_status",
    "runtime_stability",
    "integration_status",
    "deployment_status",
    "ux_readiness",
    "executive_readiness",
    "operational_readiness",
  ].map((dimension) => [
    dimension,
    { state: "ready", confidence: 0.9, validationStatus: "validated", notes: ["validated"] },
  ])
) as RuntimeReadinessInput["dimensions"];

const allFeaturesReady = Object.fromEntries(
  [
    "ingestion",
    "mapping",
    "fragility",
    "simulation",
    "decision_intelligence",
    "executive_panels",
    "scenario_workflows",
    "connectors",
    "chat_intelligence",
  ].map((featureId) => [
    featureId,
    { readinessState: "ready", confidence: 0.88, validationStatus: "validated", notes: ["validated"] },
  ])
) as RuntimeReadinessInput["features"];

function readyRegistry(overrides: RuntimeReadinessInput = {}) {
  return buildRuntimeReadinessRegistry({
    organizationId: "d10-ready-org",
    dimensions: allDimensionsReady,
    features: allFeaturesReady,
    runtimeChecks: [
      {
        id: "runtime",
        label: "Runtime",
        health: "healthy",
        summary: "Runtime health checks are clean.",
      },
    ],
    now: 900_000,
    ...overrides,
  });
}

describe("D10 strategic readiness foundation", () => {
  it("aggregates readiness states with blocked precedence", () => {
    assert.equal(deriveAggregateReadinessState(["ready", "blocked", "in_progress"]), "blocked");
    assert.equal(deriveAggregateReadinessState(["ready", "not_ready", "in_progress"]), "not_ready");
    assert.equal(deriveAggregateReadinessState(["ready", "in_progress"]), "in_progress");
    assert.equal(deriveAggregateReadinessState(["ready", "ready"]), "ready");
  });

  it("builds canonical domain and feature registries", () => {
    const domain = buildReadinessDomainModel({
      runtime_stability: { state: "ready", confidence: 0.8, validationStatus: "validated" },
    });
    const features = buildFeatureReadinessRegistry({
      ingestion: { readinessState: "ready", confidence: 0.7, validationStatus: "validated" },
    });

    assert.equal(domain.dimensions.runtime_stability.state, "ready");
    assert.equal(domain.aggregateState, "not_ready");
    assert.equal(features.features.ingestion.readinessState, "ready");
    assert.equal(features.aggregateState, "not_ready");
  });

  it("produces demo and MVP readiness for clean runtime evidence", () => {
    const registry = readyRegistry();
    const evaluations = evaluateStrategicReadiness(registry);
    const snapshot = buildExecutiveReadinessSnapshot(registry);

    assert.equal(validateRuntimeReadinessRegistry(registry), true);
    assert.equal(evaluations.mvp.state, "ready");
    assert.equal(evaluations.demo.state, "ready");
    assert.equal(snapshot.isNexoraReady, true);
    assert.equal(validateExecutiveReadinessSnapshot(snapshot), true);
  });

  it("propagates blocked feature state into strategic and executive snapshots", () => {
    const registry = readyRegistry({
      features: {
        ...allFeaturesReady,
        connectors: {
          readinessState: "blocked",
          confidence: 0.62,
          validationStatus: "blocked",
          blockers: ["Connector catalog requires pilot-safe validation."],
        },
      },
    });
    const evaluations = evaluateStrategicReadiness(registry);
    const snapshot = buildExecutiveReadinessSnapshot(registry);

    assert.equal(evaluations.pilot.state, "blocked");
    assert.equal(evaluations.production_candidate.state, "blocked");
    assert.equal(evaluations.demo.state, "ready");
    assert.equal(snapshot.blocked.includes("Connector catalog requires pilot-safe validation."), true);
  });

  it("propagates confidence and runtime health warnings deterministically", () => {
    const input: RuntimeReadinessInput = {
      organizationId: "d10-deterministic-org",
      dimensions: {
        ...(allDimensionsReady as Partial<Record<ReadinessDimension, object>>),
        test_status: { state: "in_progress", confidence: 0.54, validationStatus: "validating" },
      } as RuntimeReadinessInput["dimensions"],
      features: {
        ...(allFeaturesReady as Partial<Record<FeatureReadinessId, object>>),
        chat_intelligence: { readinessState: "in_progress", confidence: 0.5, validationStatus: "validating" },
      } as RuntimeReadinessInput["features"],
      runtimeChecks: [
        {
          id: "chat-runtime",
          label: "Chat runtime",
          health: "warning",
          summary: "Chat runtime requires repeat validation.",
        },
      ],
      now: 910_000,
    };

    const first = buildExecutiveReadinessSnapshot(buildRuntimeReadinessRegistry(input));
    const second = buildExecutiveReadinessSnapshot(buildRuntimeReadinessRegistry(input));

    assert.equal(first.signature, second.signature);
    assert.equal(first.evaluations.mvp.state, "in_progress");
    assert.equal(first.evaluations.mvp.confidence < 0.9, true);
    assert.equal(first.incomplete.includes("Test status is in progress"), true);
    assert.equal(first.incomplete.includes("Chat runtime requires repeat validation."), true);
  });

  it("critical runtime health blocks demo readiness without taking action", () => {
    const registry = readyRegistry({
      runtimeChecks: [
        {
          id: "runtime",
          label: "Runtime",
          health: "critical",
          summary: "Runtime health critical.",
        },
      ],
    });
    const demo = evaluateStrategicReadiness(registry).demo;

    assert.equal(demo.state, "blocked");
    assert.equal(demo.blockers.includes("Runtime health critical."), true);
    assert.equal(demo.decisionAuthority, "evaluation_only");
  });
});
