/**
 * EIL-1:3 — Integration Model Tests.
 *
 * Deterministic coverage for the immutable Integration Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationRegistryIdentity,
  IntegrationRegistryPlatform,
} from "./integrationRegistry.ts";
import * as ModelModule from "./integrationModel.ts";
import {
  IntegrationDomainModels,
  IntegrationLifecycleModels,
  IntegrationModelCollections,
  IntegrationModelIdentity,
  IntegrationModelPlatform,
  IntegrationModelSummary,
  IntegrationRelationshipModels,
  IntegrationTopologyModels,
} from "./integrationModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL13_FILES = Object.freeze([
  "integrationModelTypes.ts",
  "integrationModelIdentity.ts",
  "integrationDomainModels.ts",
  "integrationRelationshipModels.ts",
  "integrationTopologyModels.ts",
  "integrationLifecycleModels.ts",
  "integrationModel.ts",
  "integrationModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationModelIdentity",
  "IntegrationDomainModels",
  "IntegrationRelationshipModels",
  "IntegrationTopologyModels",
  "IntegrationLifecycleModels",
  "IntegrationModelCollections",
  "IntegrationModelSummary",
  "IntegrationModelPlatform",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Declared",
  "Designed",
  "Verified",
  "Certified",
  "Frozen",
  "Released",
  "Deprecated",
  "Retired",
] as const);

const REQUIRED_RELATIONSHIP_PAIRS = Object.freeze([
  ["IntegrationPlatform", "IntegrationContract"],
  ["IntegrationPlatform", "IntegrationCapability"],
  ["IntegrationPlatform", "IntegrationResponsibility"],
  ["IntegrationParticipant", "IntegrationContract"],
  ["IntegrationParticipant", "IntegrationCapability"],
  ["IntegrationParticipant", "IntegrationLifecycle"],
  ["IntegrationDomain", "IntegrationTopology"],
  ["IntegrationDomain", "IntegrationBoundary"],
  ["IntegrationDomain", "IntegrationDependency"],
  ["IntegrationDomain", "IntegrationCompatibility"],
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationRegistry(?!\.ts["'])/,
  /from ["']\.\/integration(Registry|Foundation)(Types|Identity|Contracts|Capabilities|Responsibilities|Lifecycle|TypeRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry)\.ts["']/,
  /from ["']\.\/integrationFoundation\.ts["']/,
  /from ["']\.\.\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertAscending = (ordinals: readonly number[], label: string): void => {
  assert.deepEqual(
    ordinals,
    [...ordinals].sort((a, b) => a - b),
    `${label} ordinals must be ascending`,
  );
};

describe("EIL-1:3 Integration Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(EIL13_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL13_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(IntegrationModelIdentity.phaseId, "EIL-1:3");
    assert.equal(
      IntegrationModelIdentity.canonicalId,
      "EIL-1:3/IntegrationModel",
    );
    assert.equal(IntegrationModelIdentity.name, "Integration Model");
    assert.equal(IntegrationModelIdentity.version, "1.0.0");
    assert.equal(
      IntegrationModelIdentity.namespace,
      "nexora.eil.integration.model",
    );
    assert.equal(IntegrationModelIdentity.layer, "EIL");
    assert.equal(IntegrationModelIdentity.platform, "EIL-1");
    assert.equal(IntegrationModelIdentity.phaseType, "Model");
    assert.equal(IntegrationModelIdentity.status, "Model");
    assert.equal(IntegrationModelIdentity.readiness, "ReadyForValidation");
    assert.equal(IntegrationModelPlatform.status, "Model");
    assert.equal(IntegrationModelPlatform.readiness, "ReadyForValidation");
    assert.equal(
      IntegrationModelPlatform.nextPhase,
      "EIL-1:4 — Integration Validation",
    );
  });

  it("declares Registry as the sole phase dependency via aggregate entry point", () => {
    const { dependency } = IntegrationModelPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.registryId,
      IntegrationRegistryIdentity.canonicalId,
    );
    assert.equal(dependency.directPreviousPhaseModule, "integrationRegistry.ts");
    assert.equal(
      IntegrationModelIdentity.registryDependency,
      "EIL-1:2/IntegrationRegistry",
    );
    assert.equal(
      IntegrationModelIdentity.registryEntryPoint,
      "integrationRegistry.ts",
    );
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.laterEilPhaseImport, false);
    assert.equal(
      IntegrationModelPlatform.registryPlatform,
      IntegrationRegistryPlatform,
    );
  });

  it("freezes all models, relationships, topology, and lifecycle collections", () => {
    assert.equal(Object.isFrozen(IntegrationModelIdentity), true);
    assert.equal(Object.isFrozen(IntegrationDomainModels), true);
    assert.equal(Object.isFrozen(IntegrationRelationshipModels), true);
    assert.equal(Object.isFrozen(IntegrationTopologyModels), true);
    assert.equal(Object.isFrozen(IntegrationLifecycleModels), true);
    assert.equal(Object.isFrozen(IntegrationModelCollections), true);
    assert.equal(Object.isFrozen(IntegrationModelSummary), true);
    assert.equal(Object.isFrozen(IntegrationModelPlatform), true);

    for (const entry of IntegrationDomainModels) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
      assert.equal(Object.isFrozen(entry.sourceRegistryReference), true);
    }
    for (const entry of IntegrationRelationshipModels) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
    }
    for (const entry of IntegrationTopologyModels) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.graphEngine, false);
      assert.equal(entry.routingEngine, false);
      assert.equal(entry.visualization, false);
    }
    for (const entry of IntegrationLifecycleModels) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.executesTransitions, false);
      assert.equal(entry.runtimeStateMachine, false);
    }
  });

  it("enforces unique IDs, keys, and deterministic ordinals", () => {
    assertUnique(
      IntegrationDomainModels.map((item) => item.modelId),
      "domain model IDs",
    );
    assertUnique(
      IntegrationDomainModels.map((item) => item.canonicalKey),
      "domain model keys",
    );
    assertAscending(
      IntegrationDomainModels.map((item) => item.ordinal),
      "domain",
    );

    assertUnique(
      IntegrationRelationshipModels.map((item) => item.relationshipId),
      "relationship IDs",
    );
    assertUnique(
      IntegrationRelationshipModels.map((item) => item.canonicalKey),
      "relationship keys",
    );
    assertAscending(
      IntegrationRelationshipModels.map((item) => item.ordinal),
      "relationship",
    );

    assertUnique(
      IntegrationTopologyModels.map((item) => item.topologyId),
      "topology IDs",
    );
    assertAscending(
      IntegrationTopologyModels.map((item) => item.ordinal),
      "topology",
    );

    assertUnique(
      IntegrationLifecycleModels.map((item) => item.lifecycleModelId),
      "lifecycle IDs",
    );
    assertAscending(
      IntegrationLifecycleModels.map((item) => item.ordinal),
      "lifecycle",
    );
  });

  it("preserves required relationships and Foundation lifecycle mappings", () => {
    for (const [source, target] of REQUIRED_RELATIONSHIP_PAIRS) {
      assert.ok(
        IntegrationRelationshipModels.some(
          (item) =>
            item.sourceModelKey === source && item.targetModelKey === target,
        ),
        `missing relationship ${source} → ${target}`,
      );
    }

    assert.equal(IntegrationLifecycleModels.length, 8);
    assert.deepEqual(
      IntegrationLifecycleModels.map((item) => item.state),
      [...EXPECTED_LIFECYCLE],
    );
    assert.deepEqual(
      IntegrationLifecycleModels.map((item) => item.state),
      IntegrationRegistryPlatform.lifecycleCoverage.map((item) => item.state),
    );
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationModelCollections.domainModelCount,
      IntegrationDomainModels.length,
    );
    assert.equal(
      IntegrationModelCollections.relationshipCount,
      IntegrationRelationshipModels.length,
    );
    assert.equal(
      IntegrationModelCollections.topologyCount,
      IntegrationTopologyModels.length,
    );
    assert.equal(
      IntegrationModelCollections.lifecycleCount,
      IntegrationLifecycleModels.length,
    );
    assert.equal(
      IntegrationModelCollections.totalModelEntryCount,
      IntegrationDomainModels.length +
        IntegrationRelationshipModels.length +
        IntegrationTopologyModels.length +
        IntegrationLifecycleModels.length,
    );
    assert.equal(
      IntegrationModelSummary.domainModelCount,
      IntegrationModelCollections.domainModelCount,
    );
    assert.equal(
      IntegrationModelSummary.relationshipCount,
      IntegrationModelCollections.relationshipCount,
    );
    assert.equal(
      IntegrationModelSummary.topologyCount,
      IntegrationModelCollections.topologyCount,
    );
    assert.equal(
      IntegrationModelSummary.lifecycleCount,
      IntegrationModelCollections.lifecycleCount,
    );
    assert.equal(
      IntegrationModelPlatform.inventory.countsDerivedFromCollections,
      true,
    );
  });

  it("is metadata-only with zero runtime behavior", () => {
    const platform = IntegrationModelPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.serviceDiscoveryRuntime, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.messagingBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.mcpRuntime, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.connectorBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.visualizationBehavior, false);
    assert.equal(platform.graphRendering, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.importsLaterEilPhases, false);
    assert.ok(
      IntegrationDomainModels.every((item) => item.executesRuntime === false),
    );
    assert.ok(
      IntegrationRelationshipModels.every(
        (item) => item.resolvesRuntime === false,
      ),
    );
  });

  it("has zero prohibited imports and no later EIL phase dependencies", () => {
    const sources = EIL13_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(
        source,
        /from ["'][^"']*integrationValidation[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*EIL-1:[4-9][^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationModel.ts", import.meta.url),
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/integrationRegistry\.ts["']/);
    assert.equal(
      IntegrationModelPlatform.dependency.laterEilPhaseImport,
      false,
    );
  });

  it("is ready for the Validation phase with stable summary", () => {
    assert.equal(IntegrationModelSummary.readiness, "ReadyForValidation");
    assert.equal(IntegrationModelSummary.status, "Model");
    assert.equal(
      IntegrationModelSummary.nextPhase,
      "EIL-1:4 — Integration Validation",
    );
    assert.equal(
      IntegrationModelSummary.registryId,
      "EIL-1:2/IntegrationRegistry",
    );
    assert.equal(Object.isFrozen(IntegrationModelSummary), true);
    assert.equal(IntegrationModelSummary.domainModelCount, 16);
    assert.equal(IntegrationModelSummary.topologyCount, 8);
    assert.equal(IntegrationModelSummary.lifecycleCount, 8);
    assert.ok(IntegrationModelSummary.relationshipCount >= 10);
    assert.ok(IntegrationModelSummary.totalModelEntryCount > 30);
  });
});
