import assert from "node:assert/strict";
import test from "node:test";

import { CURRENCY_TYPES, ExecutiveFinancePlatformFoundation, FINANCIAL_OBJECT_TYPES, FINANCIAL_PERIOD_TYPES, FINANCIAL_STATUSES, FINANCIAL_VISIBILITIES, FinanceApi, FinanceContracts, FinanceEnums, FinanceIdentity, getFinanceContracts, getFinanceIdentity, getFinanceMetadata, getFinancePublicApi } from "./financeIndex.ts";
import type {
  FinanceContractSummary,
  FinanceIdentity as FinanceIdentityContract,
  FinanceMetadata as FinanceMetadataContract,
} from "./financeTypes.ts";

test("publishes immutable finance identity", () => {
  const identity: FinanceIdentityContract = getFinanceIdentity();

  assert.equal(identity.platformId, "BUS-28");
  assert.equal(identity.platformName, "Executive Finance Platform");
  assert.equal(identity.platformCode, "EXEC_FIN");
  assert.equal(identity.platformStage, "Foundation");
  assert.equal(Object.isFrozen(identity), true);
  assert.equal(FinanceIdentity, identity);
});

test("publishes immutable finance metadata", () => {
  const metadata: FinanceMetadataContract = getFinanceMetadata();

  assert.equal(metadata.moduleName, "finance-contracts");
  assert.equal(metadata.contractVersion, "1.0.0");
  assert.equal(metadata.architectureLayer, "BUS");
  assert.equal(metadata.certificationState, "BUS-28:1 Foundation");
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(metadata.publicApis.includes("getFinancePublicApi"), true);
});

test("publishes canonical finance enums", () => {
  assert.equal(FINANCIAL_OBJECT_TYPES.includes("Revenue"), true);
  assert.equal(FINANCIAL_OBJECT_TYPES.includes("FinancialStatement"), true);
  assert.equal(FINANCIAL_STATUSES.includes("Frozen"), true);
  assert.equal(FINANCIAL_PERIOD_TYPES.includes("Quarterly"), true);
  assert.equal(CURRENCY_TYPES[0], "ISO4217");
  assert.equal(FINANCIAL_VISIBILITIES.includes("Restricted"), true);
  assert.equal(Object.isFrozen(FinanceEnums), true);
});

test("publishes immutable finance contracts summary", () => {
  const contracts: FinanceContractSummary = getFinanceContracts();

  assert.equal(contracts.contractLayer, "BUS-28:1");
  assert.equal(contracts.objectTypes.length, 16);
  assert.equal(contracts.statuses.length, 4);
  assert.equal(contracts.periodTypes.length, 5);
  assert.equal(contracts.currencyTypes.length, 1);
  assert.equal(Object.isFrozen(contracts), true);
  assert.equal(FinanceContracts, contracts);
});

test("publishes metadata-only public api descriptors", () => {
  const publicApis = getFinancePublicApi();

  assert.equal(publicApis.length, 4);
  assert.equal(publicApis.every((api) => api.returnType === "metadata"), true);
  assert.equal(publicApis.every((api) => api.runtimeBehavior === false), true);
  assert.equal(FinanceApi, publicApis);
  assert.equal(Object.isFrozen(publicApis), true);
});

test("publishes complete public foundation facade", () => {
  assert.equal(ExecutiveFinancePlatformFoundation.FinanceIdentity.platformId, "BUS-28");
  assert.equal(
    ExecutiveFinancePlatformFoundation.FinanceContracts.objectTypes.includes("Budget"),
    true,
  );
  assert.equal(
    ExecutiveFinancePlatformFoundation.FinanceMetadata.supportedConsumers.includes(
      "BUS-28:9 Financial Public Index",
    ),
    true,
  );
  assert.equal(typeof ExecutiveFinancePlatformFoundation.getFinanceIdentity, "function");
  assert.equal(typeof ExecutiveFinancePlatformFoundation.getFinanceMetadata, "function");
  assert.equal(typeof ExecutiveFinancePlatformFoundation.getFinancePublicApi, "function");
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformFoundation), true);
});

test("exports remain deterministic and runtime-free", () => {
  const firstMetadata = getFinanceMetadata();
  const secondMetadata = getFinanceMetadata();
  const firstContracts = getFinanceContracts();
  const secondContracts = getFinanceContracts();

  assert.equal(firstMetadata, secondMetadata);
  assert.equal(firstContracts, secondContracts);
  assert.equal(ExecutiveFinancePlatformFoundation.metadataOnly, true);
  assert.equal(ExecutiveFinancePlatformFoundation.immutable, true);
});
