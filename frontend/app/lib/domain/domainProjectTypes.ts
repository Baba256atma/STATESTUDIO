import type { NexoraDomainId } from "./domainTypes.ts";

export type DomainProjectVersion = "domain-project-v1";

export type DomainProjectSnapshot = {
  version: DomainProjectVersion;
  projectId: string;
  projectName: string;
  activeDomainId: NexoraDomainId;
  createdAt: string;
  updatedAt: string;
  scene: unknown;
  metadata: {
    createdBy: "nexora-domain";
    domainPhase: "domain";
    objectCount: number;
    edgeCount: number;
  };
  derived?: {
    riskSignals?: unknown[];
    fragilityScores?: unknown[];
    scenarios?: unknown[];
    executiveInsights?: unknown[];
  };
};

export type DomainProjectSaveResult = {
  success: boolean;
  snapshot?: DomainProjectSnapshot;
  warnings?: string[];
};

export type DomainProjectLoadResult = {
  success: boolean;
  snapshot?: DomainProjectSnapshot;
  warnings?: string[];
};
