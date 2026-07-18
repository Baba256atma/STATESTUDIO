/**
 * DKL-5:8 — Knowledge Validation Freeze Tests.
 *
 * Deterministic coverage for the canonical DKL-5 Freeze layer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as freezeApi from "./knowledgeValidationFreeze.ts";
import {
  KnowledgeValidationFreeze,
  KnowledgeValidationFreezeIdentity,
  KnowledgeValidationFreezeVersion,
  KnowledgeValidationFreezeNamespace,
  KnowledgeValidationFreezeComponents,
  KnowledgeValidationFreezeLocks,
  getKnowledgeValidationFreezeSummary,
  getKnowledgeValidationFreezeStatus,
} from "./knowledgeValidationFreeze.ts";
import { KnowledgeValidationCertification } from "./knowledgeValidationCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL58_FILES = [
  "knowledgeValidationFreezeTypes.ts",
  "knowledgeValidationFreezeComponents.ts",
  "knowledgeValidationFreezeLocks.ts",
  "knowledgeValidationFreezeCompatibility.ts",
  "knowledgeValidationFreezeExtensions.ts",
  "knowledgeValidationFreezeBaseline.ts",
  "knowledgeValidationFreezeVerification.ts",
  "knowledgeValidationFreeze.ts",
  "knowledgeValidationFreeze.test.ts",
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

test("1. DKL-5:8 freeze files exist", () => {
  for (const file of DKL58_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight public exports", () => {
  assert.deepEqual(Object.keys(freezeApi).sort(), [
    "KnowledgeValidationFreeze",
    "KnowledgeValidationFreezeComponents",
    "KnowledgeValidationFreezeIdentity",
    "KnowledgeValidationFreezeLocks",
    "KnowledgeValidationFreezeNamespace",
    "KnowledgeValidationFreezeVersion",
    "getKnowledgeValidationFreezeStatus",
    "getKnowledgeValidationFreezeSummary",
  ]);
});

test("3. identity, version, namespace, lock, status, readiness", () => {
  assert.equal(
    KnowledgeValidationFreezeIdentity.freezeId,
    "DKL-5:8/KnowledgeValidationFreeze",
  );
  assert.equal(
    KnowledgeValidationFreezeIdentity.lockIdentifier,
    "DKL-5-KNOWLEDGE-VALIDATION-LOCKED",
  );
  assert.equal(KnowledgeValidationFreezeIdentity.status, "Frozen");
  assert.equal(
    KnowledgeValidationFreezeIdentity.certificationStatus,
    "Certified",
  );
  assert.equal(
    KnowledgeValidationFreezeIdentity.stabilityStatus,
    "StableAndFrozen",
  );
  assert.equal(
    KnowledgeValidationFreezeIdentity.readiness,
    "ReadyForPublicIndex",
  );
  assert.equal(KnowledgeValidationFreezeIdentity.runtimeBehavior, false);
  assert.equal(KnowledgeValidationFreezeIdentity.numericScoring, false);
  assert.equal(KnowledgeValidationFreezeIdentity.trustCalculation, false);
  assert.equal(KnowledgeValidationFreezeIdentity.cleansing, false);
  assert.equal(KnowledgeValidationFreezeIdentity.remediation, false);
  assert.equal(KnowledgeValidationFreezeVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationFreezeNamespace,
    "nexora.dkl.knowledge-validation.freeze",
  );
});

test("4. dependency only on knowledgeValidationCertification.ts", () => {
  for (const file of DKL58_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (match) => match[1]!,
    );
    for (const spec of imports) {
      if (spec.includes("knowledgeValidation") && !spec.includes("Freeze")) {
        assert.ok(
          spec.endsWith("knowledgeValidationCertification.ts"),
          `${file} forbidden: ${spec}`,
        );
      }
      assert.equal(/knowledgeModeling/i.test(spec), false, `${file}: ${spec}`);
      assert.equal(
        /knowledgeValidationFoundation\.ts|knowledgeValidationRegistry\.ts|knowledgeValidationModel\.ts|knowledgeValidationValidation\.ts|knowledgeValidationManifest\.ts|knowledgeValidationPlatform\.ts/.test(
          spec,
        ),
        false,
        `${file}: direct prior-phase import ${spec}`,
      );
    }
  }
  assert.equal(
    KnowledgeValidationFreeze.certification,
    KnowledgeValidationCertification,
  );
  assert.equal(
    KnowledgeValidationFreeze.certifiedPlatform,
    KnowledgeValidationCertification.certifiedPlatform,
  );
});

test("5. exactly seven frozen components by reference", () => {
  assert.equal(KnowledgeValidationFreezeComponents.componentCount, 7);
  assert.deepEqual(
    [...KnowledgeValidationFreezeComponents.dependencyOrder],
    [
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Manifest",
      "Platform",
      "Certification",
    ],
  );
  for (const entry of KnowledgeValidationFreezeComponents.components) {
    assert.equal(entry.includedByReference, true);
    assert.equal(entry.ownedByFreeze, false);
    assert.equal(entry.protectedFromReOwnership, true);
    assert.equal(entry.protectedFromBreakingChange, true);
    assert.equal(entry.runtimeBehavior, false);
    assert.equal(entry.scoringBehavior, false);
    assert.equal(entry.publicApiCount, 8);
    assert.equal(entry.certificationStatus, "Certified");
    assert.equal(entry.freezeStatus, "Frozen");
  }
});

test("6. freeze locks complete, unique, unlock Forbidden", () => {
  assert.equal(KnowledgeValidationFreezeLocks.lockCount, 42);
  assert.equal(KnowledgeValidationFreezeLocks.unlockPolicy, "Forbidden");
  assert.equal(KnowledgeValidationFreezeLocks.breakingChangePolicy, "Forbidden");
  const ids = KnowledgeValidationFreezeLocks.lockIds;
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids[0], "LOCK-FND-IDENTITY");
  assert.equal(ids[ids.length - 1], "LOCK-METADATA-ONLY");
  for (const lock of KnowledgeValidationFreezeLocks.locks) {
    assert.equal(lock.unlockPolicy, "Forbidden");
    assert.equal(lock.status, "Locked");
  }
});

test("7. compatibility and extension locks complete", () => {
  assert.ok(KnowledgeValidationFreeze.compatibility.entryCount >= 31);
  assert.ok(KnowledgeValidationFreeze.extensions.entryCount >= 19);
  assert.equal(
    KnowledgeValidationFreeze.compatibility.runtimeNegotiationForbidden,
    true,
  );
  assert.equal(KnowledgeValidationFreeze.extensions.policy.additiveOnly, true);
  assert.equal(
    KnowledgeValidationFreeze.extensions.policy.mutableRuntimeRegistrationForbidden,
    true,
  );
  assert.equal(
    KnowledgeValidationFreeze.extensions.policy.numericScoringForbidden,
    true,
  );
  for (const entry of KnowledgeValidationFreeze.extensions.entries) {
    assert.equal(entry.allowedChange, "Additive");
    assert.equal(entry.mutableRegistrationForbidden, true);
    assert.equal(entry.removalForbidden, true);
  }
});

test("8. baseline counts and protected identity lists", () => {
  const counts = KnowledgeValidationFreeze.baseline.counts;
  const identities = KnowledgeValidationFreeze.baseline.identities;
  assert.equal(counts.frozenComponentCount, 7);
  assert.equal(counts.totalPublicApiCountThroughCertification, 56);
  assert.equal(counts.foundationContractCount, 20);
  assert.equal(counts.validationTargetCount, 19);
  assert.equal(counts.validationDimensionCount, 20);
  assert.equal(counts.qualitySignalCount, 20);
  assert.equal(counts.outcomeCount, 11);
  assert.equal(counts.severityCount, 6);
  assert.equal(counts.registryCollectionCount, 24);
  assert.equal(counts.registryEntryCount, 266);
  assert.equal(counts.canonicalModelCount, 30);
  assert.equal(counts.modelRelationshipCount, 14);
  assert.equal(counts.validationCategoryCount, 27);
  assert.equal(counts.validationRuleCount, 63);
  assert.equal(counts.validationResultCount, 63);
  assert.equal(counts.validationEvidenceCount, 63);
  assert.equal(counts.manifestSectionCount, 12);
  assert.equal(counts.manifestReadinessGateCount, 15);
  assert.equal(counts.platformSectionCount, 6);
  assert.equal(counts.platformComponentCount, 5);
  assert.equal(counts.platformReadinessGateCount, 27);
  assert.equal(counts.certificationCategoryCount, 24);
  assert.equal(counts.certificationGateCount, 85);
  assert.equal(counts.certificationEvidenceCount, 85);
  assert.equal(counts.regressionDeclarationCount, 30);
  assert.equal(identities.foundationContractIdentities.length, 20);
  assert.equal(identities.validationTargetIdentities.length, 19);
  assert.equal(identities.validationDimensionIdentities.length, 20);
  assert.equal(identities.qualitySignalIdentities.length, 20);
  assert.equal(identities.outcomeIdentities.length, 11);
  assert.equal(identities.severityIdentities.length, 6);
  assert.equal(identities.registryCollectionIdentities.length, 24);
  assert.equal(identities.canonicalModelIdentities.length, 30);
  assert.equal(identities.modelRelationshipIdentities.length, 14);
  assert.equal(identities.validationCategoryIdentities.length, 27);
  assert.equal(identities.validationRuleIdentities.length, 63);
  assert.equal(identities.validationEvidenceIdentities.length, 63);
  assert.equal(identities.manifestSectionIdentities.length, 12);
  assert.equal(identities.platformSectionIdentities.length, 6);
  assert.equal(identities.platformComponentIdentities.length, 5);
  assert.equal(identities.certificationCategoryIdentities.length, 24);
  assert.equal(identities.certificationGateIdentities.length, 85);
  assert.equal(identities.certificationEvidenceIdentities.length, 85);
  assert.equal(identities.regressionDeclarationIdentities.length, 30);
  assert.equal(identities.consumerReadinessIdentities.length, 4);
  assert.equal(identities.executiveUsabilityIdentities.length, 8);
});

test("9. all freeze verification checks pass", () => {
  const verification = KnowledgeValidationFreeze.verification;
  assert.equal(verification.checkCount, 37);
  assert.equal(verification.allChecksPass, true);
  assert.equal(verification.failCount, 0);
  assert.equal(verification.passCount, 37);
  assert.equal(verification.readiness, "ReadyForPublicIndex");
  for (const entry of verification.checks) {
    assert.equal(entry.status, "Pass", entry.checkId);
  }
});

test("10. guarantees and prohibitions protected", () => {
  const g = KnowledgeValidationFreeze.guarantees;
  assert.equal(g.noRuntimeOrganizationalValidation, true);
  assert.equal(g.noNumericScoring, true);
  assert.equal(g.noTrustCalculation, true);
  assert.equal(g.noCleansing, true);
  assert.equal(g.noRemediation, true);
  assert.equal(g.noAi, true);
  assert.equal(g.noPersistence, true);
  assert.equal(g.noGraphTraversal, true);
  assert.equal(g.evidenceAndExplainabilityGuaranteesProtected, true);
  assert.equal(g.partialUsabilityProtected, true);
  assert.equal(g.consumerAndExecutiveSuitabilityDeclarationsProtected, true);
  assert.equal(g.breakingChangesForbidden, true);
  assert.equal(g.publicConsumersMustUsePublicIndexOnly, true);
  assert.equal(KnowledgeValidationFreeze.readiness.UnlockForbidden, true);
});

test("11. summary and status helpers deterministic; metadata frozen", () => {
  assert.deepEqual(
    getKnowledgeValidationFreezeSummary(),
    getKnowledgeValidationFreezeSummary(),
  );
  assert.deepEqual(
    getKnowledgeValidationFreezeStatus(),
    getKnowledgeValidationFreezeStatus(),
  );
  assert.equal(getKnowledgeValidationFreezeSummary.length, 0);
  assert.equal(getKnowledgeValidationFreezeStatus.length, 0);
  assert.equal(Object.isFrozen(KnowledgeValidationFreeze), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationFreezeComponents), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationFreezeLocks), true);
  assert.equal(isDeeplyFrozen(getKnowledgeValidationFreezeSummary()), true);
  const summary = getKnowledgeValidationFreezeSummary();
  assert.equal(summary.status, "Frozen");
  assert.equal(summary.allVerificationChecksPass, true);
  assert.equal(summary.totalPublicApiCountThroughCertification, 56);
  const status = getKnowledgeValidationFreezeStatus();
  assert.equal(status.readyForPublicIndex, true);
  assert.equal(status.breakingChangesForbidden, true);
});

test("12. no unlock, mutation, scoring, or forbidden patterns", () => {
  for (const file of DKL58_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(
      /Date\.now|new Date\(|Math\.random|process\.env/.test(text),
      false,
      file,
    );
    assert.equal(
      /\breadFileSync\b|\breaddirSync\b|\bfetch\s*\(/.test(text),
      false,
      file,
    );
    assert.equal(
      /\bfunction\s+(unlock|calculateTrust|calculateScore|cleanse|remediate)\b/i.test(
        text,
      ),
      false,
      file,
    );
    assert.equal(/unlock\s*[:=]\s*true/i.test(text), false, file);
  }
  assert.equal(
    Object.keys(freezeApi).some((name) => /unlock/i.test(name)),
    false,
  );
});
