const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname);

async function settle(page, ms = 1100) {
  await page.waitForTimeout(ms);
}

async function attrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  const keys = [
    "data-focused-object",
    "data-stage-label-contract",
    "data-stage-label-visible-count",
    "data-stage-label-hidden-count",
    "data-stage-label-collision-count",
    "data-stage-label-body-overlap-count",
    "data-stage-label-owner-violation-count",
    "data-stage-label-reserved-collision-count",
    "data-stage-label-clipped-count",
    "data-stage-layout-overlap-count",
    "data-stage-clipped-object-count",
    "data-stage-thread-gateway-visible",
  ];
  const out = {};
  for (const key of keys) out[key] = await stage.getAttribute(key);
  return out;
}

async function clickObject(page, id) {
  await page.getByTestId(`nexora-stage-object-control-${id}`).click({
    force: true,
  });
  await settle(page, 1300);
}

async function clickThread(page, anchorId) {
  const threadId = `thread-${anchorId}`;
  const control = page.getByTestId(`nexora-stage-context-control-${threadId}`);
  if ((await control.count()) > 0) {
    await control.click({ force: true });
  }
  await settle(page, 1400);
}

async function setPresentation(page, level) {
  const btn = page.getByTestId(`nexora-presentation-state-${level}`);
  if ((await btn.count()) > 0) {
    await btn.click({ force: true });
    await settle(page, 900);
  }
}

async function resetOverview(page) {
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 900);
  }
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
    path: path.join(OUT, "stage-label-1-overview.png"),
    fullPage: false,
  });

  await clickObject(page, "obj-capacity");
  for (const level of ["minimum", "report", "operation"]) {
    await setPresentation(page, level);
    report.steps[`capacity-${level}`] = { attrs: await attrs(page) };
    await page.screenshot({
      path: path.join(OUT, `stage-label-1-capacity-${level}.png`),
      fullPage: false,
    });
  }

  await setPresentation(page, "minimum");
  report.steps.capacityCustomerRisk = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-label-1-capacity-customer-risk.png"),
    fullPage: false,
  });

  await page.screenshot({
    path: path.join(OUT, "stage-label-1-capacity-inventory.png"),
    fullPage: false,
  });

  await clickThread(page, "obj-capacity");
  report.steps.capacityExpanded = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-label-1-capacity-thread-expanded.png"),
    fullPage: false,
  });

  await clickThread(page, "obj-capacity");
  await clickObject(page, "obj-revenue");
  report.steps.revenue = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-label-1-revenue.png"),
    fullPage: false,
  });

  fs.writeFileSync(
    path.join(OUT, "stage-label-1-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
