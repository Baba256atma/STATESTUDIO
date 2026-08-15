const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname);

async function settle(page, ms = 900) {
  await page.waitForTimeout(ms);
}

async function motionAttrs(page) {
  const stage = page.getByTestId("nexora-3d-executive-stage");
  const bundleRaw = await stage.getAttribute("data-stage-motion-bundle");
  const keys = [
    "data-focused-object",
    "data-stage-anchor-object-id",
    "data-stage-anchor-position",
    "data-stage-motion-contract",
    "data-stage-motion-phase",
    "data-stage-motion-transition-id",
    "data-stage-motion-anchor",
    "data-stage-motion-progress",
    "data-stage-motion-target-count",
    "data-stage-motion-interrupted",
    "data-stage-motion-settled",
    "data-stage-motion-authority",
    "data-stage-motion-easing",
    "data-stage-motion-duration-ms",
    "data-stage-camera-mode",
    "data-stage-semantic-plane-z",
    "data-stage-layout-status",
    "data-stage-layout-overlap-count",
  ];
  const out = {};
  for (const key of keys) out[key] = await stage.getAttribute(key);
  if (bundleRaw) {
    try {
      const bundle = JSON.parse(bundleRaw);
      out["data-stage-motion-phase"] = bundle.phase;
      out["data-stage-motion-transition-id"] = String(bundle.transitionId);
      out["data-stage-motion-anchor"] = bundle.anchor;
      out["data-stage-motion-progress"] = bundle.progress;
      out["data-stage-motion-target-count"] = String(bundle.targetCount);
      out["data-stage-motion-interrupted"] = bundle.interrupted
        ? "true"
        : "false";
      out["data-stage-motion-settled"] = bundle.settled ? "true" : "false";
      out["data-stage-motion-bundle"] = bundleRaw;
    } catch {
      // keep individual attrs
    }
  }
  return out;
}

async function clickObject(page, id, waitMs = 700) {
  await page.getByTestId(`nexora-stage-object-control-${id}`).click({
    force: true,
  });
  await settle(page, waitMs);
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
  const report = { steps: {}, frames: [] };

  await page.goto("http://localhost:3000/executive?stageMotionTrace=1", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await settle(page, 2500);

  // Test A — Normal navigation
  await resetOverview(page);
  report.steps.overview = { attrs: await motionAttrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-motion-1-overview.png"),
    fullPage: false,
  });

  for (const id of [
    "obj-revenue",
    "obj-delivery",
    "obj-capacity",
    "obj-budget",
    "obj-customer",
  ]) {
    await clickObject(page, id, 900);
    const attrs = await motionAttrs(page);
    report.steps[id] = { attrs };
    await page.screenshot({
      path: path.join(OUT, `stage-motion-1-${id}.png`),
      fullPage: false,
    });
  }

  // Mid-transition frame sequence: Revenue → Delivery (capture in-flight)
  await resetOverview(page);
  await clickObject(page, "obj-revenue", 1000);
  await page.getByTestId("nexora-stage-object-control-obj-delivery").click({
    force: true,
  });
  for (let i = 0; i < 8; i += 1) {
    const attrs = await motionAttrs(page);
    report.frames.push({ i, attrs });
    await page.screenshot({
      path: path.join(OUT, `stage-motion-1-frame-${i}.png`),
      fullPage: false,
    });
    await settle(page, 55);
  }

  // Test B — Rapid navigation (snapshot mid-flight on final click)
  await resetOverview(page);
  await page.getByTestId("nexora-stage-object-control-obj-revenue").click({
    force: true,
  });
  await settle(page, 50);
  await page.getByTestId("nexora-stage-object-control-obj-delivery").click({
    force: true,
  });
  await settle(page, 50);
  await page.getByTestId("nexora-stage-object-control-obj-capacity").click({
    force: true,
  });
  await settle(page, 40);
  report.steps.rapidMid = { attrs: await motionAttrs(page) };
  await settle(page, 700);
  report.steps.rapid = { attrs: await motionAttrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-motion-1-rapid-capacity.png"),
    fullPage: false,
  });

  // Test C — Back / Forward
  const back = page.getByTestId("nexora-stage-step-back");
  const forward = page.getByTestId("nexora-stage-step-forward");
  if (await back.count()) {
    await back.click({ force: true });
    await settle(page, 700);
    report.steps.back = { attrs: await motionAttrs(page) };
    await page.screenshot({
      path: path.join(OUT, "stage-motion-1-back.png"),
      fullPage: false,
    });
  }
  if (await forward.count()) {
    await forward.click({ force: true });
    await settle(page, 700);
    report.steps.forward = { attrs: await motionAttrs(page) };
    await page.screenshot({
      path: path.join(OUT, "stage-motion-1-forward.png"),
      fullPage: false,
    });
  }

  // Test D — Overview reset
  await resetOverview(page);
  report.steps.overviewReset = { attrs: await motionAttrs(page) };
  await page.screenshot({
    path: path.join(OUT, "stage-motion-1-overview-reset.png"),
    fullPage: false,
  });

  fs.writeFileSync(
    path.join(OUT, "stage-motion-1-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  console.log("WROTE", path.join(OUT, "stage-motion-1-report.json"));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
