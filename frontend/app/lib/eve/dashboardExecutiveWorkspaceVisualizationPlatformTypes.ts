export interface DashboardExecutiveWorkspacePlatformCapability {
  readonly id: `EVE-6:6/Capability/${string}`;
  readonly name: string;
  readonly description: string;
  readonly manifestReference:
    "EVE-6:5/DashboardExecutiveWorkspaceVisualizationManifest";
  readonly deterministicOrder: number;
  readonly implementationProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspacePlatformGuarantee {
  readonly id: `EVE-6:6/Guarantee/${string}`;
  readonly name: string;
  readonly guaranteed: true;
  readonly manifestReference:
    "EVE-6:5/DashboardExecutiveWorkspaceVisualizationManifest";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspacePlatformCompatibilityEntry {
  readonly id: `EVE-6:6/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
