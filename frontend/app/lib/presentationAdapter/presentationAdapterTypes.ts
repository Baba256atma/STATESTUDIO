/**
 * PHASE-13 / PA-1 — Presentation Adapter types.
 * Dumb bridge between frozen EDI/EAI contracts and future UI components.
 */

import type { ExecutiveDashboardResponse, ExecutiveDashboardSession } from "../executiveDashboard/executiveDashboardTypes.ts";
import type { ExecutiveAssistantResponse, ExecutiveAssistantSession } from "../executiveAssistant/executiveAssistantTypes.ts";

export type PresentationAdapterWorkspaceId = string;

export type PresentationAdapterUiEventType =
  | "section_selected"
  | "widget_clicked"
  | "panel_toggled"
  | "message_selected"
  | "conversation_selected"
  | "layout_preference_changed"
  | "custom";

export type PresentationAdapterLifecycleState =
  | "initialized"
  | "mapped"
  | "validated"
  | "available"
  | "deprecated"
  | "archived";

export type PresentationAdapterExtensionPoint = Readonly<{
  taxonomyOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type PresentationAdapterMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  presentationHint: string | null;
  adapterHint: string | null;
  taxonomyOverride: string | null;
  extension: PresentationAdapterExtensionPoint;
}>;

export type PresentationAdapterLocalUiState = Readonly<{
  selectedSection: string | null;
  activeWidgetId: string | null;
  expandedPanels: readonly string[];
  visibleWidgets: Readonly<Record<string, boolean>>;
  selectedConversationId: string | null;
  selectedMessageId: string | null;
  layoutPreferences: Readonly<Record<string, string>>;
}>;

export type PresentationAdapterDashboardWidgetProps = Readonly<{
  widgetId: string;
  widgetType: string;
  title: string;
  displayHint: string | null;
  referenceIds: readonly string[];
  isVisible: boolean;
  metadata: PresentationAdapterMetadata;
}>;

export type PresentationAdapterDashboardSectionProps = Readonly<{
  sectionId: string;
  sectionType: string;
  title: string;
  widgets: readonly PresentationAdapterDashboardWidgetProps[];
  metadata: PresentationAdapterMetadata;
}>;

export type PresentationAdapterDashboardProps = Readonly<{
  contractVersion: string;
  adapterId: string;
  dashboardSessionId: string;
  dashboardResponseId: string;
  workspaceId: PresentationAdapterWorkspaceId;
  executiveModelId: string;
  layoutSummary: string;
  sections: readonly PresentationAdapterDashboardSectionProps[];
  localState: PresentationAdapterLocalUiState;
  metadata: PresentationAdapterMetadata;
  lifecycleState: PresentationAdapterLifecycleState;
  source: "phase-13-presentation-adapter-foundation";
}>;

export type PresentationAdapterChatMessageProps = Readonly<{
  messageId: string;
  role: "assistant";
  text: string;
  referenceKind: string;
  referenceIds: readonly string[];
  metadata: PresentationAdapterMetadata;
}>;

export type PresentationAdapterAssistantChatProps = Readonly<{
  contractVersion: string;
  adapterId: string;
  assistantSessionId: string;
  assistantResponseId: string;
  conversationId: string;
  workspaceId: PresentationAdapterWorkspaceId;
  executiveModelId: string;
  messages: readonly PresentationAdapterChatMessageProps[];
  localState: PresentationAdapterLocalUiState;
  metadata: PresentationAdapterMetadata;
  lifecycleState: PresentationAdapterLifecycleState;
  source: "phase-13-presentation-adapter-foundation";
}>;

export type PresentationAdapterUiEvent = Readonly<{
  eventId: string;
  eventType: PresentationAdapterUiEventType;
  targetId: string;
  workspaceId: PresentationAdapterWorkspaceId | null;
  payload: Readonly<Record<string, string>>;
  metadata: PresentationAdapterMetadata;
  createdAt: string;
  source: "phase-13-presentation-adapter-foundation";
}>;

export type PresentationAdapterDashboardMappingInput = Readonly<{
  dashboardResponse: ExecutiveDashboardResponse;
  dashboardSession?: ExecutiveDashboardSession | null;
  localState?: Partial<PresentationAdapterLocalUiState> | null;
  adapterId?: string;
}>;

export type PresentationAdapterAssistantMappingInput = Readonly<{
  assistantResponse: ExecutiveAssistantResponse;
  assistantSession?: ExecutiveAssistantSession | null;
  localState?: Partial<PresentationAdapterLocalUiState> | null;
  adapterId?: string;
}>;

export type PresentationAdapterUiEventMappingInput = Readonly<{
  eventType: PresentationAdapterUiEventType;
  targetId: string;
  workspaceId?: PresentationAdapterWorkspaceId | null;
  payload?: Readonly<Record<string, string>>;
}>;

export type PresentationAdapterMappingResult<TProps> = Readonly<{
  success: boolean;
  props: TProps | null;
  issues: readonly PresentationAdapterValidationIssue[];
}>;

export type PresentationAdapterValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type PresentationAdapterValidationResult = Readonly<{
  valid: boolean;
  issues: readonly PresentationAdapterValidationIssue[];
}>;

export type PresentationAdapterScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type PresentationAdapterScoreReport = Readonly<{
  contractVersion: string;
  dimensions: PresentationAdapterScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type PresentationAdapterCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type PresentationAdapterCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly PresentationAdapterCertificationCheck[];
  scoreReport: PresentationAdapterScoreReport;
  analysisScoreReport: PresentationAdapterAnalysisScoreReport | null;
  freezeReport: PresentationAdapterFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type PresentationAdapterAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  inputBoundaryIntegrity: number;
  mappingIntegrity: number;
  presentationStateSafety: number;
  reactIndependence: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type PresentationAdapterAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: PresentationAdapterAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type PresentationAdapterFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  uiEventTypesCount: number;
  lifecycleStatesCount: number;
  generatedAt: string;
}>;

export type PresentationAdapterDiagnosticEventType =
  | "AdapterInitialized"
  | "DashboardPropsMapped"
  | "AssistantPropsMapped"
  | "UiEventMapped"
  | "LocalStateUpdated"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type PresentationAdapterDiagnosticEvent = Readonly<{
  type: PresentationAdapterDiagnosticEventType;
  adapterId: string | null;
  workspaceId: PresentationAdapterWorkspaceId | null;
  dashboardSessionId: string | null;
  assistantSessionId: string | null;
  eventId: string | null;
  timestamp: string;
}>;

export type PresentationAdapterDiagnosticLogEntry = Readonly<{
  adapterId: string | null;
  workspaceId: PresentationAdapterWorkspaceId | null;
  dashboardSessionId: string | null;
  assistantSessionId: string | null;
  eventId: string | null;
  event: PresentationAdapterDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
