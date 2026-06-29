/**
 * APP-6:7 — Decision Comparison diff detection.
 * Report-only difference detection over DecisionState pairs.
 */

import type { DecisionState } from "./decisionStateTypes.ts";
import type { DecisionFieldDiff } from "./decisionComparisonTypes.ts";

function createFieldDiff<T>(left: T, right: T): DecisionFieldDiff<T> {
  return Object.freeze({
    changed: left !== right,
    left,
    right,
    readOnly: true as const,
  });
}

function validationMessagesEqual(
  left: readonly string[],
  right: readonly string[]
): boolean {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((message, index) => message === right[index]);
}

export function detectLifecycleDiff(
  left: DecisionState,
  right: DecisionState
): DecisionFieldDiff<DecisionState["currentLifecycle"]> {
  return createFieldDiff(left.currentLifecycle, right.currentLifecycle);
}

export function detectStatusDiff(
  left: DecisionState,
  right: DecisionState
): DecisionFieldDiff<DecisionState["currentStatus"]> {
  return createFieldDiff(left.currentStatus, right.currentStatus);
}

export function detectVersionDiff(
  left: DecisionState,
  right: DecisionState
): DecisionFieldDiff<string> {
  return createFieldDiff(left.currentVersion, right.currentVersion);
}

export function detectTerminalDiff(
  left: DecisionState,
  right: DecisionState
): DecisionFieldDiff<boolean> {
  return createFieldDiff(left.isTerminal, right.isTerminal);
}

export function detectValidationDiff(
  left: DecisionState,
  right: DecisionState
): DecisionFieldDiff<boolean> {
  return Object.freeze({
    changed:
      left.isValid !== right.isValid ||
      !validationMessagesEqual(left.validationMessages, right.validationMessages),
    left: left.isValid,
    right: right.isValid,
    readOnly: true as const,
  });
}

export function buildComparisonValidationMessages(
  left: DecisionState,
  right: DecisionState
): readonly string[] {
  const messages: string[] = [];
  const lifecycleDiff = detectLifecycleDiff(left, right);
  const statusDiff = detectStatusDiff(left, right);
  const versionDiff = detectVersionDiff(left, right);
  const terminalDiff = detectTerminalDiff(left, right);
  const validationDiff = detectValidationDiff(left, right);

  if (lifecycleDiff.changed) {
    messages.push(`Lifecycle differs: ${String(lifecycleDiff.left)} vs ${String(lifecycleDiff.right)}.`);
  }
  if (statusDiff.changed) {
    messages.push(`Status differs: ${statusDiff.left} vs ${statusDiff.right}.`);
  }
  if (versionDiff.changed) {
    messages.push(`Version differs: ${versionDiff.left} vs ${versionDiff.right}.`);
  }
  if (terminalDiff.changed) {
    messages.push(`Terminal state differs: ${terminalDiff.left} vs ${terminalDiff.right}.`);
  }
  if (validationDiff.changed) {
    messages.push(`Validation state differs between decisions.`);
  }
  if (messages.length === 0) {
    messages.push("No differences detected.");
  }

  return Object.freeze(messages);
}

export const DecisionComparisonDiff = Object.freeze({
  detectLifecycleDiff,
  detectStatusDiff,
  detectVersionDiff,
  detectTerminalDiff,
  detectValidationDiff,
  buildComparisonValidationMessages,
});
