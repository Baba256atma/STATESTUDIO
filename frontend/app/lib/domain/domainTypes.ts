export type NexoraDomainId =
  | "general"
  | "retail"
  | "finance"
  | "supply_chain"
  | "pmo"
  | "saas_devops"
  | "security"
  | "healthcare_ops";

export type DomainObjectTemplate = {
  id: string;
  label: string;
  role:
    | "core"
    | "input"
    | "process"
    | "constraint"
    | "risk"
    | "decision"
    | "output"
    | "monitor";
  description: string;
  defaultImportance: number;
  aliases: string[];
};

export type DomainRelationshipTemplate = {
  id: string;
  fromRole: DomainObjectTemplate["role"];
  toRole: DomainObjectTemplate["role"];
  relationshipType:
    | "dependency"
    | "flow"
    | "constraint"
    | "risk_path"
    | "decision_path"
    | "feedback";
  description: string;
  strength?: number;
  directional?: boolean;
  visualPriority?: "low" | "medium" | "high";
};

export type DomainRiskSignal = {
  id: string;
  label: string;
  severityHint: "low" | "medium" | "high";
  aliases: string[];
  explanation: string;
};

export type DomainPanelVocabulary = {
  executiveLabel: string;
  riskLabel: string;
  scenarioLabel: string;
  decisionLabel: string;
  objectLabel: string;
  primaryQuestion: string;
};

export type NexoraDomainDefinition = {
  id: NexoraDomainId;
  name: string;
  description: string;
  objectTemplates: DomainObjectTemplate[];
  relationshipTemplates: DomainRelationshipTemplate[];
  riskSignals: DomainRiskSignal[];
  panelVocabulary: DomainPanelVocabulary;
};
