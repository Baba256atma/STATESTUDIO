/**
 * NEX-1:8 — Immutable frozen phase baselines.
 */

import { ProductVisionStrategyCertification } from "./productVisionStrategyCertification.ts";

export const ProductVisionStrategyFrozenBaselines = Object.freeze([
  Object.freeze({ id: "NEX-1:8/Baseline/Foundation", name: "Foundation Baseline", phase: "NEX-1:1", source: "NEX-1:7/CertifiedFoundationTraceability", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Baseline/Registry", name: "Registry Baseline", phase: "NEX-1:2", source: "NEX-1:7/CertifiedRegistryTraceability", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Baseline/Model", name: "Model Baseline", phase: "NEX-1:3", source: "NEX-1:7/CertifiedModelTraceability", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Baseline/Validation", name: "Validation Baseline", phase: "NEX-1:4", source: "NEX-1:7/CertifiedValidationTraceability", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Baseline/Manifest", name: "Manifest Baseline", phase: "NEX-1:5", source: "NEX-1:7/CertifiedManifestTraceability", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Baseline/Platform", name: "Platform Baseline", phase: "NEX-1:6", source: ProductVisionStrategyCertification.dependency.upstreamId, locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Baseline/Certification", name: "Certification Baseline", phase: "NEX-1:7", source: ProductVisionStrategyCertification.identity.id, locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Baseline/Freeze", name: "Freeze Baseline", phase: "NEX-1:8", source: "NEX-1:8/ProductVisionStrategyFreeze", locked: true, metadataOnly: true, immutable: true }),
] as const);
