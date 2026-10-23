import { test, expect, type Locator } from "@playwright/test";
import { viewport } from "./support";

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});

test("emulated touch can change the scene, create a plan and open contact", async ({
  page,
}) => {
  // Calibrate native touch coordinates on a blank document. Windows WebKit
  // applies OS display scaling to input even after CSS viewport calibration.
  await viewport(page, 390, 844);
  await page.evaluate(() => {
    document.addEventListener(
      "pointerdown",
      (event) => {
        (
          window as unknown as { touchProbe: { x: number; y: number } }
        ).touchProbe = { x: event.clientX, y: event.clientY };
      },
      { once: true },
    );
  });
  await page.touchscreen.tap(100, 100);
  const probe = await page.evaluate(
    () =>
      (window as unknown as { touchProbe: { x: number; y: number } })
        .touchProbe,
  );
  expect(probe.x).toBeGreaterThan(0);
  expect(probe.y).toBeGreaterThan(0);
  const scale = { x: 100 / probe.x, y: 100 / probe.y };
  const tap = async (target: Locator) => {
    await expect(target).toBeVisible();
    await target.scrollIntoViewIfNeeded();
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(
      (box!.x + box!.width / 2) * scale.x,
      (box!.y + box!.height / 2) * scale.y,
    );
  };
  await page.goto("./");
  await viewport(page, 390, 844);
  await page.evaluate(() =>
    document.addEventListener("pointerdown", (event) => {
      (window as unknown as { lastPointer: string }).lastPointer =
        event.pointerType;
    }),
  );
  await tap(page.getByRole("button", { name: "BODY", exact: true }));
  await expect(page.locator(".cover")).toHaveClass(/side-body/);
  expect(
    await page.evaluate(
      () => (window as unknown as { lastPointer: string }).lastPointer,
    ),
  ).toBe("touch");
  await tap(
    page.getByRole("link", { name: "Составить план на неделю", exact: true }),
  );
  for (let k = 0; k < 3; k++)
    await tap(page.locator(".answer-list>button").first());
  await tap(page.getByRole("button", { name: "Собрать мой план" }));
  await expect(page.locator(".action-document")).toBeVisible();
  await tap(page.getByRole("button", { name: "Обсудить с Павлом" }));
  await expect(page.getByRole("dialog")).toBeVisible();
  await tap(page.getByRole("button", { name: "Закрыть", exact: true }));
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
