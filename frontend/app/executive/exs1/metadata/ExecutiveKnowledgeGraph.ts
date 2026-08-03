/**
 * Phase A — Executive Knowledge Graph model (no graph engine).
 */

import type { Exs1ObjectId } from "../exs1Types";
import { EXECUTIVE_DOMAINS } from "./ExecutiveDomainRegistry";
import { INITIAL_FIELD_METADATA } from "./ExecutiveFieldMetadata";
import { INITIAL_GLOSSARY } from "./ExecutiveGlossary";
import { INITIAL_KPI_METADATA } from "./ExecutiveKPIRegistry";
import { INITIAL_OBJECT_METADATA } from "./ExecutiveObjectMetadata";

export type KnowledgeRelationPredicate =
  | "supplies"
  | "feeds"
  | "creates"
  | "serves"
  | "informs"
  | "depends-on";

export type ExecutiveKnowledgeRelation = {
  readonly relationId: string;
  readonly fromObjectId: Exs1ObjectId;
  readonly predicate: KnowledgeRelationPredicate;
  readonly toObjectId: Exs1ObjectId;
  readonly label: string;
};

export const INITIAL_KNOWLEDGE_RELATIONS: readonly ExecutiveKnowledgeRelation[] =
  Object.freeze([
    {
      relationId: "rel-supplier-warehouse",
      fromObjectId: "supplier",
      predicate: "supplies",
      toObjectId: "inventory",
      label: "Supplier supplies Warehouse Inventory",
    },
    {
      relationId: "rel-warehouse-production",
      fromObjectId: "inventory",
      predicate: "feeds",
      toObjectId: "factory",
      label: "Warehouse feeds Production",
    },
    {
      relationId: "rel-production-revenue",
      fromObjectId: "factory",
      predicate: "creates",
      toObjectId: "revenue",
      label: "Production creates Revenue",
    },
    {
      relationId: "rel-customer-revenue",
      fromObjectId: "customer",
      predicate: "serves",
      toObjectId: "revenue",
      label: "Customer serves Revenue",
    },
    {
      relationId: "rel-decision-inventory",
      fromObjectId: "decision",
      predicate: "informs",
      toObjectId: "inventory",
      label: "Decision informs Inventory posture",
    },
  ]);

export type ExecutiveKnowledgeGraph = {
  readonly objects: typeof INITIAL_OBJECT_METADATA;
  readonly fields: typeof INITIAL_FIELD_METADATA;
  readonly domains: typeof EXECUTIVE_DOMAINS;
  readonly kpis: typeof INITIAL_KPI_METADATA;
  readonly glossary: typeof INITIAL_GLOSSARY;
  readonly relations: typeof INITIAL_KNOWLEDGE_RELATIONS;
};

export const EXECUTIVE_KNOWLEDGE_GRAPH: ExecutiveKnowledgeGraph = Object.freeze({
  objects: INITIAL_OBJECT_METADATA,
  fields: INITIAL_FIELD_METADATA,
  domains: EXECUTIVE_DOMAINS,
  kpis: INITIAL_KPI_METADATA,
  glossary: INITIAL_GLOSSARY,
  relations: INITIAL_KNOWLEDGE_RELATIONS,
});
