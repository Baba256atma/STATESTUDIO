/** EX-3:7 metadata-only Certification verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveTimelineExperienceCertification,
  ExecutiveTimelineExperienceCertificationApprovedAliases,
  ExecutiveTimelineExperienceCertificationContracts,
  ExecutiveTimelineExperienceCertificationCriteria,
  ExecutiveTimelineExperienceCertificationEvidenceRecord,
  ExecutiveTimelineExperienceCertificationId,
  ExecutiveTimelineExperienceCertificationIdentity,
  ExecutiveTimelineExperienceCertificationLifecycle,
  ExecutiveTimelineExperienceCertificationLifecycleStates,
  ExecutiveTimelineExperienceCertificationMetadata,
  ExecutiveTimelineExperienceCertificationNamespace,
  ExecutiveTimelineExperienceCertificationReadiness,
  ExecutiveTimelineExperienceCertificationStatus,
  ExecutiveTimelineExperienceCertificationSummaryValue,
  assertExecutiveTimelineExperienceCertificationIdentity,
  assertExecutiveTimelineExperienceCertificationLifecycleTransition,
  canTransitionExecutiveTimelineExperienceCertificationLifecycle,
  getExecutiveTimelineExperienceCertificationSummary,
  resolveExecutiveTimelineExperienceCertificationIdentity,
} from "./executiveTimelineExperienceCertification.ts";
import { ExecutiveTimelineExperiencePlatform } from "./executiveTimelineExperiencePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveTimelineExperienceCertification.ts",
  "executiveTimelineExperienceCertificationTypes.ts",
  "executiveTimelineExperienceCertificationIdentity.ts",
  "executiveTimelineExperienceCertificationLifecycle.ts",
  "executiveTimelineExperienceCertificationContracts.ts",
  "executiveTimelineExperienceCertificationEvidence.ts",
  "executiveTimelineExperienceCertificationMetadata.ts",
  "executiveTimelineExperienceCertification.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-3:7 package inventory and dependency", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperienceCertification(?:[A-Z].*)?(?:\.test)?\.ts$/
        .test(name)
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Platform as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveTimelineExperienceCertification.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveTimelineExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Certification"));
    assert.deepEqual(upstreamImports, [
      "./executiveTimelineExperiencePlatform.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Foundation|Registry|Model|Validation|Manifest)(?:[A-Z.]|\.ts)/i,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Freeze|PublicIndex)/i,
      );
      assert.doesNotMatch(source, /from ["'][^"']*(?:\/rtc\/|react|next)/i);
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
    }
  });

  it("does not authorize Freeze from Certification flags", () => {
    assert.equal(ExecutiveTimelineExperienceCertification.freezeCreated, false);
    assert.equal(
      ExecutiveTimelineExperienceCertification.freezeAuthorized,
      false,
    );
    assert.equal(ExecutiveTimelineExperienceCertification.ex38Created, false);
  });
});

describe("EX-3:7 identity and lifecycle", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveTimelineExperienceCertificationId,
      "EX-3:7/ExecutiveTimelineExperienceCertification",
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationNamespace,
      "nexora.ex.executive.timeline.experience.certification",
    );
    assert.equal(ExecutiveTimelineExperienceCertificationStatus, "Certified");
    assert.equal(
      ExecutiveTimelineExperienceCertificationReadiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationIdentity
        .readyForFreezeAuthorizesEx38,
      false,
    );
  });

  for (const value of [
    ExecutiveTimelineExperienceCertificationId,
    ExecutiveTimelineExperienceCertificationNamespace,
    ...ExecutiveTimelineExperienceCertificationApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceCertificationIdentity(value).ok,
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperienceCertificationIdentity(value),
        ExecutiveTimelineExperienceCertificationId,
      );
    });
  }

  for (const value of [null, "", " EX-3:7", "ex-3:7", "EX-3:8", "EX-3:6"]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceCertificationIdentity(value).ok,
        false,
      );
      assert.throws(() =>
        assertExecutiveTimelineExperienceCertificationIdentity(value)
      );
    });
  }

  it("allows only immediate forward lifecycle transitions", () => {
    assert.deepEqual(
      [...ExecutiveTimelineExperienceCertificationLifecycleStates],
      ["Draft", "Prepared", "Review", "Certified", "ReadyForFreeze"],
    );
    for (
      let index = 0;
      index < ExecutiveTimelineExperienceCertificationLifecycleStates.length - 1;
      index += 1
    ) {
      const from =
        ExecutiveTimelineExperienceCertificationLifecycleStates[index];
      const to =
        ExecutiveTimelineExperienceCertificationLifecycleStates[index + 1];
      assert.equal(
        canTransitionExecutiveTimelineExperienceCertificationLifecycle(
          from,
          to,
        ),
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperienceCertificationLifecycleTransition(
          from,
          to,
        ),
        true,
      );
    }
    assert.equal(
      canTransitionExecutiveTimelineExperienceCertificationLifecycle(
        "ReadyForFreeze",
        "Draft",
      ),
      false,
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationLifecycle.currentState,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationLifecycle.rollbackAllowed,
      false,
    );
  });
});

describe("EX-3:7 criteria, contracts, and evidence", () => {
  it("publishes exactly sixteen satisfied immutable criteria in order", () => {
    assert.equal(ExecutiveTimelineExperienceCertificationCriteria.length, 16);
    assert.deepEqual(
      ExecutiveTimelineExperienceCertificationCriteria.map(
        (entry) => entry.name,
      ),
      [
        "IdentityIntegrity",
        "NamespaceIntegrity",
        "PlatformDependencyIntegrity",
        "CapabilityBindingCompleteness",
        "ContractCompleteness",
        "MetadataIntegrity",
        "LifecycleIntegrity",
        "ConsumerBindingIntegrity",
        "EligibilityIntegrity",
        "ReadinessIntegrity",
        "AggregateIntegrity",
        "ArchitecturalBoundaryIntegrity",
        "DeterministicBehavior",
        "TypeScriptVerification",
        "ESLintVerification",
        "PlatformVerification",
      ],
    );
    ExecutiveTimelineExperienceCertificationCriteria.forEach((entry, index) => {
      assert.equal(entry.order, index + 1);
      assert.equal(entry.outcome, "Satisfied");
      assert.equal(entry.executable, false);
      assert.equal(Object.isFrozen(entry), true);
    });
  });

  it("publishes exactly ten immutable contracts in order", () => {
    assert.equal(ExecutiveTimelineExperienceCertificationContracts.length, 10);
    assert.deepEqual(
      ExecutiveTimelineExperienceCertificationContracts.map(
        (contract) => contract.name,
      ),
      [
        "Upstream",
        "Certification",
        "Metadata",
        "Boundary",
        "Authorization",
        "Evidence",
        "Lifecycle",
        "Readiness",
        "Integrity",
        "Aggregate",
      ],
    );
  });

  it("publishes immutable read-only evidence through Platform", () => {
    const evidence = ExecutiveTimelineExperienceCertificationEvidenceRecord;
    assert.equal(
      evidence.platformIdentity,
      ExecutiveTimelineExperiencePlatform.identity.id,
    );
    assert.equal(
      evidence.manifestIdentity,
      ExecutiveTimelineExperiencePlatform.manifest.identity.id,
    );
    assert.equal(
      evidence.validationIdentity,
      ExecutiveTimelineExperiencePlatform.manifest.validation.identity.id,
    );
    assert.equal(
      evidence.modelIdentity,
      ExecutiveTimelineExperiencePlatform.manifest.validation.model.identity.id,
    );
    assert.equal(
      evidence.registryIdentity,
      ExecutiveTimelineExperiencePlatform.manifest.validation.model.registry
        .identity.id,
    );
    assert.equal(
      evidence.foundationIdentity,
      ExecutiveTimelineExperiencePlatform.manifest.validation.model.registry
        .foundation.identity.id,
    );
    assert.equal(evidence.capabilityBindingCount, 16);
    assert.equal(evidence.contractCount, 10);
    assert.equal(evidence.version, "1.0.0");
    assert.equal(evidence.readiness, "ReadyForCertification");
    assert.equal(evidence.readOnly, true);
    assert.equal(Object.isFrozen(evidence), true);
  });
});

describe("EX-3:7 metadata, summary, and aggregate", () => {
  it("publishes immutable metadata with upstream and authorization references", () => {
    assert.equal(
      ExecutiveTimelineExperienceCertificationMetadata.certificationIdentity,
      ExecutiveTimelineExperienceCertificationId,
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationMetadata.criteriaCount,
      16,
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationMetadata.contractCount,
      10,
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationMetadata.upstreamIdentity,
      ExecutiveTimelineExperiencePlatform.identity.id,
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationMetadata.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperienceCertificationMetadata),
      true,
    );
  });

  it("exposes the complete immutable aggregate and summary", () => {
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperienceCertification),
      true,
    );
    assert.equal(
      ExecutiveTimelineExperienceCertification.platform,
      ExecutiveTimelineExperiencePlatform,
    );
    assert.equal(ExecutiveTimelineExperienceCertification.metadataOnly, true);
    assert.equal(
      ExecutiveTimelineExperienceCertification.playbackEngine,
      false,
    );
    assert.equal(
      getExecutiveTimelineExperienceCertificationSummary(),
      ExecutiveTimelineExperienceCertificationSummaryValue,
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationSummaryValue.status,
      "Certified",
    );
    assert.equal(
      ExecutiveTimelineExperienceCertificationSummaryValue.freezeAuthorized,
      false,
    );
  });
});
