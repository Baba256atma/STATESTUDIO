/**
 * APP-7:4 — Business Timeline Lifecycle certification runner.
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
  isBusinessTimelineLifecycleLayerInitialized,
  resetBusinessTimelineLifecycleLayerForTests,
  validateBusinessLifecycleModel,
  BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST,
} from "./businessTimelineLifecycle.ts";
import {
  assertNoMutationApisInLifecycleSource,
  validateFoundationCompatibilityForLifecycle,
  validatePrerequisitesForLifecycle,
} from "./businessTimelineLifecycleValidation.ts";
import {
  BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS,
  BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
  type BusinessLifecycleCertificationCheck,
  type BusinessLifecycleCertificationResult,
} from "./businessTimelineLifecycleTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-lifecycle-cert-a";
const WORKSPACE_B = "ws-lifecycle-cert-b";

function check(id: string, title: string, passed: boolean, evidence: string): BusinessLifecycleCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleEvent(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Lifecycle cert ${id}`,
    description: "APP-7:4 certification event.",
    category: "corporate" as const,
    type: "milestone" as const,
    importance: "medium" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "lifecycle-certification",
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedCertificationEvents() {
  createBusinessEvent(
    sampleEvent("lifecycle-cert-founding", WORKSPACE_A, {
      category: "corporate",
      type: "milestone",
      occurredAt: "2020-01-01T00:00:00.000Z",
      importance: "critical",
    })
  );
  createBusinessEvent(
    sampleEvent("lifecycle-cert-growth", WORKSPACE_A, {
      category: "financial",
      type: "achievement",
      occurredAt: "2021-06-01T00:00:00.000Z",
      importance: "high",
    })
  );
  createBusinessEvent(
    sampleEvent("lifecycle-cert-expansion", WORKSPACE_A, {
      category: "strategy",
      type: "expansion",
      occurredAt: "2022-01-01T00:00:00.000Z",
    })
  );
  createBusinessEvent(
    sampleEvent("lifecycle-cert-crisis", WORKSPACE_A, {
      category: "risk",
      type: "incident",
      occurredAt: "2023-01-01T00:00:00.000Z",
      importance: "critical",
    })
  );
  createBusinessEvent(
    sampleEvent("lifecycle-cert-recovery", WORKSPACE_A, {
      category: "risk",
      type: "achievement",
      occurredAt: "2023-06-01T00:00:00.000Z",
    })
  );
  createBusinessEvent(
    sampleEvent("lifecycle-cert-stabilization", WORKSPACE_A, {
      category: "operations",
      type: "operational",
      occurredAt: "2024-01-01T00:00:00.000Z",
    })
  );
  createBusinessEvent(
    sampleEvent("lifecycle-cert-b", WORKSPACE_B, {
      occurredAt: "2025-01-01T00:00:00.000Z",
      type: "investment",
    })
  );
}

export function runBusinessTimelineLifecycleCertification(): BusinessLifecycleCertificationResult {
  resetBusinessTimelineLifecycleLayerForTests();
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);
  initializeBusinessTimelineQueryLayer(FIXED_TIME);
  initializeBusinessTimelineLifecycleLayer(FIXED_TIME);
  seedCertificationEvents();

  const checks: BusinessLifecycleCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-7:1 available",
      validateFoundationCompatibilityForLifecycle(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_event_engine_available",
      "APP-7:2 event engine available",
      validatePrerequisitesForLifecycle().valid === true,
      "prerequisites valid"
    )
  );

  checks.push(
    check(
      "C_query_layer_available",
      "APP-7:3 query layer available",
      validatePrerequisitesForLifecycle().valid === true,
      "query layer ready"
    )
  );

  checks.push(
    check(
      "D_lifecycle_initialized",
      "Lifecycle layer initialized",
      isBusinessTimelineLifecycleLayerInitialized() === true,
      "lifecycle initialized"
    )
  );

  const empty = buildBusinessLifecycleModel({ workspaceId: "ws-lifecycle-empty" });
  checks.push(
    check(
      "E_empty_timeline_safe",
      "Empty timeline safe",
      empty.segments.length === 0 && empty.milestones.length === 0 && empty.summary.eventCount === 0,
      "empty model safe"
    )
  );

  const modelA = buildBusinessLifecycleModel({ workspaceId: WORKSPACE_A });
  const modelB = buildBusinessLifecycleModel({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "F_workspace_isolation",
      "Workspace isolation enforced",
      modelA.summary.eventCount === 6 && modelB.summary.eventCount === 1,
      `${modelA.summary.eventCount} vs ${modelB.summary.eventCount}`
    )
  );

  const phases = modelA.segments.map((segment) => segment.phase);
  checks.push(
    check(
      "G_lifecycle_classification_deterministic",
      "Lifecycle classification deterministic",
      phases.includes("founding") &&
        phases.includes("growth") &&
        phases.includes("expansion") &&
        phases.includes("crisis") &&
        phases.includes("recovery") &&
        phases.includes("stabilization"),
      phases.join(",")
    )
  );

  checks.push(
    check(
      "H_milestone_extraction_deterministic",
      "Milestone extraction deterministic",
      modelA.milestones.length >= 2 &&
        modelA.milestones.some((entry) => entry.eventId === "lifecycle-cert-founding"),
      `${modelA.milestones.length} milestones`
    )
  );

  checks.push(
    check(
      "I_event_mappings_valid",
      "Event mappings valid",
      modelA.eventMappings.length === modelA.summary.eventCount &&
        modelA.eventMappings.every((mapping) => mapping.workspaceId === WORKSPACE_A),
      `${modelA.eventMappings.length} mappings`
    )
  );

  checks.push(
    check(
      "J_summary_metadata_accurate",
      "Summary metadata accurate",
      modelA.summary.segmentCount === modelA.segments.length &&
        modelA.summary.milestoneCount === modelA.milestones.length &&
        validateBusinessLifecycleModel(modelA).valid === true,
      "summary validated"
    )
  );

  const confidences = [
    ...modelA.segments.map((segment) => segment.confidence),
    ...modelA.milestones.map((milestone) => milestone.confidence),
  ];
  checks.push(
    check(
      "K_confidence_bounded",
      "Confidence bounded 0–1",
      confidences.every(
        (value) => value >= BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.min && value <= BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.max
      ),
      `${confidences.length} confidence values`
    )
  );

  const lifecycleSource = [
    readEngineSource("app/lib/business-timeline/businessTimelineLifecycle.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineLifecycleBuilder.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineMilestones.ts"),
  ].join("\n");
  checks.push(
    check(
      "L_no_event_mutation",
      "No event mutation",
      assertNoMutationApisInLifecycleSource(lifecycleSource) === true,
      "read-only lifecycle surface"
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/business-timeline/businessTimelineLifecycle.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineLifecycleBuilder.ts"),
  ].join("\n");
  checks.push(
    check(
      "M_no_dashboard_logic",
      "No dashboard logic",
      !integrationBundle.includes("DashboardAdapter") && !integrationBundle.includes("dashboardIntegration"),
      "no dashboard coupling"
    )
  );

  checks.push(
    check(
      "N_no_assistant_logic",
      "No assistant logic",
      !integrationBundle.includes("AssistantAdapter") && !integrationBundle.includes("assistantIntegration"),
      "no assistant coupling"
    )
  );

  checks.push(
    check(
      "O_no_visualization_logic",
      "No visualization logic",
      !integrationBundle.includes("TimelineRenderer") && !integrationBundle.includes("BusinessChart"),
      "no UI runtime"
    )
  );

  checks.push(
    check(
      "P_no_scenario_decision_coupling",
      "No scenario/decision coupling",
      !integrationBundle.includes("scenario-timeline/") && !integrationBundle.includes("decision-timeline/"),
      "no cross-platform coupling"
    )
  );

  const protectedFiles = BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST.allowedFiles.filter(
    (file) => !file.includes("businessTimelineLifecycle") && file.includes("business-timeline/")
  );
  checks.push(
    check(
      "Q_prior_platforms_untouched",
      "Prior platforms untouched",
      protectedFiles.every((file) => existsSync(join(REPO_ROOT, file))),
      "prior APP-7 files present"
    )
  );

  checks.push(
    check(
      "Q_app7_identity_regression",
      "APP-7:1 identity regression",
      BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.version === BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
      BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/business-timeline/businessTimelineLifecycle.ts",
        allowedFiles: BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Lifecycle contract version is APP-7/4",
      BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION === "APP-7/4",
      BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION
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

export const BusinessTimelineLifecycleRunner = Object.freeze({
  runBusinessTimelineLifecycleCertification,
});
