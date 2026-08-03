/** EX-3:3 metadata-only Model verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveTimelineExperienceModel,
  ExecutiveTimelineExperienceModelApprovedAliases,
  ExecutiveTimelineExperienceModelEntities,
  ExecutiveTimelineExperienceModelId,
  ExecutiveTimelineExperienceModelIdentity,
  ExecutiveTimelineExperienceModelManifest,
  ExecutiveTimelineExperienceModelNamespace,
  ExecutiveTimelineExperienceModelReadiness,
  ExecutiveTimelineExperienceModelRelationships,
  ExecutiveTimelineExperienceModelSchemas,
  ExecutiveTimelineExperienceModelStatus,
  ExecutiveTimelineExperienceModelSummaryValue,
  ExecutiveTimelineExperienceModelValidationMetadata,
  assertExecutiveTimelineExperienceModelIdentity,
  getExecutiveTimelineExperienceModelSummary,
  resolveExecutiveTimelineExperienceModelIdentity,
} from "./executiveTimelineExperienceModel.ts";
import { ExecutiveTimelineExperienceRegistry } from "./executiveTimelineExperienceRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveTimelineExperienceModel.ts",
  "executiveTimelineExperienceModelTypes.ts",
  "executiveTimelineExperienceModelIdentity.ts",
  "executiveTimelineExperienceModelRelationships.ts",
  "executiveTimelineExperienceModelSchemas.ts",
  "executiveTimelineExperienceModelMetadata.ts",
  "executiveTimelineExperienceModelManifest.ts",
  "executiveTimelineExperienceModel.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-3:3 package inventory and dependency", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperienceModel(?:[A-Z].*)?(?:\.test)?\.ts$/.test(name)
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Registry as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveTimelineExperienceModel.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveTimelineExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Model"));
    assert.deepEqual(upstreamImports, [
      "./executiveTimelineExperienceRegistry.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Foundation|Validation|Platform)(?:[A-Z.]|\.ts)/i,
      );
      assert.doesNotMatch(source, /from ["'][^"']*(?:\/rtc\/|react|next)/i);
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
    }
  });

  it("does not authorize Validation from Model flags", () => {
    assert.equal(ExecutiveTimelineExperienceModel.validationCreated, false);
    assert.equal(ExecutiveTimelineExperienceModel.validationAuthorized, false);
    assert.equal(ExecutiveTimelineExperienceModel.ex34Created, false);
  });
});

describe("EX-3:3 identity", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveTimelineExperienceModelId,
      "EX-3:3/ExecutiveTimelineExperienceModel",
    );
    assert.equal(
      ExecutiveTimelineExperienceModelNamespace,
      "nexora.ex.executive.timeline.experience.model",
    );
    assert.equal(ExecutiveTimelineExperienceModelStatus, "Model");
    assert.equal(
      ExecutiveTimelineExperienceModelReadiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveTimelineExperienceModelIdentity
        .readyForValidationAuthorizesEx34,
      false,
    );
  });

  for (const value of [
    ExecutiveTimelineExperienceModelId,
    ExecutiveTimelineExperienceModelNamespace,
    ...ExecutiveTimelineExperienceModelApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceModelIdentity(value).ok,
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperienceModelIdentity(value),
        ExecutiveTimelineExperienceModelId,
      );
    });
  }

  for (const value of [null, "", " EX-3:3", "ex-3:3", "EX-3:4", "EX-3:2"]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceModelIdentity(value).ok,
        false,
      );
      assert.throws(() =>
        assertExecutiveTimelineExperienceModelIdentity(value)
      );
    });
  }
});

describe("EX-3:3 entities, relationships, and schemas", () => {
  it("publishes exactly twelve immutable entities in order", () => {
    assert.equal(ExecutiveTimelineExperienceModelEntities.length, 12);
    ExecutiveTimelineExperienceModelEntities.forEach((entity, index) => {
      assert.equal(entity.order, index + 1);
      assert.equal(entity.executable, false);
      assert.equal(entity.metadataOnly, true);
      assert.equal(Object.isFrozen(entity), true);
    });
    assert.deepEqual(
      ExecutiveTimelineExperienceModelEntities.map((entity) => entity.name),
      [
        "Timeline",
        "TimelineEvent",
        "TimelineMarker",
        "TimelineSegment",
        "TimelinePlayback",
        "TimelineCursor",
        "TimelineViewport",
        "TimelineSnapshot",
        "TimelineNavigation",
        "TimelineSynchronization",
        "TimelineHistory",
        "TimelineContext",
      ],
    );
  });

  it("publishes exactly eighteen immutable relationships in order", () => {
    assert.equal(ExecutiveTimelineExperienceModelRelationships.length, 18);
    assert.equal(
      ExecutiveTimelineExperienceModelRelationships.every(
        (relationship, index) =>
          relationship.order === index + 1
          && relationship.descriptiveOnly === true
          && Object.isFrozen(relationship),
      ),
      true,
    );
  });

  it("publishes exactly ten immutable schemas in order", () => {
    assert.equal(ExecutiveTimelineExperienceModelSchemas.length, 10);
    assert.deepEqual(
      ExecutiveTimelineExperienceModelSchemas.map((schema) => schema.kind),
      [
        "Identity",
        "Structure",
        "Lifecycle",
        "Navigation",
        "Playback",
        "Synchronization",
        "Viewport",
        "History",
        "Snapshot",
        "Context",
      ],
    );
    assert.equal(
      ExecutiveTimelineExperienceModelSchemas.every(
        (schema, index) =>
          schema.order === index + 1 && Object.isFrozen(schema),
      ),
      true,
    );
  });
});

describe("EX-3:3 manifest, aggregate, and summary", () => {
  it("publishes immutable manifest with registry dependency and counts", () => {
    assert.equal(
      ExecutiveTimelineExperienceModelManifest.modelIdentity,
      ExecutiveTimelineExperienceModelId,
    );
    assert.equal(ExecutiveTimelineExperienceModelManifest.entityCount, 12);
    assert.equal(
      ExecutiveTimelineExperienceModelManifest.relationshipCount,
      18,
    );
    assert.equal(ExecutiveTimelineExperienceModelManifest.schemaCount, 10);
    assert.equal(
      ExecutiveTimelineExperienceModelManifest.dependency.registry,
      ExecutiveTimelineExperienceRegistry,
    );
    assert.equal(
      ExecutiveTimelineExperienceModelManifest.dependency.registryReadiness,
      "ReadyForModel",
    );
    assert.equal(
      ExecutiveTimelineExperienceModelValidationMetadata
        .validationEngineImplemented,
      false,
    );
    assert.equal(Object.isFrozen(ExecutiveTimelineExperienceModelManifest), true);
  });

  it("exposes the complete immutable aggregate", () => {
    assert.equal(Object.isFrozen(ExecutiveTimelineExperienceModel), true);
    assert.equal(
      ExecutiveTimelineExperienceModel.registry,
      ExecutiveTimelineExperienceRegistry,
    );
    assert.equal(ExecutiveTimelineExperienceModel.metadataOnly, true);
    assert.equal(ExecutiveTimelineExperienceModel.playbackEngine, false);
    assert.equal(ExecutiveTimelineExperienceModel.rtcIntegration, false);
    assert.equal(ExecutiveTimelineExperienceModel.uiRendering, false);
  });

  it("publishes deterministic safe summary counts", () => {
    assert.equal(
      getExecutiveTimelineExperienceModelSummary(),
      ExecutiveTimelineExperienceModelSummaryValue,
    );
    assert.equal(ExecutiveTimelineExperienceModelSummaryValue.entityCount, 12);
    assert.equal(
      ExecutiveTimelineExperienceModelSummaryValue.relationshipCount,
      18,
    );
    assert.equal(ExecutiveTimelineExperienceModelSummaryValue.schemaCount, 10);
    assert.equal(ExecutiveTimelineExperienceModelSummaryValue.status, "Model");
    assert.equal(
      ExecutiveTimelineExperienceModelSummaryValue.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveTimelineExperienceModelSummaryValue.validationAuthorized,
      false,
    );
  });
});
