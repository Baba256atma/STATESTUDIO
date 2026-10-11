import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS } from "../data-reality/demo/executiveOperationsObjectBindings.ts";
import { EXECUTIVE_OPERATIONS_KPI_DEFINITIONS } from "../data-reality/demo/executiveOperationsKPIDefinitions.ts";
import { EXECUTIVE_OPERATIONS_OBJECT_KEYS } from "../data-reality/demo/executiveOperationsDemoDataset.ts";
import {
  CANONICAL_MANAGED_SUBJECT_BINDINGS,
  CANONICAL_MANAGED_SUBJECT_CATALOG,
  MANAGED_SUBJECT_IDENTITY_BOUNDARY,
  MANAGED_SUBJECT_LEGACY_HELPERS,
  createManagedSubjectCatalogForTests,
  isCanonicalSubjectEvidence,
  managedSubjectIdentityIdentity,
  normalizeDataRealitySubjectId,
  resolveCanonicalManagedSubject,
  resolveDataRealityEvidenceForManagedSubject,
  validateCanonicalManagedSubjectCatalog,
  type CanonicalManagedSubjectBinding,
} from "./managedSubjectIdentity.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = readFileSync(join(HERE, "managedSubjectIdentity.ts"), "utf8");

const LIVE_CAPACITY_OBSERVATION = Object.freeze({
  kpiId: "kpi.production.capacity-utilization",
  objectKey: "production",
  nexoraObjectId: "nexora.executive-operations.object.production",
  value: 87,
  unit: "%",
  calculatedAt: "2026-08-10T00:00:00.000Z",
});

function extraBinding(
  overrides: Partial<CanonicalManagedSubjectBinding> &
    Pick<CanonicalManagedSubjectBinding, "declarationId" | "canonicalSubjectId" | "referenceId">,
): CanonicalManagedSubjectBinding {
  return Object.freeze({
    declarationId: overrides.declarationId,
    canonicalSubjectId: overrides.canonicalSubjectId,
    referenceDomain: overrides.referenceDomain ?? "data-reality",
    referenceId: overrides.referenceId,
    evidenceId: overrides.evidenceId === undefined ? null : overrides.evidenceId,
    relationship: "EVIDENCE_FOR_MANAGED_SUBJECT",
    provenance: Object.freeze({
      owner: managedSubjectIdentityIdentity,
      declarationId: overrides.declarationId,
      source: "internal-canonical-configuration" as const,
    }),
  });
}

test("foundation ownership is product-wide and thin", () => {
  assert.equal(managedSubjectIdentityIdentity, "NPA-T SUBJECT-IDENTITY:2/CanonicalManagedSubjectIdentity");
  assert.equal(MANAGED_SUBJECT_IDENTITY_BOUNDARY.ownsTimeline, false);
  assert.equal(MANAGED_SUBJECT_IDENTITY_BOUNDARY.ownsHistoricalTruth, false);
  assert.equal(MANAGED_SUBJECT_IDENTITY_BOUNDARY.ownsStage, false);
  assert.equal(MANAGED_SUBJECT_IDENTITY_BOUNDARY.ownsObservations, false);
  assert.equal(MANAGED_SUBJECT_IDENTITY_BOUNDARY.copiesBusinessState, false);
  assert.equal(MANAGED_SUBJECT_IDENTITY_BOUNDARY.createsHistory, false);
  assert.equal(MANAGED_SUBJECT_IDENTITY_BOUNDARY.establishesCausation, false);
  assert.equal(MANAGED_SUBJECT_IDENTITY_BOUNDARY.admitsRmsGroundTruth, false);
  assert.doesNotMatch(SOURCE, /attention|geometry|kpiValue|belongs_to|executiveState/);
  assert.doesNotMatch(SOURCE, /sessionStorage|localStorage|Date\.now|new Date/);
  assert.doesNotMatch(SOURCE, /nexoraMVPExecutiveFlow|historicalTruthProjection|ExecutiveTimelineDock/);
  assert.doesNotMatch(SOURCE, /conversationalSubjectRegistry|businessProjectConceptRegistry/);
  assert.doesNotMatch(SOURCE, /rmsGroundTruth|rms-ground-truth/);
  assert.equal(validateCanonicalManagedSubjectCatalog(CANONICAL_MANAGED_SUBJECT_CATALOG).ok, true);
});

test("Proof C — Capacity is evidence-scoped because Production is a broader subject", () => {
  const productionKpis = EXECUTIVE_OPERATIONS_KPI_DEFINITIONS.filter(
    (definition) => definition.objectKey === "production",
  );
  const productionBinding = EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS.find(
    (entry) => entry.nexoraObjectId === "nexora.executive-operations.object.production",
  );
  assert.deepEqual(productionBinding?.metricKeys, ["usedCapacity", "totalCapacity"]);
  assert.deepEqual(
    productionKpis.map((definition) => definition.id),
    ["kpi.production.capacity-utilization"],
  );
  assert.equal(CANONICAL_MANAGED_SUBJECT_BINDINGS[0]?.evidenceId, "kpi.production.capacity-utilization");
  assert.equal(CANONICAL_MANAGED_SUBJECT_BINDINGS[0]?.referenceId, "nexora.executive-operations.object.production");
  assert.equal(CANONICAL_MANAGED_SUBJECT_BINDINGS[0]?.relationship, "EVIDENCE_FOR_MANAGED_SUBJECT");
  const subjectOnly = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "nexora.executive-operations.object.production",
  });
  assert.deepEqual(subjectOnly, { status: "unresolved", reason: "missing-evidence-scope" });
});

test("Proof D / P / G — live Capacity KPI evidence resolves to obj-capacity", () => {
  const exact = resolveCanonicalManagedSubject({
    domain: "canonical-management",
    referenceId: "obj-capacity",
  });
  assert.equal(exact.status, "resolved");
  if (exact.status === "resolved") {
    assert.equal(exact.canonicalSubjectId, "obj-capacity");
    assert.equal(exact.matchKind, "EXACT_CANONICAL_IDENTITY");
    assert.equal(exact.provenance, null);
  }

  const resolved = resolveDataRealityEvidenceForManagedSubject({
    objectKey: LIVE_CAPACITY_OBSERVATION.objectKey,
    nexoraObjectId: LIVE_CAPACITY_OBSERVATION.nexoraObjectId,
    evidenceId: LIVE_CAPACITY_OBSERVATION.kpiId,
  });
  assert.equal(resolved.status, "resolved");
  if (resolved.status === "resolved") {
    assert.equal(resolved.canonicalSubjectId, "obj-capacity");
    assert.equal(resolved.matchKind, "DECLARED_EVIDENCE_REFERENCE");
    assert.equal(resolved.relationship, "EVIDENCE_FOR_MANAGED_SUBJECT");
    assert.equal(resolved.provenance?.declarationId, "cmsi:capacity:kpi.production.capacity-utilization");
    assert.equal(resolved.provenance?.owner, managedSubjectIdentityIdentity);
  }
  assert.equal(
    isCanonicalSubjectEvidence({
      canonicalSubjectId: "obj-capacity",
      domain: "data-reality",
      referenceId: LIVE_CAPACITY_OBSERVATION.nexoraObjectId,
      evidenceId: LIVE_CAPACITY_OBSERVATION.kpiId,
    }),
    true,
  );
});

test("Proof E / F — resolution does not mutate or clone the observation", () => {
  const before = JSON.stringify(LIVE_CAPACITY_OBSERVATION);
  resolveDataRealityEvidenceForManagedSubject({
    objectKey: LIVE_CAPACITY_OBSERVATION.objectKey,
    nexoraObjectId: LIVE_CAPACITY_OBSERVATION.nexoraObjectId,
    evidenceId: LIVE_CAPACITY_OBSERVATION.kpiId,
  });
  assert.equal(JSON.stringify(LIVE_CAPACITY_OBSERVATION), before);
  assert.equal(LIVE_CAPACITY_OBSERVATION.nexoraObjectId, "nexora.executive-operations.object.production");
  assert.equal(LIVE_CAPACITY_OBSERVATION.objectKey, "production");
  assert.equal(LIVE_CAPACITY_OBSERVATION.kpiId, "kpi.production.capacity-utilization");
  assert.equal(LIVE_CAPACITY_OBSERVATION.value, 87);
});

test("Proof H — other Production or warehouse evidence does not become Capacity", () => {
  const throughput = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "nexora.executive-operations.object.production",
    evidenceId: "kpi.production.throughput",
  });
  assert.deepEqual(throughput, { status: "unresolved", reason: "unknown-reference" });
  const warehouse = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "nexora.executive-operations.object.warehouse",
    evidenceId: "kpi.warehouse.capacity-utilization",
  });
  assert.deepEqual(warehouse, { status: "unresolved", reason: "unknown-reference" });
  assert.equal(
    isCanonicalSubjectEvidence({
      canonicalSubjectId: "obj-capacity",
      domain: "data-reality",
      referenceId: "nexora.executive-operations.object.revenue",
      evidenceId: "kpi.revenue.growth",
    }),
    false,
  );
});

test("Proof I / K — unknown and similar strings stay unresolved", () => {
  for (const referenceId of [
    "unknown-source-object",
    "capacity",
    "production capacity",
    "capacity-utilization-copy",
    "obj-capacity-copy",
    "production",
  ]) {
    const resolved = resolveCanonicalManagedSubject({
      domain: "data-reality",
      referenceId,
      evidenceId: "kpi.production.capacity-utilization",
    });
    assert.equal(resolved.status, "unresolved", referenceId);
  }
});

test("Proof J — ambiguous declarations do not silently resolve", () => {
  const catalog = createManagedSubjectCatalogForTests({
    subjects: ["obj-capacity", "obj-test-a"],
    bindings: [
      ...CANONICAL_MANAGED_SUBJECT_BINDINGS,
      extraBinding({
        declarationId: "cmsi:test:ambiguous",
        canonicalSubjectId: "obj-test-a",
        referenceId: "nexora.executive-operations.object.production",
        evidenceId: "kpi.production.capacity-utilization",
      }),
    ],
  });
  assert.equal(validateCanonicalManagedSubjectCatalog(catalog).ok, false);
  assert.deepEqual(validateCanonicalManagedSubjectCatalog(catalog).issues, ["ambiguous-binding"]);
  const resolved = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "nexora.executive-operations.object.production",
    evidenceId: "kpi.production.capacity-utilization",
    catalog,
  });
  assert.equal(resolved.status, "ambiguous");
  if (resolved.status === "ambiguous") {
    assert.deepEqual(resolved.canonicalSubjectIds, ["obj-capacity", "obj-test-a"]);
  }
});

test("duplicate identical declarations stay resolved", () => {
  const catalog = createManagedSubjectCatalogForTests({
    subjects: ["obj-capacity"],
    bindings: [...CANONICAL_MANAGED_SUBJECT_BINDINGS, ...CANONICAL_MANAGED_SUBJECT_BINDINGS],
  });
  assert.equal(validateCanonicalManagedSubjectCatalog(catalog).ok, true);
  const resolved = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "nexora.executive-operations.object.production",
    evidenceId: "kpi.production.capacity-utilization",
    catalog,
  });
  assert.equal(resolved.status, "resolved");
  if (resolved.status === "resolved") {
    assert.equal(resolved.canonicalSubjectId, "obj-capacity");
  }
});

test("Proof L / M / N — Stage, conversation, and BCA are not required", () => {
  assert.doesNotMatch(SOURCE, /dataRealityStageProjection|nexoraMVPStageFixtures/);
  assert.doesNotMatch(SOURCE, /semantic-approximate/);
  assert.equal(MANAGED_SUBJECT_LEGACY_HELPERS.NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS, "PRESENTATION_ONLY");
  assert.equal(MANAGED_SUBJECT_LEGACY_HELPERS.publishedKpiSubjectsEquivalent, "DOMAIN_HELPER");
  assert.equal(MANAGED_SUBJECT_LEGACY_HELPERS.conversationAliases, "LANGUAGE_ONLY");
  assert.equal(MANAGED_SUBJECT_LEGACY_HELPERS.bcaAliases, "LANGUAGE_ONLY");
  const resolved = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "nexora.executive-operations.object.production",
    evidenceId: "kpi.production.capacity-utilization",
  });
  assert.equal(resolved.status, "resolved");
});

test("Proof O — Data Reality still owns production → NOL subject", () => {
  assert.equal(
    normalizeDataRealitySubjectId({ objectKey: "production" }),
    "nexora.executive-operations.object.production",
  );
  assert.equal(
    normalizeDataRealitySubjectId({
      objectKey: "production",
      nexoraObjectId: "obj-capacity",
    }),
    null,
  );
  assert.equal(EXECUTIVE_OPERATIONS_OBJECT_KEYS.includes("production"), true);
  const composed = resolveDataRealityEvidenceForManagedSubject({
    objectKey: "production",
    evidenceId: "kpi.production.capacity-utilization",
  });
  assert.equal(composed.status, "resolved");
  if (composed.status === "resolved") {
    assert.equal(composed.canonicalSubjectId, "obj-capacity");
  }
});

test("Proof T — generic second subject uses declaration data only", () => {
  const catalog = createManagedSubjectCatalogForTests({
    subjects: ["obj-capacity", "obj-test-a"],
    bindings: [
      ...CANONICAL_MANAGED_SUBJECT_BINDINGS,
      extraBinding({
        declarationId: "cmsi:test:external-test-a",
        canonicalSubjectId: "obj-test-a",
        referenceId: "external-test-a",
      }),
    ],
  });
  const resolved = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "external-test-a",
    catalog,
  });
  assert.equal(resolved.status, "resolved");
  if (resolved.status === "resolved") {
    assert.equal(resolved.canonicalSubjectId, "obj-test-a");
  }
  assert.equal(
    resolveCanonicalManagedSubject({
      domain: "data-reality",
      referenceId: "external-test-a",
    }).status,
    "unresolved",
  );
});

test("resolution is deterministic", () => {
  const first = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "nexora.executive-operations.object.production",
    evidenceId: "kpi.production.capacity-utilization",
  });
  const second = resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId: "nexora.executive-operations.object.production",
    evidenceId: "kpi.production.capacity-utilization",
  });
  assert.deepEqual(first, second);
});
