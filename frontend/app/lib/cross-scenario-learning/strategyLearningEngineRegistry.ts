/**
 * APP-10:6 — Strategy Learning Engine immutable registry.
 */

import {
  STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
  STRATEGY_LEARNING_ENGINE_LIMITS,
} from "./strategyLearningEngineConstants.ts";
import type {
  ExecutiveStrategy,
  StrategyEngineResult,
  StrategyId,
  StrategyRegistrySnapshot,
  StrategyWorkspaceId,
} from "./strategyLearningEngineTypes.ts";
import { validateExecutiveStrategy } from "./strategyLearningEngineValidation.ts";

const strategyRegistry = new Map<StrategyId, ExecutiveStrategy>();
const workspaceIndex = new Map<StrategyWorkspaceId, Set<StrategyId>>();

function indexStrategy(strategy: ExecutiveStrategy): void {
  const ids = workspaceIndex.get(strategy.strategy.workspaceId) ?? new Set<StrategyId>();
  ids.add(strategy.strategy.strategyId);
  workspaceIndex.set(strategy.strategy.workspaceId, ids);
}

function unindexStrategy(strategy: ExecutiveStrategy): void {
  const ids = workspaceIndex.get(strategy.strategy.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(strategy.strategy.strategyId);
  if (ids.size === 0) {
    workspaceIndex.delete(strategy.strategy.workspaceId);
  }
}

export function clearStrategyLearningRegistryForTests(): void {
  strategyRegistry.clear();
  workspaceIndex.clear();
}

export function strategyExists(strategyId: StrategyId): boolean {
  return strategyRegistry.has(strategyId);
}

export function registerStrategy(strategy: ExecutiveStrategy): StrategyEngineResult<ExecutiveStrategy> {
  const validation = validateExecutiveStrategy(strategy);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: validation.issues[0] ?? null,
      readOnly: true as const,
    });
  }
  if (strategyRegistry.has(strategy.strategy.strategyId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate strategy id: ${strategy.strategy.strategyId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_strategy",
        message: "Duplicate strategy id.",
        field: "strategyId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (strategyRegistry.size >= STRATEGY_LEARNING_ENGINE_LIMITS.maxRegisteredStrategies) {
    return Object.freeze({
      success: false,
      reason: "Strategy registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Strategy registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  strategyRegistry.set(strategy.strategy.strategyId, strategy);
  indexStrategy(strategy);
  return Object.freeze({
    success: true,
    reason: "Executive strategy registered.",
    data: strategy,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterStrategy(strategyId: StrategyId): StrategyEngineResult<StrategyId> {
  const existing = strategyRegistry.get(strategyId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Strategy not found: ${strategyId}.`,
      data: null,
      error: Object.freeze({
        code: "strategy_not_found",
        message: "Strategy not found.",
        field: "strategyId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  strategyRegistry.delete(strategyId);
  unindexStrategy(existing);
  return Object.freeze({
    success: true,
    reason: "Executive strategy unregistered.",
    data: strategyId,
    error: null,
    readOnly: true as const,
  });
}

export function getStrategy(strategyId: StrategyId): ExecutiveStrategy | null {
  return strategyRegistry.get(strategyId) ?? null;
}

export function getStrategies(workspaceId?: StrategyWorkspaceId): readonly ExecutiveStrategy[] {
  if (!workspaceId) {
    return Object.freeze(
      [...strategyRegistry.values()].sort((left, right) =>
        left.strategy.strategyId.localeCompare(right.strategy.strategyId)
      )
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => strategyRegistry.get(id))
      .filter((entry): entry is ExecutiveStrategy => entry !== undefined)
      .sort((left, right) => left.strategy.strategyId.localeCompare(right.strategy.strategyId))
  );
}

export function getStrategyRegistrySnapshot(): StrategyRegistrySnapshot {
  return Object.freeze({
    registryVersion: STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
    strategyCount: strategyRegistry.size,
    strategyIds: Object.freeze([...strategyRegistry.keys()].sort()),
    readOnly: true as const,
  });
}

export const StrategyLearningEngineRegistry = Object.freeze({
  clearStrategyLearningRegistryForTests,
  strategyExists,
  registerStrategy,
  unregisterStrategy,
  getStrategy,
  getStrategies,
  getStrategyRegistrySnapshot,
});
