/**
 * INT-1:1 — Import Lifecycle.
 *
 * The nine canonical, ordered import-session lifecycle states and an immutable
 * transition map. Transition validation is pure and deterministic: invalid
 * transitions return a structured failure result and never throw for ordinary
 * workflow mistakes. Failure and cancellation transitions are explicitly
 * controlled.
 *
 * Ownership: owned exclusively by INT-1.
 * Dependency rules: depends only on INT-1 foundation types and diagnostics.
 */

import { buildDiagnostic, DIAGNOSTIC_CODES } from "./csvManualInputDiagnostics.ts";
import type {
  ImportLifecycleState,
  ImportResult,
  LifecycleTransitionMap,
} from "./csvManualInputFoundationTypes.ts";

const STATES: readonly ImportLifecycleState[] = Object.freeze([
  "Created",
  "InputAccepted",
  "Parsing",
  "PreviewReady",
  "AwaitingConfirmation",
  "Confirmed",
  "Completed",
  "Failed",
  "Cancelled",
]);

// Every non-terminal state may also fail or be cancelled explicitly. The three
// terminal states (Completed, Failed, Cancelled) have no outgoing transitions.
const TRANSITIONS: LifecycleTransitionMap = Object.freeze({
  Created: Object.freeze<ImportLifecycleState[]>(["InputAccepted", "Failed", "Cancelled"]),
  InputAccepted: Object.freeze<ImportLifecycleState[]>(["Parsing", "Failed", "Cancelled"]),
  Parsing: Object.freeze<ImportLifecycleState[]>(["PreviewReady", "Failed", "Cancelled"]),
  PreviewReady: Object.freeze<ImportLifecycleState[]>(["AwaitingConfirmation", "Failed", "Cancelled"]),
  AwaitingConfirmation: Object.freeze<ImportLifecycleState[]>(["Confirmed", "Failed", "Cancelled"]),
  Confirmed: Object.freeze<ImportLifecycleState[]>(["Completed", "Failed", "Cancelled"]),
  Completed: Object.freeze<ImportLifecycleState[]>([]),
  Failed: Object.freeze<ImportLifecycleState[]>([]),
  Cancelled: Object.freeze<ImportLifecycleState[]>([]),
});

const INITIAL_STATE: ImportLifecycleState = "Created";
const TERMINAL_STATES: readonly ImportLifecycleState[] = Object.freeze([
  "Completed",
  "Failed",
  "Cancelled",
]);

const isKnownState = (state: string): state is ImportLifecycleState =>
  (STATES as readonly string[]).includes(state);

const canTransition = (from: ImportLifecycleState, to: ImportLifecycleState): boolean =>
  TRANSITIONS[from].includes(to);

const validateTransition = (
  from: ImportLifecycleState,
  to: ImportLifecycleState,
): ImportResult<ImportLifecycleState> => {
  if (!isKnownState(from) || !isKnownState(to) || !canTransition(from, to)) {
    return Object.freeze({
      outcome: "Failure",
      diagnostics: Object.freeze([
        buildDiagnostic(DIAGNOSTIC_CODES.LIFECYCLE_INVALID_TRANSITION, {
          field: `${from}->${to}`,
          message: `Transition ${from} -> ${to} is not allowed.`,
        }),
      ]),
    });
  }
  return Object.freeze({
    outcome: "Success",
    value: to,
    diagnostics: Object.freeze([]),
  });
};

/** The immutable INT-1 lifecycle: states, transitions, and pure validation. */
export const CsvManualInputLifecycle = Object.freeze({
  states: STATES,
  initialState: INITIAL_STATE,
  terminalStates: TERMINAL_STATES,
  transitions: TRANSITIONS,
  isKnownState,
  canTransition,
  validateTransition,
});
