import { buildDomainSignature } from "./domainDedupe.ts";
import { inferDomainRelationshipMeta } from "./domainRelationshipRules.ts";
import { explainDomainRelationship } from "./domainRelationshipExplanation.ts";
import type { DomainRelationshipMeta } from "./domainRelationshipTypes.ts";

export type EnrichedDomainRelationship = {
  edgeId?: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
  meta: DomainRelationshipMeta;
  executiveExplanation: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function objectLabel(value: unknown, fallback: string): string {
  const record = asRecord(value);
  return String(record.label ?? record.name ?? record.display_label ?? record.id ?? fallback).trim() || fallback;
}

function edgeRelationshipType(edge: unknown): string {
  const record = asRecord(edge);
  const metadata = asRecord(record.metadata);
  return String(metadata.relationshipType ?? record.relationshipType ?? record.kind ?? record.type ?? "dependency")
    .replace(/^domain_/, "")
    .trim();
}

const emittedDebugSignatures = new Set<string>();

function logRelationshipSemantic(event: EnrichedDomainRelationship, domainId: unknown): void {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  const signature = buildDomainSignature([
    "relationship_semantic",
    domainId,
    event.sourceObjectId,
    event.targetObjectId,
    event.meta.semantic,
  ]);
  if (emittedDebugSignatures.has(signature)) return;
  emittedDebugSignatures.add(signature);
  if (emittedDebugSignatures.size > 50) emittedDebugSignatures.clear();
  console.debug("[Nexora][DomainRelationshipSemantic]", {
    source: event.sourceObjectId,
    target: event.targetObjectId,
    semantic: event.meta.semantic,
    domain: domainId,
    strength: event.meta.strength,
  });
}

export function enrichDomainRelationships(params: {
  domainId: unknown;
  objects: unknown[];
  edges?: unknown[];
}): EnrichedDomainRelationship[] {
  const objects = Array.isArray(params.objects) ? params.objects : [];
  const edges = Array.isArray(params.edges) ? params.edges : [];
  const objectById = new Map<string, unknown>();
  const enriched: EnrichedDomainRelationship[] = [];
  const seen = new Set<string>();

  for (const object of objects) {
    const id = String(asRecord(object).id ?? "").trim();
    if (id) objectById.set(id, object);
  }

  for (const edge of edges) {
    const record = asRecord(edge);
    const sourceObjectId = String(record.from ?? record.sourceObjectId ?? "").trim();
    const targetObjectId = String(record.to ?? record.targetObjectId ?? "").trim();
    if (!sourceObjectId || !targetObjectId) continue;

    const sourceObject = objectById.get(sourceObjectId);
    const targetObject = objectById.get(targetObjectId);
    if (!sourceObject || !targetObject) continue;

    const relationshipType = edgeRelationshipType(edge);
    const meta = inferDomainRelationshipMeta({
      domainId: params.domainId,
      sourceObject,
      targetObject,
      relationshipType,
    });
    const signature = buildDomainSignature([sourceObjectId, targetObjectId, meta.semantic, relationshipType]);
    if (seen.has(signature)) continue;
    seen.add(signature);

    const event = {
      edgeId: String(record.id ?? "").trim() || undefined,
      sourceObjectId,
      targetObjectId,
      relationshipType,
      meta,
      executiveExplanation: explainDomainRelationship({
        domainId: params.domainId,
        sourceLabel: objectLabel(sourceObject, sourceObjectId),
        targetLabel: objectLabel(targetObject, targetObjectId),
        meta,
      }),
    };
    enriched.push(event);
    logRelationshipSemantic(event, params.domainId);
  }

  return enriched;
}
