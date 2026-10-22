import { test } from "@playwright/test";
test("visual review artifacts", async ({ page }, info) => {
  await page.goto("./");
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.images) {
      img.loading = "eager";
    }
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
  });
  for (const width of [320, 768, 1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    console.log(
      width,
      await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        offenders: [...document.querySelectorAll("*")]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return r.right > innerWidth + 1 || r.left < -1;
          })
          .map((e) => ({
            tag: e.tagName,
            cls: e.className,
            width: e.getBoundingClientRect().width,
            right: e.getBoundingClientRect().right,
          }))
          .slice(0, 12),
      })),
    );
    if (info.project.name === "chromium" && [1440, 390].includes(width))
      await page.screenshot({
        path: `docs/preview-${width}.png`,
        fullPage: true,
      });
  }
});
