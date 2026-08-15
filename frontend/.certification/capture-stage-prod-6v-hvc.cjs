/**
 * STAGE-PROD:6V — real WebGL/runtime capture harness (Playwright).
 *
 * Requires: next dev on http://localhost:3000
 * Prefer actual Stage screenshots; schematics do not qualify for HVC.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(
  __dirname,
  "../.certification/stage-prod-6v-captures",
);
const VIEWPORTS = {
  primary: { width: 1502, height: 942, label: "primary" },
  narrow: { width: 1280, height: 800, label: "narrow" },
};

async function settle(page, ms = 2200) {
  await page.waitForTimeout(ms);
}

async function shot(page, name) {
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function stageAttrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  if ((await stage.count()) === 0) return { missing: true };
  const keys = [
    "data-focused-object",
    "data-selected-object",
    "data-stage-camera-mode",
    "data-stage-object-plane",
    "data-stage-layout-overlap-count",
    "data-stage-layout-status",
  ];
  const attrs = {};
  for (const key of keys) {
    attrs[key] = await stage.getAttribute(key).catch(() => null);
  }
  return attrs;
}

async function clickObject(page, id) {
  const btn = page.getByTestId(`nexora-stage-object-control-${id}`);
  if ((await btn.count()) === 0) return false;
  await btn.click({ force: true });
  await settle(page, 2600);
  return true;
}

async function runViewport(browser, viewport) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const report = {
    viewport,
    steps: {},
    captures: [],
  };

  await page.goto("http://localhost:3000/executive", {
    waitUntil: "networkidle",
    timeout: 180000,
  });
  await settle(page, 2800);

  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 1400);
  }

  async function capture(name, note) {
    const file = await shot(page, `${viewport.label}-${name}`);
    report.captures.push(file);
    report.steps[name] = {
      note,
      attrs: await stageAttrs(page),
      advisorMode: await page
        .getByTestId("nexora-advisor-insight-region")
        .getAttribute("data-advisor-mode")
        .catch(() => null),
      prepVisible:
        (await page.getByTestId("nexora-executive-preparation").count()) > 0,
      nbaVisible:
        (await page.getByTestId("nexora-executive-nba").count()) > 0,
      briefVisible:
        (await page.getByTestId("nexora-executive-decision-brief").count()) > 0,
      memoryVisible:
        (await page.getByTestId("nexora-executive-decision-memory").count()) > 0,
      queueVisible:
        (await page.getByTestId("nexora-executive-queue").count()) > 0,
    };
  }

  await capture("01-overview-clean", "Overview");
  await capture("02-overview-watch-queue", "Overview + Queue");

  await clickObject(page, "obj-capacity");
  await capture("03-focus-capacity", "Focused Capacity");

  await clickObject(page, "obj-revenue");
  await capture("04-focus-related-watch", "Focus + related field");

  const problems = page.getByTestId("nexora-executive-queue-problem");
  if ((await problems.count()) === 0) {
    // fallback: any queue row
    const row = page.locator("[data-testid^='nexora-executive-queue-']").first();
    if (await row.count()) await row.click({ force: true });
  } else {
    await problems.click({ force: true });
  }
  await settle(page, 2200);
  await capture("05-problems-collection", "Problems Collection");

  const changes = page.getByTestId("nexora-executive-queue-changes-since-visit");
  if (await changes.count()) {
    await changes.click({ force: true });
    await settle(page, 2200);
  }
  await capture("06-recent-changes", "Recent Changes or prior collection");

  if (await reset.count()) {
    await reset.click();
    await settle(page, 1200);
  }

  const daily = page.getByTestId("nexora-prepare-daily");
  if (await daily.count()) {
    await daily.click({ force: true });
    await settle(page, 2400);
  }
  await capture("07-daily-prep", "Daily Preparation");
  await capture("08-daily-prep-density", "Daily Preparation density");

  const meeting = page.getByTestId("nexora-prepare-meeting");
  if (await meeting.count()) {
    await meeting.click({ force: true });
    await settle(page, 2400);
  }
  await capture("09-meeting-prep", "Meeting Preparation");
  await capture("10-meeting-watch", "Meeting + Watch");

  await clickObject(page, "obj-capacity");
  await capture("11-prep-to-focus", "Preparation → Focus");

  await clickObject(page, "ctx-decision-capacity");
  await settle(page, 2000);
  // decision may be context subject — try capacity decision via context nodes
  const decisionBtn = page.getByTestId(
    "nexora-stage-object-control-ctx-decision-capacity",
  );
  if (await decisionBtn.count()) {
    await decisionBtn.click({ force: true });
    await settle(page, 2600);
  }
  await capture("12-decision-nba", "Decision focus / NBA");
  await capture("13-decision-brief", "Decision Brief eligibility");
  await capture("14-decision-memory", "Decision Memory if session");
  await capture("15-decision-stack", "Decision Advisor stack");

  await capture("16-queue-stage", "Queue coexistence");

  if (viewport.label === "narrow") {
    await capture("17-narrow-desktop", "Narrow desktop");
  } else {
    await capture("17-primary-desktop", "Primary desktop");
  }

  await clickObject(page, "obj-customer");
  await capture("18-long-label-proxy", "Longer label subject proxy");

  const back = page.getByTestId("nexora-stage-back");
  if (await back.count()) {
    await back.click({ force: true });
    await settle(page, 1800);
  }
  await capture("19-back-context", "Back restored context");

  if (await reset.count()) {
    await reset.click();
    await settle(page, 1400);
  } else {
    await page.keyboard.press("Escape");
    await settle(page, 1400);
  }
  await capture("20-escape-overview", "Escape → Overview");

  await page.close();
  return report;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const primary = await runViewport(browser, VIEWPORTS.primary);
  const narrow = await runViewport(browser, VIEWPORTS.narrow);
  const report = {
    phase: "STAGE-PROD:6V",
    capturedAt: new Date().toISOString(),
    primary,
    narrow,
    captureCount: primary.captures.length + narrow.captures.length,
    note: "Real Playwright WebGL/Stage screenshots. Schematics do not qualify for HVC.",
  };
  fs.writeFileSync(
    path.join(OUT, "hvc-runtime-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        captureCount: report.captureCount,
        out: OUT,
        primarySteps: Object.keys(primary.steps).length,
        narrowSteps: Object.keys(narrow.steps).length,
      },
      null,
      2,
    ),
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
