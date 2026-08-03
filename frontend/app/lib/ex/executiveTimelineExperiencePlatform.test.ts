/** EX-3:6 metadata-only Platform verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveTimelineExperiencePlatform,
  ExecutiveTimelineExperiencePlatformApprovedAliases,
  ExecutiveTimelineExperiencePlatformCanonicalEligibility,
  ExecutiveTimelineExperiencePlatformCanonicalInput,
  ExecutiveTimelineExperiencePlatformCapabilityBindings,
  ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding,
  ExecutiveTimelineExperiencePlatformContracts,
  ExecutiveTimelineExperiencePlatformId,
  ExecutiveTimelineExperiencePlatformIdentity,
  ExecutiveTimelineExperiencePlatformLifecycle,
  ExecutiveTimelineExperiencePlatformLifecycleStates,
  ExecutiveTimelineExperiencePlatformMetadata,
  ExecutiveTimelineExperiencePlatformNamespace,
  ExecutiveTimelineExperiencePlatformReadiness,
  ExecutiveTimelineExperiencePlatformStatus,
  ExecutiveTimelineExperiencePlatformSummaryValue,
  assertExecutiveTimelineExperiencePlatformIdentity,
  assertExecutiveTimelineExperiencePlatformLifecycleTransition,
  canTransitionExecutiveTimelineExperiencePlatformLifecycle,
  evaluateExecutiveTimelineExperiencePlatformEligibility,
  getExecutiveTimelineExperiencePlatformSummary,
  resolveExecutiveTimelineExperiencePlatformIdentity,
} from "./executiveTimelineExperiencePlatform.ts";
import { ExecutiveTimelineExperienceManifest } from "./executiveTimelineExperienceManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveTimelineExperiencePlatform.ts",
  "executiveTimelineExperiencePlatformTypes.ts",
  "executiveTimelineExperiencePlatformIdentity.ts",
  "executiveTimelineExperiencePlatformLifecycle.ts",
  "executiveTimelineExperiencePlatformContracts.ts",
  "executiveTimelineExperiencePlatformBindings.ts",
  "executiveTimelineExperiencePlatformMetadata.ts",
  "executiveTimelineExperiencePlatform.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-3:6 package inventory and dependency", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperiencePlatform(?:[A-Z].*)?(?:\.test)?\.ts$/.test(
        name,
      )
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Manifest as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveTimelineExperiencePlatform.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveTimelineExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Platform"));
    assert.deepEqual(upstreamImports, [
      "./executiveTimelineExperienceManifest.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Foundation|Registry|Model|Validation)(?:[A-Z.]|\.ts)/i,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Certification|Freeze|PublicIndex)/i,
      );
      assert.doesNotMatch(source, /from ["'][^"']*(?:\/rtc\/|react|next)/i);
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
    }
  });

  it("does not authorize Certification from Platform flags", () => {
    assert.equal(
      ExecutiveTimelineExperiencePlatform.certificationCreated,
      false,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatform.certificationAuthorized,
      false,
    );
    assert.equal(ExecutiveTimelineExperiencePlatform.ex37Created, false);
  });
});

describe("EX-3:6 identity and lifecycle", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveTimelineExperiencePlatformId,
      "EX-3:6/ExecutiveTimelineExperiencePlatform",
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformNamespace,
      "nexora.ex.executive.timeline.experience.platform",
    );
    assert.equal(ExecutiveTimelineExperiencePlatformStatus, "Platform");
    assert.equal(
      ExecutiveTimelineExperiencePlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformIdentity
        .readyForCertificationAuthorizesEx37,
      false,
    );
  });

  for (const value of [
    ExecutiveTimelineExperiencePlatformId,
    ExecutiveTimelineExperiencePlatformNamespace,
    ...ExecutiveTimelineExperiencePlatformApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperiencePlatformIdentity(value).ok,
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperiencePlatformIdentity(value),
        ExecutiveTimelineExperiencePlatformId,
      );
    });
  }

  for (const value of [null, "", " EX-3:6", "ex-3:6", "EX-3:7", "EX-3:5"]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperiencePlatformIdentity(value).ok,
        false,
      );
      assert.throws(() =>
        assertExecutiveTimelineExperiencePlatformIdentity(value)
      );
    });
  }

  it("allows only immediate forward lifecycle transitions", () => {
    assert.deepEqual(
      [...ExecutiveTimelineExperiencePlatformLifecycleStates],
      [
        "Draft",
        "Prepared",
        "Integrated",
        "Platform",
        "ReadyForCertification",
      ],
    );
    for (
      let index = 0;
      index < ExecutiveTimelineExperiencePlatformLifecycleStates.length - 1;
      index += 1
    ) {
      const from = ExecutiveTimelineExperiencePlatformLifecycleStates[index];
      const to = ExecutiveTimelineExperiencePlatformLifecycleStates[index + 1];
      assert.equal(
        canTransitionExecutiveTimelineExperiencePlatformLifecycle(from, to),
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperiencePlatformLifecycleTransition(from, to),
        true,
      );
    }
    assert.equal(
      canTransitionExecutiveTimelineExperiencePlatformLifecycle(
        "ReadyForCertification",
        "Draft",
      ),
      false,
    );
    assert.equal(
      canTransitionExecutiveTimelineExperiencePlatformLifecycle(
        "Draft",
        "Integrated",
      ),
      false,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformLifecycle.currentState,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformLifecycle.rollbackAllowed,
      false,
    );
  });
});

describe("EX-3:6 bindings, contracts, eligibility, and consumer", () => {
  it("publishes exactly sixteen immutable capability bindings in order", () => {
    assert.equal(
      ExecutiveTimelineExperiencePlatformCapabilityBindings.length,
      16,
    );
    ExecutiveTimelineExperiencePlatformCapabilityBindings.forEach(
      (binding, index) => {
        const capability =
          ExecutiveTimelineExperienceManifest.capabilities[index];
        assert.equal(binding.order, index + 1);
        assert.equal(binding.manifestCapabilityId, capability.capabilityId);
        assert.equal(binding.manifestCapabilityName, capability.name);
        assert.equal(binding.executable, false);
        assert.equal(Object.isFrozen(binding), true);
      },
    );
  });

  it("publishes exactly ten immutable contracts in order", () => {
    assert.equal(ExecutiveTimelineExperiencePlatformContracts.length, 10);
    assert.deepEqual(
      ExecutiveTimelineExperiencePlatformContracts.map(
        (contract) => contract.name,
      ),
      [
        "Upstream",
        "Platform",
        "Metadata",
        "Boundary",
        "Authorization",
        "Capability",
        "Dependency",
        "Lifecycle",
        "Readiness",
        "Aggregate",
      ],
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformContracts.every(
        (contract, index) =>
          contract.order === index + 1
          && contract.descriptiveOnly === true
          && Object.isFrozen(contract),
      ),
      true,
    );
  });

  it("evaluates canonical eligibility as Eligible and fail-closed otherwise", () => {
    assert.equal(
      ExecutiveTimelineExperiencePlatformCanonicalEligibility.eligible,
      true,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformCanonicalEligibility.eligibility,
      "Eligible",
    );
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperiencePlatformCanonicalEligibility),
      true,
    );

    const cloned = evaluateExecutiveTimelineExperiencePlatformEligibility(
      Object.freeze({
        ...ExecutiveTimelineExperiencePlatformCanonicalInput,
        manifest: Object.freeze({
          ...ExecutiveTimelineExperienceManifest,
        }),
        manifestIdentity: ExecutiveTimelineExperienceManifest.identity.id,
      }),
    );
    assert.equal(cloned.eligible, false);
    assert.equal(
      cloned.reasons.some((reason) => reason.code === "ManifestCloned"),
      true,
    );

    const incomplete = evaluateExecutiveTimelineExperiencePlatformEligibility(
      Object.freeze({
        ...ExecutiveTimelineExperiencePlatformCanonicalInput,
        capabilityBindings: Object.freeze([]),
      }),
    );
    assert.equal(incomplete.eligible, false);
    assert.equal(
      incomplete.reasons.some(
        (reason) => reason.code === "CapabilityBindingIncomplete",
      ),
      true,
    );

    const a = evaluateExecutiveTimelineExperiencePlatformEligibility(
      ExecutiveTimelineExperiencePlatformCanonicalInput,
    );
    const b = evaluateExecutiveTimelineExperiencePlatformEligibility(
      ExecutiveTimelineExperiencePlatformCanonicalInput,
    );
    assert.deepEqual(a, b);

    for (const value of [null, undefined, "bad", 1]) {
      assert.equal(
        evaluateExecutiveTimelineExperiencePlatformEligibility(value).eligible,
        false,
      );
    }
  });

  it("publishes immutable consumer binding metadata", () => {
    assert.equal(
      ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding
        .requiredReadiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding
        .publicReleaseState,
      "NotReleased",
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding
        .supportedConsumers.length > 0,
      true,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding
        .unsupportedConsumers.includes("RuntimePlaybackConsumer"),
      true,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding
        .prohibitedImports.includes("rtc"),
      true,
    );
    assert.equal(
      Object.isFrozen(
        ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding,
      ),
      true,
    );
  });
});

describe("EX-3:6 metadata, summary, and aggregate", () => {
  it("publishes immutable metadata with upstream and authorization references", () => {
    assert.equal(
      ExecutiveTimelineExperiencePlatformMetadata.platformIdentity,
      ExecutiveTimelineExperiencePlatformId,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformMetadata.capabilityBindingCount,
      16,
    );
    assert.equal(ExecutiveTimelineExperiencePlatformMetadata.contractCount, 10);
    assert.equal(
      ExecutiveTimelineExperiencePlatformMetadata.upstreamIdentity,
      ExecutiveTimelineExperienceManifest.identity.id,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformMetadata.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperiencePlatformMetadata),
      true,
    );
  });

  it("exposes the complete immutable aggregate and summary", () => {
    assert.equal(Object.isFrozen(ExecutiveTimelineExperiencePlatform), true);
    assert.equal(
      ExecutiveTimelineExperiencePlatform.manifest,
      ExecutiveTimelineExperienceManifest,
    );
    assert.equal(ExecutiveTimelineExperiencePlatform.metadataOnly, true);
    assert.equal(ExecutiveTimelineExperiencePlatform.playbackEngine, false);
    assert.equal(ExecutiveTimelineExperiencePlatform.rtcIntegration, false);
    assert.equal(ExecutiveTimelineExperiencePlatform.uiRendering, false);
    assert.equal(
      getExecutiveTimelineExperiencePlatformSummary(),
      ExecutiveTimelineExperiencePlatformSummaryValue,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformSummaryValue.capabilityBindingCount,
      16,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformSummaryValue.contractCount,
      10,
    );
    assert.equal(
      ExecutiveTimelineExperiencePlatformSummaryValue.eligibility,
      "Eligible",
    );
  });
});
