export const APP_DOMAIN_BRIDGE_IDENTITY = Object.freeze({
  bridgeId: "app-dom-bridge",
  bridgeName: "APP to DOM Domain Expertise Consumer Bridge",
  phaseId: "APP-DOM-1",
  appLayerId: "APP",
  consumedLayerId: "DOM",
  metadataOnly: true,
  runtimeBehavior: false,
});

export const APP_DOMAIN_CONSUMED_PLATFORM = Object.freeze({
  facadeName: "DomainExpertisePlatformFreeze",
  expectedPlatformId: "nexora-domain-expertise-platform",
  supportedPlatformVersion: "DOM-8",
  supportedApiVersion: "APP-DOM-1",
});

export const APP_DOMAIN_CONSUMER_METADATA = Object.freeze({
  consumerId: "nexora-app-domain-consumer",
  consumerName: "Nexora APP Domain Expertise Consumer",
  appLayerId: "APP",
  consumedLayerId: "DOM",
  metadataOnly: true,
  reasoning: false,
  recommendations: false,
  aiLogic: false,
  runtimeExecution: false,
});
