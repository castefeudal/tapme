import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
await mkdir('docs/evidence',{recursive:true});
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4174/tapme/');await page.evaluate(()=>document.fonts.ready);
 for(const mode of ['BODY','SYSTEM']){await page.getByRole('button',{name:mode,exact:true}).click();await page.locator('.cover img').evaluate(i=>i.decode());await page.locator('.cover').screenshot({path:`docs/evidence/signature-${mode.toLowerCase()}.png`});}
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'MIND',exact:true}).click();
 await page.locator('#next').scrollIntoViewIfNeeded();
 for(let k=0;k<3;k++)await page.locator('.answer-list>button').first().click();
 await page.getByRole('button',{name:'Собрать мой план'}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Сохранить PNG'}).click();await(await download).saveAs('docs/evidence/export-plan.png');
 await page.locator('.action-document').screenshot({path:'docs/evidence/signature-plan.png'});
 await page.locator('.social-panel.expanded').screenshot({path:'docs/evidence/signature-socials.png'});
}finally{await browser.close();}
