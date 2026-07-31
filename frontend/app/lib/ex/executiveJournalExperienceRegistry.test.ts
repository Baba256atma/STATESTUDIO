/**
 * EX-2:2 — Executive Journal Experience Registry Verification.
 *
 * Completeness-traced coverage for closed-world Foundation registration,
 * resolution, conflicts, lifecycle, upstream preservation, authorization,
 * and dependency boundaries. No mocks. No randomness. No network.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveJournalExperienceFoundation,
  ExecutiveJournalExperienceFoundationId,
  ExecutiveJournalExperienceFoundationNamespace,
  ExecutiveJournalExperienceFoundationPhase,
  ExecutiveJournalExperienceFoundationReadiness,
  ExecutiveJournalExperienceFoundationStatus,
  getExecutiveJournalExperienceFoundationSummary,
} from "./executiveJournalExperienceFoundation.ts";
import {
  ExecutiveJournalExperienceRegistryConflictCodes,
  ExecutiveJournalExperienceRegistryContractCatalogue,
  ExecutiveJournalExperienceRegistryContracts,
} from "./executiveJournalExperienceRegistryContracts.ts";
import {
  ExecutiveJournalExperienceFoundationRegistryEntry,
  ExecutiveJournalExperienceRegistryCanonicalEntries,
  __isExecutiveJournalExperienceRegistrySealedForTests,
  __resealExecutiveJournalExperienceRegistryForConflictTests,
  __unsealExecutiveJournalExperienceRegistryForConflictTests,
  registerExecutiveJournalExperienceEntries,
} from "./executiveJournalExperienceRegistryEntries.ts";
import {
  ExecutiveJournalExperienceRegistryApprovedAliases,
  ExecutiveJournalExperienceRegistryId,
  ExecutiveJournalExperienceRegistryIdentity,
  ExecutiveJournalExperienceRegistryNamespace,
  ExecutiveJournalExperienceRegistryNextPhase,
  ExecutiveJournalExperienceRegistryPreviousPhase,
  ExecutiveJournalExperienceRegistryReadinessValue,
  ExecutiveJournalExperienceRegistryStatusValue,
  assertExecutiveJournalExperienceRegistryAlias,
  assertExecutiveJournalExperienceRegistryIdentity,
  isWellFormedExecutiveJournalExperienceRegistryIdentity,
} from "./executiveJournalExperienceRegistryIdentity.ts";
import {
  ExecutiveJournalExperienceReadyForModelRequirements,
  ExecutiveJournalExperienceRegistryLifecycle,
  ExecutiveJournalExperienceRegistryLifecycleStates,
  assertExecutiveJournalExperienceRegistryLifecycleState,
  assertExecutiveJournalExperienceRegistryLifecycleTransition,
} from "./executiveJournalExperienceRegistryLifecycle.ts";
import {
  ExecutiveJournalExperienceRegistryAuthorization,
  ExecutiveJournalExperienceRegistryDependencyBoundaries,
  ExecutiveJournalExperienceRegistryOpenIssuesAndGates,
  ExecutiveJournalExperienceRegistryPrinciples,
  ExecutiveJournalExperienceRegistryUpstreamPreservation,
} from "./executiveJournalExperienceRegistryMetadata.ts";
import {
  ExecutiveJournalExperienceRegistry,
  ExecutiveJournalExperienceRegistryReadiness,
  ExecutiveJournalExperienceRegistryStatus,
  getExecutiveJournalExperienceRegistrySummary,
  isExecutiveJournalExperienceRegistered,
  resolveExecutiveJournalExperienceByAlias,
  resolveExecutiveJournalExperienceById,
  resolveExecutiveJournalExperienceByNamespace,
  resolveExecutiveJournalExperienceIdentity,
} from "./executiveJournalExperienceRegistry.ts";
import {
  ExecutiveJournalProductArchitectureDecisionAdrEx209,
  getExecutiveJournalProductArchitectureGate,
} from "./executiveJournalProductArchitecture.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX22_FILES = Object.freeze([
  "executiveJournalExperienceRegistry.ts",
  "executiveJournalExperienceRegistryTypes.ts",
  "executiveJournalExperienceRegistryIdentity.ts",
  "executiveJournalExperienceRegistryLifecycle.ts",
  "executiveJournalExperienceRegistryContracts.ts",
  "executiveJournalExperienceRegistryEntries.ts",
  "executiveJournalExperienceRegistryMetadata.ts",
  "executiveJournalExperienceRegistry.test.ts",
]);

const EX21_PRODUCTION_FILES = Object.freeze([
  "executiveJournalExperienceFoundation.ts",
  "executiveJournalExperienceTypes.ts",
  "executiveJournalExperienceIdentity.ts",
  "executiveJournalExperienceBoundaries.ts",
  "executiveJournalExperienceDecisions.ts",
  "executiveJournalExperienceOpenIssues.ts",
  "executiveJournalExperienceLifecycle.ts",
]);

const LATER_PHASE_FILE_PATTERN =
  /executiveJournalExperience(Certification|Freeze|PublicIndex)/i;

const RESULT_VOCABULARY = Object.freeze([
  "Resolved",
  "UnknownIdentity",
  "MalformedIdentity",
] as const);

const CONFLICT_CODES = Object.freeze([
  "RegistryAlreadySealed",
  "FoundationNotReadyForRegistry",
  "UnexpectedEntry",
  "EntryReferenceMismatch",
  "IdentityKeyMismatch",
  "DuplicateCanonicalId",
  "DuplicateNamespace",
  "DuplicateAlias",
  "AliasCanonicalCollision",
  "AliasAmbiguous",
] as const);

const CONFLICT_COVERAGE = Object.freeze([
  Object.freeze({
    code: "RegistryAlreadySealed",
    scenario: "registration after sealing",
  }),
  Object.freeze({
    code: "FoundationNotReadyForRegistry",
    scenario: "foundation not ReadyForRegistry",
  }),
  Object.freeze({
    code: "UnexpectedEntry",
    scenario: "unexpected non-Foundation entry",
  }),
  Object.freeze({
    code: "EntryReferenceMismatch",
    scenario: "reconstructed or mismatched Foundation reference",
  }),
  Object.freeze({
    code: "IdentityKeyMismatch",
    scenario: "identity-key mismatch",
  }),
  Object.freeze({
    code: "DuplicateCanonicalId",
    scenario: "duplicate canonical ID",
  }),
  Object.freeze({
    code: "DuplicateNamespace",
    scenario: "duplicate namespace",
  }),
  Object.freeze({
    code: "DuplicateAlias",
    scenario: "duplicate alias",
  }),
  Object.freeze({
    code: "AliasCanonicalCollision",
    scenario: "alias equal to canonical ID or namespace",
  }),
  Object.freeze({
    code: "AliasAmbiguous",
    scenario: "alias ambiguity across entries",
  }),
] as const);

const PRINCIPLE_COVERAGE = Object.freeze([
  Object.freeze({
    order: 1,
    principleId: "EX-2:2/Principle/01",
    statement: "Registry discovery is closed-world and fail-closed.",
  }),
  Object.freeze({
    order: 2,
    principleId: "EX-2:2/Principle/02",
    statement: "EX-2:1 is registered by exact reference, never recreated.",
  }),
  Object.freeze({
    order: 3,
    principleId: "EX-2:2/Principle/03",
    statement:
      "Canonical IDs and namespaces are authoritative and case-sensitive.",
  }),
  Object.freeze({
    order: 4,
    principleId: "EX-2:2/Principle/04",
    statement:
      "Aliases are explicit and cannot collide with canonical identities or namespaces.",
  }),
  Object.freeze({
    order: 5,
    principleId: "EX-2:2/Principle/05",
    statement: "A sealed Registry cannot be mutated.",
  }),
  Object.freeze({
    order: 6,
    principleId: "EX-2:2/Principle/06",
    statement: "Lookup performs no normalization, repair or inference.",
  }),
  Object.freeze({
    order: 7,
    principleId: "EX-2:2/Principle/07",
    statement:
      "Registry metadata cannot create product or journal authority.",
  }),
  Object.freeze({
    order: 8,
    principleId: "EX-2:2/Principle/08",
    statement:
      "Tier-0 artifacts remain supporting evidence, not formal Registry entries.",
  }),
  Object.freeze({
    order: 9,
    principleId: "EX-2:2/Principle/09",
    statement:
      "EX-2:2 imports only the immediate predecessor production surface.",
  }),
  Object.freeze({
    order: 10,
    principleId: "EX-2:2/Principle/10",
    statement:
      "ReadyForModel does not authorize EX-2:3 implementation.",
  }),
] as const);

const PRINCIPLE_STATEMENTS = Object.freeze(
  PRINCIPLE_COVERAGE.map((item) => item.statement),
);

const LIFECYCLE_STATES = Object.freeze([
  "Declared",
  "Populated",
  "Sealed",
] as const);

const REGISTERED_IDENTITIES = Object.freeze([
  "EX-2:1/ExecutiveJournalExperienceFoundation",
] as const);

const ENTRY_ALIASES = Object.freeze([
  "ExecutiveJournalExperienceFoundation",
  "EX-2:1",
] as const);

const PROHIBITED_SOURCE_PATTERNS = Object.freeze([
  /\bfrom\s+["']react["']/,
  /\bfrom\s+["']react-dom/,
  /\bfrom\s+["']next\//,
  /\bfrom\s+["'][^"']*executiveJournalProductArchitecture/,
  /\bfrom\s+["'][^"']*\/rtc\//,
  /\bfrom\s+["'][^"']*decision-journal/,
  /\bfrom\s+["']\.\/ExecutiveJournalSyntheticPreview\.tsx["']/,
  /\bfrom\s+["']\.\/ExecutiveJournalSyntheticHarness\.tsx["']/,
  /\bfrom\s+["']\.\/executiveJournalSynthetic/,
  /\bfrom\s+["']\.\/executiveJournalSyntheticUi/,
  /\bfrom\s+["']\.\/executiveStage/,
  /\bfrom\s+["']\.\/executiveStagePublicIndex\.ts["']/,
  /\bfrom\s+["']\.\/executiveJournalExperienceBoundaries/,
  /\bfrom\s+["']\.\/executiveJournalExperienceDecisions/,
  /\bfrom\s+["']\.\/executiveJournalExperienceIdentity/,
  /\bfrom\s+["']\.\/executiveJournalExperienceLifecycle/,
  /\bfrom\s+["']\.\/executiveJournalExperienceOpenIssues/,
  /\bfrom\s+["']\.\/executiveJournalExperienceTypes/,
  /\bfrom\s+["']\.\/executiveJournalExperienceModel/,
  /\bfetch\s*\(/,
  /\baxios\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bindexedDB\b/,
  /\bDate\.now\b/,
  /\bMath\.random\b/,
  /\bcrypto\.randomUUID\b/,
] as const);

const mutateFrozen = (value: object): boolean => {
  try {
    (value as { mutated?: boolean }).mutated = true;
    return "mutated" in value;
  } catch {
    return false;
  }
};

const attemptNestedMutation = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  try {
    record.__nestedMutation = true;
    if ("__nestedMutation" in record) {
      return true;
    }
  } catch {
    // expected
  }
  for (const nested of Object.values(record)) {
    if (attemptNestedMutation(nested)) {
      return true;
    }
  }
  return false;
};

const readProductionSources = (): readonly string[] =>
  EX22_FILES.filter((name) => !name.endsWith(".test.ts")).map((name) =>
    readFileSync(join(HERE, name), "utf8")
  );

const canonicalCandidate = () =>
  Object.freeze({
    entryId: "EX-2:2/Entry/ExecutiveJournalExperienceFoundation",
    controlId: ExecutiveJournalExperienceFoundationId,
    namespace: ExecutiveJournalExperienceFoundationNamespace,
    status: ExecutiveJournalExperienceFoundationStatus,
    readiness: ExecutiveJournalExperienceFoundationReadiness,
    phase: ExecutiveJournalExperienceFoundationPhase,
    aliases: ExecutiveJournalExperienceFoundation.identity.aliases,
    order: 1,
    foundation: ExecutiveJournalExperienceFoundation,
  });

const SENSITIVE_CONFLICT_DETAIL_PATTERN =
  /password|token|secret|PII|fixture|evidenceContent|privateReflection|authorityEvidence|actorId/i;

const assertCanonicalResolutionIntact = (): void => {
  const byId = resolveExecutiveJournalExperienceById(
    ExecutiveJournalExperienceFoundationId,
  );
  const byNs = resolveExecutiveJournalExperienceByNamespace(
    ExecutiveJournalExperienceFoundationNamespace,
  );
  assert.equal(byId.ok, true);
  assert.equal(byNs.ok, true);
  if (!byId.ok || !byNs.ok) {
    return;
  }
  assert.equal(byId.entry, ExecutiveJournalExperienceFoundationRegistryEntry);
  assert.equal(
    byId.entry.foundation,
    ExecutiveJournalExperienceFoundation,
  );
  for (const alias of ENTRY_ALIASES) {
    const byAlias = resolveExecutiveJournalExperienceByAlias(alias);
    assert.equal(byAlias.ok, true, `alias ${alias}`);
    if (byAlias.ok) {
      assert.equal(
        byAlias.entry,
        ExecutiveJournalExperienceFoundationRegistryEntry,
      );
    }
  }
};

const assertConflictFailure = (
  result: ReturnType<typeof registerExecutiveJournalExperienceEntries>,
  code: (typeof CONFLICT_CODES)[number],
): void => {
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.code, code);
    assert.equal(result.entries, null);
    assert.equal(SENSITIVE_CONFLICT_DETAIL_PATTERN.test(result.detail), false);
  }
  assert.equal(
    ExecutiveJournalExperienceRegistryLifecycle.currentState,
    "Sealed",
  );
  assertCanonicalResolutionIntact();
};

describe("EX-2:2 Executive Journal Experience Registry", () => {
  describe("package inventory", () => {
    it("contains exactly eight EX-2:2 files and no EX-2:7+ phases", () => {
      assert.equal(EX22_FILES.length, 8);
      const present = readdirSync(HERE);
      for (const file of EX22_FILES) {
        assert.ok(present.includes(file), `missing ${file}`);
      }
      assert.equal(
        present.filter((name) => EX22_FILES.includes(name)).length,
        8,
      );
      assert.equal(
        present.some((name) => LATER_PHASE_FILE_PATTERN.test(name)),
        false,
      );
      for (const file of EX21_PRODUCTION_FILES) {
        assert.ok(present.includes(file), `missing upstream ${file}`);
      }
    });

    it("production sources have no unexpected runtime dependencies or cycles", () => {
      for (const source of readProductionSources()) {
        for (const pattern of PROHIBITED_SOURCE_PATTERNS) {
          assert.equal(
            pattern.test(source),
            false,
            `prohibited pattern ${pattern}`,
          );
        }
      }
      const architecture = readFileSync(
        join(HERE, "executiveJournalProductArchitecture.ts"),
        "utf8",
      );
      assert.equal(
        /from\s+["']\.\/executiveJournalExperienceRegistry/.test(architecture),
        false,
      );
      const foundationDecisions = readFileSync(
        join(HERE, "executiveJournalExperienceDecisions.ts"),
        "utf8",
      );
      assert.equal(/AD-EX2-09/.test(foundationDecisions), false);
      assert.equal(
        ExecutiveJournalExperienceRegistryDependencyBoundaries
          .importsArchitectureAggregate,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.importsArchitecture,
        false,
      );
    });
  });

  describe("identity", () => {
    it("publishes exact canonical identity fields", () => {
      assert.equal(
        ExecutiveJournalExperienceRegistryId,
        "EX-2:2/ExecutiveJournalExperienceRegistry",
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryNamespace,
        "nexora.ex.executive.journal.experience.registry",
      );
      assert.equal(ExecutiveJournalExperienceRegistryStatus, "Registry");
      assert.equal(ExecutiveJournalExperienceRegistryStatusValue, "Registry");
      assert.equal(ExecutiveJournalExperienceRegistryReadiness, "ReadyForModel");
      assert.equal(
        ExecutiveJournalExperienceRegistryReadinessValue,
        "ReadyForModel",
      );
      assert.equal(ExecutiveJournalExperienceRegistryIdentity.phase, "EX-2:2");
      assert.equal(
        ExecutiveJournalExperienceRegistryPreviousPhase,
        "EX-2:1 — Executive Journal Experience Foundation",
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryNextPhase,
        "EX-2:3 — Executive Journal Experience Model",
      );
      assert.equal(ExecutiveJournalExperienceRegistryIdentity.metadataOnly, true);
      assert.equal(
        ExecutiveJournalExperienceRegistryIdentity.sideEffectFree,
        true,
      );
      assert.equal(ExecutiveJournalExperienceRegistryIdentity.closedWorld, true);
      assert.equal(ExecutiveJournalExperienceRegistryIdentity.sealed, true);
      assert.equal(mutateFrozen(ExecutiveJournalExperienceRegistryIdentity), false);
      assert.equal(
        attemptNestedMutation(ExecutiveJournalExperienceRegistryIdentity),
        false,
      );
    });

    it("accepts only approved aliases and rejects unknown variants", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceRegistryApprovedAliases],
        ["ExecutiveJournalExperienceRegistry", "EX-2:2"],
      );
      assert.equal(
        assertExecutiveJournalExperienceRegistryIdentity(
          ExecutiveJournalExperienceRegistryId,
        ),
        ExecutiveJournalExperienceRegistryId,
      );
      assert.equal(
        assertExecutiveJournalExperienceRegistryAlias("EX-2:2"),
        "EX-2:2",
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceRegistryIdentity("EX-2:2")
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceRegistryIdentity(
          "ex-2:2/executivejournalexperienceregistry",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceRegistryAlias("ex-2:2")
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceRegistryAlias(" EX-2:2 ")
      );
      assert.equal(
        isWellFormedExecutiveJournalExperienceRegistryIdentity(""),
        false,
      );
      assert.equal(
        isWellFormedExecutiveJournalExperienceRegistryIdentity(" EX-2:2"),
        false,
      );
      assert.equal(
        isWellFormedExecutiveJournalExperienceRegistryIdentity(null),
        false,
      );
    });
  });

  describe("registration", () => {
    it("registers exactly one Foundation entry by exact reference", () => {
      assert.equal(
        ExecutiveJournalExperienceRegistryCanonicalEntries.length,
        1,
      );
      assert.equal(ExecutiveJournalExperienceRegistry.entries.length, 1);
      assert.equal(
        ExecutiveJournalExperienceRegistry.canonicalEntry,
        ExecutiveJournalExperienceFoundationRegistryEntry,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationRegistryEntry.foundation,
        ExecutiveJournalExperienceFoundation,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationRegistryEntry.controlId,
        ExecutiveJournalExperienceFoundationId,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationRegistryEntry.namespace,
        ExecutiveJournalExperienceFoundationNamespace,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationRegistryEntry.status,
        "Foundation",
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationRegistryEntry.readiness,
        "ReadyForRegistry",
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationRegistryEntry.phase,
        "EX-2:1",
      );
      assert.deepEqual(
        [...ExecutiveJournalExperienceFoundationRegistryEntry.aliases],
        [...ENTRY_ALIASES],
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.foundation,
        ExecutiveJournalExperienceFoundation,
      );
      assert.equal(
        Object.is(
          ExecutiveJournalExperienceFoundationRegistryEntry.foundation,
          ExecutiveJournalExperienceFoundation,
        ),
        true,
      );
    });

    it("does not register Tier-0, self, or future-phase entries", () => {
      const ids = ExecutiveJournalExperienceRegistry.entries.map(
        (entry) => entry.controlId as string,
      );
      assert.deepEqual([...ids], [...REGISTERED_IDENTITIES]);
      assert.equal(
        ids.includes("EX-2:2/ExecutiveJournalExperienceRegistry"),
        false,
      );
      assert.equal(ids.some((id) => id.startsWith("EX-2:3")), false);
      assert.equal(ids.some((id) => /Tier-?0|T0|Synthetic/i.test(id)), false);
    });
  });

  describe("resolution", () => {
    it("resolves by canonical ID, namespace, and each approved alias", () => {
      const byId = resolveExecutiveJournalExperienceById(
        ExecutiveJournalExperienceFoundationId,
      );
      const byNs = resolveExecutiveJournalExperienceByNamespace(
        ExecutiveJournalExperienceFoundationNamespace,
      );
      assert.equal(byId.ok, true);
      assert.equal(byNs.ok, true);
      if (!byId.ok || !byNs.ok) {
        return;
      }
      assert.equal(byId.code, "Resolved");
      assert.equal(byNs.code, "Resolved");
      assert.equal(byId.resolvedBy, "controlId");
      assert.equal(byNs.resolvedBy, "namespace");
      assert.equal(
        byId.entry,
        ExecutiveJournalExperienceFoundationRegistryEntry,
      );
      assert.equal(
        byId.entry.foundation,
        ExecutiveJournalExperienceFoundation,
      );

      for (const alias of ENTRY_ALIASES) {
        const byAlias = resolveExecutiveJournalExperienceByAlias(alias);
        assert.equal(byAlias.ok, true, `alias ${alias}`);
        if (!byAlias.ok) {
          continue;
        }
        assert.equal(byAlias.resolvedBy, "alias");
        assert.equal(
          byAlias.entry,
          ExecutiveJournalExperienceFoundationRegistryEntry,
        );
      }

      const unified = resolveExecutiveJournalExperienceIdentity(
        ExecutiveJournalExperienceFoundationId,
      );
      assert.equal(unified.ok, true);
      if (unified.ok) {
        assert.equal(unified.entry, byId.entry);
      }
      assert.equal(
        isExecutiveJournalExperienceRegistered(
          ExecutiveJournalExperienceFoundationId,
        ),
        true,
      );
    });

    it("fails closed for unknown, malformed, empty, partial, case, whitespace, and lookalike queries", () => {
      const cases = Object.freeze([
        ["unknown", "UnknownIdentity"],
        ["EX-2:1/ExecutiveJournalExperienceFoundatio", "UnknownIdentity"],
        ["ex-2:1/executivejournalexperiencefoundation", "UnknownIdentity"],
        ["EX-2:1/ExecutiveJournalExperienceFoundation ", "MalformedIdentity"],
        [" EX-2:1/ExecutiveJournalExperienceFoundation", "MalformedIdentity"],
        ["", "MalformedIdentity"],
        ["EX-2:1", "Resolved"],
        ["nexora.ex.executive.journal.experience.foundatio", "UnknownIdentity"],
        ["nexora.ex.executive.journal.experience.foundation ", "MalformedIdentity"],
        [null, "MalformedIdentity"],
        [undefined, "MalformedIdentity"],
        [42, "MalformedIdentity"],
      ] as const);

      for (const [query, expected] of cases) {
        const result = resolveExecutiveJournalExperienceIdentity(query);
        if (expected === "Resolved") {
          assert.equal(result.ok, true, String(query));
          if (result.ok) {
            assert.equal(result.code, "Resolved");
          }
        } else {
          assert.equal(result.ok, false, String(query));
          if (!result.ok) {
            assert.equal(result.code, expected, String(query));
            assert.equal(result.entry, null);
          }
        }
      }
    });

    it("repeated resolution is stable and preserves exact references", () => {
      const first = resolveExecutiveJournalExperienceById(
        ExecutiveJournalExperienceFoundationId,
      );
      const second = resolveExecutiveJournalExperienceById(
        ExecutiveJournalExperienceFoundationId,
      );
      assert.deepEqual(first, second);
      assert.equal(first.ok, true);
      if (first.ok && second.ok) {
        assert.equal(first.entry, second.entry);
        assert.equal(
          first.entry.foundation,
          ExecutiveJournalExperienceFoundation,
        );
      }
    });

    it("result vocabulary coverage is complete", () => {
      assert.deepEqual([...RESULT_VOCABULARY], [
        "Resolved",
        "UnknownIdentity",
        "MalformedIdentity",
      ]);
      assert.equal(RESULT_VOCABULARY.length, 3);
    });
  });

  describe("conflicts", () => {
    it("conflict catalogue precedence and coverage tables are complete", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceRegistryConflictCodes],
        [...CONFLICT_CODES],
      );
      assert.deepEqual(
        CONFLICT_COVERAGE.map((item) => item.code),
        [...CONFLICT_CODES],
      );
      assert.equal(CONFLICT_CODES.length, 10);
      assert.equal(CONFLICT_COVERAGE.length, 10);
      assert.equal(
        new Set(CONFLICT_CODES).size,
        CONFLICT_CODES.length,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryContractCatalogue.conflictPrecedence,
        ExecutiveJournalExperienceRegistryConflictCodes,
      );
      assert.equal(
        mutateFrozen(ExecutiveJournalExperienceRegistryConflictCodes as object),
        false,
      );
    });

    it("post-seal registration is rejected without mutation", () => {
      assert.equal(
        __isExecutiveJournalExperienceRegistrySealedForTests(),
        true,
      );
      const before = ExecutiveJournalExperienceRegistry.entries;
      const beforeLifecycle =
        ExecutiveJournalExperienceRegistryLifecycle.currentState;
      const result = registerExecutiveJournalExperienceEntries([
        canonicalCandidate(),
      ]);
      assertConflictFailure(result, "RegistryAlreadySealed");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      assert.equal(
        ExecutiveJournalExperienceRegistryLifecycle.currentState,
        beforeLifecycle,
      );
      assert.equal(
        __isExecutiveJournalExperienceRegistrySealedForTests(),
        true,
      );
    });

    it("duplicate canonical identity conflicts", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const result = registerExecutiveJournalExperienceEntries([
        canonicalCandidate(),
        canonicalCandidate(),
      ]);
      assertConflictFailure(result, "DuplicateCanonicalId");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("duplicate namespace conflicts", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const result = registerExecutiveJournalExperienceEntries([
        canonicalCandidate(),
        {
          entryId: "EX-2:2/Entry/Synthetic",
          controlId: "EX-2:1/SyntheticOther",
          namespace: ExecutiveJournalExperienceFoundationNamespace,
          status: "Foundation",
          readiness: "ReadyForRegistry",
          phase: "EX-2:1",
          aliases: Object.freeze(["SyntheticAlias"]),
          order: 2,
          foundation: {
            identity: {
              id: "EX-2:1/SyntheticOther",
              namespace: ExecutiveJournalExperienceFoundationNamespace,
              status: "Foundation",
              readiness: "ReadyForRegistry",
              phase: "EX-2:1",
              aliases: Object.freeze(["SyntheticAlias"]),
            },
            readiness: "ReadyForRegistry",
            status: "Foundation",
            phase: "EX-2:1",
          },
        },
      ]);
      assertConflictFailure(result, "DuplicateNamespace");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("duplicate alias conflicts", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const result = registerExecutiveJournalExperienceEntries([
        {
          ...canonicalCandidate(),
          aliases: Object.freeze([
            "ExecutiveJournalExperienceFoundation",
            "ExecutiveJournalExperienceFoundation",
          ]),
        },
      ]);
      assertConflictFailure(result, "DuplicateAlias");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("alias equal to canonical ID conflicts", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const result = registerExecutiveJournalExperienceEntries([
        {
          ...canonicalCandidate(),
          aliases: Object.freeze([ExecutiveJournalExperienceFoundationId]),
        },
      ]);
      assertConflictFailure(result, "AliasCanonicalCollision");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("alias equal to canonical namespace conflicts", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const result = registerExecutiveJournalExperienceEntries([
        {
          ...canonicalCandidate(),
          aliases: Object.freeze([
            ExecutiveJournalExperienceFoundationNamespace,
          ]),
        },
      ]);
      assertConflictFailure(result, "AliasCanonicalCollision");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("alias resolving to multiple entries is AliasAmbiguous", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const result = registerExecutiveJournalExperienceEntries([
        canonicalCandidate(),
        {
          entryId: "EX-2:2/Entry/Synthetic",
          controlId: "EX-2:1/SyntheticOther",
          namespace: "nexora.ex.executive.journal.experience.synthetic",
          status: "Foundation",
          readiness: "ReadyForRegistry",
          phase: "EX-2:1",
          aliases: Object.freeze(["EX-2:1"]),
          order: 2,
          foundation: {
            identity: {
              id: "EX-2:1/SyntheticOther",
              namespace: "nexora.ex.executive.journal.experience.synthetic",
              status: "Foundation",
              readiness: "ReadyForRegistry",
              phase: "EX-2:1",
              aliases: Object.freeze(["EX-2:1"]),
            },
            readiness: "ReadyForRegistry",
            status: "Foundation",
            phase: "EX-2:1",
          },
        },
      ]);
      assertConflictFailure(result, "AliasAmbiguous");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("identity-key mismatch conflicts", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const result = registerExecutiveJournalExperienceEntries([
        {
          ...canonicalCandidate(),
          controlId: "EX-2:1/WrongKey",
        },
      ]);
      assertConflictFailure(result, "IdentityKeyMismatch");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("foundation reference mismatch conflicts", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const reconstructed = {
        identity: ExecutiveJournalExperienceFoundation.identity,
        readiness: ExecutiveJournalExperienceFoundation.readiness,
        status: ExecutiveJournalExperienceFoundation.status,
        phase: ExecutiveJournalExperienceFoundation.phase,
      };
      const result = registerExecutiveJournalExperienceEntries([
        {
          ...canonicalCandidate(),
          foundation: reconstructed,
        },
      ]);
      assertConflictFailure(result, "EntryReferenceMismatch");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("not-ready Foundation registration conflicts", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const result = registerExecutiveJournalExperienceEntries([
        {
          ...canonicalCandidate(),
          foundation: {
            identity: ExecutiveJournalExperienceFoundation.identity,
            readiness: "Foundation",
            status: ExecutiveJournalExperienceFoundation.status,
            phase: ExecutiveJournalExperienceFoundation.phase,
          },
        },
      ]);
      assertConflictFailure(result, "FoundationNotReadyForRegistry");
      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });

    it("unexpected entry conflicts and rejected registration does not mutate", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const before = ExecutiveJournalExperienceRegistry.entries;
      const empty = registerExecutiveJournalExperienceEntries([]);
      assertConflictFailure(empty, "UnexpectedEntry");

      const wrongEntryId = registerExecutiveJournalExperienceEntries([
        {
          ...canonicalCandidate(),
          entryId: "EX-2:2/Entry/Wrong",
        },
      ]);
      assertConflictFailure(wrongEntryId, "UnexpectedEntry");

      assert.equal(ExecutiveJournalExperienceRegistry.entries, before);
      __resealExecutiveJournalExperienceRegistryForConflictTests();
      assert.equal(
        __isExecutiveJournalExperienceRegistrySealedForTests(),
        true,
      );
    });

    it("conflict selection is deterministic", () => {
      __unsealExecutiveJournalExperienceRegistryForConflictTests();
      const candidates = Object.freeze([
        canonicalCandidate(),
        canonicalCandidate(),
      ]);
      const first = registerExecutiveJournalExperienceEntries(candidates);
      const second = registerExecutiveJournalExperienceEntries(candidates);
      assert.deepEqual(first, second);
      assertConflictFailure(first, "DuplicateCanonicalId");
      if (!first.ok && !second.ok) {
        assert.equal(first.detail, second.detail);
      }
      __resealExecutiveJournalExperienceRegistryForConflictTests();
    });
  });

  describe("lifecycle", () => {
    it("declares exact states, order, semantics, and legal transitions only", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceRegistryLifecycleStates],
        [...LIFECYCLE_STATES],
      );
      assert.equal(ExecutiveJournalExperienceRegistryLifecycle.stateCount, 3);
      assert.equal(ExecutiveJournalExperienceRegistryLifecycle.currentState, "Sealed");
      assert.equal(
        ExecutiveJournalExperienceRegistryLifecycle.acceptsFurtherRegistration,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryLifecycle.stateSemantics.Declared
          .entryCount,
        0,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryLifecycle.stateSemantics.Declared
          .registrationProcess,
        "empty",
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryLifecycle.stateSemantics.Populated
          .requiresExactlyOneValidFoundationEntry,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryLifecycle.stateSemantics.Populated
          .entryCount,
        1,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryLifecycle.stateSemantics.Sealed
          .requiresCanonicalPopulatedState,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryLifecycle.stateSemantics.Sealed
          .immutable,
        true,
      );
      assert.deepEqual(
        assertExecutiveJournalExperienceRegistryLifecycleTransition(
          "Declared",
          "Populated",
        ),
        { from: "Declared", to: "Populated" },
      );
      assert.deepEqual(
        assertExecutiveJournalExperienceRegistryLifecycleTransition(
          "Populated",
          "Sealed",
        ),
        { from: "Populated", to: "Sealed" },
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceRegistryLifecycleTransition(
          "Declared",
          "Sealed",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceRegistryLifecycleTransition(
          "Sealed",
          "Populated",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceRegistryLifecycleTransition(
          "Populated",
          "Declared",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceRegistryLifecycleState("ReadyForModel")
      );
      assert.equal(mutateFrozen(ExecutiveJournalExperienceRegistryLifecycle), false);
      assert.equal(
        mutateFrozen(
          ExecutiveJournalExperienceRegistryLifecycle.stateSemantics as object,
        ),
        false,
      );
    });

    it("ReadyForModel requires sealed Registry and does not authorize EX-2:3", () => {
      const requirements = ExecutiveJournalExperienceReadyForModelRequirements;
      assert.equal(requirements.requiresSealedCanonicalRegistry, true);
      assert.equal(requirements.requiresExactlyOneFoundationEntry, true);
      assert.equal(requirements.requiresCanonicalPopulatedThenSealed, true);
      assert.equal(requirements.authorizingDecisionId, "AD-EX2-09");
      assert.equal(requirements.doesNotMeanEx23AuthorizedOrCreated, true);
      assert.equal(requirements.doesNotMeanModelFilesExist, true);
      assert.equal(requirements.doesNotMeanUiOrPlatformExists, true);
      assert.equal(requirements.doesNotMeanRtc2IntegrationActive, true);
      assert.equal(requirements.doesNotMeanProductionOrDeploymentReady, true);
      assert.equal(requirements.doesNotMeanRouteAvailable, true);
      assert.equal(ExecutiveJournalExperienceRegistry.ex23Authorized, false);
      assert.equal(ExecutiveJournalExperienceRegistry.ex23Created, false);
      assert.equal(ExecutiveJournalExperienceRegistry.readiness, "ReadyForModel");
      assert.equal(ExecutiveJournalExperienceRegistry.entries.length, 1);
      assert.equal(ExecutiveJournalExperienceRegistry.sealed, true);
    });
  });

  describe("principles", () => {
    it("covers every principle independently with exact order and uniqueness", () => {
      assert.equal(ExecutiveJournalExperienceRegistryPrinciples.length, 10);
      assert.equal(PRINCIPLE_COVERAGE.length, 10);
      for (const expected of PRINCIPLE_COVERAGE) {
        const actual = ExecutiveJournalExperienceRegistryPrinciples.find(
          (principle) => principle.principleId === expected.principleId,
        );
        assert.ok(actual, expected.principleId);
        assert.equal(actual?.order, expected.order);
        assert.equal(actual?.statement, expected.statement);
        assert.equal(mutateFrozen(actual as object), false);
      }
      assert.deepEqual(
        ExecutiveJournalExperienceRegistryPrinciples.map((p) => p.statement),
        [...PRINCIPLE_STATEMENTS],
      );
      assert.equal(
        new Set(
          ExecutiveJournalExperienceRegistryPrinciples.map((p) => p.principleId),
        ).size,
        10,
      );
      assert.equal(
        mutateFrozen(ExecutiveJournalExperienceRegistryPrinciples as object),
        false,
      );
    });
  });

  describe("upstream preservation", () => {
    it("preserves Foundation aggregate, decisions, evidence, boundaries, and principles by exact reference", () => {
      assert.equal(
        ExecutiveJournalExperienceRegistry.foundation,
        ExecutiveJournalExperienceFoundation,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryUpstreamPreservation.foundation,
        ExecutiveJournalExperienceFoundation,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryUpstreamPreservation.foundationIdentity,
        ExecutiveJournalExperienceFoundation.identity,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryUpstreamPreservation
          .foundationLifecycle,
        ExecutiveJournalExperienceFoundation.lifecycle,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryUpstreamPreservation
          .foundationBoundaries,
        ExecutiveJournalExperienceFoundation.boundaries,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryUpstreamPreservation
          .foundationPrinciples,
        ExecutiveJournalExperienceFoundation.principles,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryUpstreamPreservation
          .foundationDecisions,
        ExecutiveJournalExperienceFoundation.decisions,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryUpstreamPreservation
          .foundationEvidenceLedger,
        ExecutiveJournalExperienceFoundation.evidenceLedger,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryUpstreamPreservation
          .adEx209InjectedIntoFoundationLedger,
        false,
      );
      const decisionIds =
        ExecutiveJournalExperienceFoundation.decisions.decisionIds;
      assert.equal(
        (decisionIds as readonly string[]).includes("AD-EX2-09"),
        false,
      );
      assert.deepEqual([...decisionIds], [
        "AD-EX2-00",
        "AD-EX2-01",
        "AD-EX2-02",
        "AD-EX2-03",
        "AD-EX2-04",
        "AD-EX2-05",
        "AD-EX2-06",
        "AD-EX2-07",
        "AD-EX2-08",
      ]);
    });

    it("carries open issues and pending gates unchanged by Foundation reference", () => {
      assert.equal(
        ExecutiveJournalExperienceRegistryOpenIssuesAndGates.openIssues,
        ExecutiveJournalExperienceFoundation.openIssues,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryOpenIssuesAndGates.pendingGateIds,
        ExecutiveJournalExperienceFoundation.pendingGates,
      );
      assert.deepEqual(
        [...ExecutiveJournalExperienceFoundation.pendingGates],
        ["G-EX2-04", "G-EX2-07", "G-EX2-12"],
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.openIssues.issueIds.length,
        13,
      );
      const expectedOwners = Object.freeze(
        ExecutiveJournalExperienceFoundation.openIssues.issues.map((issue) =>
          Object.freeze({
            issueId: issue.issueId,
            owner: issue.owner,
            description: issue.description,
            carriedByPhase: issue.carriedByPhase,
            status: issue.status,
          })
        ),
      );
      for (const gateId of ["G-EX2-04", "G-EX2-07", "G-EX2-12"] as const) {
        const gate = getExecutiveJournalProductArchitectureGate(gateId);
        assert.equal(gate.result, "Pending");
      }
      for (
        const issue of ExecutiveJournalExperienceFoundation.openIssues.issues
      ) {
        assert.equal(issue.carriedByPhase, "EX-2:1");
        assert.equal(issue.status, "Unresolved");
      }
      assert.deepEqual(
        ExecutiveJournalExperienceFoundation.openIssues.issues.map((issue) =>
          Object.freeze({
            issueId: issue.issueId,
            owner: issue.owner,
            description: issue.description,
            carriedByPhase: issue.carriedByPhase,
            status: issue.status,
          })
        ),
        [...expectedOwners],
      );
      for (
        const gate of ExecutiveJournalExperienceFoundation.openIssues
          .pendingGates
      ) {
        assert.equal(gate.carriedByPhase, "EX-2:1");
        assert.equal(gate.result, "Pending");
      }
      assert.equal(
        ExecutiveJournalExperienceRegistryOpenIssuesAndGates.resolvedByRegistry,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryOpenIssuesAndGates
          .blocksMetadataOnlyReadyForModel,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryOpenIssuesAndGates
          .productionBlockingUnchanged,
        true,
      );
    });
  });

  describe("authorization and boundaries", () => {
    it("records AD-EX2-09 metadata without expanding scope", () => {
      const auth = ExecutiveJournalExperienceRegistryAuthorization;
      assert.equal(auth.authorizationId, "AD-EX2-09");
      assert.equal(auth.authorizationStatus, "Accepted");
      assert.equal(
        auth.authorizationScope,
        "Ex22RegistryImplementationAndVerificationOnly",
      );
      assert.equal(auth.metadataOnlyRegistryAuthorized, true);
      assert.equal(auth.ex22ImplementationAuthorized, true);
      assert.equal(auth.ex23Authorized, false);
      assert.equal(auth.runtimeBehaviorAuthorized, false);
      assert.equal(auth.routeAuthorized, false);
      assert.equal(auth.realRtc2ConsumptionAuthorized, false);
      assert.equal(auth.productionProviderAuthorized, false);
      assert.equal(auth.networkAuthorized, false);
      assert.equal(auth.persistenceAuthorized, false);
      assert.equal(auth.telemetryAuthorized, false);
      assert.equal(auth.publicIndexAuthorized, false);
      assert.equal(auth.deploymentAuthorized, false);
      assert.equal(auth.injectedIntoFoundationLedger, false);

      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209.decisionScope,
        auth.authorizationScope,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209
          .ex22MetadataOnlyRegistryAuthorized,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209.ex23Authorized,
        false,
      );
    });

    it("declares dependency boundaries and principles completely", () => {
      assert.equal(
        ExecutiveJournalExperienceRegistryDependencyBoundaries
          .importsArchitectureAggregate,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryDependencyBoundaries.importsRtc,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryDependencyBoundaries.importsApp8,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistryDependencyBoundaries
          .clonesOrWrapsFoundation,
        false,
      );
      assert.equal(ExecutiveJournalExperienceRegistryPrinciples.length, 10);
      assert.deepEqual(
        ExecutiveJournalExperienceRegistryPrinciples.map((p) => p.statement),
        [...PRINCIPLE_STATEMENTS],
      );
      const orders = ExecutiveJournalExperienceRegistryPrinciples.map(
        (p) => p.order,
      );
      assert.deepEqual(orders, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const ids = new Set(
        ExecutiveJournalExperienceRegistryPrinciples.map((p) => p.principleId),
      );
      assert.equal(ids.size, 10);
    });
  });

  describe("aggregate and summary", () => {
    it("exposes exact component references and deterministic summary", () => {
      assert.equal(
        ExecutiveJournalExperienceRegistry.identity,
        ExecutiveJournalExperienceRegistryIdentity,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.lifecycle,
        ExecutiveJournalExperienceRegistryLifecycle,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.contracts,
        ExecutiveJournalExperienceRegistryContracts,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.canonicalEntry,
        ExecutiveJournalExperienceFoundationRegistryEntry,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.sealedEntryCatalogue,
        ExecutiveJournalExperienceRegistryCanonicalEntries,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.principles,
        ExecutiveJournalExperienceRegistryPrinciples,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.authorization,
        ExecutiveJournalExperienceRegistryAuthorization,
      );
      assert.equal(
        ExecutiveJournalExperienceRegistry.foundation,
        ExecutiveJournalExperienceFoundation,
      );
      assert.equal(mutateFrozen(ExecutiveJournalExperienceRegistry), false);
      // Shallow immutability of the aggregate; upstream Foundation summary
      // arrays remain owned by Foundation getter semantics.
      assert.equal(
        Object.isFrozen(ExecutiveJournalExperienceRegistry),
        true,
      );

      const first = getExecutiveJournalExperienceRegistrySummary();
      const second = getExecutiveJournalExperienceRegistrySummary();
      assert.deepEqual(first, second);
      assert.equal(first.identity, ExecutiveJournalExperienceRegistryId);
      assert.equal(first.namespace, ExecutiveJournalExperienceRegistryNamespace);
      assert.equal(first.status, "Registry");
      assert.equal(first.readiness, "ReadyForModel");
      assert.equal(first.phase, "EX-2:2");
      assert.equal(first.entryCount, 1);
      assert.equal(
        first.canonicalRegisteredId,
        ExecutiveJournalExperienceFoundationId,
      );
      assert.equal(
        first.canonicalRegisteredNamespace,
        ExecutiveJournalExperienceFoundationNamespace,
      );
      assert.deepEqual([...first.approvedAliases], [
        "ExecutiveJournalExperienceRegistry",
        "EX-2:2",
      ]);
      assert.equal(first.authorizationId, "AD-EX2-09");
      assert.deepEqual([...first.pendingGateIds], [
        "G-EX2-04",
        "G-EX2-07",
        "G-EX2-12",
      ]);
      assert.deepEqual(
        [...first.openIssueIds],
        [...getExecutiveJournalExperienceFoundationSummary().openIssueIds],
      );
      assert.equal(first.ex23Authorized, false);
      assert.equal(first.routeAuthorized, false);
      assert.equal(first.productionAuthorized, false);
      assert.equal(first.deploymentAuthorized, false);
      assert.equal(first.metadataOnly, true);
      assert.equal(first.closedWorld, true);
      assert.equal(first.sealed, true);

      const serialized = JSON.stringify(first);
      assert.equal(/password|token|secret|PII|fixture|evidenceContent/i.test(serialized), false);
    });

    it("coverage tables for identities, aliases, lifecycle, results, conflicts, and principles are complete", () => {
      assert.equal(REGISTERED_IDENTITIES.length, 1);
      assert.equal(ENTRY_ALIASES.length, 2);
      assert.equal(LIFECYCLE_STATES.length, 3);
      assert.equal(RESULT_VOCABULARY.length, 3);
      assert.equal(CONFLICT_CODES.length, 10);
      assert.equal(CONFLICT_COVERAGE.length, 10);
      assert.equal(PRINCIPLE_STATEMENTS.length, 10);
      assert.equal(PRINCIPLE_COVERAGE.length, 10);
      assert.deepEqual(
        CONFLICT_COVERAGE.map((item) => item.code),
        [...CONFLICT_CODES],
      );
      assert.deepEqual(
        PRINCIPLE_COVERAGE.map((item) => item.statement),
        [...PRINCIPLE_STATEMENTS],
      );
    });
  });
});
