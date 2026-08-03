/** EX-3:5 metadata-only Manifest verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveTimelineExperienceManifest,
  ExecutiveTimelineExperienceManifestApprovedAliases,
  ExecutiveTimelineExperienceManifestCapabilities,
  ExecutiveTimelineExperienceManifestDependencySummary,
  ExecutiveTimelineExperienceManifestId,
  ExecutiveTimelineExperienceManifestIdentity,
  ExecutiveTimelineExperienceManifestMetadata,
  ExecutiveTimelineExperienceManifestNamespace,
  ExecutiveTimelineExperienceManifestReadiness,
  ExecutiveTimelineExperienceManifestStatus,
  ExecutiveTimelineExperienceManifestSummaryValue,
  assertExecutiveTimelineExperienceManifestIdentity,
  getExecutiveTimelineExperienceManifestSummary,
  resolveExecutiveTimelineExperienceManifestIdentity,
} from "./executiveTimelineExperienceManifest.ts";
import { ExecutiveTimelineExperienceValidation } from "./executiveTimelineExperienceValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveTimelineExperienceManifest.ts",
  "executiveTimelineExperienceManifestTypes.ts",
  "executiveTimelineExperienceManifestIdentity.ts",
  "executiveTimelineExperienceManifestCapabilities.ts",
  "executiveTimelineExperienceManifestDependencies.ts",
  "executiveTimelineExperienceManifestMetadata.ts",
  "executiveTimelineExperienceManifestSummary.ts",
  "executiveTimelineExperienceManifest.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-3:5 package inventory and dependency", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperienceManifest(?:[A-Z].*)?(?:\.test)?\.ts$/.test(
        name,
      )
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Validation as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveTimelineExperienceManifest.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveTimelineExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Manifest"));
    assert.deepEqual(upstreamImports, [
      "./executiveTimelineExperienceValidation.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Foundation|Registry|Model)(?:[A-Z.]|\.ts)/i,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Platform|Certification|Freeze|PublicIndex)/i,
      );
      assert.doesNotMatch(source, /from ["'][^"']*(?:\/rtc\/|react|next)/i);
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
    }
  });

  it("does not authorize Platform from Manifest flags", () => {
    assert.equal(ExecutiveTimelineExperienceManifest.platformCreated, false);
    assert.equal(ExecutiveTimelineExperienceManifest.platformAuthorized, false);
    assert.equal(ExecutiveTimelineExperienceManifest.ex36Created, false);
  });
});

describe("EX-3:5 identity", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveTimelineExperienceManifestId,
      "EX-3:5/ExecutiveTimelineExperienceManifest",
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestNamespace,
      "nexora.ex.executive.timeline.experience.manifest",
    );
    assert.equal(ExecutiveTimelineExperienceManifestStatus, "Manifest");
    assert.equal(
      ExecutiveTimelineExperienceManifestReadiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestIdentity
        .readyForPlatformAuthorizesEx36,
      false,
    );
  });

  for (const value of [
    ExecutiveTimelineExperienceManifestId,
    ExecutiveTimelineExperienceManifestNamespace,
    ...ExecutiveTimelineExperienceManifestApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceManifestIdentity(value).ok,
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperienceManifestIdentity(value),
        ExecutiveTimelineExperienceManifestId,
      );
    });
  }

  for (const value of [null, "", " EX-3:5", "ex-3:5", "EX-3:6", "EX-3:4"]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceManifestIdentity(value).ok,
        false,
      );
      assert.throws(() =>
        assertExecutiveTimelineExperienceManifestIdentity(value)
      );
    });
  }
});

describe("EX-3:5 capabilities and dependencies", () => {
  it("publishes exactly sixteen immutable capabilities in order", () => {
    assert.equal(ExecutiveTimelineExperienceManifestCapabilities.length, 16);
    assert.deepEqual(
      ExecutiveTimelineExperienceManifestCapabilities.map(
        (capability) => capability.name,
      ),
      [
        "TimelineNavigation",
        "TimelinePositioning",
        "TimelinePlaybackMetadata",
        "TimelineHistoryMetadata",
        "TimelineSnapshotMetadata",
        "TimelineContextMetadata",
        "TimelineSynchronizationMetadata",
        "TimelineMarkerMetadata",
        "TimelineEventMetadata",
        "TimelineCursorMetadata",
        "TimelineViewportMetadata",
        "TimelineRelationshipMetadata",
        "TimelineSchemaMetadata",
        "TimelineValidationMetadata",
        "TimelineAggregatePublication",
        "TimelineConsumerPublication",
      ],
    );
    ExecutiveTimelineExperienceManifestCapabilities.forEach(
      (capability, index) => {
        assert.equal(capability.order, index + 1);
        assert.equal(capability.descriptiveOnly, true);
        assert.equal(capability.executable, false);
        assert.equal(Object.isFrozen(capability), true);
      },
    );
  });

  it("publishes immutable dependency summary through Validation only", () => {
    assert.equal(
      ExecutiveTimelineExperienceManifestDependencySummary.upstreamIdentity,
      ExecutiveTimelineExperienceValidation.identity.id,
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestDependencySummary.dependencyReadiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestDependencySummary.validationOnly,
      true,
    );
    assert.deepEqual(
      ExecutiveTimelineExperienceManifestDependencySummary.dependencyChain,
      [
        "EX-3:5/ExecutiveTimelineExperienceManifest",
        "EX-3:4/ExecutiveTimelineExperienceValidation",
        "EX-3:3/ExecutiveTimelineExperienceModel",
        "EX-3:2/ExecutiveTimelineExperienceRegistry",
        "EX-3:1/ExecutiveTimelineExperienceFoundation",
      ],
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestDependencySummary.dependencyCount,
      4,
    );
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperienceManifestDependencySummary),
      true,
    );
  });
});

describe("EX-3:5 metadata, summary, and aggregate", () => {
  it("publishes immutable metadata with upstream and authorization references", () => {
    assert.equal(
      ExecutiveTimelineExperienceManifestMetadata.manifestIdentity,
      ExecutiveTimelineExperienceManifestId,
    );
    assert.equal(ExecutiveTimelineExperienceManifestMetadata.capabilityCount, 16);
    assert.equal(ExecutiveTimelineExperienceManifestMetadata.dependencyCount, 4);
    assert.equal(
      ExecutiveTimelineExperienceManifestMetadata.upstreamReference,
      ExecutiveTimelineExperienceValidation.identity.id,
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestMetadata.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperienceManifestMetadata),
      true,
    );
  });

  it("publishes immutable summary and architectural summary", () => {
    assert.equal(
      getExecutiveTimelineExperienceManifestSummary(),
      ExecutiveTimelineExperienceManifestSummaryValue,
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestSummaryValue.capabilityCount,
      16,
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestSummaryValue.status,
      "Manifest",
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestSummaryValue.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestSummaryValue.upstreamDependency,
      "EX-3:4/ExecutiveTimelineExperienceValidation",
    );
    assert.equal(
      ExecutiveTimelineExperienceManifestSummaryValue.platformAuthorized,
      false,
    );
  });

  it("exposes the complete immutable aggregate", () => {
    assert.equal(Object.isFrozen(ExecutiveTimelineExperienceManifest), true);
    assert.equal(
      ExecutiveTimelineExperienceManifest.validation,
      ExecutiveTimelineExperienceValidation,
    );
    assert.equal(ExecutiveTimelineExperienceManifest.metadataOnly, true);
    assert.equal(ExecutiveTimelineExperienceManifest.playbackEngine, false);
    assert.equal(ExecutiveTimelineExperienceManifest.rtcIntegration, false);
    assert.equal(ExecutiveTimelineExperienceManifest.uiRendering, false);
  });
});
