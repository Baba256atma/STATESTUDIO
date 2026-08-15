const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname);

async function settle(page, ms = 900) {
  await page.waitForTimeout(ms);
}

async function attrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  const keys = [
    "data-focused-object",
    "data-stage-anchor-object-id",
    "data-stage-anchor-position",
    "data-stage-object-presence",
    "data-stage-object-presence-enabled",
    "data-stage-object-presence-query",
    "data-stage-object-3d-enabled",
    "data-stage-layout-overlap-count",
    "data-stage-layout-min-gap",
    "data-stage-layout-status",
    "data-stage-camera-mode",
    "data-stage-semantic-plane-z",
    "data-stage-depth-environment",
  ];
  const out = {};
  for (const key of keys) out[key] = await stage.getAttribute(key);
  return out;
}

async function clickObject(page, id) {
  await page.getByTestId(`nexora-stage-object-control-${id}`).click({
    force: true,
  });
  await settle(page, 1000);
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

  // Presence V2 ON
  await page.goto("http://localhost:3000/executive?objPresence=1", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);
  await resetOverview(page);
  report.steps.overviewV2 = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-2-overview.png"),
    fullPage: false,
  });

  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-budget",
    "obj-delivery",
    "obj-risk",
    "obj-customer",
  ]) {
    await clickObject(page, id);
    report.steps[`${id}-v2`] = { attrs: await attrs(page) };
    await page.screenshot({
      path: path.join(OUT, `stage-obj-2-${id}.png`),
      fullPage: false,
    });
  }

  // Labels-off compare via CSS injection
  await page.addStyleTag({
    content: `
      [data-testid^="nexora-stage-object-label-"] { visibility: hidden !important; opacity: 0 !important; }
    `,
  });
  await clickObject(page, "obj-revenue");
  await page.screenshot({
    path: path.join(OUT, "stage-obj-2-labels-off-revenue.png"),
    fullPage: false,
  });
  await clickObject(page, "obj-risk");
  await page.screenshot({
    path: path.join(OUT, "stage-obj-2-labels-off-risk.png"),
    fullPage: false,
  });

  // Presence V1 OFF compare
  await page.goto("http://localhost:3000/executive?objPresence=0", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.reload({ waitUntil: "networkidle" });
  await settle(page, 2500);
  report.steps.revenueV1Location = await page.evaluate(() => window.location.href);
  await clickObject(page, "obj-revenue");
  report.steps.revenueV1 = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-2-revenue-v1.png"),
    fullPage: false,
  });

  fs.writeFileSync(
    path.join(OUT, "stage-obj-2-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  console.log("WROTE", path.join(OUT, "stage-obj-2-report.json"));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
