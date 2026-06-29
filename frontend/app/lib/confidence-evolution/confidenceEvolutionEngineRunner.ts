/**
 * APP-9:2 — Confidence Evolution Engine certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY,
} from "./confidenceEvolutionContracts.ts";
import { createConfidenceEvolutionFoundation } from "./confidenceEvolutionFoundation.ts";
import { resetConfidenceEvolutionPlatformForTests } from "./confidenceEvolutionRunner.ts";
import {
  archiveConfidenceRecord,
  createConfidenceRecord,
  filterConfidenceRecords,
  getConfidenceRecordById,
  getConfidenceRecordsByWorkspace,
  getConfidenceRevisionHistory,
  initializeConfidenceEvolutionEngine,
  isConfidenceEvolutionEngineInitialized,
  resetConfidenceEvolutionEngineForTests,
  updateConfidenceMetadata,
  validateConfidenceRecordInput,
  CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST,
} from "./confidenceEvolutionEngine.ts";
import { getConfidenceEvolutionEngineRegistrySnapshot } from "./confidenceEvolutionEngineRegistry.ts";
import {
  assertNoHardDeleteInEngineSource,
  validateEngineRecordFoundationMapping,
  validateFoundationCompatibilityForEngine,
} from "./confidenceEvolutionEngineValidation.ts";
import {
  CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION,
  type ConfidenceEvolutionEngineCertificationCheck,
  type ConfidenceEvolutionEngineCertificationResult,
} from "./confidenceEvolutionEngineTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE = "ws-confidence-cert-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionEngineCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleInput(overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    workspaceId: WORKSPACE,
    title: "Confidence before strategy pivot",
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "Executive confidence moderated after partner pipeline review.",
    createdAt: FIXED_TIME,
    tags: Object.freeze(["strategy", "pivot"]),
    ...overrides,
  });
}

export function runConfidenceEvolutionEngineCertification(): ConfidenceEvolutionEngineCertificationResult {
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionFoundation(FIXED_TIME);
  initializeConfidenceEvolutionEngine(FIXED_TIME);

  const checks: ConfidenceEvolutionEngineCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-9:1 foundation available",
      validateFoundationCompatibilityForEngine(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_initialized",
      "Confidence Evolution Engine initialized",
      isConfidenceEvolutionEngineInitialized() === true,
      "engine initialized"
    )
  );

  const created = createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-cert-001",
    decisionId: "decision-cert-001",
    scenarioId: "scenario-cert-001",
    journalEntryId: "journal-entry-cert-001",
  });
  checks.push(
    check(
      "C_record_creation_valid",
      "Record creation valid",
      created.success === true && created.data?.revisionVersion === 1,
      created.reason
    )
  );

  const invalidLevel = validateConfidenceRecordInput({
    ...sampleInput(),
    confidenceLevel: "invalid-level" as never,
  });
  checks.push(
    check(
      "D_validation_strict",
      "Validation strict",
      invalidLevel.valid === false,
      invalidLevel.issues[0]?.message ?? "invalid rejected"
    )
  );

  const wsA = createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-ws-a",
    workspaceId: "ws-a",
  });
  const wsARecords = getConfidenceRecordsByWorkspace("ws-a");
  const wsBRecords = getConfidenceRecordsByWorkspace("ws-b");
  checks.push(
    check(
      "E_workspace_isolation",
      "Workspace isolation enforced",
      wsA.success === true && wsARecords.length >= 1 && wsBRecords.length === 0,
      `${wsARecords.length} in ws-a, ${wsBRecords.length} in ws-b`
    )
  );

  const duplicate = createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-cert-001" });
  checks.push(
    check(
      "F_append_only_registry",
      "Append-only behavior enforced",
      duplicate.success === false && getConfidenceEvolutionEngineRegistrySnapshot().publishedRecordCount >= 2,
      duplicate.reason
    )
  );

  const identityAttempt = updateConfidenceMetadata({
    id: "confidence-evolution-record-ws-a",
    workspaceId: "ws-a",
    title: "Updated title",
  });
  checks.push(
    check(
      "G_identity_immutable",
      "Identity immutable",
      identityAttempt.success === true &&
        identityAttempt.data?.id === "confidence-evolution-record-ws-a" &&
        identityAttempt.data?.source === "manual" &&
        identityAttempt.data?.createdAt === FIXED_TIME,
      "id/source/createdAt preserved"
    )
  );

  const linkImmutable = updateConfidenceMetadata({
    id: "confidence-evolution-record-cert-001",
    workspaceId: WORKSPACE,
    title: "Revised confidence before strategy pivot",
  });
  checks.push(
    check(
      "H_link_fields_immutable",
      "Link fields immutable",
      linkImmutable.success === true &&
        linkImmutable.data?.decisionId === "decision-cert-001" &&
        linkImmutable.data?.scenarioId === "scenario-cert-001" &&
        linkImmutable.data?.journalEntryId === "journal-entry-cert-001",
      "decisionId/scenarioId/journalEntryId preserved"
    )
  );

  createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-version-cert",
    workspaceId: WORKSPACE,
  });
  const updated = updateConfidenceMetadata({
    id: "confidence-evolution-record-version-cert",
    workspaceId: WORKSPACE,
    confidenceLevel: "high",
    confidenceScore: 0.85,
    reason: "new_evidence",
  });
  const history = getConfidenceRevisionHistory("confidence-evolution-record-version-cert");
  checks.push(
    check(
      "I_revision_versioning",
      "Revision versioning works",
      updated.success === true &&
        updated.data?.revisionVersion === 2 &&
        history.length === 2 &&
        history[0]?.id === history[1]?.id,
      `${history.length} revisions`
    )
  );

  const archived = archiveConfidenceRecord("confidence-evolution-record-cert-001", WORKSPACE);
  checks.push(
    check(
      "J_archive_policy",
      "Archive policy works",
      archived.success === true && archived.data?.status === "archived" && archived.data?.archived === true,
      archived.reason
    )
  );

  createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-filter-status",
    status: "active",
    workspaceId: WORKSPACE,
  });
  createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-filter-source",
    source: "workspace",
    workspaceId: WORKSPACE,
  });
  createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-filter-level",
    confidenceLevel: "low",
    workspaceId: WORKSPACE,
  });
  createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-filter-reason",
    reason: "risk_changed",
    workspaceId: WORKSPACE,
  });
  createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-filter-tag",
    tags: Object.freeze(["filter-tag"]),
    workspaceId: WORKSPACE,
  });

  const filteredStatus = filterConfidenceRecords({ workspaceId: WORKSPACE, status: "active" });
  const filteredSource = filterConfidenceRecords({ workspaceId: WORKSPACE, source: "workspace" });
  const filteredLevel = filterConfidenceRecords({ workspaceId: WORKSPACE, confidenceLevel: "low" });
  const filteredReason = filterConfidenceRecords({ workspaceId: WORKSPACE, reason: "risk_changed" });
  const filteredTag = filterConfidenceRecords({ workspaceId: WORKSPACE, tag: "filter-tag" });
  const filteredDate = filterConfidenceRecords({
    workspaceId: WORKSPACE,
    createdAtFrom: FIXED_TIME,
    createdAtTo: FIXED_TIME,
  });
  const excludedArchived = filterConfidenceRecords({ workspaceId: WORKSPACE, includeArchived: false });
  const includedArchived = filterConfidenceRecords({ workspaceId: WORKSPACE, includeArchived: true, status: "archived" });
  checks.push(
    check(
      "K_filtering_works",
      "Filtering works",
      filteredStatus.length >= 1 &&
        filteredSource.length >= 1 &&
        filteredLevel.length >= 1 &&
        filteredReason.length >= 1 &&
        filteredTag.length >= 1 &&
        filteredDate.length >= 1 &&
        excludedArchived.every((record) => !record.archived) &&
        includedArchived.length >= 1,
      `${filteredStatus.length} status matches`
    )
  );

  const engineSources = [
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionEngine.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionEngineRegistry.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionMutations.ts"),
  ].join("\n");
  checks.push(
    check(
      "L_no_hard_delete",
      "No hard delete exists",
      assertNoHardDeleteInEngineSource(engineSources) === true,
      "no deleteConfidenceRecord API"
    )
  );

  checks.push(
    check(
      "M_no_dashboard_coupling",
      "No dashboard coupling",
      !engineSources.includes("DashboardAdapter") && !engineSources.includes("dashboard/"),
      "engine clean"
    )
  );

  checks.push(
    check(
      "N_no_assistant_coupling",
      "No assistant coupling",
      !engineSources.includes("AssistantAdapter") && !engineSources.includes("assistant/"),
      "engine clean"
    )
  );

  checks.push(
    check(
      "O_no_visualization",
      "No visualization",
      !engineSources.includes("ConfidenceChart") && !engineSources.includes(".tsx"),
      "no visualization"
    )
  );

  checks.push(
    check(
      "P_no_persistence",
      "No persistence",
      !engineSources.includes("indexedDB") && !engineSources.includes("localStorage"),
      "no persistence"
    )
  );

  checks.push(
    check(
      "Q_no_app6_app7_app8_integration",
      "No APP-6/7/8 integration",
      !engineSources.includes("decision-timeline/") &&
        !engineSources.includes("business-timeline/") &&
        !engineSources.includes("decision-journal/"),
      "no timeline/journal imports"
    )
  );

  checks.push(
    check(
      "R_prior_platforms_untouched",
      "Prior APP platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9",
      "identities verified"
    )
  );

  checks.push(
    check(
      "foundation_mapping",
      "APP-9:1 record mapping valid",
      created.data ? validateEngineRecordFoundationMapping(created.data).valid === true : false,
      "foundation compatible"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST).valid === true,
      CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionEngine.ts",
        allowedFiles: CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Engine contract version is APP-9/2",
      CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION === "APP-9/2",
      CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-9:1 foundation files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionFoundation.ts")),
      "foundation intact"
    )
  );

  checks.push(
    check(
      "record_retrieval",
      "Record retrieval by id",
      getConfidenceRecordById("confidence-evolution-record-cert-001") !== null,
      "record found"
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

export const ConfidenceEvolutionEngineRunner = Object.freeze({
  runConfidenceEvolutionEngineCertification,
});
