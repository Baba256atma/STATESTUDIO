import { getFinancePublicApi } from "./financeIndex.ts";
import type {
  FinanceApiRegistry as FinanceApiRegistryContract,
  FinanceApiRegistryEntry,
} from "./financeRegistryTypes.ts";

const BUS_28_2_API_ENTRIES: readonly FinanceApiRegistryEntry[] = Object.freeze([
  Object.freeze({
    apiName: "getFinanceObjectRegistry",
    stable: true,
    runtimeBehavior: false,
    sourcePhase: "BUS-28:2",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    apiName: "getFinanceCategoryRegistry",
    stable: true,
    runtimeBehavior: false,
    sourcePhase: "BUS-28:2",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    apiName: "getFinanceApiRegistry",
    stable: true,
    runtimeBehavior: false,
    sourcePhase: "BUS-28:2",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    apiName: "getFinanceRegistryManifest",
    stable: true,
    runtimeBehavior: false,
    sourcePhase: "BUS-28:2",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    apiName: "findFinanceObjectByCode",
    stable: true,
    runtimeBehavior: false,
    sourcePhase: "BUS-28:2",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    apiName: "findFinanceObjectsByCategory",
    stable: true,
    runtimeBehavior: false,
    sourcePhase: "BUS-28:2",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

const BUS_28_1_API_ENTRIES: readonly FinanceApiRegistryEntry[] = Object.freeze(
  getFinancePublicApi().map((api) =>
    Object.freeze({
      apiName: api.apiName,
      stable: api.stable,
      runtimeBehavior: api.runtimeBehavior,
      sourcePhase: "BUS-28:1",
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const FinanceApiRegistry: FinanceApiRegistryContract = Object.freeze({
  registryId: "finance-api-registry",
  registryVersion: "1.0.0",
  apis: Object.freeze([...BUS_28_1_API_ENTRIES, ...BUS_28_2_API_ENTRIES]),
  metadataOnly: true,
  immutable: true,
});

export function getFinanceApiRegistry(): FinanceApiRegistryContract {
  return FinanceApiRegistry;
}
