import { test, expect } from "@playwright/test";
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Visual evidence captured once; functional tests cover all engines.",
);
test("review matrix: viewports, themes, languages and expanded states", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const lang of ["ru", "en"])
    for (const theme of ["dark", "light"])
      for (const width of [1440, 768, 390, 320]) {
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
        await page.locator("#next").scrollIntoViewIfNeeded();
        await page.locator(".move-workspace").waitFor();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.evaluate(async () => {
          await document.fonts.ready;
          for (const img of document.images) img.loading = "eager";
          await Promise.all(
            [...document.images].map((img) => img.decode().catch(() => {})),
          );
        });
        await page.screenshot({
          path: `docs/evidence/after-${width}-${lang}-${theme}.png`,
          fullPage: true,
        });
        expect(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          ),
        ).toBeLessThanOrEqual(1);
      }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  // Isolated component captures should not include the unrelated sticky header.
  await page.addStyleTag({ content: ".site-header { position: static; }" });
  if ((await page.locator("html").getAttribute("lang")) !== "ru")
    await page.getByRole("button", { name: "Переключить на русский" }).click();
  await page.locator("#next").scrollIntoViewIfNeeded();
  const workspace = page.locator(".move-workspace");
  for (let k = 0; k < 3; k++)
    await workspace.locator(".answer-list>button").nth(2).click();
  await workspace.screenshot({ path: "docs/evidence/question-resource.png" });
  await workspace.getByRole("button", { name: "Собрать мой план" }).click();
  await workspace
    .locator(".action-document")
    .screenshot({ path: "docs/evidence/personal-action-card.png" });
  await workspace.getByRole("button", { name: "Обсудить с Павлом" }).click();
  await page
    .getByRole("dialog")
    .screenshot({ path: "docs/evidence/contact-panel.png" });
});
