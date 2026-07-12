import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveFinancePlatformFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation } from "./financeRegistryIndex.ts";
import {
  ExecutiveFinanceModelFoundation,
  FinanceAggregationRegistry,
  FinanceDependencyRegistry,
  FinanceModelRegistry,
  FinanceOwnershipRegistry,
  FinanceRelationshipRegistry,
  getFinanceAggregations,
  getFinanceDependencies,
  getFinanceModel,
  getFinanceModelManifest,
  getFinanceOwnership,
  getFinanceRelationships,
} from "./financeModelIndex.ts";

test("consumes BUS-28:1 only through public APIs", () => {
  assert.equal(ExecutiveFinancePlatformFoundation.FinanceIdentity.platformId, "BUS-28");
  assert.equal(ExecutiveFinancePlatformFoundation.FinanceContracts.contractLayer, "BUS-28:1");
});

test("consumes BUS-28:2 only through public APIs", () => {
  assert.equal(ExecutiveFinanceRegistryFoundation.FinanceObjectRegistry.objects.length, 16);
  assert.equal(ExecutiveFinanceRegistryFoundation.FinanceCategoryRegistry.categories.length, 9);
});

test("publishes immutable finance model registry", () => {
  const model = getFinanceModel();

  assert.equal(model, FinanceModelRegistry);
  assert.equal(model.entities.length, 16);
  assert.equal(Object.isFrozen(model), true);
  assert.equal(Object.isFrozen(model.entities), true);
});

test("publishes immutable relationship registry", () => {
  const relationships = getFinanceRelationships();

  assert.equal(relationships, FinanceRelationshipRegistry);
  assert.equal(relationships.relationships.some((entry) => entry.source === "Revenue" && entry.target === "Profit"), true);
  assert.equal(relationships.relationships.some((entry) => entry.source === "FinancialPeriod" && entry.target === "FinancialStatement"), true);
  assert.equal(Object.isFrozen(relationships), true);
});

test("publishes immutable ownership registry", () => {
  const ownership = getFinanceOwnership();

  assert.equal(ownership, FinanceOwnershipRegistry);
  assert.equal(ownership.ownership.some((entry) => entry.owner === "FinancialStatement"), true);
  assert.equal(ownership.ownership.some((entry) => entry.owner === "Account"), true);
  assert.equal(Object.isFrozen(ownership), true);
});

test("publishes immutable aggregation registry", () => {
  const aggregations = getFinanceAggregations();

  assert.equal(aggregations, FinanceAggregationRegistry);
  assert.equal(aggregations.aggregations.some((entry) => entry.aggregate === "Profit"), true);
  assert.equal(aggregations.aggregations.some((entry) => entry.aggregate === "CashFlow"), true);
  assert.equal(Object.isFrozen(aggregations), true);
});

test("publishes immutable dependency registry", () => {
  const dependencies = getFinanceDependencies();

  assert.equal(dependencies, FinanceDependencyRegistry);
  assert.equal(dependencies.dependencies.some((entry) => entry.dependent === "Profit"), true);
  assert.equal(dependencies.dependencies.some((entry) => entry.dependent === "FinancialStatement"), true);
  assert.equal(Object.isFrozen(dependencies), true);
});

test("manifest counts are correct", () => {
  const manifest = getFinanceModelManifest();

  assert.equal(manifest.phaseId, "BUS-28:3");
  assert.equal(manifest.platformId, "BUS-28");
  assert.deepEqual([...manifest.consumedPhases], ["BUS-28:1", "BUS-28:2"]);
  assert.equal(manifest.entityCount, 16);
  assert.equal(manifest.relationshipCount, 17);
  assert.equal(manifest.ownershipCount, 3);
  assert.equal(manifest.aggregationCount, 3);
  assert.equal(manifest.dependencyCount, 5);
  assert.equal(manifest.publicApiCount, 16);
  assert.equal(Object.isFrozen(manifest), true);
});

test("publishes complete public model APIs", () => {
  assert.equal(typeof ExecutiveFinanceModelFoundation.getFinanceModel, "function");
  assert.equal(typeof ExecutiveFinanceModelFoundation.getFinanceRelationships, "function");
  assert.equal(typeof ExecutiveFinanceModelFoundation.getFinanceOwnership, "function");
  assert.equal(typeof ExecutiveFinanceModelFoundation.getFinanceAggregations, "function");
  assert.equal(typeof ExecutiveFinanceModelFoundation.getFinanceDependencies, "function");
  assert.equal(typeof ExecutiveFinanceModelFoundation.getFinanceModelManifest, "function");
  assert.equal(Object.isFrozen(ExecutiveFinanceModelFoundation), true);
  assert.equal(ExecutiveFinanceModelFoundation.metadataOnly, true);
});
