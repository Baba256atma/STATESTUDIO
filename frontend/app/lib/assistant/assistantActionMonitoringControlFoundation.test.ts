import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantActionMonitoringControlFoundation } from "./assistantActionMonitoringControlFoundation.ts";

const files = [
  "assistantActionMonitoringControlBoundaries.ts",
  "assistantActionMonitoringControlCapabilities.ts",
  "assistantActionMonitoringControlContracts.ts",
  "assistantActionMonitoringControlFoundation.test.ts",
  "assistantActionMonitoringControlFoundation.ts",
  "assistantActionMonitoringControlIdentity.ts",
  "assistantActionMonitoringControlLifecycle.ts",
  "assistantActionMonitoringControlPolicies.ts",
];

const foundationModuleFiles = [
  "assistantActionMonitoringControlBoundaries.ts",
  "assistantActionMonitoringControlCapabilities.ts",
  "assistantActionMonitoringControlContracts.ts",
  "assistantActionMonitoringControlFoundation.ts",
  "assistantActionMonitoringControlIdentity.ts",
  "assistantActionMonitoringControlLifecycle.ts",
  "assistantActionMonitoringControlPolicies.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-9:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:1 publishes canonical Foundation identity", () => {
  const foundation = AssistantActionMonitoringControlFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-9:1/ExecutiveActionMonitoringControlFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.assistant.executive-action-monitoring-control.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.identity.status, "Foundation");
  assert.equal(foundation.identity.stage, "ReadyForRegistry");
  assert.equal(foundation.identity.readiness, "ReadyForRegistry");
  assert.equal(foundation.identity.layer, "Assistant");
  assert.equal(
    foundation.identity.domain,
    "Executive Action Monitoring & Control",
  );
  assert.equal(foundation.identity.canonical, true);
  assert.equal(foundation.identity.mutable, false);
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.stage, "ReadyForRegistry");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(
    foundation.identity.sourceExecutiveActionExecution,
    "ASSISTANT-8:9/ExecutiveActionExecutionPublicIndex",
  );
  assert.equal(foundation.metadata.namespace, foundation.identity.namespace);
});

test("ASSISTANT-9:1 publishes contracts, capabilities, lifecycle, and policies", () => {
  const foundation = AssistantActionMonitoringControlFoundation;
  assert.equal(foundation.contracts.length, 12);
  assert.equal(foundation.capabilities.length, 12);
  assert.equal(foundation.lifecycle.length, 8);
  assert.equal(foundation.policies.length, 8);
  assert.equal(foundation.boundaries.length, 19);
  assert.equal(foundation.responsibilities.length, 8);
  assert.deepEqual(
    foundation.contracts.map(({ name }) => name),
    [
      "Executive Action Monitor",
      "Monitoring Session",
      "Monitoring State",
      "Monitoring Result",
      "Control Decision",
      "Alert Definition",
      "Exception Record",
      "Progress Snapshot",
      "KPI Observation",
      "Feedback Record",
      "Monitoring Policy",
      "Monitoring Context",
    ],
  );
  assert.deepEqual(
    foundation.capabilities.map(({ name }) => name),
    [
      "Action Monitoring",
      "Progress Tracking",
      "KPI Observation",
      "Goal Observation",
      "Risk Observation",
      "Alert Detection",
      "Exception Observation",
      "Monitoring Aggregation",
      "Feedback Collection",
      "Executive Status Reporting",
      "Monitoring Snapshot Generation",
      "Monitoring Metadata Publication",
    ],
  );
  assert.deepEqual(
    foundation.lifecycle.map(({ name }) => name),
    [
      "Declared",
      "Registered",
      "MonitoringReady",
      "Observing",
      "Evaluating",
      "Controlled",
      "Completed",
      "Archived",
    ],
  );
  assert.deepEqual(
    foundation.policies.map(({ name }) => name),
    [
      "Immutable Foundation",
      "No Runtime Behaviour",
      "Metadata Only",
      "Deterministic Identity",
      "Registry Ownership",
      "Validation Ownership",
      "Freeze Compatibility",
      "Public Index Compatibility",
    ],
  );
  assert.equal(
    foundation.contracts.every(({ executable }) => !executable),
    true,
  );
  assert.equal(
    foundation.capabilities.every(({ implemented }) => !implemented),
    true,
  );
  assert.equal(
    foundation.lifecycle.every(({ transitionsAtRuntime }) =>
      !transitionsAtRuntime),
    true,
  );
  assert.equal(
    foundation.policies.every(({ enforceableAtRuntime }) =>
      !enforceableAtRuntime),
    true,
  );
});

test("ASSISTANT-9:1 metadata is immutable, unique, and dynamically counted", () => {
  const foundation = AssistantActionMonitoringControlFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.lifecycle,
    ...foundation.policies,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(
    new Set(foundation.contracts.map(({ name }) => name)).size,
    foundation.contracts.length,
  );
  assert.equal(
    new Set(foundation.capabilities.map(({ name }) => name)).size,
    foundation.capabilities.length,
  );
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(foundation.metadata), true);
  assert.equal(
    foundation.inventory.contractCount,
    foundation.contracts.length,
  );
  assert.equal(
    foundation.inventory.capabilityCount,
    foundation.capabilities.length,
  );
  assert.equal(
    foundation.inventory.lifecycleCount,
    foundation.lifecycle.length,
  );
  assert.equal(
    foundation.inventory.policyCount,
    foundation.policies.length,
  );
  assert.equal(
    foundation.inventory.boundaryCount,
    foundation.boundaries.length,
  );
  assert.deepEqual(
    foundation.contracts.map(({ order }) => order),
    foundation.contracts.map((_, index) => index + 1),
  );
  assert.deepEqual(
    foundation.boundaries.map(({ name }) => name),
    [
      "KPI Calculations",
      "Monitoring Engines",
      "Alert Engines",
      "Retry Logic",
      "Scheduling",
      "Automation",
      "Dashboards",
      "API Calls",
      "Services",
      "Databases",
      "AI",
      "Decision Engines",
      "Execution Engines",
      "Rendering",
      "Background Workers",
      "Event Buses",
      "Message Queues",
      "Network Access",
      "Persistence",
    ],
  );
});

test("ASSISTANT-9:1 consumes ASSISTANT-8 Public Index only and forbids runtime", () => {
  const foundation = AssistantActionMonitoringControlFoundation;
  assert.deepEqual(
    readImports("assistantActionMonitoringControlFoundation.ts"),
    [
      "./assistantActionMonitoringControlBoundaries.ts",
      "./assistantActionMonitoringControlCapabilities.ts",
      "./assistantActionMonitoringControlContracts.ts",
      "./assistantActionMonitoringControlIdentity.ts",
      "./assistantActionMonitoringControlLifecycle.ts",
      "./assistantActionMonitoringControlPolicies.ts",
      "./executiveActionExecutionPublicIndex.ts",
    ],
  );
  for (const fileName of foundationModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./executiveActionExecutionPublicIndex.ts"
        || importPath === "./assistantActionMonitoringControlIdentity.ts"
        || importPath === "./assistantActionMonitoringControlBoundaries.ts"
        || importPath === "./assistantActionMonitoringControlCapabilities.ts"
        || importPath === "./assistantActionMonitoringControlContracts.ts"
        || importPath === "./assistantActionMonitoringControlLifecycle.ts"
        || importPath === "./assistantActionMonitoringControlPolicies.ts";
      assert.equal(
        allowed,
        true,
        `${fileName} imports forbidden module ${importPath}`,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionFoundation"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionRegistry"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionFreeze"),
        false,
      );
      assert.equal(
        importPath.includes("assistantExecutiveActionPlanning"),
        false,
      );
    }
  }
  assert.deepEqual(foundation.upstreamDependencies, [
    "ASSISTANT-8:9 Executive Action Execution Public Index",
  ]);
  assert.equal(
    foundation.executiveActionExecutionPublicIndex.id,
    "ASSISTANT-8:9/ExecutiveActionExecutionPublicIndex",
  );
  assert.deepEqual(foundation.publicApiSurface, [
    "AssistantActionMonitoringControlFoundation",
  ]);
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.monitoringRuntime, false);
  assert.equal(foundation.controlRuntime, false);
  assert.equal(foundation.kpiEvaluation, false);
  assert.equal(foundation.alertExecution, false);
  assert.equal(foundation.monitoringEngine, false);
  assert.equal(foundation.alertEngine, false);
  assert.equal(foundation.scheduler, false);
  assert.equal(foundation.automation, false);
  assert.equal(foundation.persistence, false);
  assert.equal(foundation.services, false);
  assert.equal(foundation.factories, false);
  assert.equal(foundation.orchestration, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.ui, false);
  assert.equal(foundation.metadataOnly, true);
  assert.equal(foundation.immutable, true);
});
