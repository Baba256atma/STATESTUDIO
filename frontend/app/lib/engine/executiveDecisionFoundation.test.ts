import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveDecisionPublicApi.ts";
import {
  ExecutiveDecisionCapabilityRegistry,
  ExecutiveDecisionDependencyMap,
  ExecutiveDecisionFoundation,
  ExecutiveDecisionOwnershipMap,
  getExecutiveDecisionFoundation,
  getExecutiveDecisionMetadata,
} from "./executiveDecisionPublicApi.ts";

test("publishes exactly six approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveDecisionCapabilityRegistry",
    "ExecutiveDecisionDependencyMap",
    "ExecutiveDecisionFoundation",
    "ExecutiveDecisionOwnershipMap",
    "getExecutiveDecisionFoundation",
    "getExecutiveDecisionMetadata",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 6);
});

test("foundation metadata is deeply frozen and ready for registry", () => {
  assert.equal(Object.isFrozen(ExecutiveDecisionFoundation), true);
  assert.equal(ExecutiveDecisionFoundation.id, "ENG-7:1");
  assert.equal(ExecutiveDecisionFoundation.name, "Executive Decision Engine Foundation");
  assert.equal(ExecutiveDecisionFoundation.namespace, "nexora.engine.executive.decision.foundation");
  assert.equal(ExecutiveDecisionFoundation.version, "1.0.0");
  assert.equal(ExecutiveDecisionFoundation.owner, "ENG-7");
  assert.equal(ExecutiveDecisionFoundation.metadataOnly, true);
  assert.equal(ExecutiveDecisionFoundation.runtimeFree, true);
  assert.equal(ExecutiveDecisionFoundation.aiFree, true);
  assert.equal(ExecutiveDecisionFoundation.nextPhase, "ENG-7:2");
  assert.equal(ExecutiveDecisionFoundation.status.readyForRegistry, "ReadyForRegistry");
  assert.equal(Object.isFrozen(ExecutiveDecisionFoundation.lifecycle), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionFoundation.supportedCapabilities), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionFoundation.architecturalBoundaries), true);
});

test("capability registry contains exactly eight required capabilities", () => {
  assert.equal(ExecutiveDecisionCapabilityRegistry.length, 8);
  assert.equal(Object.isFrozen(ExecutiveDecisionCapabilityRegistry), true);
  assert.equal(ExecutiveDecisionCapabilityRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveDecisionCapabilityRegistry.map(({ id }) => id)).size, 8);
  assert.deepEqual(ExecutiveDecisionCapabilityRegistry.map(({ name }) => name), [
    "Final Decision Selection",
    "Alternative Ranking",
    "Confidence Publication",
    "Risk Publication",
    "Tradeoff Publication",
    "Decision Trace Publication",
    "Recommendation Packaging",
    "Decision Metadata Publication",
  ]);
  assert.equal(ExecutiveDecisionFoundation.supportedCapabilities, ExecutiveDecisionCapabilityRegistry);
});

test("ownership map declares decision ownership and exclusions", () => {
  assert.equal(Object.isFrozen(ExecutiveDecisionOwnershipMap), true);
  assert.equal(ExecutiveDecisionOwnershipMap.owner, "ENG-7");
  assert.ok(ExecutiveDecisionOwnershipMap.owns.includes("executive decision metadata"));
  assert.ok(ExecutiveDecisionOwnershipMap.owns.includes("decision contracts"));
  assert.ok(ExecutiveDecisionOwnershipMap.owns.includes("decision publication"));
  assert.ok(ExecutiveDecisionOwnershipMap.owns.includes("decision lifecycle"));
  assert.ok(ExecutiveDecisionOwnershipMap.neverOwns.includes("reasoning"));
  assert.ok(ExecutiveDecisionOwnershipMap.neverOwns.includes("planning"));
  assert.ok(ExecutiveDecisionOwnershipMap.neverOwns.includes("orchestration"));
  assert.ok(ExecutiveDecisionOwnershipMap.neverOwns.includes("execution"));
  assert.ok(ExecutiveDecisionOwnershipMap.neverOwns.includes("persistence"));
  assert.equal(ExecutiveDecisionOwnershipMap.boundary.producesDecisionsOnly, true);
  assert.equal(ExecutiveDecisionOwnershipMap.boundary.performsReasoning, false);
  assert.equal(ExecutiveDecisionOwnershipMap.boundary.performsAiInference, false);
  assert.equal(ExecutiveDecisionOwnershipMap.reasoningOwner, "ENG-6");
  assert.equal(ExecutiveDecisionOwnershipMap.orchestrationOwner, "ENG-8");
  assert.equal(ExecutiveDecisionFoundation.ownership, ExecutiveDecisionOwnershipMap);
});

test("dependency map encodes allowed and forbidden boundaries", () => {
  assert.equal(Object.isFrozen(ExecutiveDecisionDependencyMap), true);
  assert.deepEqual([...ExecutiveDecisionDependencyMap.allowedIncoming], [
    "ENG-1",
    "ENG-2",
    "ENG-3",
    "ENG-4",
    "ENG-5",
    "ENG-6",
  ]);
  assert.deepEqual([...ExecutiveDecisionDependencyMap.allowedOutgoing], [
    "ENG-8",
    "Advisor",
  ]);
  assert.ok(ExecutiveDecisionDependencyMap.forbiddenTargets.includes("BUS internals"));
  assert.ok(ExecutiveDecisionDependencyMap.forbiddenTargets.includes("OPS internals"));
  assert.ok(ExecutiveDecisionDependencyMap.forbiddenTargets.includes("UI"));
  assert.ok(ExecutiveDecisionDependencyMap.forbiddenTargets.includes("Database"));
  assert.equal(ExecutiveDecisionDependencyMap.incoming.length, 6);
  assert.equal(ExecutiveDecisionDependencyMap.outgoing.length, 2);
  assert.equal(ExecutiveDecisionDependencyMap.forbidden.length, 6);
  assert.equal(ExecutiveDecisionDependencyMap.policy.runtimeInvocation, "Prohibited");
  assert.equal(ExecutiveDecisionFoundation.dependencies, ExecutiveDecisionDependencyMap);
});

test("helpers return immutable foundation and metadata", () => {
  assert.equal(getExecutiveDecisionFoundation(), ExecutiveDecisionFoundation);
  assert.equal(getExecutiveDecisionMetadata().platformId, "ENG-7:1");
  assert.equal(getExecutiveDecisionMetadata().nextPhase, "ENG-7:2");
  assert.equal(Object.isFrozen(getExecutiveDecisionMetadata()), true);
  assert.equal(getExecutiveDecisionFoundation(), getExecutiveDecisionFoundation());
  assert.equal(getExecutiveDecisionMetadata(), getExecutiveDecisionMetadata());
});

test("public surface excludes runtime, AI, and execution APIs", () => {
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect|Runner/i.test(name)
    )),
    true,
  );
});
