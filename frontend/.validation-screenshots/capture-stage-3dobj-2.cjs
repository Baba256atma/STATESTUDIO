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
    "data-stage-3dobj-surface-contract",
    "data-stage-3dobj-surface-enabled",
    "data-stage-3dobj-symbol-kind",
    "data-stage-3dobj-surface-role",
    "data-stage-3dobj-symbol-depth",
    "data-stage-3dobj-symbol-scale",
    "data-stage-3dobj-face-inset",
    "data-stage-3dobj-kind",
    "data-stage-3dobj-profile",
    "data-stage-layout-overlap-count",
    "data-stage-camera-mode",
    "data-stage-semantic-plane-z",
  ];
  const out = {};
  for (const key of keys) out[key] = await stage.getAttribute(key);
  return out;
}

async function click(page, id) {
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 800);
  }
  await page.getByTestId(`nexora-stage-object-control-${id}`).click({
    force: true,
  });
  await settle(page, 3000);
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const report = { steps: {} };

  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2500);
  report.steps.overviewOn = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-overview-on.png");

  await click(page, "obj-capacity");
  report.steps.capacityOn = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-capacity-on.png");

  await click(page, "obj-risk");
  report.steps.riskOn = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-risk-on.png");

  await click(page, "obj-capacity");
  const gateway = page.locator("[data-stage-thread-gateway-state='collapsed']");
  if (await gateway.count()) {
    await gateway.first().click({ force: true });
    await settle(page, 3200);
    report.steps.threadExpanded = { attrs: await attrs(page) };
    await shot(page, "stage-3dobj-2-thread-expanded-on.png");
  }

  for (const id of [
    "obj-problem",
    "obj-scenario",
    "obj-decision",
    "obj-execution",
    "obj-goal",
  ]) {
    const control = page.getByTestId(`nexora-stage-object-control-${id}`);
    if (await control.count()) {
      await control.click({ force: true });
      await settle(page, 2600);
      const key = id.replace("obj-", "");
      report.steps[`${key}On`] = { attrs: await attrs(page) };
      await shot(page, `stage-3dobj-2-${key}-on.png`);
    }
  }

  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&labels=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2500);
  await click(page, "obj-capacity");
  report.steps.labelsOffCapacity = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-labels-off-capacity.png");
  await click(page, "obj-risk");
  report.steps.labelsOffRisk = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-labels-off-risk.png");

  for (const level of ["minimum", "report", "operation"]) {
    await page.goto(
      "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1",
      { waitUntil: "networkidle", timeout: 120000 },
    );
    await settle(page, 1800);
    const levelBtn = page.getByTestId(`nexora-presentation-option-${level}`);
    if (await levelBtn.count()) await levelBtn.click({ force: true });
    await settle(page, 1000);
    await click(page, "obj-capacity");
    report.steps[`capacity_${level}`] = { attrs: await attrs(page) };
    await shot(page, `stage-3dobj-2-capacity-${level}.png`);
  }

  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2500);
  await click(page, "obj-capacity");
  report.steps.capacityOff = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-capacity-off.png");

  await click(page, "obj-revenue");
  report.steps.revenueOn = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-revenue-surface-compare.png");

  fs.writeFileSync(
    path.join(OUT, "stage-3dobj-2-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
