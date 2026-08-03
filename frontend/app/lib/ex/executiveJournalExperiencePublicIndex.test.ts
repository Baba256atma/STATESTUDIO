/** EX-2:9 metadata-only Public Index verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import * as PublicIndexModule from "./executiveJournalExperiencePublicIndex.ts";
import {
  executiveJournalExperiencePublicIndex,
  executiveJournalExperiencePublicIndexIdentity,
  executiveJournalExperiencePublicIndexMetadata,
  executiveJournalExperiencePublicIndexSummary,
  publicApiCount,
  publicApiSurface,
  publicIndexCanonicalId,
  publicIndexId,
  publicIndexNamespace,
  publicIndexReadiness,
  publicIndexStatus,
  publicIndexVersion,
} from "./executiveJournalExperiencePublicIndex.ts";
import { ExecutiveJournalExperienceFreeze } from "./executiveJournalExperienceFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const FILES = Object.freeze([
  "executiveJournalExperiencePublicIndex.ts",
  "executiveJournalExperiencePublicIndex.test.ts",
] as const);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "publicIndexId",
  "publicIndexCanonicalId",
  "publicIndexNamespace",
  "publicIndexVersion",
  "publicIndexStatus",
  "publicIndexReadiness",
  "publicApiSurface",
  "publicApiCount",
  "executiveJournalExperiencePublicIndexIdentity",
  "executiveJournalExperiencePublicIndexMetadata",
  "executiveJournalExperiencePublicIndexSummary",
  "executiveJournalExperiencePublicIndex",
] as const);

const EXPECTED_NAMESPACE_SECTIONS = Object.freeze([
  "Identity",
  "Release Information",
  "Upstream",
  "Public API Registry",
  "Readiness",
  "Consumer Rules",
  "Compatibility",
  "Metadata",
  "Summary",
] as const);

describe("EX-2:9 package inventory and public surface", () => {
  it("creates exactly two Public Index files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveJournalExperiencePublicIndex(?:\.test)?\.ts$/.test(name)
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
    assert.equal(found.length, 2);
  });

  it("exposes exactly twelve public exports in declaration order", () => {
    const keys = Object.keys(PublicIndexModule);
    assert.equal(keys.length, 12);
    assert.deepEqual(keys.sort(), [...REQUIRED_PUBLIC_EXPORTS].sort());
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in PublicIndexModule,
        `missing public export ${exportName}`,
      );
    }
    const source = readFileSync(
      join(HERE, "executiveJournalExperiencePublicIndex.ts"),
      "utf8",
    );
    const declared = [...source.matchAll(/^export const (\w+)/gm)].map(
      (match) => match[1],
    );
    assert.deepEqual(declared, [...REQUIRED_PUBLIC_EXPORTS]);
  });

  it("publishes exact identity, status, and ReadyForConsumer readiness", () => {
    assert.equal(
      publicIndexId,
      "EX-2:9/ExecutiveJournalExperiencePublicIndex",
    );
    assert.equal(
      publicIndexCanonicalId,
      "EX-2:9/ExecutiveJournalExperiencePublicIndex",
    );
    assert.equal(
      publicIndexNamespace,
      "nexora.ex.executive.journal.experience.public-index",
    );
    assert.equal(publicIndexVersion, "1.0.0");
    assert.equal(
      publicIndexStatus,
      "Released · Certified · Frozen · Stable",
    );
    assert.equal(publicIndexReadiness, "ReadyForConsumer");
    assert.equal(
      executiveJournalExperiencePublicIndexIdentity.canonicalId,
      publicIndexCanonicalId,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.status,
      publicIndexStatus,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.readiness,
      "ReadyForConsumer",
    );
    assert.equal(executiveJournalExperiencePublicIndex.released, true);
    assert.equal(executiveJournalExperiencePublicIndex.certified, true);
    assert.equal(executiveJournalExperiencePublicIndex.frozen, true);
    assert.equal(executiveJournalExperiencePublicIndex.stable, true);
  });
});

describe("EX-2:9 namespace sections and public API registry", () => {
  it("publishes exactly nine namespace sections in canonical order", () => {
    assert.equal(
      executiveJournalExperiencePublicIndex.namespaceSections.length,
      9,
    );
    assert.deepEqual(
      executiveJournalExperiencePublicIndex.namespaceSections.map(
        (item) => item.section,
      ),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.deepEqual(
      executiveJournalExperiencePublicIndex.namespaceSections.map(
        (item) => item.order,
      ),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
  });

  it("derives Public API Registry dynamically from Freeze", () => {
    const expectedCount =
      ExecutiveJournalExperienceFreeze.contracts.length
      + ExecutiveJournalExperienceFreeze.locks.length
      + ExecutiveJournalExperienceFreeze.decisions.length
      + ExecutiveJournalExperienceFreeze.readinessConditions.length
      + ExecutiveJournalExperienceFreeze.lifecycle.states.length
      + ExecutiveJournalExperienceFreeze.aliases.length;

    assert.equal(publicApiCount, publicApiSurface.length);
    assert.equal(publicApiCount, expectedCount);
    assert.equal(
      executiveJournalExperiencePublicIndex.publicApiCount,
      publicApiSurface.length,
    );
    assert.ok(publicApiSurface.length > 0);
    assert.equal(
      publicApiSurface.every((item) => item.metadataOnly === true),
      true,
    );
    assert.equal(
      publicApiSurface.every((item) => item.executable === false),
      true,
    );
    assert.equal(
      publicApiSurface.every(
        (item) => item.sourcePhase === ExecutiveJournalExperienceFreeze.identity.id,
      ),
      true,
    );
    assert.ok(publicApiSurface.some((item) => item.kind === "Contract"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Lock"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Decision"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Readiness"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Lifecycle"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Identity"));
    assert.equal(
      new Set(publicApiSurface.map((item) => item.apiIdentifier)).size,
      publicApiSurface.length,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.publicApiRegistry
        .derivedFromFreezeOnly,
      true,
    );
  });
});

describe("EX-2:9 consumer rules, compatibility, and summary", () => {
  it("declares sole consumer entry point and consumer rules", () => {
    assert.equal(
      executiveJournalExperiencePublicIndex.soleConsumerEntryPoint,
      true,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.consumerRules.length,
      7,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.consumerRules[0]?.statement,
      "Public Index is the sole consumer entry point.",
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.consumerRules.some((rule) =>
        rule.statement === "Direct imports from Freeze are prohibited."
      ),
      true,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.consumerRules.some((rule) =>
        rule.statement === "Direct imports from Certification are prohibited."
      ),
      true,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.consumerRules.some((rule) =>
        rule.statement === "Direct imports from Platform are prohibited."
      ),
      true,
    );
    assert.equal(
      executiveJournalExperiencePublicIndexSummary.soleConsumerEntryPoint,
      true,
    );
    assert.equal(
      executiveJournalExperiencePublicIndexSummary.consumerEntryPoint,
      "executiveJournalExperiencePublicIndex.ts",
    );
  });

  it("publishes immutable compatibility and metadata", () => {
    assert.equal(
      executiveJournalExperiencePublicIndex.compatibility.semanticVersion,
      "1.0.0",
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.compatibility.releaseChannel,
      "stable",
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.compatibility.stability,
      "Stable",
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.compatibility.deterministicBehavior,
      true,
    );
    assert.equal(
      executiveJournalExperiencePublicIndexMetadata.authorizationReference,
      "AD-EX2-14",
    );
    assert.equal(
      executiveJournalExperiencePublicIndexMetadata.upstreamReference,
      ExecutiveJournalExperienceFreeze.identity.id,
    );
    assert.equal(Object.isFrozen(executiveJournalExperiencePublicIndex), true);
    assert.equal(Object.isFrozen(publicApiSurface), true);
    assert.equal(
      Object.isFrozen(executiveJournalExperiencePublicIndexMetadata),
      true,
    );
  });

  it("publishes a deterministic summary", () => {
    assert.equal(
      executiveJournalExperiencePublicIndexSummary.canonicalIdentity,
      publicIndexCanonicalId,
    );
    assert.equal(
      executiveJournalExperiencePublicIndexSummary.namespace,
      publicIndexNamespace,
    );
    assert.equal(
      executiveJournalExperiencePublicIndexSummary.releaseStatus,
      publicIndexStatus,
    );
    assert.equal(
      executiveJournalExperiencePublicIndexSummary.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      executiveJournalExperiencePublicIndexSummary.upstreamDependency,
      "EX-2:8/ExecutiveJournalExperienceFreeze",
    );
    assert.equal(
      executiveJournalExperiencePublicIndexSummary.publicApiCount,
      publicApiCount,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.summary,
      executiveJournalExperiencePublicIndexSummary,
    );
  });
});

describe("EX-2:9 dependency boundary and fail-closed import policy", () => {
  it("imports only the Freeze aggregate", () => {
    const source = readFileSync(
      join(HERE, "executiveJournalExperiencePublicIndex.ts"),
      "utf8",
    );
    const imports = [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
      (match) => match[1],
    );
    assert.deepEqual(imports, ["./executiveJournalExperienceFreeze.ts"]);
    assert.doesNotMatch(
      source,
      /from ["'][^"']*(Certification|Platform|Manifest|Validation|Model|Registry|Foundation|rtc|react|next)/i,
    );
    assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
    assert.doesNotMatch(
      source,
      /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
    );
  });

  it("preserves exact Freeze upstream reference without bypass", () => {
    assert.equal(
      executiveJournalExperiencePublicIndex.upstream.freeze,
      ExecutiveJournalExperienceFreeze,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.freezeOnlyDependency,
      true,
    );
    assert.equal(executiveJournalExperiencePublicIndex.bypassesFreeze, false);
    assert.equal(
      executiveJournalExperiencePublicIndex.runtimeMutation,
      false,
    );
    assert.equal(
      executiveJournalExperiencePublicIndex.executesRuntimeLogic,
      false,
    );
  });
});
