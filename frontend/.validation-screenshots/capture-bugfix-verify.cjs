const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = __dirname;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const logs = [];
  page.on("console", (m) => {
    const t = m.text();
    if (t.includes("NEXORA_FOCUS_LAYOUT_AUTHORITY") || t.includes("NEXORA_THREAD")) logs.push(t);
  });

  await page.goto("http://localhost:3000/executive?v=" + Date.now(), {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.waitForTimeout(3000);

  async function dump(label) {
    return page.evaluate((label) => {
      const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
      const attrs = stage
        ? {
            focused: stage.getAttribute("data-focused-object"),
            selected: stage.getAttribute("data-selected-object"),
            anchor: stage.getAttribute("data-choreography-anchor"),
            mode: stage.getAttribute("data-stage-mode"),
            depth: stage.getAttribute("data-presentation-state"),
          }
        : null;
      // Best-effort: scrape visible canvas-adjacent labels
      const texts = Array.from(document.querySelectorAll("canvas, [data-testid*='stage'] *"))
        .slice(0, 0);
      return { label, attrs };
    }, label);
  }

  // Delivery
  const deliveryBtn = page.getByTestId("nexora-stage-object-control-obj-delivery");
  await deliveryBtn.click();
  await page.waitForTimeout(3500);
  const delivery = await dump("delivery");
  await page.screenshot({ path: path.join(OUT, "A-Delivery-MINIMUM.png"), fullPage: false });

  // Budget
  if (await page.getByTestId("nexora-stage-reset").count()) {
    await page.getByTestId("nexora-stage-reset").click();
    await page.waitForTimeout(1500);
  }
  await page.getByTestId("nexora-stage-object-control-obj-budget").click();
  await page.waitForTimeout(3500);
  const budget = await dump("budget");
  await page.screenshot({ path: path.join(OUT, "B-Budget-MINIMUM.png"), fullPage: false });

  const report = { delivery, budget, logs };
  fs.writeFileSync(path.join(OUT, "bugfix-verify.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
