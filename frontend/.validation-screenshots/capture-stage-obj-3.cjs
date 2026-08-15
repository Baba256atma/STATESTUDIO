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
    "data-stage-label-contract",
    "data-stage-label-identity",
    "data-stage-label-version",
    "data-stage-label-visible-count",
    "data-stage-label-hidden-count",
    "data-stage-label-collision-count",
    "data-stage-label-overflow-count",
    "data-stage-primary-edge-count",
    "data-stage-secondary-edge-count",
    "data-stage-sector-compression",
    "data-stage-layout-overlap-count",
    "data-stage-object-presence",
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
  await settle(page, 1100);
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
    path: path.join(OUT, "stage-obj-3-overview.png"),
    fullPage: false,
  });

  await clickObject(page, "obj-revenue");
  report.steps.revenue = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-obj-3-revenue.png"),
    fullPage: false,
  });

  // Prefer a decision/scenario if present; else risk neighborhood.
  for (const id of ["obj-decision", "obj-scenario", "obj-risk"]) {
    const control = page.getByTestId(`nexora-stage-object-control-${id}`);
    if ((await control.count()) > 0) {
      await clickObject(page, id);
      report.steps.decisionOrScenario = { id, attrs: await attrs(page) };
      await page.screenshot({
        path: path.join(OUT, "stage-obj-3-decision-scenario.png"),
        fullPage: false,
      });
      break;
    }
  }

  // Operation presentation level if selector exists.
  const operation = page.getByTestId("nexora-presentation-state-operation");
  if ((await operation.count()) > 0) {
    await operation.click();
    await settle(page, 1000);
    report.steps.operation = { attrs: await attrs(page) };
    await page.screenshot({
      path: path.join(OUT, "stage-obj-3-operation.png"),
      fullPage: false,
    });
  } else {
    await page.screenshot({
      path: path.join(OUT, "stage-obj-3-operation.png"),
      fullPage: false,
    });
    report.steps.operation = { attrs: await attrs(page), note: "selector-missing" };
  }

  fs.writeFileSync(
    path.join(OUT, "stage-obj-3-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
