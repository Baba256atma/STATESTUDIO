/** E2:26 — Executive system modeling contracts. */

import type { SceneJson } from "../sceneTypes";
import type { NexoraRelationshipDirection, NexoraRelationshipType } from "../relationships/relationshipTypes";

export type DomainTemplateCategoryId = "supply_chain" | "pmo" | "finance" | "operations";

export type TemplateRelationshipKind =
  | "supplies"
  | "transports"
  | "delivers"
  | "depends_on"
  | "blocks"
  | "supports"
  | "influences"
  | "funds"
  | "reports_to";

export type TemplateObjectDefinition = {
  key: string;
  label: string;
  catalogId?: string;
  category?: string;
  role?: string;
  icon?: string;
  description?: string;
};

export type TemplateRelationshipDefinition = {
  sourceKey: string;
  targetKey: string;
  type: TemplateRelationshipKind;
  direction?: NexoraRelationshipDirection;
};

export interface DomainTemplate {
  id: string;
  name: string;
  category: DomainTemplateCategoryId;
  description: string;
  purpose: string;
  version: string;
  objects: TemplateObjectDefinition[];
  relationships: TemplateRelationshipDefinition[];
  metadata?: Record<string, unknown>;
}

export type DomainTemplatePreview = {
  template: DomainTemplate;
  objectCount: number;
  relationshipCount: number;
  categoryLabel: string;
};

export type SystemBlueprintMetadata = {
  templateId: string;
  templateName: string;
  generatedAt: string;
  version: string;
  source: "template";
  objectCount: number;
  relationshipCount: number;
  generationDurationMs?: number;
};

export type TemplateValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type SystemGenerationRequest = {
  currentScene: unknown;
  templateId: string;
};

export type SystemGenerationResult = {
  success: boolean;
  nextScene?: SceneJson;
  blueprint?: SystemBlueprintMetadata;
  createdObjectIds?: string[];
  createdRelationshipIds?: string[];
  errors?: string[];
  warnings?: string[];
  generationDurationMs?: number;
};

export const TEMPLATE_RELATIONSHIP_TO_NEXORA: Record<TemplateRelationshipKind, NexoraRelationshipType> = {
  supplies: "supplies",
  transports: "supplies",
  delivers: "supplies",
  depends_on: "dependency",
  blocks: "blocks",
  supports: "supports",
  influences: "influences",
  funds: "supports",
  reports_to: "reports_to",
};

export const DOMAIN_TEMPLATE_CATEGORIES: readonly {
  id: DomainTemplateCategoryId;
  label: string;
  description: string;
}[] = [
  { id: "supply_chain", label: "Supply Chain", description: "End-to-end supply chain visibility" },
  { id: "pmo", label: "PMO", description: "Portfolio and project governance" },
  { id: "finance", label: "Finance", description: "Financial system modeling" },
  { id: "operations", label: "Operations", description: "Operational visibility structures" },
] as const;
