/**
 * Phase E — End-to-end Beta validation (deterministic, no UI automation).
 */

import { createInitialMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import { createExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore";
import { processRuntimeEventForIntelligence } from "../intelligence/ExecutiveRuntimeIntelligence";
import { SAMPLE_INVENTORY_CSV, createConnectorPlatform } from "../connectors";
import { createSimulationRunner } from "../simulation";
import { OFFICIAL_BETA_SCENARIOS } from "./ExecutiveBetaScenarios";
import {
  BETA_READINESS_CHECKLIST,
  readinessSummary,
} from "./ExecutiveReadinessChecklist";

export type ValidationCheck = {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
};

export type BetaValidationReport = {
  readonly at: number;
  readonly scenarioCount: number;
  readonly checks: readonly ValidationCheck[];
  readonly readiness: ReturnType<typeof readinessSummary>;
  readonly betaReady: boolean;
};

/**
 * Runs the official end-to-end path in-memory:
 * Connector → Metadata → Runtime → Intelligence → Simulation → Decision → Execution → Monitoring → Journal
 */
export function runExecutiveBetaValidator(): BetaValidationReport {
  const checks: ValidationCheck[] = [];
  const store = createExecutiveRuntimeStore({ initialMode: "Problem" });
  const catalog = createInitialMetadataCatalog();

  // Metadata: no orphan Runtime objects in demo set
  const requiredObjects = [
    "inventory",
    "factory",
    "supplier",
    "customer",
    "revenue",
    "decision",
  ] as const;
  const missingMeta = requiredObjects.filter(
    (id) => !catalog.objects.some((o) => o.objectId === id),
  );
  checks.push({
    id: "metadata-coverage",
    ok: missingMeta.length === 0,
    detail:
      missingMeta.length === 0
        ? "All demo Runtime Objects have Metadata"
        : `Missing Metadata for ${missingMeta.join(", ")}`,
  });

  // Runtime single source — mode change emits once
  const eventsBefore = store.getState().events.length;
  store.actions.setActiveMode("Scenario");
  const modeEvent = store
    .getState()
    .events.find(
      (e) =>
        e.type === "ModeChanged" &&
        (e.payload as { mode?: string } | undefined)?.mode === "Scenario",
    );
  checks.push({
    id: "runtime-mode",
    ok: Boolean(modeEvent),
    detail: "Runtime Mode change is owned by the store event log",
  });
  checks.push({
    id: "runtime-events",
    ok: store.getState().events.length > eventsBefore,
    detail: "Runtime records ModeChanged",
  });

  // Simulation isolation
  const runner = createSimulationRunner();
  // Note: create + run are sync for engine internals except health; runner.run is sync
  const session = runner.createInventoryShortageSession(store, catalog);
  const decisionsBefore = store.getState().decision.decisions.length;
  const sourcesBefore = store.getState().data.sources.length;
  const completed = runner.run(session.sessionId, catalog, store);
  const simEvent = store.getState().events.find((e) => e.type === "SimulationCompleted");
  checks.push({
    id: "simulation-isolated",
    ok:
      completed.status === "Completed" &&
      store.getState().data.sources.length === sourcesBefore &&
      Boolean(simEvent),
    detail: "SimulationCompleted emitted; Runtime sources unchanged",
  });

  const inventory = completed.results?.future.objects.find(
    (o) => o.objectId === "inventory",
  );
  checks.push({
    id: "simulation-vertical-slice",
    ok: inventory?.delta === 140,
    detail: "Inventory Shortage · Increase Safety Stock → Δ +140",
  });

  // Intelligence on SimulationCompleted
  if (simEvent) {
    const intel = processRuntimeEventForIntelligence({
      event: simEvent,
      previous: null,
      current: store.getState(),
      catalog,
      existing: [],
    });
    checks.push({
      id: "intelligence-signal",
      ok: Boolean(
        intel.created &&
          intel.created.suggestedWorkspace &&
          intel.created.severity &&
          intel.created.summary,
      ),
      detail: "Simulation signal has context, priority, recommendation",
    });
  } else {
    checks.push({
      id: "intelligence-signal",
      ok: false,
      detail: "Missing SimulationCompleted for Intelligence",
    });
  }

  // Decision Candidate Draft
  store.actions.createManualDecision("Beta · Safety Stock Candidate");
  const decision = store
    .getState()
    .decision.decisions.find(
      (d) => d.id === store.getState().decision.currentDecisionId,
    );
  checks.push({
    id: "decision-draft",
    ok:
      decision?.status === "Draft" &&
      store.getState().decision.decisions.length === decisionsBefore + 1,
    detail: "Decision Candidate starts as Draft",
  });

  // Decision approve → Execution → Monitoring
  if (decision) {
    store.actions.approveDecision(decision.id);
    checks.push({
      id: "decision-approved",
      ok: store
        .getState()
        .decision.decisions.find((d) => d.id === decision.id)?.status ===
        "Approved",
      detail: "Manager approval records DecisionApproved",
    });
  }

  store.actions.startExecution();
  checks.push({
    id: "execution-started",
    ok: store.getState().execution.started === true,
    detail: "ExecutionStarted recorded",
  });

  store.actions.createMonitoringSnapshot();
  checks.push({
    id: "monitoring-snapshot",
    ok: store.getState().monitoring.snapshots.length > 0,
    detail: "Monitoring Snapshot recorded",
  });

  // Journal-like packs present in Runtime slices
  checks.push({
    id: "journal-packs",
    ok:
      store.getState().decision.journalEntries.length > 0 &&
      store.getState().execution.journalEntries.length > 0 &&
      store.getState().monitoring.journalEntries.length > 0 &&
      runner.getJournal().length > 0,
    detail: "Decision · Execution · Monitoring · Simulation journal packs present",
  });

  // Official scenarios documented
  checks.push({
    id: "beta-scenarios",
    ok: OFFICIAL_BETA_SCENARIOS.length >= 10,
    detail: `${OFFICIAL_BETA_SCENARIOS.length} official Beta Scenarios documented`,
  });

  const readiness = readinessSummary(BETA_READINESS_CHECKLIST);
  const betaReady =
    readiness.betaReady && checks.every((c) => c.ok);

  return {
    at: Date.now(),
    scenarioCount: OFFICIAL_BETA_SCENARIOS.length,
    checks,
    readiness,
    betaReady,
  };
}

/** Async E2E including CSV connector publish. */
export async function runExecutiveBetaValidatorWithConnectors(): Promise<BetaValidationReport> {
  const base = runExecutiveBetaValidator();
  const store = createExecutiveRuntimeStore({ initialMode: "Problem" });
  const catalog = createInitialMetadataCatalog();
  const platform = createConnectorPlatform();
  platform.startSession("connector-csv");
  await platform.connect({
    label: "inventory.csv",
    payload: SAMPLE_INVENTORY_CSV,
  });
  await platform.discoverAndPreview();
  platform.applySuggestedMappings(catalog);
  platform.approve("Beta Manager");
  await platform.publish(store);
  const published = store.getState().events.some(
    (e) =>
      e.type === "DataUpdated" &&
      Boolean((e.payload as { published?: boolean } | undefined)?.published),
  );
  const checks = [
    ...base.checks,
    {
      id: "connector-publish",
      ok: published && store.getState().data.sources.some((s) => s.name.includes("inventory")),
      detail: published
        ? "CSV connector published into Runtime"
        : "CSV publish failed",
    },
  ];
  const betaReady = checks.every((c) => c.ok) && base.readiness.betaReady;
  return { ...base, checks, betaReady };
}
