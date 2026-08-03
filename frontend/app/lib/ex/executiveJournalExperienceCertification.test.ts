/** EX-2:7 metadata-only Certification verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveJournalExperienceCertification,
  ExecutiveJournalExperienceCertificationApprovedAliases,
  ExecutiveJournalExperienceCertificationAuthorization,
  ExecutiveJournalExperienceCertificationBoundaries,
  ExecutiveJournalExperienceCertificationContracts,
  ExecutiveJournalExperienceCertificationCriteria,
  ExecutiveJournalExperienceCertificationDecisions,
  ExecutiveJournalExperienceCertificationDependencyDeclaration,
  ExecutiveJournalExperienceCertificationEvidence,
  ExecutiveJournalExperienceCertificationId,
  ExecutiveJournalExperienceCertificationIdentity,
  ExecutiveJournalExperienceCertificationLifecycle,
  ExecutiveJournalExperienceCertificationLifecycleStates,
  ExecutiveJournalExperienceCertificationNamespace,
  ExecutiveJournalExperienceCertificationReadiness,
  ExecutiveJournalExperienceCertificationReadinessConditions,
  ExecutiveJournalExperienceCertificationResult,
  ExecutiveJournalExperienceCertificationStatus,
  ExecutiveJournalExperienceCertificationSummaryValue,
  ExecutiveJournalExperienceCertificationUpstream,
  assertExecutiveJournalExperienceCertificationIdentity,
  assertExecutiveJournalExperienceCertificationLifecycleTransition,
  canTransitionExecutiveJournalExperienceCertificationLifecycle,
  getExecutiveJournalExperienceCertificationSummary,
  isExecutiveJournalExperienceCertificationLifecycleState,
  resolveExecutiveJournalExperienceCertificationIdentity,
} from "./executiveJournalExperienceCertification.ts";
import { ExecutiveJournalExperiencePlatform } from "./executiveJournalExperiencePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveJournalExperienceCertification.ts",
  "executiveJournalExperienceCertificationTypes.ts",
  "executiveJournalExperienceCertificationIdentity.ts",
  "executiveJournalExperienceCertificationLifecycle.ts",
  "executiveJournalExperienceCertificationContracts.ts",
  "executiveJournalExperienceCertificationEvidence.ts",
  "executiveJournalExperienceCertificationMetadata.ts",
  "executiveJournalExperienceCertification.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-2:7 package and dependency boundary", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveJournalExperienceCertification(?:[A-Z].*)?(?:\.test)?\.ts$/
        .test(name)
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Platform as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveJournalExperienceCertification.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveJournalExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Certification"));
    assert.deepEqual(upstreamImports, [
      "./executiveJournalExperiencePlatform.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*(Manifest|Validation|Model|Registry|Foundation|rtc|react|next)/i,
      );
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
    }
  });

  it("creates no route, provider, or adapter from Certification", () => {
    assert.equal(ExecutiveJournalExperienceCertification.freezeCreated, false);
    assert.equal(
      ExecutiveJournalExperienceCertification.freezeAuthorized,
      false,
    );
    assert.equal(ExecutiveJournalExperienceCertification.ex28Created, false);
    assert.equal(ExecutiveJournalExperienceCertification.ex28Authorized, false);
    assert.equal(
      ExecutiveJournalExperienceCertification.providerExecution,
      false,
    );
  });
});

describe("EX-2:7 identity", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveJournalExperienceCertificationId,
      "EX-2:7/ExecutiveJournalExperienceCertification",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationNamespace,
      "nexora.ex.executive.journal.experience.certification",
    );
    assert.equal(ExecutiveJournalExperienceCertificationStatus, "Certified");
    assert.equal(
      ExecutiveJournalExperienceCertificationReadiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationIdentity.authorizationDecisionId,
      "AD-EX2-14",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationIdentity
        .readyForFreezeAuthorizesEx28,
      false,
    );
  });

  for (const value of [
    ExecutiveJournalExperienceCertificationId,
    ExecutiveJournalExperienceCertificationNamespace,
    ...ExecutiveJournalExperienceCertificationApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      const resolved = resolveExecutiveJournalExperienceCertificationIdentity(
        value,
      );
      assert.equal(resolved.ok, true);
      assert.equal(
        assertExecutiveJournalExperienceCertificationIdentity(value),
        ExecutiveJournalExperienceCertificationId,
      );
    });
  }

  for (const value of [
    null,
    "",
    " EX-2:7",
    "ex-2:7",
    "EX-2:6",
    "EX-2:8",
    "ExecutiveJournalExperienceCertificatio",
  ]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      const resolved = resolveExecutiveJournalExperienceCertificationIdentity(
        value,
      );
      assert.equal(resolved.ok, false);
      assert.throws(() =>
        assertExecutiveJournalExperienceCertificationIdentity(value)
      );
    });
  }
});

describe("EX-2:7 lifecycle", () => {
  it("allows only immediate forward transitions", () => {
    assert.equal(
      isExecutiveJournalExperienceCertificationLifecycleState("Draft"),
      true,
    );
    assert.equal(
      isExecutiveJournalExperienceCertificationLifecycleState(" draft"),
      false,
    );
    for (
      let index = 0;
      index < ExecutiveJournalExperienceCertificationLifecycleStates.length - 1;
      index += 1
    ) {
      assert.equal(
        canTransitionExecutiveJournalExperienceCertificationLifecycle(
          ExecutiveJournalExperienceCertificationLifecycleStates[index],
          ExecutiveJournalExperienceCertificationLifecycleStates[index + 1],
        ),
        true,
      );
    }
    assert.equal(
      canTransitionExecutiveJournalExperienceCertificationLifecycle(
        "Draft",
        "Certified",
      ),
      false,
    );
    assert.equal(
      canTransitionExecutiveJournalExperienceCertificationLifecycle(
        "ReadyForFreeze",
        "Certified",
      ),
      false,
    );
    assert.equal(
      assertExecutiveJournalExperienceCertificationLifecycleTransition(
        "Certified",
        "ReadyForFreeze",
      ),
      true,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationLifecycle.currentState,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationLifecycle.rollbackProhibited,
      true,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationLifecycle
        .readyForFreezeAuthorizesEx28,
      false,
    );
  });
});

describe("EX-2:7 criteria, evidence, contracts, and authorization", () => {
  it("publishes exactly sixteen satisfied immutable criteria", () => {
    assert.equal(ExecutiveJournalExperienceCertificationCriteria.length, 16);
    ExecutiveJournalExperienceCertificationCriteria.forEach((entry, index) => {
      assert.equal(entry.order, index + 1);
      assert.equal(entry.outcome, "Satisfied");
      assert.equal(entry.metadataOnly, true);
      assert.equal(entry.deterministic, true);
      assert.equal(Object.isFrozen(entry), true);
    });
  });

  it("publishes exactly seven read-only evidence references", () => {
    assert.equal(ExecutiveJournalExperienceCertificationEvidence.length, 7);
    assert.equal(
      ExecutiveJournalExperienceCertificationEvidence[0]?.platform,
      ExecutiveJournalExperiencePlatform,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationEvidence.every(
        (entry) =>
          entry.duplicatesUpstream === false
          && entry.readOnly === true
          && Object.isFrozen(entry),
      ),
      true,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationEvidence[6]?.reference,
      "AD-EX2-14",
    );
  });

  it("publishes exactly ten descriptive contracts", () => {
    assert.equal(ExecutiveJournalExperienceCertificationContracts.length, 10);
    assert.equal(
      ExecutiveJournalExperienceCertificationContracts.every(
        (contract, index) =>
          contract.order === index + 1
          && contract.descriptiveOnly === true
          && contract.runtimeEffects === false
          && contract.freezeAuthorized === false
          && Object.isFrozen(contract),
      ),
      true,
    );
  });

  it("verifies only AD-EX2-14 without new authority", () => {
    assert.equal(
      ExecutiveJournalExperienceCertificationAuthorization
        .authorizationDecisionId,
      "AD-EX2-14",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationAuthorization.authorizationStatus,
      "Accepted",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationAuthorization
        .newAuthorityCreated,
      false,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationAuthorization.delegation,
      false,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationAuthorization.expansion,
      false,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationAuthorization
        .upstreamPlatformAuthorization,
      ExecutiveJournalExperiencePlatform.authorization,
    );
  });

  it("publishes readiness conditions and decisions", () => {
    assert.equal(
      ExecutiveJournalExperienceCertificationReadinessConditions.length,
      12,
    );
    assert.deepEqual(
      ExecutiveJournalExperienceCertificationDecisions.map(
        (decision) => decision.decisionId,
      ),
      [
        "EX-2:7/D-27",
        "EX-2:7/D-28",
        "EX-2:7/D-29",
        "EX-2:7/D-30",
        "EX-2:7/D-31",
        "EX-2:7/D-32",
      ],
    );
  });
});

describe("EX-2:7 upstream, aggregate, and summary", () => {
  it("preserves exact Platform references, issues, and gates", () => {
    assert.equal(
      ExecutiveJournalExperienceCertificationUpstream.platform,
      ExecutiveJournalExperiencePlatform,
    );
    assert.equal(
      ExecutiveJournalExperienceCertification.platform,
      ExecutiveJournalExperiencePlatform,
    );
    assert.equal(
      ExecutiveJournalExperienceCertification.openIssues,
      ExecutiveJournalExperiencePlatform.openIssues,
    );
    assert.equal(
      ExecutiveJournalExperienceCertification.pendingGates,
      ExecutiveJournalExperiencePlatform.pendingGates,
    );
    assert.equal(
      ExecutiveJournalExperienceCertification.openIssues.issues.length,
      13,
    );
    assert.deepEqual(ExecutiveJournalExperienceCertification.pendingGates, [
      "G-EX2-04",
      "G-EX2-07",
      "G-EX2-12",
    ]);
  });

  it("exposes the complete immutable aggregate and result", () => {
    assert.equal(
      Object.isFrozen(ExecutiveJournalExperienceCertification),
      true,
    );
    assert.equal(ExecutiveJournalExperienceCertificationResult.status, "Certified");
    assert.equal(
      ExecutiveJournalExperienceCertificationResult.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationDependencyDeclaration
        .runtimeDependency,
      "EX-2:6/ExecutiveJournalExperiencePlatform",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationBoundaries
        .importsPlatformOnlyAtRuntime,
      true,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationBoundaries.modifiesPlatform,
      false,
    );
  });

  it("publishes deterministic safe summary counts", () => {
    assert.equal(
      getExecutiveJournalExperienceCertificationSummary(),
      ExecutiveJournalExperienceCertificationSummaryValue,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationSummaryValue.criterionCount,
      16,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationSummaryValue.contractCount,
      10,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationSummaryValue.evidenceCount,
      7,
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationSummaryValue.status,
      "Certified",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationSummaryValue.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveJournalExperienceCertificationSummaryValue.freezeAuthorized,
      false,
    );
    assert.equal(
      JSON.stringify(ExecutiveJournalExperienceCertificationSummaryValue)
        .includes("payload"),
      false,
    );
  });

  it("keeps aggregate consistency across identity and readiness", () => {
    assert.equal(
      ExecutiveJournalExperienceCertification.status,
      ExecutiveJournalExperienceCertificationIdentity.status,
    );
    assert.equal(
      ExecutiveJournalExperienceCertification.readiness,
      ExecutiveJournalExperienceCertificationIdentity.readiness,
    );
    assert.equal(
      ExecutiveJournalExperienceCertification.result.status,
      "Certified",
    );
    assert.equal(
      ExecutiveJournalExperienceCertification.lifecycle.currentState,
      "ReadyForFreeze",
    );
  });
});
