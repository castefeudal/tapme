console.log("Loading Lighthouse runtime");
const { default: lighthouse } = await import("lighthouse");
console.log("Lighthouse runtime ready");
const { launch } = await import("chrome-launcher");
const { chromium } = await import("@playwright/test");
import { writeFile, mkdir } from "node:fs/promises";
await mkdir("docs/performance", { recursive: true });
const summary = [];
for (const mode of ["mobile", "desktop"])
  for (let run = 1; run <= 3; run++) {
    console.log(`Starting ${mode} ${run}`);
    const chrome = await launch({
      chromePath: chromium.executablePath(),
      chromeFlags: [
        "--headless=new",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
      ],
    });
    try {
      const result = await lighthouse(
        process.env.LIGHTHOUSE_URL || "http://127.0.0.1:4173/tapme/",
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: [
            "performance",
            "accessibility",
            "best-practices",
            "seo",
          ],
          ...(mode === "desktop"
            ? {
                formFactor: "desktop",
                screenEmulation: {
                  mobile: false,
                  width: 1440,
                  height: 900,
                  deviceScaleFactor: 1,
                  disabled: false,
                },
                throttling: {
                  rttMs: 40,
                  throughputKbps: 10240,
                  cpuSlowdownMultiplier: 1,
                  requestLatencyMs: 0,
                  downloadThroughputKbps: 0,
                  uploadThroughputKbps: 0,
                },
              }
            : {}),
        },
      );
      if (!result) throw Error("No Lighthouse result");
      await writeFile(`docs/performance/${mode}-${run}.json`, result.report);
      const lhr = result.lhr;
      const record = {
        mode,
        run,
        scores: Object.fromEntries(
          Object.entries(lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
        LCP: lhr.audits["largest-contentful-paint"].numericValue,
        CLS: lhr.audits["cumulative-layout-shift"].numericValue,
        TBT: lhr.audits["total-blocking-time"].numericValue,
        failed: Object.values(lhr.audits)
          .filter(
            (a) =>
              a.score !== null &&
              a.score < 0.9 &&
              a.scoreDisplayMode === "binary",
          )
          .map((a) => ({
            id: a.id,
            title: a.title,
            description: a.description.slice(0, 150),
          })),
      };
      summary.push(record);
      console.log(JSON.stringify(record));
      await writeFile(
        "docs/performance/summary.json",
        JSON.stringify(summary, null, 2),
      );
    } finally {
      await chrome.kill();
    }
  }
