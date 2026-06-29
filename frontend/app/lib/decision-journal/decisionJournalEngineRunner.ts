/**
 * APP-8:2 — Decision Journal Engine certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION, DECISION_JOURNAL_PLATFORM_IDENTITY } from "./decisionJournalContracts.ts";
import { createDecisionJournalFoundation } from "./decisionJournalFoundation.ts";
import { resetDecisionJournalPlatformForTests } from "./decisionJournalRunner.ts";
import {
  archiveDecisionJournalEntry,
  createDecisionJournalEntry,
  filterDecisionJournalEntries,
  getDecisionJournalEntryById,
  getDecisionJournalEntryRevisionHistory,
  getDecisionJournalEntriesByWorkspace,
  initializeDecisionJournalEngine,
  isDecisionJournalEngineInitialized,
  resetDecisionJournalEngineForTests,
  updateDecisionJournalMetadata,
  validateDecisionJournalEntryInput,
  DECISION_JOURNAL_ENGINE_SELF_MANIFEST,
} from "./decisionJournalEngine.ts";
import { getDecisionJournalEngineRegistrySnapshot } from "./decisionJournalEngineRegistry.ts";
import {
  assertNoHardDeleteInEngineSource,
  validateEngineEntryFoundationMapping,
  validateFoundationCompatibilityForEngine,
} from "./decisionJournalEngineValidation.ts";
import {
  DECISION_JOURNAL_ENGINE_CONTRACT_VERSION,
  type DecisionJournalEngineCertificationCheck,
  type DecisionJournalEngineCertificationResult,
} from "./decisionJournalEngineTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE = "ws-journal-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionJournalEngineCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleInput(overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    workspaceId: WORKSPACE,
    title: "Strategy pivot rationale",
    summary: "Executive summary for certification entry.",
    rationale: "Channel partnerships reduce acquisition cost while preserving credibility.",
    expectedOutcome: "25% revenue growth through partner pipeline.",
    confidence: "high" as const,
    author: "certification-runner",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["strategy", "pivot"]),
    ...overrides,
  });
}

export function runDecisionJournalEngineCertification(): DecisionJournalEngineCertificationResult {
  resetDecisionJournalEngineForTests();
  resetDecisionJournalPlatformForTests();
  createDecisionJournalFoundation(FIXED_TIME);
  initializeDecisionJournalEngine(FIXED_TIME);

  const checks: DecisionJournalEngineCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-8:1 foundation available",
      validateFoundationCompatibilityForEngine(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_initialized",
      "Decision Journal Engine initialized",
      isDecisionJournalEngineInitialized() === true,
      "engine initialized"
    )
  );

  const created = createDecisionJournalEntry({
    ...sampleInput(),
    id: "decision-journal-entry-cert-001",
    decisionId: "decision-cert-001",
    scenarioId: "scenario-cert-001",
  });
  checks.push(
    check(
      "C_entry_creation_valid",
      "Entry creation valid",
      created.success === true && created.data?.revisionVersion === 1,
      created.reason
    )
  );

  const invalidConfidence = validateDecisionJournalEntryInput({
    ...sampleInput(),
    confidence: "invalid-confidence" as never,
  });
  checks.push(
    check(
      "D_validation_strict",
      "Validation strict",
      invalidConfidence.valid === false,
      invalidConfidence.issues[0]?.message ?? "invalid rejected"
    )
  );

  const wsA = createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-ws-a", workspaceId: "ws-a" });
  const wsAEntries = getDecisionJournalEntriesByWorkspace("ws-a");
  const wsBEntries = getDecisionJournalEntriesByWorkspace("ws-b");
  checks.push(
    check(
      "E_workspace_isolation",
      "Workspace isolation enforced",
      wsA.success === true && wsAEntries.length >= 1 && wsBEntries.length === 0,
      `${wsAEntries.length} in ws-a, ${wsBEntries.length} in ws-b`
    )
  );

  const duplicate = createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-cert-001" });
  checks.push(
    check(
      "F_append_only_registry",
      "Append-only behavior enforced",
      duplicate.success === false && getDecisionJournalEngineRegistrySnapshot().publishedEntryCount >= 2,
      duplicate.reason
    )
  );

  const identityAttempt = updateDecisionJournalMetadata({
    id: "decision-journal-entry-ws-a",
    workspaceId: "ws-a",
    title: "Updated title",
  });
  checks.push(
    check(
      "G_identity_immutable",
      "Identity immutable",
      identityAttempt.success === true &&
        identityAttempt.data?.id === "decision-journal-entry-ws-a" &&
        identityAttempt.data?.author === "certification-runner" &&
        identityAttempt.data?.createdAt === FIXED_TIME,
      "id/author/createdAt preserved"
    )
  );

  const linkImmutable = updateDecisionJournalMetadata({
    id: "decision-journal-entry-cert-001",
    workspaceId: WORKSPACE,
    title: "Revised strategy pivot rationale",
  });
  checks.push(
    check(
      "H_link_fields_immutable",
      "Link fields immutable",
      linkImmutable.success === true &&
        linkImmutable.data?.decisionId === "decision-cert-001" &&
        linkImmutable.data?.scenarioId === "scenario-cert-001",
      "decisionId/scenarioId preserved"
    )
  );

  createDecisionJournalEntry({
    ...sampleInput(),
    id: "decision-journal-entry-version-cert",
    workspaceId: WORKSPACE,
  });
  const updated = updateDecisionJournalMetadata({
    id: "decision-journal-entry-version-cert",
    workspaceId: WORKSPACE,
    summary: "Updated executive summary.",
    confidence: "very_high",
  });
  const history = getDecisionJournalEntryRevisionHistory("decision-journal-entry-version-cert");
  checks.push(
    check(
      "I_metadata_versioning",
      "Metadata versioning works",
      updated.success === true &&
        updated.data?.revisionVersion === 2 &&
        history.length === 2 &&
        history[0]?.id === history[1]?.id,
      `${history.length} revisions`
    )
  );

  const archived = archiveDecisionJournalEntry("decision-journal-entry-cert-001", WORKSPACE);
  checks.push(
    check(
      "J_archive_policy",
      "Archive policy works",
      archived.success === true && archived.data?.status === "archived" && archived.data?.archived === true,
      archived.reason
    )
  );

  createDecisionJournalEntry({
    ...sampleInput(),
    id: "decision-journal-entry-filter-status",
    status: "active",
    workspaceId: WORKSPACE,
  });
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "decision-journal-entry-filter-source",
    source: "workspace",
    workspaceId: WORKSPACE,
  });
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "decision-journal-entry-filter-confidence",
    confidence: "low",
    workspaceId: WORKSPACE,
  });
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "decision-journal-entry-filter-author",
    author: "filter-author",
    workspaceId: WORKSPACE,
  });
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "decision-journal-entry-filter-reviewer",
    reviewers: Object.freeze(["reviewer-alpha"]),
    workspaceId: WORKSPACE,
  });
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "decision-journal-entry-filter-tag",
    tags: Object.freeze(["filter-tag"]),
    workspaceId: WORKSPACE,
  });

  const filteredStatus = filterDecisionJournalEntries({ workspaceId: WORKSPACE, status: "active" });
  const filteredSource = filterDecisionJournalEntries({ workspaceId: WORKSPACE, source: "workspace" });
  const filteredConfidence = filterDecisionJournalEntries({ workspaceId: WORKSPACE, confidence: "low" });
  const filteredAuthor = filterDecisionJournalEntries({ workspaceId: WORKSPACE, author: "filter-author" });
  const filteredReviewer = filterDecisionJournalEntries({ workspaceId: WORKSPACE, reviewer: "reviewer-alpha" });
  const filteredTag = filterDecisionJournalEntries({ workspaceId: WORKSPACE, tag: "filter-tag" });
  const filteredDate = filterDecisionJournalEntries({
    workspaceId: WORKSPACE,
    createdAtFrom: FIXED_TIME,
    createdAtTo: FIXED_TIME,
  });
  checks.push(
    check(
      "K_filtering_works",
      "Filtering works",
      filteredStatus.length >= 1 &&
        filteredSource.length >= 1 &&
        filteredConfidence.length >= 1 &&
        filteredAuthor.length >= 1 &&
        filteredReviewer.length >= 1 &&
        filteredTag.length >= 1 &&
        filteredDate.length >= 1,
      `${filteredStatus.length} status matches`
    )
  );

  const engineSources = [
    readEngineSource("app/lib/decision-journal/decisionJournalEngine.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalEngineRegistry.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalEngineMutations.ts"),
  ].join("\n");
  checks.push(
    check(
      "L_no_hard_delete",
      "No hard delete exists",
      assertNoHardDeleteInEngineSource(engineSources) === true,
      "no deleteDecisionJournalEntry API"
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
      !engineSources.includes("JournalChart") && !engineSources.includes(".tsx"),
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
      "Q_no_app6_integration",
      "No APP-6 integration",
      !engineSources.includes("decision-timeline/"),
      "no decision timeline imports"
    )
  );

  checks.push(
    check(
      "R_prior_platforms_untouched",
      "Prior APP platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8",
      "identities verified"
    )
  );

  checks.push(
    check(
      "foundation_mapping",
      "APP-8:1 entry mapping valid",
      created.data ? validateEngineEntryFoundationMapping(created.data).valid === true : false,
      "foundation compatible"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_JOURNAL_ENGINE_SELF_MANIFEST).valid === true,
      DECISION_JOURNAL_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-journal/decisionJournalEngine.ts",
        allowedFiles: DECISION_JOURNAL_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_JOURNAL_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Engine contract version is APP-8/2",
      DECISION_JOURNAL_ENGINE_CONTRACT_VERSION === "APP-8/2",
      DECISION_JOURNAL_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-8:1 foundation files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalFoundation.ts")),
      "foundation intact"
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

export const DecisionJournalEngineRunner = Object.freeze({
  runDecisionJournalEngineCertification,
});
