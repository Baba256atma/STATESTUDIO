const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname);

async function settle(page, ms = 2800) {
  await page.waitForTimeout(ms);
}

async function attrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  const keys = [
    "data-focused-object",
    "data-stage-anchor-object-id",
    "data-stage-advisor-object-id",
    "data-stage-object-3d-enabled",
    "data-stage-object-geometry",
    "data-stage-semantic-plane-z",
    "data-stage-layout-overlap-count",
    "data-stage-depth-environment",
    "data-stage-camera-mode",
  ];
  const out = {};
  for (const key of keys) out[key] = await stage.getAttribute(key);
  return out;
}

async function click(page, id) {
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 900);
  }
  await page.getByTestId(`nexora-stage-object-control-${id}`).click({
    force: true,
  });
  await settle(page, 3200);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const report = { steps: {} };

  await page.goto("http://localhost:3000/executive", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);
  await click(page, "obj-budget");
  report.steps.budgetOn = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-1-budget-on.png"),
    fullPage: false,
  });

  await click(page, "obj-delivery");
  report.steps.deliveryOn = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-1-delivery-on.png"),
    fullPage: false,
  });

  await page.goto("http://localhost:3000/executive?obj3d=0", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);
  await click(page, "obj-budget");
  report.steps.budgetOff = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-1-budget-off.png"),
    fullPage: false,
  });

  fs.writeFileSync(
    path.join(OUT, "stage-obj-1-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  console.log("WROTE", path.join(OUT, "stage-obj-1-report.json"));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
