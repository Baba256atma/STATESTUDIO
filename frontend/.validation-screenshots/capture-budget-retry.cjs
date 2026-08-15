const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname);
async function settle(page, ms=3000){ await page.waitForTimeout(ms); }
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const logs = [];
  page.on("console", (m) => {
    const t = m.text();
    if (t.includes("NEXORA_FOCUS_LAYOUT_AUTHORITY") || t.includes("focused")) logs.push(t);
  });
  await page.goto("http://localhost:3000/executive", { waitUntil: "networkidle", timeout: 120000 });
  await settle(page, 2500);
  const reset = page.getByTestId("nexora-stage-reset");
  if (await reset.count()) { await reset.click(); await settle(page, 1200); }

  const budgetBtn = page.getByTestId("nexora-stage-object-control-obj-budget");
  console.log("budget visible", await budgetBtn.isVisible());
  console.log("budget text", await budgetBtn.innerText());
  await budgetBtn.click({ force: true });
  await settle(page, 3500);

  const stage = page.getByTestId("nexora-3d-executive-stage");
  const attrs = {
    focused: await stage.getAttribute("data-focused-object"),
    selected: await stage.getAttribute("data-selected-object"),
    mode: await stage.getAttribute("data-stage-mode"),
    presentation: await stage.getAttribute("data-presentation-state"),
    a11y: await page.getByTestId("nexora-stage-a11y").innerText(),
  };
  // Which list items are data-focused?
  const focusedControls = await page.locator('[data-testid^="nexora-stage-object-control-"][data-focused="true"]').evaluateAll(els => els.map(e => e.getAttribute("data-testid")));
  const selectedControls = await page.locator('[data-testid^="nexora-stage-object-control-"][data-selected="true"], [data-testid^="nexora-stage-object-control-"][aria-pressed="true"]').evaluateAll(els => els.map(e => e.getAttribute("data-testid")));
  await page.screenshot({ path: path.join(OUT, "B2-Budget-retry.png"), fullPage: false });
  const report = { attrs, focusedControls, selectedControls, logs: logs.slice(-10) };
  fs.writeFileSync(path.join(OUT, "budget-retry.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
