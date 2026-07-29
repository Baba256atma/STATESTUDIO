/**
 * EX-1:6 — Executive Stage Runtime Bridge.
 *
 * Synchronises the Stage with the Executive Context Runtime.
 * Consumes only executiveContextRuntimePublicIndex.
 * Never mutates Runtime state.
 *
 * Ownership: owned exclusively by EX-1:6.
 */

import { executiveContextRuntimePublicIndex } from "../rtc/executiveContextRuntimePublicIndex.ts";

/** Runtime Bridge responsibility declaration. */
export interface ExecutiveStageRuntimeBridgeResponsibility {
  readonly responsibilityId: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly mutatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const responsibility = (
  name: string,
  description: string,
  order: number,
): ExecutiveStageRuntimeBridgeResponsibility =>
  Object.freeze({
    responsibilityId: `EX-1:6/RuntimeBridge/Responsibility/${String(order).padStart(2, "0")}`,
    name,
    description,
    order,
    mutatesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Runtime Bridge responsibilities. */
export const ExecutiveStageRuntimeBridgeResponsibilities = Object.freeze([
  responsibility(
    "Subscribe to Runtime updates",
    "Subscribe to Runtime Public Index update notifications.",
    1,
  ),
  responsibility(
    "Receive active context",
    "Receive the active Executive Context identity.",
    2,
  ),
  responsibility(
    "Receive focus updates",
    "Receive executive focus updates from Runtime.",
    3,
  ),
  responsibility(
    "Receive workspace changes",
    "Receive workspace change notifications from Runtime.",
    4,
  ),
  responsibility(
    "Receive timeline updates",
    "Receive timeline update notifications from Runtime.",
    5,
  ),
  responsibility(
    "Notify rendering pipeline",
    "Notify the Stage rendering coordinator of Runtime changes.",
    6,
  ),
] as const);

/**
 * Canonical Runtime Bridge — single bridge identity.
 * Sole Runtime dependency: executiveContextRuntimePublicIndex.
 */
export const ExecutiveStageRuntimeBridge = Object.freeze({
  bridgeId: "EX-1:6/RuntimeBridge",
  bridgeCount: 1 as const,
  name: "Executive Stage Runtime Bridge",
  description:
    "One-directional bridge from Executive Context Runtime Public Index to Stage platform services.",
  runtimePublicIndex: executiveContextRuntimePublicIndex,
  runtimeDependency: "executiveContextRuntimePublicIndex" as const,
  runtimePublicIndexId: executiveContextRuntimePublicIndex.id,
  runtimePublicIndexNamespace: executiveContextRuntimePublicIndex.namespace,
  runtimePublicIndexVersion: executiveContextRuntimePublicIndex.version,
  responsibilities: ExecutiveStageRuntimeBridgeResponsibilities,
  responsibilityCount: ExecutiveStageRuntimeBridgeResponsibilities.length,
  statePropagationDirection: "RuntimeToStage" as const,
  mutatesRuntime: false as const,
  ownsRuntimeState: false as const,
  importsFoundation: false as const,
  importsRegistry: false as const,
  importsModel: false as const,
  importsValidation: false as const,
  importsManifest: false as const,
  importsCertification: false as const,
  importsFreeze: false as const,
  contractsOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
