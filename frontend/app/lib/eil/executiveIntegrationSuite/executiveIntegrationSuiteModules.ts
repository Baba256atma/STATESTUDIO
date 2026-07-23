/**
 * EIL-8:1 — Executive Integration Suite Modules.
 *
 * Exactly seven suite members referencing EIL-1..EIL-7 Public Indexes only.
 * Composition metadata only. No runtime integration.
 *
 * Ownership: owned exclusively by EIL-8:1.
 */

import {
  IntegrationPublicApiCount,
  IntegrationPublicIndexIdentity,
  IntegrationPublicIndexPlatform,
} from "../integrationPublicIndex.ts";
import {
  IntegrationConnectorPublicApiCount,
  IntegrationConnectorPublicIndexIdentity,
  IntegrationConnectorPublicIndexPlatform,
} from "../integrationConnectorPublicIndex.ts";
import {
  IntegrationRoutingPublicApiCount,
  IntegrationRoutingPublicIndexIdentity,
  IntegrationRoutingPublicIndexPlatform,
} from "../integrationRoutingPublicIndex.ts";
import {
  IntegrationOrchestrationPublicApiCount,
  IntegrationOrchestrationPublicIndexIdentity,
  IntegrationOrchestrationPublicIndexPlatform,
} from "../integrationOrchestrationPublicIndex.ts";
import {
  IntegrationPolicyGovernancePublicApiCount,
  IntegrationPolicyGovernancePublicIndexIdentity,
  IntegrationPolicyGovernancePublicIndexPlatform,
} from "../integrationPolicyGovernancePublicIndex.ts";
import {
  IntegrationObservabilityPublicApiCount,
  IntegrationObservabilityPublicIndex,
  IntegrationObservabilityPublicIndexIdentity,
} from "../integrationObservability/integrationObservabilityPublicIndex.ts";
import {
  IntegrationGovernancePublicApiCount,
  IntegrationGovernancePublicIndex,
  IntegrationGovernancePublicIndexIdentity,
} from "../integrationGovernance/integrationGovernancePublicIndex.ts";

/** Closed suite-module key vocabulary. */
export type SuiteModuleKey =
  | "EIL-1"
  | "EIL-2"
  | "EIL-3"
  | "EIL-4"
  | "EIL-5"
  | "EIL-6"
  | "EIL-7";

/** Immutable suite module membership descriptor. */
export interface ExecutiveIntegrationSuiteModule {
  readonly moduleId: `EIL-8:1/Module/${SuiteModuleKey}`;
  readonly moduleKey: SuiteModuleKey;
  readonly canonicalName: string;
  readonly stageId: string;
  readonly publicIndexId: string;
  readonly publicIndexName: string;
  readonly publicIndexNamespace: string;
  readonly publicIndexVersion: string;
  readonly publicIndexModule: string;
  readonly publicIndexEntryPoint: string;
  readonly publicApiCount: number;
  readonly publicIndexAggregate: unknown;
  readonly publicIndexIdentity: unknown;
  readonly referencesPublicIndexOnly: true;
  readonly bypassesPublicIndex: false;
  readonly reconstructsUpstream: false;
  readonly duplicatesArchitecture: false;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const moduleMember = (
  moduleKey: SuiteModuleKey,
  canonicalName: string,
  stageId: string,
  identity: {
    readonly canonicalId: string;
    readonly name: string;
    readonly namespace: string;
    readonly version: string;
  },
  publicIndexModule: string,
  publicIndexEntryPoint: string,
  publicApiCount: number,
  publicIndexAggregate: unknown,
  order: number,
): ExecutiveIntegrationSuiteModule =>
  Object.freeze({
    moduleId: `EIL-8:1/Module/${moduleKey}` as const,
    moduleKey,
    canonicalName,
    stageId,
    publicIndexId: identity.canonicalId,
    publicIndexName: identity.name,
    publicIndexNamespace: identity.namespace,
    publicIndexVersion: identity.version,
    publicIndexModule,
    publicIndexEntryPoint,
    publicApiCount,
    publicIndexAggregate,
    publicIndexIdentity: identity,
    referencesPublicIndexOnly: true as const,
    bypassesPublicIndex: false as const,
    reconstructsUpstream: false as const,
    duplicatesArchitecture: false as const,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly seven suite members. Each references its Public Index only.
 */
export const ExecutiveIntegrationSuiteModules: readonly ExecutiveIntegrationSuiteModule[] =
  Object.freeze([
    moduleMember(
      "EIL-1",
      "Integration",
      "EIL-1:9",
      IntegrationPublicIndexIdentity,
      "integrationPublicIndex.ts",
      "frontend/app/lib/eil/integrationPublicIndex",
      IntegrationPublicApiCount,
      IntegrationPublicIndexPlatform,
      1,
    ),
    moduleMember(
      "EIL-2",
      "Integration Connector",
      "EIL-2:9",
      IntegrationConnectorPublicIndexIdentity,
      "integrationConnectorPublicIndex.ts",
      "frontend/app/lib/eil/integrationConnectorPublicIndex",
      IntegrationConnectorPublicApiCount,
      IntegrationConnectorPublicIndexPlatform,
      2,
    ),
    moduleMember(
      "EIL-3",
      "Integration Routing",
      "EIL-3:9",
      IntegrationRoutingPublicIndexIdentity,
      "integrationRoutingPublicIndex.ts",
      "frontend/app/lib/eil/integrationRoutingPublicIndex",
      IntegrationRoutingPublicApiCount,
      IntegrationRoutingPublicIndexPlatform,
      3,
    ),
    moduleMember(
      "EIL-4",
      "Integration Orchestration",
      "EIL-4:9",
      IntegrationOrchestrationPublicIndexIdentity,
      "integrationOrchestrationPublicIndex.ts",
      "frontend/app/lib/eil/integrationOrchestrationPublicIndex",
      IntegrationOrchestrationPublicApiCount,
      IntegrationOrchestrationPublicIndexPlatform,
      4,
    ),
    moduleMember(
      "EIL-5",
      "Integration Policy & Governance",
      "EIL-5:9",
      IntegrationPolicyGovernancePublicIndexIdentity,
      "integrationPolicyGovernancePublicIndex.ts",
      "frontend/app/lib/eil/integrationPolicyGovernancePublicIndex",
      IntegrationPolicyGovernancePublicApiCount,
      IntegrationPolicyGovernancePublicIndexPlatform,
      5,
    ),
    moduleMember(
      "EIL-6",
      "Integration Observability",
      "EIL-6:9",
      IntegrationObservabilityPublicIndexIdentity,
      "integrationObservabilityPublicIndex.ts",
      "frontend/app/lib/eil/integrationObservability/integrationObservabilityPublicIndex",
      IntegrationObservabilityPublicApiCount,
      IntegrationObservabilityPublicIndex,
      6,
    ),
    moduleMember(
      "EIL-7",
      "Integration Governance",
      "EIL-7:9",
      IntegrationGovernancePublicIndexIdentity,
      "integrationGovernancePublicIndex.ts",
      "frontend/app/lib/eil/integrationGovernance/integrationGovernancePublicIndex",
      IntegrationGovernancePublicApiCount,
      IntegrationGovernancePublicIndex,
      7,
    ),
  ]);
