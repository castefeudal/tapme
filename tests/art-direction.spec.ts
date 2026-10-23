import { test } from "@playwright/test";
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Visual evidence once; interactions are tested in every engine.",
);
test("review every scene and real product frame", async ({ page }) => {
  test.setTimeout(180000);
  for (const width of [390, 1440])
    for (const lang of ["ru", "en"])
      for (const theme of ["dark", "light"]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto("./");
        if ((await page.locator("html").getAttribute("lang")) !== lang)
          await page
            .getByRole("button", {
              name: /Switch to English|Переключить на русский/,
            })
            .click();
        if ((await page.locator("html").getAttribute("data-theme")) !== theme)
          await page
            .getByRole("button", { name: /Сменить тему|Change theme/ })
            .click();
        await page.evaluate(() => document.fonts.ready);
        for (const mode of ["BODY", "MIND", "SYSTEM"]) {
          await page.getByRole("button", { name: mode, exact: true }).click();
          await page
            .locator(".cover img")
            .evaluate((img) => (img as HTMLImageElement).decode());
          // Capture the actual first viewport. Element screenshots can scroll
          // the cover beneath the sticky header and distort the visual evidence.
          await page.evaluate(() => {
            (document.activeElement as HTMLElement | null)?.blur();
            window.scrollTo({ top: 0, behavior: "instant" });
          });
          await page.screenshot({
            path: `docs/evidence/master-${width}-${lang}-${theme}-${mode}.png`,
          });
        }
      }
  // Keep each complete portrait frame and caption inside the capture viewport.
  await page.setViewportSize({ width: 390, height: 1500 });
  for (const [index, figure] of (
    await page.locator(".product-scenes").all()
  ).entries())
    for (let scene = 0; scene < 3; scene++) {
      await figure.locator(".capture-controls button").nth(scene).click();
      await figure
        .locator("img")
        .evaluate((img) => (img as HTMLImageElement).decode());
      await figure.screenshot({
        path: `docs/evidence/product-${index}-${scene}.png`,
      });
    }
});
