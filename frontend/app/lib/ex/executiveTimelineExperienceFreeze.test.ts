/** EX-3:8 metadata-only Freeze verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveTimelineExperienceFreeze,
  ExecutiveTimelineExperienceFreezeApprovedAliases,
  ExecutiveTimelineExperienceFreezeContracts,
  ExecutiveTimelineExperienceFreezeId,
  ExecutiveTimelineExperienceFreezeIdentity,
  ExecutiveTimelineExperienceFreezeLifecycle,
  ExecutiveTimelineExperienceFreezeLifecycleStates,
  ExecutiveTimelineExperienceFreezeLocks,
  ExecutiveTimelineExperienceFreezeMetadata,
  ExecutiveTimelineExperienceFreezeNamespace,
  ExecutiveTimelineExperienceFreezeReadiness,
  ExecutiveTimelineExperienceFreezeStatus,
  ExecutiveTimelineExperienceFreezeSummaryValue,
  assertExecutiveTimelineExperienceFreezeIdentity,
  assertExecutiveTimelineExperienceFreezeLifecycleTransition,
  canTransitionExecutiveTimelineExperienceFreezeLifecycle,
  getExecutiveTimelineExperienceFreezeSummary,
  resolveExecutiveTimelineExperienceFreezeIdentity,
} from "./executiveTimelineExperienceFreeze.ts";
import { ExecutiveTimelineExperienceCertification } from "./executiveTimelineExperienceCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveTimelineExperienceFreeze.ts",
  "executiveTimelineExperienceFreezeTypes.ts",
  "executiveTimelineExperienceFreezeIdentity.ts",
  "executiveTimelineExperienceFreezeLifecycle.ts",
  "executiveTimelineExperienceFreezeContracts.ts",
  "executiveTimelineExperienceFreezeLocks.ts",
  "executiveTimelineExperienceFreezeMetadata.ts",
  "executiveTimelineExperienceFreeze.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-3:8 package inventory and dependency", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperienceFreeze(?:[A-Z].*)?(?:\.test)?\.ts$/.test(name)
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Certification as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveTimelineExperienceFreeze.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveTimelineExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Freeze"));
    assert.deepEqual(upstreamImports, [
      "./executiveTimelineExperienceCertification.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Foundation|Registry|Model|Validation|Manifest|Platform)(?:[A-Z.]|\.ts)/i,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperiencePublicIndex/i,
      );
      assert.doesNotMatch(source, /from ["'][^"']*(?:\/rtc\/|react|next)/i);
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
    }
  });

  it("does not authorize Public Index from Freeze flags", () => {
    assert.equal(ExecutiveTimelineExperienceFreeze.publicIndexCreated, false);
    assert.equal(ExecutiveTimelineExperienceFreeze.publicIndexAuthorized, false);
    assert.equal(ExecutiveTimelineExperienceFreeze.ex39Created, false);
    assert.equal(ExecutiveTimelineExperienceFreeze.ex39Authorized, false);
  });
});

describe("EX-3:8 identity and lifecycle", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveTimelineExperienceFreezeId,
      "EX-3:8/ExecutiveTimelineExperienceFreeze",
    );
    assert.equal(
      ExecutiveTimelineExperienceFreezeNamespace,
      "nexora.ex.executive.timeline.experience.freeze",
    );
    assert.equal(ExecutiveTimelineExperienceFreezeStatus, "Frozen");
    assert.equal(
      ExecutiveTimelineExperienceFreezeReadiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveTimelineExperienceFreezeIdentity
        .readyForPublicIndexAuthorizesEx39,
      false,
    );
  });

  for (const value of [
    ExecutiveTimelineExperienceFreezeId,
    ExecutiveTimelineExperienceFreezeNamespace,
    ...ExecutiveTimelineExperienceFreezeApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceFreezeIdentity(value).ok,
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperienceFreezeIdentity(value),
        ExecutiveTimelineExperienceFreezeId,
      );
    });
  }

  for (const value of [null, "", " EX-3:8", "ex-3:8", "EX-3:9", "EX-3:7"]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceFreezeIdentity(value).ok,
        false,
      );
      assert.throws(() => assertExecutiveTimelineExperienceFreezeIdentity(value));
    });
  }

  it("allows only immediate forward lifecycle transitions", () => {
    assert.deepEqual(
      [...ExecutiveTimelineExperienceFreezeLifecycleStates],
      ["Draft", "Prepared", "Validated", "Frozen", "ReadyForPublicIndex"],
    );
    for (
      let index = 0;
      index < ExecutiveTimelineExperienceFreezeLifecycleStates.length - 1;
      index += 1
    ) {
      const from = ExecutiveTimelineExperienceFreezeLifecycleStates[index];
      const to = ExecutiveTimelineExperienceFreezeLifecycleStates[index + 1];
      assert.equal(
        canTransitionExecutiveTimelineExperienceFreezeLifecycle(from, to),
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperienceFreezeLifecycleTransition(from, to),
        true,
      );
    }
    assert.equal(
      canTransitionExecutiveTimelineExperienceFreezeLifecycle(
        "ReadyForPublicIndex",
        "Draft",
      ),
      false,
    );
    assert.equal(
      ExecutiveTimelineExperienceFreezeLifecycle.currentState,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveTimelineExperienceFreezeLifecycle.rollbackAllowed,
      false,
    );
  });
});

describe("EX-3:8 locks, contracts, and aggregate", () => {
  it("publishes exactly twelve immutable Locked locks in order", () => {
    assert.equal(ExecutiveTimelineExperienceFreezeLocks.length, 12);
    assert.deepEqual(
      ExecutiveTimelineExperienceFreezeLocks.map((entry) => entry.name),
      [
        "IdentityLock",
        "NamespaceLock",
        "UpstreamLock",
        "MetadataLock",
        "LifecycleLock",
        "CertificationLock",
        "ContractLock",
        "AuthorizationLock",
        "BoundaryLock",
        "AggregateLock",
        "ReadinessLock",
        "FreezeIntegrityLock",
      ],
    );
    ExecutiveTimelineExperienceFreezeLocks.forEach((entry, index) => {
      assert.equal(entry.order, index + 1);
      assert.equal(entry.outcome, "Locked");
      assert.equal(entry.failClosed, true);
      assert.equal(Object.isFrozen(entry), true);
    });
  });

  it("publishes exactly ten immutable contracts in order", () => {
    assert.equal(ExecutiveTimelineExperienceFreezeContracts.length, 10);
    assert.deepEqual(
      ExecutiveTimelineExperienceFreezeContracts.map(
        (contract) => contract.name,
      ),
      [
        "Upstream",
        "Freeze",
        "Metadata",
        "Boundary",
        "Authorization",
        "Lifecycle",
        "Integrity",
        "Readiness",
        "Publication",
        "Aggregate",
      ],
    );
  });

  it("exposes one immutable Freeze aggregate with Certification upstream", () => {
    assert.equal(Object.isFrozen(ExecutiveTimelineExperienceFreeze), true);
    assert.equal(
      ExecutiveTimelineExperienceFreeze.certification,
      ExecutiveTimelineExperienceCertification,
    );
    assert.equal(ExecutiveTimelineExperienceFreeze.sealed, true);
    assert.equal(ExecutiveTimelineExperienceFreeze.mutationAllowed, false);
    assert.equal(ExecutiveTimelineExperienceFreeze.modifiesCertification, false);
    assert.equal(ExecutiveTimelineExperienceFreeze.metadataOnly, true);
    assert.equal(ExecutiveTimelineExperienceFreeze.playbackEngine, false);
    assert.equal(ExecutiveTimelineExperienceFreeze.rtcIntegration, false);
    assert.equal(ExecutiveTimelineExperienceFreeze.uiRendering, false);
  });

  it("publishes immutable metadata and summary", () => {
    assert.equal(
      ExecutiveTimelineExperienceFreezeMetadata.freezeIdentity,
      ExecutiveTimelineExperienceFreezeId,
    );
    assert.equal(ExecutiveTimelineExperienceFreezeMetadata.lockCount, 12);
    assert.equal(ExecutiveTimelineExperienceFreezeMetadata.contractCount, 10);
    assert.equal(
      ExecutiveTimelineExperienceFreezeMetadata.upstreamIdentity,
      ExecutiveTimelineExperienceCertification.identity.id,
    );
    assert.equal(
      ExecutiveTimelineExperienceFreezeMetadata.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      getExecutiveTimelineExperienceFreezeSummary(),
      ExecutiveTimelineExperienceFreezeSummaryValue,
    );
    assert.equal(ExecutiveTimelineExperienceFreezeSummaryValue.status, "Frozen");
    assert.equal(
      ExecutiveTimelineExperienceFreezeSummaryValue.publicIndexAuthorized,
      false,
    );
  });
});
