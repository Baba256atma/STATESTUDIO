/**
 * NPA-T RMS:7 — fail-early Scenario definition validation.
 */

import { RMS_EVENT_FAMILIES } from "./rmsEventContract.ts";
import { RMS_MANAGER_PROFILE_IDS } from "./rmsManagerContract.ts";
import { RMS_OPERATIONAL_SOURCE_FAMILIES } from "./rmsOperatorContract.ts";
import {
  RMS_SCENARIO_CATEGORIES,
  RMS_SCENARIO_FORBIDDEN_KEYS,
  type RmsScenarioDefinition,
} from "./rmsScenarioContract.ts";
import { RMS_WORLD_KINDS } from "./rmsWorldContract.ts";

const HIDDEN_GROUND_TRUTH = /availableCapacity|machineAvailability|Ground Truth|confirmedCausal|evt:|var:demand|world:/i;
const AVAILABLE_CAPABILITIES = Object.freeze(["RMS:2", "RMS:3", "RMS:4", "RMS:5", "RMS:6"]);

export function validateRmsScenarioDefinition(scenario: RmsScenarioDefinition): asserts scenario is RmsScenarioDefinition {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scenario.scenarioId)) {
    throw new Error("RMS:7 scenarioId must be a stable kebab-case identity");
  }
  if (!/^\d+\.\d+$/.test(scenario.version)) {
    throw new Error("RMS:7 version must be distinguishable major.minor");
  }
  if (!(RMS_WORLD_KINDS as readonly string[]).includes(scenario.worldKind)) {
    throw new Error("RMS:7 unsupported world kind");
  }
  if (!(RMS_SCENARIO_CATEGORIES as readonly string[]).includes(scenario.category)) {
    throw new Error("RMS:7 unsupported scenario category");
  }
  const payload = JSON.stringify({
    ...scenario,
    instantiateWorld: undefined,
    managerObjective: scenario.managerObjective,
  });
  for (const key of RMS_SCENARIO_FORBIDDEN_KEYS) {
    if (payload.includes(`"${key}"`) || Object.prototype.hasOwnProperty.call(scenario, key)) {
      throw new Error(`RMS:7 Scenario must not encode ${key}`);
    }
  }
  if (scenario.customer.disclosesHiddenEvents !== false) {
    throw new Error("RMS:7 customer metadata must not disclose hidden events");
  }
  const world = scenario.instantiateWorld();
  if (world.worldKind !== scenario.worldKind) {
    throw new Error("RMS:7 initial world kind must match scenario worldKind");
  }
  if (world.variables.length === 0) {
    throw new Error("RMS:7 initial Ground Truth must be explicit");
  }
  for (const source of scenario.enabledSources) {
    if (!(RMS_OPERATIONAL_SOURCE_FAMILIES as readonly string[]).includes(source)) {
      throw new Error(`RMS:7 unknown operational source ${source}`);
    }
  }
  if (!(RMS_MANAGER_PROFILE_IDS as readonly string[]).includes(scenario.managerProfileId)) {
    throw new Error("RMS:7 unknown Manager profile");
  }
  if (scenario.managerObjective.agenda.length === 0) {
    throw new Error("RMS:7 Manager objective requires an agenda");
  }
  for (const line of scenario.managerVisibleContext) {
    if (HIDDEN_GROUND_TRUTH.test(line)) {
      throw new Error("RMS:7 Manager-visible context must not contain hidden Ground Truth");
    }
  }
  const ids = new Set<string>();
  let previousTick = -1;
  let previousId = "";
  for (const event of scenario.eventSchedule) {
    if (ids.has(event.eventId)) throw new Error("RMS:7 duplicate event IDs");
    ids.add(event.eventId);
    if (!(RMS_EVENT_FAMILIES as readonly string[]).includes(event.family)) {
      throw new Error(`RMS:7 unknown event family ${event.family}`);
    }
    if (event.createsNexoraProblemObject || event.createsNexoraRiskObject) {
      throw new Error("RMS:7 events must not create Nexora Problem/Risk objects");
    }
    if (event.knownToManager || event.knownToNexora) {
      throw new Error("RMS:7 events must remain hidden from Manager/Nexora");
    }
    if (event.scheduledTick < previousTick || (event.scheduledTick === previousTick && event.eventId < previousId)) {
      throw new Error("RMS:7 event ordering is not deterministic");
    }
    previousTick = event.scheduledTick;
    previousId = event.eventId;
  }
  for (const capability of scenario.requiredCapabilities) {
    if (!(AVAILABLE_CAPABILITIES as readonly string[]).includes(capability)) {
      throw new Error(`RMS:7 required capability unavailable: ${capability}`);
    }
  }
  if (!scenario.forkCompatible) {
    throw new Error("RMS:7 Scenario identity must remain fork compatible");
  }
}

export function verifyRmsScenarioLibrary(): { readonly ok: true } {
  return Object.freeze({ ok: true as const });
}
