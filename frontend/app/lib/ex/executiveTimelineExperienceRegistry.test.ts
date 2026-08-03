/** EX-3:2 metadata-only Registry verification. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveTimelineExperienceRegistry,
  ExecutiveTimelineExperienceRegistryAllEntries,
  ExecutiveTimelineExperienceRegistryApprovedAliases,
  ExecutiveTimelineExperienceRegistryCatalogues,
  ExecutiveTimelineExperienceRegistryId,
  ExecutiveTimelineExperienceRegistryIdentity,
  ExecutiveTimelineExperienceRegistryManifest,
  ExecutiveTimelineExperienceRegistryNamespace,
  ExecutiveTimelineExperienceRegistryReadiness,
  ExecutiveTimelineExperienceRegistryStatus,
  ExecutiveTimelineExperienceRegistrySummaryValue,
  ExecutiveTimelineExperienceRegistryValidation,
  ExecutiveTimelineExperienceRegistryValidationRules,
  assertExecutiveTimelineExperienceRegistryIdentity,
  getExecutiveTimelineExperienceRegistrySummary,
  lookupExecutiveTimelineExperienceRegistryEntry,
  resolveExecutiveTimelineExperienceRegistryIdentity,
} from "./executiveTimelineExperienceRegistry.ts";
import { ExecutiveTimelineExperienceFoundation } from "./executiveTimelineExperienceFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = Object.freeze([
  "executiveTimelineExperienceRegistry.ts",
  "executiveTimelineExperienceRegistryTypes.ts",
  "executiveTimelineExperienceRegistryIdentity.ts",
  "executiveTimelineExperienceRegistryCatalogues.ts",
  "executiveTimelineExperienceRegistryValidation.ts",
  "executiveTimelineExperienceRegistryMetadata.ts",
  "executiveTimelineExperienceRegistryManifest.ts",
  "executiveTimelineExperienceRegistry.test.ts",
] as const);
const productionFiles = FILES.filter((file) => !file.endsWith(".test.ts"));

describe("EX-3:2 package inventory and dependency", () => {
  it("contains exactly the eight authorized files", () => {
    const found = readdirSync(HERE).filter((name) =>
      /^executiveTimelineExperienceRegistry(?:[A-Z].*)?(?:\.test)?\.ts$/
        .test(name)
    ).sort();
    assert.deepEqual(found, [...FILES].sort());
  });

  it("has Foundation as its only upstream runtime dependency", () => {
    const aggregate = readFileSync(
      join(HERE, "executiveTimelineExperienceRegistry.ts"),
      "utf8",
    );
    const upstreamImports = [...aggregate.matchAll(
      /from "(\.\/executiveTimelineExperience[^"]+)"/g,
    )]
      .map((match) => match[1])
      .filter((path) => !path.includes("Registry"));
    assert.deepEqual(upstreamImports, [
      "./executiveTimelineExperienceFoundation.ts",
    ]);
    for (const file of productionFiles) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from ["'][^"']*executiveTimelineExperience(?:Model|Platform)(?:[A-Z.]|\.ts)/i,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*(?:\/rtc\/|react|next)/i,
      );
      assert.doesNotMatch(source, /import\([^)]|require\s*\(/);
      assert.doesNotMatch(
        source,
        /\b(fetch|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random)\s*\(/,
      );
    }
  });

  it("does not authorize Model from Registry flags", () => {
    assert.equal(ExecutiveTimelineExperienceRegistry.modelCreated, false);
    assert.equal(ExecutiveTimelineExperienceRegistry.modelAuthorized, false);
    assert.equal(ExecutiveTimelineExperienceRegistry.ex33Created, false);
  });
});

describe("EX-3:2 identity", () => {
  it("publishes exact identity, status, and readiness", () => {
    assert.equal(
      ExecutiveTimelineExperienceRegistryId,
      "EX-3:2/ExecutiveTimelineExperienceRegistry",
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistryNamespace,
      "nexora.ex.executive.timeline.experience.registry",
    );
    assert.equal(ExecutiveTimelineExperienceRegistryStatus, "Registry");
    assert.equal(
      ExecutiveTimelineExperienceRegistryReadiness,
      "ReadyForModel",
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistryIdentity.readyForModelAuthorizesEx33,
      false,
    );
  });

  for (const value of [
    ExecutiveTimelineExperienceRegistryId,
    ExecutiveTimelineExperienceRegistryNamespace,
    ...ExecutiveTimelineExperienceRegistryApprovedAliases,
  ]) {
    it(`resolves identity value ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceRegistryIdentity(value).ok,
        true,
      );
      assert.equal(
        assertExecutiveTimelineExperienceRegistryIdentity(value),
        ExecutiveTimelineExperienceRegistryId,
      );
    });
  }

  for (const value of [null, "", " EX-3:2", "ex-3:2", "EX-3:3", "EX-3:1"]) {
    it(`fail-closed rejects identity ${String(value)}`, () => {
      assert.equal(
        resolveExecutiveTimelineExperienceRegistryIdentity(value).ok,
        false,
      );
      assert.throws(() =>
        assertExecutiveTimelineExperienceRegistryIdentity(value)
      );
    });
  }
});

describe("EX-3:2 catalogues and validation", () => {
  it("publishes eight immutable catalogues with exact counts", () => {
    assert.equal(ExecutiveTimelineExperienceRegistryCatalogues.length, 8);
    assert.deepEqual(
      ExecutiveTimelineExperienceRegistryCatalogues.map((catalogue) => [
        catalogue.kind,
        catalogue.entryCount,
      ]),
      [
        ["EventTypes", 12],
        ["NavigationModes", 8],
        ["MarkerTypes", 10],
        ["PlaybackStates", 6],
        ["SynchronizationModes", 6],
        ["ViewModes", 8],
        ["InteractionTypes", 10],
        ["ReadinessStates", 5],
      ],
    );
    assert.equal(ExecutiveTimelineExperienceRegistryAllEntries.length, 65);
    assert.equal(
      ExecutiveTimelineExperienceRegistryCatalogues.every(
        (catalogue, index) =>
          catalogue.order === index + 1
          && Object.isFrozen(catalogue)
          && Object.isFrozen(catalogue.entries),
      ),
      true,
    );
  });

  it("publishes exactly ten passing validation rules", () => {
    assert.equal(ExecutiveTimelineExperienceRegistryValidationRules.length, 10);
    assert.equal(ExecutiveTimelineExperienceRegistryValidation.ruleCount, 10);
    assert.equal(ExecutiveTimelineExperienceRegistryValidation.allPassed, true);
    assert.equal(
      ExecutiveTimelineExperienceRegistryValidationRules.every(
        (rule, index) =>
          rule.order === index + 1
          && rule.result === "Pass"
          && rule.failClosed === true
          && Object.isFrozen(rule),
      ),
      true,
    );
  });

  it("supports fail-closed deterministic lookup", () => {
    const found = lookupExecutiveTimelineExperienceRegistryEntry(
      "WorkspaceChanged",
    );
    assert.notEqual(found, null);
    assert.equal(found?.name, "WorkspaceChanged");
    assert.equal(lookupExecutiveTimelineExperienceRegistryEntry(null), null);
    assert.equal(lookupExecutiveTimelineExperienceRegistryEntry(""), null);
    assert.equal(
      lookupExecutiveTimelineExperienceRegistryEntry(" workspacechanged "),
      null,
    );
    assert.equal(
      lookupExecutiveTimelineExperienceRegistryEntry("NotARealEntry"),
      null,
    );
  });
});

describe("EX-3:2 manifest, aggregate, and summary", () => {
  it("publishes immutable manifest with exact dependency and counts", () => {
    assert.equal(
      ExecutiveTimelineExperienceRegistryManifest.registryIdentity,
      ExecutiveTimelineExperienceRegistryId,
    );
    assert.equal(ExecutiveTimelineExperienceRegistryManifest.catalogueCount, 8);
    assert.equal(
      ExecutiveTimelineExperienceRegistryManifest.totalRegisteredEntries,
      65,
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistryManifest.validationRuleCount,
      10,
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistryManifest.dependency.foundation,
      ExecutiveTimelineExperienceFoundation,
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistryManifest.dependency
        .foundationReadiness,
      "ReadyForRegistry",
    );
    assert.equal(Object.isFrozen(ExecutiveTimelineExperienceRegistryManifest), true);
  });

  it("exposes the complete immutable aggregate", () => {
    assert.equal(Object.isFrozen(ExecutiveTimelineExperienceRegistry), true);
    assert.equal(
      ExecutiveTimelineExperienceRegistry.foundation,
      ExecutiveTimelineExperienceFoundation,
    );
    assert.equal(ExecutiveTimelineExperienceRegistry.metadataOnly, true);
    assert.equal(ExecutiveTimelineExperienceRegistry.rtcIntegration, false);
    assert.equal(ExecutiveTimelineExperienceRegistry.uiRendering, false);
  });

  it("publishes deterministic safe summary counts", () => {
    assert.equal(
      getExecutiveTimelineExperienceRegistrySummary(),
      ExecutiveTimelineExperienceRegistrySummaryValue,
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistrySummaryValue.catalogueCount,
      8,
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistrySummaryValue.totalRegisteredEntries,
      65,
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistrySummaryValue.validationRuleCount,
      10,
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistrySummaryValue.status,
      "Registry",
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistrySummaryValue.readiness,
      "ReadyForModel",
    );
    assert.equal(
      ExecutiveTimelineExperienceRegistrySummaryValue.modelAuthorized,
      false,
    );
  });
});
