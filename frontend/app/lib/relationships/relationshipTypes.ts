/** E2:25 — Canonical relationship contracts (single source of truth). */

import type { RelationshipIntelligenceProfile } from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import type { RelationshipStrengthProfile } from "../relationship-intelligence/relationshipStrengthContract.ts";
import type { DependencyProfile } from "../relationship-intelligence/dependencyIntelligenceContract.ts";
import type { RelationshipRiskExposureProfile } from "../relationship-intelligence/relationshipRiskExposureContract.ts";
import type { RelationshipInfluenceProfile } from "../relationship-intelligence/relationshipInfluenceContract.ts";

export type NexoraRelationshipType =
  | "dependency"
  | "flow"
  | "ownership"
  | "information"
  | "resource"
  | "risk"
  | "influences"
  | "supplies"
  | "reports_to"
  | "blocks"
  | "supports"
  | "owns"
  | "custom";

export type NexoraRelationshipDirection = "uni" | "bi";

export interface NexoraRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: NexoraRelationshipType;
  direction: NexoraRelationshipDirection;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type ExecutiveRelationship = NexoraRelationship &
  RelationshipIntelligenceProfile &
  RelationshipStrengthProfile &
  DependencyProfile &
  RelationshipInfluenceProfile &
  RelationshipRiskExposureProfile;

export type RelationshipTypeDefinition = {
  id: NexoraRelationshipType;
  label: string;
  description: string;
  defaultDirection: NexoraRelationshipDirection;
  examples: string[];
};

export type RelationshipPreviewModel = {
  sourceId: string;
  sourceLabel: string;
  targetId: string;
  targetLabel: string;
  type: NexoraRelationshipType;
  typeLabel: string;
  direction: NexoraRelationshipDirection;
  directionLabel: string;
};

export type RelationshipValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type RelationshipCreateRequest = {
  sourceId: string;
  targetId: string;
  type: NexoraRelationshipType;
  direction?: NexoraRelationshipDirection;
  metadata?: Record<string, unknown>;
};

export type RelationshipCreateResult = {
  success: boolean;
  relationship?: NexoraRelationship;
  nextRelationships?: NexoraRelationship[];
  errors?: string[];
  warnings?: string[];
};

export type ObjectRelationshipSummary = {
  incoming: string[];
  outgoing: string[];
  count: number;
};

export type SceneRelationshipEdge = {
  from: string;
  to: string;
  strength: number;
  depth?: number;
  relationshipId?: string;
  type?: NexoraRelationshipType;
  direction?: NexoraRelationshipDirection;
};
