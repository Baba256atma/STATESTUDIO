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
    "data-stage-thread-problem-count",
    "data-stage-thread-scenario-count",
    "data-stage-thread-decision-count",
    "data-stage-thread-execution-count",
    "data-stage-thread-selected-subject",
    "data-stage-thread-orphan-label-count",
    "data-stage-thread-clipped-object-count",
    "data-stage-thread-overlap-count",
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
  if ((await control.count()) > 0) {
    await control.click({ force: true });
  } else {
    // Fallback: canvas context node may only expose subject via object control.
    await page.evaluate((id) => {
      const el = document.querySelector(`[data-subject-id="${id}"]`);
      if (el) el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }, threadId);
  }
  await settle(page, 1400);
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
    path: path.join(OUT, "stage-thread-1-capacity-collapsed.png"),
    fullPage: false,
  });

  await clickThread(page, "obj-capacity");
  report.steps.capacityExpanded = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-thread-1-capacity-expanded.png"),
    fullPage: false,
  });

  for (const id of [
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
    "ctx-execution-capacity",
  ]) {
    await clickObject(page, id);
    report.steps[id] = { attrs: await attrs(page) };
    await page.screenshot({
      path: path.join(OUT, `stage-thread-1-${id}.png`),
      fullPage: false,
    });
  }

  await clickThread(page, "obj-capacity");
  report.steps.capacityCollapsedAgain = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-thread-1-capacity-collapsed-again.png"),
    fullPage: false,
  });

  await clickObject(page, "obj-revenue");
  report.steps.revenue = { attrs: await attrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-thread-1-revenue.png"),
    fullPage: false,
  });

  fs.writeFileSync(
    path.join(OUT, "stage-thread-1-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
