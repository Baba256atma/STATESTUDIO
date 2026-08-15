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
    "data-stage-containment-status",
    "data-stage-clipped-object-count",
    "data-stage-boundary-violation-count",
    "data-stage-bottom-boundary-violation-count",
    "data-stage-reserved-region-collision-count",
    "data-stage-contained-object-count",
    "data-stage-related-count",
    "data-stage-layout-overlap-count",
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
  await settle(page, 1300);
}

async function resetOverview(page) {
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 900);
  }
}

async function setPresentation(page, state) {
  const button = page.getByRole("button", { name: new RegExp(`^${state}$`, "i") });
  if ((await button.count()) > 0) {
    await button.first().click();
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
    path: path.join(OUT, "stage-obj-4-fix-overview.png"),
    fullPage: false,
  });

  await clickObject(page, "obj-capacity");
  report.steps.capacity = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-4-fix-capacity.png"),
    fullPage: false,
  });

  for (const level of ["minimum", "report", "operation"]) {
    await setPresentation(page, level);
    report.steps[`capacity-${level}`] = { attrs: await attrs(page) };
    await page.screenshot({
      path: path.join(OUT, `stage-obj-4-fix-capacity-${level}.png`),
      fullPage: false,
    });
  }

  await setPresentation(page, "minimum");
  for (const id of ["obj-revenue", "obj-delivery", "obj-budget", "obj-risk"]) {
    await clickObject(page, id);
    report.steps[id] = { attrs: await attrs(page) };
    await page.screenshot({
      path: path.join(OUT, `stage-obj-4-fix-${id}.png`),
      fullPage: false,
    });
  }

  fs.writeFileSync(
    path.join(OUT, "stage-obj-4-fix-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
