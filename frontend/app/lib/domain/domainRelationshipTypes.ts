export type DomainRelationshipSemantic =
  | "dependency"
  | "flow"
  | "risk"
  | "ownership"
  | "communication"
  | "financial"
  | "control"
  | "support"
  | "monitoring";

export interface DomainRelationshipMeta {
  semantic: DomainRelationshipSemantic;
  strength?: number;
  directional?: boolean;
  executiveLabel?: string;
}
