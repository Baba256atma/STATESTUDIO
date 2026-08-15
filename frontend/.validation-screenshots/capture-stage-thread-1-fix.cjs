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
    "data-stage-thread-state",
    "data-stage-thread-anchor",
    "data-stage-thread-subject-count",
    "data-stage-thread-gateway-state",
    "data-stage-thread-gateway-count",
    "data-stage-thread-gateway-visible",
    "data-stage-thread-gateway-x",
    "data-stage-thread-gateway-y",
    "data-stage-thread-gateway-hit-target",
    "data-stage-thread-gateway-overlap-count",
    "data-stage-thread-gateway-clipped",
    "data-stage-thread-gateway-reserved-collision-count",
    "data-stage-thread-gateway-contract",
    "data-stage-clipped-object-count",
    "data-stage-layout-overlap-count",
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
  const gateway = page.getByTestId(`nexora-thread-gateway-${threadId}`);
  if ((await control.count()) > 0) {
    await control.click({ force: true });
  } else if ((await gateway.count()) > 0) {
    await gateway.click({ force: true });
  } else {
    await page.evaluate((id) => {
      const el = document.querySelector(`[data-context-subject="${id}"]`);
      if (el) el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }, threadId);
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

  await clickObject(page, "obj-capacity");
  report.steps.capacityCollapsed = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-thread-1-fix-capacity-collapsed.png"),
    fullPage: false,
  });

  await clickThread(page, "obj-capacity");
  report.steps.capacityExpanded = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-thread-1-fix-capacity-expanded.png"),
    fullPage: false,
  });

  await clickThread(page, "obj-capacity");
  report.steps.capacityCollapsedAgain = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-thread-1-fix-capacity-collapsed-again.png"),
    fullPage: false,
  });

  await clickObject(page, "obj-revenue");
  report.steps.revenueCollapsed = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-thread-1-fix-revenue-collapsed.png"),
    fullPage: false,
  });

  await clickThread(page, "obj-revenue");
  report.steps.revenueExpanded = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-thread-1-fix-revenue-expanded.png"),
    fullPage: false,
  });

  await resetOverview(page);
  await clickObject(page, "obj-capacity");
  for (const level of ["minimum", "report", "operation"]) {
    await setPresentation(page, level);
    report.steps[`capacity-${level}`] = { attrs: await attrs(page) };
    await page.screenshot({
      path: path.join(OUT, `stage-thread-1-fix-capacity-${level}.png`),
      fullPage: false,
    });
  }

  fs.writeFileSync(
    path.join(OUT, "stage-thread-1-fix-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
