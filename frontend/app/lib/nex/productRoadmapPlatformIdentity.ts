/**
 * NEX-2:6 — Product Roadmap Platform identity.
 */

import { ProductRoadmapManifest } from "./productRoadmapManifest.ts";

export const ProductRoadmapPlatformIdentity = Object.freeze({
  id: "NEX-2:6/ProductRoadmapPlatform",
  name: "Nexora Product Roadmap Platform",
  domain: "NEX Product Roadmap",
  phase: "NEX-2:6",
  namespace: "nexora.nex.product-roadmap.platform",
  version: "1.0.0",
  status: "Platform",
  description:
    "Canonical immutable platform surface for Product Roadmap metadata.",
  platformVersion: "1.0.0",
  platformOwner: "Nexora Product",
  upstreamId: ProductRoadmapManifest.identity.id,
  upstreamPhase: "NEX-2:5",
  manifestOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
