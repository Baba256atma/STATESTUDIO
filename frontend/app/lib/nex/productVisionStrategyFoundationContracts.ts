/**
 * NEX-1:1 — Immutable Foundation contracts.
 *
 * Declarations only; no enforcement or executable behavior.
 */

import type { ProductFoundationContract } from "./productVisionStrategyFoundationTypes.ts";

export const ProductVisionStrategyFoundationContracts: readonly ProductFoundationContract[] =
  Object.freeze([
    Object.freeze({ id: "NEX-1:1/Contract/Vision", contractKey: "Vision", name: "Vision Contract", description: "Declares the enduring future Nexora seeks to enable.", requiredFields: Object.freeze(["statement", "horizon"]), order: 1, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/Mission", contractKey: "Mission", name: "Mission Contract", description: "Declares Nexora's present purpose and contribution.", requiredFields: Object.freeze(["statement", "beneficiaries", "contribution"]), order: 2, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/Strategy", contractKey: "Strategy", name: "Strategy Contract", description: "Declares the coherent direction used to advance the vision.", requiredFields: Object.freeze(["strategicThemes", "objectives"]), order: 3, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/Goal", contractKey: "Goal", name: "Goal Contract", description: "Declares product outcomes that support the vision.", requiredFields: Object.freeze(["goalId", "outcome", "visionSupport"]), order: 4, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/User", contractKey: "User", name: "User Contract", description: "Declares a target user and the product problem relevant to that user.", requiredFields: Object.freeze(["userId", "description", "needs"]), order: 5, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/Value", contractKey: "Value", name: "Value Contract", description: "Declares a durable product value that guides product judgment.", requiredFields: Object.freeze(["valueId", "description"]), order: 6, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/Boundary", contractKey: "Boundary", name: "Boundary Contract", description: "Declares what the product reference does not own or define.", requiredFields: Object.freeze(["boundaryId", "exclusion"]), order: 7, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/Lifecycle", contractKey: "Lifecycle", name: "Lifecycle Contract", description: "Declares product-reference lifecycle stages without transitions.", requiredFields: Object.freeze(["stageId", "description", "order"]), order: 8, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/Principle", contractKey: "Principle", name: "Principle Contract", description: "Declares a unique product principle.", requiredFields: Object.freeze(["principleId", "statement"]), order: 9, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/Contract/Scope", contractKey: "Scope", name: "Scope Contract", description: "Declares the product concerns owned by NEX.", requiredFields: Object.freeze(["scopeId", "description"]), order: 10, runtimeBehavior: "None", immutable: true, metadataOnly: true }),
  ] as const);
