import { expect, type Page } from "@playwright/test";
export async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}
export async function viewport(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await settle(page);
  const measured = await page.evaluate(
    () => document.documentElement.clientWidth,
  );
  if (measured !== width) {
    const ratio = width / measured;
    await page.setViewportSize({
      width: Math.round(width * ratio),
      height: Math.round(height * ratio),
    });
  }
  await settle(page);
  expect(
    Math.abs(
      (await page.evaluate(() => document.documentElement.clientWidth)) - width,
    ),
  ).toBeLessThanOrEqual(1);
}
