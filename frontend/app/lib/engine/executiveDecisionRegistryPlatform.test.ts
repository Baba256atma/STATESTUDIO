import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveDecisionRegistryPlatform.ts";
import {
  ExecutiveDecisionCapabilityRegistryPlatform,
  ExecutiveDecisionDomainRegistry,
  ExecutiveDecisionLifecycleRegistry,
  ExecutiveDecisionOutputRegistry,
  ExecutiveDecisionRegistryMetadata,
  ExecutiveDecisionRegistryPlatform,
  ExecutiveDecisionTypeRegistry,
  getExecutiveDecisionCapabilityById,
  getExecutiveDecisionDomainById,
  getExecutiveDecisionLifecycleStateById,
  getExecutiveDecisionOutputById,
  getExecutiveDecisionRegistryMetadata,
  getExecutiveDecisionRegistryPlatform,
  getExecutiveDecisionRegistrySummary,
  getExecutiveDecisionTypeById,
} from "./executiveDecisionRegistryPlatform.ts";
import {
  ExecutiveDecisionCapabilityRegistry as FoundationCapabilities,
  ExecutiveDecisionDependencyMap,
  ExecutiveDecisionOwnershipMap,
} from "./executiveDecisionPublicApi.ts";

const requiredFiles = Object.freeze([
  "executiveDecisionRegistryTypes.ts",
  "executiveDecisionDomainRegistry.ts",
  "executiveDecisionTypeRegistry.ts",
  "executiveDecisionCapabilityRegistryPlatform.ts",
  "executiveDecisionOutputLifecycleRegistry.ts",
  "executiveDecisionOwnershipDependencyRegistry.ts",
  "executiveDecisionRegistryPlatform.ts",
  "executiveDecisionRegistryPlatform.test.ts",
] as const);

const approvedRegistryExports = Object.freeze([
  "ExecutiveDecisionRegistryPlatform",
  "ExecutiveDecisionDomainRegistry",
  "ExecutiveDecisionTypeRegistry",
  "ExecutiveDecisionCapabilityRegistryPlatform",
  "ExecutiveDecisionOutputRegistry",
  "ExecutiveDecisionLifecycleRegistry",
  "ExecutiveDecisionRegistryMetadata",
] as const);

test("exactly eight required ENG-7:2 files are represented", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 8);
});

test("publishes exactly seven approved registry exports", () => {
  for (const name of approvedRegistryExports) {
    assert.ok(Object.hasOwn(publicApi, name));
  }
  assert.equal(approvedRegistryExports.length, 7);
});

test("ENG-7:1 is consumed through public API and foundation capabilities align", () => {
  assert.equal(ExecutiveDecisionRegistryMetadata.previousPhase, "ENG-7:1");
  assert.equal(ExecutiveDecisionRegistryMetadata.foundationCapabilityCount, 8);
  assert.equal(FoundationCapabilities.length, 8);
  assert.equal(ExecutiveDecisionOwnershipMap.owner, "ENG-7");
  assert.deepEqual([...ExecutiveDecisionDependencyMap.allowedIncoming], [
    "ENG-1",
    "ENG-2",
    "ENG-3",
    "ENG-4",
    "ENG-5",
    "ENG-6",
  ]);
  assert.equal(
    ExecutiveDecisionCapabilityRegistryPlatform.every(({ foundationCapabilityId }) =>
      FoundationCapabilities.some(({ id }) => id === foundationCapabilityId)
    ),
    true,
  );
});

test("registries are deeply frozen with required counts and unique ids", () => {
  assert.equal(Object.isFrozen(ExecutiveDecisionRegistryPlatform), true);
  assert.equal(ExecutiveDecisionDomainRegistry.length, 12);
  assert.equal(ExecutiveDecisionTypeRegistry.length, 16);
  assert.equal(ExecutiveDecisionCapabilityRegistryPlatform.length, 8);
  assert.equal(ExecutiveDecisionOutputRegistry.length, 8);
  assert.equal(ExecutiveDecisionLifecycleRegistry.length, 8);
  assert.equal(Object.isFrozen(ExecutiveDecisionDomainRegistry), true);
  assert.equal(ExecutiveDecisionDomainRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveDecisionTypeRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveDecisionCapabilityRegistryPlatform.every(Object.isFrozen), true);
  assert.equal(ExecutiveDecisionOutputRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveDecisionLifecycleRegistry.every(Object.isFrozen), true);

  const allIds = [
    ...ExecutiveDecisionDomainRegistry.map(({ id }) => id),
    ...ExecutiveDecisionTypeRegistry.map(({ id }) => id),
    ...ExecutiveDecisionCapabilityRegistryPlatform.map(({ id }) => id),
    ...ExecutiveDecisionOutputRegistry.map(({ id }) => id),
    ...ExecutiveDecisionLifecycleRegistry.map(({ id }) => id),
  ];
  assert.equal(new Set(allIds).size, allIds.length);

  assert.deepEqual(ExecutiveDecisionDomainRegistry.map(({ name }) => name), [
    "StrategicDecision",
    "OperationalDecision",
    "FinancialDecision",
    "ResourceDecision",
    "ProjectDecision",
    "RiskDecision",
    "PriorityDecision",
    "ApprovalDecision",
    "CorrectiveDecision",
    "EscalationDecision",
    "ScenarioDecision",
    "RecommendationDecision",
  ]);
  assert.deepEqual(ExecutiveDecisionTypeRegistry.map(({ publicName }) => publicName), [
    "Select",
    "Approve",
    "Reject",
    "Prioritize",
    "Defer",
    "Escalate",
    "Recommend",
    "Correct",
    "Allocate",
    "Reallocate",
    "Continue",
    "Pause",
    "Stop",
    "Replace",
    "AcceptRisk",
    "MitigateRisk",
  ]);
  assert.deepEqual(ExecutiveDecisionCapabilityRegistryPlatform.map(({ canonicalName }) => canonicalName), [
    "FinalDecisionSelection",
    "AlternativeRanking",
    "ConfidencePublication",
    "RiskPublication",
    "TradeoffPublication",
    "DecisionTracePublication",
    "RecommendationPackaging",
    "DecisionMetadataPublication",
  ]);
  assert.deepEqual(ExecutiveDecisionOutputRegistry.map(({ name }) => name), [
    "ExecutiveDecision",
    "RankedAlternativeSet",
    "DecisionConfidence",
    "DecisionRiskProfile",
    "DecisionTradeoffProfile",
    "DecisionTrace",
    "ExecutiveRecommendationPackage",
    "DecisionPublicationMetadata",
  ]);
  assert.deepEqual(ExecutiveDecisionLifecycleRegistry.map(({ name }) => name), [
    "Registered",
    "Candidate",
    "Evaluated",
    "Selected",
    "Approved",
    "Published",
    "Superseded",
    "Archived",
  ]);
});

test("ownership and dependency boundaries prevent duplication and match ENG-7:1", () => {
  const { ownership, dependencies, boundaryAlignment } = ExecutiveDecisionRegistryPlatform;
  assert.equal(ownership.filter(({ classification }) => classification === "Owns").length, 8);
  assert.ok(ownership.some(({ artifact }) => artifact === "decision-domain metadata"));
  assert.ok(ownership.some(({ artifact, classification }) => artifact === "reasoning" && classification === "DoesNotOwn"));
  assert.ok(ownership.some(({ artifact, classification }) => artifact === "planning" && classification === "DoesNotOwn"));
  assert.ok(ownership.some(({ artifact, classification }) => artifact === "orchestration" && classification === "DoesNotOwn"));
  assert.ok(ownership.some(({ artifact, classification }) => artifact === "persistence" && classification === "DoesNotOwn"));

  assert.equal(dependencies.filter(({ direction }) => direction === "Incoming").length, 6);
  assert.equal(dependencies.filter(({ direction }) => direction === "Outgoing").length, 2);
  assert.equal(dependencies.filter(({ direction }) => direction === "Forbidden").length, 10);
  assert.ok(dependencies.some(({ target }) => target === "BUS internal modules"));
  assert.ok(dependencies.some(({ target }) => target === "OPS internal modules"));
  assert.ok(dependencies.some(({ target }) => target === "UI modules"));
  assert.ok(dependencies.some(({ target }) => target === "Scene runtime"));
  assert.ok(dependencies.some(({ target }) => target === "EVE runtime"));
  assert.ok(dependencies.some(({ target }) => target === "database clients"));
  assert.deepEqual([...boundaryAlignment.foundationAllowedIncoming], [
    "ENG-1",
    "ENG-2",
    "ENG-3",
    "ENG-4",
    "ENG-5",
    "ENG-6",
  ]);
  assert.deepEqual([...boundaryAlignment.foundationAllowedOutgoing], ["ENG-8", "Advisor"]);
});

test("namespaces are stable and lifecycle terminal state is archived", () => {
  assert.equal(
    ExecutiveDecisionDomainRegistry.every(({ namespace }) =>
      namespace === "Nexora.Engine.ExecutiveDecision.Registry.Domain"
    ),
    true,
  );
  assert.equal(ExecutiveDecisionRegistryMetadata.namespace, "Nexora.Engine.ExecutiveDecision.Registry");
  const archived = getExecutiveDecisionLifecycleStateById("eng-7-lifecycle-archived");
  assert.ok(archived);
  assert.equal(archived.terminal, true);
  assert.equal(archived.allowedSuccessors.length, 0);
});

test("lookup helpers are deterministic and unknown ids return undefined", () => {
  assert.equal(
    getExecutiveDecisionDomainById("eng-7-domain-strategic"),
    ExecutiveDecisionDomainRegistry[0],
  );
  assert.equal(getExecutiveDecisionTypeById("eng-7-type-select"), ExecutiveDecisionTypeRegistry[0]);
  assert.equal(
    getExecutiveDecisionCapabilityById("eng-7-registry-capability-final-decision-selection"),
    ExecutiveDecisionCapabilityRegistryPlatform[0],
  );
  assert.equal(
    getExecutiveDecisionOutputById("eng-7-output-executive-decision"),
    ExecutiveDecisionOutputRegistry[0],
  );
  assert.equal(
    getExecutiveDecisionLifecycleStateById("eng-7-lifecycle-registered"),
    ExecutiveDecisionLifecycleRegistry[0],
  );
  assert.equal(getExecutiveDecisionDomainById("missing"), undefined);
  assert.equal(getExecutiveDecisionTypeById("missing"), undefined);
  assert.equal(getExecutiveDecisionCapabilityById("missing"), undefined);
  assert.equal(getExecutiveDecisionOutputById("missing"), undefined);
  assert.equal(getExecutiveDecisionLifecycleStateById("missing"), undefined);
  assert.equal(getExecutiveDecisionRegistryPlatform(), ExecutiveDecisionRegistryPlatform);
  assert.equal(getExecutiveDecisionRegistryMetadata(), ExecutiveDecisionRegistryMetadata);
});

test("registry summary values are accurate and readiness is ReadyForDecisionModel", () => {
  const summary = getExecutiveDecisionRegistrySummary();
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(summary.domainCount, 12);
  assert.equal(summary.typeCount, 16);
  assert.equal(summary.capabilityCount, 8);
  assert.equal(summary.outputCount, 8);
  assert.equal(summary.lifecycleStateCount, 8);
  assert.equal(summary.status, "Stable");
  assert.equal(summary.architectureMode, "MetadataOnly");
  assert.equal(summary.immutability, "DeeplyFrozen");
  assert.equal(summary.ownershipStatus, "OwnershipProtected");
  assert.equal(summary.dependencyStatus, "DependencySafe");
  assert.equal(summary.readiness, "ReadyForDecisionModel");
  assert.equal(ExecutiveDecisionRegistryPlatform.guarantees.readiness, "ReadyForDecisionModel");
  assert.equal(getExecutiveDecisionRegistrySummary(), summary);
});

test("no runtime, scoring, selection, BUS, OPS, UI, Scene, or persistence surfaces", () => {
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Scorer|Selector|Executor|LLM|OpenAI|Query|Reflect|Runner|Planner/i.test(name)
    )),
    true,
  );
  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "executiveDecisionRegistryPlatform.ts"),
    "utf8",
  );
  assert.equal(/from ["'].*\/(bus|ops|scene|eve|ui|persistence|database)/i.test(source), false);
  assert.equal(source.includes("executiveDecisionPublicApi.ts"), true);
  assert.equal(source.includes("executiveDecisionFoundation.ts"), false);
  assert.equal(source.includes("executiveDecisionCapabilityRegistry.ts"), false);
});
