export type ExecutiveSceneEveSignalCategory =
  | "Scene"
  | "Visual"
  | "Object"
  | "Timeline"
  | "Camera"
  | "Highlight"
  | "Sketch"
  | "Narration"
  | "Dashboard"
  | "Assistant"
  | "Executive Context"
  | "Awareness";

export type ExecutiveSceneEveMetadata = Readonly<{
  readonly bridgeId: string;
  readonly phaseId: "LAY-CONN-10";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveSceneContext = Readonly<{
  readonly contextId: string;
  readonly sourceContextId: string;
  readonly metadata: ExecutiveSceneEveMetadata;
}>;

export type ExecutiveVisualContext = Readonly<{
  readonly contextId: string;
  readonly sourceContextId: string;
  readonly metadata: ExecutiveSceneEveMetadata;
}>;

export type ExecutiveSceneSignal = Readonly<{
  readonly signalId: string;
  readonly category: ExecutiveSceneEveSignalCategory;
  readonly signalType: string;
  readonly references: readonly string[];
  readonly metadata: ExecutiveSceneEveMetadata;
}>;

export type ExecutiveEveSignal = Readonly<{
  readonly signalId: string;
  readonly category: ExecutiveSceneEveSignalCategory;
  readonly signalType: string;
  readonly references: readonly string[];
  readonly metadata: ExecutiveSceneEveMetadata;
}>;

export type ExecutiveSceneReference = Readonly<{
  readonly referenceId: string;
  readonly referenceType: string;
  readonly sourceId: string;
  readonly metadata: ExecutiveSceneEveMetadata;
}>;

export type ExecutiveObjectReference = ExecutiveSceneReference;
export type ExecutiveCameraReference = ExecutiveSceneReference;
export type ExecutiveTimelineReference = ExecutiveSceneReference;
export type ExecutiveHighlightReference = ExecutiveSceneReference;
export type ExecutiveSketchReference = ExecutiveSceneReference;
export type ExecutiveNarrationReference = ExecutiveSceneReference;

export type ExecutiveSceneEveProvider = Readonly<{
  readonly providerId: string;
  readonly platformId: string;
  readonly certified: boolean;
  readonly futureCompatible: boolean;
}>;

export type ExecutiveSceneEveConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveSceneEveDependency = Readonly<{
  readonly dependencyId: string;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
}>;

export type ExecutiveSceneEveCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
  readonly notes: readonly string[];
}>;

export type ExecutiveSceneEvePolicy = Readonly<{
  readonly policyId: string;
  readonly sceneRuntimeAllowed: boolean;
  readonly visualRuntimeAllowed: boolean;
  readonly signalDispatchAllowed: boolean;
  readonly cameraControlAllowed: boolean;
  readonly objectChangeAllowed: boolean;
  readonly timelinePlaybackAllowed: boolean;
  readonly stateChangeAllowed: boolean;
  readonly extensionMode: "additive-only";
}>;

export type ExecutiveSceneEveSignalBridge = Readonly<{
  readonly bridgeId: string;
  readonly name: string;
  readonly sceneContext: ExecutiveSceneContext;
  readonly visualContext: ExecutiveVisualContext;
  readonly sceneSignals: readonly ExecutiveSceneSignal[];
  readonly eveSignals: readonly ExecutiveEveSignal[];
  readonly references: readonly ExecutiveSceneReference[];
  readonly policy: ExecutiveSceneEvePolicy;
  readonly metadata: ExecutiveSceneEveMetadata;
}>;

export type ExecutiveSceneEveRegistry = Readonly<{
  readonly bridgeId: string;
  readonly providers: readonly ExecutiveSceneEveProvider[];
  readonly consumers: readonly ExecutiveSceneEveConsumer[];
  readonly signalCategories: readonly ExecutiveSceneEveSignalCategory[];
  readonly signalTypes: readonly string[];
  readonly dependencies: readonly ExecutiveSceneEveDependency[];
  readonly compatibilityMatrix: readonly ExecutiveSceneEveCompatibility[];
  readonly versionMetadata: ExecutiveSceneEveMetadata;
  readonly extensionPolicy: ExecutiveSceneEvePolicy;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveSceneEveManifest = Readonly<{
  readonly platformId: string;
  readonly platformVersion: string;
  readonly supportedSignalCategories: readonly ExecutiveSceneEveSignalCategory[];
  readonly supportedSignalTypes: readonly string[];
  readonly registeredProviders: readonly ExecutiveSceneEveProvider[];
  readonly registeredConsumers: readonly ExecutiveSceneEveConsumer[];
  readonly dependencies: readonly ExecutiveSceneEveDependency[];
  readonly compatibility: readonly ExecutiveSceneEveCompatibility[];
  readonly extensionPolicy: ExecutiveSceneEvePolicy;
  readonly releaseMetadata: ExecutiveSceneEveMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveSceneEveValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveSceneEveCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveSceneEveValidation;
  readonly certifiedBridgeId: string;
}>;

export type ExecutiveSceneEveResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveSceneEveValidation;
}>;
