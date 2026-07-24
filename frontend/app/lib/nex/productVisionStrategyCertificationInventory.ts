/**
 * NEX-1:7 — Certification inventory metadata.
 */

import { ProductVisionStrategyPlatform } from "./productVisionStrategyPlatform.ts";

export const ProductVisionStrategyCertificationInventory = Object.freeze({
  id: "NEX-1:7/CertificationInventory",
  platformCount: 1,
  capabilityCount: ProductVisionStrategyPlatform.capabilities.length,
  guaranteeCount: ProductVisionStrategyPlatform.guarantees.length,
  compatibilityCount:
    ProductVisionStrategyPlatform.inventory.platformCompatibilityCount,
  certificationCriteriaCount: 16,
  certificationGateCount: 12,
  dependencyCount: 1,
  publicApiCount: 8,
  certificationEntryCount: 16,
  sourcePlatformId: ProductVisionStrategyPlatform.identity.id,
  metadataOnly: true,
  immutable: true,
} as const);
