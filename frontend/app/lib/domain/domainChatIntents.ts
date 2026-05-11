import type { NexoraDomainId } from "./domainTypes.ts";

export type DomainChatIntent =
  | "create_object"
  | "connect_objects"
  | "analyze_risk"
  | "open_panel"
  | "unknown";

export type DomainChatEntity = {
  label: string;
  matchedTemplateId?: string;
  matchedDomainId?: string;
  confidence: number;
};

export type DomainChatInterpretation = {
  rawText: string;
  detectedDomainId: NexoraDomainId;
  intent: DomainChatIntent;
  entities: DomainChatEntity[];
  confidence: number;
  suggestedActions: {
    type:
      | "ADD_DOMAIN_OBJECT"
      | "CONNECT_DOMAIN_OBJECTS"
      | "OPEN_PANEL";
    payload?: unknown;
  }[];
  warnings?: string[];
};
