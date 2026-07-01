import { EXECUTIVE_BRAIN_PLATFORM } from "./executiveBrainConstants.ts";
import { EXECUTIVE_BRAIN_CAPABILITIES } from "./executiveBrainCapabilities.ts";
import type {
  ExecutiveBrainEngineDefinition,
  ExecutiveBrainExtensionDefinition,
  ExecutiveBrainPhaseDefinition,
  ExecutiveBrainRegistry,
} from "./executiveBrainTypes.ts";

export const EXECUTIVE_BRAIN_PHASE_REGISTRY: readonly ExecutiveBrainPhaseDefinition[] = Object.freeze([
  Object.freeze({ id: "LAY-1", name: "Executive Brain Foundation", order: 1, status: "current" }),
  Object.freeze({ id: "LAY-2", name: "Executive Reasoning Engine", order: 2, status: "future" }),
  Object.freeze({ id: "LAY-3", name: "Executive Judgment Engine", order: 3, status: "future" }),
  Object.freeze({ id: "LAY-4", name: "Executive Planning Engine", order: 4, status: "future" }),
  Object.freeze({ id: "LAY-5", name: "Executive Coaching Engine", order: 5, status: "future" }),
  Object.freeze({ id: "LAY-6", name: "Executive Thought Partner Engine", order: 6, status: "future" }),
  Object.freeze({ id: "LAY-7", name: "Executive Visual Reasoning Engine", order: 7, status: "future" }),
  Object.freeze({ id: "LAY-8", name: "Executive Communication Engine", order: 8, status: "future" }),
  Object.freeze({ id: "LAY-9", name: "Executive Negotiation Engine", order: 9, status: "future" }),
  Object.freeze({ id: "LAY-10", name: "Executive Creativity Engine", order: 10, status: "future" }),
  Object.freeze({ id: "LAY-11", name: "Executive Learning Engine", order: 11, status: "future" }),
  Object.freeze({ id: "LAY-12", name: "Executive Brain Platform Freeze", order: 12, status: "future" }),
]);

export const EXECUTIVE_BRAIN_ENGINE_REGISTRY: readonly ExecutiveBrainEngineDefinition[] = Object.freeze([
  Object.freeze({ id: "engine:reasoning", name: "Executive Reasoning Engine", capabilityId: "reasoning", futureOwnerPhase: "LAY-2", implemented: false }),
  Object.freeze({ id: "engine:judgment", name: "Executive Judgment Engine", capabilityId: "judgment", futureOwnerPhase: "LAY-3", implemented: false }),
  Object.freeze({ id: "engine:planning", name: "Executive Planning Engine", capabilityId: "planning", futureOwnerPhase: "LAY-4", implemented: false }),
  Object.freeze({ id: "engine:coaching", name: "Executive Coaching Engine", capabilityId: "coaching", futureOwnerPhase: "LAY-5", implemented: false }),
  Object.freeze({ id: "engine:thought-partner", name: "Executive Thought Partner Engine", capabilityId: "thoughtPartner", futureOwnerPhase: "LAY-6", implemented: false }),
  Object.freeze({ id: "engine:visual-reasoning", name: "Executive Visual Reasoning Engine", capabilityId: "visualReasoning", futureOwnerPhase: "LAY-7", implemented: false }),
  Object.freeze({ id: "engine:communication", name: "Executive Communication Engine", capabilityId: "communication", futureOwnerPhase: "LAY-8", implemented: false }),
  Object.freeze({ id: "engine:negotiation", name: "Executive Negotiation Engine", capabilityId: "negotiation", futureOwnerPhase: "LAY-9", implemented: false }),
  Object.freeze({ id: "engine:creativity", name: "Executive Creativity Engine", capabilityId: "creativity", futureOwnerPhase: "LAY-10", implemented: false }),
  Object.freeze({ id: "engine:learning", name: "Executive Learning Engine", capabilityId: "learning", futureOwnerPhase: "LAY-11", implemented: false }),
]);

export const EXECUTIVE_BRAIN_EXTENSION_REGISTRY: readonly ExecutiveBrainExtensionDefinition[] = Object.freeze([
  Object.freeze({ id: "extension:foundation-contracts", name: "Foundation Contract Extension Point", futureOwnerPhase: "LAY-1", enabled: false }),
  Object.freeze({ id: "extension:future-engines", name: "Future Engine Extension Point", futureOwnerPhase: "LAY-2", enabled: false }),
]);

export const EXECUTIVE_BRAIN_REGISTRY: ExecutiveBrainRegistry = Object.freeze({
  platform: EXECUTIVE_BRAIN_PLATFORM,
  phases: EXECUTIVE_BRAIN_PHASE_REGISTRY,
  capabilities: EXECUTIVE_BRAIN_CAPABILITIES,
  engines: EXECUTIVE_BRAIN_ENGINE_REGISTRY,
  extensions: EXECUTIVE_BRAIN_EXTENSION_REGISTRY,
});

export function getExecutiveBrainPlatform(): typeof EXECUTIVE_BRAIN_PLATFORM {
  return EXECUTIVE_BRAIN_PLATFORM;
}

export function getExecutiveBrainCapabilities(): typeof EXECUTIVE_BRAIN_CAPABILITIES {
  return EXECUTIVE_BRAIN_CAPABILITIES;
}

export function getExecutiveBrainRegistry(): ExecutiveBrainRegistry {
  return EXECUTIVE_BRAIN_REGISTRY;
}
