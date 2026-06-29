/**
 * APP-7:5 — Business Timeline Context certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "./businessTimelineContracts.ts";
import { createBusinessTimelineFoundation } from "./businessTimelineFoundation.ts";
import { resetBusinessTimelinePlatformForTests } from "./businessTimelineRunner.ts";
import {
  createBusinessEvent,
  initializeBusinessEventEngine,
  resetBusinessEventEngineForTests,
} from "./businessEventEngine.ts";
import {
  initializeBusinessTimelineQueryLayer,
  resetBusinessTimelineQueryLayerForTests,
} from "./businessTimelineQuery.ts";
import {
  buildBusinessLifecycleModel,
  initializeBusinessTimelineLifecycleLayer,
  resetBusinessTimelineLifecycleLayerForTests,
} from "./businessTimelineLifecycle.ts";
import {
  buildBusinessTimelineContextModel,
  getBusinessEventContext,
  getBusinessRelatedEvents,
  initializeBusinessTimelineContextLayer,
  isBusinessTimelineContextLayerInitialized,
  resetBusinessTimelineContextLayerForTests,
  validateBusinessTimelineContextModel,
  BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST,
} from "./businessTimelineContext.ts";
import {
  assertNoMutationApisInContextSource,
  validateFoundationCompatibilityForContext,
  validatePrerequisitesForContext,
} from "./businessTimelineContextValidation.ts";
import {
  BUSINESS_CONTEXT_CONFIDENCE_BOUNDS,
  BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
  type BusinessTimelineContextCertificationCheck,
  type BusinessTimelineContextCertificationResult,
} from "./businessTimelineContextTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-context-cert-a";
const WORKSPACE_B = "ws-context-cert-b";

function check(id: string, title: string, passed: boolean, evidence: string): BusinessTimelineContextCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleEvent(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Context cert ${id}`,
    description: "APP-7:5 certification event.",
    category: "product" as const,
    type: "milestone" as const,
    importance: "high" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "context-certification",
    tags: Object.freeze(["certification", "launch"]),
    ...overrides,
  });
}

function seedCertificationEvents() {
  createBusinessEvent(
    sampleEvent("context-cert-1", WORKSPACE_A, {
      category: "corporate",
      type: "milestone",
      occurredAt: "2020-01-01T00:00:00.000Z",
      importance: "critical",
      tags: Object.freeze(["founding"]),
    })
  );
  createBusinessEvent(
    sampleEvent("context-cert-2", WORKSPACE_A, {
      category: "product",
      type: "achievement",
      occurredAt: "2021-02-01T00:00:00.000Z",
      tags: Object.freeze(["launch", "product"]),
    })
  );
  createBusinessEvent(
    sampleEvent("context-cert-2b", WORKSPACE_A, {
      category: "product",
      type: "milestone",
      occurredAt: "2021-03-01T00:00:00.000Z",
      tags: Object.freeze(["launch", "product"]),
    })
  );
  createBusinessEvent(
    sampleEvent("context-cert-1b", WORKSPACE_A, {
      category: "corporate",
      type: "milestone",
      occurredAt: "2020-06-01T00:00:00.000Z",
      importance: "high",
      tags: Object.freeze(["founding"]),
    })
  );
  createBusinessEvent(
    sampleEvent("context-cert-3", WORKSPACE_A, {
      category: "risk",
      type: "incident",
      occurredAt: "2022-03-01T00:00:00.000Z",
      importance: "critical",
    })
  );
  createBusinessEvent(
    sampleEvent("context-cert-4", WORKSPACE_A, {
      category: "operations",
      type: "operational",
      occurredAt: "2022-04-15T00:00:00.000Z",
    })
  );
  createBusinessEvent(
    sampleEvent("context-cert-b1", WORKSPACE_B, {
      occurredAt: "2025-01-01T00:00:00.000Z",
      type: "investment",
      category: "investment",
    })
  );
}

export function runBusinessTimelineContextCertification(): BusinessTimelineContextCertificationResult {
  resetBusinessTimelineContextLayerForTests();
  resetBusinessTimelineLifecycleLayerForTests();
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);
  initializeBusinessTimelineQueryLayer(FIXED_TIME);
  initializeBusinessTimelineLifecycleLayer(FIXED_TIME);
  initializeBusinessTimelineContextLayer(FIXED_TIME);
  seedCertificationEvents();

  const checks: BusinessTimelineContextCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-7:1 available",
      validateFoundationCompatibilityForContext(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_event_engine_available",
      "APP-7:2 event engine available",
      validatePrerequisitesForContext().valid === true,
      "event engine ready"
    )
  );

  checks.push(
    check(
      "C_query_layer_available",
      "APP-7:3 query layer available",
      validatePrerequisitesForContext().valid === true,
      "query layer ready"
    )
  );

  checks.push(
    check(
      "D_lifecycle_layer_available",
      "APP-7:4 lifecycle layer available",
      validatePrerequisitesForContext().valid === true,
      "lifecycle layer ready"
    )
  );

  checks.push(
    check(
      "E_context_initialized",
      "Context layer initialized",
      isBusinessTimelineContextLayerInitialized() === true,
      "context initialized"
    )
  );

  const empty = buildBusinessTimelineContextModel({ workspaceId: "ws-context-empty" });
  checks.push(
    check(
      "F_empty_timeline_safe",
      "Empty timeline safe",
      empty.events.length === 0 && empty.relationships.length === 0 && empty.clusters.length === 0,
      "empty context safe"
    )
  );

  const modelA = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE_A });
  const modelB = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "G_workspace_isolation",
      "Workspace isolation enforced",
      modelA.summary.eventCount === 6 && modelB.summary.eventCount === 1,
      `${modelA.summary.eventCount} vs ${modelB.summary.eventCount}`
    )
  );

  const ctx2 = getBusinessEventContext(modelA, "context-cert-2b");
  checks.push(
    check(
      "H_previous_next_mapping",
      "Previous/next mapping deterministic",
      ctx2?.previousEventId === "context-cert-2" && ctx2?.nextEventId === "context-cert-3",
      `prev=${ctx2?.previousEventId}, next=${ctx2?.nextEventId}`
    )
  );

  const relationshipTypes = new Set(modelA.relationships.map((relationship) => relationship.relationshipType));
  checks.push(
    check(
      "I_relationship_creation_deterministic",
      "Relationship creation deterministic",
      relationshipTypes.has("previous") &&
        relationshipTypes.has("next") &&
        relationshipTypes.has("same-category") &&
        relationshipTypes.has("same-lifecycle-phase") &&
        relationshipTypes.has("temporal-proximity"),
      [...relationshipTypes].join(",")
    )
  );

  checks.push(
    check(
      "J_cluster_creation_deterministic",
      "Cluster creation deterministic",
      modelA.clusters.length >= 2 &&
        modelA.clusters.every((cluster) => cluster.startAt <= cluster.endAt && cluster.eventIds.length > 0),
      `${modelA.clusters.length} clusters`
    )
  );

  const contextLookup = getBusinessEventContext(modelA, "context-cert-3");
  checks.push(
    check(
      "K_event_context_lookup",
      "Event context lookup works",
      contextLookup !== null && contextLookup.eventId === "context-cert-3",
      contextLookup?.eventId ?? "missing"
    )
  );

  const related = getBusinessRelatedEvents(modelA, "context-cert-2");
  checks.push(
    check(
      "L_related_events_lookup",
      "Related events lookup works",
      related.length >= 1,
      `${related.length} related events`
    )
  );

  const confidences = [
    ...modelA.relationships.map((relationship) => relationship.confidence),
    ...modelA.clusters.map((cluster) => cluster.confidence),
    ...modelA.eventContexts.map((context) => context.confidence),
  ];
  checks.push(
    check(
      "M_confidence_bounded",
      "Confidence bounded 0–1",
      confidences.every(
        (value) => value >= BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.min && value <= BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.max
      ),
      `${confidences.length} values`
    )
  );

  const contextSource = [
    readEngineSource("app/lib/business-timeline/businessTimelineContext.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineContextBuilder.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineRelationships.ts"),
  ].join("\n");
  checks.push(
    check(
      "N_no_event_mutation",
      "No event mutation",
      assertNoMutationApisInContextSource(contextSource) === true,
      "no event mutation APIs"
    )
  );

  const lifecycleBefore = buildBusinessLifecycleModel({ workspaceId: WORKSPACE_A });
  buildBusinessTimelineContextModel({ workspaceId: WORKSPACE_A });
  const lifecycleAfter = buildBusinessLifecycleModel({ workspaceId: WORKSPACE_A });
  checks.push(
    check(
      "O_no_lifecycle_mutation",
      "No lifecycle mutation",
      JSON.stringify(lifecycleBefore) === JSON.stringify(lifecycleAfter),
      "lifecycle unchanged"
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/business-timeline/businessTimelineContext.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineContextBuilder.ts"),
  ].join("\n");
  checks.push(
    check(
      "P_no_dashboard_logic",
      "No dashboard logic",
      !integrationBundle.includes("DashboardAdapter") && !integrationBundle.includes("dashboardIntegration"),
      "no dashboard coupling"
    )
  );

  checks.push(
    check(
      "Q_no_assistant_logic",
      "No assistant logic",
      !integrationBundle.includes("AssistantAdapter") && !integrationBundle.includes("assistantIntegration"),
      "no assistant coupling"
    )
  );

  checks.push(
    check(
      "R_no_visualization_logic",
      "No visualization logic",
      !integrationBundle.includes("TimelineRenderer") && !integrationBundle.includes("BusinessChart"),
      "no UI runtime"
    )
  );

  checks.push(
    check(
      "S_no_scenario_decision_coupling",
      "No scenario/decision coupling",
      !integrationBundle.includes("scenario-timeline/") && !integrationBundle.includes("decision-timeline/"),
      "no cross-platform coupling"
    )
  );

  const protectedFiles = BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST.allowedFiles.filter(
    (file) => !file.includes("businessTimelineContext") && file.includes("business-timeline/")
  );
  checks.push(
    check(
      "T_prior_platforms_untouched",
      "Prior platforms untouched",
      protectedFiles.every((file) => existsSync(join(REPO_ROOT, file))),
      "prior APP-7 files present"
    )
  );

  checks.push(
    check(
      "T_app7_identity_regression",
      "APP-7:1 identity regression",
      BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.version === BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
      BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "model_validation",
      "Context model validation",
      validateBusinessTimelineContextModel(modelA).valid === true,
      "model valid"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/business-timeline/businessTimelineContext.ts",
        allowedFiles: BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Context contract version is APP-7/5",
      BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION === "APP-7/5",
      BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;
  const score = Math.round((passedCount / checks.length) * 100);

  return Object.freeze({
    certified: failedCount === 0,
    status: failedCount === 0 ? ("PASS" as const) : ("FAIL" as const),
    summary: `${passedCount}/${checks.length} certification checks passed.`,
    checks: Object.freeze(checks),
    score,
    readOnly: true as const,
  });
}

export const BusinessTimelineContextRunner = Object.freeze({
  runBusinessTimelineContextCertification,
});
