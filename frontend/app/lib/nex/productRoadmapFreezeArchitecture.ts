/**
 * NEX-2:8 — Frozen Product Roadmap architecture metadata.
 */

import { ProductRoadmapCertification } from "./productRoadmapCertification.ts";

export const ProductRoadmapFrozenArchitecture = Object.freeze({
  id: "NEX-2:8/FrozenArchitecture",
  architecture: "NPA v2",
  domain: "Product Roadmap",
  sourceCertificationId: ProductRoadmapCertification.identity.id,
  canonicalLockIdentifier: "NEX-2-PRODUCT-ROADMAP-LOCKED",
  locked: true,
  executesArchitectureLock: false,
  metadataOnly: true,
  immutable: true,
} as const);
