import { FinanceIdentity, FinanceMetadata } from "./financeIndex.ts";
import { getFinanceApiRegistry } from "./financeApiRegistry.ts";
import { getFinanceCategoryRegistry } from "./financeCategoryRegistry.ts";
import { getFinanceObjectRegistry } from "./financeObjectRegistry.ts";
import type { FinanceRegistryManifest } from "./financeRegistryTypes.ts";

const REGISTRY_BOUNDARIES = Object.freeze([
  "metadata-only",
  "no-accounting-logic",
  "no-calculations",
  "no-persistence",
  "no-workflow",
  "no-ai",
  "no-ui",
  "no-networking",
] as const);

export function getFinanceRegistryManifest(): FinanceRegistryManifest {
  const objectRegistry = getFinanceObjectRegistry();
  const categoryRegistry = getFinanceCategoryRegistry();
  const apiRegistry = getFinanceApiRegistry();

  return Object.freeze({
    phaseId: "BUS-28:2",
    phaseName: "Financial Registry",
    platformCode: FinanceIdentity.platformCode,
    consumedPhase: "BUS-28:1",
    registryVersion: "1.0.0",
    objectCount: objectRegistry.objects.length,
    categoryCount: categoryRegistry.categories.length,
    publicApiCount: apiRegistry.apis.length,
    certificationState: "BUS-28:2 Registry Foundation",
    boundaries: REGISTRY_BOUNDARIES,
    metadataOnly: true,
    immutable: true,
  });
}
