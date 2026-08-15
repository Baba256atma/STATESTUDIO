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
    "data-stage-anchor-object-id",
    "data-stage-advisor-object-id",
    "data-stage-depth-environment",
    "data-stage-depth-enabled",
    "data-stage-semantic-plane-z",
    "data-stage-layout-overlap-count",
    "data-stage-camera-mode",
  ];
  const attrs = {};
  for (const key of keys) attrs[key] = await stage.getAttribute(key);
  return attrs;
}

async function clickBudget(page) {
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 1000);
  }
  await page.getByTestId("nexora-stage-object-control-obj-budget").click({
    force: true,
  });
  await settle(page, 3200);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const report = { steps: {} };

  // Deep-Z ON
  await page.goto("http://localhost:3000/executive", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);
  await clickBudget(page);
  report.steps.budgetOn = { attrs: await stageAttrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-depth-1-budget-on.png"),
    fullPage: false,
  });

  await page.getByTestId("nexora-stage-object-control-obj-delivery").click({
    force: true,
  });
  await settle(page, 3200);
  report.steps.deliveryOn = { attrs: await stageAttrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-depth-1-delivery-on.png"),
    fullPage: false,
  });

  // Empty click overview
  await page.mouse.click(760, 520);
  await settle(page, 2200);
  report.steps.emptyClick = { attrs: await stageAttrs(page) };

  // Deep-Z OFF via query
  await page.goto("http://localhost:3000/executive?deepZ=0", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);
  await clickBudget(page);
  report.steps.budgetOff = { attrs: await stageAttrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-depth-1-budget-off.png"),
    fullPage: false,
  });

  fs.writeFileSync(
    path.join(OUT, "stage-depth-1-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  console.log("WROTE", path.join(OUT, "stage-depth-1-report.json"));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
