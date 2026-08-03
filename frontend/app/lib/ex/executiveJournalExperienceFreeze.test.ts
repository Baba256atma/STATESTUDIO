/** EX-2:8 metadata-only Freeze verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveJournalExperienceFreeze,
  ExecutiveJournalExperienceFreezeApprovedAliases,
  ExecutiveJournalExperienceFreezeAuthorization,
  ExecutiveJournalExperienceFreezeBoundaries,
  ExecutiveJournalExperienceFreezeContracts,
  ExecutiveJournalExperienceFreezeDecisions,
  ExecutiveJournalExperienceFreezeDependencyDeclaration,
  ExecutiveJournalExperienceFreezeId,
  ExecutiveJournalExperienceFreezeIdentity,
  ExecutiveJournalExperienceFreezeLifecycle,
  ExecutiveJournalExperienceFreezeLifecycleStates,
  ExecutiveJournalExperienceFreezeLocks,
  ExecutiveJournalExperienceFreezeLockSeal,
  ExecutiveJournalExperienceFreezeNamespace,
  ExecutiveJournalExperienceFreezeReadiness,
  ExecutiveJournalExperienceFreezeReadinessConditions,
  ExecutiveJournalExperienceFreezeStatus,
  ExecutiveJournalExperienceFreezeSummaryValue,
  ExecutiveJournalExperienceFreezeUpstream,
  assertExecutiveJournalExperienceFreezeIdentity,
  assertExecutiveJournalExperienceFreezeLifecycleTransition,
  canTransitionExecutiveJournalExperienceFreezeLifecycle,
  getExecutiveJournalExperienceFreezeSummary,
  isExecutiveJournalExperienceFreezeLifecycleState,
  resolveExecutiveJournalExperienceFreezeIdentity,
} from "./executiveJournalExperienceFreeze.ts";
import { ExecutiveJournalExperienceCertification } from "./executiveJournalExperienceCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveJournalExperienceFreeze.ts",
  "executiveJournalExperienceFreezeTypes.ts",
  "executiveJournalExperienceFreezeIdentity.ts",
  "executiveJournalExperienceFreezeLifecycle.ts",
  "executiveJournalExperienceFreezeContracts.ts",
  "executiveJournalExperienceFreezeLocks.ts",
  "executiveJournalExperienceFreezeMetadata.ts",
  "executiveJournalExperienceFreeze.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-2:8 package and dependency boundary", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveJournalExperienceFreeze(?:[A-Z].*)?(?:\.test)?\.ts$/.test(name)
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Certification as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveJournalExperienceFreeze.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveJournalExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Freeze"));
    assert.deepEqual(upstreamImports, [
      "./executiveJournalExperienceCertification.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*(Platform|Manifest|Validation|Model|Registry|Foundation|rtc|react|next)/i,
      );
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
    }
  });

  it("creates no route, provider, or adapter from Freeze", () => {
    assert.equal(ExecutiveJournalExperienceFreeze.publicIndexCreated, false);
    assert.equal(ExecutiveJournalExperienceFreeze.publicIndexAuthorized, false);
    assert.equal(ExecutiveJournalExperienceFreeze.ex29Created, false);
    assert.equal(ExecutiveJournalExperienceFreeze.ex29Authorized, false);
    assert.equal(ExecutiveJournalExperienceFreeze.providerExecution, false);
  });
});

describe("EX-2:8 identity", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveJournalExperienceFreezeId,
      "EX-2:8/ExecutiveJournalExperienceFreeze",
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeNamespace,
      "nexora.ex.executive.journal.experience.freeze",
    );
    assert.equal(ExecutiveJournalExperienceFreezeStatus, "Frozen");
    assert.equal(
      ExecutiveJournalExperienceFreezeReadiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeIdentity.authorizationDecisionId,
      "AD-EX2-14",
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeIdentity
        .readyForPublicIndexAuthorizesEx29,
      false,
    );
  });

  for (const value of [
    ExecutiveJournalExperienceFreezeId,
    ExecutiveJournalExperienceFreezeNamespace,
    ...ExecutiveJournalExperienceFreezeApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      const resolved = resolveExecutiveJournalExperienceFreezeIdentity(value);
      assert.equal(resolved.ok, true);
      assert.equal(
        assertExecutiveJournalExperienceFreezeIdentity(value),
        ExecutiveJournalExperienceFreezeId,
      );
    });
  }

  for (const value of [
    null,
    "",
    " EX-2:8",
    "ex-2:8",
    "EX-2:7",
    "EX-2:9",
    "ExecutiveJournalExperienceFreez",
  ]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      const resolved = resolveExecutiveJournalExperienceFreezeIdentity(value);
      assert.equal(resolved.ok, false);
      assert.throws(() => assertExecutiveJournalExperienceFreezeIdentity(value));
    });
  }
});

describe("EX-2:8 lifecycle", () => {
  it("allows only immediate forward transitions", () => {
    assert.equal(
      isExecutiveJournalExperienceFreezeLifecycleState("Draft"),
      true,
    );
    assert.equal(
      isExecutiveJournalExperienceFreezeLifecycleState(" draft"),
      false,
    );
    for (
      let index = 0;
      index < ExecutiveJournalExperienceFreezeLifecycleStates.length - 1;
      index += 1
    ) {
      assert.equal(
        canTransitionExecutiveJournalExperienceFreezeLifecycle(
          ExecutiveJournalExperienceFreezeLifecycleStates[index],
          ExecutiveJournalExperienceFreezeLifecycleStates[index + 1],
        ),
        true,
      );
    }
    assert.equal(
      canTransitionExecutiveJournalExperienceFreezeLifecycle("Draft", "Frozen"),
      false,
    );
    assert.equal(
      canTransitionExecutiveJournalExperienceFreezeLifecycle(
        "ReadyForPublicIndex",
        "Frozen",
      ),
      false,
    );
    assert.equal(
      assertExecutiveJournalExperienceFreezeLifecycleTransition(
        "Frozen",
        "ReadyForPublicIndex",
      ),
      true,
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeLifecycle.currentState,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeLifecycle.rollbackProhibited,
      true,
    );
  });
});

describe("EX-2:8 locks, contracts, and authorization", () => {
  it("publishes exactly twelve Locked immutable architectural locks", () => {
    assert.equal(ExecutiveJournalExperienceFreezeLocks.length, 12);
    ExecutiveJournalExperienceFreezeLocks.forEach((entry, index) => {
      assert.equal(entry.order, index + 1);
      assert.equal(entry.outcome, "Locked");
      assert.equal(entry.failClosed, true);
      assert.equal(entry.metadataOnly, true);
      assert.equal(Object.isFrozen(entry), true);
    });
    assert.equal(ExecutiveJournalExperienceFreezeLockSeal.allLocked, true);
    assert.equal(
      ExecutiveJournalExperienceFreezeLockSeal.lockedCertification,
      ExecutiveJournalExperienceCertification,
    );
  });

  it("publishes exactly ten descriptive contracts", () => {
    assert.equal(ExecutiveJournalExperienceFreezeContracts.length, 10);
    assert.equal(
      ExecutiveJournalExperienceFreezeContracts.every(
        (contract, index) =>
          contract.order === index + 1
          && contract.descriptiveOnly === true
          && contract.runtimeEffects === false
          && contract.publicIndexAuthorized === false
          && Object.isFrozen(contract),
      ),
      true,
    );
  });

  it("verifies only AD-EX2-14 without new authority", () => {
    assert.equal(
      ExecutiveJournalExperienceFreezeAuthorization.authorizationDecisionId,
      "AD-EX2-14",
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeAuthorization.authorizationStatus,
      "Accepted",
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeAuthorization.newAuthorityCreated,
      false,
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeAuthorization.delegation,
      false,
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeAuthorization.expansion,
      false,
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeAuthorization
        .upstreamCertificationAuthorization,
      ExecutiveJournalExperienceCertification.authorization,
    );
  });

  it("publishes readiness conditions and decisions", () => {
    assert.equal(
      ExecutiveJournalExperienceFreezeReadinessConditions.length,
      12,
    );
    assert.deepEqual(
      ExecutiveJournalExperienceFreezeDecisions.map(
        (decision) => decision.decisionId,
      ),
      [
        "EX-2:8/D-33",
        "EX-2:8/D-34",
        "EX-2:8/D-35",
        "EX-2:8/D-36",
        "EX-2:8/D-37",
        "EX-2:8/D-38",
      ],
    );
  });
});

describe("EX-2:8 upstream, aggregate, and summary", () => {
  it("preserves exact Certification references, issues, and gates", () => {
    assert.equal(
      ExecutiveJournalExperienceFreezeUpstream.certification,
      ExecutiveJournalExperienceCertification,
    );
    assert.equal(
      ExecutiveJournalExperienceFreeze.certification,
      ExecutiveJournalExperienceCertification,
    );
    assert.equal(
      ExecutiveJournalExperienceFreeze.openIssues,
      ExecutiveJournalExperienceCertification.openIssues,
    );
    assert.equal(
      ExecutiveJournalExperienceFreeze.pendingGates,
      ExecutiveJournalExperienceCertification.pendingGates,
    );
    assert.equal(
      ExecutiveJournalExperienceFreeze.openIssues.issues.length,
      13,
    );
    assert.deepEqual(ExecutiveJournalExperienceFreeze.pendingGates, [
      "G-EX2-04",
      "G-EX2-07",
      "G-EX2-12",
    ]);
  });

  it("exposes the complete immutable sealed aggregate", () => {
    assert.equal(Object.isFrozen(ExecutiveJournalExperienceFreeze), true);
    assert.equal(ExecutiveJournalExperienceFreeze.sealed, true);
    assert.equal(ExecutiveJournalExperienceFreeze.mutationAllowed, false);
    assert.equal(
      ExecutiveJournalExperienceFreeze.modifiesCertification,
      false,
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeDependencyDeclaration.runtimeDependency,
      "EX-2:7/ExecutiveJournalExperienceCertification",
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeBoundaries
        .importsCertificationOnlyAtRuntime,
      true,
    );
  });

  it("publishes deterministic safe summary counts", () => {
    assert.equal(
      getExecutiveJournalExperienceFreezeSummary(),
      ExecutiveJournalExperienceFreezeSummaryValue,
    );
    assert.equal(ExecutiveJournalExperienceFreezeSummaryValue.lockCount, 12);
    assert.equal(
      ExecutiveJournalExperienceFreezeSummaryValue.contractCount,
      10,
    );
    assert.equal(ExecutiveJournalExperienceFreezeSummaryValue.status, "Frozen");
    assert.equal(
      ExecutiveJournalExperienceFreezeSummaryValue.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveJournalExperienceFreezeSummaryValue.publicIndexAuthorized,
      false,
    );
    assert.equal(
      JSON.stringify(ExecutiveJournalExperienceFreezeSummaryValue).includes(
        "payload",
      ),
      false,
    );
  });

  it("keeps aggregate consistency across identity and readiness", () => {
    assert.equal(
      ExecutiveJournalExperienceFreeze.status,
      ExecutiveJournalExperienceFreezeIdentity.status,
    );
    assert.equal(
      ExecutiveJournalExperienceFreeze.readiness,
      ExecutiveJournalExperienceFreezeIdentity.readiness,
    );
    assert.equal(
      ExecutiveJournalExperienceFreeze.lifecycle.currentState,
      "ReadyForPublicIndex",
    );
  });
});
