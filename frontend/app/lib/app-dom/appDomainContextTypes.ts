export type AppDomainSelectionMode = "single" | "multiple";
export type AppDomainSelectionScope = "workspace" | "scenario" | "executive-session" | "simulation" | "future-app-engine";

export type AppDomainSelectionCriteria = Readonly<{
  scope: AppDomainSelectionScope;
  mode: AppDomainSelectionMode;
  requestedDomainIds: readonly string[];
  consumerId: string;
  contextLabel: string;
}>;

export type AppDomainContextSelection = Readonly<{
  criteria: AppDomainSelectionCriteria;
  selectedDomainIds: readonly string[];
  rejectedDomainIds: readonly string[];
  availableDomainIds: readonly string[];
  metadataOnly: true;
}>;

export type AppDomainContextSnapshot = Readonly<{
  contextId: string;
  scope: AppDomainSelectionScope;
  mode: AppDomainSelectionMode;
  selectedDomainIds: readonly string[];
  mappedPlatformVersion: string;
  mappedPackageCount: number;
  immutable: true;
  metadataOnly: true;
}>;

export type AppDomainContextValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    message: string;
  }>[];
}>;

export type AppDomainContext = Readonly<{
  contextId: string;
  selection: AppDomainContextSelection;
  snapshot: AppDomainContextSnapshot;
  validation: AppDomainContextValidation;
  immutable: true;
  metadataOnly: true;
}>;

export type AppDomainContextResult<T> = Readonly<{
  success: boolean;
  value: T;
  validation: AppDomainContextValidation;
}>;

export type AppDomainContextManifest = Readonly<{
  contextIdentity: "APP-DOM-3 Domain Context Selection Layer";
  selectionMode: AppDomainSelectionMode;
  selectionScope: AppDomainSelectionScope;
  mappedPlatform: string;
  mappedPackages: readonly string[];
  consumerMetadata: Readonly<{
    appLayerId: "APP";
    bridgePhase: "APP-DOM-1";
    mappingPhase: "APP-DOM-2";
    contextPhase: "APP-DOM-3";
    metadataOnly: true;
  }>;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;
