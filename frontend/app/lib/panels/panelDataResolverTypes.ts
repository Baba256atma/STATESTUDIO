import type { RightPanelView } from "../ui/right-panel/rightPanelTypes";
import type {
  AdvicePanelData,
  ApprovalPanelData,
  ComparePanelData,
  DashboardPanelData,
  GovernancePanelData,
  MemoryPanelData,
  OrgMemoryPanelData,
  PanelSharedData as ContractPanelSharedData,
  PolicyPanelData,
  ReplayPanelData,
  RiskPanelData,
  SimulationPanelData,
  StrategicCommandPanelData,
  StrategicLearningPanelData,
  TimelinePanelData,
  CouncilPanelData,
} from "./panelDataContract";

export type PanelSafeStatus =
  | "ready"
  | "partial"
  | "fallback"
  | "empty_but_guided";

export type PanelSharedData = ContractPanelSharedData;

export type PanelResolvedData<T = unknown> = {
  status: PanelSafeStatus;
  title?: string | null;
  message?: string | null;
  data: T | null;
  missingFields: string[];
  suggestedActionLabel?: string | null;
};

export type ResolvedPanelName = Exclude<RightPanelView, null>;

export type ResolverAwarePanelData =
  | AdvicePanelData
  | ApprovalPanelData
  | ComparePanelData
  | CouncilPanelData
  | DashboardPanelData
  | GovernancePanelData
  | MemoryPanelData
  | OrgMemoryPanelData
  | PolicyPanelData
  | ReplayPanelData
  | RiskPanelData
  | SimulationPanelData
  | StrategicCommandPanelData
  | StrategicLearningPanelData
  | TimelinePanelData;
