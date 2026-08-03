/** EX-3:4 metadata-only Validation verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveTimelineExperienceValidation,
  ExecutiveTimelineExperienceValidationApprovedAliases,
  ExecutiveTimelineExperienceValidationCategories,
  ExecutiveTimelineExperienceValidationEvidence,
  ExecutiveTimelineExperienceValidationId,
  ExecutiveTimelineExperienceValidationIdentity,
  ExecutiveTimelineExperienceValidationManifest,
  ExecutiveTimelineExperienceValidationMetadata,
  ExecutiveTimelineExperienceValidationNamespace,
  ExecutiveTimelineExperienceValidationReadiness,
  ExecutiveTimelineExperienceValidationRules,
  ExecutiveTimelineExperienceValidationStatus,
  ExecutiveTimelineExperienceValidationSummaryValue,
  assertExecutiveTimelineExperienceValidationIdentity,
  getExecutiveTimelineExperienceValidationSummary,
  resolveExecutiveTimelineExperienceValidationIdentity,
} from "./executiveTimelineExperienceValidation.ts";
import { ExecutiveTimelineExperienceModel } from "./executiveTimelineExperienceModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveTimelineExperienceValidation.ts",
  "executiveTimelineExperienceValidationTypes.ts",
  "executiveTimelineExperienceValidationIdentity.ts",
  "executiveTimelineExperienceValidationRules.ts",
  "executiveTimelineExperienceValidationEvidence.ts",
  "executiveTimelineExperienceValidationMetadata.ts",
  "executiveTimelineExperienceValidationManifest.ts",
  "executiveTimelineExperienceValidation.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-3:4 package inventory and dependency", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperienceValidation(?:[A-Z].*)?(?:\.test)?\.ts$/.test(
        name,
      )
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Model as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveTimelineExperienceValidation.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveTimelineExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Validation"));
    assert.deepEqual(upstreamImports, [
      "./executiveTimelineExperienceModel.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Foundation|Registry|Manifest|Platform)(?:[A-Z.]|\.ts)/i,
      );
      assert.doesNotMatch(source, /from ["'][^"']*(?:\/rtc\/|react|next)/i);
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
    }
  });

  it("does not authorize Manifest from Validation flags", () => {
    assert.equal(ExecutiveTimelineExperienceValidation.manifestCreated, false);
    assert.equal(
      ExecutiveTimelineExperienceValidation.manifestAuthorized,
      false,
    );
    assert.equal(ExecutiveTimelineExperienceValidation.ex35Created, false);
  });
});

describe("EX-3:4 identity", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveTimelineExperienceValidationId,
      "EX-3:4/ExecutiveTimelineExperienceValidation",
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationNamespace,
      "nexora.ex.executive.timeline.experience.validation",
    );
    assert.equal(ExecutiveTimelineExperienceValidationStatus, "Validation");
    assert.equal(
      ExecutiveTimelineExperienceValidationReadiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationIdentity
        .readyForManifestAuthorizesEx35,
      false,
    );
  });

  for (const value of [
    ExecutiveTimelineExperienceValidationId,
    ExecutiveTimelineExperienceValidationNamespace,
    ...ExecutiveTimelineExperienceValidationApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceValidationIdentity(value).ok,
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperienceValidationIdentity(value),
        ExecutiveTimelineExperienceValidationId,
      );
    });
  }

  for (const value of [null, "", " EX-3:4", "ex-3:4", "EX-3:5", "EX-3:3"]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceValidationIdentity(value).ok,
        false,
      );
      assert.throws(() =>
        assertExecutiveTimelineExperienceValidationIdentity(value)
      );
    });
  }
});

describe("EX-3:4 categories and rules", () => {
  it("publishes exactly twelve immutable categories in order", () => {
    assert.equal(ExecutiveTimelineExperienceValidationCategories.length, 12);
    assert.deepEqual(
      ExecutiveTimelineExperienceValidationCategories.map(
        (category) => category.name,
      ),
      [
        "IdentityIntegrity",
        "NamespaceIntegrity",
        "EntityIntegrity",
        "RelationshipIntegrity",
        "SchemaIntegrity",
        "MetadataIntegrity",
        "ManifestIntegrity",
        "DependencyIntegrity",
        "DeterministicOrdering",
        "ReadinessIntegrity",
        "ArchitecturalBoundaryIntegrity",
        "AggregateConsistency",
      ],
    );
    ExecutiveTimelineExperienceValidationCategories.forEach(
      (category, index) => {
        assert.equal(category.order, index + 1);
        assert.equal(category.ruleCount, 3);
        assert.equal(category.metadataOnly, true);
        assert.equal(Object.isFrozen(category), true);
      },
    );
  });

  it("publishes exactly thirty-six immutable descriptive rules in order", () => {
    assert.equal(ExecutiveTimelineExperienceValidationRules.length, 36);
    assert.equal(
      ExecutiveTimelineExperienceValidationRules.every(
        (rule, index) =>
          rule.order === index + 1
          && rule.descriptiveOnly === true
          && rule.executable === false
          && rule.result === "Pass"
          && Object.isFrozen(rule),
      ),
      true,
    );
    const ruleIds = ExecutiveTimelineExperienceValidationRules.map(
      (rule) => rule.ruleId,
    );
    assert.equal(new Set(ruleIds).size, 36);
  });
});

describe("EX-3:4 evidence, metadata, manifest, and aggregate", () => {
  it("publishes immutable read-only evidence", () => {
    assert.equal(
      ExecutiveTimelineExperienceValidationEvidence.modelIdentity,
      ExecutiveTimelineExperienceModel.identity.id,
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationEvidence.registryIdentity,
      ExecutiveTimelineExperienceModel.registry.identity.id,
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationEvidence.foundationIdentity,
      ExecutiveTimelineExperienceModel.registry.foundation.identity.id,
    );
    assert.equal(ExecutiveTimelineExperienceValidationEvidence.entityCount, 12);
    assert.equal(
      ExecutiveTimelineExperienceValidationEvidence.relationshipCount,
      18,
    );
    assert.equal(ExecutiveTimelineExperienceValidationEvidence.schemaCount, 10);
    assert.equal(
      ExecutiveTimelineExperienceValidationEvidence.validationVersion,
      "1.0.0",
    );
    assert.equal(ExecutiveTimelineExperienceValidationEvidence.readOnly, true);
    assert.equal(
      ExecutiveTimelineExperienceValidationEvidence.validationEngineInvoked,
      false,
    );
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperienceValidationEvidence),
      true,
    );
  });

  it("publishes immutable metadata with upstream reference", () => {
    assert.equal(
      ExecutiveTimelineExperienceValidationMetadata.validationIdentity,
      ExecutiveTimelineExperienceValidationId,
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationMetadata.namespace,
      ExecutiveTimelineExperienceValidationNamespace,
    );
    assert.equal(ExecutiveTimelineExperienceValidationMetadata.ruleCount, 36);
    assert.equal(
      ExecutiveTimelineExperienceValidationMetadata.categoryCount,
      12,
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationMetadata.upstreamReference,
      ExecutiveTimelineExperienceModel.identity.id,
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationMetadata.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperienceValidationMetadata),
      true,
    );
  });

  it("publishes immutable manifest with model dependency and counts", () => {
    assert.equal(
      ExecutiveTimelineExperienceValidationManifest.validationIdentity,
      ExecutiveTimelineExperienceValidationId,
    );
    assert.equal(ExecutiveTimelineExperienceValidationManifest.ruleCount, 36);
    assert.equal(
      ExecutiveTimelineExperienceValidationManifest.categoryCount,
      12,
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationManifest.upstreamDependency,
      "EX-3:3/ExecutiveTimelineExperienceModel",
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationManifest.dependency.model,
      ExecutiveTimelineExperienceModel,
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationManifest.dependency.modelReadiness,
      "ReadyForValidation",
    );
    assert.equal(
      Object.isFrozen(ExecutiveTimelineExperienceValidationManifest),
      true,
    );
  });

  it("exposes the complete immutable aggregate", () => {
    assert.equal(Object.isFrozen(ExecutiveTimelineExperienceValidation), true);
    assert.equal(
      ExecutiveTimelineExperienceValidation.model,
      ExecutiveTimelineExperienceModel,
    );
    assert.equal(ExecutiveTimelineExperienceValidation.metadataOnly, true);
    assert.equal(ExecutiveTimelineExperienceValidation.validationEngine, false);
    assert.equal(ExecutiveTimelineExperienceValidation.executableRules, false);
    assert.equal(ExecutiveTimelineExperienceValidation.playbackEngine, false);
    assert.equal(ExecutiveTimelineExperienceValidation.rtcIntegration, false);
    assert.equal(ExecutiveTimelineExperienceValidation.uiRendering, false);
  });

  it("publishes deterministic safe summary counts", () => {
    assert.equal(
      getExecutiveTimelineExperienceValidationSummary(),
      ExecutiveTimelineExperienceValidationSummaryValue,
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationSummaryValue.categoryCount,
      12,
    );
    assert.equal(ExecutiveTimelineExperienceValidationSummaryValue.ruleCount, 36);
    assert.equal(
      ExecutiveTimelineExperienceValidationSummaryValue.status,
      "Validation",
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationSummaryValue.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveTimelineExperienceValidationSummaryValue.manifestAuthorized,
      false,
    );
  });
});
