export type DashboardExecutiveWorkspaceContractName =
  | "ExecutiveWorkspaceContract" | "WorkspaceIdentityContract"
  | "WorkspaceLayoutContract" | "WorkspaceZoneContract"
  | "WorkspaceSectionContract" | "DashboardContract"
  | "DashboardLayoutContract" | "DashboardTemplateContract"
  | "DashboardWidgetContract" | "DashboardPanelContract"
  | "ExecutiveCardContract" | "KPIPanelContract" | "ChartPanelContract"
  | "TimelinePanelContract" | "GraphPanelContract" | "NavigationPanelContract"
  | "FilterPanelContract" | "WorkspaceContextContract" | "DashboardOutputContract"
  | "WorkspaceExportContract" | "WorkspacePresentationContract"
  | "DashboardExtensionContract";

export type DashboardExecutiveWorkspaceLifecycleState =
  | "Declared" | "Structured" | "Prepared" | "Published" | "Retired";

export interface DashboardExecutiveWorkspaceContractDeclaration {
  readonly id: `EVE-6:1/Contract/${DashboardExecutiveWorkspaceContractName}`;
  readonly canonicalName: string;
  readonly namespace: `nexora.eve.dashboard-executive-workspace-visualization.foundation.contract.${string}`;
  readonly version: "1.0.0";
  readonly ownership: unknown;
  readonly lifecycle: unknown;
  readonly capabilityReferences: readonly unknown[];
  readonly boundaryReferences: readonly unknown[];
  readonly structuralMetadata: readonly string[];
  readonly compatibilityMetadata: Readonly<{ eveFiveCompatible: true }>;
  readonly extensionMetadata: Readonly<{ classification: string }>;
  readonly deterministicOrder: number;
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
