/**
 * NEXORA-ZERO-FAILURE-GATE live /executive smoke.
 * Reuses the MVP:1 Playwright surface; does not create a second CI system.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  process.env.NEXORA_CERT_OUT ?? ".certification/core-out1a-zero-failure-closure",
);
const URL = "http://localhost:3000/executive";

await mkdir(OUT, { recursive: true });

const http = await fetch(URL);
const httpStatus = http.status;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const consoleEntries = [];
const runtimeExceptions = [];
let snapshot = {
  hydrated: false,
  canvasPresent: false,
  canvasWidth: 0,
  canvasHeight: 0,
  cameraMode: null,
  topologyZ: null,
  depth: null,
  focusedTargetZ: null,
  queuePresent: false,
  advisorPresent: false,
  conversationPresent: false,
};
let smokeError = null;

const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45000);
page.on("console", (message) => {
  if (message.type() === "warning" || message.type() === "error") {
    consoleEntries.push({ type: message.type(), text: message.text() });
  }
});
page.on("pageerror", (error) =>
  runtimeExceptions.push({ text: String(error) }),
);

await page.addLocatorHandler(
  page.locator("nextjs-portal"),
  async (portal) => {
    await page.keyboard.press("Escape").catch(() => {});
    await portal.evaluate((node) => node.remove()).catch(() => {});
  },
);

try {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  await page.waitForTimeout(800);

  snapshot = await page.evaluate(() => {
    const q = (selector) => document.querySelector(selector);
    const attr = (element, name) => element?.getAttribute(name) ?? null;
    const stage = q('[data-testid="nexora-3d-executive-stage"]');
    const shell = q('[data-testid="nexora-executive-shell"]');
    const canvas = stage?.querySelector("canvas");
    return {
      hydrated: shell != null && canvas != null,
      canvasPresent: canvas != null,
      canvasWidth: canvas?.width ?? 0,
      canvasHeight: canvas?.height ?? 0,
      cameraMode: attr(stage, "data-stage-camera-mode"),
      topologyZ: attr(stage, "data-stage-topology-z-contract"),
      depth: attr(stage, "data-stage-depth"),
      focusedTargetZ: attr(stage, "data-focused-target-z"),
      queuePresent: q('[data-testid="nexora-executive-queue-disclosure"]') != null,
      advisorPresent: q('[data-ux3="professional-advisor"]') != null,
      conversationPresent:
        q('[data-testid="nexora-conversational-input-field"]') != null,
    };
  });

  const disclosure = page.locator(
    '[data-testid="nexora-executive-queue-disclosure"]',
  );
  if ((await disclosure.count()) > 0 && (await disclosure.getAttribute("open")) == null) {
    await disclosure.locator("summary").click({ force: true });
    await page.waitForTimeout(200);
  }

  const canvasBox = await page
    .locator('[data-testid="nexora-3d-executive-stage"] canvas')
    .boundingBox();
  if (canvasBox) {
    await page.mouse.click(
      canvasBox.x + canvasBox.width / 2,
      canvasBox.y + canvasBox.height / 2,
    );
    await page.waitForTimeout(400);
  }

  const field = page.locator('[data-testid="nexora-conversational-input-field"]');
  await field.fill("What should I look at?");
  await field.press("Enter");
  await page.waitForTimeout(600);

  await field.fill("show delivery");
  await field.press("Enter");
  await page.waitForTimeout(700);
  await field.fill("what if delivery be too late");
  await field.press("Enter");
  await page.waitForTimeout(900);

  const stateChangeLive = await page.evaluate(() => {
    const experience = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    const messages = [
      ...document.querySelectorAll(
        '[data-testid="nexora-conversational-message-nexora"]',
      ),
    ].map((node) => node.textContent ?? "");
    const last = messages.at(-1) ?? "";
    const focused = messages.some((text) => /Focused on Delivery/i.test(text));
    return {
      intentKind: experience?.getAttribute("data-intent-kind") ?? null,
      commandKind: experience?.getAttribute("data-command-kind") ?? null,
      primarySubject: experience?.getAttribute("data-primary-subject") ?? null,
      lastNexoraText: last,
      focusedOnDelivery: focused,
      genericFallback: /I’m not sure how that relates/i.test(last),
      severeDelay: /severe Delivery delay/i.test(last),
      groundedProjection: /On-time|projection/i.test(last),
      inventedMagnitude: /\b2 days\b|\b20%/.test(last),
    };
  });
  snapshot = { ...snapshot, stateChangeLive };

  if (
    !stateChangeLive.focusedOnDelivery ||
    stateChangeLive.genericFallback ||
    stateChangeLive.intentKind !== "explore-scenario" ||
    stateChangeLive.primarySubject !== "obj-delivery" ||
    !stateChangeLive.severeDelay ||
    !stateChangeLive.groundedProjection ||
    stateChangeLive.inventedMagnitude
  ) {
    smokeError =
      smokeError ??
      `fix3 state-change live failed: ${JSON.stringify(stateChangeLive)}`;
  }

  await field.fill("what if it be too late");
  await field.press("Enter");
  await page.waitForTimeout(800);
  const deicticLateLive = await page.evaluate(() => {
    const experience = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    const messages = [
      ...document.querySelectorAll(
        '[data-testid="nexora-conversational-message-nexora"]',
      ),
    ].map((node) => node.textContent ?? "");
    const last = messages.at(-1) ?? "";
    return {
      intentKind: experience?.getAttribute("data-intent-kind") ?? null,
      primarySubject: experience?.getAttribute("data-primary-subject") ?? null,
      lastNexoraText: last,
      genericFallback: /I’m not sure how that relates/i.test(last),
    };
  });
  snapshot = { ...snapshot, deicticLateLive };
  if (
    deicticLateLive.genericFallback ||
    deicticLateLive.intentKind !== "explore-scenario" ||
    deicticLateLive.primarySubject !== "obj-delivery"
  ) {
    smokeError =
      smokeError ??
      `fix3 deictic late live failed: ${JSON.stringify(deicticLateLive)}`;
  }

  for (const follow of [
    "what could be affected?",
    "which KPI?",
    "what risks?",
    "how sure are you?",
    "why?",
  ]) {
    await field.fill(follow);
    await field.press("Enter");
    await page.waitForTimeout(700);
  }
  const impactFollowupLive = await page.evaluate(() => {
    const messages = [
      ...document.querySelectorAll(
        '[data-testid="nexora-conversational-message-nexora"]',
      ),
    ].map((node) => node.textContent ?? "");
    const lastFive = messages.slice(-5);
    return {
      texts: lastFive,
      genericFallback: lastFive.some((text) =>
        /I’m not sure how that relates/i.test(text),
      ),
      affectedHasKpi: /On-time|affected/i.test(lastFive[0] ?? ""),
      kpiMentionsOnTime: /On-time|KPI/i.test(lastFive[1] ?? ""),
      risksHonest: /Risk impact|no canonical/i.test(lastFive[2] ?? ""),
      confidenceProjection: /projection|not to Reality|causal proof/i.test(
        lastFive[3] ?? "",
      ),
      whyNotCausal: /modeled relationship|not proof/i.test(lastFive[4] ?? ""),
    };
  });
  snapshot = { ...snapshot, impactFollowupLive };
  if (
    impactFollowupLive.genericFallback ||
    !impactFollowupLive.affectedHasKpi ||
    !impactFollowupLive.whyNotCausal
  ) {
    smokeError =
      smokeError ??
      `fix4 impact follow-up live failed: ${JSON.stringify(impactFollowupLive)}`;
  }

  await field.fill("Focus on Inventory");
  await field.press("Enter");
  await page.waitForTimeout(700);
  await field.fill("what happend if increase inventory");
  await field.press("Enter");
  await page.waitForTimeout(900);

  const whatIfLive = await page.evaluate(() => {
    const experience = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    const messages = [
      ...document.querySelectorAll(
        '[data-testid="nexora-conversational-message-nexora"]',
      ),
    ].map((node) => node.textContent ?? "");
    const last = messages.at(-1) ?? "";
    return {
      intentKind: experience?.getAttribute("data-intent-kind") ?? null,
      commandKind: experience?.getAttribute("data-command-kind") ?? null,
      primarySubject: experience?.getAttribute("data-primary-subject") ?? null,
      lastNexoraText: last,
      genericFallback: /I’m not sure how that relates/i.test(last),
      inventoryUnsupportedHonest: /supported impact model/i.test(last),
      inventoryInventedImpact: /holding cost|cash|availability|revenue/i.test(
        last,
      ),
    };
  });
  snapshot = { ...snapshot, whatIfLive };

  if (
    whatIfLive.genericFallback ||
    whatIfLive.intentKind !== "explore-scenario" ||
    !whatIfLive.inventoryUnsupportedHonest ||
    whatIfLive.inventoryInventedImpact
  ) {
    smokeError =
      smokeError ??
      `what-if live failed: ${JSON.stringify(whatIfLive)}`;
  }

  await field.fill("what is DEMAND SURGE SCENARIO ?");
  await field.press("Enter");
  await page.waitForTimeout(900);
  await field.fill("what if delivery be late ?");
  await field.press("Enter");
  await page.waitForTimeout(900);
  await field.fill("what risk does that create?");
  await field.press("Enter");
  await page.waitForTimeout(800);
  await field.fill("how sure are you?");
  await field.press("Enter");
  await page.waitForTimeout(800);

  const scenarioFollowupLive = await page.evaluate(() => {
    const experience = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    const messages = [
      ...document.querySelectorAll(
        '[data-testid="nexora-conversational-message-nexora"]',
      ),
    ].map((node) => node.textContent ?? "");
    const firstIdx = messages.findIndex((text) =>
      /Scenario:\s*Demand Surge/i.test(text),
    );
    const first = firstIdx >= 0 ? messages[firstIdx] ?? "" : "";
    const second = firstIdx >= 0 ? messages[firstIdx + 1] ?? "" : "";
    const third = firstIdx >= 0 ? messages[firstIdx + 2] ?? "" : "";
    const fourth = firstIdx >= 0 ? messages[firstIdx + 3] ?? "" : "";
    const followup = [first, second, third, fourth];
    const genericFallback = followup.some((text) =>
      /I’m not sure how that relates/i.test(text),
    );
    return {
      intentKind: experience?.getAttribute("data-intent-kind") ?? null,
      commandKind: experience?.getAttribute("data-command-kind") ?? null,
      primarySubject: experience?.getAttribute("data-primary-subject") ?? null,
      followupNexoraTexts: followup,
      genericFallback,
      firstTurnExplanation: /Scenario:\s*Demand Surge/i.test(first),
      firstTurnInvestigate: /Investigate Demand Surge/i.test(first),
      secondTurnGroundedProjection: /On-time|projection/i.test(second),
      secondTurnDemandSurge: /Demand Surge/i.test(second),
      fourthTurnScenarioConfidence:
        /scenario|projection|confidence|model/i.test(fourth) &&
        !/^Nexora does not currently have validated evidence for that claim\.?$/i.test(
          fourth.replace(/^Nexora/, "").trim(),
        ),
    };
  });
  snapshot = { ...snapshot, scenarioFollowupLive };

  if (
    scenarioFollowupLive.genericFallback ||
    !scenarioFollowupLive.firstTurnExplanation ||
    scenarioFollowupLive.firstTurnInvestigate ||
    !scenarioFollowupLive.secondTurnGroundedProjection ||
    !scenarioFollowupLive.secondTurnDemandSurge ||
    !scenarioFollowupLive.fourthTurnScenarioConfidence
  ) {
    smokeError =
      smokeError ??
      `scenario follow-up live failed: ${JSON.stringify(scenarioFollowupLive)}`;
  }

  await field.fill("show me delivery");
  await field.press("Enter");
  await page.waitForTimeout(700);
  await field.fill("explain DEMAND SURGE");
  await field.press("Enter");
  await page.waitForTimeout(900);

  const explainFidelityLive = await page.evaluate(() => {
    const experience = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    const messages = [
      ...document.querySelectorAll(
        '[data-testid="nexora-conversational-message-nexora"]',
      ),
    ].map((node) => node.textContent ?? "");
    const last = messages.at(-1) ?? "";
    return {
      intentKind: experience?.getAttribute("data-intent-kind") ?? null,
      commandKind: experience?.getAttribute("data-command-kind") ?? null,
      primarySubject: experience?.getAttribute("data-primary-subject") ?? null,
      lastNexoraText: last,
      scenarioFirst: /Scenario:\s*Demand Surge/i.test(last),
      investigateFirst: /^\s*Investigate Demand Surge/i.test(last),
      projectionBoundary: /not an observed outcome/i.test(last),
    };
  });
  snapshot = { ...snapshot, explainFidelityLive };
  if (
    explainFidelityLive.intentKind !== "explain-scenario" ||
    explainFidelityLive.primarySubject !== "ctx-scenario-demand" ||
    !explainFidelityLive.scenarioFirst ||
    explainFidelityLive.investigateFirst
  ) {
    smokeError =
      smokeError ??
      `fix5 explain fidelity live failed: ${JSON.stringify(explainFidelityLive)}`;
  }

  const followUps = [
    "what could be affected?",
    "what risks?",
    "how sure are you?",
    "why?",
    "what do you recommend?",
  ];
  const followupTexts = [];
  for (const follow of followUps) {
    await field.fill(follow);
    await field.press("Enter");
    await page.waitForTimeout(700);
    followupTexts.push(
      await page.evaluate(() => {
        const messages = [
          ...document.querySelectorAll(
            '[data-testid="nexora-conversational-message-nexora"]',
          ),
        ].map((node) => node.textContent ?? "");
        return messages.at(-1) ?? "";
      }),
    );
  }
  const explainFollowupLive = {
    texts: followupTexts,
    genericFallback: followupTexts.some((text) =>
      /I’m not sure how that relates/i.test(text),
    ),
    recommendIsAdvice: /Recommend|Investigate|Review|consider/i.test(
      followupTexts[4] ?? "",
    ),
    affectedContinuity: /associates|affected|projection/i.test(
      followupTexts[0] ?? "",
    ),
    risksHonest: /Risk impact|canonical Risk/i.test(followupTexts[1] ?? ""),
    confidenceProjection: /confidence|projection|evaluation/i.test(
      followupTexts[2] ?? "",
    ),
    whyNotCausal: /not a proven causal|modeled/i.test(followupTexts[3] ?? ""),
  };
  snapshot = { ...snapshot, explainFollowupLive };
  if (
    explainFollowupLive.genericFallback ||
    !explainFollowupLive.recommendIsAdvice ||
    !explainFollowupLive.affectedContinuity ||
    !explainFollowupLive.risksHonest ||
    !explainFollowupLive.whyNotCausal
  ) {
    smokeError =
      smokeError ??
      `fix5 explain follow-up live failed: ${JSON.stringify(explainFollowupLive)}`;
  }

  const confirm = page.locator('[data-testid="nexora-decision-confirm"], [data-advisor-action-priority="primary"]').first();
  if ((await confirm.count()) > 0) {
    await confirm.click({ force: true }).catch(() => {});
    await page.waitForTimeout(250);
  }

  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  await page.goBack();
  await page.waitForTimeout(250);
  await page.goForward();
  await page.waitForTimeout(250);
} catch (error) {
  smokeError = String(error);
} finally {
  await browser.close();
}

const duplicateKeyWarnings = consoleEntries.filter((entry) =>
  /encountered two children with the same key|unique "key" prop/i.test(
    entry.text,
  ),
);
const hydrationFailures = consoleEntries.filter((entry) =>
  /hydration|hydrated.*mismatch/i.test(entry.text),
);
const uncaught = runtimeExceptions.length;

const runtimeSmoke = {
  identity: "NEXORA-ZERO-FAILURE-GATE/live-executive-smoke",
  url: URL,
  httpStatus,
  hydrated: snapshot.hydrated === true,
  webglCanvas: snapshot.canvasPresent === true && snapshot.canvasWidth > 0,
  stagePresent: snapshot.canvasPresent === true,
  cameraMode: snapshot.cameraMode,
  topologyZ: snapshot.topologyZ,
  focusedTargetZ: snapshot.focusedTargetZ,
  queuePresent: snapshot.queuePresent,
  advisorPresent: snapshot.advisorPresent,
  conversationPresent: snapshot.conversationPresent,
  whatIfLive: snapshot.whatIfLive ?? null,
  stateChangeLive: snapshot.stateChangeLive ?? null,
  deicticLateLive: snapshot.deicticLateLive ?? null,
  impactFollowupLive: snapshot.impactFollowupLive ?? null,
  scenarioFollowupLive: snapshot.scenarioFollowupLive ?? null,
  explainFidelityLive: snapshot.explainFidelityLive ?? null,
  explainFollowupLive: snapshot.explainFollowupLive ?? null,
  clickToCenterAttempted: true,
  backForwardEscapeAttempted: true,
  smokeError,
  ok:
    smokeError == null &&
    httpStatus === 200 &&
    snapshot.hydrated === true &&
    snapshot.canvasPresent === true &&
    snapshot.canvasWidth > 0 &&
    snapshot.cameraMode === "fixed-2d" &&
    snapshot.topologyZ === "0" &&
    snapshot.queuePresent === true &&
    snapshot.advisorPresent === true &&
    snapshot.conversationPresent === true &&
    uncaught === 0 &&
    hydrationFailures.length === 0 &&
    duplicateKeyWarnings.length === 0,
};

const consoleResults = {
  uncaught,
  hydration: hydrationFailures.length,
  duplicateKeys: duplicateKeyWarnings.length,
  warningsAndErrors: consoleEntries,
  runtimeExceptions,
};

await writeFile(join(OUT, "runtime-smoke.json"), JSON.stringify(runtimeSmoke, null, 2));
await writeFile(join(OUT, "console-results.json"), JSON.stringify(consoleResults, null, 2));

if (!runtimeSmoke.ok) {
  console.error(JSON.stringify({ runtimeSmoke, consoleResults }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ runtimeSmoke, consoleResults: {
  uncaught,
  hydration: hydrationFailures.length,
  duplicateKeys: duplicateKeyWarnings.length,
} }, null, 2));
