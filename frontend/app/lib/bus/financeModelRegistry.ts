import { getFinanceObjectRegistry } from "./financeRegistryIndex.ts";
import type {
  FinanceModelEntity,
  FinanceModelRegistry as FinanceModelRegistryContract,
} from "./financeModelTypes.ts";

const FINANCE_MODEL_ENTITIES: readonly FinanceModelEntity[] = Object.freeze(
  getFinanceObjectRegistry().objects.map((objectEntry) =>
    Object.freeze({
      entityId: `finance-model-${objectEntry.type.toLowerCase()}` as FinanceModelEntity["entityId"],
      objectCode: objectEntry.code,
      objectType: objectEntry.type,
      objectCategory: objectEntry.category,
      description: `Canonical structural finance model entity for ${objectEntry.type}.`,
      sourcePhase: "BUS-28:3",
      contractVersion: "1.0.0",
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const FinanceModelRegistry: FinanceModelRegistryContract = Object.freeze({
  registryId: "finance-model-registry",
  version: "1.0.0",
  entities: FINANCE_MODEL_ENTITIES,
  metadataOnly: true,
  immutable: true,
});

export function getFinanceModel(): FinanceModelRegistryContract {
  return FinanceModelRegistry;
}
