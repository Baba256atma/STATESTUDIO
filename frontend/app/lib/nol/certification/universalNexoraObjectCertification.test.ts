/**
 * NOL-1:7 — Universal NexoraObject Certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createNexoraObjectContract } from "../contract/universalNexoraObjectContract.ts";
import {
  hydrateNexoraObjectRuntimeState,
  resetNexoraObjectRuntimeStoreForTests,
} from "../runtime/universalNexoraObjectRuntimeModel.ts";
import { resetNexoraObjectStateTransitionStoreForTests } from "../state/universalNexoraObjectStateTransitionEngine.ts";
import {
  createNexoraObjectGraph,
  resetNexoraObjectGraphStoreForTests,
} from "../relationship/universalNexoraObjectRelationshipDependencyEngine.ts";
import { resetNexoraValidationStoreForTests } from "../validation/universalNexoraObjectValidationIntegrityEngine.ts";
import {
  NEXORA_CERTIFICATION_POLICIES,
  certifyNexoraObject,
  compareCertification,
  createCertificationReport,
  deserializeCertification,
  getNexoraCertificationHistory,
  getNexoraCertificationState,
  listNexoraCertificationEvents,
  projectCertification,
  recertifyNexoraObject,
  resetNexoraCertificationStoreForTests,
  revokeNexoraObjectCertification,
  serializeCertification,
  certificationIdentity,
  certificationSchemaVersion,
} from "./universalNexoraObjectCertification.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

function makeObject(id: string) {
  const object = createNexoraObjectContract({
    id,
    type: "Decision",
    caption: `Object ${id}`,
    createdAt: "2026-08-04T16:00:00.000Z",
  });
  object.setLifecycle("Active");
  hydrateNexoraObjectRuntimeState(object, undefined, {
    updatedAt: "2026-08-04T16:00:00.000Z",
  });
  return object;
}

function clock(startMs = Date.parse("2026-08-04T16:00:00.000Z")) {
  let t = startMs;
  let cert = 0;
  let evt = 0;
  let report = 0;
  return {
    now: () => new Date(t).toISOString(),
    advance: (ms: number) => {
      t += ms;
    },
    options: () => ({
      now: () => new Date(t).toISOString(),
      createCertificationId: () => `cert-${++cert}`,
      createEventId: () => `cevt-${++evt}`,
      createReportId: () => `crep-${++report}`,
    }),
  };
}

describe("NOL-1:7 Universal NexoraObject Certification", () => {
  beforeEach(() => {
    resetNexoraCertificationStoreForTests();
    resetNexoraValidationStoreForTests();
    resetNexoraObjectRuntimeStoreForTests();
    resetNexoraObjectStateTransitionStoreForTests();
    resetNexoraObjectGraphStoreForTests();
  });

  it("1. New objects begin as NotCertified", () => {
    assert.equal(getNexoraCertificationState("never-seen"), "NotCertified");
    const object = makeObject("c1");
    assert.equal(
      getNexoraCertificationState(object.identity.id),
      "NotCertified",
    );
  });

  it("2. Development profile certification succeeds with valid inputs", () => {
    const object = makeObject("c2");
    const c = clock();
    const result = certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "engineer",
      reason: "dev gate",
      options: c.options(),
    });
    assert.equal(result.certified, true);
    assert.equal(result.certificationState, "Certified");
    assert.equal(result.certificationProfile, "Development");
    assert.ok(result.integrityScore >= 70);
    assert.ok(result.stamp);
    assert.equal(
      getNexoraCertificationState(object.identity.id, c.now),
      "Certified",
    );
  });

  it("3. Testing profile enforces stricter requirements", () => {
    assert.equal(
      NEXORA_CERTIFICATION_POLICIES.Testing.requiredValidationLevel,
      "Strict",
    );
    assert.ok(
      NEXORA_CERTIFICATION_POLICIES.Testing.minimumIntegrityScore >
        NEXORA_CERTIFICATION_POLICIES.Development.minimumIntegrityScore,
    );

    const object = makeObject("c3");
    const c = clock();
    // Valid object still passes Testing when clean.
    const result = certifyNexoraObject({
      object,
      profile: "Testing",
      requestedBy: "qa",
      options: {
        ...c.options(),
        validationOptions: { graphId: undefined },
      },
    });
    assert.equal(result.certified, true);

    // Inject many warnings via external relationships under Strict domains.
    const noisy = makeObject("c3b");
    for (let i = 0; i < 8; i += 1) {
      noisy.addRelationship({
        id: `ext-${i}`,
        kind: "related_to",
        toId: `external-${i}`,
        createdAt: "2026-08-04T16:00:00.000Z",
      });
    }
    const rejected = certifyNexoraObject({
      object: noisy,
      profile: "Testing",
      requestedBy: "qa",
      options: c.options(),
    });
    // Testing allows up to 5 warnings; 8 external refs → fail policy.
    assert.equal(rejected.certified, false);
  });

  it("4. Production profile requires minimum score", () => {
    assert.equal(
      NEXORA_CERTIFICATION_POLICIES.Production.minimumIntegrityScore,
      90,
    );
    const object = makeObject("c4");
    object.setExecutive({ importance: 999 });
    const c = clock();
    const result = certifyNexoraObject({
      object,
      profile: "Production",
      requestedBy: "ops",
      options: c.options(),
    });
    assert.equal(result.certified, false);
    assert.ok(
      result.errors.some(
        (e) =>
          e.code === "CERTIFICATION_SCORE_TOO_LOW" ||
          e.code === "CERTIFICATION_VALIDATION_FAILED",
      ),
    );
  });

  it("5. Platform profile rejects validation errors", () => {
    assert.equal(
      NEXORA_CERTIFICATION_POLICIES.Platform.requireZeroErrors,
      true,
    );
    const object = makeObject("c5");
    object.setVisualization({ opacity: Number.NaN });
    const c = clock();
    createNexoraObjectGraph("cg5", [object], { now: c.now });
    const result = certifyNexoraObject({
      object,
      profile: "Platform",
      requestedBy: "platform",
      options: {
        ...c.options(),
        validationOptions: { graphId: "cg5" },
      },
    });
    assert.equal(result.certified, false);
    assert.ok(
      result.errors.some((e) => e.code === "CERTIFICATION_VALIDATION_FAILED"),
    );
  });

  it("6. Release profile rejects blocking warnings", () => {
    assert.equal(
      NEXORA_CERTIFICATION_POLICIES.Release.requireZeroBlockingWarnings,
      true,
    );
    const object = makeObject("c6");
    // External relationship produces Relationship warnings; Certification
    // without graphId also emits Graph-domain warnings. Release forbids both.
    object.addRelationship({
      id: "ext-release",
      kind: "related_to",
      toId: "outside",
      createdAt: "2026-08-04T16:00:00.000Z",
    });
    const c = clock();
    const result = certifyNexoraObject({
      object,
      profile: "Release",
      requestedBy: "release-manager",
      options: c.options(),
    });
    assert.equal(result.certified, false);
    assert.ok(
      result.errors.some(
        (e) =>
          e.code === "CERTIFICATION_BLOCKING_WARNINGS" ||
          e.code === "CERTIFICATION_POLICY_REJECTED" ||
          e.code === "CERTIFICATION_VALIDATION_FAILED" ||
          e.code === "CERTIFICATION_UNRESOLVED_REPAIRS",
      ),
    );
  });

  it("7. Certification delegates to NOL-1:6 validation", () => {
    const object = makeObject("c7");
    const c = clock();
    const result = certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    assert.equal(result.certified, true);
    assert.ok(result.validationReport);
    assert.equal(
      result.validationReport?.validatorIdentity,
      "NOL-1:6/UniversalNexoraObjectValidationIntegrityEngine",
    );
  });

  it("8. Certification never mutates object identity", () => {
    const object = makeObject("c8");
    const before = {
      id: object.identity.id,
      type: object.identity.type,
      createdAt: object.identity.createdAt,
      version: object.identity.version,
    };
    const c = clock();
    certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    assert.deepEqual(
      {
        id: object.identity.id,
        type: object.identity.type,
        createdAt: object.identity.createdAt,
        version: object.identity.version,
      },
      before,
    );
  });

  it("9. Certification stamp is immutable", () => {
    const object = makeObject("c9");
    const c = clock();
    const result = certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    assert.ok(result.stamp);
    assert.throws(() => {
      (result.stamp as { integrityScore: number }).integrityScore = 1;
    });
  });

  it("10. Certification history is append-only", () => {
    const object = makeObject("c10");
    const c = clock();
    certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const firstHistory = getNexoraCertificationHistory(object.identity.id);
    const firstLen = firstHistory.length;
    recertifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const secondHistory = getNexoraCertificationHistory(object.identity.id);
    assert.ok(secondHistory.length > firstLen);
    // Prior record still present (append-only).
    assert.equal(secondHistory[0]?.certificationId, firstHistory[0]?.certificationId);
  });

  it("11. Recertification creates a new certification ID", () => {
    const object = makeObject("c11");
    const c = clock();
    const first = certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const second = recertifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    assert.equal(first.certified, true);
    assert.equal(second.certified, true);
    assert.notEqual(first.certificationId, second.certificationId);
    assert.ok(second.certificationVersion > first.certificationVersion);
    assert.ok(
      second.events.some((e) => e.type === "RecertificationCompleted"),
    );
  });

  it("12. Revocation preserves history", () => {
    const object = makeObject("c12");
    const c = clock();
    const certified = certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const before = getNexoraCertificationHistory(object.identity.id).length;
    const revoked = revokeNexoraObjectCertification(
      object.identity.id,
      "integrity regression",
      "security",
      { now: c.now },
    );
    assert.equal(revoked.certificationState, "Revoked");
    const history = getNexoraCertificationHistory(object.identity.id);
    assert.ok(history.length >= before);
    assert.ok(history.some((r) => r.certificationId === certified.certificationId));
    assert.equal(
      getNexoraCertificationState(object.identity.id, c.now),
      "Revoked",
    );
  });

  it("13. Expired certifications require recertification", () => {
    const object = makeObject("c13");
    const c = clock();
    const certified = certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: {
        ...c.options(),
        expirationDurationMs: 1000,
      },
    });
    assert.equal(certified.certified, true);
    c.advance(2000);
    assert.equal(
      getNexoraCertificationState(object.identity.id, c.now),
      "Expired",
    );
    const again = recertifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: {
        ...c.options(),
        expirationDurationMs: 60_000,
      },
    });
    assert.equal(again.certified, true);
    assert.notEqual(again.certificationId, certified.certificationId);
    assert.equal(
      getNexoraCertificationState(object.identity.id, c.now),
      "Certified",
    );
  });

  it("14. Certification comparison detects differences", () => {
    const object = makeObject("c14");
    const c = clock();
    const first = certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const second = recertifyNexoraObject({
      object,
      profile: "Testing",
      requestedBy: "qa",
      options: c.options(),
    });
    const history = getNexoraCertificationHistory(object.identity.id);
    const left = history[0]!;
    const right = history[history.length - 1]!;
    const comparison = compareCertification(left, right);
    assert.equal(comparison.sameObject, true);
    assert.equal(comparison.sameProfile, false);
    assert.ok(comparison.differences.includes("profile"));
    assert.ok(comparison.differences.includes("certificationId"));
    assert.ok(first.stamp && second.stamp);
  });

  it("15. Serialization and deserialization are reversible", () => {
    const object = makeObject("c15");
    const c = clock();
    certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const json = serializeCertification(object.identity.id);
    resetNexoraCertificationStoreForTests();
    assert.equal(getNexoraCertificationState(object.identity.id), "NotCertified");
    const projection = deserializeCertification(json);
    assert.equal(projection.objectId, object.identity.id);
    assert.equal(projection.certificationState, "Certified");
    assert.equal(projection.certificationProfile, "Development");
    assert.ok(projection.stamp);
  });

  it("16. Unsupported certification schema is rejected", () => {
    assert.throws(() =>
      deserializeCertification(
        JSON.stringify({
          engineIdentity: certificationIdentity,
          certificationSchemaVersion: "9.9.9",
          objectId: "x",
          certificationVersion: 0,
          current: null,
          history: [],
          events: [],
        }),
      ),
    );
  });

  it("17. Certification projection hides internal policy objects", () => {
    const object = makeObject("c17");
    const c = clock();
    certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const projection = projectCertification(object.identity.id, c.now);
    const keys = Object.keys(projection);
    assert.equal(keys.includes("policies"), false);
    assert.equal(keys.includes("policy"), false);
    assert.equal(keys.includes("policyId"), false);
    assert.ok(keys.includes("stamp"));
    assert.ok(keys.includes("certificationState"));
    assert.equal(projection.engineIdentity, certificationIdentity);
  });

  it("18. Certification events are generated correctly", () => {
    const object = makeObject("c18");
    const c = clock();
    certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const events = listNexoraCertificationEvents(object.identity.id);
    const types = events.map((e) => e.type);
    assert.ok(types.includes("CertificationStarted"));
    assert.ok(types.includes("CertificationPassed"));

    revokeNexoraObjectCertification(
      object.identity.id,
      "manual",
      "admin",
      { now: c.now },
    );
    const after = listNexoraCertificationEvents(object.identity.id).map(
      (e) => e.type,
    );
    assert.ok(after.includes("CertificationRevoked"));
  });

  it("19. Engine imports only NOL-1:1 through NOL-1:6", () => {
    const source = readFileSync(
      join(__dirname, "universalNexoraObjectCertification.ts"),
      "utf8",
    );
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1]!,
    );
    for (const spec of imports) {
      assert.ok(
        spec.includes("/foundation/") ||
          spec.includes("/contract/") ||
          spec.includes("/runtime/") ||
          spec.includes("/state/") ||
          spec.includes("/relationship/") ||
          spec.includes("/validation/"),
        `Unexpected import: ${spec}`,
      );
    }
    assert.equal(source.includes("from \"react\""), false);
    assert.equal(source.includes("next/"), false);
    assert.equal(
      certificationIdentity,
      "NOL-1:7/UniversalNexoraObjectCertification",
    );
    assert.equal(certificationSchemaVersion, "1.0.0");
  });

  it("20. Certification reports are immutable", () => {
    const object = makeObject("c20");
    const c = clock();
    const result = certifyNexoraObject({
      object,
      profile: "Development",
      requestedBy: "eng",
      options: c.options(),
    });
    const report = createCertificationReport(result, "report-20");
    assert.throws(() => {
      (report.result.errors as unknown as { push: (v: unknown) => void }).push(
        {},
      );
    });
    assert.throws(() => {
      (report as { summary: string }).summary = "mutated";
    });
  });
});
