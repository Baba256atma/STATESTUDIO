export const ExecutiveTimelineExperienceFoundationAllowedSurfaces =
  Object.freeze([
    "metadata",
    "contracts",
    "lifecycle",
    "identities",
    "capability declarations",
  ] as const);

export const ExecutiveTimelineExperienceFoundationProhibitedSurfaces =
  Object.freeze([
    "runtime",
    "RTC",
    "rendering",
    "persistence",
    "networking",
    "providers",
    "AI execution",
  ] as const);

export const ExecutiveTimelineExperienceFoundationBoundaries = Object.freeze({
  boundariesId: "EX-3:1/ExecutiveTimelineExperienceFoundationBoundaries" as const,
  allowed: ExecutiveTimelineExperienceFoundationAllowedSurfaces,
  prohibited: ExecutiveTimelineExperienceFoundationProhibitedSurfaces,
  metadataOnly: true as const,
  contractsAllowed: true as const,
  lifecycleAllowed: true as const,
  identitiesAllowed: true as const,
  capabilityDeclarationsAllowed: true as const,
  runtime: false as const,
  rtc: false as const,
  rendering: false as const,
  uiRendering: false as const,
  animationImplementation: false as const,
  persistence: false as const,
  networking: false as const,
  providers: false as const,
  aiExecution: false as const,
  telemetry: false as const,
  clocks: false as const,
  randomness: false as const,
  scenarioSimulation: false as const,
  decisionGeneration: false as const,
  directRuntimeImportOfEx1OrEx2: false as const,
  createsOrAuthorizesEx32: false as const,
  sideEffectFree: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
});
