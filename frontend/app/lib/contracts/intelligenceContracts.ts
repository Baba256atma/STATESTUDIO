import {
  clamp01,
  normalizeIdPart,
  normalizeSeverity,
  type NormalizedSeverity,
  uniqueStrings,
} from "../intelligence/shared/normalization.ts";
import { stableSignature } from "../intelligence/shared/dedupe.ts";
import { avoidFalseCertainty, conciseExecutiveSentence } from "../intelligence/shared/executiveLanguage.ts";

export type IntelligenceContractVersion = "intelligence-contract-v1";

export type IntelligenceSourceKind =
  | "domain"
  | "connector"
  | "scene"
  | "executive"
  | "system";

export type IntelligenceOverlayMetadata = {
  overlayId: string;
  ownerLayerId: string;
  derivedOnly: true;
  mutatesScene: false;
  recomputeSignature: string;
};

export type IntelligenceNarrativeContract = {
  headline: string;
  summary: string;
  executiveMeaning?: string;
};

export type IntelligenceSummaryContract = {
  title: string;
  summary: string;
  severity: NormalizedSeverity;
  confidence: number;
  relatedObjectIds: string[];
  createdAt: number;
};

export type IntelligenceContractEnvelope = {
  version: IntelligenceContractVersion;
  id: string;
  sourceKind: IntelligenceSourceKind;
  layerId: string;
  timestamp: number;
  severity: NormalizedSeverity;
  confidence: number;
  relatedObjectIds: string[];
  narrative?: IntelligenceNarrativeContract;
  overlay?: IntelligenceOverlayMetadata;
  orchestrationSignature: string;
};

function normalizeTimestamp(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : 0;
}

export function buildIntelligenceOrchestrationSignature(value: unknown): string {
  return stableSignature(value);
}

export function normalizeIntelligenceSummaryContract(input: {
  title?: unknown;
  summary?: unknown;
  severity?: unknown;
  confidence?: unknown;
  relatedObjectIds?: unknown[];
  createdAt?: unknown;
}): IntelligenceSummaryContract {
  return {
    title: conciseExecutiveSentence(input.title, "Executive intelligence"),
    summary: avoidFalseCertainty(conciseExecutiveSentence(input.summary, "No executive summary is available yet.")),
    severity: normalizeSeverity(input.severity),
    confidence: clamp01(input.confidence ?? 0.5),
    relatedObjectIds: uniqueStrings(input.relatedObjectIds ?? []),
    createdAt: normalizeTimestamp(input.createdAt),
  };
}

export function buildIntelligenceContractEnvelope(params: {
  id?: unknown;
  sourceKind?: IntelligenceSourceKind;
  layerId: string;
  timestamp?: unknown;
  severity?: unknown;
  confidence?: unknown;
  relatedObjectIds?: unknown[];
  narrative?: Partial<IntelligenceNarrativeContract> | null;
  overlayOwnerLayerId?: string;
  overlayId?: string;
}): IntelligenceContractEnvelope {
  const relatedObjectIds = uniqueStrings(params.relatedObjectIds ?? []);
  const severity = normalizeSeverity(params.severity);
  const confidence = clamp01(params.confidence ?? 0.5);
  const timestamp = normalizeTimestamp(params.timestamp);
  const id = normalizeIdPart(params.id ?? `${params.layerId}:${severity}:${relatedObjectIds.join("_")}`) || "intelligence";
  const narrative = params.narrative
    ? {
        headline: conciseExecutiveSentence(params.narrative.headline, "Executive intelligence"),
        summary: avoidFalseCertainty(conciseExecutiveSentence(params.narrative.summary, "Executive context is available.")),
        ...(params.narrative.executiveMeaning
          ? { executiveMeaning: avoidFalseCertainty(conciseExecutiveSentence(params.narrative.executiveMeaning, "")) }
          : {}),
      }
    : undefined;
  const signaturePayload = {
    id,
    sourceKind: params.sourceKind ?? "system",
    layerId: params.layerId,
    severity,
    confidence,
    relatedObjectIds,
    narrative,
  };
  const orchestrationSignature = buildIntelligenceOrchestrationSignature(signaturePayload);

  return {
    version: "intelligence-contract-v1",
    id,
    sourceKind: params.sourceKind ?? "system",
    layerId: params.layerId,
    timestamp,
    severity,
    confidence,
    relatedObjectIds,
    ...(narrative ? { narrative } : {}),
    ...(params.overlayId
      ? {
          overlay: {
            overlayId: normalizeIdPart(params.overlayId),
            ownerLayerId: params.overlayOwnerLayerId ?? params.layerId,
            derivedOnly: true,
            mutatesScene: false,
            recomputeSignature: orchestrationSignature,
          },
        }
      : {}),
    orchestrationSignature,
  };
}

export function validateIntelligenceContractEnvelope(value: unknown): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  if (!record) return { valid: false, warnings: ["Envelope must be an object."] };
  if (record.version !== "intelligence-contract-v1") warnings.push("Unsupported intelligence contract version.");
  if (!String(record.id ?? "").trim()) warnings.push("Envelope id is required.");
  if (!String(record.layerId ?? "").trim()) warnings.push("Envelope layerId is required.");
  if (typeof record.confidence !== "number" || record.confidence < 0 || record.confidence > 1) {
    warnings.push("Envelope confidence must be a 0..1 number.");
  }
  const overlay = record.overlay as Record<string, unknown> | undefined;
  if (overlay && (overlay.derivedOnly !== true || overlay.mutatesScene !== false)) {
    warnings.push("Overlay metadata must be derived-only and non-mutating.");
  }
  return {
    valid: warnings.length === 0,
    warnings,
  };
}
