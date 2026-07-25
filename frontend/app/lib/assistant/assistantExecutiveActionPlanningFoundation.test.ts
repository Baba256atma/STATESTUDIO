import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveActionPlanningFoundation } from "./assistantExecutiveActionPlanningFoundation.ts";

const files = [
  "assistantExecutiveActionPlanningFoundation.boundaries.ts",
  "assistantExecutiveActionPlanningFoundation.capabilities.ts",
  "assistantExecutiveActionPlanningFoundation.constants.ts",
  "assistantExecutiveActionPlanningFoundation.contracts.ts",
  "assistantExecutiveActionPlanningFoundation.identity.ts",
  "assistantExecutiveActionPlanningFoundation.test.ts",
  "assistantExecutiveActionPlanningFoundation.ts",
  "assistantExecutiveActionPlanningFoundation.types.ts",
];

test("ASSISTANT-7:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-7:1 publishes canonical Foundation identity", () => {
  const foundation = AssistantExecutiveActionPlanningFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-7:1/ExecutiveActionPlanningFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.assistant.executive-action-planning.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(
    foundation.identity.sourceObjectContextManagement,
    "ASSISTANT-6:9/ObjectContextManagementPublicIndex",
  );
});

test("ASSISTANT-7:1 publishes exact contracts, capabilities, and vocabularies", () => {
  const foundation = AssistantExecutiveActionPlanningFoundation;
  assert.equal(foundation.contracts.length, 16);
  assert.equal(foundation.capabilities.length, 12);
  assert.equal(foundation.actionPlanCategories.length, 12);
  assert.equal(foundation.plannedActionCategories.length, 12);
  assert.equal(foundation.actionPriorities.length, 4);
  assert.equal(foundation.actionTimeHorizons.length, 7);
  assert.equal(foundation.dependencyConcepts.length, 10);
  assert.equal(foundation.planningContextReferences.length, 16);
  assert.equal(foundation.lifecycle.length, 10);
  assert.equal(foundation.policies.length, 18);
  assert.equal(foundation.invariants.length, 15);
  assert.equal(foundation.boundaries.length, 12);
  assert.equal(foundation.concepts.length, 12);
  assert.equal(foundation.responsibilities.length, 20);
  assert.equal(
    foundation.contracts.every(({ executable }) => !executable),
    true,
  );
  assert.equal(
    foundation.capabilities.every(({ implemented }) => !implemented),
    true,
  );
});

test("ASSISTANT-7:1 derives counts dynamically under Canonical Inventory Rule", () => {
  const foundation = AssistantExecutiveActionPlanningFoundation;
  assert.equal(
    foundation.constants.contractCount,
    foundation.contracts.length,
  );
  assert.equal(
    foundation.constants.capabilityCount,
    foundation.capabilities.length,
  );
  assert.equal(foundation.constants.policyCount, foundation.policies.length);
  assert.equal(
    foundation.constants.boundaryCount,
    foundation.boundaries.length,
  );
  assert.equal(
    foundation.constants.actionPlanCategoryCount,
    foundation.actionPlanCategories.length,
  );
  assert.equal(
    foundation.constants.plannedActionCategoryCount,
    foundation.plannedActionCategories.length,
  );
  assert.equal(
    foundation.constants.actionPriorityCount,
    foundation.actionPriorities.length,
  );
  assert.equal(
    foundation.constants.actionTimeHorizonCount,
    foundation.actionTimeHorizons.length,
  );
  assert.equal(
    foundation.constants.dependencyConceptCount,
    foundation.dependencyConcepts.length,
  );
  assert.equal(foundation.canonicalInventoryRuleSatisfied, true);
  assert.equal(
    foundation.inventory.contractCount,
    foundation.contracts.length,
  );
  assert.equal(
    foundation.inventory.capabilityCount,
    foundation.capabilities.length,
  );
});

test("ASSISTANT-7:1 identities are unique, ordered, and deeply immutable", () => {
  const foundation = AssistantExecutiveActionPlanningFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.concepts,
    ...foundation.actionPlanCategories,
    ...foundation.plannedActionCategories,
    ...foundation.actionPriorities,
    ...foundation.actionTimeHorizons,
    ...foundation.dependencyConcepts,
    ...foundation.planningContextReferences,
    ...foundation.lifecycle,
    ...foundation.policies,
    ...foundation.invariants,
    ...foundation.boundaries,
    ...foundation.prohibitedImplementations,
  ];
  assert.equal(
    new Set(records.map((record) =>
      "id" in record ? record.id : record)).size,
    records.length,
  );
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
  assert.deepEqual(
    foundation.contracts.map(({ order }) => order),
    foundation.contracts.map((_, index) => index + 1),
  );
  assert.deepEqual(
    foundation.capabilities.map(({ order }) => order),
    foundation.capabilities.map((_, index) => index + 1),
  );
  assert.deepEqual(
    foundation.lifecycle.map(({ name }) => name),
    [
      "Declared",
      "Context Established",
      "Objective Defined",
      "Actions Structured",
      "Dependencies Described",
      "Plan Prepared",
      "Plan Reviewed",
      "Plan Confirmed",
      "Completed",
      "Archived",
    ],
  );
});

test("ASSISTANT-7:1 consumes Public Index only and has no prohibited behavior", () => {
  const foundation = AssistantExecutiveActionPlanningFoundation;
  const source = readFileSync(
    new URL(
      "./assistantExecutiveActionPlanningFoundation.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantObjectContextManagementPublicIndex.ts",
    "./assistantExecutiveActionPlanningFoundation.boundaries.ts",
    "./assistantExecutiveActionPlanningFoundation.capabilities.ts",
    "./assistantExecutiveActionPlanningFoundation.constants.ts",
    "./assistantExecutiveActionPlanningFoundation.contracts.ts",
    "./assistantExecutiveActionPlanningFoundation.identity.ts",
  ]);
  assert.equal(
    source.includes("assistantObjectContextManagementFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementModel"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementPlatform"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementCertification"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementFreeze"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestration"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(foundation.upstreamDependencies, [
    "ASSISTANT-6:9 Object & Context Management Public Index",
  ]);
  assert.equal(
    foundation.objectContextManagementPublicIndex.id,
    "ASSISTANT-6:9/ObjectContextManagementPublicIndex",
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.planningEngine, false);
  assert.equal(foundation.taskExecution, false);
  assert.equal(foundation.scheduling, false);
  assert.equal(foundation.assignment, false);
  assert.equal(foundation.opsTaskCreation, false);
  assert.equal(foundation.workflowExecution, false);
  assert.equal(foundation.services, false);
  assert.equal(foundation.factories, false);
  assert.equal(foundation.builders, false);
  assert.equal(foundation.executors, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.stateMutation, false);
  assert.deepEqual(foundation.publicApiSurface, [
    "AssistantExecutiveActionPlanningFoundation",
  ]);
});
