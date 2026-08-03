/**
 * Phase A — Executive Metadata Registry.
 * Single catalog for fields, objects, domains, KPIs, relationships, units, synonyms, owners.
 * Resolves meaning for Runtime IDs without changing Runtime architecture.
 */

import type { Exs1ObjectId } from "../exs1Types";
import { EXECUTIVE_DOMAINS, getDomain } from "./ExecutiveDomainRegistry";
import {
  INITIAL_FIELD_METADATA,
  type ExecutiveFieldMetadata,
} from "./ExecutiveFieldMetadata";
import { INITIAL_GLOSSARY } from "./ExecutiveGlossary";
import {
  EXECUTIVE_KNOWLEDGE_GRAPH,
  INITIAL_KNOWLEDGE_RELATIONS,
} from "./ExecutiveKnowledgeGraph";
import { INITIAL_KPI_METADATA } from "./ExecutiveKPIRegistry";
import {
  EXECUTIVE_UNITS,
  INITIAL_OBJECT_METADATA,
  type ExecutiveObjectMetadata,
  type ExecutiveUnitId,
} from "./ExecutiveObjectMetadata";

export type MetadataSearchKind =
  | "All"
  | "Objects"
  | "Fields"
  | "Domains"
  | "KPIs"
  | "Glossary"
  | "Synonyms";

export type MetadataSearchHit = {
  readonly id: string;
  readonly kind: Exclude<MetadataSearchKind, "All" | "Synonyms"> | "Synonym";
  readonly title: string;
  readonly subtitle: string;
  readonly objectId?: Exs1ObjectId;
  readonly fieldId?: string;
};

export type FieldMetadataPatch = Partial<
  Pick<
    ExecutiveFieldMetadata,
    "displayName" | "businessMeaning" | "domainId" | "unitId" | "mappedObjectId"
  >
>;

export type ObjectMetadataPatch = Partial<
  Pick<
    ExecutiveObjectMetadata,
    "displayName" | "description" | "owner" | "unitId" | "badge"
  >
>;

export type ExecutiveMetadataCatalog = {
  readonly objects: ExecutiveObjectMetadata[];
  readonly fields: ExecutiveFieldMetadata[];
};

export function createInitialMetadataCatalog(): ExecutiveMetadataCatalog {
  return {
    objects: INITIAL_OBJECT_METADATA.map((o) => ({
      ...o,
      domainIds: [...o.domainIds],
      relatedObjectIds: [...o.relatedObjectIds],
      synonyms: [...o.synonyms],
    })),
    fields: INITIAL_FIELD_METADATA.map((f) => ({
      ...f,
      synonyms: [...f.synonyms],
    })),
  };
}

export function getObjectMetadata(
  catalog: ExecutiveMetadataCatalog,
  objectId: Exs1ObjectId,
): ExecutiveObjectMetadata | undefined {
  return catalog.objects.find((o) => o.objectId === objectId);
}

export function resolveObjectDisplayName(
  catalog: ExecutiveMetadataCatalog,
  objectId: Exs1ObjectId,
  fallback?: string,
): string {
  return (
    getObjectMetadata(catalog, objectId)?.displayName ??
    fallback ??
    objectId
  );
}

export function resolveObjectBadge(
  catalog: ExecutiveMetadataCatalog,
  objectId: Exs1ObjectId,
): string | null {
  return getObjectMetadata(catalog, objectId)?.badge ?? null;
}

export function resolveObjectTooltip(
  catalog: ExecutiveMetadataCatalog,
  objectId: Exs1ObjectId,
  fallbackSummary?: string,
): string {
  const meta = getObjectMetadata(catalog, objectId);
  if (!meta) return fallbackSummary ?? objectId;
  const domains = meta.domainIds
    .map((id) => getDomain(id)?.name ?? id)
    .join(", ");
  const unit = meta.unitId ? EXECUTIVE_UNITS[meta.unitId].label : null;
  return [
    meta.displayName,
    meta.description,
    `Domain · ${domains}`,
    unit ? `Unit · ${unit}` : null,
    `Owner · ${meta.owner}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function getFieldMetadata(
  catalog: ExecutiveMetadataCatalog,
  fieldId: string,
): ExecutiveFieldMetadata | undefined {
  return catalog.fields.find((f) => f.fieldId === fieldId);
}

export function resolveFieldByTechnicalOrSynonym(
  catalog: ExecutiveMetadataCatalog,
  name: string,
): ExecutiveFieldMetadata | undefined {
  const q = name.trim().toLowerCase();
  if (!q) return undefined;
  return catalog.fields.find(
    (f) =>
      f.technicalName.toLowerCase() === q ||
      f.displayName.toLowerCase() === q ||
      f.synonyms.some((s) => s.toLowerCase() === q),
  );
}

export function resolveFieldDisplayName(
  catalog: ExecutiveMetadataCatalog,
  technicalOrSynonym: string,
): string {
  return (
    resolveFieldByTechnicalOrSynonym(catalog, technicalOrSynonym)?.displayName ??
    technicalOrSynonym
  );
}

export function patchFieldMetadata(
  catalog: ExecutiveMetadataCatalog,
  fieldId: string,
  patch: FieldMetadataPatch,
): ExecutiveMetadataCatalog {
  return {
    ...catalog,
    fields: catalog.fields.map((f) =>
      f.fieldId === fieldId ? { ...f, ...patch } : f,
    ),
  };
}

export function patchObjectMetadata(
  catalog: ExecutiveMetadataCatalog,
  objectId: Exs1ObjectId,
  patch: ObjectMetadataPatch,
): ExecutiveMetadataCatalog {
  return {
    ...catalog,
    objects: catalog.objects.map((o) =>
      o.objectId === objectId ? { ...o, ...patch } : o,
    ),
  };
}

export function searchMetadata(
  catalog: ExecutiveMetadataCatalog,
  query: string,
  kind: MetadataSearchKind = "All",
): MetadataSearchHit[] {
  const q = query.trim().toLowerCase();
  const hits: MetadataSearchHit[] = [];

  const match = (value: string) => !q || value.toLowerCase().includes(q);

  if (kind === "All" || kind === "Objects" || kind === "Synonyms") {
    for (const object of catalog.objects) {
      const synonymHit = object.synonyms.some((s) => match(s));
      if (
        match(object.displayName) ||
        match(object.description) ||
        synonymHit
      ) {
        hits.push({
          id: `obj-${object.objectId}`,
          kind: synonymHit && !match(object.displayName) ? "Synonym" : "Objects",
          title: object.displayName,
          subtitle: object.description,
          objectId: object.objectId,
        });
      }
    }
  }

  if (kind === "All" || kind === "Fields" || kind === "Synonyms") {
    for (const field of catalog.fields) {
      const synonymHit = field.synonyms.some((s) => match(s));
      if (
        match(field.technicalName) ||
        match(field.displayName) ||
        match(field.businessMeaning) ||
        synonymHit
      ) {
        hits.push({
          id: field.fieldId,
          kind: synonymHit && !match(field.displayName) ? "Synonym" : "Fields",
          title: field.displayName,
          subtitle: `${field.technicalName} · ${field.businessMeaning}`,
          fieldId: field.fieldId,
          objectId: field.mappedObjectId ?? undefined,
        });
      }
    }
  }

  if (kind === "All" || kind === "Domains") {
    for (const domain of EXECUTIVE_DOMAINS) {
      if (match(domain.name) || match(domain.description)) {
        hits.push({
          id: domain.id,
          kind: "Domains",
          title: domain.name,
          subtitle: domain.description,
        });
      }
    }
  }

  if (kind === "All" || kind === "KPIs") {
    for (const kpi of INITIAL_KPI_METADATA) {
      if (match(kpi.name) || match(kpi.description)) {
        hits.push({
          id: kpi.kpiId,
          kind: "KPIs",
          title: kpi.name,
          subtitle: kpi.description,
        });
      }
    }
  }

  if (kind === "All" || kind === "Glossary") {
    for (const entry of INITIAL_GLOSSARY) {
      if (match(entry.term) || match(entry.definition)) {
        hits.push({
          id: entry.termId,
          kind: "Glossary",
          title: entry.term,
          subtitle: entry.definition,
        });
      }
    }
  }

  return hits;
}

export function listUnitLabels(): readonly string[] {
  return Object.values(EXECUTIVE_UNITS).map((u) => u.label);
}

export function unitIdFromLabel(label: string): ExecutiveUnitId | null {
  const found = Object.values(EXECUTIVE_UNITS).find(
    (u) => u.label.toLowerCase() === label.toLowerCase(),
  );
  return found?.id ?? null;
}

export const METADATA_STATIC = Object.freeze({
  domains: EXECUTIVE_DOMAINS,
  kpis: INITIAL_KPI_METADATA,
  glossary: INITIAL_GLOSSARY,
  relations: INITIAL_KNOWLEDGE_RELATIONS,
  graph: EXECUTIVE_KNOWLEDGE_GRAPH,
  units: EXECUTIVE_UNITS,
});
