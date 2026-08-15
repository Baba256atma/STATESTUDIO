/**
 * Human visual validation capture — Delivery + Budget (no product code changes).
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname);
fs.mkdirSync(OUT, { recursive: true });

async function waitSettle(page, ms = 2800) {
  await page.waitForTimeout(ms);
}

async function ensureMinimum(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  await stage.waitFor({ state: "visible", timeout: 60000 });
  const state = await stage.getAttribute("data-presentation-state");
  if (state !== "minimum") {
    // Prefer clicking a MINIMUM control if present
    const minBtn = page
      .locator(
        '[data-testid*="presentation"] button, button:has-text("MINIMUM"), button:has-text("Minimum"), [data-presentation-state-option="minimum"]',
      )
      .first();
    if (await minBtn.count()) {
      await minBtn.click({ force: true });
      await waitSettle(page, 800);
    }
  }
}

async function readStageAttrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  return {
    focusedObject: await stage.getAttribute("data-focused-object"),
    selectedObject: await stage.getAttribute("data-selected-object"),
    presentationState: await stage.getAttribute("data-presentation-state"),
    stageMode: await stage.getAttribute("data-stage-mode"),
    choreographyAnchor: await stage.getAttribute("data-choreography-anchor"),
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1502, height: 942 },
  });

  const authorityLogs = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("NEXORA_FOCUS_LAYOUT_AUTHORITY")) {
      authorityLogs.push(text);
    }
  });

  await page.goto("http://localhost:3000/executive", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await waitSettle(page, 2500);
  await ensureMinimum(page);

  // Overview baseline
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await waitSettle(page, 1500);
  }

  // Delivery
  await page.getByTestId("nexora-stage-object-control-obj-delivery").click();
  await waitSettle(page, 3200);
  const deliveryAttrs = await readStageAttrs(page);
  const deliveryShot = path.join(OUT, "A-Delivery-MINIMUM.png");
  await page.screenshot({ path: deliveryShot, fullPage: false });

  // Reset / Overview
  if (await page.getByTestId("nexora-stage-reset").count()) {
    await page.getByTestId("nexora-stage-reset").click();
  } else {
    await page.keyboard.press("Escape");
  }
  await waitSettle(page, 1800);

  // Budget
  await page.getByTestId("nexora-stage-object-control-obj-budget").click();
  await waitSettle(page, 3200);
  const budgetAttrs = await readStageAttrs(page);
  const budgetShot = path.join(OUT, "B-Budget-MINIMUM.png");
  await page.screenshot({ path: budgetShot, fullPage: false });

  const report = {
    deliveryAttrs,
    budgetAttrs,
    authorityLogs,
    deliveryShot,
    budgetShot,
  };
  fs.writeFileSync(
    path.join(OUT, "validation-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
