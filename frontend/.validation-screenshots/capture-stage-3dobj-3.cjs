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
    "data-stage-3dobj-form-contract",
    "data-stage-3dobj-form-enabled",
    "data-stage-3dobj-form-profile",
    "data-stage-3dobj-aspect-ratio",
    "data-stage-3dobj-front-scale",
    "data-stage-3dobj-taper",
    "data-stage-3dobj-recess-profile",
    "data-stage-3dobj-edge-profile",
    "data-stage-3dobj-symbol-kind",
    "data-stage-3dobj-symbol-scale",
    "data-stage-3dobj-symbol-visible",
    "data-stage-3dobj-territory-visible",
    "data-stage-3dobj-form-only",
    "data-stage-layout-overlap-count",
    "data-stage-label-owner-violation-count",
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

  // 1) Old form + symbol
  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&obj3dForm=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2500);
  await click(page, "obj-capacity");
  report.steps.capacityOld = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-3-capacity-old-form.png");

  // 2) Premium form + symbol
  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&obj3dForm=1",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2500);
  report.steps.overviewOn = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-3-overview-on.png");

  for (const id of [
    "obj-capacity",
    "obj-revenue",
    "obj-customer",
    "obj-delivery",
    "obj-inventory",
    "obj-risk",
  ]) {
    await click(page, id);
    const key = id.replace("obj-", "");
    report.steps[`${key}On`] = { attrs: await attrs(page) };
    await shot(page, `stage-3dobj-3-${key}-on.png`);
  }

  // Thread + subjects
  await click(page, "obj-capacity");
  const gateway = page.locator("[data-stage-thread-gateway-state='collapsed']");
  if (await gateway.count()) {
    await gateway.first().click({ force: true });
    await settle(page, 3000);
    report.steps.threadExpanded = { attrs: await attrs(page) };
    await shot(page, "stage-3dobj-3-thread-expanded-on.png");
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
      await shot(page, `stage-3dobj-3-${key}-on.png`);
    }
  }

  // 3) symbols OFF
  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&obj3dForm=1&obj3dSymbol=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2200);
  await click(page, "obj-capacity");
  report.steps.symbolsOff = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-3-symbols-off.png");

  // 4) labels OFF
  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&obj3dForm=1&labels=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2200);
  await click(page, "obj-capacity");
  report.steps.labelsOff = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-3-labels-off.png");

  // 5) territory OFF
  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&obj3dForm=1&obj3dTerritory=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2200);
  await click(page, "obj-capacity");
  report.steps.territoryOff = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-3-territory-off.png");

  // 6) form-only
  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&obj3dForm=1&obj3dFormOnly=1",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2200);
  await click(page, "obj-capacity");
  report.steps.formOnly = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-3-form-only.png");

  // Presentation levels
  for (const level of ["minimum", "report", "operation"]) {
    await page.goto(
      `http://localhost:3000/executive?objPresence=1&obj3dVisual=1&obj3dSurface=1&obj3dForm=1&presentation=${level}`,
      { waitUntil: "networkidle", timeout: 120000 },
    );
    await settle(page, 2000);
    await click(page, "obj-capacity");
    report.steps[`level_${level}`] = { attrs: await attrs(page) };
    await shot(page, `stage-3dobj-3-capacity-${level}.png`);
  }

  fs.writeFileSync(
    path.join(OUT, "stage-3dobj-3-report.json"),
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  console.log("STAGE-3DOBJ:3 capture complete");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
