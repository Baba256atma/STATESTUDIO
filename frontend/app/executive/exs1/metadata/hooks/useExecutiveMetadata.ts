"use client";

import { useContext, useMemo } from "react";
import type { Exs1ObjectId } from "../../exs1Types";
import { METADATA_STATIC } from "../ExecutiveMetadataRegistry";
import {
  getFieldMetadata,
  getObjectMetadata,
  resolveFieldByTechnicalOrSynonym,
  resolveFieldDisplayName,
  resolveObjectBadge,
  resolveObjectDisplayName,
  resolveObjectTooltip,
} from "../ExecutiveMetadataRegistry";
import { ExecutiveMetadataContext } from "../ExecutiveMetadataProvider";

/**
 * Metadata hook — resolves business meaning for Runtime IDs and field names.
 */
export function useExecutiveMetadata() {
  const ctx = useContext(ExecutiveMetadataContext);
  if (!ctx) {
    throw new Error(
      "useExecutiveMetadata must be used within ExecutiveMetadataProvider",
    );
  }

  const api = useMemo(() => {
    const { catalog } = ctx;
    return {
      ...ctx,
      domains: METADATA_STATIC.domains,
      kpis: METADATA_STATIC.kpis,
      glossary: METADATA_STATIC.glossary,
      relations: METADATA_STATIC.relations,
      graph: METADATA_STATIC.graph,
      units: METADATA_STATIC.units,
      getObject: (objectId: Exs1ObjectId) =>
        getObjectMetadata(catalog, objectId),
      getField: (fieldId: string) => getFieldMetadata(catalog, fieldId),
      resolveObjectName: (objectId: Exs1ObjectId, fallback?: string) =>
        resolveObjectDisplayName(catalog, objectId, fallback),
      resolveObjectBadge: (objectId: Exs1ObjectId) =>
        resolveObjectBadge(catalog, objectId),
      resolveObjectTooltip: (objectId: Exs1ObjectId, fallback?: string) =>
        resolveObjectTooltip(catalog, objectId, fallback),
      resolveFieldName: (technicalOrSynonym: string) =>
        resolveFieldDisplayName(catalog, technicalOrSynonym),
      findField: (technicalOrSynonym: string) =>
        resolveFieldByTechnicalOrSynonym(catalog, technicalOrSynonym),
    };
  }, [ctx]);

  return api;
}
