const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname);

async function settle(page, ms = 1000) {
  await page.waitForTimeout(ms);
}

async function attrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  const keys = [
    "data-focused-object",
    "data-stage-anchor-object-id",
    "data-stage-visual-balance-contract",
    "data-stage-visual-balance-version",
    "data-stage-anchor-count",
    "data-stage-related-count",
    "data-stage-peripheral-count",
    "data-stage-context-count",
    "data-stage-orphan-label-count",
    "data-stage-hard-overlap-count",
    "data-stage-unrelated-visible-edge-count",
    "data-stage-visual-centroid-x",
    "data-stage-visual-centroid-y",
    "data-stage-sector-compression",
    "data-presentation-state",
  ];
  const out = {};
  for (const key of keys) out[key] = await stage.getAttribute(key);
  return out;
}

async function clickObject(page, id) {
  await page.getByTestId(`nexora-stage-object-control-${id}`).click({
    force: true,
  });
  await settle(page, 1200);
}

async function resetOverview(page) {
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 900);
  }
}

async function setPresentation(page, state) {
  const testId = `nexora-presentation-state-${state}`;
  const control = page.getByTestId(testId);
  if ((await control.count()) > 0) {
    await control.click();
    await settle(page, 800);
    return true;
  }
  // Fallback: click text buttons in Presentation Level panel.
  const button = page.getByRole("button", {
    name: new RegExp(state, "i"),
  });
  if ((await button.count()) > 0) {
    await button.first().click();
    await settle(page, 800);
    return true;
  }
  return false;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const report = { steps: {} };

  await page.goto("http://localhost:3000/executive?objPresence=1", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);
  await resetOverview(page);
  report.steps.overview = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-4-overview.png"),
    fullPage: false,
  });

  await clickObject(page, "obj-capacity");
  report.steps.capacity = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-4-capacity.png"),
    fullPage: false,
  });

  await setPresentation(page, "minimum");
  report.steps.capacityMinimum = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-4-capacity-minimum.png"),
    fullPage: false,
  });

  await setPresentation(page, "report");
  report.steps.capacityReport = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-4-capacity-report.png"),
    fullPage: false,
  });

  await setPresentation(page, "operation");
  report.steps.capacityOperation = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-4-capacity-operation.png"),
    fullPage: false,
  });

  await setPresentation(page, "minimum");
  for (const id of [
    "obj-revenue",
    "obj-delivery",
    "obj-budget",
    "obj-risk",
  ]) {
    await clickObject(page, id);
    report.steps[id] = { attrs: await attrs(page) };
    await page.screenshot({
      path: path.join(OUT, `stage-obj-4-${id}.png`),
      fullPage: false,
    });
  }

  await resetOverview(page);
  report.steps.overviewReturn = { attrs: await attrs(page) };

  fs.writeFileSync(
    path.join(OUT, "stage-obj-4-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
