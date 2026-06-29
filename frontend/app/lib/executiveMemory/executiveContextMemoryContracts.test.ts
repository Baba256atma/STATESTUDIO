import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import { initializeExecutiveMemoryPlatform, resetExecutiveMemoryPlatformForTests } from "./executiveMemoryPlatform.ts";
import { registerExecutiveMemoryProvider } from "./executiveMemoryRegistry.ts";
import { validateExecutiveMemoryRecordShape } from "./executiveMemoryRecordValidation.ts";
import {
  initializeExecutiveMemoryRetrievalEngine,
  resetExecutiveMemoryRetrievalEngineForTests,
} from "./executiveMemoryRetrievalEngine.ts";
import {
  createExecutiveMemory,
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "./executiveMemoryStorageEngine.ts";
import {
  initializeExecutiveIntentMemoryLinkEngine,
  resetExecutiveIntentMemoryLinkEngineForTests,
} from "./executiveIntentMemoryLinkEngine.ts";
import {
  initializeExecutiveScenarioMemoryEngine,
  resetExecutiveScenarioMemoryEngineForTests,
} from "./executiveScenarioMemoryEngine.ts";
import {
  initializeExecutiveDecisionMemoryEngine,
  registerExecutiveDecisionTarget,
  resetExecutiveDecisionMemoryEngineForTests,
} from "./executiveDecisionMemoryEngine.ts";
import {
  EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_CONTEXT_MEMORY_ERROR_CODES,
  EXECUTIVE_CONTEXT_MEMORY_SCHEMA_VERSION,
} from "./executiveContextMemoryConstants.ts";
import {
  createExecutiveBusinessContext,
  createExecutiveContextMetadata,
  createExecutiveContextMemoryVersion,
  createExecutiveContextReference,
  createExecutiveContextSnapshot,
  createExecutiveExternalContext,
  createExecutiveExternalEvent,
  createExecutiveMarketContext,
  createExecutiveOrganizationContext,
  createExecutivePolicyContext,
  createExecutivePolicyEntry,
  createExecutiveResourceContext,
  createExecutiveResourceEntry,
  createExecutiveStakeholderContext,
} from "./executiveContextMemoryModel.ts";
import {
  archiveContextMemory,
  createContextMemory,
  getContextMemories,
  getContextMemoryByBusinessContext,
  getContextMemoryByDecision,
  getContextMemoryByExternalEvent,
  getContextMemoryByGoal,
  getContextMemoryById,
  getContextMemoryByIntent,
  getContextMemoryByScenario,
  getContextMemoryByStakeholder,
  getContextMemoryByWorkspace,
  getExecutiveContextMemoryStatistics,
  hasContextMemory,
  initializeExecutiveContextMemoryEngine,
  inspectContextMemoryGraph,
  registerExecutiveContextWorkspace,
  resetExecutiveContextMemoryEngineForTests,
  restoreContextMemory,
  updateContextMemory,
  validateContextMemory,
} from "./executiveContextMemoryEngine.ts";
import {
  EXECUTIVE_CONTEXT_MEMORY_IDENTITY,
  EXECUTIVE_CONTEXT_MEMORY_SELF_MANIFEST,
  ExecutiveContextMemoryContracts,
} from "./executiveContextMemoryContracts.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";

function registerContextMemoryEnvironment() {
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "executive-memory-foundation-provider",
      label: "Foundation Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["decision", "goal", "evidence"] as const),
    }),
    FIXED_TIME
  );
  initializeExecutiveMemoryStorageEngine(FIXED_TIME);
  initializeExecutiveMemoryRetrievalEngine(FIXED_TIME);
  initializeExecutiveIntentMemoryLinkEngine(FIXED_TIME);
  initializeExecutiveScenarioMemoryEngine(FIXED_TIME);
  initializeExecutiveDecisionMemoryEngine(FIXED_TIME);
  initializeExecutiveContextMemoryEngine(FIXED_TIME);

  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);

  registerExecutiveDecisionTarget(
    Object.freeze({
      decisionId: record.decision!.decisionId,
      workspaceId: record.workspaceId,
      status: record.decision!.status,
    }),
    FIXED_TIME
  );

  registerExecutiveContextWorkspace(
    Object.freeze({ workspaceId: record.workspaceId, label: "Executive workspace" }),
    FIXED_TIME
  );

  return { record };
}

function buildContextMemoryInput(
  memoryId: string,
  env: ReturnType<typeof registerContextMemoryEnvironment>,
  snapshotId = `snapshot-${memoryId}`
) {
  const { record } = env;
  const businessContext = createExecutiveBusinessContext({
    contextId: record.businessContext!.contextId,
    domain: record.businessContext!.domain,
    businessUnit: record.businessContext!.businessUnit,
    department: record.businessContext!.department,
    market: record.businessContext!.market,
    description: record.businessContext!.description,
  });

  return Object.freeze({
    memoryId,
    workspaceId: record.workspaceId,
    goalId: record.goal!.goalId,
    intentId: record.intent!.intentId,
    scenarioId: record.scenario!.scenarioId,
    decisionId: record.decision!.decisionId,
    executiveMemoryIds: Object.freeze([record.id]),
    businessContext,
    marketContext: createExecutiveMarketContext({
      marketContextId: "market-eu-001",
      region: "europe",
      conditions: "Stable demand with moderate competition.",
      trend: "growing",
      description: "European market conditions at decision time.",
    }),
    organizationContext: createExecutiveOrganizationContext({
      organizationContextId: "org-001",
      structure: "matrix",
      maturity: "mature",
      capacity: "balanced",
      description: "Organization ready for international expansion.",
    }),
    resourceContext: createExecutiveResourceContext({
      resourceContextId: "resource-ctx-001",
      resources: Object.freeze([
        createExecutiveResourceEntry({
          resourceId: "resource-budget-001",
          label: "Expansion budget",
          availability: "available",
          capacity: "15M EUR",
        }),
      ]),
      description: "Available resources for expansion initiative.",
    }),
    stakeholders: Object.freeze([
      createExecutiveStakeholderContext({
        stakeholderId: "stakeholder-ceo-001",
        name: "Chief Executive Officer",
        role: "executive_sponsor",
        influence: "high",
        interest: "high",
      }),
    ]),
    policyContext: createExecutivePolicyContext({
      policyContextId: "policy-ctx-001",
      policies: Object.freeze([
        createExecutivePolicyEntry({
          policyId: "policy-gdpr-001",
          label: "GDPR compliance",
          scope: "europe",
          status: "active",
        }),
      ]),
      regulatorySummary: "GDPR and local regulatory requirements apply.",
    }),
    externalContext: createExecutiveExternalContext({
      externalContextId: "external-ctx-001",
      events: Object.freeze([
        createExecutiveExternalEvent({
          eventId: "event-competitor-entry-001",
          label: "Competitor market entry",
          source: "market-intelligence",
          occurredAt: FIXED_TIME,
          impact: "medium",
        }),
      ]),
      description: "External market events influencing context.",
    }),
    contextSnapshot: createExecutiveContextSnapshot({
      snapshotId,
      capturedAt: FIXED_TIME,
      label: "Expansion decision context",
      summary: "Business context at time of European expansion decision.",
    }),
    strategicPriorities: Object.freeze(["Revenue growth", "Market diversification"]),
    assumptions: Object.freeze(["Regulatory approval within 6 months."]),
    businessConstraints: Object.freeze(["Budget envelope approved."]),
    riskIds: Object.freeze(["risk-eu-expansion-001"]),
    kpiIds: Object.freeze(["kpi-revenue-001"]),
    timelineIds: Object.freeze(["timeline-expansion-001"]),
    references: Object.freeze([
      createExecutiveContextReference({
        referenceId: "ref-context-memory-001",
        referenceType: "business_context",
        targetId: businessContext.contextId,
        label: "Primary business context",
      }),
    ]),
    metadata: createExecutiveContextMetadata({
      title: "European expansion context memory",
      summary: "Structured context memory for executive review.",
      owner: "executive-owner",
      sourceModule: "executive-context-memory",
    }),
    version: createExecutiveContextMemoryVersion({
      versionId: `version-${memoryId}`,
      semanticVersion: "1.0.0",
      schemaVersion: EXECUTIVE_CONTEXT_MEMORY_SCHEMA_VERSION,
      contractVersion: EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
      createdAt: FIXED_TIME,
    }),
    createdAt: FIXED_TIME,
    updatedAt: FIXED_TIME,
  });
}

test.beforeEach(() => {
  resetExecutiveMemoryPlatformForTests();
  resetExecutiveMemoryStorageEngineForTests();
  resetExecutiveMemoryRetrievalEngineForTests();
  resetExecutiveIntentMemoryLinkEngineForTests();
  resetExecutiveScenarioMemoryEngineForTests();
  resetExecutiveDecisionMemoryEngineForTests();
  resetExecutiveContextMemoryEngineForTests();
});

test("exports APP-4:8 context memory identity and extends APP-4 phases", () => {
  assert.equal(EXECUTIVE_CONTEXT_MEMORY_IDENTITY.phaseId, "APP-4/8");
  assert.equal(EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION, "APP-4/8");
  assert.equal(ExecutiveContextMemoryContracts.version, "APP-4/8");
});

test("creates and retrieves context memory", () => {
  const env = registerContextMemoryEnvironment();
  const created = createContextMemory(buildContextMemoryInput("context-memory-001", env));
  assert.equal(created.success, true);
  assert.equal(hasContextMemory("context-memory-001"), true);
  const memory = getContextMemoryById("context-memory-001");
  assert.ok(memory);
  assert.equal(memory?.workspaceId, env.record.workspaceId);
});

test("updates context memory with metadata preservation", () => {
  const env = registerContextMemoryEnvironment();
  createContextMemory(buildContextMemoryInput("context-memory-update-001", env));
  const updated = updateContextMemory(
    "context-memory-update-001",
    Object.freeze({ metadata: Object.freeze({ summary: "Updated context memory summary." }) }),
    UPDATE_TIME
  );
  assert.equal(updated.success, true);
  assert.equal(updated.data?.metadata.summary, "Updated context memory summary.");
  assert.equal(updated.data?.metadata.owner, "executive-owner");
  assert.notEqual(updated.data?.version.semanticVersion, "1.0.0");
});

test("archives and restores context memory", () => {
  const env = registerContextMemoryEnvironment();
  createContextMemory(buildContextMemoryInput("context-memory-archive-001", env));
  const archived = archiveContextMemory("context-memory-archive-001", UPDATE_TIME);
  assert.equal(archived.success, true);
  assert.equal(archived.data?.lifecycle, "archived");

  const restored = restoreContextMemory("context-memory-archive-001", UPDATE_TIME);
  assert.equal(restored.success, true);
  assert.equal(restored.data?.lifecycle, "active");
});

test("rejects duplicate active context memory", () => {
  const env = registerContextMemoryEnvironment();
  const input = buildContextMemoryInput("context-memory-dup-a", env, "snapshot-dup-shared");
  assert.equal(createContextMemory(input).success, true);
  const duplicate = createContextMemory(
    Object.freeze({
      ...buildContextMemoryInput("context-memory-dup-b", env, "snapshot-dup-shared"),
    })
  );
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, EXECUTIVE_CONTEXT_MEMORY_ERROR_CODES.duplicateContext);
});

test("rejects unregistered workspace", () => {
  const env = registerContextMemoryEnvironment();
  const invalid = createContextMemory(
    Object.freeze({
      ...buildContextMemoryInput("context-memory-ws-invalid", env),
      workspaceId: "ws-unregistered-001",
    })
  );
  assert.equal(invalid.success, false);
  assert.match(invalid.reason, /not registered/i);
});

test("validates stakeholder and business context constraints", () => {
  const env = registerContextMemoryEnvironment();
  const created = createContextMemory(buildContextMemoryInput("context-memory-validation-001", env));
  assert.equal(created.success, true);

  const invalidStakeholder = Object.freeze({
    ...created.data!,
    stakeholders: Object.freeze([
      createExecutiveStakeholderContext({
        stakeholderId: "",
        name: "Invalid",
        role: "test",
        influence: "low",
        interest: "low",
      }),
    ]),
  });
  assert.equal(validateContextMemory(invalidStakeholder).valid, false);

  const invalidBusinessContext = Object.freeze({
    ...created.data!,
    businessContext: createExecutiveBusinessContext({
      contextId: "",
      domain: "growth",
      businessUnit: "international",
      department: "strategy",
      market: "europe",
      description: "Invalid context.",
    }),
  });
  assert.equal(validateContextMemory(invalidBusinessContext).valid, false);
});

test("validates external events", () => {
  const env = registerContextMemoryEnvironment();
  const created = createContextMemory(buildContextMemoryInput("context-memory-event-001", env));
  assert.equal(created.success, true);

  const invalid = Object.freeze({
    ...created.data!,
    externalContext: createExecutiveExternalContext({
      externalContextId: "external-invalid",
      events: Object.freeze([
        createExecutiveExternalEvent({
          eventId: "event-dup",
          label: "A",
          source: "test",
          occurredAt: FIXED_TIME,
          impact: "low",
        }),
        createExecutiveExternalEvent({
          eventId: "event-dup",
          label: "B",
          source: "test",
          occurredAt: FIXED_TIME,
          impact: "low",
        }),
      ]),
      description: "Duplicate events.",
    }),
  });
  assert.equal(validateContextMemory(invalid).valid, false);
});

test("queries context memory by workspace goal intent scenario decision business context stakeholder and external event", () => {
  const env = registerContextMemoryEnvironment();
  const input = buildContextMemoryInput("context-memory-query-001", env);
  createContextMemory(input);

  assert.equal(getContextMemoryByWorkspace(input.workspaceId).length, 1);
  assert.equal(getContextMemoryByGoal(input.goalId!).length, 1);
  assert.equal(getContextMemoryByIntent(input.intentId!).length, 1);
  assert.equal(getContextMemoryByScenario(input.scenarioId!).length, 1);
  assert.equal(getContextMemoryByDecision(input.decisionId!).length, 1);
  assert.equal(getContextMemoryByBusinessContext(input.businessContext.contextId).length, 1);
  assert.equal(getContextMemoryByStakeholder("stakeholder-ceo-001").length, 1);
  assert.equal(getContextMemoryByExternalEvent("event-competitor-entry-001").length, 1);
});

test("inspects context memory graph relationships", () => {
  const env = registerContextMemoryEnvironment();
  createContextMemory(buildContextMemoryInput("context-memory-graph-001", env));
  const graph = inspectContextMemoryGraph({ memoryId: "context-memory-graph-001" });
  assert.equal(graph.workspaceId, env.record.workspaceId);
  assert.ok(graph.linkedGoalIds.length > 0);
  assert.ok(graph.linkedBusinessContextIds.length > 0);
  assert.ok(graph.linkedStakeholderIds.length > 0);
  assert.ok(graph.linkedExternalEventIds.length > 0);
});

test("computes lightweight context memory statistics", () => {
  const env = registerContextMemoryEnvironment();
  createContextMemory(buildContextMemoryInput("context-memory-stats-001", env));
  archiveContextMemory("context-memory-stats-001", UPDATE_TIME);
  createContextMemory(buildContextMemoryInput("context-memory-stats-002", env));

  const stats = getExecutiveContextMemoryStatistics();
  assert.equal(stats.totalMemories, 2);
  assert.equal(stats.activeMemories, 1);
  assert.equal(stats.archivedMemories, 1);
  assert.ok(stats.memoriesByWorkspace[env.record.workspaceId] >= 2);
});

test("preserves deterministic ordering for context memory lists", () => {
  const env = registerContextMemoryEnvironment();
  createContextMemory(buildContextMemoryInput("context-memory-order-b", env, "snapshot-order-b"));
  createContextMemory(buildContextMemoryInput("context-memory-order-a", env, "snapshot-order-a"));
  assert.deepEqual(
    getContextMemories().map((entry) => entry.memoryId),
    ["context-memory-order-a", "context-memory-order-b"]
  );
});

test("validates APP-4:8 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_CONTEXT_MEMORY_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveContextMemoryEngine.ts",
      allowedFiles: EXECUTIVE_CONTEXT_MEMORY_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_CONTEXT_MEMORY_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid, true);
});

test("regression: APP-4:3 storage and APP-4:4 retrieval remain operational", () => {
  const env = registerContextMemoryEnvironment();
  assert.equal(hasContextMemory("missing"), false);
  assert.ok(env.record.id);
});

test("regression: APP-4:5 intent memory link engine initializes independently", () => {
  resetExecutiveContextMemoryEngineForTests();
  initializeExecutiveIntentMemoryLinkEngine(FIXED_TIME);
  assert.equal(initializeExecutiveContextMemoryEngine(FIXED_TIME).success, true);
});

test("regression: APP-4:6 scenario memory engine initializes independently", () => {
  resetExecutiveContextMemoryEngineForTests();
  initializeExecutiveScenarioMemoryEngine(FIXED_TIME);
  assert.equal(initializeExecutiveContextMemoryEngine(FIXED_TIME).success, true);
});

test("regression: APP-4:7 decision memory engine initializes independently", () => {
  resetExecutiveContextMemoryEngineForTests();
  initializeExecutiveDecisionMemoryEngine(FIXED_TIME);
  assert.equal(initializeExecutiveContextMemoryEngine(FIXED_TIME).success, true);
});

test("regression: APP-2 scenario identity contracts remain valid", () => {
  const scenario = resolveScenarioIdentityExample();
  assert.equal(validateScenarioIdentityShape(scenario).valid, true);
});
