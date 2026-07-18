/**
 * DKL-4:6 — Knowledge Modeling Platform Tests.
 *
 * Deterministic coverage for the immutable Knowledge Modeling Platform.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as platformApi from "./knowledgeModelingPlatform.ts";
import {
  KnowledgeModelingPlatform,
  KnowledgeModelingPlatformIdentity,
  KnowledgeModelingPlatformVersion,
  KnowledgeModelingPlatformNamespace,
  KnowledgeModelingPlatformComponents,
  KnowledgeModelingPlatformReadiness,
  getKnowledgeModelingPlatformSummary,
  getKnowledgeModelingPlatformStatus,
} from "./knowledgeModelingPlatform.ts";
import { KnowledgeModelingFoundation } from "./knowledgeModelingFoundation.ts";
import { KnowledgeModelingRegistry } from "./knowledgeModelingRegistry.ts";
import { KnowledgeModelingModel } from "./knowledgeModelingModel.ts";
import { KnowledgeModelingValidation } from "./knowledgeModelingValidation.ts";
import { KnowledgeModelingManifest } from "./knowledgeModelingManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL46_FILES = [
  "knowledgeModelingPlatformTypes.ts",
  "knowledgeModelingPlatformComponents.ts",
  "knowledgeModelingPlatformDependencies.ts",
  "knowledgeModelingPlatformCompatibility.ts",
  "knowledgeModelingPlatformReadiness.ts",
  "knowledgeModelingPlatform.ts",
  "knowledgeModelingPlatform.test.ts",
];

test("1. platform files exist", () => {
  for (const file of DKL46_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight intentional public exports", () => {
  assert.deepEqual(Object.keys(platformApi).sort(), [
    "KnowledgeModelingPlatform",
    "KnowledgeModelingPlatformComponents",
    "KnowledgeModelingPlatformIdentity",
    "KnowledgeModelingPlatformNamespace",
    "KnowledgeModelingPlatformReadiness",
    "KnowledgeModelingPlatformVersion",
    "getKnowledgeModelingPlatformStatus",
    "getKnowledgeModelingPlatformSummary",
  ]);
});

test("3. platform identity, version, namespace, status, and readiness", () => {
  assert.equal(
    KnowledgeModelingPlatformIdentity.id,
    "DKL-4:6/KnowledgeModelingPlatform",
  );
  assert.equal(KnowledgeModelingPlatformIdentity.phase, "DKL-4:6");
  assert.equal(KnowledgeModelingPlatformIdentity.status, "PlatformComplete");
  assert.equal(
    KnowledgeModelingPlatformIdentity.readiness,
    "ReadyForCertification",
  );
  assert.equal(KnowledgeModelingPlatformVersion, "1.0.0");
  assert.equal(
    KnowledgeModelingPlatformNamespace,
    "nexora.dkl.knowledge-modeling.platform",
  );
  assert.equal(KnowledgeModelingPlatform.identity.status, "PlatformComplete");
  assert.equal(
    KnowledgeModelingPlatform.identity.readiness,
    "ReadyForCertification",
  );
});

test("4. exactly six ordered primary sections", () => {
  assert.deepEqual(Object.keys(KnowledgeModelingPlatform.sections), [
    "metadata",
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
  ]);
  assert.deepEqual([...KnowledgeModelingPlatform.sectionOrder], [
    "metadata",
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
  ]);
  assert.equal(Object.keys(KnowledgeModelingPlatform.sections).length, 6);
});

test("5. each architecture section references canonical upstream export", () => {
  assert.equal(KnowledgeModelingPlatform.foundation, KnowledgeModelingFoundation);
  assert.equal(KnowledgeModelingPlatform.registry, KnowledgeModelingRegistry);
  assert.equal(KnowledgeModelingPlatform.model, KnowledgeModelingModel);
  assert.equal(KnowledgeModelingPlatform.validation, KnowledgeModelingValidation);
  assert.equal(KnowledgeModelingPlatform.manifest, KnowledgeModelingManifest);
  assert.equal(
    KnowledgeModelingPlatform.sections.foundation,
    KnowledgeModelingFoundation,
  );
  assert.equal(
    KnowledgeModelingPlatform.sections.registry,
    KnowledgeModelingRegistry,
  );
  assert.equal(KnowledgeModelingPlatform.sections.model, KnowledgeModelingModel);
  assert.equal(
    KnowledgeModelingPlatform.sections.validation,
    KnowledgeModelingValidation,
  );
  assert.equal(
    KnowledgeModelingPlatform.sections.manifest,
    KnowledgeModelingManifest,
  );
});

test("6. five upstream components registered with deterministic order", () => {
  assert.equal(KnowledgeModelingPlatformComponents.componentCount, 5);
  assert.deepEqual([...KnowledgeModelingPlatformComponents.phases], [
    "DKL-4:1",
    "DKL-4:2",
    "DKL-4:3",
    "DKL-4:4",
    "DKL-4:5",
  ]);
  assert.deepEqual([...KnowledgeModelingPlatformComponents.dependencyOrder], [
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
  ]);
  assert.deepEqual([...KnowledgeModelingPlatformComponents.publicEntryPoints], [
    "knowledgeModelingFoundation.ts",
    "knowledgeModelingRegistry.ts",
    "knowledgeModelingModel.ts",
    "knowledgeModelingValidation.ts",
    "knowledgeModelingManifest.ts",
  ]);
  for (const c of KnowledgeModelingPlatformComponents.components) {
    assert.equal(c.includedByReference, true);
    assert.equal(c.ownedByPlatform, false);
    assert.equal(Object.isFrozen(c), true);
  }
});

test("7. platform and component metadata are frozen", () => {
  assert.equal(Object.isFrozen(KnowledgeModelingPlatform), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPlatform.sections), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPlatformIdentity), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPlatformComponents), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPlatformComponents.components), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPlatformReadiness), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPlatformReadiness.gates), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPlatform.metadata), true);
});

test("8. public-entry-point-only dependencies; no DKL-3 or future phases", () => {
  const deps = KnowledgeModelingPlatform.dependencies;
  assert.equal(deps.entryCount, 5);
  assert.equal(deps.publicEntryPointOnly, true);
  assert.equal(deps.noDirectDkl3Dependency, true);
  assert.equal(deps.noFuturePhases, true);
  assert.equal(deps.noEngineDependency, true);
  assert.equal(deps.noPersistenceDependency, true);
  assert.equal(deps.noCircularDependency, true);
  assert.deepEqual([...deps.phases], [
    "DKL-4:1",
    "DKL-4:2",
    "DKL-4:3",
    "DKL-4:4",
    "DKL-4:5",
  ]);
  assert.ok(deps.forbidden.includes("DKL-3 direct imports"));
  assert.ok(deps.forbidden.includes("DKL-4:7+"));
});

test("9. no ownership duplication", () => {
  assert.equal(
    KnowledgeModelingPlatformComponents.noComponentReOwned,
    true,
  );
  assert.equal(
    KnowledgeModelingPlatform.metadata.ownership.noDuplicatedOwnership,
    true,
  );
  assert.equal(
    KnowledgeModelingPlatform.metadata.ownership.earlierPhasesRetainOwnership,
    true,
  );
  assert.ok(
    KnowledgeModelingPlatform.metadata.ownership.doesNotOwn.includes(
      "Foundation contracts",
    ),
  );
  assert.ok(
    KnowledgeModelingPlatform.metadata.ownership.owns.includes(
      "Platform composition metadata",
    ),
  );
});

test("10. compatibility and additive extension declarations", () => {
  const compat = KnowledgeModelingPlatform.compatibility;
  const extensions = KnowledgeModelingPlatform.extensions;
  assert.ok(compat.entryCount >= 10);
  assert.equal(compat.runtimeCompatibilityLogic, false);
  assert.ok(extensions.entryCount >= 7);
  assert.equal(extensions.additiveOnly, true);
  assert.equal(extensions.mutableRegistrationForbidden, true);
  for (const e of extensions.entries) {
    assert.equal(e.status, "AdditiveAllowed");
    assert.equal(e.platformMutableRegistration, false);
    assert.ok(e.ownedBy.startsWith("DKL-4:"));
  }
  const byId = Object.fromEntries(
    compat.entries.map((e) => [e.compatibilityId, e]),
  );
  assert.equal(byId["COMPAT-FND"]?.status, "Compatible");
  assert.equal(byId["COMPAT-CERT"]?.status, "ForwardCompatible");
  assert.equal(byId["COMPAT-RUNTIME-FORBIDDEN"]?.status, "Forbidden");
});

test("11. all readiness gates exist and pass", () => {
  assert.equal(KnowledgeModelingPlatformReadiness.gateCount, 16);
  assert.equal(KnowledgeModelingPlatformReadiness.failCount, 0);
  assert.equal(KnowledgeModelingPlatformReadiness.passCount, 16);
  assert.equal(KnowledgeModelingPlatformReadiness.allGatesPass, true);
  assert.equal(
    KnowledgeModelingPlatformReadiness.readiness,
    "ReadyForCertification",
  );
  assert.equal(KnowledgeModelingPlatformReadiness.flags.PlatformComplete, true);
  assert.equal(
    KnowledgeModelingPlatformReadiness.flags.ReadyForCertification,
    true,
  );
  for (const g of KnowledgeModelingPlatformReadiness.gates) {
    assert.equal(g.status, "Pass", `${g.gateId} failed: ${g.actual}`);
  }
});

test("12. summary and status helpers are deterministic", () => {
  const s1 = getKnowledgeModelingPlatformSummary();
  const s2 = getKnowledgeModelingPlatformSummary();
  const t1 = getKnowledgeModelingPlatformStatus();
  const t2 = getKnowledgeModelingPlatformStatus();
  assert.deepEqual(s1, s2);
  assert.deepEqual(t1, t2);
  assert.equal(Object.isFrozen(s1), true);
  assert.equal(Object.isFrozen(t1), true);
  assert.equal(s1.status, "PlatformComplete");
  assert.equal(s1.readiness, "ReadyForCertification");
  assert.equal(s1.sectionCount, 6);
  assert.equal(s1.componentCount, 5);
  assert.equal(s1.allReadinessGatesPass, true);
  assert.equal(t1.allReadinessGatesPass, true);
  assert.equal(t1.validationPass, true);
  assert.equal(
    t1.nextPhase,
    "DKL-4:7 — Knowledge Modeling Certification",
  );
});

test("13. no runtime factories, builders, graph, persistence, or mutation", () => {
  const text = readFileSync(join(HERE, "knowledgeModelingPlatform.ts"), "utf8");
  assert.equal(/class\s/.test(text), false);
  assert.equal(/create[A-Z]|build[A-Z]|factory|Factory|Builder/.test(text), false);
  assert.equal(KnowledgeModelingPlatform.metadata.guarantees.noRuntimeBehavior, true);
  assert.equal(KnowledgeModelingPlatform.metadata.guarantees.noGraphOperations, true);
  assert.equal(
    KnowledgeModelingPlatform.metadata.guarantees.noPersistenceAssumptions,
    true,
  );
  assert.equal(
    KnowledgeModelingPlatform.extensions.mutableRegistrationForbidden,
    true,
  );
  assert.equal(KnowledgeModelingPlatform.metadataOnly, true);
});

test("14. source imports only approved public entry points", () => {
  const sources = [
    "knowledgeModelingPlatform.ts",
    "knowledgeModelingPlatformComponents.ts",
    "knowledgeModelingPlatformDependencies.ts",
    "knowledgeModelingPlatformReadiness.ts",
    "knowledgeModelingPlatformCompatibility.ts",
  ];
  const allowed = [
    "./knowledgeModelingFoundation.ts",
    "./knowledgeModelingRegistry.ts",
    "./knowledgeModelingModel.ts",
    "./knowledgeModelingValidation.ts",
    "./knowledgeModelingManifest.ts",
    "./knowledgeModelingPlatformComponents.ts",
    "./knowledgeModelingPlatformDependencies.ts",
    "./knowledgeModelingPlatformCompatibility.ts",
    "./knowledgeModelingPlatformReadiness.ts",
    "./knowledgeModelingPlatformTypes.ts",
  ];
  for (const file of sources) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+"(\.\/[^"]+)"/g)].map((m) => m[1]);
    for (const imp of imports) {
      assert.ok(allowed.includes(imp), `${file} imports disallowed ${imp}`);
    }
    assert.equal(
      /from\s+"\.\/dataUnderstanding/.test(text),
      false,
      `${file} must not import DKL-3`,
    );
    assert.equal(
      /knowledgeModelingCertification|knowledgeModelingFreeze|knowledgeModelingPublicIndex/.test(
        text,
      ),
      false,
      `${file} must not import future phases`,
    );
  }
});
