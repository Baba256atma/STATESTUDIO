/** NPA-T STAGE-PROD:6C — production /executive playback certification. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const OUT = join(process.cwd(), "artifacts/stage-prod/STAGE-PROD-6C");
const URL = process.env.NEXORA_EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL;
const CAPACITY_ID = "ctx-problem-capacity";
const SCENARIO_IDS = ["ctx-scenario-demand", "ctx-scenario-pricing"];

await mkdir(OUT, { recursive: true });

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const disclosure = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    const controls = [...document.querySelectorAll('[data-visual-audit="stage-object"]')]
      .map((node) => node.getAttribute("data-canonical-id"))
      .filter(Boolean)
      .sort();
    return {
      family: stage?.getAttribute("data-stage-prod-scene-family") ?? "none",
      ids: (stage?.getAttribute("data-stage-prod-composition-object-ids") ?? "none")
        .split("|")
        .filter((id) => id !== "none")
        .sort(),
      signature: stage?.getAttribute("data-stage-prod-composition-signature") ?? "none",
      motion: JSON.parse(stage?.getAttribute("data-stage-motion-bundle") ?? "{}"),
      samples: JSON.parse(stage?.getAttribute("data-stage-motion-samples-bundle") ?? "{}"),
      controls,
      selected: mount?.getAttribute("data-selected-object") ?? "none",
      focused: mount?.getAttribute("data-focused-object") ?? "none",
      disclosureStatus: mount?.getAttribute("data-stage-prod-disclosure-status") ?? "none",
      disclosed: mount?.getAttribute("data-stage-prod-disclosed-object-id") ?? "none",
      disclosureObject: disclosure?.getAttribute("data-stage-prod-disclosed-object-id") ?? "none",
      stageWrites: mount?.getAttribute("data-stage-prod-writes") ?? "none",
      compositionWrites: stage?.getAttribute("data-stage-prod-composition-writes") ?? "none",
    };
  });
}

async function waitForScene(page, family, settled) {
  await page.waitForFunction(
    ({ family, settled }) => {
      const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
      const motion = JSON.parse(stage?.getAttribute("data-stage-motion-bundle") ?? "{}");
      return stage?.getAttribute("data-stage-prod-scene-family") === family &&
        motion.settled === settled;
    },
    { family, settled },
  );
}

async function waitForNewSettledTransition(page, family, previousTransitionId) {
  await page.waitForFunction(
    ({ family, previousTransitionId }) => {
      const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
      const motion = JSON.parse(stage?.getAttribute("data-stage-motion-bundle") ?? "{}");
      return stage?.getAttribute("data-stage-prod-scene-family") === family &&
        motion.transitionId !== previousTransitionId &&
        motion.settled === true;
    },
    { family, previousTransitionId },
  );
}

async function installPlaybackObserver(page) {
  await page.evaluate(() => {
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    window.__stageProd6CPlayback = [];
    const record = () => {
      window.__stageProd6CPlayback.push({
        family: stage?.getAttribute("data-stage-prod-scene-family") ?? "none",
        ids: stage?.getAttribute("data-stage-prod-composition-object-ids") ?? "none",
        motion: JSON.parse(stage?.getAttribute("data-stage-motion-bundle") ?? "{}"),
        samples: JSON.parse(stage?.getAttribute("data-stage-motion-samples-bundle") ?? "{}"),
      });
    };
    record();
    window.__stageProd6CObserver = new MutationObserver(record);
    window.__stageProd6CObserver.observe(stage, { attributes: true });
  });
}

async function readPlayback(page) {
  return page.evaluate(() => {
    window.__stageProd6CObserver?.disconnect();
    return window.__stageProd6CPlayback ?? [];
  });
}

async function triggerComparison(page) {
  const field = page.locator('[data-testid="nexora-conversational-input-field"]');
  await field.fill("Compare Demand Surge and Pricing Response.");
  await field.press("Enter");
}

function intermediateProof(timeline) {
  for (const observation of timeline) {
    const progress = Number(observation.motion?.progress);
    if (observation.family !== "comparison" || !(progress > 0 && progress < 1)) continue;
    for (const id of SCENARIO_IDS) {
      const from = observation.samples?.from?.[id];
      const live = observation.samples?.live?.[id];
      const target = observation.samples?.target?.[id];
      if (!from || !live || !target) continue;
      const opacityBetween =
        live.opacity > Math.min(from.opacity, target.opacity) &&
        live.opacity < Math.max(from.opacity, target.opacity);
      const scaleBetween =
        live.scale > Math.min(from.scale, target.scale) &&
        live.scale < Math.max(from.scale, target.scale);
      const positionBetween =
        JSON.stringify(live.position) !== JSON.stringify(from.position) &&
        JSON.stringify(live.position) !== JSON.stringify(target.position);
      if (opacityBetween || scaleBetween || positionBetween) {
        return { id, progress, from, live, target };
      }
    }
  }
  return null;
}

async function runJourney(browser, reducedMotion) {
  const context = await browser.newContext({
    viewport: { width: 1502, height: 942 },
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  try {
    const opened = await openExecutivePage(page, URL);
    await askExecutiveChat(page, "Review Capacity Gap");
    await waitForScene(page, "investigation", true);
    const sceneA = await snapshot(page);
    await installPlaybackObserver(page);
    await triggerComparison(page);
    await waitForNewSettledTransition(
      page,
      "comparison",
      sceneA.motion.transitionId,
    );
    const sceneB = await snapshot(page);
    const timeline = await readPlayback(page);
    const intermediate = intermediateProof(timeline);

    await page.locator('[data-testid="nexora-stage-object-list"]').evaluate((element) => {
      element.open = true;
    });
    const scenarioControl = page.locator(
      '[data-testid="nexora-stage-object-control-ctx-scenario-pricing"]',
    );
    await scenarioControl.click();
    await page.waitForFunction(() =>
      document
        .querySelector('[data-testid="nexora-stage-mount"]')
        ?.getAttribute("data-selected-object") === "ctx-scenario-pricing",
    );
    const interactive = await snapshot(page);

    assert(opened.http === 200, `HTTP status was ${opened.http}`);
    assert(sceneA.family === "investigation", "Scene A was not Investigation");
    assert(sceneA.ids.includes(CAPACITY_ID), "Scene A omitted Capacity Gap");
    assert(sceneA.disclosed === CAPACITY_ID, "Scene A disclosure was not Capacity Gap");
    assert(sceneB.family === "comparison", "Scene B was not Comparison");
    assert(JSON.stringify(sceneB.ids) === JSON.stringify(SCENARIO_IDS), `Scene B IDs were ${sceneB.ids}`);
    assert(JSON.stringify(sceneB.controls) === JSON.stringify(SCENARIO_IDS), `rendered IDs were ${sceneB.controls}`);
    assert(sceneB.disclosed === "none", "stale Capacity disclosure remained attached");
    assert(sceneB.disclosureObject === "none", "stale disclosure surface remained mounted");
    assert(sceneB.stageWrites === "false" && sceneB.compositionWrites === "false", "Stage did not preserve read safety");
    assert(interactive.selected === "ctx-scenario-pricing", "Stage was not interactive after settlement");
    assert(errors.length === 0, `browser errors: ${errors.join(" | ")}`);
    if (!reducedMotion) assert(intermediate, "no genuine intermediate rendered sample was observed");
    if (reducedMotion) {
      assert(sceneB.motion.durationMs === 80, `reduced duration was ${sceneB.motion.durationMs}`);
    }

    return {
      reducedMotion,
      http: opened.http,
      sceneA,
      transitionTrigger: "Compare Demand Surge and Pricing Response.",
      intermediate,
      timelineObservationCount: timeline.length,
      sceneB,
      interactive,
      errors,
      pass: true,
    };
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 0 });
try {
  const standard = await runJourney(browser, false);
  const reduced = await runJourney(browser, true);
  const report = Object.freeze({
    phase: "NPA-T STAGE-PROD:6C",
    identity: "NPA-T STAGE-PROD:6C/LiveAnimationPlaybackCertification",
    url: URL,
    standard,
    reduced,
    relationshipRevealHide: "DEFERRED",
    liveAnimationPlaybackDebt: "CLOSED",
    measuredPerformance: "NOT_RUN",
    pass: standard.pass && reduced.pass,
  });
  await writeFile(
    join(OUT, "live-animation-playback.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
