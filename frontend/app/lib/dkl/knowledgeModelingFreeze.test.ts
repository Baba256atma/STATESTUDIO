/**
 * DKL-4:8 — Knowledge Modeling Freeze Tests.
 *
 * Deterministic coverage for the immutable Knowledge Modeling Freeze.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as freezeApi from "./knowledgeModelingFreeze.ts";
import {
  KnowledgeModelingFreeze,
  KnowledgeModelingFreezeIdentity,
  KnowledgeModelingFreezeVersion,
  KnowledgeModelingFreezeNamespace,
  KnowledgeModelingFreezeComponents,
  KnowledgeModelingFreezeLocks,
  getKnowledgeModelingFreezeSummary,
  getKnowledgeModelingFreezeStatus,
} from "./knowledgeModelingFreeze.ts";
import { KnowledgeModelingCertification } from "./knowledgeModelingCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL48_FILES = [
  "knowledgeModelingFreezeTypes.ts",
  "knowledgeModelingFreezeComponents.ts",
  "knowledgeModelingFreezeLocks.ts",
  "knowledgeModelingFreezeCompatibility.ts",
  "knowledgeModelingFreezeExtensions.ts",
  "knowledgeModelingFreezeBaseline.ts",
  "knowledgeModelingFreezeVerification.ts",
  "knowledgeModelingFreeze.ts",
  "knowledgeModelingFreeze.test.ts",
];

const REQUIRED_LOCK_IDS = [
  "LOCK-FND-CONTRACT",
  "LOCK-REG-IDENTITY",
  "LOCK-REG-CATEGORY",
  "LOCK-BO-CATEGORY",
  "LOCK-REL-CATEGORY",
  "LOCK-CANONICAL-MODEL",
  "LOCK-VAL-CATEGORY",
  "LOCK-VAL-RULE",
  "LOCK-MNF-INVENTORY",
  "LOCK-PLT-SECTION",
  "LOCK-PLT-ORDER",
  "LOCK-CERT-GATE",
  "LOCK-CERT-EVIDENCE",
  "LOCK-OWNERSHIP",
  "LOCK-DEPENDENCY",
  "LOCK-COMPATIBILITY",
  "LOCK-EXTENSION",
  "LOCK-PUBLIC-API",
  "LOCK-RUNTIME",
  "LOCK-METADATA",
] as const;

test("1. freeze files exist", () => {
  for (const file of DKL48_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight intentional public exports", () => {
  assert.deepEqual(Object.keys(freezeApi).sort(), [
    "KnowledgeModelingFreeze",
    "KnowledgeModelingFreezeComponents",
    "KnowledgeModelingFreezeIdentity",
    "KnowledgeModelingFreezeLocks",
    "KnowledgeModelingFreezeNamespace",
    "KnowledgeModelingFreezeVersion",
    "getKnowledgeModelingFreezeStatus",
    "getKnowledgeModelingFreezeSummary",
  ]);
});

test("3. freeze identity, version, namespace, lock, status, readiness", () => {
  assert.equal(
    KnowledgeModelingFreezeIdentity.freezeId,
    "DKL-4:8/KnowledgeModelingFreeze",
  );
  assert.equal(KnowledgeModelingFreezeIdentity.phase, "DKL-4:8");
  assert.equal(
    KnowledgeModelingFreezeIdentity.lockIdentifier,
    "DKL-4-KNOWLEDGE-MODELING-LOCKED",
  );
  assert.equal(KnowledgeModelingFreezeIdentity.status, "Frozen");
  assert.equal(KnowledgeModelingFreezeIdentity.certificationStatus, "Certified");
  assert.equal(
    KnowledgeModelingFreezeIdentity.stabilityStatus,
    "StableAndFrozen",
  );
  assert.equal(
    KnowledgeModelingFreezeIdentity.readiness,
    "ReadyForPublicIndex",
  );
  assert.equal(KnowledgeModelingFreezeVersion, "1.0.0");
  assert.equal(
    KnowledgeModelingFreezeNamespace,
    "nexora.dkl.knowledge-modeling.freeze",
  );
});

test("4. exactly seven frozen components with deterministic order", () => {
  assert.equal(KnowledgeModelingFreezeComponents.componentCount, 7);
  assert.deepEqual([...KnowledgeModelingFreezeComponents.phases], [
    "DKL-4:1",
    "DKL-4:2",
    "DKL-4:3",
    "DKL-4:4",
    "DKL-4:5",
    "DKL-4:6",
    "DKL-4:7",
  ]);
  assert.deepEqual([...KnowledgeModelingFreezeComponents.dependencyOrder], [
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
  ]);
  for (const c of KnowledgeModelingFreezeComponents.components) {
    assert.equal(c.includedByReference, true);
    assert.equal(c.protectedFromReOwnership, true);
    assert.equal(c.freezeStatus, "Frozen");
    assert.equal(c.certificationStatus, "Certified");
    assert.equal(Object.isFrozen(c), true);
  }
  assert.equal(KnowledgeModelingFreezeComponents.noComponentReOwned, true);
});

test("5. every required freeze lock exists with unique IDs", () => {
  assert.equal(KnowledgeModelingFreezeLocks.lockCount, 20);
  const ids = KnowledgeModelingFreezeLocks.lockIds;
  assert.equal(new Set(ids).size, ids.length);
  for (const required of REQUIRED_LOCK_IDS) {
    assert.ok(ids.includes(required), `missing lock ${required}`);
  }
  assert.deepEqual([...ids], [...REQUIRED_LOCK_IDS]);
  assert.equal(KnowledgeModelingFreezeLocks.unlockForbidden, true);
  assert.equal(KnowledgeModelingFreezeLocks.breakingChangeForbidden, true);
  assert.equal(KnowledgeModelingFreezeLocks.additiveChangeControlled, true);
});

test("6. compatibility and extension locks are complete", () => {
  assert.ok(KnowledgeModelingFreeze.compatibility.entryCount >= 16);
  assert.equal(
    KnowledgeModelingFreeze.compatibility.breakingChangeForbidden,
    true,
  );
  assert.ok(KnowledgeModelingFreeze.extensions.entryCount >= 8);
  assert.equal(KnowledgeModelingFreeze.extensions.additiveOnly, true);
  assert.equal(
    KnowledgeModelingFreeze.extensions.mutableRegistrationForbidden,
    true,
  );
  assert.equal(
    KnowledgeModelingFreeze.extensions.breakingChangeForbidden,
    true,
  );
  for (const e of KnowledgeModelingFreeze.extensions.entries) {
    assert.equal(e.allowedChange, "Additive");
    assert.equal(e.requiresRecertification, true);
    assert.equal(e.requiresRefreeze, true);
  }
});

test("7. baseline counts match certified metadata", () => {
  const counts = KnowledgeModelingFreeze.baseline.counts;
  assert.equal(counts.frozenComponentCount, 7);
  assert.equal(counts.registryCategoryCount, 18);
  assert.equal(counts.registryEntryCount, 129);
  assert.equal(counts.businessObjectCategoryCount, 26);
  assert.equal(counts.relationshipCategoryCount, 20);
  assert.equal(counts.canonicalModelCount, 20);
  assert.equal(counts.modelRelationshipDeclarationCount, 10);
  assert.equal(counts.validationCategoryCount, 8);
  assert.equal(counts.validationRuleCount, 24);
  assert.equal(counts.platformSectionCount, 6);
  assert.equal(counts.platformReadinessGateCount, 16);
  assert.equal(counts.certificationCategoryCount, 16);
  assert.equal(counts.certificationGateCount, 50);
  assert.equal(counts.certificationEvidenceCount, 50);
  assert.equal(counts.compatibilityCertificationCount, 12);
  assert.equal(counts.regressionDeclarationCount, 15);
  assert.equal(counts.publicApiTotalThroughCertification, 56);
});

test("8. protected identity lists are complete", () => {
  const ids = KnowledgeModelingFreeze.baseline.identities;
  assert.equal(ids.businessObjectIdentities.length, 26);
  assert.equal(ids.relationshipIdentities.length, 20);
  assert.equal(ids.canonicalModelIdentities.length, 20);
  assert.equal(ids.validationRuleIdentities.length, 24);
  assert.deepEqual([...ids.platformSectionIdentities], [
    "metadata",
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
  ]);
  assert.equal(ids.certificationGateIdentities.length, 50);
  assert.equal(ids.regressionDeclarationIdentities.length, 15);
  assert.ok(Object.isFrozen(ids.businessObjectIdentities));
  assert.ok(Object.isFrozen(ids.canonicalModelIdentities));
});

test("9. all freeze verification checks pass", () => {
  const v = KnowledgeModelingFreeze.verification;
  assert.equal(v.checkCount, 20);
  assert.equal(v.failCount, 0);
  assert.equal(v.passCount, 20);
  assert.equal(v.allChecksPass, true);
  assert.equal(v.readiness, "ReadyForPublicIndex");
  for (const c of v.checks) {
    assert.equal(c.status, "Pass", `${c.checkId} failed: ${c.observed}`);
  }
});

test("10. ownership, dependency, runtime, and metadata protections", () => {
  assert.ok(
    KnowledgeModelingFreeze.ownership.owns.includes("Freeze identity"),
  );
  assert.ok(
    KnowledgeModelingFreeze.ownership.doesNotOwn.includes(
      "Foundation contracts",
    ),
  );
  assert.equal(KnowledgeModelingFreeze.ownership.noOwnershipTransfer, true);
  assert.equal(
    KnowledgeModelingFreeze.guarantees.breakingChangesProhibited,
    true,
  );
  assert.equal(
    KnowledgeModelingFreeze.guarantees.noRuntimeConstructors,
    true,
  );
  assert.equal(KnowledgeModelingFreeze.guarantees.noAi, true);
  assert.equal(
    KnowledgeModelingFreeze.guarantees.publicConsumersMustUsePublicIndex,
    true,
  );
  assert.equal(KnowledgeModelingFreeze.readiness.RuntimeBehaviorForbidden, true);
  assert.equal(KnowledgeModelingFreeze.readiness.UnlockForbidden, true);
});

test("11. freeze metadata is frozen; helpers are deterministic", () => {
  assert.equal(Object.isFrozen(KnowledgeModelingFreeze), true);
  assert.equal(Object.isFrozen(KnowledgeModelingFreezeIdentity), true);
  assert.equal(Object.isFrozen(KnowledgeModelingFreezeComponents), true);
  assert.equal(Object.isFrozen(KnowledgeModelingFreezeLocks), true);
  assert.equal(Object.isFrozen(KnowledgeModelingFreezeLocks.locks), true);
  assert.equal(Object.isFrozen(KnowledgeModelingFreeze.baseline), true);
  assert.equal(Object.isFrozen(KnowledgeModelingFreeze.verification), true);

  const s1 = getKnowledgeModelingFreezeSummary();
  const s2 = getKnowledgeModelingFreezeSummary();
  const t1 = getKnowledgeModelingFreezeStatus();
  const t2 = getKnowledgeModelingFreezeStatus();
  assert.deepEqual(s1, s2);
  assert.deepEqual(t1, t2);
  assert.equal(Object.isFrozen(s1), true);
  assert.equal(Object.isFrozen(t1), true);
  assert.equal(s1.status, "Frozen");
  assert.equal(s1.readiness, "ReadyForPublicIndex");
  assert.equal(t1.readyForPublicIndex, true);
  assert.equal(t1.breakingChangesForbidden, true);
});

test("12. no unlock or mutation API exists", () => {
  const text = readFileSync(join(HERE, "knowledgeModelingFreeze.ts"), "utf8");
  assert.equal(/unlock|Unlock|mutate|registerComponent|builder|factory/i.test(text) &&
    /export function unlock|export const unlock/.test(text), false);
  assert.equal(typeof (freezeApi as Record<string, unknown>).unlock, "undefined");
  assert.equal(KnowledgeModelingFreeze.metadata.unlockPerformed, false);
  assert.equal(KnowledgeModelingFreezeLocks.unlockForbidden, true);
});

test("13. certification gateway and ReadyForPublicIndex completion", () => {
  assert.equal(
    KnowledgeModelingFreeze.certification,
    KnowledgeModelingCertification,
  );
  assert.equal(
    KnowledgeModelingFreeze.certifiedPlatform,
    KnowledgeModelingCertification.certifiedPlatform,
  );
  assert.equal(KnowledgeModelingFreeze.freezeStatus, "Frozen");
  assert.equal(KnowledgeModelingFreeze.certificationStatus, "Certified");
  assert.equal(KnowledgeModelingFreeze.stability, "StableAndFrozen");
  assert.equal(KnowledgeModelingFreeze.readiness.ReadyForPublicIndex, true);
  assert.ok(
    KnowledgeModelingFreeze.completionStatus.includes("ReadyForPublicIndex"),
  );
  assert.equal(
    KnowledgeModelingFreeze.nextPhase,
    "DKL-4:9 — Knowledge Modeling Public Index",
  );
});

test("14. freeze sources import only knowledgeModelingCertification.ts", () => {
  const sources = [
    "knowledgeModelingFreeze.ts",
    "knowledgeModelingFreezeComponents.ts",
    "knowledgeModelingFreezeBaseline.ts",
    "knowledgeModelingFreezeVerification.ts",
    "knowledgeModelingFreezeLocks.ts",
    "knowledgeModelingFreezeCompatibility.ts",
    "knowledgeModelingFreezeExtensions.ts",
  ];
  for (const file of sources) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+"(\.\/[^"]+)"/g)].map((m) => m[1]);
    for (const imp of imports) {
      const allowed =
        imp === "./knowledgeModelingCertification.ts" ||
        imp.startsWith("./knowledgeModelingFreeze");
      assert.ok(allowed, `${file} imports disallowed module ${imp}`);
    }
    assert.equal(
      /from\s+"\.\/knowledgeModeling(Foundation|Registry|Model|Validation|Manifest|Platform)\.ts"/.test(
        text,
      ),
      false,
      `${file} must not import DKL-4:1–4:6 directly`,
    );
    assert.equal(
      /from\s+"\.\/dataUnderstanding/.test(text),
      false,
      `${file} must not import DKL-3`,
    );
    assert.equal(
      /knowledgeModelingPublicIndex/.test(text),
      false,
      `${file} must not import DKL-4:9`,
    );
  }
});
