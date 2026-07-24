/**
 * NEX-2:7 — Product Roadmap Certification identity.
 */

import { ProductRoadmapPlatform } from "./productRoadmapPlatform.ts";

export const ProductRoadmapCertificationIdentity = Object.freeze({
  id: "NEX-2:7/ProductRoadmapCertification",
  name: "Nexora Product Roadmap Certification",
  domain: "NEX Product Roadmap",
  phase: "NEX-2:7",
  namespace: "nexora.nex.product-roadmap.certification",
  version: "1.0.0",
  status: "Certification",
  description:
    "Canonical immutable certification metadata for the Product Roadmap Platform.",
  certificationVersion: "1.0.0",
  certificationOwner: "Nexora Product",
  upstreamId: ProductRoadmapPlatform.identity.id,
  upstreamPhase: "NEX-2:6",
  platformOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
