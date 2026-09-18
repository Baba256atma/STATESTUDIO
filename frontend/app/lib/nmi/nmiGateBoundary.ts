/**
 * NPA-T NMI:1 — Gate API reuse.
 *
 * External/Internal Input → RDI:1 Gate → Data Reality / canonical authority → NMI read model.
 * NMI does not admit, validate, or bypass existing ingestion.
 */

import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";

export const NMI_GATE_BOUNDARY = Object.freeze({
  gateApi: realDataIntegrationFoundationIdentity,
  nmiGate: false as const,
  secondIngestionGateway: false as const,
  parallelValidationApi: false as const,
  nmiSpecificDataReality: false as const,
  bypassesAdmission: false as const,
  consumesOnlyCanonicalAuthorities: true as const,
  flow: Object.freeze([
    "EXTERNAL_OR_INTERNAL_INPUT",
    "GATE_API_RDI_1",
    "CANONICAL_AUTHORITY_OR_DATA_REALITY",
    "NMI_UNIFIED_MANAGEMENT_MODEL",
  ] as const),
});
