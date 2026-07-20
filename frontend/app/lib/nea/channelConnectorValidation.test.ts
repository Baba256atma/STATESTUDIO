/**
 * NEA-2:4 — Channel Connectors Validation Tests.
 *
 * Deterministic coverage for the immutable Channel Connectors Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ChannelConnectorModelId,
  ChannelConnectorModelPlatform,
} from "./channelConnectorModel.ts";
import * as ValidationModule from "./channelConnectorValidation.ts";
import {
  ChannelConnectorValidationId,
  ChannelConnectorValidationName,
  ChannelConnectorValidationNamespace,
  ChannelConnectorValidationPlatform,
  ChannelConnectorValidationReadiness,
  ChannelConnectorValidationStatus,
  ChannelConnectorValidationVersion,
  getChannelConnectorValidationSummary,
} from "./channelConnectorValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA24_FILES = Object.freeze([
  "channelConnectorValidationTypes.ts",
  "channelConnectorValidationRules.ts",
  "channelConnectorValidationPolicies.ts",
  "channelConnectorValidationRelationships.ts",
  "channelConnectorValidationMetadata.ts",
  "channelConnectorValidationOwnership.ts",
  "channelConnectorValidation.ts",
  "channelConnectorValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorValidationId",
  "ChannelConnectorValidationVersion",
  "ChannelConnectorValidationName",
  "ChannelConnectorValidationNamespace",
  "ChannelConnectorValidationStatus",
  "ChannelConnectorValidationReadiness",
  "ChannelConnectorValidationPlatform",
  "getChannelConnectorValidationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "rules",
  "relationships",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "Identity",
  "Definition",
  "Family",
  "Type",
  "Protocol",
  "Direction",
  "Capability",
  "Authentication",
  "Health",
  "Status",
  "Event",
  "Payload",
  "Policy",
  "Endpoint",
  "Session",
  "Metadata",
  "Configuration",
  "Diagnostics",
  "Result",
  "Summary",
  "CrossModel",
  "PlatformIntegrity",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-2:4 Channel Connectors Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(NEA24_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA24_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical validation identity, status Validation, and ReadyForManifest", () => {
    assert.equal(
      ChannelConnectorValidationId,
      "NEA-2:4/ChannelConnectorValidation",
    );
    assert.equal(ChannelConnectorValidationVersion, "1.0.0");
    assert.equal(
      ChannelConnectorValidationName,
      "Channel Connectors Validation",
    );
    assert.equal(
      ChannelConnectorValidationNamespace,
      "nexora.nea.channel-connectors.validation",
    );
    assert.equal(ChannelConnectorValidationStatus, "Validation");
    assert.equal(ChannelConnectorValidationReadiness, "ReadyForManifest");
    assert.equal(ChannelConnectorValidationPlatform.identity.phase, "NEA-2:4");
    assert.equal(
      ChannelConnectorValidationPlatform.identity.modelId,
      ChannelConnectorModelId,
    );
    assert.equal(
      ChannelConnectorValidationPlatform.nextPhase,
      "NEA-2:5 — Channel Connectors Manifest",
    );
  });

  it("consumes only NEA-2:3 Model without duplicating Model values", () => {
    const dependency = ChannelConnectorValidationPlatform.dependency;
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "channelConnectorModel.ts",
    );
    assert.equal(dependency.modelId, ChannelConnectorModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      ChannelConnectorValidationPlatform.modelPlatform,
      ChannelConnectorModelPlatform,
    );
    assert.equal(
      ChannelConnectorValidationPlatform.rules.modelAnchors
        .duplicatesModelValues,
      false,
    );
    assert.equal(
      ChannelConnectorValidationPlatform.rules.modelAnchors.domainModelCount,
      ChannelConnectorModelPlatform.domainModels.modelCount,
    );
  });

  it("declares twenty-two categories and unique validation rules", () => {
    const categories = ChannelConnectorValidationPlatform.categories;
    assert.equal(categories.length, 22);
    assert.deepEqual(
      categories.map((item) => item.categoryId),
      [...EXPECTED_CATEGORIES],
    );
    assert.ok(
      categories.every((item) => item.executesValidation === false),
    );

    const rules = ChannelConnectorValidationPlatform.rules.rules;
    assert.equal(ChannelConnectorValidationPlatform.rules.ruleCount, 48);
    assertUnique(
      rules.map((item) => item.ruleId),
      "rule ids",
    );
    assert.ok(rules.every((item) => item.executesValidation === false));
    assert.ok(
      rules.every((item) =>
        item.modelReference.startsWith(`${ChannelConnectorModelId}/`),
      ),
    );
  });

  it("declares validation relationships covering required cross-model pairs", () => {
    const relationships =
      ChannelConnectorValidationPlatform.relationships.relationships;
    assert.equal(
      ChannelConnectorValidationPlatform.relationships.relationshipCount,
      25,
    );
    assertUnique(
      relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    const names = relationships.map((item) => item.relationshipName);
    assert.ok(names.includes("Definition depends on Identity"));
    assert.ok(names.includes("Identity depends on Protocol"));
    assert.ok(names.includes("Endpoint depends on Protocol"));
    assert.ok(names.includes("Configuration depends on Authentication"));
    assert.ok(names.includes("Result depends on Diagnostics"));
    assert.ok(names.includes("Summary depends on Definition"));
    assert.ok(
      relationships.every((item) => item.executesValidation === false),
    );
  });

  it("declares policies and ownership without validation engine or connectors", () => {
    const { policies, ownership, boundaries } =
      ChannelConnectorValidationPlatform;
    assert.equal(policies.policyCount, 8);
    assert.equal(policies.executesPolicies, false);
    assert.ok(ownership.owns.includes("Validation Rules"));
    assert.ok(ownership.owns.includes("Validation Categories"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Validation"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.ok(ownership.doesNotOwn.includes("OAuth"));
    assert.equal(ownership.ownsValidationEngine, false);
    assert.equal(ownership.ownsRuntimeValidation, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth Flow"));
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.duplicatesModelValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ChannelConnectorValidationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 10), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 10);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.categories), true);
    assert.equal(Object.isFrozen(platform.rules), true);
    assert.equal(Object.isFrozen(platform.rules.rules), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
  });

  it("derives deterministic summary from canonical collections", () => {
    const summaryA = getChannelConnectorValidationSummary();
    const summaryB = getChannelConnectorValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, ChannelConnectorValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.modelId, ChannelConnectorModelId);
    assert.equal(summaryA.categoryCount, 22);
    assert.equal(summaryA.ruleCount, 48);
    assert.equal(summaryA.relationshipCount, 25);
    assert.equal(summaryA.policyCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-2:5 — Channel Connectors Manifest",
    );
    assert.equal(
      ChannelConnectorValidationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ChannelConnectorValidationPlatform.metadata.duplicatesModelValues,
      false,
    );
    assert.equal(
      ChannelConnectorValidationPlatform.readiness.claimsReadyForManifest,
      true,
    );
    assert.equal(ChannelConnectorValidationPlatform.runtimeBehavior, false);
    assert.equal(ChannelConnectorValidationPlatform.validationEngine, false);
    assert.equal(ChannelConnectorValidationPlatform.runtimeValidation, false);
    assert.equal(ChannelConnectorValidationPlatform.implementsConnectors, false);
    assert.equal(ChannelConnectorValidationPlatform.oauthFlow, false);
  });
});
