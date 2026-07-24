/**
 * NEX-1:1 — Canonical Product Vision & Strategy Foundation identity.
 */

import type { ProductFoundationIdentityDescriptor } from "./productVisionStrategyFoundationTypes.ts";

export const ProductVisionStrategyFoundationId =
  "NEX-1:1/ProductVisionStrategyFoundation" as const;
export const ProductVisionStrategyFoundationName =
  "Nexora Product Vision & Strategy Foundation" as const;
export const ProductVisionStrategyFoundationNamespace =
  "nexora.nex.product-vision-strategy.foundation" as const;
export const ProductVisionStrategyFoundationVersion = "1.0.0" as const;
export const ProductVisionStrategyFoundationStatus = "Foundation" as const;
export const ProductVisionStrategyFoundationReadiness =
  "ReadyForRegistry" as const;

export const ProductVisionStrategyFoundationIdentity: ProductFoundationIdentityDescriptor =
  Object.freeze({
    id: ProductVisionStrategyFoundationId,
    name: ProductVisionStrategyFoundationName,
    namespace: ProductVisionStrategyFoundationNamespace,
    version: ProductVisionStrategyFoundationVersion,
    layer: "NEX",
    phase: "NEX-1:1",
    status: ProductVisionStrategyFoundationStatus,
    description:
      "Canonical product reference defining why Nexora exists, who it serves, the problems it addresses, and its long-term strategic direction.",
    owner: "Nexora Product",
    stability: "Immutable",
    readiness: ProductVisionStrategyFoundationReadiness,
    metadataOnly: true,
    immutable: true,
  });
