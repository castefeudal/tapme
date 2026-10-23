import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('https://castefeudal.github.io/tapme/',{waitUntil:'networkidle'});
 await expect(page.locator('h1')).toContainText('ПАВЕЛ');
 await page.getByRole('button',{name:'SYSTEM',exact:true}).click();
 await expect(page.locator('.cover')).toHaveClass(/side-system/);
 await page.getByRole('link',{name:'Составить план на неделю',exact:true}).click();
 for(let k=0;k<3;k++)await page.locator('.answer-list>button').first().click();
 await page.getByRole('button',{name:'Собрать мой план'}).click();
 await expect(page.locator('.action-document')).toBeVisible();
 const file=page.waitForEvent('download');await page.getByRole('button',{name:'В календарь .ics'}).click();expect((await file).suggestedFilename()).toBe('markov-next-move.ics');
 await page.getByRole('button',{name:'Обсудить с Павлом'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Switch to English'}).click();await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('.social-pending')).toHaveCount(0);
 expect(errors).toEqual([]);
 console.log('Public Chromium smoke passed: hero, planner, ICS, contact, English, socials; no page errors.');
}finally{await browser.close();}
