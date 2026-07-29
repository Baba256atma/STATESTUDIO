/**
 * RTC-2:2 — Executive Journal Runtime Registry Tests.
 *
 * Deterministic coverage for closed-world foundation registration and lookup.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveJournalRuntimeFoundation,
  ExecutiveJournalRuntimeFoundationId,
  ExecutiveJournalRuntimeFoundationNamespace,
} from "./executiveJournalRuntimeFoundation.ts";
import * as RegistryModule from "./executiveJournalRuntimeRegistry.ts";
import {
  ExecutiveJournalRuntimeFoundationRegistryEntry,
  ExecutiveJournalRuntimeRegistry,
  ExecutiveJournalRuntimeRegistryCanonicalEntries,
  ExecutiveJournalRuntimeRegistryId,
  ExecutiveJournalRuntimeRegistryName,
  ExecutiveJournalRuntimeRegistryNamespace,
  ExecutiveJournalRuntimeRegistryReadiness,
  ExecutiveJournalRuntimeRegistryStatus,
  ExecutiveJournalRuntimeRegistryVersion,
  getExecutiveJournalRuntimeRegistrySummary,
  isExecutiveJournalRuntimeRegistered,
  registerExecutiveJournalRuntimeEntries,
  resolveExecutiveJournalRuntimeByAlias,
  resolveExecutiveJournalRuntimeById,
  resolveExecutiveJournalRuntimeByNamespace,
  resolveExecutiveJournalRuntimeRegistryEntry,
} from "./executiveJournalRuntimeRegistry.ts";
import { ExecutiveJournalRuntimeFoundationEntryAliases } from "./executiveJournalRuntimeRegistryIdentity.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC22_FILES = Object.freeze([
  "executiveJournalRuntimeRegistry.ts",
  "executiveJournalRuntimeRegistryTypes.ts",
  "executiveJournalRuntimeRegistryIdentity.ts",
  "executiveJournalRuntimeRegistryLifecycle.ts",
  "executiveJournalRuntimeRegistryContracts.ts",
  "executiveJournalRuntimeRegistryEntries.ts",
  "executiveJournalRuntimeRegistryMetadata.ts",
  "executiveJournalRuntimeRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveJournalRuntimeRegistryId",
  "ExecutiveJournalRuntimeRegistryVersion",
  "ExecutiveJournalRuntimeRegistryName",
  "ExecutiveJournalRuntimeRegistryNamespace",
  "ExecutiveJournalRuntimeRegistryStatus",
  "ExecutiveJournalRuntimeRegistryReadiness",
  "ExecutiveJournalRuntimeRegistry",
  "getExecutiveJournalRuntimeRegistrySummary",
  "getExecutiveJournalRuntimeRegistry",
  "resolveExecutiveJournalRuntimeRegistryEntry",
  "isExecutiveJournalRuntimeRegistered",
  "registerExecutiveJournalRuntimeEntries",
] as const);

const EXPECTED_OPEN_ISSUES = Object.freeze([
  Object.freeze({
    issueId: "OI-01",
    accountableOwner: "Records / legal",
  }),
  Object.freeze({
    issueId: "OI-02",
    accountableOwner: "Privacy + legal",
  }),
  Object.freeze({
    issueId: "OI-03",
    accountableOwner: "Executive governance",
  }),
  Object.freeze({
    issueId: "OI-04",
    accountableOwner: "Privacy + security",
  }),
  Object.freeze({
    issueId: "OI-05",
    accountableOwner: "Journal steward",
  }),
  Object.freeze({
    issueId: "OI-06",
    accountableOwner: "Policy authority",
  }),
]);

const EXPECTED_AI_MUST_NOT = Object.freeze([
  "confirm decisions",
  "create authority",
  "close commitments",
  "disclose restricted material",
  "alter retention state",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

describe("RTC-2:2 Executive Journal Runtime Registry", () => {
  it("creates exactly eight Registry files", () => {
    assert.equal(RTC22_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC22_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    const artifacts = present.filter((name) => RTC22_FILES.includes(name));
    assert.equal(artifacts.length, 8);
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in RegistryModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("has registry identity RTC-2:2 and namespace nexora.rtc.executive.journal.registry", () => {
    assert.equal(
      ExecutiveJournalRuntimeRegistryId,
      "RTC-2:2/ExecutiveJournalRuntimeRegistry",
    );
    assert.equal(ExecutiveJournalRuntimeRegistryVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimeRegistryName,
      "Executive Journal Runtime Registry",
    );
    assert.equal(
      ExecutiveJournalRuntimeRegistryNamespace,
      "nexora.rtc.executive.journal.registry",
    );
    assert.equal(ExecutiveJournalRuntimeRegistryStatus, "Registry");
    assert.equal(
      ExecutiveJournalRuntimeRegistryReadiness,
      "ReadyForModel",
    );

    const registry = ExecutiveJournalRuntimeRegistry;
    assert.equal(registry.identity.phaseId, "RTC-2:2");
    assert.equal(registry.status, "Registry");
    assert.equal(registry.readiness, "ReadyForModel");
    assert.equal(
      registry.nextPhase,
      "RTC-2:3 — Executive Journal Runtime Model",
    );
    assert.equal(
      registry.identity.sourceFoundation,
      "RTC-2:1/ExecutiveJournalRuntimeFoundation",
    );
  });

  it("registers RTC-2:1 exactly once and preserves ReadyForRegistry", () => {
    assert.equal(ExecutiveJournalRuntimeRegistryCanonicalEntries.length, 1);
    assert.equal(ExecutiveJournalRuntimeRegistry.entries.length, 1);
    assert.equal(
      ExecutiveJournalRuntimeRegistry.entries[0],
      ExecutiveJournalRuntimeFoundationRegistryEntry,
    );
    assert.equal(
      ExecutiveJournalRuntimeFoundationRegistryEntry.controlId,
      ExecutiveJournalRuntimeFoundationId,
    );
    assert.equal(
      ExecutiveJournalRuntimeFoundationRegistryEntry.namespace,
      ExecutiveJournalRuntimeFoundationNamespace,
    );
    assert.equal(
      ExecutiveJournalRuntimeFoundationRegistryEntry.foundationReadiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveJournalRuntimeFoundationRegistryEntry.foundation.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveJournalRuntimeFoundationRegistryEntry.foundation,
      ExecutiveJournalRuntimeFoundation,
    );
    assert.equal(ExecutiveJournalRuntimeRegistry.recreatesFoundation, false);
  });

  it("resolves by canonical ID, namespace, and alias to the same entry object", () => {
    const byId = resolveExecutiveJournalRuntimeById(
      ExecutiveJournalRuntimeFoundationId,
    );
    const byNs = resolveExecutiveJournalRuntimeByNamespace(
      ExecutiveJournalRuntimeFoundationNamespace,
    );
    assert.equal(byId.ok, true);
    assert.equal(byNs.ok, true);
    if (!byId.ok || !byNs.ok) {
      return;
    }
    assert.equal(byId.entry, ExecutiveJournalRuntimeFoundationRegistryEntry);
    assert.equal(byNs.entry, ExecutiveJournalRuntimeFoundationRegistryEntry);
    assert.equal(byId.entry, byNs.entry);
    assert.equal(byId.entry.foundation, ExecutiveJournalRuntimeFoundation);

    for (const alias of ExecutiveJournalRuntimeFoundationEntryAliases) {
      const byAlias = resolveExecutiveJournalRuntimeByAlias(alias);
      assert.equal(byAlias.ok, true);
      if (!byAlias.ok) {
        continue;
      }
      assert.equal(
        byAlias.entry,
        ExecutiveJournalRuntimeFoundationRegistryEntry,
      );
      const unified = resolveExecutiveJournalRuntimeRegistryEntry(alias);
      assert.equal(unified.ok, true);
      if (unified.ok) {
        assert.equal(unified.entry, byId.entry);
      }
    }

    assert.equal(
      isExecutiveJournalRuntimeRegistered(ExecutiveJournalRuntimeFoundationId),
      true,
    );
  });

  it("fails closed for unknown and malformed identities", () => {
    const unknown = resolveExecutiveJournalRuntimeRegistryEntry(
      "RTC-2:1/DoesNotExist",
    );
    assert.equal(unknown.ok, false);
    if (!unknown.ok) {
      assert.equal(unknown.code, "UnknownIdentity");
      assert.equal(unknown.entry, null);
    }

    const caseChange = resolveExecutiveJournalRuntimeRegistryEntry(
      ExecutiveJournalRuntimeFoundationId.toLowerCase(),
    );
    assert.equal(caseChange.ok, false);
    if (!caseChange.ok) {
      assert.equal(caseChange.code, "UnknownIdentity");
    }

    const padded = resolveExecutiveJournalRuntimeRegistryEntry(
      ` ${ExecutiveJournalRuntimeFoundationId} `,
    );
    assert.equal(padded.ok, false);
    if (!padded.ok) {
      assert.equal(padded.code, "MalformedIdentity");
    }

    const empty = resolveExecutiveJournalRuntimeRegistryEntry("");
    assert.equal(empty.ok, false);
    if (!empty.ok) {
      assert.equal(empty.code, "MalformedIdentity");
    }

    const nonString = resolveExecutiveJournalRuntimeRegistryEntry(42);
    assert.equal(nonString.ok, false);
    if (!nonString.ok) {
      assert.equal(nonString.code, "MalformedIdentity");
    }

    assert.equal(isExecutiveJournalRuntimeRegistered("RTC-9:9/Nope"), false);
  });

  it("rejects duplicate canonical IDs, namespaces, and alias collisions", () => {
    const duplicateId = registerExecutiveJournalRuntimeEntries([
      ExecutiveJournalRuntimeFoundationRegistryEntry,
      ExecutiveJournalRuntimeFoundationRegistryEntry,
    ]);
    assert.equal(duplicateId.ok, false);
    if (!duplicateId.ok) {
      assert.equal(duplicateId.code, "DuplicateCanonicalId");
    }

    const duplicateNamespace = registerExecutiveJournalRuntimeEntries([
      ExecutiveJournalRuntimeFoundationRegistryEntry,
      {
        entryId: "RTC-2:2/Entry/Synthetic",
        controlId: "RTC-2:1/SyntheticOther",
        namespace: ExecutiveJournalRuntimeFoundationNamespace,
        aliases: Object.freeze(["SyntheticAlias"]),
        order: 2,
        foundationReadiness: "ReadyForRegistry",
        foundation: {
          identity: { foundationId: "RTC-2:1/SyntheticOther" },
          readiness: "ReadyForRegistry",
        },
      },
    ]);
    assert.equal(duplicateNamespace.ok, false);
    if (!duplicateNamespace.ok) {
      assert.equal(duplicateNamespace.code, "DuplicateNamespace");
    }

    const aliasCollision = registerExecutiveJournalRuntimeEntries([
      {
        entryId: ExecutiveJournalRuntimeFoundationRegistryEntry.entryId,
        controlId: ExecutiveJournalRuntimeFoundationId,
        namespace: ExecutiveJournalRuntimeFoundationNamespace,
        aliases: Object.freeze([ExecutiveJournalRuntimeFoundationId]),
        order: 1,
        foundationReadiness: "ReadyForRegistry",
        foundation: ExecutiveJournalRuntimeFoundation,
      },
    ]);
    assert.equal(aliasCollision.ok, false);
    if (!aliasCollision.ok) {
      assert.equal(aliasCollision.code, "AliasCanonicalCollision");
    }

    const ambiguousAlias = registerExecutiveJournalRuntimeEntries([
      ExecutiveJournalRuntimeFoundationRegistryEntry,
      {
        entryId: "RTC-2:2/Entry/Synthetic",
        controlId: "RTC-2:1/SyntheticOther",
        namespace: "nexora.rtc.executive.journal.synthetic",
        aliases: Object.freeze(["RTC-2:1"]),
        order: 2,
        foundationReadiness: "ReadyForRegistry",
        foundation: {
          identity: { foundationId: "RTC-2:1/SyntheticOther" },
          readiness: "ReadyForRegistry",
        },
      },
    ]);
    assert.equal(ambiguousAlias.ok, false);
    if (!ambiguousAlias.ok) {
      assert.equal(ambiguousAlias.code, "AliasAmbiguous");
    }

    const notReady = registerExecutiveJournalRuntimeEntries([
      {
        entryId: ExecutiveJournalRuntimeFoundationRegistryEntry.entryId,
        controlId: ExecutiveJournalRuntimeFoundationId,
        namespace: ExecutiveJournalRuntimeFoundationNamespace,
        aliases: ExecutiveJournalRuntimeFoundationEntryAliases,
        order: 1,
        foundationReadiness: "ReadyForRegistry",
        foundation: {
          identity: { foundationId: ExecutiveJournalRuntimeFoundationId },
          readiness: "Foundation",
        },
      },
    ]);
    assert.equal(notReady.ok, false);
    if (!notReady.ok) {
      assert.equal(notReady.code, "FoundationNotReadyForRegistry");
    }

    const keyMismatch = registerExecutiveJournalRuntimeEntries([
      {
        entryId: ExecutiveJournalRuntimeFoundationRegistryEntry.entryId,
        controlId: "RTC-2:1/WrongKey",
        namespace: ExecutiveJournalRuntimeFoundationNamespace,
        aliases: Object.freeze([]),
        order: 1,
        foundationReadiness: "ReadyForRegistry",
        foundation: ExecutiveJournalRuntimeFoundation,
      },
    ]);
    assert.equal(keyMismatch.ok, false);
    if (!keyMismatch.ok) {
      assert.equal(keyMismatch.code, "IdentityKeyMismatch");
    }
  });

  it("enumerates and summarizes deterministically without mutable leakage", () => {
    const first = [...ExecutiveJournalRuntimeRegistry.enumerate()];
    const second = [...ExecutiveJournalRuntimeRegistry.enumerate()];
    assert.deepEqual(first, second);
    assert.equal(first.length, 1);
    assert.equal(first[0], ExecutiveJournalRuntimeFoundationRegistryEntry);

    assert.equal(Object.isFrozen(ExecutiveJournalRuntimeRegistry.entries), true);
    assert.equal(
      Object.isFrozen(ExecutiveJournalRuntimeFoundationRegistryEntry),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveJournalRuntimeFoundationRegistryEntry.aliases),
      true,
    );

    const summaryA = getExecutiveJournalRuntimeRegistrySummary();
    const summaryB = getExecutiveJournalRuntimeRegistrySummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.entryCount, 1);
    assert.equal(
      summaryA.aliasCount,
      ExecutiveJournalRuntimeFoundationEntryAliases.length,
    );
    assert.equal(summaryA.openIssueCount, 6);
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(
      summaryA.sourceFoundation,
      "RTC-2:1/ExecutiveJournalRuntimeFoundation",
    );
  });

  it("carries OI-01 through OI-06 unresolved with required owners", () => {
    const issues = ExecutiveJournalRuntimeRegistry.openIssues;
    assert.equal(issues.length, 6);
    for (const expected of EXPECTED_OPEN_ISSUES) {
      const found = issues.find((item) => item.issueId === expected.issueId);
      assert.ok(found, `missing ${expected.issueId}`);
      assert.equal(found?.accountableOwner, expected.accountableOwner);
      assert.equal(found?.resolved, false);
      assert.equal(found?.resolvedByRegistry, false);
    }
    assert.equal(ExecutiveJournalRuntimeRegistry.resolvesOpenIssues, false);
    assert.equal(
      ExecutiveJournalRuntimeRegistry.boundaries.openIssuesUnresolved,
      true,
    );
  });

  it("preserves AI prohibitions and foundation controls by reference", () => {
    assert.deepEqual(
      [...ExecutiveJournalRuntimeRegistry.aiMustNot],
      [...EXPECTED_AI_MUST_NOT],
    );
    assert.equal(
      ExecutiveJournalRuntimeRegistry.aiMustNot,
      ExecutiveJournalRuntimeFoundation.boundaries.aiMustNot,
    );
    assert.equal(ExecutiveJournalRuntimeRegistry.foundation.appendOnly, true);
    assert.equal(
      ExecutiveJournalRuntimeRegistry.foundation.correctionsDoNotErase,
      true,
    );
    assert.equal(
      ExecutiveJournalRuntimeRegistry.foundation.privateReflectionSeparateClass,
      true,
    );
    assert.equal(
      ExecutiveJournalRuntimeRegistry.foundation.boundaries
        .failClosedOnPolicyUnavailable,
      true,
    );
    assert.ok(
      ExecutiveJournalRuntimeRegistry.foundation.boundaries.prohibitedSurfaces
        .includes("journal payload in routine telemetry"),
    );
    const envelope = ExecutiveJournalRuntimeRegistry.foundation.contracts.find(
      (item) => item.contractName === "JournalEventEnvelope",
    );
    assert.ok(envelope?.fields.includes("authority_ref"));
    assert.ok(envelope?.fields.includes("integrity"));
  });

  it("imports RTC-2:1 rather than recreating it and bans prohibited imports", () => {
    assert.equal(
      ExecutiveJournalRuntimeRegistry.foundation,
      ExecutiveJournalRuntimeFoundation,
    );

    const sources = RTC22_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
      assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
      assert.doesNotMatch(source, /decision-journal/);
    }

    const registrySource = readFileSync(
      new URL("executiveJournalRuntimeRegistry.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      registrySource,
      /from ["']\.\/executiveJournalRuntimeFoundation\.ts["']/,
    );
  });
});
