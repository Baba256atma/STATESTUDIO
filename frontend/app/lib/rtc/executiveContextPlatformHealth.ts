/**
 * RTC-1:6 — Executive Context Platform Health.
 *
 * Canonical Runtime health states. Health reporting is informational.
 *
 * Ownership: owned exclusively by RTC-1:6.
 */

/** Canonical health state name. */
export type ExecutiveContextPlatformHealthStateName =
  | "Initializing"
  | "Ready"
  | "Updating"
  | "Recovering"
  | "Archived"
  | "Error";

/** Health state declaration. */
export interface ExecutiveContextPlatformHealthState {
  readonly healthId: `RTC-1:6/Health/${ExecutiveContextPlatformHealthStateName}`;
  readonly state: ExecutiveContextPlatformHealthStateName;
  readonly description: string;
  readonly order: number;
  readonly informational: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const health = (
  state: ExecutiveContextPlatformHealthStateName,
  description: string,
  order: number,
): ExecutiveContextPlatformHealthState =>
  Object.freeze({
    healthId: `RTC-1:6/Health/${state}` as const,
    state,
    description,
    order,
    informational: true as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly six canonical health states. */
export const ExecutiveContextPlatformHealthStates = Object.freeze([
  health("Initializing", "Platform is initializing Runtime services.", 1),
  health("Ready", "Platform is ready for consumer access.", 2),
  health("Updating", "Platform is updating the active context.", 3),
  health("Recovering", "Platform is recovering Runtime consistency.", 4),
  health("Archived", "Platform reports archived Runtime state.", 5),
  health("Error", "Platform reports an informational error state.", 6),
] as const);

export const ExecutiveContextPlatformHealthStateNames = Object.freeze([
  "Initializing",
  "Ready",
  "Updating",
  "Recovering",
  "Archived",
  "Error",
] as const satisfies readonly ExecutiveContextPlatformHealthStateName[]);

/** Health platform catalogue. */
export const ExecutiveContextPlatformHealth = Object.freeze({
  healthId: "RTC-1:6/HealthPlatform",
  states: ExecutiveContextPlatformHealthStates,
  stateCount: ExecutiveContextPlatformHealthStates.length,
  informationalOnly: true as const,
  mutatesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
