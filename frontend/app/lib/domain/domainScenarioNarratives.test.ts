import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildDomainScenarioExecutiveSummary,
  buildDomainScenarioProbableImpact,
  buildDomainScenarioRecommendedFocus,
  buildDomainScenarioTitle,
} from "./domainScenarioNarratives.ts";

test("scenario narratives are executive readable", () => {
  assert.equal(
    buildDomainScenarioTitle({ type: "bottleneck", primaryLabel: "Inventory" }),
    "Inventory Flow Bottleneck"
  );
  assert.match(
    buildDomainScenarioExecutiveSummary({
      type: "dependency_failure",
      primaryLabel: "Database",
      secondaryLabel: "Application uptime",
      severity: "high",
    }),
    /Application uptime may degrade/i
  );
});

test("probable impact and focus are concise", () => {
  assert.equal(
    buildDomainScenarioProbableImpact({
      type: "delay",
      primaryLabel: "Supplier",
      secondaryLabel: "Delivery",
    }),
    "Delay can propagate from Supplier into Delivery."
  );
  assert.equal(
    buildDomainScenarioRecommendedFocus({ type: "financial_pressure", primaryLabel: "Liquidity" }),
    "Protect financial flexibility around Liquidity."
  );
});
