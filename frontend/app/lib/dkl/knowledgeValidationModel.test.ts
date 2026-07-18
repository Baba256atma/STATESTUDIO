/**
 * DKL-5:3 — Knowledge Validation Model Tests.
 *
 * Deterministic coverage for the immutable Knowledge Validation Model phase.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as modelApi from "./knowledgeValidationModel.ts";
import {
  KnowledgeValidationModel,
  KnowledgeValidationModelIdentity,
  KnowledgeValidationModelVersion,
  KnowledgeValidationModelNamespace,
  KnowledgeValidationModelCatalog,
  KnowledgeValidationModelRelationships,
  KnowledgeValidationModelOwnership,
  KnowledgeValidationModelDependencies,
} from "./knowledgeValidationModel.ts";
import { KnowledgeValidationFoundationIdentity } from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationRegistry,
  KnowledgeValidationRegistryIdentity,
} from "./knowledgeValidationRegistry.ts";
import { EvidenceSubtypeCatalog } from "./knowledgeValidationEvidenceModels.ts";
import { TargetRuleRegistrySnapshot } from "./knowledgeValidationTargetRuleModels.ts";
import { SignalTrustRegistrySnapshot } from "./knowledgeValidationTrustResultModels.ts";
import {
  ConsumerSuitabilityStateCatalog,
  ExecutiveUsabilityCapabilityCatalog,
} from "./knowledgeValidationStructureModels.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL53_FILES = [
  "knowledgeValidationModelTypes.ts",
  "knowledgeValidationModelHelpers.ts",
  "knowledgeValidationTargetRuleModels.ts",
  "knowledgeValidationEvidenceModels.ts",
  "knowledgeValidationFindingIssueModels.ts",
  "knowledgeValidationConflictAmbiguityModels.ts",
  "knowledgeValidationTrustResultModels.ts",
  "knowledgeValidationStructureModels.ts",
  "knowledgeValidationModel.ts",
  "knowledgeValidationModel.test.ts",
];

const REQUIRED_MODEL_KINDS = [
  "KnowledgeValidation",
  "ValidationTarget",
  "ValidationScope",
  "ValidationRule",
  "ValidationCriterion",
  "ValidationEvidence",
  "EvidenceReference",
  "ValidationFinding",
  "ValidationIssue",
  "ValidationConflict",
  "ValidationAmbiguity",
  "ValidationLimitation",
  "ValidationResult",
  "ValidationSummary",
  "ValidationStatus",
  "ValidationSeverity",
  "KnowledgeQualitySignal",
  "KnowledgeTrustDeclaration",
  "ValidationReadiness",
  "ValidationProvenance",
  "ValidationBoundary",
  "ValidationSession",
  "ValidationSubjectSet",
  "ValidationRuleSet",
  "ValidationEvidenceSet",
  "ValidationFindingSet",
  "ValidationIssueSet",
  "ValidationConsumerSuitability",
  "ValidationExecutiveUsability",
  "ValidationVersion",
] as const;

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

test("1. DKL-5:3 model files exist", () => {
  for (const file of DKL53_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. model module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(modelApi).sort(), [
    "KnowledgeValidationModel",
    "KnowledgeValidationModelCatalog",
    "KnowledgeValidationModelDependencies",
    "KnowledgeValidationModelIdentity",
    "KnowledgeValidationModelNamespace",
    "KnowledgeValidationModelOwnership",
    "KnowledgeValidationModelRelationships",
    "KnowledgeValidationModelVersion",
  ]);
});

test("3. model identity, version, namespace, status, readiness", () => {
  assert.equal(
    KnowledgeValidationModelIdentity.modelPhaseId,
    "DKL-5:3/KnowledgeValidationModel",
  );
  assert.equal(KnowledgeValidationModelIdentity.sourcePhase, "DKL-5:3");
  assert.equal(KnowledgeValidationModelIdentity.platformId, "DKL-5");
  assert.equal(KnowledgeValidationModelIdentity.status, "ModelComplete");
  assert.equal(KnowledgeValidationModelIdentity.readiness, "ReadyForValidation");
  assert.equal(KnowledgeValidationModelVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationModelNamespace,
    "nexora.dkl.knowledge-validation.model",
  );
  assert.equal(KnowledgeValidationModel.identity, KnowledgeValidationModelIdentity);
  assert.equal(KnowledgeValidationModel.readiness.ModelComplete, true);
  assert.equal(KnowledgeValidationModel.readiness.ReadyForValidation, true);
});

test("4. dependencies only on Foundation and Registry entry points", () => {
  assert.equal(KnowledgeValidationModelDependencies.approvedDependencyCount, 2);
  assert.equal(
    KnowledgeValidationModelDependencies.approved[0]!.module,
    "knowledgeValidationFoundation.ts",
  );
  assert.equal(
    KnowledgeValidationModelDependencies.approved[1]!.module,
    "knowledgeValidationRegistry.ts",
  );
  assert.equal(
    KnowledgeValidationModel.foundation.identity,
    KnowledgeValidationFoundationIdentity,
  );
  assert.equal(
    KnowledgeValidationModel.registry.identity,
    KnowledgeValidationRegistryIdentity,
  );
  assert.equal(KnowledgeValidationModel.registry.readiness, true);
  assert.equal(KnowledgeValidationModelDependencies.noDirectDkl4Dependency, true);
  assert.equal(KnowledgeValidationModelDependencies.noFutureDkl5Dependency, true);

  for (const file of DKL53_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      assert.equal(/knowledgeModeling/i.test(spec), false, `${file}: ${spec}`);
      assert.equal(/dataUnderstanding/i.test(spec), false, `${file}: ${spec}`);
      if (spec.includes("knowledgeValidation")) {
        const allowed =
          /knowledgeValidationFoundation\.ts$/.test(spec) ||
          /knowledgeValidationRegistry\.ts$/.test(spec) ||
          /knowledgeValidationModel/.test(spec) ||
          /knowledgeValidationTargetRuleModels\.ts$/.test(spec) ||
          /knowledgeValidationEvidenceModels\.ts$/.test(spec) ||
          /knowledgeValidationFindingIssueModels\.ts$/.test(spec) ||
          /knowledgeValidationConflictAmbiguityModels\.ts$/.test(spec) ||
          /knowledgeValidationTrustResultModels\.ts$/.test(spec) ||
          /knowledgeValidationStructureModels\.ts$/.test(spec) ||
          /knowledgeValidationModelHelpers\.ts$/.test(spec) ||
          /knowledgeValidationModelTypes\.ts$/.test(spec);
        assert.ok(allowed, `${file}: forbidden import ${spec}`);
        assert.equal(
          /knowledgeValidationFoundationTypes|knowledgeValidationContracts|knowledgeValidationRegistryTypes|knowledgeValidationRegistryCatalog|knowledgeValidationTargetRegistry|knowledgeValidationDimensionRegistry|knowledgeValidationSignalRegistry|knowledgeValidationFindingRegistry|knowledgeValidationConflictAmbiguityRegistry|knowledgeValidationRegistryOwnership|knowledgeValidationRegistryDependencies/.test(
            spec,
          ),
          false,
          `${file}: internal prior-phase import ${spec}`,
        );
      }
    }
  }
});

test("5. all 30 canonical models exist with unique ids and names", () => {
  assert.equal(REQUIRED_MODEL_KINDS.length, 30);
  assert.equal(KnowledgeValidationModelCatalog.modelCount, 30);
  assert.deepEqual(
    [...KnowledgeValidationModelCatalog.modelKinds],
    [...REQUIRED_MODEL_KINDS],
  );

  const ids = KnowledgeValidationModelCatalog.modelIds;
  const names = KnowledgeValidationModelCatalog.modelNames;
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(names).size, names.length);

  for (const kind of REQUIRED_MODEL_KINDS) {
    const model = KnowledgeValidationModelCatalog.byKind[kind];
    assert.ok(model, kind);
    assert.equal(model.modelKind, kind);
    assert.equal(model.sourcePhase, "DKL-5:3");
    assert.equal(model.immutable, true);
    assert.equal(model.factoryForbidden, true);
    assert.equal(model.executionForbidden, true);
    assert.equal(model.scoreCalculationForbidden, true);
    assert.equal(model.trustCalculationForbidden, true);
    assert.ok(model.fields.length > 0, kind);
    for (const f of model.fields) {
      assert.equal(f.readonly, true, `${kind}.${f.fieldName}`);
      assert.equal(f.executableBehaviorImplied, false, `${kind}.${f.fieldName}`);
    }
  }
});

test("6. deterministic model ordering", () => {
  assert.deepEqual(
    KnowledgeValidationModelCatalog.modelKinds,
    Object.freeze([...REQUIRED_MODEL_KINDS]),
  );
  assert.deepEqual(
    KnowledgeValidationModel.catalog.modelIds,
    KnowledgeValidationModelCatalog.modelIds,
  );
});

test("7. Knowledge Validation aggregate model is complete", () => {
  const aggregate = KnowledgeValidationModelCatalog.byKind.KnowledgeValidation;
  const requiredFields = [
    "validationId",
    "namespace",
    "version",
    "target",
    "scope",
    "lifecycleState",
    "status",
    "applicableDimensions",
    "ruleSet",
    "criteria",
    "evidenceSet",
    "findings",
    "issues",
    "conflicts",
    "ambiguities",
    "limitations",
    "qualitySignals",
    "trustDeclaration",
    "result",
    "summary",
    "consumerReadiness",
    "executiveUsability",
    "provenance",
    "ownership",
    "compatibility",
    "extensionMetadata",
    "sourceKnowledgeModelingReferences",
  ];
  for (const name of requiredFields) {
    assert.ok(
      aggregate.fields.some((f) => f.fieldName === name),
      `missing aggregate field ${name}`,
    );
  }
});

test("8. Target and Rule models reference registered categories and dimensions", () => {
  assert.ok(TargetRuleRegistrySnapshot.targetCount > 0);
  assert.ok(TargetRuleRegistrySnapshot.dimensionCount > 0);
  assert.ok(TargetRuleRegistrySnapshot.categoryCount > 0);
  assert.equal(
    TargetRuleRegistrySnapshot.targetCount,
    KnowledgeValidationRegistry.collections.validationTargetTypes.length,
  );
  assert.equal(
    TargetRuleRegistrySnapshot.dimensionCount,
    KnowledgeValidationRegistry.collections.validationDimensions.length,
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationTarget.registryCategoryReferences.includes(
      "validationTargetTypes",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationRule.registryCategoryReferences.includes(
      "validationRuleCategories",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationRule.registryCategoryReferences.includes(
      "validationDimensions",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationCriterion.fields.some(
      (f) => f.fieldName === "comparisonModeDeclaration",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationRule.fields.some(
      (f) => f.fieldName === "executionImplemented" && f.fieldKind === "false",
    ),
  );
});

test("9. all evidence model types exist", () => {
  assert.equal(EvidenceSubtypeCatalog.subtypeCount, 13);
  assert.equal(EvidenceSubtypeCatalog.subtypes.length, 13);
  assert.equal(EvidenceSubtypeCatalog.payloadCopyForbidden, true);
  assert.ok(KnowledgeValidationModelCatalog.byKind.ValidationEvidence);
  assert.ok(KnowledgeValidationModelCatalog.byKind.EvidenceReference);
  for (const subtype of EvidenceSubtypeCatalog.subtypes) {
    assert.ok(typeof subtype === "string" && subtype.length > 0);
  }
});

test("10. Finding, Issue, Conflict, Ambiguity, Limitation models exist", () => {
  assert.ok(KnowledgeValidationModelCatalog.byKind.ValidationFinding);
  assert.ok(KnowledgeValidationModelCatalog.byKind.ValidationIssue);
  assert.ok(KnowledgeValidationModelCatalog.byKind.ValidationConflict);
  assert.ok(KnowledgeValidationModelCatalog.byKind.ValidationAmbiguity);
  assert.ok(KnowledgeValidationModelCatalog.byKind.ValidationLimitation);

  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationFinding.fields.some(
      (f) => f.fieldName === "runtimeRemediationImplemented" && f.fieldKind === "false",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationConflict.fields.some(
      (f) => f.fieldName === "resolutionImplemented" && f.fieldKind === "false",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationAmbiguity.fields.some(
      (f) => f.fieldName === "resolutionImplemented" && f.fieldKind === "false",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationLimitation.fields.some(
      (f) => f.fieldName === "partialUsabilityPreserved" && f.fieldKind === "true",
    ),
  );
});

test("11. Quality Signal and Trust Declaration models are evidence-based without calculation", () => {
  assert.equal(SignalTrustRegistrySnapshot.signalCount, 20);
  assert.equal(SignalTrustRegistrySnapshot.expectedSignalCount, 20);
  assert.equal(
    SignalTrustRegistrySnapshot.signalCount,
    KnowledgeValidationRegistry.collections.knowledgeQualitySignals.length,
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.KnowledgeQualitySignal.registryCategoryReferences.includes(
      "knowledgeQualitySignals",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.KnowledgeQualitySignal.fields.some(
      (f) => f.fieldName === "numericScoreCalculated" && f.fieldKind === "false",
    ),
  );

  const trust = KnowledgeValidationModelCatalog.byKind.KnowledgeTrustDeclaration;
  assert.ok(trust.fields.some((f) => f.fieldName === "evidenceReferences"));
  assert.ok(trust.fields.some((f) => f.fieldName === "supportingFindings"));
  assert.ok(
    trust.fields.some((f) => f.fieldName === "trustCalculated" && f.fieldKind === "false"),
  );
  assert.ok(
    trust.fields.some((f) => f.fieldName === "aiConfidenceUsed" && f.fieldKind === "false"),
  );
  assert.equal(KnowledgeValidationModel.guarantees.noNumericScoring, true);
  assert.equal(KnowledgeValidationModel.guarantees.noTrustCalculation, true);
  assert.equal(KnowledgeValidationModel.guarantees.noAiConfidence, true);
});

test("12. Result and Summary models exist without implying perfect-only usability", () => {
  const result = KnowledgeValidationModelCatalog.byKind.ValidationResult;
  assert.ok(
    result.fields.some(
      (f) =>
        f.fieldName === "nonPerfectKnowledgeAutomaticallyUnusable" &&
        f.fieldKind === "false",
    ),
  );
  const summary = KnowledgeValidationModelCatalog.byKind.ValidationSummary;
  assert.ok(summary.fields.some((f) => f.fieldName === "targetCount"));
  assert.ok(summary.fields.some((f) => f.fieldName === "findingCount"));
  assert.ok(
    summary.fields.some(
      (f) => f.fieldName === "countsCalculatedInPhase" && f.fieldKind === "false",
    ),
  );
});

test("13. Consumer Suitability and Executive Usability models exist", () => {
  assert.deepEqual(
    [...ConsumerSuitabilityStateCatalog.states],
    [
      "ReadyForConsumer",
      "ReadyWithLimitations",
      "Restricted",
      "NotReadyForConsumer",
    ],
  );
  assert.equal(ConsumerSuitabilityStateCatalog.accessControlEnforcementForbidden, true);
  assert.equal(ExecutiveUsabilityCapabilityCatalog.capabilities.length, 8);
  assert.equal(
    ExecutiveUsabilityCapabilityCatalog.executiveEngineReasoningForbidden,
    true,
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationConsumerSuitability.fields.some(
      (f) => f.fieldName === "accessControlEnforced" && f.fieldKind === "false",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationExecutiveUsability.fields.some(
      (f) => f.fieldName === "decisionCommitment",
    ),
  );
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationExecutiveUsability.fields.some(
      (f) => f.fieldName === "executiveAwareness",
    ),
  );
});

test("14. Provenance forbids runtime timestamps; relationships are complete", () => {
  assert.ok(
    KnowledgeValidationModelCatalog.byKind.ValidationProvenance.fields.some(
      (f) =>
        f.fieldName === "generatedTimestampProhibited" && f.fieldKind === "true",
    ),
  );
  assert.equal(KnowledgeValidationModelRelationships.declarationCount, 14);
  assert.equal(KnowledgeValidationModelRelationships.graphTraversalForbidden, true);

  const kinds = KnowledgeValidationModelRelationships.declarations.map((d) => d.kind);
  assert.ok(kinds.includes("Contains"));
  assert.ok(kinds.includes("Applies"));
  assert.ok(kinds.includes("Requires"));
  assert.ok(kinds.includes("SupportsOrContradicts"));
  assert.ok(kinds.includes("Determines"));
  assert.ok(kinds.includes("Informs"));
  assert.ok(kinds.includes("Describes"));
});

test("15. all exported metadata is frozen; no factories, builders, execution, or remediation", () => {
  assert.equal(isDeeplyFrozen(KnowledgeValidationModel), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationModelCatalog), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationModelRelationships), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationModelOwnership), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationModelDependencies), true);

  const entryText = readFileSync(join(HERE, "knowledgeValidationModel.ts"), "utf8");
  assert.equal(/createFactory|builder\(|new\s+class|class\s+\w+/i.test(entryText), false);
  assert.equal(/evaluateRule|executeValidation|calculateTrust|calculateScore/i.test(entryText), false);
  assert.equal(KnowledgeValidationModel.guarantees.noRemediation, true);
  assert.equal(KnowledgeValidationModel.readiness.RemediationForbidden, true);
  assert.ok(KnowledgeValidationModelOwnership.doesNotOwn.includes("Remediation"));

  for (const file of DKL53_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/createFactory|Builder\b/.test(text), false, file);
    assert.equal(/Date\.now|new Date\(/.test(text), false, file);
    assert.equal(
      /function\s+remediate|remediate\s*=|applyRemediation|executeRemediation/i.test(text),
      false,
      file,
    );
  }
});

test("16. ownership boundaries and next phase", () => {
  assert.ok(
    KnowledgeValidationModelOwnership.owns.includes(
      "Canonical Knowledge Validation model contracts",
    ),
  );
  assert.ok(
    KnowledgeValidationModelOwnership.doesNotOwn.includes("Runtime rule execution"),
  );
  assert.ok(KnowledgeValidationModelOwnership.doesNotOwn.includes("Trust calculation"));
  assert.equal(
    KnowledgeValidationModel.nextPhase,
    "DKL-5:4 — Knowledge Validation Validation",
  );
});
