"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Exs1ObjectId } from "../exs1Types";
import {
  createInitialMetadataCatalog,
  patchFieldMetadata,
  patchObjectMetadata,
  searchMetadata,
  type ExecutiveMetadataCatalog,
  type FieldMetadataPatch,
  type MetadataSearchHit,
  type MetadataSearchKind,
  type ObjectMetadataPatch,
} from "./ExecutiveMetadataRegistry";

export type KnowledgeSection =
  | "Objects"
  | "Fields"
  | "Domains"
  | "KPIs"
  | "Glossary";

export type ExecutiveMetadataContextValue = {
  readonly catalog: ExecutiveMetadataCatalog;
  readonly section: KnowledgeSection;
  readonly setSection: (section: KnowledgeSection) => void;
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly searchKind: MetadataSearchKind;
  readonly setSearchKind: (kind: MetadataSearchKind) => void;
  readonly selectedFieldId: string | null;
  readonly setSelectedFieldId: (id: string | null) => void;
  readonly selectedObjectId: Exs1ObjectId | null;
  readonly setSelectedObjectId: (id: Exs1ObjectId | null) => void;
  readonly hits: readonly MetadataSearchHit[];
  readonly updateField: (fieldId: string, patch: FieldMetadataPatch) => void;
  readonly updateObject: (
    objectId: Exs1ObjectId,
    patch: ObjectMetadataPatch,
  ) => void;
};

export const ExecutiveMetadataContext =
  createContext<ExecutiveMetadataContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

/**
 * ExecutiveMetadataProvider — editable semantic catalog (session-local).
 * Does not alter Runtime IDs or architecture.
 */
export function ExecutiveMetadataProvider({ children }: Props) {
  const [catalog, setCatalog] = useState<ExecutiveMetadataCatalog>(() =>
    createInitialMetadataCatalog(),
  );
  const [section, setSection] = useState<KnowledgeSection>("Objects");
  const [query, setQuery] = useState("");
  const [searchKind, setSearchKind] = useState<MetadataSearchKind>("All");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    "field-mat-qty",
  );
  const [selectedObjectId, setSelectedObjectId] =
    useState<Exs1ObjectId | null>("inventory");

  const hits = useMemo(
    () => searchMetadata(catalog, query, searchKind),
    [catalog, query, searchKind],
  );

  const updateField = useCallback(
    (fieldId: string, patch: FieldMetadataPatch) => {
      setCatalog((prev) => patchFieldMetadata(prev, fieldId, patch));
    },
    [],
  );

  const updateObject = useCallback(
    (objectId: Exs1ObjectId, patch: ObjectMetadataPatch) => {
      setCatalog((prev) => patchObjectMetadata(prev, objectId, patch));
    },
    [],
  );

  const value = useMemo(
    () => ({
      catalog,
      section,
      setSection,
      query,
      setQuery,
      searchKind,
      setSearchKind,
      selectedFieldId,
      setSelectedFieldId,
      selectedObjectId,
      setSelectedObjectId,
      hits,
      updateField,
      updateObject,
    }),
    [
      catalog,
      section,
      query,
      searchKind,
      selectedFieldId,
      selectedObjectId,
      hits,
      updateField,
      updateObject,
    ],
  );

  return (
    <ExecutiveMetadataContext.Provider value={value}>
      {children}
    </ExecutiveMetadataContext.Provider>
  );
}
