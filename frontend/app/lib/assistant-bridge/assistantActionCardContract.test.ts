import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDefaultAssistantActionCards,
  buildRecommendedAssistantActionCards,
  launchAssistantActionCard,
  resetAssistantActionCardContractForTests,
  validateAssistantActionCardLaunch,
} from "./assistantActionCardContract.ts";
import { resetAssistantDashboardBridgeForTests } from "./assistantDashboardBridgeContract.ts";

const contextWithObject = Object.freeze({
  selectedObjectId: "supplier-a",
  selectedObjectName: "Supplier A",
  dashboardMode: "overview" as const,
  dashboardRouteObjectId: null,
});

const contextWithoutObject = Object.freeze({
  selectedObjectId: null,
  selectedObjectName: null,
  dashboardMode: "overview" as const,
  dashboardRouteObjectId: null,
});

test.beforeEach(() => {
  resetAssistantActionCardContractForTests();
  resetAssistantDashboardBridgeForTests();
});

test("builds executable and future card catalog", () => {
  const all = buildDefaultAssistantActionCards(contextWithObject);
  const recommended = buildRecommendedAssistantActionCards(contextWithObject);
  assert.equal(all.length, 10);
  assert.equal(recommended.length, 5);
  assert.ok(recommended.every((card) => card.status === "available"));
  assert.ok(all.some((card) => card.id === "risk" && card.status === "coming_soon"));
});

test("validates launch when object and action are available", () => {
  const card = buildRecommendedAssistantActionCards(contextWithObject)[1];
  const result = validateAssistantActionCardLaunch({ card, context: contextWithObject });
  assert.equal(result.success, true);
  assert.equal(result.objectId, "supplier-a");
});

test("fails safely when object is missing", () => {
  const card = buildRecommendedAssistantActionCards(contextWithObject)[0];
  const result = validateAssistantActionCardLaunch({ card, context: contextWithoutObject });
  assert.equal(result.success, false);
  assert.equal(result.message, "Object not available.");
});

test("fails safely for coming soon cards", () => {
  const riskCard = buildDefaultAssistantActionCards(contextWithObject).find((c) => c.id === "risk");
  assert.ok(riskCard);
  const result = validateAssistantActionCardLaunch({ card: riskCard!, context: contextWithObject });
  assert.equal(result.success, false);
  assert.equal(result.message, "Route not ready.");
});

test("launch returns bridge failure without window", () => {
  const card = buildRecommendedAssistantActionCards(contextWithObject)[0];
  const result = launchAssistantActionCard({ card, context: contextWithObject });
  assert.equal(result.success, false);
  assert.equal(result.reason, "missing_bridge");
});
