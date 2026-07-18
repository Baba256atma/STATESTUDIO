/**
 * UI-PIPE-1:3 — Pipeline Understanding Contract Platform Tests.
 *
 * Deterministic coverage for the Pipeline-to-DKL-3 handoff contract.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as platformApi from "./pipelineUnderstandingPlatform.ts";
import {
  PipelineUnderstandingPlatform,
  PipelineUnderstandingContract,
  PipelineUnderstandingValidationRules,
  PipelineUnderstandingCompatibility,
  PipelineUnderstandingManifest,
  createPipelineUnderstandingIntakePackage,
  validatePipelineUnderstandingIntakePackage,
  getPipelineUnderstandingContractSummary,
} from "./pipelineUnderstandingPlatform.ts";
import { INTAKE_SECTION_ORDER } from "./pipelineUnderstandingContractTypes.ts";
import {
  PipelineUnderstandingFixtures,
  blockingDiagnosticPreviewFixture,
  datasetMismatchFixture,
  deselectedColumnPreviewFixture,
  duplicateSelectedColumnFixture,
  missingSelectedColumnFixture,
  sessionMismatchFixture,
  tenantMismatchFixture,
  unconfirmedReviewFixture,
  unresolvedSourceReferenceFixture,
  validCsvPreviewFixture,
  warningOnlyPreviewFixture,
  workspaceMismatchFixture,
  zeroSelectedColumnsFixture,
} from "./pipelineUnderstandingFixtures.ts";
import {
  DataSourceKnowledgeRegistryPublicPlatform,
} from "../dkl/dataSourceKnowledgeRegistryPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(HERE, "../..");

const PIPE13_FILES = [
  "pipelineUnderstandingContractTypes.ts",
  "pipelineUnderstandingContract.ts",
  "pipelineUnderstandingIntakePackage.ts",
  "pipelineUnderstandingValidation.ts",
  "pipelineUnderstandingCompatibility.ts",
  "pipelineUnderstandingManifest.ts",
  "pipelineUnderstandingPlatform.ts",
  "pipelineUnderstandingPlatform.test.ts",
  "pipelineUnderstandingFixtures.ts",
];

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

test("1. exactly nine UI-PIPE-1:3 files exist", () => {
  for (const file of PIPE13_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
  assert.equal(PIPE13_FILES.length, 9);
});

test("2. platform module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(platformApi).sort(), [
    "PipelineUnderstandingCompatibility",
    "PipelineUnderstandingContract",
    "PipelineUnderstandingManifest",
    "PipelineUnderstandingPlatform",
    "PipelineUnderstandingValidationRules",
    "createPipelineUnderstandingIntakePackage",
    "getPipelineUnderstandingContractSummary",
    "validatePipelineUnderstandingIntakePackage",
  ]);
});

test("3. intake package has exactly nine ordered sections", () => {
  const result = createPipelineUnderstandingIntakePackage(validCsvPreviewFixture());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(Object.keys(result.package), [...INTAKE_SECTION_ORDER]);
  assert.equal(INTAKE_SECTION_ORDER.length, 9);
});

test("4. contract identity is stable", () => {
  assert.equal(PipelineUnderstandingContract.sourcePlatform, "UI-PIPE-1");
  assert.equal(PipelineUnderstandingContract.targetPlatform, "DKL-3");
  assert.equal(PipelineUnderstandingContract.status, "ContractComplete");
  assert.equal(PipelineUnderstandingContract.readiness, "ReadyForDKL3Intake");
  assert.deepEqual(PipelineUnderstandingContract, PipelineUnderstandingContract);
});

test("5. intake id is deterministic", () => {
  const input = validCsvPreviewFixture();
  const a = createPipelineUnderstandingIntakePackage(input);
  const b = createPipelineUnderstandingIntakePackage(input);
  assert.equal(a.ok && b.ok, true);
  if (a.ok && b.ok) {
    assert.equal(a.package.identity.intakeId, b.package.identity.intakeId);
    assert.match(a.package.identity.intakeId, /^intake:/);
  }
});

test("6-10. tenant/workspace/session/dataset/handoff identities preserved", () => {
  const input = validCsvPreviewFixture();
  const result = createPipelineUnderstandingIntakePackage(input);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const id = result.package.identity;
  assert.equal(id.tenantId, input.handoff.tenantId);
  assert.equal(id.workspaceId, input.handoff.workspaceId);
  assert.equal(id.sessionId, input.handoff.sessionId);
  assert.equal(id.datasetId, input.dataset.datasetId);
  assert.equal(id.handoffId, input.handoff.handoffId);
  assert.equal(id.sourcePhase, "UI-PIPE-1:3");
  assert.equal(id.targetPhase, "DKL-3");
});

test("11-13. CSV/connector/content-type references resolve through DKL-2 Public Index", () => {
  const result = createPipelineUnderstandingIntakePackage(validCsvPreviewFixture());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const { source } = result.package;
  const registry = DataSourceKnowledgeRegistryPublicPlatform.registry;
  assert.ok(registry.dataSources.getById(source.sourceRegistryId));
  assert.ok(registry.connectors.getById(source.connectorRegistryId));
  assert.ok(registry.contentTypes.getById(source.contentTypeRegistryId));
});

test("14-15. exactly 18 validation rules with category counts 3/3/3/3/2/2/2", () => {
  assert.equal(PipelineUnderstandingValidationRules.length, 18);
  const counts = PipelineUnderstandingValidationRules.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});
  assert.equal(counts.Identity, 3);
  assert.equal(counts.SourceReference, 3);
  assert.equal(counts.Dataset, 3);
  assert.equal(counts.ColumnSelection, 3);
  assert.equal(counts.Diagnostics, 2);
  assert.equal(counts.Review, 2);
  assert.equal(counts.Boundary, 2);
});

test("16. valid package passes all blocking rules", () => {
  const result = createPipelineUnderstandingIntakePackage(validCsvPreviewFixture());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.validationResults.every((r) => r.status === "PASS"), true);
  assert.equal(result.package.readiness.readyForDKL3Intake, true);
});

test("17. tenant mismatch fails", () => {
  const result = createPipelineUnderstandingIntakePackage(tenantMismatchFixture());
  assert.equal(result.ok, false);
  assert.ok(result.validationResults.some((r) => r.ruleId === "IdentityMatchesHandoff" && r.status === "FAIL"));
});

test("18. workspace mismatch fails", () => {
  const result = createPipelineUnderstandingIntakePackage(workspaceMismatchFixture());
  assert.equal(result.ok, false);
  assert.ok(result.validationResults.some((r) => r.ruleId === "IdentityMatchesHandoff" && r.status === "FAIL"));
});

test("19. session mismatch fails", () => {
  const result = createPipelineUnderstandingIntakePackage(sessionMismatchFixture());
  assert.equal(result.ok, false);
  assert.ok(result.validationResults.some((r) => r.ruleId === "IdentityMatchesHandoff" && r.status === "FAIL"));
});

test("20. dataset mismatch fails", () => {
  const result = createPipelineUnderstandingIntakePackage(datasetMismatchFixture());
  assert.equal(result.ok, false);
  assert.ok(result.validationResults.some((r) => r.ruleId === "IdentityMatchesHandoff" && r.status === "FAIL"));
});

test("21. unresolved source reference fails", () => {
  const result = createPipelineUnderstandingIntakePackage(unresolvedSourceReferenceFixture());
  assert.equal(result.ok, false);
  assert.ok(
    result.validationResults.some(
      (r) => r.ruleId === "SourceRegistryReferenceResolves" && r.status === "FAIL",
    ),
  );
});

test("22-27. selected columns projected; deselected excluded; uniqueness; missing/zero fail; preview selected only", () => {
  const deselect = createPipelineUnderstandingIntakePackage(deselectedColumnPreviewFixture());
  assert.equal(deselect.ok, true);
  if (deselect.ok) {
    assert.equal(deselect.package.columns.every((c) => c.key !== "drop_col"), true);
    assert.equal(deselect.package.columns.every((c) => c.selectionStatus === "SelectedForUnderstanding"), true);
    for (const row of deselect.package.previewEvidence.previewRows) {
      assert.equal("drop_col" in row.values, false);
      assert.ok("keep_col" in row.values);
    }
    assert.ok(
      deselect.package.previewEvidence.previewRowCount <=
        deselect.package.dataset.rowCountPreviewed,
    );
  }

  const missing = createPipelineUnderstandingIntakePackage(missingSelectedColumnFixture());
  assert.equal(missing.ok, false);
  assert.ok(missing.validationResults.some((r) => r.ruleId === "SelectedColumnsExist" && r.status === "FAIL"));

  const dup = createPipelineUnderstandingIntakePackage(duplicateSelectedColumnFixture());
  assert.equal(dup.ok, false);
  assert.ok(dup.validationResults.some((r) => r.ruleId === "SelectedColumnsAreUnique" && r.status === "FAIL"));

  const zero = createPipelineUnderstandingIntakePackage(zeroSelectedColumnsFixture());
  assert.equal(zero.ok, false);
  assert.ok(zero.validationResults.some((r) => r.ruleId === "AtLeastOneColumnSelected" && r.status === "FAIL"));
});

test("28. preview row count never exceeds parser preview", () => {
  const result = createPipelineUnderstandingIntakePackage(validCsvPreviewFixture());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.ok(result.package.previewEvidence.previewRowCount <= result.package.dataset.rowCountPreviewed);
  assert.ok(result.package.previewEvidence.previewRows.length <= result.package.dataset.rowCountPreviewed);
});

test("29-30. diagnostic projection uses complete diagnostics; UI filters do not remove", () => {
  const input = warningOnlyPreviewFixture();
  const result = createPipelineUnderstandingIntakePackage(input);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const projected =
    result.package.diagnostics.blockingDiagnostics.length +
    result.package.diagnostics.errorDiagnostics.length +
    result.package.diagnostics.warningDiagnostics.length +
    result.package.diagnostics.infoDiagnostics.length;
  assert.equal(projected, input.dataset.diagnostics.length);
  assert.equal(result.package.diagnostics.diagnosticCounts.total, input.dataset.diagnostics.length);
});

test("31. blocking diagnostic prevents readiness", () => {
  const result = createPipelineUnderstandingIntakePackage(blockingDiagnosticPreviewFixture());
  assert.equal(result.ok, false);
  assert.equal(result.summary.readyForDKL3Intake, false);
  assert.ok(result.validationResults.some((r) => r.ruleId === "NoBlockingDiagnostics" && r.status === "FAIL"));
});

test("32. warning-only diagnostic permits readiness with warning disclosure", () => {
  const result = createPipelineUnderstandingIntakePackage(warningOnlyPreviewFixture());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.package.readiness.readyForDKL3Intake, true);
  assert.ok(result.package.readiness.warningCount > 0);
});

test("33-34. explicit confirmation required; unconfirmed fails", () => {
  const ok = createPipelineUnderstandingIntakePackage(validCsvPreviewFixture());
  assert.equal(ok.ok, true);
  const bad = createPipelineUnderstandingIntakePackage(unconfirmedReviewFixture());
  assert.equal(bad.ok, false);
  assert.ok(bad.validationResults.some((r) => r.ruleId === "PreviewExplicitlyConfirmed" && r.status === "FAIL"));
});

test("35-40. boundaries report preview-only and forbidden processing false", () => {
  const result = createPipelineUnderstandingIntakePackage(validCsvPreviewFixture());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const b = result.package.boundaries;
  assert.equal(b.previewOnly, true);
  assert.equal(b.persistencePerformed, false);
  assert.equal(b.semanticUnderstandingPerformed, false);
  assert.equal(b.businessObjectMappingPerformed, false);
  assert.equal(b.aiInferencePerformed, false);
  assert.equal(b.engineReasoningPerformed, false);
  assert.equal(result.package.dataset.dataScope, "PreviewOnly");
  assert.equal(result.package.previewEvidence.evidenceScope, "ParserPreviewEvidence");
});

test("41-44. eight compatibility declarations; semantic/persistence/cross-tenant forbidden", () => {
  assert.equal(PipelineUnderstandingCompatibility.length, 8);
  const byId = Object.fromEntries(
    PipelineUnderstandingCompatibility.map((c) => [c.compatibilityId, c]),
  );
  assert.equal(byId.SemanticFieldsForbidden?.status, "Forbidden");
  assert.equal(byId.PersistenceFieldsForbidden?.status, "Forbidden");
  assert.equal(byId.CrossTenantIdentityForbidden?.status, "Forbidden");
  assert.equal(byId.DKL3FutureIntakeCompatible?.status, "FutureCompatible");

  const semantic = createPipelineUnderstandingIntakePackage({
    ...validCsvPreviewFixture(),
    overrides: { injectSemanticField: true },
  });
  assert.equal(semantic.ok, false);
  const persistence = createPipelineUnderstandingIntakePackage({
    ...validCsvPreviewFixture(),
    overrides: { injectPersistenceField: true },
  });
  assert.equal(persistence.ok, false);
});

test("45-48. success/failure deeply frozen; inputs not mutated; ordinary invalid does not throw", () => {
  const input = validCsvPreviewFixture();
  const before = JSON.stringify(input);
  const success = createPipelineUnderstandingIntakePackage(input);
  assert.equal(success.ok, true);
  assert.equal(isDeeplyFrozen(success), true);
  assert.equal(JSON.stringify(input), before);

  const failure = createPipelineUnderstandingIntakePackage(tenantMismatchFixture());
  assert.equal(failure.ok, false);
  assert.equal(isDeeplyFrozen(failure), true);

  assert.doesNotThrow(() => {
    createPipelineUnderstandingIntakePackage(null as unknown as ReturnType<typeof validCsvPreviewFixture>);
  });
});

test("49. repeated construction is deterministic", () => {
  const input = validCsvPreviewFixture();
  const a = createPipelineUnderstandingIntakePackage(input);
  const b = createPipelineUnderstandingIntakePackage(input);
  assert.deepEqual(a, b);
});

test("50. Pipeline Page handoff wires contract validation fields", () => {
  const handoffSource = readFileSync(
    join(APP_ROOT, "components/pipeline/PipelineUnderstandingHandoff.tsx"),
    "utf8",
  );
  const pageSource = readFileSync(join(APP_ROOT, "components/pipeline/PipelinePage.tsx"), "utf8");
  assert.match(handoffSource, /Handoff Contract/);
  assert.match(handoffSource, /Target Platform/);
  assert.match(handoffSource, /Preview Only/);
  assert.match(handoffSource, /Selected Columns/);
  assert.match(handoffSource, /Blocking Issues/);
  assert.match(handoffSource, /Start Data Understanding — Coming Soon/);
  assert.match(pageSource, /createPipelineUnderstandingIntakePackage/);
  assert.match(pageSource, /intakeResult/);
});

test("51. no DKL-3 route is created", () => {
  assert.equal(existsSync(join(APP_ROOT, "dkl-3")), false);
  assert.equal(existsSync(join(APP_ROOT, "dkl3")), false);
  const pipelineRoute = readFileSync(join(APP_ROOT, "pipeline/page.tsx"), "utf8");
  assert.equal(/dkl-3|DKL-3.*route|href=.*dkl/i.test(pipelineRoute), false);
});

test("52-54. no DKL-3 implementation, persistence, or AI imports", () => {
  for (const file of PIPE13_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/from\s+["'][^"']*dkl-3/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*persistence/i.test(text), false, file);
    assert.equal(/openai|anthropic|embedding|llm/i.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
  }
});

test("60-61. readiness ReadyForDKL3Intake; next phase DKL-3:1", () => {
  assert.equal(PipelineUnderstandingManifest.readiness, "ReadyForDKL3Intake");
  assert.equal(PipelineUnderstandingManifest.nextPhase, "DKL-3:1");
  assert.equal(PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake, true);
  assert.equal(
    PipelineUnderstandingPlatform.summary.nextPhase,
    "DKL-3:1 — Data Understanding Foundation",
  );
  assert.equal(PipelineUnderstandingManifest.sectionCount, 9);
  assert.equal(PipelineUnderstandingManifest.validationRuleCount, 18);
  assert.equal(PipelineUnderstandingManifest.compatibilityCount, 8);
});

test("validate and summary public APIs", () => {
  const input = validCsvPreviewFixture();
  const created = createPipelineUnderstandingIntakePackage(input);
  assert.equal(created.ok, true);
  if (!created.ok) return;
  const validated = validatePipelineUnderstandingIntakePackage(created.package, input);
  assert.equal(validated.length, 18);
  assert.equal(validated.every((r) => r.status === "PASS"), true);
  const summary = getPipelineUnderstandingContractSummary(created);
  assert.equal(summary.readyForDKL3Intake, true);
  assert.equal(summary.targetPlatform, "DKL-3");
  assert.equal(summary.nextPhase, "DKL-3:1");
});

test("fixtures are deterministic and export surface is stable", () => {
  assert.ok(PipelineUnderstandingFixtures.validCsvPreviewFixture);
  const a = JSON.stringify(validCsvPreviewFixture().dataset.datasetId);
  const b = JSON.stringify(validCsvPreviewFixture().dataset.datasetId);
  assert.equal(a, b);
});
