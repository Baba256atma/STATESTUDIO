/** E2:47 — Executive relationship intelligence contracts (visual + interpretation only). */

import type { NexoraRelationship, NexoraRelationshipType } from "../relationshipTypes";

export type ExecutiveRelationshipClassification =
  | "DEPENDENCY"
  | "INFLUENCE"
  | "SUPPLY"
  | "RISK"
  | "INFORMATION"
  | "CONTROL";

export type RelationshipVisualEmphasis = "PRIMARY" | "SECONDARY" | "BACKGROUND";

export type RelationshipDensityMode = "FULL" | "FOCUSED" | "EXECUTIVE";

export type ExecutiveDependencyDirection = "upstream" | "downstream" | "bidirectional";

export type RelationshipFocusRole =
  | "direct_dependency"
  | "critical_influence"
  | "major_risk_route"
  | "connected_context"
  | "unrelated";

export type ExecutiveRelationshipMetadata = {
  relationshipId: string;
  relationshipImportance: number;
  relationshipType: ExecutiveRelationshipClassification;
  relationshipStrength: number;
  dependencyDirection: ExecutiveDependencyDirection;
  propagationPotential: number;
};

export type RelationshipVisualProfile = {
  emphasis: RelationshipVisualEmphasis;
  opacity: number;
  lineWidthMultiplier: number;
  showLabel: boolean;
  glow: boolean;
};

export type RelationshipRenderPlan = {
  relationshipId: string;
  visible: boolean;
  showLabel: boolean;
  emphasis: RelationshipVisualEmphasis;
  focusRole: RelationshipFocusRole;
  opacity: number;
  lineWidthMultiplier: number;
  glow: boolean;
  classification: ExecutiveRelationshipClassification;
  executiveLabel: string;
};

export type ExecutiveRelationshipScenePlan = {
  densityMode: RelationshipDensityMode;
  relationshipCount: number;
  visibleCount: number;
  plans: Record<string, RelationshipRenderPlan>;
};

export type RelationshipContextEntry = {
  relationshipId: string;
  executiveLabel: string;
  connectedObjectLabel: string;
  classification: ExecutiveRelationshipClassification;
  importance: number;
};

export type RelationshipContextSnapshot = {
  mostInfluentialConnection: RelationshipContextEntry | null;
  mostCriticalDependency: RelationshipContextEntry | null;
  highestRiskRelationship: RelationshipContextEntry | null;
};

export type ExecutiveRelationshipSceneInput = {
  relationships: NexoraRelationship[];
  selectedObjectId?: string | null;
  selectedRelationshipId?: string | null;
  densityMode?: RelationshipDensityMode;
  objectCount?: number;
};

export type RelationshipContextInput = {
  relationships: NexoraRelationship[];
  objectId: string;
  objectLabels?: Map<string, string>;
};

export type RelationshipPropagationContract = {
  relationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  classification: ExecutiveRelationshipClassification;
  propagationPotential: number;
  direction: ExecutiveDependencyDirection;
  readyForRiskPropagation: boolean;
  readyForScenarioPropagation: boolean;
  readyForOperationalImpactFlow: boolean;
};

export type RelationshipAnimationContract = {
  relationshipId: string;
  supportedAnimations: Array<
    "risk_movement" | "signal_flow" | "decision_propagation" | "dependency_tracing"
  >;
  rendererKind: "html" | "three" | "hybrid";
  enabled: boolean;
};

export const CLASSIFICATION_EXECUTIVE_LABELS: Record<ExecutiveRelationshipClassification, string> = {
  DEPENDENCY: "Operational Dependency",
  INFLUENCE: "Influence Path",
  SUPPLY: "Supply Link",
  RISK: "Risk Channel",
  INFORMATION: "Information Link",
  CONTROL: "Control Link",
};

export const TYPE_TO_CLASSIFICATION: Partial<Record<NexoraRelationshipType, ExecutiveRelationshipClassification>> = {
  dependency: "DEPENDENCY",
  blocks: "DEPENDENCY",
  supports: "DEPENDENCY",
  reports_to: "CONTROL",
  owns: "CONTROL",
  ownership: "CONTROL",
  influences: "INFLUENCE",
  information: "INFORMATION",
  flow: "SUPPLY",
  supplies: "SUPPLY",
  resource: "SUPPLY",
  risk: "RISK",
  custom: "DEPENDENCY",
};
