/**
 * INT-1.1 — Intelligence consumer registry.
 * Runtime knows every intelligence consumer — active, prepared, and reserved.
 */

import {
  DASHBOARD_INTELLIGENCE_MODES,
  type DashboardIntelligenceMode,
  type DashboardIntelligencePanelId,
} from "./dashboardIntelligenceContract.ts";
import {
  ACTIVE_INTELLIGENCE_CONSUMER_IDS,
  INTELLIGENCE_CONSUMER_TITLES,
  RESERVED_INTELLIGENCE_CONSUMER_IDS,
  SINGLE_INTELLIGENCE_GATEWAY_SOURCE,
  SINGLE_INTELLIGENCE_SOURCE_VERSION,
  type IntelligenceConsumerId,
  type IntelligenceConsumerLifecycle,
  type IntelligenceConsumerRegistration,
} from "./singleIntelligenceSourceContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

function allModes(): readonly DashboardIntelligenceMode[] {
  return DASHBOARD_INTELLIGENCE_MODES;
}

function allPanels(): readonly DashboardIntelligencePanelId[] {
  return DASHBOARD_INTELLIGENCE_MODES;
}

function buildRegistration(input: {
  consumerId: IntelligenceConsumerId;
  lifecycle: IntelligenceConsumerLifecycle;
  allowedModes?: readonly DashboardIntelligenceMode[];
  allowedPanels?: readonly DashboardIntelligencePanelId[];
  description: string;
}): IntelligenceConsumerRegistration {
  return Object.freeze({
    contractVersion: SINGLE_INTELLIGENCE_SOURCE_VERSION,
    consumerId: input.consumerId,
    title: INTELLIGENCE_CONSUMER_TITLES[input.consumerId],
    description: input.description,
    lifecycle: input.lifecycle,
    allowedModes: Object.freeze(input.allowedModes ?? allModes()),
    allowedPanels: Object.freeze(input.allowedPanels ?? allPanels()),
    registeredAt: nowIso(),
    source: SINGLE_INTELLIGENCE_GATEWAY_SOURCE,
  });
}

const DEFAULT_CONSUMER_REGISTRATIONS: readonly IntelligenceConsumerRegistration[] = Object.freeze([
  buildRegistration({
    consumerId: "dashboard",
    lifecycle: "active",
    description: "Primary dashboard presentation consumer.",
  }),
  buildRegistration({
    consumerId: "assistant",
    lifecycle: "prepared",
    description: "Assistant presentation consumer prepared for gateway-only intelligence.",
  }),
  buildRegistration({
    consumerId: "object_panel",
    lifecycle: "prepared",
    description: "Object panel presentation consumer prepared for gateway-only intelligence.",
  }),
  buildRegistration({
    consumerId: "executive_summary",
    lifecycle: "prepared",
    allowedModes: Object.freeze(["executive_summary", "operational", "risk", "scenario", "kpis"]),
    allowedPanels: Object.freeze(["executive_summary", "operational", "risk", "scenario", "kpis"]),
    description: "Executive summary presentation consumer prepared for gateway-only intelligence.",
  }),
  buildRegistration({
    consumerId: "reports",
    lifecycle: "reserved",
    description: "Reserved future reports consumer.",
  }),
  buildRegistration({
    consumerId: "war_room",
    lifecycle: "reserved",
    description: "Reserved future war room consumer.",
  }),
  buildRegistration({
    consumerId: "timeline",
    lifecycle: "reserved",
    allowedModes: Object.freeze(["timeline"]),
    allowedPanels: Object.freeze(["timeline"]),
    description: "Reserved future timeline consumer.",
  }),
  buildRegistration({
    consumerId: "executive_cards",
    lifecycle: "reserved",
    description: "Reserved future executive cards consumer.",
  }),
  buildRegistration({
    consumerId: "decision_center",
    lifecycle: "reserved",
    description: "Reserved future decision center consumer.",
  }),
  buildRegistration({
    consumerId: "future_ai_panels",
    lifecycle: "reserved",
    description: "Reserved future AI panel consumer.",
  }),
]);

const consumerRegistry = new Map<IntelligenceConsumerId, IntelligenceConsumerRegistration>();
let consumerRegistryVersion = 0;

function seedDefaultConsumers(): void {
  if (consumerRegistry.size > 0) return;
  for (const registration of DEFAULT_CONSUMER_REGISTRATIONS) {
    consumerRegistry.set(registration.consumerId, registration);
  }
  consumerRegistryVersion += 1;
}

export function registerIntelligenceConsumer(
  registration: IntelligenceConsumerRegistration
): IntelligenceConsumerRegistration {
  seedDefaultConsumers();
  consumerRegistry.set(registration.consumerId, Object.freeze({ ...registration }));
  consumerRegistryVersion += 1;
  return consumerRegistry.get(registration.consumerId)!;
}

export function unregisterIntelligenceConsumer(consumerId: IntelligenceConsumerId): boolean {
  seedDefaultConsumers();
  const removed = consumerRegistry.delete(consumerId);
  if (removed) consumerRegistryVersion += 1;
  return removed;
}

export function getIntelligenceConsumer(
  consumerId: IntelligenceConsumerId
): IntelligenceConsumerRegistration | null {
  seedDefaultConsumers();
  return consumerRegistry.get(consumerId) ?? null;
}

export function getIntelligenceConsumers(): readonly IntelligenceConsumerRegistration[] {
  seedDefaultConsumers();
  return Object.freeze(
    [...consumerRegistry.values()].sort((left, right) => left.title.localeCompare(right.title))
  );
}

export function isIntelligenceConsumerRegistered(consumerId: IntelligenceConsumerId): boolean {
  return getIntelligenceConsumer(consumerId) !== null;
}

export function getActiveIntelligenceConsumers(): readonly IntelligenceConsumerRegistration[] {
  return getIntelligenceConsumers().filter((entry) => entry.lifecycle === "active");
}

export function getPreparedIntelligenceConsumers(): readonly IntelligenceConsumerRegistration[] {
  return getIntelligenceConsumers().filter((entry) => entry.lifecycle === "prepared");
}

export function getReservedIntelligenceConsumers(): readonly IntelligenceConsumerRegistration[] {
  return getIntelligenceConsumers().filter((entry) => entry.lifecycle === "reserved");
}

export function getIntelligenceConsumerRegistryVersion(): number {
  seedDefaultConsumers();
  return consumerRegistryVersion;
}

export function resetIntelligenceConsumerRegistryForTests(): void {
  consumerRegistry.clear();
  consumerRegistryVersion = 0;
  seedDefaultConsumers();
}

export const IntelligenceConsumerRegistry = Object.freeze({
  registerIntelligenceConsumer,
  unregisterIntelligenceConsumer,
  getIntelligenceConsumer,
  getIntelligenceConsumers,
  isIntelligenceConsumerRegistered,
  getActiveIntelligenceConsumers,
  getPreparedIntelligenceConsumers,
  getReservedIntelligenceConsumers,
  resetIntelligenceConsumerRegistryForTests,
  ACTIVE_INTELLIGENCE_CONSUMER_IDS,
  RESERVED_INTELLIGENCE_CONSUMER_IDS,
});
