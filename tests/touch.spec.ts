import { test, expect } from "@playwright/test";
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
  await page.goto("./");
  await viewport(page, 390, 844);
  await page.evaluate(() =>
    document.addEventListener("pointerdown", (event) => {
      (window as unknown as { lastPointer: string }).lastPointer =
        event.pointerType;
    }),
  );
  await page.getByRole("button", { name: "BODY", exact: true }).tap();
  await expect(page.locator(".cover")).toHaveClass(/side-body/);
  expect(
    await page.evaluate(
      () => (window as unknown as { lastPointer: string }).lastPointer,
    ),
  ).toBe("touch");
  await page
    .getByRole("link", { name: "Составить план на неделю", exact: true })
    .tap();
  for (let k = 0; k < 3; k++)
    await page.locator(".answer-list>button").first().tap();
  await page.getByRole("button", { name: "Собрать мой план" }).tap();
  await expect(page.locator(".action-document")).toBeVisible();
  await page.getByRole("button", { name: "Обсудить с Павлом" }).tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  const close=page.getByRole("button", { name: "Закрыть", exact: true });
  await close.scrollIntoViewIfNeeded();
  console.log('close-target', await close.evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.outerHTML.slice(0,180),dpr:devicePixelRatio,viewport:[innerWidth,innerHeight],visual:[visualViewport?.width,visualViewport?.height]};}));
  await page.screenshot({path:'docs/evidence/touch-contact-debug.png'});
  await close.tap({timeout:5000});
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
