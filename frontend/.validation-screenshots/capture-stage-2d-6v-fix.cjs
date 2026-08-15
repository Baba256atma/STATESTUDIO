const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname);

async function settle(page, ms = 2800) {
  await page.waitForTimeout(ms);
}

async function stageAttrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  const keys = [
    "data-focused-object",
    "data-selected-object",
    "data-stage-clicked-object-id",
    "data-stage-selected-object-id",
    "data-stage-focused-object-id",
    "data-stage-navigation-current-object-id",
    "data-stage-anchor-object-id",
    "data-stage-advisor-object-id",
    "data-advisor-subject",
    "data-stage-layout-overlap-count",
    "data-stage-layout-min-gap",
    "data-stage-layout-status",
    "data-stage-volumetric-body-count",
    "data-stage-object-plane",
    "data-stage-camera-mode",
  ];
  const attrs = {};
  for (const key of keys) {
    attrs[key] = await stage.getAttribute(key);
  }
  return attrs;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  await page.goto("http://localhost:3000/executive", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);

  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 1200);
  }

  const report = { steps: {} };

  async function clickObject(id, label) {
    const btn = page.getByTestId(`nexora-stage-object-control-${id}`);
    await btn.click({ force: true });
    await settle(page, 3200);
    const attrs = await stageAttrs(page);
    const a11y = await page.getByTestId("nexora-stage-a11y").innerText();
    const advisorText = await page
      .locator("[data-testid='nexora-advisor-insight-region'], [data-advisor-subject]")
      .first()
      .innerText()
      .catch(() => "");
    report.steps[label] = { attrs, a11y, advisorSnippet: advisorText.slice(0, 280) };
    await page.screenshot({
      path: path.join(OUT, `stage-2d-6v-fix-${label}.png`),
      fullPage: false,
    });
  }

  await clickObject("obj-budget", "budget");
  await clickObject("obj-capacity", "capacity");
  await clickObject("obj-delivery", "delivery");
  await clickObject("obj-revenue", "revenue");
  await clickObject("obj-customer", "customer");

  // Presentation levels on Delivery
  await clickObject("obj-delivery", "delivery-minimum");
  for (const state of ["report", "operation", "minimum"]) {
    const control = page.getByTestId(`nexora-presentation-state-${state}`);
    if (await control.count()) {
      await control.click({ force: true });
      await settle(page, 2200);
      report.steps[`delivery-${state}`] = {
        attrs: await stageAttrs(page),
        a11y: await page.getByTestId("nexora-stage-a11y").innerText(),
      };
      await page.screenshot({
        path: path.join(OUT, `stage-2d-6v-fix-delivery-${state}.png`),
        fullPage: false,
      });
    }
  }

  fs.writeFileSync(
    path.join(OUT, "stage-2d-6v-fix-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report.steps.budget, null, 2));
  console.log("WROTE", path.join(OUT, "stage-2d-6v-fix-report.json"));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
