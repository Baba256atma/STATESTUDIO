import assert from "node:assert/strict";
import test from "node:test";

import { readHostedProductionConfig } from "./hostedProductionConfig.ts";

const production = {
  NEXORA_DEPLOYMENT_MODE: "hosted",
  DATABASE_URL: "postgres://nexora.invalid/nexora",
  NEXTAUTH_SECRET: "configured",
  NEXTAUTH_URL: "https://app.example.invalid",
  NEXORA_LLM_GATEWAY_SECRET: "configured",
  NEXORA_PRIVATE_API_BASE: "http://nexora-backend-91el:10000",
  GITHUB_ID: "configured",
  GITHUB_SECRET: "configured",
};

test("production hosted configuration fails closed until every required value is present", () => {
  assert.equal(readHostedProductionConfig(production, "production").ok, true);
  assert.equal(readHostedProductionConfig({ ...production, DATABASE_URL: "" }, "production").ok, false);
  assert.equal(readHostedProductionConfig({ ...production, NEXTAUTH_URL: "http://localhost:3010" }, "production").ok, false);
  assert.equal(readHostedProductionConfig({ ...production, NEXORA_PRIVATE_API_BASE: "" }, "production").ok, false);
  assert.equal(readHostedProductionConfig({ ...production, NEXORA_PRIVATE_API_BASE: "http://127.0.0.1:8000" }, "production").ok, false);
  assert.equal(readHostedProductionConfig({ ...production, NEXORA_AUTH_DEV_SIGN_IN: "true" }, "production").ok, false);
  assert.equal(readHostedProductionConfig({}, "development").ok, true);
});
