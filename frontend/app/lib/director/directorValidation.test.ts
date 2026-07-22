import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicValidation from "./directorValidation.ts";
import {
  DirectorValidationMetadata,
  DirectorValidationReadiness,
  DirectorValidationRegistry,
  DirectorValidationSummary,
} from "./directorValidation.ts";

const FILES = Object.freeze([
  "directorValidationTypes.ts", "directorValidationRules.ts",
  "directorValidationCategories.ts", "directorValidationPolicies.ts",
  "directorValidationRegistry.ts", "directorValidation.ts",
  "directorValidationMetadata.ts", "directorValidation.test.ts",
]);

describe("DIRECTOR-1:4 Director Validation", () => {
  it("has canonical validation identity and readiness", () => {
    assert.equal(DirectorValidationMetadata.id, "DIRECTOR-1:4/DirectorValidation");
    assert.equal(DirectorValidationMetadata.validationVersion, "1.0.0");
    assert.equal(DirectorValidationMetadata.namespace, "nexora.director.validation");
    assert.equal(DirectorValidationMetadata.layer, "Director");
    assert.equal(DirectorValidationMetadata.status, "Validation");
    assert.equal(DirectorValidationReadiness, "ReadyForManifest");
  });

  it("adds exactly eight Validation files and four public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.deepEqual(Object.keys(PublicValidation).sort(), [
      "DirectorValidationMetadata", "DirectorValidationReadiness",
      "DirectorValidationRegistry", "DirectorValidationSummary",
    ]);
  });

  it("publishes canonical immutable categories, rules, and policies", () => {
    assert.equal(DirectorValidationRegistry.categories.length, 10);
    assert.ok(DirectorValidationRegistry.rules.length >= 30);
    assert.equal(DirectorValidationRegistry.policies.length, 8);
    for (const collection of [DirectorValidationRegistry.categories, DirectorValidationRegistry.rules, DirectorValidationRegistry.policies]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry) => Object.isFrozen(entry)));
    }
  });

  it("derives inventory counts and preserves deterministic uniqueness", () => {
    assert.equal(DirectorValidationMetadata.validationCategoryCount, DirectorValidationRegistry.categories.length);
    assert.equal(DirectorValidationMetadata.validationRuleCount, DirectorValidationRegistry.rules.length);
    assert.equal(DirectorValidationMetadata.policyCount, DirectorValidationRegistry.policies.length);
    assert.equal(DirectorValidationMetadata.countsDerivedFromCanonicalCollections, true);
    for (const collection of [DirectorValidationRegistry.categories, DirectorValidationRegistry.rules, DirectorValidationRegistry.policies]) {
      assert.equal(new Set(collection.map(({ id }) => id)).size, collection.length);
      assert.ok(collection.every((entry, index) => entry.deterministicOrder === index + 1));
    }
  });

  it("depends only on Model and declares prohibited boundaries", () => {
    assert.equal(DirectorValidationRegistry.modelReference, "DIRECTOR-1:3/DirectorModel");
    assert.equal(DirectorValidationRegistry.dependency.modelOnly, true);
    assert.equal(DirectorValidationRegistry.dependency.importsEve, false);
    assert.equal(DirectorValidationRegistry.dependency.importsUi, false);
    assert.equal(DirectorValidationRegistry.dependency.importsRenderingSystems, false);
    assert.equal(DirectorValidationRegistry.runtimeValidator, false);
    assert.equal(DirectorValidationRegistry.execution, false);
  });

  it("has no prohibited external imports and keeps exports immutable", () => {
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["'](?:react|three|@react|babylon|eve)/i);
    }
    assert.ok(Object.isFrozen(DirectorValidationRegistry));
    assert.ok(Object.isFrozen(DirectorValidationMetadata));
    assert.ok(Object.isFrozen(DirectorValidationSummary));
  });
});
