import assert from "node:assert/strict";
import test from "node:test";

import * as freezeApi from "./dataSourceKnowledgeFreezePlatform.ts";
import {
  DataSourceKnowledgeFreezeBaseline,
  DataSourceKnowledgeFreezeCompatibility,
  DataSourceKnowledgeFreezeGuarantees,
  DataSourceKnowledgeFreezeLocks,
  DataSourceKnowledgeFreezeManifest,
  DataSourceKnowledgeFreezePlatform,
  DataSourceKnowledgeFreezeRegistry,
  DataSourceKnowledgeFreezeSummary,
} from "./dataSourceKnowledgeFreezePlatform.ts";

import * as foundationModule from "./dataSourceKnowledgeRegistryFoundation.ts";
import * as registryModule from "./dataSourceKnowledgeRegistryPlatform.ts";
import * as modelModule from "./dataSourceRegistryModelPlatform.ts";
import * as validationModule from "./dataSourceKnowledgeValidationRunner.ts";
import * as manifestModule from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import * as platformIndexModule from "./dataSourceKnowledgeRegistryPlatformIndex.ts";
import * as certificationModule from "./dataSourceKnowledgeCertificationPlatform.ts";
import {
  DataSourceKnowledgeCertificationEvidence,
  DataSourceKnowledgeCertificationGates,
} from "./dataSourceKnowledgeCertificationPlatform.ts";
import { DataSourceKnowledgeRegistryPlatform as Dkl22RegistryPlatform } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceKnowledgeRegistryPlatform as Dkl26CompletePlatform } from "./dataSourceKnowledgeRegistryPlatformIndex.ts";

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

const EXPECTED_PUBLIC_API = [
  "DataSourceKnowledgeFreezePlatform",
  "DataSourceKnowledgeFreezeRegistry",
  "DataSourceKnowledgeFreezeBaseline",
  "DataSourceKnowledgeFreezeCompatibility",
  "DataSourceKnowledgeFreezeLocks",
  "DataSourceKnowledgeFreezeGuarantees",
  "DataSourceKnowledgeFreezeManifest",
  "DataSourceKnowledgeFreezeSummary",
];

const EXPECTED_LOCK_IDS = [
  "IdentityLock",
  "RegistryIdentifierLock",
  "ModelIdentifierLock",
  "ValidationRuleLock",
  "OwnershipBoundaryLock",
  "DependencyBoundaryLock",
  "PublicApiRemovalLock",
  "PublicIndexNamingLock",
];

test("1. eight DKL-2:8 files are represented by the freeze surface", () => {
  assert.ok(DataSourceKnowledgeFreezeRegistry);
  assert.ok(DataSourceKnowledgeFreezeBaseline);
  assert.ok(DataSourceKnowledgeFreezeCompatibility);
  assert.ok(DataSourceKnowledgeFreezeLocks);
  assert.ok(DataSourceKnowledgeFreezeGuarantees);
  assert.ok(DataSourceKnowledgeFreezeManifest);
  assert.ok(DataSourceKnowledgeFreezeSummary);
  assert.ok(DataSourceKnowledgeFreezePlatform);
});

test("2. freeze platform module has exactly eight runtime exports", () => {
  assert.equal(Object.keys(freezeApi).length, 8);
  assert.deepEqual(Object.keys(freezeApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("3. exactly eight frozen components exist", () => {
  assert.equal(DataSourceKnowledgeFreezeRegistry.components.length, 8);
});

test("4, 5, 6. every component is Frozen, StableAndFrozen, ownership-protected", () => {
  for (const component of DataSourceKnowledgeFreezeRegistry.components) {
    assert.equal(component.freezeStatus, "Frozen");
    assert.equal(component.stability, "StableAndFrozen");
    assert.equal(component.ownershipStatus, "Protected");
    assert.equal(component.compatibilityStatus, "Compatible");
    assert.equal(component.readiness, "ReadyForPublicIndex");
  }
});

test("7. frozen runtime API total is exactly 52", () => {
  assert.equal(DataSourceKnowledgeFreezeRegistry.frozenRuntimeApiCount, 52);
  assert.equal(DataSourceKnowledgeFreezeManifest.frozenRuntimeApiCount, 52);
  assert.equal(DataSourceKnowledgeFreezeSummary.frozenRuntimeApiCount, 52);
  const sum =
    Object.keys(foundationModule).length +
    Object.keys(registryModule).length +
    Object.keys(modelModule).length +
    Object.keys(validationModule).length +
    Object.keys(manifestModule).length +
    Object.keys(platformIndexModule).length +
    Object.keys(certificationModule).length;
  assert.equal(sum, 52);
});

test("8. foundation baseline counts match DKL-2:1", () => {
  const f = DataSourceKnowledgeFreezeBaseline.foundation;
  assert.equal(f.dataSourceCategoryCount, 23);
  assert.equal(f.knowledgeCategoryCount, 23);
  assert.equal(f.connectorCategoryCount, 9);
  assert.equal(f.contentCategoryCount, 8);
  assert.equal(f.metadataCategoryCount, 7);
  assert.equal(f.sourceGroupCount, 8);
});

test("9. registry baseline count is 95", () => {
  assert.equal(DataSourceKnowledgeFreezeBaseline.registry.totalRegistryEntryCount, 95);
  assert.equal(DataSourceKnowledgeFreezeBaseline.registry.compatibilityRelationshipCount, 24);
});

test("10. model baseline count is 86", () => {
  assert.equal(DataSourceKnowledgeFreezeBaseline.model.totalModelCount, 86);
  assert.equal(DataSourceKnowledgeFreezeBaseline.model.identityModelCount, 7);
});

test("11. validation baseline reports 40/40 PASS", () => {
  const v = DataSourceKnowledgeFreezeBaseline.validation;
  assert.equal(v.validationRuleCount, 40);
  assert.equal(v.validationPassCount, 40);
  assert.equal(v.validationFailCount, 0);
  assert.equal(v.validationWarningCount, 0);
  assert.equal(v.validationCategoryCount, 10);
  assert.equal(v.validationStatus, "ValidationCertified");
});

test("12. manifest baseline reports 9 sections and 12 guarantees", () => {
  assert.equal(DataSourceKnowledgeFreezeBaseline.manifest.manifestSectionCount, 9);
  assert.equal(DataSourceKnowledgeFreezeBaseline.manifest.guaranteeCount, 12);
  assert.equal(DataSourceKnowledgeFreezeBaseline.manifest.manifestStatus, "ManifestComplete");
});

test("13. platform baseline distinguishes artifact-count semantics", () => {
  const p = DataSourceKnowledgeFreezeBaseline.platform;
  assert.equal(p.platformMetadataArtifactCount, 41);
  assert.equal(p.physicalPhaseArtifactCountThroughDKL26, 48);
  assert.notEqual(p.platformMetadataArtifactCount, p.physicalPhaseArtifactCountThroughDKL26);
  assert.equal(p.platformPhaseCount, 5);
  assert.equal(p.platformStatus, "PlatformComplete");
});

test("14. certification baseline reports 7, 14, 25, and 10", () => {
  const c = DataSourceKnowledgeFreezeBaseline.certification;
  assert.equal(c.certificationComponentCount, 7);
  assert.equal(c.certificationGateCount, 14);
  assert.equal(c.certificationEvidenceCount, 25);
  assert.equal(c.certificationCompatibilityCount, 10);
  assert.equal(c.certificationStatus, "Certified");
});

test("15. exactly ten compatibility policies exist", () => {
  assert.equal(DataSourceKnowledgeFreezeCompatibility.declarations.length, 10);
});

test("16. existing identifier changes are forbidden", () => {
  const decl = DataSourceKnowledgeFreezeCompatibility.getCompatibilityById(
    "ExistingIdentifierChangesForbidden",
  );
  assert.equal(decl?.status, "Forbidden");
});

test("17. existing public API removal is forbidden", () => {
  const decl = DataSourceKnowledgeFreezeCompatibility.getCompatibilityById(
    "ExistingPublicApiRemovalForbidden",
  );
  assert.equal(decl?.status, "Forbidden");
});

test("18. additive compatible extensions are explicitly constrained", () => {
  const additive = DataSourceKnowledgeFreezeCompatibility.declarations.filter(
    (d) => d.changeType === "AdditiveExtension",
  );
  assert.equal(additive.length, 5);
  for (const decl of additive) {
    assert.equal(decl.status, "Compatible");
    assert.ok(decl.conditions.length > 0);
  }
});

test("19. exactly eight extension locks exist", () => {
  assert.equal(DataSourceKnowledgeFreezeLocks.locks.length, 8);
  assert.deepEqual(
    DataSourceKnowledgeFreezeLocks.locks.map((l) => l.lockId),
    EXPECTED_LOCK_IDS,
  );
});

test("20. every extension lock reports Locked", () => {
  for (const lock of DataSourceKnowledgeFreezeLocks.locks) {
    assert.equal(lock.status, "Locked");
  }
});

test("21. public-index naming strategy is locked", () => {
  const lock = DataSourceKnowledgeFreezeLocks.getLockById("PublicIndexNamingLock");
  assert.equal(lock?.status, "Locked");
  assert.match(lock?.description ?? "", /DataSourceKnowledgeRegistryPlatform/);
  const policy = DataSourceKnowledgeFreezeCompatibility.getCompatibilityById(
    "PublicIndexNamingStrategyLocked",
  );
  assert.equal(policy?.status, "Locked");
});

test("22. exactly twelve freeze guarantees exist", () => {
  assert.equal(DataSourceKnowledgeFreezeGuarantees.guarantees.length, 12);
});

test("23. every freeze guarantee reports Guaranteed", () => {
  for (const guarantee of DataSourceKnowledgeFreezeGuarantees.guarantees) {
    assert.equal(guarantee.status, "Guaranteed");
  }
});

test("24. all ids are unique within their domains", () => {
  const componentIds = DataSourceKnowledgeFreezeRegistry.components.map((c) => c.freezeEntryId);
  const compatIds = DataSourceKnowledgeFreezeCompatibility.declarations.map((c) => c.compatibilityId);
  const lockIds = DataSourceKnowledgeFreezeLocks.locks.map((l) => l.lockId);
  const guaranteeIds = DataSourceKnowledgeFreezeGuarantees.guarantees.map((g) => g.guaranteeId);
  assert.equal(new Set(componentIds).size, componentIds.length);
  assert.equal(new Set(compatIds).size, compatIds.length);
  assert.equal(new Set(lockIds).size, lockIds.length);
  assert.equal(new Set(guaranteeIds).size, guaranteeIds.length);
});

test("25. all referenced certification evidence resolves", () => {
  for (const guarantee of DataSourceKnowledgeFreezeGuarantees.guarantees) {
    for (const evidenceId of guarantee.evidenceIds) {
      assert.ok(
        DataSourceKnowledgeCertificationEvidence.getEvidenceById(evidenceId),
        `unresolved evidence: ${evidenceId}`,
      );
    }
  }
  for (const component of DataSourceKnowledgeFreezeRegistry.components) {
    for (const gateId of component.certificationGateIds) {
      assert.ok(
        DataSourceKnowledgeCertificationGates.getGateById(gateId),
        `unresolved gate: ${gateId}`,
      );
    }
  }
});

test("26. all public objects are deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeFreezePlatform));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeFreezeRegistry));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeFreezeBaseline));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeFreezeCompatibility));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeFreezeLocks));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeFreezeGuarantees));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeFreezeManifest));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeFreezeSummary));
});

test("27. unknown lookup ids return undefined and never throw", () => {
  assert.equal(DataSourceKnowledgeFreezeRegistry.getComponentById("nope"), undefined);
  assert.equal(DataSourceKnowledgeFreezeCompatibility.getCompatibilityById("nope"), undefined);
  assert.equal(DataSourceKnowledgeFreezeLocks.getLockById("nope"), undefined);
  assert.equal(DataSourceKnowledgeFreezeGuarantees.getGuaranteeById("nope"), undefined);
});

test("28. repeated access is deterministic", () => {
  const first = DataSourceKnowledgeFreezeLocks.locks.map((l) => l.lockId);
  const second = DataSourceKnowledgeFreezeLocks.locks.map((l) => l.lockId);
  assert.deepEqual(first, second);
});

test("29, 30, 31. dependencies forward-only, cycle-free, public-module-only", () => {
  assert.deepEqual([...DataSourceKnowledgeFreezeManifest.sourcePhases], [
    "DKL-2:1",
    "DKL-2:2",
    "DKL-2:3",
    "DKL-2:4",
    "DKL-2:5",
    "DKL-2:6",
    "DKL-2:7",
  ]);
  const forbidden = /DKL-2:9|DKL-3|Engine|OPS|BUS|Advisor|Director|Scene|EVE|NEA|Persistence/;
  for (const dependency of DataSourceKnowledgeFreezeManifest.dependencies) {
    assert.equal(forbidden.test(dependency), false);
    assert.match(dependency, /\.ts$/);
  }
});

test("32. no forbidden runtime behavior: every public export is data (no functions)", () => {
  for (const value of Object.values(freezeApi)) {
    assert.notEqual(typeof value, "function");
  }
  assert.equal(DataSourceKnowledgeFreezePlatform.metadataOnly, true);
  assert.equal(DataSourceKnowledgeFreezePlatform.runtimeFree, true);
});

test("33. manifest counts match actual inventories", () => {
  const m = DataSourceKnowledgeFreezeManifest;
  assert.equal(m.frozenComponentCount, 8);
  assert.equal(m.frozenRuntimeApiCount, 52);
  assert.equal(m.compatibilityDeclarationCount, 10);
  assert.equal(m.extensionLockCount, 8);
  assert.equal(m.guaranteeCount, 12);
  assert.equal(m.baselineStatus, "BaselineLocked");
  assert.equal(m.frozenComponentCount, DataSourceKnowledgeFreezeRegistry.components.length);
  assert.equal(m.guaranteeCount, DataSourceKnowledgeFreezeGuarantees.guarantees.length);
});

test("34, 35, 36, 37, 38, 39. status, stability, readiness, next phase", () => {
  assert.equal(DataSourceKnowledgeFreezeManifest.blockingIssueCount, 0);
  assert.equal(DataSourceKnowledgeFreezeManifest.warningCount, 0);
  assert.equal(DataSourceKnowledgeFreezeManifest.freezeStatus, "Frozen");
  assert.equal(DataSourceKnowledgeFreezeManifest.stability, "StableAndFrozen");
  assert.equal(DataSourceKnowledgeFreezeManifest.readiness, "ReadyForPublicIndex");
  assert.equal(DataSourceKnowledgeFreezeManifest.nextPhase, "DKL-2:9");
  assert.equal(DataSourceKnowledgeFreezeSummary.status, "Frozen");
  assert.equal(DataSourceKnowledgeFreezeSummary.stability, "StableAndFrozen");
  assert.equal(DataSourceKnowledgeFreezeSummary.readiness, "ReadyForPublicIndex");
  assert.equal(DataSourceKnowledgeFreezeSummary.nextPhase, "DKL-2:9");
  assert.equal(DataSourceKnowledgeFreezePlatform.identity.freezeStatus, "Frozen");
  assert.equal(DataSourceKnowledgeFreezePlatform.identity.stability, "StableAndFrozen");
  assert.equal(DataSourceKnowledgeFreezePlatform.identity.readiness, "ReadyForPublicIndex");
});

test("40. DKL-2:2 and DKL-2:6 ambiguity cannot leak into the Public Index", () => {
  assert.notEqual(Dkl22RegistryPlatform as object, Dkl26CompletePlatform as object);
  const lock = DataSourceKnowledgeFreezeLocks.getLockById("PublicIndexNamingLock");
  assert.equal(lock?.status, "Locked");
  const policy = DataSourceKnowledgeFreezeCompatibility.getCompatibilityById(
    "PublicIndexNamingStrategyLocked",
  );
  assert.equal(policy?.status, "Locked");
  assert.equal(policy?.protectedSurfaces.length, 2);
  assert.match(lock?.policy ?? "", /one canonical complete-platform name/i);
});

test("41. freeze platform aggregates canonical objects by reference", () => {
  assert.equal(DataSourceKnowledgeFreezePlatform.registry, DataSourceKnowledgeFreezeRegistry);
  assert.equal(DataSourceKnowledgeFreezePlatform.baseline, DataSourceKnowledgeFreezeBaseline);
  assert.equal(DataSourceKnowledgeFreezePlatform.compatibility, DataSourceKnowledgeFreezeCompatibility);
  assert.equal(DataSourceKnowledgeFreezePlatform.locks, DataSourceKnowledgeFreezeLocks);
  assert.equal(DataSourceKnowledgeFreezePlatform.guarantees, DataSourceKnowledgeFreezeGuarantees);
  assert.equal(DataSourceKnowledgeFreezePlatform.manifest, DataSourceKnowledgeFreezeManifest);
  assert.equal(DataSourceKnowledgeFreezePlatform.summary, DataSourceKnowledgeFreezeSummary);
});
