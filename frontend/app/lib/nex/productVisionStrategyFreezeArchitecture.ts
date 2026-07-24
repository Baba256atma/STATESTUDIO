/**
 * NEX-1:8 — Frozen architecture metadata.
 */

import { ProductVisionStrategyCertification } from "./productVisionStrategyCertification.ts";

export const ProductVisionStrategyFrozenArchitecture = Object.freeze({
  id: "NEX-1:8/FrozenArchitecture",
  architecture: "NPA v2",
  platform: "Vision & Product Strategy",
  sourceCertificationId: ProductVisionStrategyCertification.identity.id,
  lockIdentifier: "NEX-1-VISION-PRODUCT-STRATEGY-LOCKED",
  locked: true,
  executesArchitectureLock: false,
  metadataOnly: true,
  immutable: true,
} as const);
