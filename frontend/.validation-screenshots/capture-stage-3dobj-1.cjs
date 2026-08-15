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
    "data-stage-3dobj-contract",
    "data-stage-3dobj-enabled",
    "data-stage-3dobj-kind",
    "data-stage-3dobj-depth",
    "data-stage-3dobj-bevel",
    "data-stage-3dobj-profile",
    "data-stage-3dobj-material-role",
    "data-stage-3dobj-front-z",
    "data-stage-3dobj-back-z",
    "data-stage-object-3d-enabled",
    "data-stage-semantic-plane-z",
    "data-stage-layout-overlap-count",
    "data-stage-camera-mode",
    "data-stage-depth-environment",
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

async function shot(page, name) {
  await page.screenshot({
    path: path.join(OUT, name),
    fullPage: false,
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const report = { steps: {} };

  // ── ON (default visual foundation) ──────────────────────────────────────
  await page.goto("http://localhost:3000/executive?objPresence=1&obj3dVisual=1", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);
  report.steps.overviewOn = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-1-overview-on.png");

  await click(page, "obj-capacity");
  report.steps.capacityOn = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-1-capacity-on.png");

  await click(page, "obj-risk");
  report.steps.riskOn = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-1-risk-on.png");

  // Decision / Scenario / Problem / Execution via thread if available
  const threadExpand = page.getByTestId("nexora-stage-thread-expand");
  const threadGateway = page.locator("[data-stage-thread-gateway-state='collapsed']");
  if (await threadGateway.count()) {
    await threadGateway.first().click({ force: true });
    await settle(page, 3200);
    report.steps.threadExpandedOn = { attrs: await attrs(page) };
    await shot(page, "stage-3dobj-1-thread-expanded-on.png");
  } else if (await threadExpand.count()) {
    await threadExpand.first().click({ force: true });
    await settle(page, 3200);
    report.steps.threadExpandedOn = { attrs: await attrs(page) };
    await shot(page, "stage-3dobj-1-thread-expanded-on.png");
  }

  for (const id of [
    "obj-decision",
    "obj-scenario",
    "obj-problem",
    "obj-execution",
    "obj-goal",
  ]) {
    const control = page.getByTestId(`nexora-stage-object-control-${id}`);
    if (await control.count()) {
      await control.click({ force: true });
      await settle(page, 2800);
      const key = id.replace("obj-", "");
      report.steps[`${key}On`] = { attrs: await attrs(page) };
      await shot(page, `stage-3dobj-1-${key}-on.png`);
    }
  }

  // Labels OFF comparison
  await page.goto(
    "http://localhost:3000/executive?objPresence=1&obj3dVisual=1&labels=0",
    { waitUntil: "networkidle", timeout: 120000 },
  );
  await settle(page, 2500);
  await click(page, "obj-capacity");
  report.steps.labelsOffCapacity = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-1-labels-off-capacity.png");
  await click(page, "obj-risk");
  report.steps.labelsOffRisk = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-1-labels-off-risk.png");

  // Presentation levels via UI control
  for (const level of ["minimum", "report", "operation"]) {
    await page.goto(
      "http://localhost:3000/executive?objPresence=1&obj3dVisual=1",
      { waitUntil: "networkidle", timeout: 120000 },
    );
    await settle(page, 2000);
    const levelBtn = page.getByTestId(`nexora-presentation-option-${level}`);
    if (await levelBtn.count()) {
      await levelBtn.click({ force: true });
    } else {
      const byText = page.getByRole("button", {
        name: new RegExp(level, "i"),
      });
      if (await byText.count()) await byText.first().click({ force: true });
    }
    await settle(page, 1200);
    await click(page, "obj-capacity");
    report.steps[`capacity_${level}`] = { attrs: await attrs(page) };
    await shot(page, `stage-3dobj-1-capacity-${level}.png`);
  }

  // ── OFF (basic STAGE-OBJ:1 slabs) ───────────────────────────────────────
  await page.goto("http://localhost:3000/executive?objPresence=1&obj3dVisual=0", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);
  await click(page, "obj-capacity");
  report.steps.capacityOff = { attrs: await attrs(page) };
  await shot(page, "stage-3dobj-1-capacity-off.png");

  fs.writeFileSync(
    path.join(OUT, "stage-3dobj-1-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
