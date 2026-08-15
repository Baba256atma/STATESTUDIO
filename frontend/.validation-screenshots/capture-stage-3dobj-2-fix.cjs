const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname);

async function settle(page, ms = 2600) {
  await page.waitForTimeout(ms);
}

async function attrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  const keys = [
    "data-focused-object",
    "data-stage-3dobj-face-calibration",
    "data-stage-3dobj-face-readability",
    "data-stage-3dobj-symbol-kind",
    "data-stage-3dobj-symbol-scale",
    "data-stage-3dobj-symbol-body-ratio",
    "data-stage-3dobj-symbol-contrast",
    "data-stage-3dobj-territory-dominance",
    "data-stage-3dobj-surface-enabled",
    "data-stage-layout-overlap-count",
    "data-stage-label-owner-violation-count",
    "data-stage-label-body-overlap-count",
  ];
  const out = {};
  for (const key of keys) out[key] = await stage.getAttribute(key);
  return out;
}

async function click(page, id) {
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) {
    await reset.click();
    await settle(page, 700);
  }
  await page.getByTestId(`nexora-stage-object-control-${id}`).click({
    force: true,
  });
  await settle(page, 2800);
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
  await shot(page, "stage-3dobj-2-fix-overview-on.png");

  for (const id of [
    "obj-capacity",
    "obj-revenue",
    "obj-customer",
    "obj-inventory",
    "obj-risk",
  ]) {
    await click(page, id);
    const key = id.replace("obj-", "");
    report.steps[`${key}On`] = { attrs: await attrs(page) };
    await shot(page, `stage-3dobj-2-fix-${key}-on.png`);
  }

  await click(page, "obj-capacity");
  const gateway = page.locator("[data-stage-thread-gateway-state='collapsed']");
  if (await gateway.count()) {
    await gateway.first().click({ force: true });
    await settle(page, 3000);
    report.steps.threadExpanded = { attrs: await attrs(page) };
    await shot(page, "stage-3dobj-2-fix-thread-expanded-on.png");
  }
  for (const id of [
    "obj-problem",
    "obj-scenario",
    "obj-decision",
    "obj-execution",
  ]) {
    const control = page.getByTestId(`nexora-stage-object-control-${id}`);
    if (await control.count()) {
      await control.click({ force: true });
      await settle(page, 2400);
      const key = id.replace("obj-", "");
      report.steps[`${key}On`] = { attrs: await attrs(page) };
      await shot(page, `stage-3dobj-2-fix-${key}-on.png`);
    }
  }

  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&labels=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2500);
  report.steps.labelsOff = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-fix-labels-off.png");

  for (const level of ["minimum", "report", "operation"]) {
    await page.goto(
      "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1",
      { waitUntil: "networkidle", timeout: 120000 },
    );
    await settle(page, 1600);
    const levelBtn = page.getByTestId(`nexora-presentation-option-${level}`);
    if (await levelBtn.count()) await levelBtn.click({ force: true });
    await settle(page, 900);
    await click(page, "obj-capacity");
    report.steps[`capacity_${level}`] = { attrs: await attrs(page) };
    await shot(page, `stage-3dobj-2-fix-capacity-${level}.png`);
  }

  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2500);
  report.steps.overviewOff = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-fix-overview-off.png");
  await click(page, "obj-capacity");
  report.steps.capacityOff = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-2-fix-capacity-off.png");

  fs.writeFileSync(
    path.join(OUT, "stage-3dobj-2-fix-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
