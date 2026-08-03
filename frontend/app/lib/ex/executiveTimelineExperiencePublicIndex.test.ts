/** EX-3:9 metadata-only Public Index verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import * as PublicIndexModule from "./executiveTimelineExperiencePublicIndex.ts";
import {
  executiveTimelineExperiencePublicIndex,
  executiveTimelineExperiencePublicIndexIdentity,
  executiveTimelineExperiencePublicIndexMetadata,
  executiveTimelineExperiencePublicIndexSummary,
  publicApiCount,
  publicApiSurface,
  publicIndexCanonicalId,
  publicIndexId,
  publicIndexNamespace,
  publicIndexReadiness,
  publicIndexStatus,
  publicIndexVersion,
} from "./executiveTimelineExperiencePublicIndex.ts";
import { ExecutiveTimelineExperienceFreeze } from "./executiveTimelineExperienceFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const FILES = Object.freeze([
  "executiveTimelineExperiencePublicIndex.ts",
  "executiveTimelineExperiencePublicIndex.test.ts",
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
  "executiveTimelineExperiencePublicIndexIdentity",
  "executiveTimelineExperiencePublicIndexMetadata",
  "executiveTimelineExperiencePublicIndexSummary",
  "executiveTimelineExperiencePublicIndex",
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

describe("EX-3:9 package inventory and public surface", () => {
  it("creates exactly two Public Index files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperiencePublicIndex(?:\.test)?\.ts$/.test(name)
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
      join(HERE, "executiveTimelineExperiencePublicIndex.ts"),
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
      "EX-3:9/ExecutiveTimelineExperiencePublicIndex",
    );
    assert.equal(
      publicIndexCanonicalId,
      "EX-3:9/ExecutiveTimelineExperiencePublicIndex",
    );
    assert.equal(
      publicIndexNamespace,
      "nexora.ex.executive.timeline.experience.public-index",
    );
    assert.equal(publicIndexVersion, "1.0.0");
    assert.equal(
      publicIndexStatus,
      "Released · Certified · Frozen · Stable",
    );
    assert.equal(publicIndexReadiness, "ReadyForConsumer");
    assert.equal(
      executiveTimelineExperiencePublicIndexIdentity.canonicalId,
      publicIndexCanonicalId,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.status,
      publicIndexStatus,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.readiness,
      "ReadyForConsumer",
    );
    assert.equal(executiveTimelineExperiencePublicIndex.released, true);
    assert.equal(executiveTimelineExperiencePublicIndex.certified, true);
    assert.equal(executiveTimelineExperiencePublicIndex.frozen, true);
    assert.equal(executiveTimelineExperiencePublicIndex.stable, true);
  });
});

describe("EX-3:9 namespace sections and public API registry", () => {
  it("publishes exactly nine namespace sections in canonical order", () => {
    assert.equal(
      executiveTimelineExperiencePublicIndex.namespaceSections.length,
      9,
    );
    assert.deepEqual(
      executiveTimelineExperiencePublicIndex.namespaceSections.map(
        (item) => item.section,
      ),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.deepEqual(
      executiveTimelineExperiencePublicIndex.namespaceSections.map(
        (item) => item.order,
      ),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
  });

  it("derives Public API Registry dynamically from Freeze", () => {
    const expectedCount =
      ExecutiveTimelineExperienceFreeze.contracts.length
      + ExecutiveTimelineExperienceFreeze.locks.length
      + ExecutiveTimelineExperienceFreeze.decisions.length
      + ExecutiveTimelineExperienceFreeze.lifecycle.states.length
      + ExecutiveTimelineExperienceFreeze.aliases.length;

    assert.equal(publicApiCount, publicApiSurface.length);
    assert.equal(publicApiCount, expectedCount);
    assert.equal(
      executiveTimelineExperiencePublicIndex.publicApiCount,
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
        (item) =>
          item.sourcePhase === ExecutiveTimelineExperienceFreeze.identity.id,
      ),
      true,
    );
    assert.ok(publicApiSurface.some((item) => item.kind === "Contract"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Lock"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Decision"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Lifecycle"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Identity"));
    assert.equal(
      new Set(publicApiSurface.map((item) => item.apiIdentifier)).size,
      publicApiSurface.length,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.publicApiRegistry
        .derivedFromFreezeOnly,
      true,
    );
  });
});

describe("EX-3:9 consumer rules, compatibility, and summary", () => {
  it("declares sole consumer entry point and consumer rules", () => {
    assert.equal(
      executiveTimelineExperiencePublicIndex.soleConsumerEntryPoint,
      true,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.consumerRules.length,
      8,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.consumerRules[0]?.statement,
      "Public Index is the sole consumer entry point.",
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.consumerRules.some((rule) =>
        rule.statement === "Direct imports from Freeze are prohibited."
      ),
      true,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.consumerRules.some((rule) =>
        rule.statement === "Direct imports from Certification are prohibited."
      ),
      true,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.consumerRules.some((rule) =>
        rule.statement === "Direct imports from Platform are prohibited."
      ),
      true,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.consumerRules.some((rule) =>
        rule.statement === "Direct imports from Manifest are prohibited."
      ),
      true,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexSummary.soleConsumerEntryPoint,
      true,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexSummary.consumerEntryPoint,
      "executiveTimelineExperiencePublicIndex.ts",
    );
  });

  it("publishes immutable compatibility and metadata", () => {
    assert.equal(
      executiveTimelineExperiencePublicIndex.compatibility.semanticVersion,
      "1.0.0",
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.compatibility.releaseChannel,
      "stable",
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.compatibility.stability,
      "Stable",
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.compatibility
        .deterministicPublication,
      true,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexMetadata.upstreamFreezeIdentity,
      ExecutiveTimelineExperienceFreeze.identity.id,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexMetadata.authorizationReference,
      ExecutiveTimelineExperienceFreeze.authorization.authorizationReference,
    );
    assert.equal(
      Object.isFrozen(executiveTimelineExperiencePublicIndex),
      true,
    );
    assert.equal(Object.isFrozen(publicApiSurface), true);
    assert.equal(
      Object.isFrozen(executiveTimelineExperiencePublicIndexMetadata),
      true,
    );
  });

  it("publishes a deterministic summary", () => {
    assert.equal(
      executiveTimelineExperiencePublicIndexSummary.canonicalIdentity,
      publicIndexCanonicalId,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexSummary.namespace,
      publicIndexNamespace,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexSummary.releaseStatus,
      publicIndexStatus,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexSummary.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexSummary.upstreamDependency,
      "EX-3:8/ExecutiveTimelineExperienceFreeze",
    );
    assert.equal(
      executiveTimelineExperiencePublicIndexSummary.publicApiCount,
      publicApiCount,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.summary,
      executiveTimelineExperiencePublicIndexSummary,
    );
  });
});

describe("EX-3:9 dependency boundary and fail-closed import policy", () => {
  it("imports only the Freeze aggregate", () => {
    const source = readFileSync(
      join(HERE, "executiveTimelineExperiencePublicIndex.ts"),
      "utf8",
    );
    const imports = [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
      (match) => match[1],
    );
    assert.deepEqual(imports, ["./executiveTimelineExperienceFreeze.ts"]);
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
      executiveTimelineExperiencePublicIndex.upstream.freeze,
      ExecutiveTimelineExperienceFreeze,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.freezeOnlyDependency,
      true,
    );
    assert.equal(executiveTimelineExperiencePublicIndex.bypassesFreeze, false);
    assert.equal(
      executiveTimelineExperiencePublicIndex.runtimeMutation,
      false,
    );
    assert.equal(
      executiveTimelineExperiencePublicIndex.executesRuntimeLogic,
      false,
    );
  });
});
