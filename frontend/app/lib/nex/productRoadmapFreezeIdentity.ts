/**
 * NEX-2:8 — Product Roadmap Freeze identity.
 */

import { ProductRoadmapCertification } from "./productRoadmapCertification.ts";

export const ProductRoadmapFreezeIdentity = Object.freeze({
  id: "NEX-2:8/ProductRoadmapFreeze",
  name: "Nexora Product Roadmap Freeze",
  domain: "NEX Product Roadmap",
  phase: "NEX-2:8",
  namespace: "nexora.nex.product-roadmap.freeze",
  version: "1.0.0",
  status: "Freeze",
  description:
    "Canonical immutable frozen baseline for the certified Product Roadmap Platform.",
  freezeVersion: "1.0.0",
  freezeOwner: "Nexora Product",
  canonicalLockIdentifier: "NEX-2-PRODUCT-ROADMAP-LOCKED",
  upstreamId: ProductRoadmapCertification.identity.id,
  upstreamPhase: "NEX-2:7",
  certificationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
