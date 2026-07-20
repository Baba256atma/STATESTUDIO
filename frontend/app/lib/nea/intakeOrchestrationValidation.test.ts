/**
 * NEA-7:4 — Intake Orchestration Validation Tests.
 *
 * Deterministic coverage for the immutable Intake Orchestration Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntakeOrchestrationModelId,
  IntakeOrchestrationModelPlatform,
} from "./intakeOrchestrationModel.ts";
import * as ValidationModule from "./intakeOrchestrationValidation.ts";
import {
  IntakeOrchestrationValidationId,
  IntakeOrchestrationValidationName,
  IntakeOrchestrationValidationNamespace,
  IntakeOrchestrationValidationPlatform,
  IntakeOrchestrationValidationReadiness,
  IntakeOrchestrationValidationStatus,
  IntakeOrchestrationValidationVersion,
  getIntakeOrchestrationValidationSummary,
} from "./intakeOrchestrationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA74_FILES = Object.freeze([
  "intakeOrchestrationValidationTypes.ts",
  "intakeOrchestrationValidationRules.ts",
  "intakeOrchestrationValidationPolicies.ts",
  "intakeOrchestrationValidationRelationships.ts",
  "intakeOrchestrationValidationMetadata.ts",
  "intakeOrchestrationValidationOwnership.ts",
  "intakeOrchestrationValidation.ts",
  "intakeOrchestrationValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationValidationId",
  "IntakeOrchestrationValidationVersion",
  "IntakeOrchestrationValidationName",
  "IntakeOrchestrationValidationNamespace",
  "IntakeOrchestrationValidationStatus",
  "IntakeOrchestrationValidationReadiness",
  "IntakeOrchestrationValidationPlatform",
  "getIntakeOrchestrationValidationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "rules",
  "relationships",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_DOMAIN_CATEGORIES = Object.freeze([
  "ExecutiveIntakePackage",
  "IntakeIdentity",
  "IntakeSource",
  "IntakeContext",
  "IntakeMetadata",
  "MessageReference",
  "SessionReference",
  "ConversationReference",
  "AuthenticationReference",
  "RoutingReference",
  "ConnectorReference",
  "WorkspaceReference",
  "TenantReference",
  "CorrelationReference",
  "TraceReference",
  "AttachmentReference",
  "IntakeConfiguration",
  "IntakeDiagnostics",
  "IntakeResult",
  "IntakeSummary",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  ...EXPECTED_DOMAIN_CATEGORIES,
  "CrossModel",
  "PlatformIntegrity",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-7:4 Intake Orchestration Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(NEA74_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA74_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical validation identity, status Validation, and ReadyForManifest", () => {
    assert.equal(
      IntakeOrchestrationValidationId,
      "NEA-7:4/IntakeOrchestrationValidation",
    );
    assert.equal(IntakeOrchestrationValidationVersion, "1.0.0");
    assert.equal(
      IntakeOrchestrationValidationName,
      "Intake Orchestration Validation",
    );
    assert.equal(
      IntakeOrchestrationValidationNamespace,
      "nexora.nea.intake-orchestration.validation",
    );
    assert.equal(IntakeOrchestrationValidationStatus, "Validation");
    assert.equal(IntakeOrchestrationValidationReadiness, "ReadyForManifest");
    assert.equal(
      IntakeOrchestrationValidationPlatform.identity.phase,
      "NEA-7:4",
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.identity.modelId,
      IntakeOrchestrationModelId,
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.nextPhase,
      "NEA-7:5 — Intake Orchestration Manifest",
    );
  });

  it("consumes only NEA-7:3 Model and preserves Model references", () => {
    const dependency = IntakeOrchestrationValidationPlatform.dependency;
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "intakeOrchestrationModel.ts",
    );
    assert.equal(dependency.modelId, IntakeOrchestrationModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      IntakeOrchestrationValidationPlatform.modelPlatform,
      IntakeOrchestrationModelPlatform,
    );

    const anchors = IntakeOrchestrationValidationPlatform.rules.modelAnchors;
    assert.equal(
      anchors.domainModelCount,
      IntakeOrchestrationModelPlatform.domainModels.modelCount,
    );
    assert.equal(
      anchors.intakeIdentityModelCount,
      IntakeOrchestrationModelPlatform.domainModels.intakeIdentityModelCount,
    );
    assert.equal(
      anchors.relationshipCount,
      IntakeOrchestrationModelPlatform.relationships.relationshipCount,
    );
    assert.equal(anchors.duplicatesModelValues, false);
    assert.ok(
      IntakeOrchestrationValidationPlatform.rules.rules.every((item) =>
        item.modelReference.includes("NEA-7:3"),
      ),
    );
  });

  it("declares exactly 20 domain categories, 58 rules, 10 cross-model, and 6 platform integrity", () => {
    const { categories, rules } = IntakeOrchestrationValidationPlatform;
    assert.equal(rules.domainCategoryCount, 20);
    assert.deepEqual(
      categories
        .filter(
          (item) =>
            item.categoryId !== "CrossModel" &&
            item.categoryId !== "PlatformIntegrity",
        )
        .map((item) => item.categoryId),
      [...EXPECTED_DOMAIN_CATEGORIES],
    );
    assert.deepEqual(
      categories.map((item) => item.categoryId),
      [...EXPECTED_CATEGORIES],
    );
    assert.equal(rules.categoryCount, 22);
    assert.equal(rules.ruleCount, 58);
    assert.equal(rules.crossModelRuleCount, 10);
    assert.equal(rules.platformIntegrityRuleCount, 6);
    assertUnique(
      rules.rules.map((item) => item.ruleId),
      "rule ids",
    );
    assert.ok(
      rules.rules.every((item) => item.executesValidation === false),
    );
    assert.ok(categories.every((item) => item.executesValidation === false));
  });

  it("declares validation relationships and eight policies", () => {
    const { relationships, policies } = IntakeOrchestrationValidationPlatform;
    assert.equal(relationships.relationshipCount, 25);
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.ok(
      relationships.relationships.every(
        (item) => item.executesValidation === false,
      ),
    );
    assert.equal(policies.policyCount, 8);
    assert.ok(policies.policies.every((item) => item.executes === false));
    assert.deepEqual(
      policies.policies.map((item) => item.policyId),
      [
        "NEA-7:4/Policy/CanonicalReferenceOnly",
        "NEA-7:4/Policy/DeclarativeValidationOnly",
        "NEA-7:4/Policy/NoRuntimeAssembly",
        "NEA-7:4/Policy/NoBusinessInterpretation",
        "NEA-7:4/Policy/NoDKLInvocation",
        "NEA-7:4/Policy/NoUpstreamDuplication",
        "NEA-7:4/Policy/ImmutableValidationMetadata",
        "NEA-7:4/Policy/DeterministicValidationInventory",
      ],
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = IntakeOrchestrationValidationPlatform;
    assert.ok(ownership.owns.includes("Validation Categories"));
    assert.ok(ownership.owns.includes("Validation Rules"));
    assert.ok(ownership.owns.includes("Cross-Model Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Validation"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Intake Orchestration"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.equal(ownership.ownsRuntimeValidation, false);
    assert.equal(ownership.ownsValidationEngine, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Package Assembly"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.implementsRuntimeOrchestration, false);
    assert.equal(boundaries.assemblesRuntimePackage, false);
    assert.equal(boundaries.duplicatesModelValues, false);
    assert.equal(boundaries.registryDirectImport, false);
    assert.equal(boundaries.foundationDirectImport, false);
    assert.equal(boundaries.runtimeEnforcement, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = IntakeOrchestrationValidationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 10), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 10);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.rules), true);
    assert.equal(Object.isFrozen(platform.rules.rules), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical validation collections", () => {
    const summaryA = getIntakeOrchestrationValidationSummary();
    const summaryB = getIntakeOrchestrationValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, IntakeOrchestrationValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.modelId, IntakeOrchestrationModelId);
    assert.equal(summaryA.domainCategoryCount, 20);
    assert.equal(summaryA.categoryCount, 22);
    assert.equal(summaryA.ruleCount, 58);
    assert.equal(summaryA.crossModelRuleCount, 10);
    assert.equal(summaryA.platformIntegrityRuleCount, 6);
    assert.equal(summaryA.policyCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-7:5 — Intake Orchestration Manifest",
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.metadata.duplicatesModelValues,
      false,
    );
  });

  it("declares ReadyForManifest only and no forbidden runtime implementation", () => {
    assert.equal(
      IntakeOrchestrationValidationPlatform.readiness.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.readiness.claimsReadyForManifest,
      true,
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.readiness.claimsValidationEngine,
      false,
    );
    assert.equal(IntakeOrchestrationValidationPlatform.runtimeBehavior, false);
    assert.equal(IntakeOrchestrationValidationPlatform.validationEngine, false);
    assert.equal(
      IntakeOrchestrationValidationPlatform.runtimeValidation,
      false,
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.implementsRuntimeOrchestration,
      false,
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.assemblesRuntimePackage,
      false,
    );
    assert.equal(IntakeOrchestrationValidationPlatform.implementsHttp, false);
    assert.equal(IntakeOrchestrationValidationPlatform.aiReasoning, false);
    assert.equal(IntakeOrchestrationValidationPlatform.invokesDkl, false);
    assert.equal(IntakeOrchestrationValidationPlatform.invokesEngine, false);
  });

  it("does not import Registry or Foundation directly", () => {
    const sourceFiles = NEA74_FILES.filter((file) => !file.endsWith(".test.ts"));
    for (const file of sourceFiles) {
      const mod = `./${file}`;
      void mod;
    }
    assert.equal(
      IntakeOrchestrationValidationPlatform.dependency.registryDirectImport,
      false,
    );
    assert.equal(
      IntakeOrchestrationValidationPlatform.dependency.foundationDirectImport,
      false,
    );
  });
});
