/**
 * APP-5:6 — Scenario Timeline API Layer domain types.
 */

import type {
  SCENARIO_TIMELINE_API_CATEGORY_KEYS,
  SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
  SCENARIO_TIMELINE_API_STATUS_KEYS,
} from "./scenarioTimelineApiConstants.ts";
import type { CreateTimelineEventInput, ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineHistory } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycle, ScenarioTimelineLifecycleStatus } from "./scenarioTimelineLifecycleTypes.ts";
import type {
  ScenarioTimelineQueryFilters,
  ScenarioTimelineQueryResult,
} from "./scenarioTimelineQueryTypes.ts";
import type {
  ScenarioTimelineScenarioId,
  ScenarioTimelineWorkspaceId,
} from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelineApiCategory = (typeof SCENARIO_TIMELINE_API_CATEGORY_KEYS)[number];
export type ScenarioTimelineApiStatus = (typeof SCENARIO_TIMELINE_API_STATUS_KEYS)[number];

export type ScenarioTimelineApiError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ScenarioTimelineApiWarning = Readonly<{
  code: string;
  message: string;
  readOnly: true;
}>;

export type ScenarioTimelineApiRequestMetadata = Readonly<{
  requestId: string;
  timestamp: string;
  category: ScenarioTimelineApiCategory;
  readOnly: true;
}>;

export type ScenarioTimelineApiResponseMetadata = Readonly<{
  requestId: string;
  timestamp: string;
  platformVersion: typeof SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION;
  contractVersion: typeof SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION;
  apiVersion: typeof SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION;
  category: ScenarioTimelineApiCategory;
  readOnly: true;
}>;

export type ScenarioTimelineApiDiagnostics = Readonly<{
  foundationReady: boolean;
  eventEngineReady: boolean;
  lifecycleEngineReady: boolean;
  historyEngineReady: boolean;
  queryEngineReady: boolean;
  readOnly: true;
}>;

export type ScenarioTimelineApiResponse<T> = Readonly<{
  success: boolean;
  status: ScenarioTimelineApiStatus;
  data: T | null;
  errors: readonly ScenarioTimelineApiError[];
  warnings: readonly ScenarioTimelineApiWarning[];
  metadata: ScenarioTimelineApiResponseMetadata;
  diagnostics: ScenarioTimelineApiDiagnostics;
  readOnly: true;
}>;

export type ScenarioTimelineApiHealth = Readonly<{
  healthy: boolean;
  status: ScenarioTimelineApiStatus;
  enginesReady: ScenarioTimelineApiDiagnostics;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineApiVersionMetadata = Readonly<{
  apiLayerVersion: typeof SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION;
  foundationVersion: string;
  eventEngineVersion: string;
  lifecycleEngineVersion: string;
  historyEngineVersion: string;
  queryEngineVersion: string;
  readOnly: true;
}>;

export type ScenarioTimelineView = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  events: readonly ScenarioTimelineEvent[];
  lifecycle: ScenarioTimelineLifecycle | null;
  history: ScenarioTimelineHistory | null;
  query: ScenarioTimelineQueryResult | null;
  progress: number | null;
  status: ScenarioTimelineLifecycleStatus | null;
  readOnly: true;
}>;

export type ScenarioTimelineApiLayerState = Readonly<{
  layerId: "scenario-timeline-api-layer";
  contractVersion: typeof SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION;
  initialized: boolean;
  registeredRequestCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineApiRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredRequestCount: number;
  requestIds: readonly string[];
  readOnly: true;
}>;

export type ScenarioTimelineApiCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelineApiLayerCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ScenarioTimelineApiCertificationCheck[];
  readOnly: true;
}>;

export type ScenarioTimelineApiContractSurface = Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION;
  categories: readonly ScenarioTimelineApiCategory[];
  consumerMustUseApiLayer: true;
  readOnly: true;
}>;

export type { CreateTimelineEventInput, ScenarioTimelineQueryFilters };
