/**
 * RTC-3:2 — Executive Decision Register Registry Tests.
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
  ExecutiveDecisionRegisterFoundation,
  ExecutiveDecisionRegisterFoundationId,
  ExecutiveDecisionRegisterFoundationNamespace,
} from "./executiveDecisionRegisterFoundation.ts";
import * as RegistryModule from "./executiveDecisionRegisterRegistry.ts";
import {
  ExecutiveDecisionRegisterFoundationRegistryEntry,
  ExecutiveDecisionRegisterRegistry,
  ExecutiveDecisionRegisterRegistryCanonicalEntries,
  ExecutiveDecisionRegisterRegistryId,
  ExecutiveDecisionRegisterRegistryName,
  ExecutiveDecisionRegisterRegistryNamespace,
  ExecutiveDecisionRegisterRegistryReadiness,
  ExecutiveDecisionRegisterRegistryStatus,
  ExecutiveDecisionRegisterRegistryVersion,
  getExecutiveDecisionRegisterRegistrySummary,
  isCanonicalDecisionRegisterRegistryLifecycleState,
  isExecutiveDecisionRegisterRegistered,
  registerExecutiveDecisionRegisterEntries,
  resolveExecutiveDecisionRegisterByAlias,
  resolveExecutiveDecisionRegisterById,
  resolveExecutiveDecisionRegisterByNamespace,
  resolveExecutiveDecisionRegisterRegistryEntry,
} from "./executiveDecisionRegisterRegistry.ts";
import { ExecutiveDecisionRegisterFoundationEntryAliases } from "./executiveDecisionRegisterRegistryIdentity.ts";
import { EXECUTIVE_DECISION_REGISTER_REGISTRY_LIFECYCLE_STATES } from "./executiveDecisionRegisterRegistryLifecycle.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC32_FILES = Object.freeze([
  "executiveDecisionRegisterRegistry.ts",
  "executiveDecisionRegisterRegistryTypes.ts",
  "executiveDecisionRegisterRegistryIdentity.ts",
  "executiveDecisionRegisterRegistryLifecycle.ts",
  "executiveDecisionRegisterRegistryContracts.ts",
  "executiveDecisionRegisterRegistryEntries.ts",
  "executiveDecisionRegisterRegistryMetadata.ts",
  "executiveDecisionRegisterRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveDecisionRegisterRegistryId",
  "ExecutiveDecisionRegisterRegistryVersion",
  "ExecutiveDecisionRegisterRegistryName",
  "ExecutiveDecisionRegisterRegistryNamespace",
  "ExecutiveDecisionRegisterRegistryStatus",
  "ExecutiveDecisionRegisterRegistryReadiness",
  "ExecutiveDecisionRegisterRegistry",
  "getExecutiveDecisionRegisterRegistrySummary",
  "getExecutiveDecisionRegisterRegistry",
  "resolveExecutiveDecisionRegisterRegistryEntry",
  "isExecutiveDecisionRegisterRegistered",
  "registerExecutiveDecisionRegisterEntries",
] as const);

const EXPECTED_OPEN_ISSUES = Object.freeze([
  Object.freeze({
    issueId: "OI-01",
    accountableOwner: "Records / legal",
  }),
  Object.freeze({
    issueId: "OI-02",
    accountableOwner: "Executive governance",
  }),
  Object.freeze({
    issueId: "OI-03",
    accountableOwner: "Journal steward",
  }),
  Object.freeze({
    issueId: "OI-04",
    accountableOwner: "Privacy + legal",
  }),
  Object.freeze({
    issueId: "OI-05",
    accountableOwner: "Executive governance",
  }),
  Object.freeze({
    issueId: "OI-06",
    accountableOwner: "Architecture authority",
  }),
]);

const EXPECTED_AI_MUST_NOT = Object.freeze([
  "Confirm a decision",
  "Create or broaden authority",
  "Make a proposal authoritative",
  "Resolve a dispute",
  "Supersede an effective decision",
  "Close a decision",
  "Disclose restricted material",
  "Change retention",
  "Dispose a record",
  "Satisfy human confirmation",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveJournalRuntime/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:fs["']/,
]);

const sourceFiles = () =>
  RTC32_FILES.filter((name) => !name.endsWith(".test.ts"));

describe("RTC-3:2 Executive Decision Register Registry", () => {
  describe("Identity and lifecycle", () => {
    it("has exact RTC-3:2 identity", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistryId,
        "RTC-3:2/ExecutiveDecisionRegisterRegistry",
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.identity.id,
        "RTC-3:2/ExecutiveDecisionRegisterRegistry",
      );
    });

    it("has exact registry namespace", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistryNamespace,
        "nexora.rtc.executive.decision.register.registry",
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.identity.namespace,
        "nexora.rtc.executive.decision.register.registry",
      );
    });

    it("status is Registry", () => {
      assert.equal(ExecutiveDecisionRegisterRegistryStatus, "Registry");
      assert.equal(ExecutiveDecisionRegisterRegistry.status, "Registry");
    });

    it("readiness is ReadyForModel", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistryReadiness,
        "ReadyForModel",
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.readiness,
        "ReadyForModel",
      );
    });

    it("lifecycle contains Declared, Populated, and Sealed", () => {
      assert.deepEqual(
        [...EXECUTIVE_DECISION_REGISTER_REGISTRY_LIFECYCLE_STATES],
        ["Declared", "Populated", "Sealed"],
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterRegistry.lifecycle.states],
        ["Declared", "Populated", "Sealed"],
      );
    });

    it("canonical registry is sealed", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.lifecycle.currentState,
        "Sealed",
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.lifecycle.acceptsFurtherRegistration,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.acceptsFurtherRegistration,
        false,
      );
      assert.equal(
        Object.isFrozen(ExecutiveDecisionRegisterRegistry),
        true,
      );
    });

    it("unknown lifecycle values fail closed", () => {
      assert.equal(
        isCanonicalDecisionRegisterRegistryLifecycleState("Declared"),
        true,
      );
      assert.equal(
        isCanonicalDecisionRegisterRegistryLifecycleState("Sealed"),
        true,
      );
      assert.equal(
        isCanonicalDecisionRegisterRegistryLifecycleState("Open"),
        false,
      );
      assert.equal(
        isCanonicalDecisionRegisterRegistryLifecycleState("sealed"),
        false,
      );
      assert.equal(
        isCanonicalDecisionRegisterRegistryLifecycleState(""),
        false,
      );
      assert.equal(
        isCanonicalDecisionRegisterRegistryLifecycleState(null),
        false,
      );
    });
  });

  describe("Canonical entry", () => {
    it("exactly one canonical entry exists", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistryCanonicalEntries.length,
        1,
      );
      assert.equal(ExecutiveDecisionRegisterRegistry.entries.length, 1);
    });

    it("registered identity is exactly RTC-3:1", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundationRegistryEntry.controlId,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundationRegistryEntry.controlId,
        ExecutiveDecisionRegisterFoundationId,
      );
    });

    it("registered namespace is exactly RTC-3:1 namespace", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundationRegistryEntry.namespace,
        "nexora.rtc.executive.decision.register.foundation",
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundationRegistryEntry.namespace,
        ExecutiveDecisionRegisterFoundationNamespace,
      );
    });

    it("registered foundation is the exact imported RTC-3:1 object", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundationRegistryEntry.foundation,
        ExecutiveDecisionRegisterFoundation,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation,
        ExecutiveDecisionRegisterFoundation,
      );
      assert.equal(ExecutiveDecisionRegisterRegistry.recreatesFoundation, false);
    });

    it("foundation readiness is ReadyForRegistry", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundationRegistryEntry.foundationReadiness,
        "ReadyForRegistry",
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundationRegistryEntry.foundation.readiness,
        "ReadyForRegistry",
      );
    });

    it("entry collection is immutable", () => {
      assert.equal(
        Object.isFrozen(ExecutiveDecisionRegisterRegistry.entries),
        true,
      );
      assert.equal(
        Object.isFrozen(ExecutiveDecisionRegisterRegistryCanonicalEntries),
        true,
      );
      assert.equal(
        Object.isFrozen(ExecutiveDecisionRegisterFoundationRegistryEntry),
        true,
      );
      assert.equal(
        Object.isFrozen(
          ExecutiveDecisionRegisterFoundationRegistryEntry.aliases,
        ),
        true,
      );
    });

    it("entry ordering is deterministic", () => {
      const first = [...ExecutiveDecisionRegisterRegistry.enumerate()];
      const second = [...ExecutiveDecisionRegisterRegistry.enumerate()];
      assert.deepEqual(first, second);
      assert.equal(first[0]?.order, 1);
      assert.equal(
        first[0],
        ExecutiveDecisionRegisterFoundationRegistryEntry,
      );
    });
  });

  describe("Resolution", () => {
    it("canonical identity resolves", () => {
      const result = resolveExecutiveDecisionRegisterById(
        ExecutiveDecisionRegisterFoundationId,
      );
      assert.equal(result.ok, true);
      if (!result.ok) {
        return;
      }
      assert.equal(result.code, "Resolved");
      assert.equal(result.resolvedBy, "controlId");
      assert.equal(
        result.entry,
        ExecutiveDecisionRegisterFoundationRegistryEntry,
      );
    });

    it("canonical namespace resolves", () => {
      const result = resolveExecutiveDecisionRegisterByNamespace(
        ExecutiveDecisionRegisterFoundationNamespace,
      );
      assert.equal(result.ok, true);
      if (!result.ok) {
        return;
      }
      assert.equal(result.resolvedBy, "namespace");
      assert.equal(
        result.entry,
        ExecutiveDecisionRegisterFoundationRegistryEntry,
      );
    });

    it("every approved alias resolves", () => {
      for (const alias of ExecutiveDecisionRegisterFoundationEntryAliases) {
        const result = resolveExecutiveDecisionRegisterByAlias(alias);
        assert.equal(result.ok, true, `alias ${alias} must resolve`);
      }
    });

    it("alias resolution returns the exact canonical entry", () => {
      for (const alias of ExecutiveDecisionRegisterFoundationEntryAliases) {
        const result = resolveExecutiveDecisionRegisterByAlias(alias);
        assert.equal(result.ok, true);
        if (!result.ok) {
          continue;
        }
        assert.equal(
          result.entry,
          ExecutiveDecisionRegisterFoundationRegistryEntry,
        );
      }
    });

    it("alias resolution returns the exact foundation object", () => {
      for (const alias of ExecutiveDecisionRegisterFoundationEntryAliases) {
        const result = resolveExecutiveDecisionRegisterByAlias(alias);
        assert.equal(result.ok, true);
        if (!result.ok) {
          continue;
        }
        assert.equal(
          result.entry.foundation,
          ExecutiveDecisionRegisterFoundation,
        );
      }
    });

    it("unknown identity returns UnknownIdentity", () => {
      const result = resolveExecutiveDecisionRegisterRegistryEntry(
        "RTC-3:1/DoesNotExist",
      );
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "UnknownIdentity");
        assert.equal(result.entry, null);
      }
    });

    it("malformed identity returns MalformedIdentity", () => {
      const padded = resolveExecutiveDecisionRegisterRegistryEntry(
        ` ${ExecutiveDecisionRegisterFoundationId} `,
      );
      assert.equal(padded.ok, false);
      if (!padded.ok) {
        assert.equal(padded.code, "MalformedIdentity");
      }
      const empty = resolveExecutiveDecisionRegisterRegistryEntry("");
      assert.equal(empty.ok, false);
      if (!empty.ok) {
        assert.equal(empty.code, "MalformedIdentity");
      }
      const nonString = resolveExecutiveDecisionRegisterRegistryEntry(42);
      assert.equal(nonString.ok, false);
      if (!nonString.ok) {
        assert.equal(nonString.code, "MalformedIdentity");
      }
    });

    it("case-changed identity fails", () => {
      const result = resolveExecutiveDecisionRegisterRegistryEntry(
        ExecutiveDecisionRegisterFoundationId.toLowerCase(),
      );
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "UnknownIdentity");
      }
    });

    it("whitespace-modified identity fails", () => {
      const result = resolveExecutiveDecisionRegisterRegistryEntry(
        `${ExecutiveDecisionRegisterFoundationId} `,
      );
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "MalformedIdentity");
      }
    });

    it("partial identity fails", () => {
      const result = resolveExecutiveDecisionRegisterRegistryEntry("RTC-3:1");
      // "RTC-3:1" is an approved alias and must resolve; partials that are
      // not aliases must fail.
      assert.equal(result.ok, true);
      const partial = resolveExecutiveDecisionRegisterRegistryEntry("RTC-3");
      assert.equal(partial.ok, false);
      if (!partial.ok) {
        assert.equal(partial.code, "UnknownIdentity");
      }
      const partialName = resolveExecutiveDecisionRegisterRegistryEntry(
        "ExecutiveDecisionRegister",
      );
      assert.equal(partialName.ok, false);
    });

    it("unknown namespace fails", () => {
      const result = resolveExecutiveDecisionRegisterByNamespace(
        "nexora.rtc.executive.decision.register.unknown",
      );
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "UnknownIdentity");
      }
    });
  });

  describe("Conflicts", () => {
    it("duplicate canonical identity conflicts", () => {
      const result = registerExecutiveDecisionRegisterEntries([
        ExecutiveDecisionRegisterFoundationRegistryEntry,
        ExecutiveDecisionRegisterFoundationRegistryEntry,
      ]);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "DuplicateCanonicalId");
      }
    });

    it("duplicate namespace conflicts", () => {
      const result = registerExecutiveDecisionRegisterEntries([
        ExecutiveDecisionRegisterFoundationRegistryEntry,
        {
          entryId: "RTC-3:2/Entry/Synthetic",
          controlId: "RTC-3:1/SyntheticOther",
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze(["SyntheticAlias"]),
          order: 2,
          foundationReadiness: "ReadyForRegistry",
          foundation: {
            identity: { foundationId: "RTC-3:1/SyntheticOther" },
            readiness: "ReadyForRegistry",
          },
        },
      ]);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "DuplicateNamespace");
      }
    });

    it("duplicate alias conflicts", () => {
      const result = registerExecutiveDecisionRegisterEntries([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: ExecutiveDecisionRegisterFoundationId,
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze([
            "ExecutiveDecisionRegisterFoundation",
            "ExecutiveDecisionRegisterFoundation",
          ]),
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: ExecutiveDecisionRegisterFoundation,
        },
      ]);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "DuplicateAlias");
      }
    });

    it("alias-to-canonical-ID collision conflicts", () => {
      const result = registerExecutiveDecisionRegisterEntries([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: ExecutiveDecisionRegisterFoundationId,
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze([ExecutiveDecisionRegisterFoundationId]),
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: ExecutiveDecisionRegisterFoundation,
        },
      ]);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "AliasCanonicalCollision");
      }
    });

    it("alias equal to canonical namespace is rejected", () => {
      const result = registerExecutiveDecisionRegisterEntries([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: ExecutiveDecisionRegisterFoundationId,
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze([
            "nexora.rtc.executive.decision.register.foundation",
          ]),
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: ExecutiveDecisionRegisterFoundation,
        },
      ]);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.notEqual(result.code, "Registered");
        assert.equal(result.code, "AliasCanonicalCollision");
        assert.equal(result.entries, null);
        assert.match(result.detail, /Alias collides with canonical identity/);
      }
    });

    it("alias-to-namespace conflict code is exact and deterministic", () => {
      const candidates = Object.freeze([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: ExecutiveDecisionRegisterFoundationId,
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze([
            ExecutiveDecisionRegisterFoundationNamespace,
          ]),
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: ExecutiveDecisionRegisterFoundation,
        },
      ]);
      const first = registerExecutiveDecisionRegisterEntries(candidates);
      const second = registerExecutiveDecisionRegisterEntries(candidates);
      assert.deepEqual(first, second);
      assert.equal(first.ok, false);
      if (!first.ok && !second.ok) {
        assert.equal(first.code, "AliasCanonicalCollision");
        assert.equal(second.code, "AliasCanonicalCollision");
        assert.equal(first.detail, second.detail);
      }
    });

    it("alias-to-namespace collision does not mutate sealed registry", () => {
      const beforeEntries = ExecutiveDecisionRegisterRegistry.entries;
      const beforeAliases = [
        ...ExecutiveDecisionRegisterFoundationRegistryEntry.aliases,
      ];
      const beforeSealed =
        ExecutiveDecisionRegisterRegistry.lifecycle.currentState;

      const conflict = registerExecutiveDecisionRegisterEntries([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: ExecutiveDecisionRegisterFoundationId,
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze([
            ExecutiveDecisionRegisterFoundationNamespace,
          ]),
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: ExecutiveDecisionRegisterFoundation,
        },
      ]);
      assert.equal(conflict.ok, false);
      if (!conflict.ok) {
        assert.equal(conflict.code, "AliasCanonicalCollision");
      }

      assert.equal(
        ExecutiveDecisionRegisterRegistry.entries,
        beforeEntries,
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundationRegistryEntry.aliases],
        beforeAliases,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundationRegistryEntry.aliases.includes(
          ExecutiveDecisionRegisterFoundationNamespace,
        ),
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.lifecycle.currentState,
        beforeSealed,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.lifecycle.currentState,
        "Sealed",
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.acceptsFurtherRegistration,
        false,
      );
    });

    it("after alias-to-namespace rejection, canonical ID and namespace still resolve", () => {
      const rejected = registerExecutiveDecisionRegisterEntries([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: ExecutiveDecisionRegisterFoundationId,
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze([
            ExecutiveDecisionRegisterFoundationNamespace,
          ]),
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: ExecutiveDecisionRegisterFoundation,
        },
      ]);
      assert.equal(rejected.ok, false);

      const byId = resolveExecutiveDecisionRegisterById(
        ExecutiveDecisionRegisterFoundationId,
      );
      const byNs = resolveExecutiveDecisionRegisterByNamespace(
        ExecutiveDecisionRegisterFoundationNamespace,
      );
      assert.equal(byId.ok, true);
      assert.equal(byNs.ok, true);
      if (!byId.ok || !byNs.ok) {
        return;
      }
      assert.equal(byId.code, "Resolved");
      assert.equal(byNs.code, "Resolved");
      assert.equal(
        byId.entry,
        ExecutiveDecisionRegisterFoundationRegistryEntry,
      );
      assert.equal(
        byNs.entry,
        ExecutiveDecisionRegisterFoundationRegistryEntry,
      );
      assert.equal(byNs.resolvedBy, "namespace");
      // Namespace resolution is not overridden by the rejected alias attempt.
      assert.notEqual(byNs.resolvedBy, "alias");
    });

    it("after alias-to-namespace rejection, approved aliases still resolve", () => {
      const rejected = registerExecutiveDecisionRegisterEntries([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: ExecutiveDecisionRegisterFoundationId,
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze([
            ExecutiveDecisionRegisterFoundationNamespace,
          ]),
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: ExecutiveDecisionRegisterFoundation,
        },
      ]);
      assert.equal(rejected.ok, false);

      for (const alias of ExecutiveDecisionRegisterFoundationEntryAliases) {
        const byAlias = resolveExecutiveDecisionRegisterByAlias(alias);
        assert.equal(byAlias.ok, true, `alias ${alias} must still resolve`);
        if (!byAlias.ok) {
          continue;
        }
        assert.equal(
          byAlias.entry,
          ExecutiveDecisionRegisterFoundationRegistryEntry,
        );
        assert.equal(
          byAlias.entry.foundation,
          ExecutiveDecisionRegisterFoundation,
        );
      }

      // Conflicting namespace string must not be owned by the alias index.
      const asAlias = resolveExecutiveDecisionRegisterByAlias(
        ExecutiveDecisionRegisterFoundationNamespace,
      );
      assert.equal(asAlias.ok, false);
      if (!asAlias.ok) {
        assert.equal(asAlias.code, "UnknownIdentity");
      }
      const unified = resolveExecutiveDecisionRegisterRegistryEntry(
        ExecutiveDecisionRegisterFoundationNamespace,
      );
      assert.equal(unified.ok, true);
      if (unified.ok) {
        assert.equal(unified.resolvedBy, "namespace");
      }
    });

    it("one alias cannot resolve to multiple entries", () => {
      const result = registerExecutiveDecisionRegisterEntries([
        ExecutiveDecisionRegisterFoundationRegistryEntry,
        {
          entryId: "RTC-3:2/Entry/Synthetic",
          controlId: "RTC-3:1/SyntheticOther",
          namespace: "nexora.rtc.executive.decision.register.synthetic",
          aliases: Object.freeze(["RTC-3:1"]),
          order: 2,
          foundationReadiness: "ReadyForRegistry",
          foundation: {
            identity: { foundationId: "RTC-3:1/SyntheticOther" },
            readiness: "ReadyForRegistry",
          },
        },
      ]);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "AliasAmbiguous");
      }
    });

    it("entry-key/foundation-identity mismatch conflicts", () => {
      const result = registerExecutiveDecisionRegisterEntries([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: "RTC-3:1/WrongKey",
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: Object.freeze([]),
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: ExecutiveDecisionRegisterFoundation,
        },
      ]);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "IdentityKeyMismatch");
      }
    });

    it("non-ready foundation registration conflicts", () => {
      const result = registerExecutiveDecisionRegisterEntries([
        {
          entryId: ExecutiveDecisionRegisterFoundationRegistryEntry.entryId,
          controlId: ExecutiveDecisionRegisterFoundationId,
          namespace: ExecutiveDecisionRegisterFoundationNamespace,
          aliases: ExecutiveDecisionRegisterFoundationEntryAliases,
          order: 1,
          foundationReadiness: "ReadyForRegistry",
          foundation: {
            identity: {
              foundationId: ExecutiveDecisionRegisterFoundationId,
            },
            readiness: "Foundation",
          },
        },
      ]);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.code, "FoundationNotReadyForRegistry");
      }
    });

    it("conflict ordering is deterministic", () => {
      const candidates = [
        ExecutiveDecisionRegisterFoundationRegistryEntry,
        ExecutiveDecisionRegisterFoundationRegistryEntry,
      ] as const;
      const first = registerExecutiveDecisionRegisterEntries(candidates);
      const second = registerExecutiveDecisionRegisterEntries(candidates);
      assert.deepEqual(first, second);
      assert.equal(first.ok, false);
      if (!first.ok && !second.ok) {
        assert.equal(first.code, second.code);
        assert.equal(first.detail, second.detail);
      }
    });
  });

  describe("Upstream preservation", () => {
    it("RTC-3:1 aggregate reference is preserved", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation,
        ExecutiveDecisionRegisterFoundation,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.canonicalEntry.foundation,
        ExecutiveDecisionRegisterFoundation,
      );
    });

    it("lifecycle reference is preserved", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.boundaries.foundationLifecycle,
        ExecutiveDecisionRegisterFoundation.lifecycle,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation.lifecycle,
        ExecutiveDecisionRegisterFoundation.lifecycle,
      );
    });

    it("event reference is preserved", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.boundaries.foundationEvents,
        ExecutiveDecisionRegisterFoundation.events,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation.events,
        ExecutiveDecisionRegisterFoundation.events,
      );
    });

    it("AI-prohibition reference is preserved", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.aiMustNot,
        ExecutiveDecisionRegisterFoundation.aiMustNot,
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterRegistry.aiMustNot],
        [...EXPECTED_AI_MUST_NOT],
      );
    });

    it("architecture decisions D-01 through D-06 are preserved by reference", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.upstreamDecisions,
        ExecutiveDecisionRegisterFoundation.foundationDecisions,
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterRegistry.upstreamDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06"],
      );
    });

    it("append-only and confirmation controls are preserved", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation.appendOnly,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation.correctionsDoNotErase,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation
          .confirmedRequiresHumanAndAuthority,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation
          .proposedIsNonAuthoritative,
        true,
      );
    });

    it("privacy, evidence, provenance, projection, and telemetry controls are preserved", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation.boundaries
          .privateReflectionSilentPromotionForbidden,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation.telemetryForbidden,
        ExecutiveDecisionRegisterFoundation.telemetryForbidden,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation.projectionNames,
        ExecutiveDecisionRegisterFoundation.projectionNames,
      );
      const provenance = ExecutiveDecisionRegisterRegistry.foundation.contracts
        .find((item) => item.contractName === "DecisionProvenance");
      assert.ok(provenance?.fields.includes("producing_event_refs"));
      const projection = ExecutiveDecisionRegisterRegistry.foundation.contracts
        .find((item) => item.contractName === "DecisionProjection");
      assert.ok(projection?.fields.includes("cannot_create_authority"));
    });
  });

  describe("Architecture decisions and open issues", () => {
    it("records D-07 through D-12", () => {
      assert.deepEqual(
        ExecutiveDecisionRegisterRegistry.decisions.map(
          (item) => item.decisionId,
        ),
        ["D-07", "D-08", "D-09", "D-10", "D-11", "D-12"],
      );
      const closedWorld = ExecutiveDecisionRegisterRegistry.decisions.find(
        (item) => item.decisionId === "D-07",
      );
      assert.ok(closedWorld?.statement.includes("closed-world"));
      const exactRef = ExecutiveDecisionRegisterRegistry.decisions.find(
        (item) => item.decisionId === "D-08",
      );
      assert.ok(exactRef?.statement.includes("exact reference"));
    });

    it("decision collections are immutable and ordered", () => {
      assert.equal(
        Object.isFrozen(ExecutiveDecisionRegisterRegistry.decisions),
        true,
      );
      assert.equal(
        Object.isFrozen(ExecutiveDecisionRegisterRegistry.upstreamDecisions),
        true,
      );
    });

    it("carries OI-01 through OI-06 unresolved with declared owners", () => {
      const issues = ExecutiveDecisionRegisterRegistry.openIssues;
      assert.equal(issues.length, 6);
      for (const expected of EXPECTED_OPEN_ISSUES) {
        const found = issues.find((item) => item.issueId === expected.issueId);
        assert.ok(found, `missing ${expected.issueId}`);
        assert.equal(found.accountableOwner, expected.accountableOwner);
        assert.equal(found.resolved, false);
        assert.equal(found.resolvedByRegistry, false);
        assert.equal(found.sourcePhase, "RTC-3:1");
        assert.equal(found.carriedByPhase, "RTC-3:2");
      }
      assert.equal(
        ExecutiveDecisionRegisterRegistry.resolvesOpenIssues,
        false,
      );
    });
  });

  describe("AI boundary", () => {
    it("preserves every mandatory AI prohibition", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterRegistry.aiMustNot],
        [...EXPECTED_AI_MUST_NOT],
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.aiMustNot,
        ExecutiveDecisionRegisterFoundation.aiMustNot,
      );
    });

    for (const prohibition of ExecutiveDecisionRegisterFoundation.aiMustNot) {
      it(`AI MUST NOT: ${prohibition}`, () => {
        assert.ok(
          ExecutiveDecisionRegisterRegistry.aiMustNot.includes(prohibition),
          `missing prohibition: ${prohibition}`,
        );
      });
    }

    it("registry discovery does not grant AI authority behaviors", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.aiAuthorityBehavior,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation.aiOutputNonAuthoritative,
        true,
      );
    });
  });

  describe("Aggregate, summary, and package shape", () => {
    it("creates exactly eight Registry files", () => {
      assert.equal(RTC32_FILES.length, 8);
      const present = readdirSync(HERE);
      for (const file of RTC32_FILES) {
        assert.ok(present.includes(file), `missing ${file}`);
      }
      const artifacts = present.filter((name) => RTC32_FILES.includes(name));
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

    it("enumerates and summarizes deterministically without mutable leakage", () => {
      const summaryA = getExecutiveDecisionRegisterRegistrySummary();
      const summaryB = getExecutiveDecisionRegisterRegistrySummary();
      assert.deepEqual(summaryA, summaryB);
      assert.equal(Object.isFrozen(summaryA), true);
      assert.equal(summaryA.entryCount, 1);
      assert.equal(
        summaryA.aliasCount,
        ExecutiveDecisionRegisterFoundationEntryAliases.length,
      );
      assert.equal(summaryA.openIssueCount, 6);
      assert.equal(summaryA.readiness, "ReadyForModel");
      assert.equal(
        summaryA.sourceFoundation,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
      assert.equal(
        summaryA.nextPhase,
        "RTC-3:3 — Executive Decision Register Model",
      );
      assert.equal(ExecutiveDecisionRegisterRegistryVersion, "1.0.0");
      assert.equal(
        ExecutiveDecisionRegisterRegistryName,
        "Executive Decision Register Registry",
      );
      assert.equal(
        isExecutiveDecisionRegisterRegistered(
          ExecutiveDecisionRegisterFoundationId,
        ),
        true,
      );
    });

    it("nextPhase points only to RTC-3:3 Decision Register Model", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.nextPhase,
        "RTC-3:3 — Executive Decision Register Model",
      );
      assert.equal(ExecutiveDecisionRegisterRegistry.modelPhase, false);
    });
  });

  describe("Dependency boundaries", () => {
    it("imports RTC-3:1 rather than recreating it and bans prohibited imports", () => {
      assert.equal(
        ExecutiveDecisionRegisterRegistry.foundation,
        ExecutiveDecisionRegisterFoundation,
      );
      assert.equal(ExecutiveDecisionRegisterRegistry.importsRtc2, false);
      assert.equal(ExecutiveDecisionRegisterRegistry.importsRtc1, false);
      assert.equal(ExecutiveDecisionRegisterRegistry.importsApp8, false);

      for (const file of sourceFiles()) {
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
        assert.doesNotMatch(source, /executiveJournalRuntime/);
        assert.doesNotMatch(
          source,
          /from ["'][^"']*PublicIndex[^"']*["']/,
        );
      }

      const registrySource = readFileSync(
        new URL("executiveDecisionRegisterRegistry.ts", import.meta.url),
        "utf8",
      );
      assert.match(
        registrySource,
        /from ["']\.\/executiveDecisionRegisterFoundation\.ts["']/,
      );
    });
  });
});
